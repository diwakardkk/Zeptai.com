import { getAdminDb, isMissingAdminCredentialError } from "@/app/api/_firestoreAdmin";

type CompanionMode = "voice" | "text";
type CompanionLanguage = "auto" | "en" | "hi" | "mixed";
type CompanionTurnRole = "user" | "assistant";

type CompanionTurn = {
  role: CompanionTurnRole;
  text: string;
  language: CompanionLanguage | string;
  createdAt: number;
};

type StoredCompanionSession = {
  sessionId: string;
  clientId: string;
  mode: CompanionMode;
  detectedLanguage: CompanionLanguage | string;
  state: string;
  turns: CompanionTurn[];
  userTurnCount: number;
  onboardingComplete: boolean;
  expiresAt: number;
};

type CompanionUsage = {
  clientId: string;
  turnsUsed: number;
  creditBalance: number;
  demoLocked: boolean;
  firstSeenAt: number;
  lastSeenAt: number;
  lockedAt: number | null;
};

type StartPayload = {
  mode?: CompanionMode;
  language_preference?: string;
};

type MessagePayload = {
  session_id: string;
  message: string;
  language_preference?: string;
  channel?: CompanionMode;
};

type EndPayload = {
  session_id: string;
};

type TTSPayload = {
  text: string;
  language_preference?: string;
  voice?: string;
};

type FeedbackPayload = {
  session_id?: string | null;
  consent_to_share?: boolean;
};

const SESSION_COLLECTION = "companion_sessions";
const USAGE_COLLECTION = "companion_usage";
const MAX_TURNS = Number(process.env.COMPANION_MAX_TURNS ?? 10);
const SESSION_TTL_MS = Number(process.env.COMPANION_SESSION_TTL_SECONDS ?? 900) * 1000;
const UPGRADE_URL = "/pricing";

const usageMemory = new Map<string, CompanionUsage>();
const sessionMemory = new Map<string, StoredCompanionSession>();

function nowMs() {
  return Date.now();
}

function normalizeLanguage(language: string | null | undefined): CompanionLanguage {
  const normalized = (language || "auto").trim().toLowerCase();
  if (normalized === "en" || normalized === "english") return "en";
  if (normalized === "hi" || normalized === "hindi") return "hi";
  if (normalized === "mixed" || normalized === "hinglish") return "mixed";
  return "auto";
}

function detectLanguage(text: string, preferred?: string | null): CompanionLanguage {
  const preferredNormalized = normalizeLanguage(preferred);
  const sample = text.toLowerCase();
  if (!sample.trim()) return preferredNormalized === "auto" ? "en" : preferredNormalized;

  const hasHindiScript = /[\u0900-\u097F]/.test(sample);
  const hindiTerms = /(mera|mujhe|bukhar|sir dard|saans|thakan|haan|achha|naam|umar|neend)/.test(sample);
  const englishLetters = /[a-z]/.test(sample);

  if ((hasHindiScript || hindiTerms) && englishLetters) return "mixed";
  if (hasHindiScript || hindiTerms) return "hi";
  return preferredNormalized === "auto" ? "en" : preferredNormalized;
}

function chooseReplyLanguage(text: string, preferred?: string | null, sessionLanguage?: string | null): CompanionLanguage {
  const detected = detectLanguage(text, preferred);
  if (detected !== "auto") return detected;
  return normalizeLanguage(sessionLanguage);
}

function compactText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function prepareTtsText(text: string) {
  return compactText(text.replace(/\*+/g, "")).replace(/ - /g, ", ");
}

function privacyNote() {
  return "Your conversation is kept in temporary memory only for the active session and is not stored permanently.";
}

function nonEmergencyNotice() {
  return "Not for emergencies. For severe or urgent symptoms, contact local emergency care or go to the nearest hospital.";
}

function openingMessage(language: CompanionLanguage) {
  if (language === "hi") {
    return "Namaste, main ZeptAI ki supportive health companion hoon. Main licensed doctor nahi hoon, aur yeh emergency service bhi nahi hai. Shuru karne se pehle, kya aap apna naam, age, aur gender bata sakte hain?";
  }
  if (language === "mixed") {
    return "Hi, main ZeptAI ki supportive AI health companion hoon. Main real doctor ka replacement nahi hoon, aur emergencies ke liye nahi hoon. Before we begin, may I know your name, age, and gender?";
  }
  return "Hi, I'm ZeptAI's supportive AI health companion. I'm not a licensed doctor and this is not for emergencies. Before we begin, may I know your name, age, and gender?";
}

