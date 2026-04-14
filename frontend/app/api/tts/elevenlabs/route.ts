import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ElevenLabsRequestBody = {
  text?: string;
  voice_id?: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    if (!apiKey) {
      return jsonError("ElevenLabs is not configured. Missing ELEVENLABS_API_KEY.", 500);
    }

    const body = (await request.json()) as ElevenLabsRequestBody;
    const text = String(body.text ?? "").trim();
    if (!text) {
      return jsonError("Text is required for ElevenLabs synthesis.", 400);
    }

    const voiceId = String(body.voice_id ?? process.env.ELEVENLABS_VOICE_ID ?? "").trim();
    if (!voiceId) {
      return jsonError("Missing ElevenLabs voice id. Set ELEVENLABS_VOICE_ID.", 500);
    }

    const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2";
    const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT?.trim() || "mp3_44100_128";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return jsonError(
        `ElevenLabs request failed (${response.status}): ${errorText.slice(0, 300)}`,
        502,
      );
    }

    const audioArrayBuffer = await response.arrayBuffer();
    return new Response(audioArrayBuffer, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("ElevenLabs proxy error:", error);
    return jsonError("Unable to synthesize speech with ElevenLabs right now.", 500);
  }
}
