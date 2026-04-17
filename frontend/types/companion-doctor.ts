export type CompanionMode = "voice" | "text";
export type CompanionStatus = "idle" | "listening" | "thinking" | "speaking";
export type CompanionLanguage = "auto" | "en" | "hi" | "mixed";
export type CompanionThumb = "up" | "down";

export type CompanionConversationItem = {
  id: string;
  role: "assistant" | "user";
  text: string;
  language: CompanionLanguage | string;
};

export type CompanionStartResponse = {
  session_id: string;
  assistant_text: string;
  detected_language: CompanionLanguage;
  safety_flags: string[];
  emergency_flag: boolean;
  should_end_session: boolean;
  remaining_free_turns: number;
  state: string;
  privacy_note: string;
  non_emergency_notice: string;
  access_locked: boolean;
  upgrade_url?: string | null;
};

export type CompanionMessageResponse = {
  session_id: string;
  detected_language: CompanionLanguage;
  refined_user_text: string;
  assistant_text: string;
  tts_text: string;
  safety_flags: string[];
  emergency_flag: boolean;
  should_end_session: boolean;
  remaining_free_turns: number;
  state: string;
  access_locked: boolean;
  upgrade_url?: string | null;
};

export type CompanionSTTResponse = {
  session_id?: string | null;
  raw_transcript: string;
  refined_user_text: string;
  detected_language: CompanionLanguage;
  safety_flags: string[];
  emergency_flag: boolean;
};

export type CompanionFeedbackResponse = {
  ok: boolean;
  stored: boolean;
  message: string;
};

export type CompanionFeedbackDraft = {
  rating: number;
  sentiment: CompanionThumb | null;
  text: string;
  consentToShare: boolean;
};