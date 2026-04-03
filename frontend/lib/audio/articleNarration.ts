import { blogAudioConfig } from "@/lib/audio/config";

const SECTION_BREAK_PATTERN = /^##+\s+(references|sources|citations)\s*$/im;

function stripMarkdownSyntax(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\|/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function trimAfterReferences(markdown: string) {
  const match = markdown.match(SECTION_BREAK_PATTERN);
  if (!match || match.index === undefined) {
    return markdown;
  }

  return markdown.slice(0, match.index).trim();
}

function splitLongParagraph(paragraph: string, maxChars: number) {
  if (paragraph.length <= maxChars) {
    return [paragraph];
  }

  const segments: string[] = [];
  const sentences = paragraph.split(/(?<=[.!?])\s+/);
  let current = "";

  for (const sentence of sentences) {
    const nextValue = current ? `${current} ${sentence}` : sentence;
    if (nextValue.length <= maxChars) {
      current = nextValue;
      continue;
    }

    if (current) {
      segments.push(current.trim());
      current = sentence;
      continue;
    }

    for (let index = 0; index < sentence.length; index += maxChars) {
      segments.push(sentence.slice(index, index + maxChars).trim());
    }
  }

  if (current) {
    segments.push(current.trim());
  }

  return segments.filter(Boolean);
}

export function getArticleNarrationText(title: string, markdown: string) {
  const trimmed = trimAfterReferences(markdown);
  const cleanedBody = stripMarkdownSyntax(trimmed);
  const text = `${title}.\n\n${cleanedBody}`
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

export function estimateListenTimeMinutes(text: string) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / blogAudioConfig.listeningWordsPerMinute));
}

export function getArticleListenTime(title: string, markdown: string) {
  const narrationText = getArticleNarrationText(title, markdown);
  return estimateListenTimeMinutes(narrationText);
}

export function chunkNarrationText(text: string, maxChars = blogAudioConfig.maxChunkChars) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .flatMap((paragraph) => splitLongParagraph(paragraph, maxChars));

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const nextValue = current ? `${current}\n\n${paragraph}` : paragraph;
    if (nextValue.length <= maxChars) {
      current = nextValue;
      continue;
    }

    if (current) {
      chunks.push(current.trim());
    }
    current = paragraph;
  }

  if (current) {
    chunks.push(current.trim());
  }

  return chunks;
}
