"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  endCompanionSession,
  sendCompanionMessage,
  startCompanionSession,
  synthesizeCompanionSpeech,
  transcribeCompanionAudio,
} from "@/lib/companion-doctor/api";
import {
  CompanionConversationItem,
  CompanionLanguage,
  CompanionMode,
  CompanionStatus,
} from "@/types/companion-doctor";

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
    length: number;
  }>;
};

type BrowserVoiceWindow = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
  webkitAudioContext?: typeof AudioContext;
};

const AUDIO_THRESHOLD = 0.035;
const SILENCE_WINDOW_MS = 520;
const MIN_SPEECH_MS = 250;
const VOICE_TURN_COMMIT_DELAY_MS = 650;

function mergeVoiceSegments(...segments: string[]) {
  return segments
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function createConversationItem(role: "assistant" | "user", text: string, language: string): CompanionConversationItem {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    language,
  };
}

function getBrowserVoiceWindow() {
  return window as BrowserVoiceWindow;
}

function getSpeechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  const browserWindow = getBrowserVoiceWindow();
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

function getRecordingMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? "";
}

function recognitionLanguage(language: CompanionLanguage) {
  if (language === "hi") return "hi-IN";
  return "en-IN";
}

function mapCompanionStartupError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to start the companion right now.";
  if (message === "Not Found") {
    return "The companion service is not available on the current backend deployment yet. Please deploy the latest backend and try again.";
  }
  return message;
}