function accessLockedMessage(language: CompanionLanguage) {
  if (language === "hi") {
    return "Aapke free companion credits use ho chuke hain. Agar aap continue karna chahte hain, to pricing page dekhiye.";
  }
  if (language === "mixed") {
    return "Aapke free companion credits use ho chuke hain. To continue, please pricing page par jaakar more access lijiye.";
  }
  return "Your free companion credits have been used. To continue, please visit the pricing page for more access.";
}

function limitMessage(language: CompanionLanguage) {
  if (language === "hi") {
    return "Aaj ke free demo turns khatam ho gaye hain. Agar symptoms bane rahein ya zyada badh jaayen, to kripya doctor se consult kijiye.";
  }
  if (language === "mixed") {
    return "Aaj ke free demo turns khatam ho gaye hain. Agar problem theek na ho ya symptoms badhein, to please doctor se consult kijiye.";
  }
  return "You've reached the free demo limit for this session. If the problem continues or worsens, please speak with a clinician.";
}

function missingProfileLine(language: CompanionLanguage) {
  if (language === "hi") {
    return "Agar aap comfortable hon, to apna naam, age, aur gender bhi share kar dijiye. Usse main better context ke saath baat kar paungi.";
  }
  if (language === "mixed") {
    return "If you're comfortable, please also share your name, age, and gender. That helps me respond with better context.";
  }
  return "If you're comfortable, please also share your name, age, and gender. That helps me respond with better context.";
}

