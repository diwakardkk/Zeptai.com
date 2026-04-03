import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";

const AUDIO_CACHE_VERSION = "v1";
const AUDIO_CACHE_DIR = path.join(os.tmpdir(), "zeptai-blog-audio");

export function getAudioCacheKey(parts: string[]) {
  return createHash("sha256")
    .update([AUDIO_CACHE_VERSION, ...parts].join("::"))
    .digest("hex");
}

function getCachePath(cacheKey: string) {
  return path.join(AUDIO_CACHE_DIR, `${cacheKey}.mp3`);
}

export async function readCachedAudio(cacheKey: string) {
  try {
    return await fs.readFile(getCachePath(cacheKey));
  } catch {
    return null;
  }
}

export async function writeCachedAudio(cacheKey: string, audio: Buffer) {
  await fs.mkdir(AUDIO_CACHE_DIR, { recursive: true });
  await fs.writeFile(getCachePath(cacheKey), audio);
}
