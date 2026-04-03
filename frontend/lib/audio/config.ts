export const blogAudioConfig = {
  model: process.env.OPENAI_BLOG_TTS_MODEL ?? "gpt-4o-mini-tts",
  voice: process.env.OPENAI_BLOG_TTS_VOICE ?? "coral",
  responseFormat: "mp3",
  maxChunkChars: 3800,
  listeningWordsPerMinute: 165,
  instructions:
    process.env.OPENAI_BLOG_TTS_INSTRUCTIONS ??
    "Read this premium healthcare AI article in a warm, calm, professional, human-like voice. Maintain smooth pacing, natural pauses, and clear pronunciation for long-form listening. Sound polished and editorial, slightly expressive but never dramatic, sales-like, or robotic.",
} as const;