function isEmergency(text: string) {
  const sample = text.toLowerCase();
  return /(severe chest pain|trouble breathing|can't breathe|suicide|kill myself|stroke|uncontrolled bleeding|behosh|saans lene me dikkat|seene me tez dard)/.test(sample);
}

function emergencyMessage(language: CompanionLanguage) {
  if (language === "hi") {
    return "Mujhe chinta hai ki yeh urgent ho sakta hai. Kripya abhi turant emergency care lijiye ya local emergency number par call kijiye.";
  }
  if (language === "mixed") {
    return "I'm concerned this may be urgent. Please turant emergency care lijiye ya local emergency number par abhi call kijiye.";
  }
  return "I'm concerned this may be urgent. Please seek emergency care now or contact your local emergency number immediately.";
}

function remainingFreeTurns(usage: CompanionUsage) {
  return Math.max(MAX_TURNS - usage.turnsUsed, 0);
}

function isAccessLocked(usage: CompanionUsage) {
  return usage.demoLocked && usage.creditBalance <= 0;
}

function createUsage(clientId: string): CompanionUsage {
  const timestamp = nowMs();
  return {
    clientId,
    turnsUsed: 0,
    creditBalance: 0,
    demoLocked: false,
    firstSeenAt: timestamp,
    lastSeenAt: timestamp,
    lockedAt: null,
  };
}

async function withFirestore<T>(action: (db: ReturnType<typeof getAdminDb>) => Promise<T>): Promise<T | null> {
  try {
    const db = getAdminDb();
    return await action(db);
  } catch (error) {
    if (!isMissingAdminCredentialError(error)) {
      console.warn("Companion Firestore fallback in use:", error);
    }
    return null;
  }
}

async function getUsage(clientId: string): Promise<CompanionUsage> {
  const firestoreUsage = await withFirestore(async (db) => {
    const doc = await db.collection(USAGE_COLLECTION).doc(clientId).get();
    if (!doc.exists) return null;
    return doc.data() as CompanionUsage;
  });
  if (firestoreUsage) {
    return { ...createUsage(clientId), ...firestoreUsage, clientId };
  }

  const memoryUsage = usageMemory.get(clientId);
  if (memoryUsage) return memoryUsage;
  const usage = createUsage(clientId);
  usageMemory.set(clientId, usage);
  return usage;
}

async function saveUsage(usage: CompanionUsage) {
  usage.lastSeenAt = nowMs();
  const stored = await withFirestore(async (db) => {
    await db.collection(USAGE_COLLECTION).doc(usage.clientId).set(usage, { merge: true });
    return true;
  });
  if (!stored) {
    usageMemory.set(usage.clientId, usage);
  }
}

async function consumeTurn(clientId: string) {
  const usage = await getUsage(clientId);
  if (isAccessLocked(usage)) return usage;
  usage.turnsUsed += 1;
  if (usage.turnsUsed >= MAX_TURNS && usage.creditBalance <= 0) {
    usage.demoLocked = true;
    usage.lockedAt = nowMs();
  }
  await saveUsage(usage);
  return usage;
}

function createSession(clientId: string, mode: CompanionMode, language: CompanionLanguage): StoredCompanionSession {
  return {
    sessionId: crypto.randomUUID(),
    clientId,
    mode,
    detectedLanguage: language,
    state: "onboarding",
    turns: [],
    userTurnCount: 0,
    onboardingComplete: false,
    expiresAt: nowMs() + SESSION_TTL_MS,
  };
}

async function getSession(sessionId: string): Promise<StoredCompanionSession | null> {
  const firestoreSession = await withFirestore(async (db) => {
    const doc = await db.collection(SESSION_COLLECTION).doc(sessionId).get();
    if (!doc.exists) return null;
    return doc.data() as StoredCompanionSession;
  });

  const session = firestoreSession || sessionMemory.get(sessionId) || null;
  if (!session) return null;
  if (session.expiresAt <= nowMs()) {
    await endSession(sessionId);
    return null;
  }
  return session;
}

async function saveSession(session: StoredCompanionSession) {
  session.expiresAt = nowMs() + SESSION_TTL_MS;
  const stored = await withFirestore(async (db) => {
    await db.collection(SESSION_COLLECTION).doc(session.sessionId).set(session, { merge: true });
    return true;
  });
  if (!stored) {
    sessionMemory.set(session.sessionId, session);
  }
}

async function endSession(sessionId: string) {
  await withFirestore(async (db) => {
    await db.collection(SESSION_COLLECTION).doc(sessionId).delete();
    return true;
  });
  sessionMemory.delete(sessionId);
}

function lockedStartResponse(language: CompanionLanguage) {
  return {
    session_id: "",
    assistant_text: accessLockedMessage(language),
    detected_language: language,
    safety_flags: [],
    emergency_flag: false,
    should_end_session: true,
    remaining_free_turns: 0,
    state: "ended",
    privacy_note: privacyNote(),
    non_emergency_notice: nonEmergencyNotice(),
    access_locked: true,
    upgrade_url: UPGRADE_URL,
  };
}

function lockedMessageResponse(language: CompanionLanguage, userText: string) {
  const assistantText = accessLockedMessage(language);
  return {
    session_id: "",
    detected_language: language,
    refined_user_text: compactText(userText),
    assistant_text: assistantText,
    tts_text: prepareTtsText(assistantText),
    safety_flags: [],
    emergency_flag: false,
    should_end_session: true,
    remaining_free_turns: 0,
    state: "ended",
    access_locked: true,
    upgrade_url: UPGRADE_URL,
  };
}

function buildSystemPrompt(language: CompanionLanguage) {
  const languageRule =
    language === "hi"
      ? "Reply in natural Hindi using feminine first-person phrasing. Use simple everyday Hindi and avoid isolated English words like worsen or clinician."
      : language === "mixed"
        ? "Reply in natural Hinglish with sparse code-switching. Use clear Hindi for symptom progression and escalation, not awkward isolated English words."
        : "Reply in clear, supportive English.";

  return [
    "You are ZeptAI's supportive AI health companion.",
    "You are not a licensed doctor and not an emergency service.",
    "Use a calm, warm, voice-friendly tone.",
    "Keep replies short, usually one or two compact sentences.",
    "Ask at most one or two focused follow-up questions.",
    "Do not diagnose with certainty.",
    "For severe symptoms, direct the user to urgent in-person care immediately.",
    languageRule,
  ].join(" ");
}

async function createChatReply(session: StoredCompanionSession, userText: string, language: CompanionLanguage) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }

  const messages = [
    { role: "system", content: buildSystemPrompt(language) },
    ...session.turns.slice(-8).map((turn) => ({ role: turn.role, content: turn.text })),
    { role: "user", content: userText },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o",
      temperature: Number(process.env.COMPANION_CHAT_TEMPERATURE ?? 0.55),
      max_tokens: 180,
      messages,
    }),
  });

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || `OpenAI chat failed with status ${response.status}`);
  }

  return compactText(payload.choices?.[0]?.message?.content || "Let's go step by step.");
}

async function transcribeAudio(audioFile: File, languagePreference: string | null | undefined) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }

  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("model", process.env.OPENAI_STT_MODEL ?? "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const payload = (await response.json()) as { text?: string; error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message || `OpenAI transcription failed with status ${response.status}`);
  }

  const refined = compactText(payload.text || "");
  const detectedLanguage = detectLanguage(refined, languagePreference);

  return {
    raw_transcript: refined,
    refined_user_text: refined,
    detected_language: detectedLanguage,
    safety_flags: [],
    emergency_flag: isEmergency(refined),
  };
}