export function useCompanionDoctor(initialMode: CompanionMode) {
  const [mode, setMode] = useState<CompanionMode>(initialMode);
  const [status, setStatus] = useState<CompanionStatus>("idle");
  const [languagePreference, setLanguagePreference] = useState<CompanionLanguage>("auto");
  const [detectedLanguage, setDetectedLanguage] = useState<CompanionLanguage>("auto");
  const [conversation, setConversation] = useState<CompanionConversationItem[]>([]);
  const [draftTranscript, setDraftTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remainingTurns, setRemainingTurns] = useState<number | null>(null);
  const [privacyNote, setPrivacyNote] = useState("Your conversation is not stored");
  const [nonEmergencyNotice, setNonEmergencyNotice] = useState("Not for emergencies.");
  const [error, setError] = useState<string | null>(null);
  const [editBeforeSend, setEditBeforeSend] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [accessLocked, setAccessLocked] = useState(false);
  const [upgradeUrl, setUpgradeUrl] = useState("/pricing");

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioObjectUrlRef = useRef<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingRef = useRef(false);
  const recordingStartedAtRef = useRef(0);
  const lastVoiceAtRef = useRef(0);
  const sessionIdRef = useRef<string | null>(null);
  const statusRef = useRef<CompanionStatus>("idle");
  const modeRef = useRef<CompanionMode>(initialMode);
  const sendUserTextRef = useRef<(text: string, channel: CompanionMode) => Promise<void>>(async () => {});
  const voiceCommitTimeoutRef = useRef<number | null>(null);
  const pendingVoiceSegmentsRef = useRef<string[]>([]);
  const pendingVoiceLanguageRef = useRef<CompanionLanguage>("auto");
  const liveVoiceSegmentRef = useRef("");
  const transcriptionJobsRef = useRef(0);
  const voiceInputGenerationRef = useRef(0);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const clearVoiceCommitTimeout = useCallback(() => {
    if (voiceCommitTimeoutRef.current !== null) {
      window.clearTimeout(voiceCommitTimeoutRef.current);
      voiceCommitTimeoutRef.current = null;
    }
  }, []);

  const clearPendingVoiceTurn = useCallback((clearDraft: boolean, invalidateAsync = false) => {
    clearVoiceCommitTimeout();
    pendingVoiceSegmentsRef.current = [];
    pendingVoiceLanguageRef.current = "auto";
    liveVoiceSegmentRef.current = "";
    if (invalidateAsync) {
      transcriptionJobsRef.current = 0;
      voiceInputGenerationRef.current += 1;
    }
    setLiveTranscript("");
    if (clearDraft) {
      setDraftTranscript("");
    }
  }, [clearVoiceCommitTimeout]);

  const pushConversationItem = useCallback((role: "assistant" | "user", text: string, language: string) => {
    setConversation((current) => [...current, createConversationItem(role, text, language)]);
  }, []);

  const stopRecognition = useCallback(() => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.onend = null;
      speechRecognitionRef.current.onresult = null;
      speechRecognitionRef.current.onerror = null;
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback((returnToListening: boolean) => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if (audioObjectUrlRef.current) {
      URL.revokeObjectURL(audioObjectUrlRef.current);
      audioObjectUrlRef.current = null;
    }
    if (returnToListening && mediaStreamRef.current) {
      setStatus("listening");
    } else if (statusRef.current === "speaking") {
      setStatus("idle");
    }
  }, []);

  const releaseAudioLoop = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const releaseMicrophone = useCallback(() => {
    stopRecognition();
    clearPendingVoiceTurn(true, true);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    recordingRef.current = false;
    audioChunksRef.current = [];
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    releaseAudioLoop();
  }, [clearPendingVoiceTurn, releaseAudioLoop, stopRecognition]);

  const resetState = useCallback((nextMode: CompanionMode = modeRef.current) => {
    clearPendingVoiceTurn(true, true);
    setMode(nextMode);
    setStatus("idle");
    setConversation([]);
    setAssistantText("");
    setSessionId(null);
    setRemainingTurns(null);
    setError(null);
    setFeedbackOpen(false);
    setMicDenied(false);
    setAccessLocked(false);
    setUpgradeUrl("/pricing");
  }, [clearPendingVoiceTurn]);

  useEffect(() => {
    return () => {
      stopPlayback(false);
      releaseMicrophone();
    };
  }, [releaseMicrophone, stopPlayback]);

  const ensureSessionStarted = useCallback(async (nextMode: CompanionMode) => {
    if (sessionIdRef.current) return sessionIdRef.current;

    setIsInitializing(true);
    setError(null);
    try {
      const response = await startCompanionSession({
        mode: nextMode,
        languagePreference,
      });
      setSessionId(response.session_id);
      setDetectedLanguage(response.detected_language);
      setRemainingTurns(response.remaining_free_turns);
      setPrivacyNote(response.privacy_note);
      setNonEmergencyNotice(response.non_emergency_notice);
      setAccessLocked(response.access_locked);
      setUpgradeUrl(response.upgrade_url || "/pricing");
      pushConversationItem("assistant", response.assistant_text, response.detected_language);
      setAssistantText(response.assistant_text);
      if (response.access_locked || response.should_end_session || !response.session_id) {
        setSessionId(null);
        sessionIdRef.current = null;
        setStatus("idle");
        return null;
      }
      setSessionId(response.session_id);
      sessionIdRef.current = response.session_id;
      return response.session_id;
    } catch (startupError) {
      setError(mapCompanionStartupError(startupError));
      setStatus("idle");
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [languagePreference, pushConversationItem]);

  const playAssistantAudio = useCallback(async (text: string, language: CompanionLanguage, keepListening: boolean) => {
    if (modeRef.current !== "voice") {
      setStatus("idle");
      return;
    }

    try {
      const audioBlob = await synthesizeCompanionSpeech({
        sessionId: sessionIdRef.current,
        text,
        languagePreference: language,
      });
      stopPlayback(false);
      const objectUrl = URL.createObjectURL(audioBlob);
      audioObjectUrlRef.current = objectUrl;
      const audio = new Audio(objectUrl);
      audioElementRef.current = audio;
      setStatus("speaking");

      await new Promise<void>((resolve) => {
        const finish = () => {
          audio.onended = null;
          audio.onerror = null;
          if (audioElementRef.current === audio) audioElementRef.current = null;
          if (audioObjectUrlRef.current === objectUrl) {
            URL.revokeObjectURL(objectUrl);
            audioObjectUrlRef.current = null;
          }
          resolve();
        };

        audio.onended = finish;
        audio.onerror = finish;
        void audio.play().catch(finish);
      });

      if (keepListening && mediaStreamRef.current) {
        setStatus("listening");
      } else {
        setStatus("idle");
      }
    } catch (playbackError) {
      setError(playbackError instanceof Error ? playbackError.message : "Unable to play companion audio.");
      setStatus(mediaStreamRef.current ? "listening" : "idle");
    }
  }, [stopPlayback]);

  const replayAssistantAudio = useCallback(async () => {
    if (!assistantText.trim()) return;
    await playAssistantAudio(assistantText, detectedLanguage, false);
  }, [assistantText, detectedLanguage, playAssistantAudio]);

  const scheduleVoiceTurnCommit = useCallback((delayMs = VOICE_TURN_COMMIT_DELAY_MS) => {
    clearVoiceCommitTimeout();
    voiceCommitTimeoutRef.current = window.setTimeout(async () => {
      voiceCommitTimeoutRef.current = null;

      if (recordingRef.current) {
        return;
      }

      if (transcriptionJobsRef.current > 0) {
        scheduleVoiceTurnCommit(120);
        return;
      }

      const mergedTranscript = mergeVoiceSegments(...pendingVoiceSegmentsRef.current);
      if (!mergedTranscript) {
        setStatus(mediaStreamRef.current ? "listening" : "idle");
        return;
      }

      setDraftTranscript(mergedTranscript);

      if (editBeforeSend) {
        setStatus("idle");
        return;
      }

      pendingVoiceSegmentsRef.current = [];
      pendingVoiceLanguageRef.current = "auto";
      liveVoiceSegmentRef.current = "";
      setLiveTranscript("");
      await sendUserTextRef.current(mergedTranscript, "voice");
    }, delayMs);
  }, [clearVoiceCommitTimeout, editBeforeSend]);

  const sendUserText = useCallback(async (rawText: string, channel: CompanionMode) => {
    const message = rawText.trim();
    if (!message) return;

    const activeSessionId = await ensureSessionStarted(channel);
    if (!activeSessionId) {
      setStatus("idle");
      return;
    }
    setError(null);
    setDraftTranscript(message);
    setLiveTranscript("");
    pushConversationItem("user", message, detectedLanguage);
    setStatus("thinking");

    try {
      const response = await sendCompanionMessage({
        sessionId: activeSessionId,
        message,
        languagePreference,
        channel,
      });
      setDetectedLanguage(response.detected_language);
      setRemainingTurns(response.remaining_free_turns);
      setAssistantText(response.assistant_text);
      setAccessLocked(response.access_locked);
      setUpgradeUrl(response.upgrade_url || "/pricing");
      pushConversationItem("assistant", response.assistant_text, response.detected_language);
      setDraftTranscript("");

      if (channel === "voice") {
        await playAssistantAudio(
          response.tts_text || response.assistant_text,
          response.detected_language,
          !response.should_end_session && response.remaining_free_turns > 0,
        );
      } else {
        setStatus("idle");
      }

      if (response.should_end_session && !response.emergency_flag) {
        clearPendingVoiceTurn(true, true);
        setSessionId(null);
        sessionIdRef.current = null;
        setFeedbackOpen(!response.access_locked);
      }
    } catch (sendError) {
      setStatus(modeRef.current === "voice" && mediaStreamRef.current ? "listening" : "idle");
      const message = sendError instanceof Error ? sendError.message : "Unable to process your message right now.";
      if (message === "Companion session not found or expired.") {
        setAccessLocked(true);
        setUpgradeUrl("/pricing");
        setAssistantText("Your free companion credits have been used. Visit pricing to continue.");
        pushConversationItem("assistant", "Your free companion credits have been used. Visit pricing to continue.", detectedLanguage);
        setError(null);
      } else {
        setError(message);
      }
    }
  }, [clearPendingVoiceTurn, detectedLanguage, ensureSessionStarted, languagePreference, playAssistantAudio, pushConversationItem]);

  sendUserTextRef.current = sendUserText;

  const startRecognition = useCallback(() => {
    const RecognitionCtor = getSpeechRecognitionCtor();
    if (!RecognitionCtor) return;

    stopRecognition();
    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = recognitionLanguage(languagePreference === "auto" ? detectedLanguage : languagePreference);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      liveVoiceSegmentRef.current = transcript.trim();
      setLiveTranscript(mergeVoiceSegments(...pendingVoiceSegmentsRef.current, liveVoiceSegmentRef.current));
    };
    recognition.onerror = () => {
      liveVoiceSegmentRef.current = "";
      setLiveTranscript(mergeVoiceSegments(...pendingVoiceSegmentsRef.current));
    };
    recognition.start();
    speechRecognitionRef.current = recognition;
  }, [detectedLanguage, languagePreference, stopRecognition]);

  const stopRecording = useCallback(() => {
    stopRecognition();
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    recordingRef.current = false;
  }, [stopRecognition]);

  const startRecording = useCallback(() => {
    if (!mediaStreamRef.current || recordingRef.current) return;
    clearVoiceCommitTimeout();
    liveVoiceSegmentRef.current = "";

    const mimeType = getRecordingMimeType();
    const recorder = mimeType
      ? new MediaRecorder(mediaStreamRef.current, { mimeType })
      : new MediaRecorder(mediaStreamRef.current);

    audioChunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
      audioChunksRef.current = [];
      const currentLiveSegment = liveVoiceSegmentRef.current;
      liveVoiceSegmentRef.current = "";
      setLiveTranscript(mergeVoiceSegments(...pendingVoiceSegmentsRef.current));

      if (audioBlob.size < 1500) {
        const fallbackSegment = mergeVoiceSegments(currentLiveSegment);
        if (fallbackSegment) {
          pendingVoiceSegmentsRef.current = [...pendingVoiceSegmentsRef.current, fallbackSegment];
          const mergedTranscript = mergeVoiceSegments(...pendingVoiceSegmentsRef.current);
          setDraftTranscript(mergedTranscript);
          setLiveTranscript(mergedTranscript);
          if (editBeforeSend) {
            setStatus("idle");
            return;
          }
          scheduleVoiceTurnCommit();
          return;
        }
        setStatus("listening");
        return;
      }

      const generation = voiceInputGenerationRef.current;
      transcriptionJobsRef.current += 1;
      try {
        const response = await transcribeCompanionAudio({
          audioBlob,
          sessionId: sessionIdRef.current,
          languagePreference,
        });
        if (generation !== voiceInputGenerationRef.current) {
          return;
        }

        setDetectedLanguage(response.detected_language);
        pendingVoiceLanguageRef.current = response.detected_language;

        const refinedSegment = response.refined_user_text.trim();
        if (refinedSegment) {
          pendingVoiceSegmentsRef.current = [...pendingVoiceSegmentsRef.current, refinedSegment];
        }

        const mergedTranscript = mergeVoiceSegments(...pendingVoiceSegmentsRef.current);
        setDraftTranscript(mergedTranscript);
        setLiveTranscript(mergedTranscript);

        if (editBeforeSend) {
          setStatus("idle");
          return;
        }

        const elapsedSinceVoice = performance.now() - lastVoiceAtRef.current;
        scheduleVoiceTurnCommit(Math.max(120, VOICE_TURN_COMMIT_DELAY_MS - elapsedSinceVoice));
      } catch (transcriptionError) {
        setError(
          transcriptionError instanceof Error
            ? transcriptionError.message
            : "Unable to transcribe your speech right now.",
        );
        setStatus(mediaStreamRef.current ? "listening" : "idle");
      } finally {
        transcriptionJobsRef.current = Math.max(0, transcriptionJobsRef.current - 1);
      }
    };

    recordingRef.current = true;
    recordingStartedAtRef.current = performance.now();
    lastVoiceAtRef.current = performance.now();
    mediaRecorderRef.current = recorder;
    recorder.start();
    startRecognition();
    setStatus("listening");
  }, [clearVoiceCommitTimeout, editBeforeSend, languagePreference, scheduleVoiceTurnCommit, startRecognition]);

  const startAudioMonitor = useCallback(() => {
    if (!analyserRef.current) return;

    const buffer = new Uint8Array(analyserRef.current.fftSize);

    const tick = () => {
      const analyser = analyserRef.current;
      if (!analyser) return;

      analyser.getByteTimeDomainData(buffer);
      let sum = 0;
      for (let index = 0; index < buffer.length; index += 1) {
        const value = buffer[index];
        const normalized = (value - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / buffer.length);
      const now = performance.now();

      if (rms > AUDIO_THRESHOLD) {
        lastVoiceAtRef.current = now;
        if (statusRef.current === "speaking") {
          stopPlayback(true);
        }
        if (!recordingRef.current) {
          startRecording();
        }
      }

      if (recordingRef.current) {
        const silenceFor = now - lastVoiceAtRef.current;
        const speechFor = now - recordingStartedAtRef.current;
        if (silenceFor > SILENCE_WINDOW_MS && speechFor > MIN_SPEECH_MS) {
          stopRecording();
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [startRecording, stopPlayback, stopRecording]);

  const requestMicrophone = useCallback(async () => {
    if (mediaStreamRef.current) return mediaStreamRef.current;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicDenied(true);
      setMode("text");
      throw new Error("Microphone capture is not supported in this browser. Please use text mode.");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const browserWindow = getBrowserVoiceWindow();
      const AudioContextCtor = window.AudioContext ?? browserWindow.webkitAudioContext;
      const audioContext = new AudioContextCtor();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      audioSourceRef.current = source;
      analyserRef.current = analyser;
      startAudioMonitor();
      setMicDenied(false);
      return stream;
    } catch (micError) {
      setMicDenied(true);
      setMode("text");
      throw micError;
    }
  }, [startAudioMonitor]);

  const startVoiceConversation = useCallback(async () => {
    setMode("voice");
    setError(null);
    setFeedbackOpen(false);
    if (accessLocked) {
      setStatus("idle");
      return;
    }
    await ensureSessionStarted("voice");
    if (accessLocked || !sessionIdRef.current) {
      setStatus("idle");
      return;
    }
    try {
      await requestMicrophone();
      setStatus("listening");
    } catch (micError) {
      setError(
        micError instanceof Error
          ? micError.message
          : "Microphone access was blocked. You can continue in text mode.",
      );
      setStatus("idle");
    }
  }, [accessLocked, ensureSessionStarted, requestMicrophone]);

  const sendDraftTranscript = useCallback(async () => {
    const currentDraft = draftTranscript.trim();
    if (!currentDraft) return;
    await sendUserText(currentDraft, modeRef.current);
  }, [draftTranscript, sendUserText]);

  const restartSession = useCallback(async () => {
    stopPlayback(false);
    releaseMicrophone();
    if (sessionIdRef.current) {
      try {
        await endCompanionSession(sessionIdRef.current);
      } catch {
        // Ignore cleanup errors for restart.
      }
    }
    resetState(modeRef.current);
  }, [releaseMicrophone, resetState, stopPlayback]);

  const endConversation = useCallback(async () => {
    stopPlayback(false);
    releaseMicrophone();
    if (sessionIdRef.current) {
      try {
        await endCompanionSession(sessionIdRef.current);
      } catch {
        // Ignore cleanup errors when ending a demo session.
      }
    }
    setSessionId(null);
    setStatus("idle");
    setFeedbackOpen(true);
  }, [releaseMicrophone, stopPlayback]);

  const changeMode = useCallback((nextMode: CompanionMode) => {
    setMode(nextMode);
    setError(null);
    if (nextMode === "text") {
      stopPlayback(false);
      releaseMicrophone();
      clearPendingVoiceTurn(true, true);
      setStatus("idle");
    }
  }, [clearPendingVoiceTurn, releaseMicrophone, stopPlayback]);

  return {
    mode,
    changeMode,
    status,
    languagePreference,
    setLanguagePreference,
    detectedLanguage,
    conversation,
    draftTranscript,
    setDraftTranscript,
    liveTranscript,
    assistantText,
    sessionId,
    remainingTurns,
    privacyNote,
    nonEmergencyNotice,
    error,
    setError,
    editBeforeSend,
    setEditBeforeSend,
    isInitializing,
    micDenied,
    feedbackOpen,
    setFeedbackOpen,
    accessLocked,
    upgradeUrl,
    startVoiceConversation,
    sendDraftTranscript,
    stopSpeaking: () => stopPlayback(Boolean(mediaStreamRef.current)),
    replayAssistantAudio,
    restartSession,
    endConversation,
  };
}