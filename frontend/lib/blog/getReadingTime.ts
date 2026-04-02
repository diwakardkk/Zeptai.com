import readingTime from "reading-time";

export function getReadingTime(content: string): number {
  return Math.max(1, Math.ceil(readingTime(content).minutes));
}