async function synthesizeSpeech(text: string, voice?: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL ?? "tts-1",
      voice: voice || process.env.OPENAI_TTS_VOICE || "alloy",
      input: prepareTtsText(text),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI speech failed with status ${response.status}: ${errorText.slice(0, 240)}`);
  }

  return {
    audioBuffer: Buffer.from(await response.arrayBuffer()),
    mediaType: "audio/mpeg",
  };
}

export async function handleCompanionStart(clientId: string, payload: StartPayload) {
  const mode = payload.mode === "text" ? "text" : "voice";
  const language = normalizeLanguage(payload.language_preference);
  const usage = await getUsage(clientId);
  if (isAccessLocked(usage)) {
    return lockedStartResponse(language);
  }

  const session = createSession(clientId, mode, language);
  session.userTurnCount = usage.turnsUsed;
  const greeting = openingMessage(language);
  session.turns.push({ role: "assistant", text: greeting, language, createdAt: nowMs() });
  await saveSession(session);

  return {
    session_id: session.sessionId,
    assistant_text: greeting,
    detected_language: language,
    safety_flags: [],
    emergency_flag: false,
    should_end_session: false,
    remaining_free_turns: remainingFreeTurns(usage),
    state: session.state,
    privacy_note: privacyNote(),
    non_emergency_notice: nonEmergencyNotice(),
    access_locked: false,
    upgrade_url: null,
  };
}

export async function handleCompanionMessage(clientId: string, payload: MessagePayload) {
  const session = await getSession(payload.session_id);
  const userText = compactText(payload.message || "");
  const replyLanguage = chooseReplyLanguage(userText, payload.language_preference, session?.detectedLanguage);
  if (!session) {
    const usage = await getUsage(clientId);
    if (isAccessLocked(usage)) {
      return lockedMessageResponse(replyLanguage, userText);
    }
    throw new Error("Companion session not found or expired.");
  }

  const usage = await getUsage(clientId);
  if (isAccessLocked(usage) || remainingFreeTurns(usage) <= 0) {
    await endSession(session.sessionId);
    return lockedMessageResponse(replyLanguage, userText);
  }

  const consumedUsage = await consumeTurn(clientId);
  session.userTurnCount = consumedUsage.turnsUsed;
  session.detectedLanguage = replyLanguage;
  session.turns.push({ role: "user", text: userText, language: replyLanguage, createdAt: nowMs() });

  let assistantText = "";
  let shouldEndSession = false;
  let emergencyFlag = false;

  if (isEmergency(userText)) {
    assistantText = emergencyMessage(replyLanguage);
    emergencyFlag = true;
    shouldEndSession = true;
    session.state = "emergency";
  } else if (!session.onboardingComplete) {
    session.onboardingComplete = true;
    session.state = "conversation";
    assistantText = await createChatReply(session, `${userText}\n\n${missingProfileLine(replyLanguage)}`, replyLanguage);
  } else {
    assistantText = await createChatReply(session, userText, replyLanguage);
  }

  if (remainingFreeTurns(consumedUsage) <= 0 && !emergencyFlag) {
    assistantText = `${assistantText}\n\n${accessLockedMessage(replyLanguage)}`;
    shouldEndSession = true;
    session.state = "limit_reached";
  }

  session.turns.push({ role: "assistant", text: assistantText, language: replyLanguage, createdAt: nowMs() });

  if (shouldEndSession) {
    await endSession(session.sessionId);
  } else {
    await saveSession(session);
  }

  return {
    session_id: shouldEndSession ? "" : session.sessionId,
    detected_language: replyLanguage,
    refined_user_text: userText,
    assistant_text: assistantText,
    tts_text: prepareTtsText(assistantText),
    safety_flags: [],
    emergency_flag: emergencyFlag,
    should_end_session: shouldEndSession,
    remaining_free_turns: remainingFreeTurns(consumedUsage),
    state: shouldEndSession ? "ended" : session.state,
    access_locked: shouldEndSession && !emergencyFlag,
    upgrade_url: shouldEndSession && !emergencyFlag ? UPGRADE_URL : null,
  };
}

export async function handleCompanionEnd(payload: EndPayload) {
  await endSession(payload.session_id);
  return {
    ok: true,
    session_id: payload.session_id,
    message: "Companion session ended. Nothing was persisted from this conversation.",
  };
}

export async function handleCompanionStt(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  if (!(audio instanceof File)) {
    throw new Error("Audio file is required.");
  }
  const languagePreference = String(formData.get("language_preference") || "auto");
  const response = await transcribeAudio(audio, languagePreference);
  return {
    session_id: formData.get("session_id")?.toString() || null,
    ...response,
  };
}

export async function handleCompanionTts(payload: TTSPayload) {
  const speech = await synthesizeSpeech(payload.text, payload.voice);
  return speech;
}

export async function handleCompanionFeedback(_payload: FeedbackPayload) {
  return {
    ok: true,
    stored: false,
    message: "Thanks for the feedback. This privacy-first build does not persist companion feedback yet.",
  };
}