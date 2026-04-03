import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { readCachedAudio, writeCachedAudio, getAudioCacheKey } from "@/lib/audio/cache";
import { blogAudioConfig } from "@/lib/audio/config";
import {
  chunkNarrationText,
  estimateListenTimeMinutes,
  getArticleNarrationText,
} from "@/lib/audio/articleNarration";
import { getPostBySlug } from "@/lib/blog/getPostBySlug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = {
  content?: string;
  slug?: string;
  title?: string;
  voice?: string;
};

async function generateSpeechChunk(input: string, voice: string) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: blogAudioConfig.model,
      voice,
      input,
      instructions: blogAudioConfig.instructions,
      response_format: blogAudioConfig.responseFormat,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenAI speech generation failed with status ${response.status}: ${errorText.slice(0, 300)}`,
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return jsonError(
        "Blog narration is not configured. Add OPENAI_API_KEY on the server.",
        500,
      );
    }

    const body = (await request.json()) as RequestBody;
    const voice = body.voice?.trim() || blogAudioConfig.voice;

    let articleTitle = body.title?.trim() ?? "";
    let articleContent = body.content?.trim() ?? "";
    let articleSlug = body.slug?.trim() ?? "";

    if (articleSlug && (!articleTitle || !articleContent)) {
      const post = await getPostBySlug(articleSlug);
      if (!post) {
        return jsonError("We could not find that article for audio playback.", 404);
      }

      articleTitle = post.title;
      articleContent = post.content;
      articleSlug = post.slug;
    }

    if (!articleTitle || !articleContent) {
      return jsonError("Article title and content are required for narration.", 400);
    }

    const narrationText = getArticleNarrationText(articleTitle, articleContent);
    if (!narrationText) {
      return jsonError("This article does not contain enough readable content for narration.", 400);
    }

    const chunks = chunkNarrationText(narrationText);
    const listenTimeMinutes = estimateListenTimeMinutes(narrationText);
    const cacheKey = getAudioCacheKey([
      articleSlug || articleTitle,
      blogAudioConfig.model,
      voice,
      blogAudioConfig.instructions,
      narrationText,
    ]);

    const cachedAudio = await readCachedAudio(cacheKey);
    if (cachedAudio) {
      return new Response(cachedAudio, {
        headers: {
          "Cache-Control": "private, max-age=0, s-maxage=86400",
          "Content-Disposition": `inline; filename="${articleSlug || "article-audio"}.mp3"`,
          "Content-Type": "audio/mpeg",
          "X-ZeptAI-Audio-Cache": "hit",
          "X-ZeptAI-Audio-Chunks": String(chunks.length),
          "X-ZeptAI-Listen-Minutes": String(listenTimeMinutes),
        },
      });
    }

    const buffers: Buffer[] = [];
    for (const chunk of chunks) {
      buffers.push(await generateSpeechChunk(chunk, voice));
    }

    const audioBuffer = Buffer.concat(buffers);
    await writeCachedAudio(cacheKey, audioBuffer);

    return new Response(audioBuffer, {
      headers: {
        "Cache-Control": "private, max-age=0, s-maxage=86400",
        "Content-Disposition": `inline; filename="${articleSlug || "article-audio"}.mp3"`,
        "Content-Type": "audio/mpeg",
        "X-ZeptAI-Audio-Cache": "miss",
        "X-ZeptAI-Audio-Chunks": String(chunks.length),
        "X-ZeptAI-Listen-Minutes": String(listenTimeMinutes),
      },
    });
  } catch (error) {
    console.error("Blog audio generation error:", error);
    return jsonError(
      "We could not prepare the AI narration right now. Please try again shortly.",
      500,
    );
  }
}
