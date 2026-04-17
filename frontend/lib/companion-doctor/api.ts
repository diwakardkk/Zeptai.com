import {
  CompanionFeedbackDraft,
  CompanionFeedbackResponse,
  CompanionMessageResponse,
  CompanionMode,
  CompanionSTTResponse,
  CompanionStartResponse,
} from "@/types/companion-doctor";

const COMPANION_PROXY_BASE = "/api/companion-proxy/companion";

function guessAudioFilename(blobType: string) {
  const normalizedType = blobType.split(";", 1)[0].trim().toLowerCase();
  if (normalizedType === "audio/mp4") return "companion.m4a";
  if (normalizedType === "audio/ogg") return "companion.ogg";
  if (normalizedType === "audio/wav") return "companion.wav";
  return "companion.webm";
}

async function parseJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  const data = raw ? (JSON.parse(raw) as T & { error?: string; detail?: string }) : ({} as T);

  if (!response.ok) {
    const message =
      (typeof data === "object" && data && "detail" in data && data.detail) ||
      (typeof data === "object" && data && "error" in data && data.error) ||
      raw ||
      `Request failed with status ${response.status}`;
    throw new Error(String(message));
  }

  return data;
}

export async function startCompanionSession(payload: {
  mode: CompanionMode;
  languagePreference: string;
}) {
  const response = await fetch(`${COMPANION_PROXY_BASE}/chat/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: payload.mode,
      language_preference: payload.languagePreference,
    }),
  });
  return parseJson<CompanionStartResponse>(response);
}

export async function sendCompanionMessage(payload: {
  sessionId: string;
  message: string;
  languagePreference: string;
  channel: CompanionMode;
}) {
  const response = await fetch(`${COMPANION_PROXY_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: payload.sessionId,
      message: payload.message,
      language_preference: payload.languagePreference,
      channel: payload.channel,
    }),
  });
  return parseJson<CompanionMessageResponse>(response);
}

export async function endCompanionSession(sessionId: string) {
  const response = await fetch(`${COMPANION_PROXY_BASE}/chat/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  return parseJson<{ ok: boolean; session_id: string; message: string }>(response);
}

export async function transcribeCompanionAudio(payload: {
  audioBlob: Blob;
  sessionId?: string | null;
  languagePreference: string;
}) {
  const formData = new FormData();
  formData.append("audio", payload.audioBlob, guessAudioFilename(payload.audioBlob.type));
  if (payload.sessionId) formData.append("session_id", payload.sessionId);
  formData.append("language_preference", payload.languagePreference);

  const response = await fetch(`${COMPANION_PROXY_BASE}/stt`, {
    method: "POST",
    body: formData,
  });
  return parseJson<CompanionSTTResponse>(response);
}

export async function synthesizeCompanionSpeech(payload: {
  sessionId?: string | null;
  text: string;
  languagePreference: string;
}) {
  const elevenLabsResponse = await fetch("/api/tts/elevenlabs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: payload.text }),
  });

  if (elevenLabsResponse.ok) {
    return elevenLabsResponse.blob();
  }

  const response = await fetch(`${COMPANION_PROXY_BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: payload.sessionId,
      text: payload.text,
      language_preference: payload.languagePreference,
    }),
  });

  if (!response.ok) {
    let message = `TTS failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string; error?: string };
      message = data.detail || data.error || message;
    } catch {
      // Ignore JSON parse failures.
    }
    throw new Error(message);
  }

  return response.blob();
}

export async function submitCompanionFeedback(payload: CompanionFeedbackDraft & { sessionId?: string | null }) {
  const response = await fetch(`${COMPANION_PROXY_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: payload.sessionId,
      rating: payload.rating,
      sentiment: payload.sentiment,
      text: payload.text || undefined,
      consent_to_share: payload.consentToShare,
    }),
  });
  return parseJson<CompanionFeedbackResponse>(response);
}