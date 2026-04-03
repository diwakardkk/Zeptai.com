"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AudioLines, Loader2, Sparkles } from "lucide-react";
import ArticleAudioMiniPlayer from "@/components/blog/ArticleAudioMiniPlayer";

type BlogAudioRequest = {
  slug: string;
};

type ArticleAudioReaderProps = {
  estimatedListenMinutes: number;
  slug: string;
  title: string;
};

type NarrationSegment = {
  block: HTMLElement;
  element: HTMLSpanElement;
  cumulativeWords: number;
  words: number;
};

const ARTICLE_ROOT_SELECTOR = "[data-blog-article-content]";
const TITLE_SELECTOR = "[data-blog-article-title]";
const ARTICLE_BLOCK_SELECTOR =
  `${ARTICLE_ROOT_SELECTOR} h2, ${ARTICLE_ROOT_SELECTOR} h3, ${ARTICLE_ROOT_SELECTOR} h4, ${ARTICLE_ROOT_SELECTOR} p, ${ARTICLE_ROOT_SELECTOR} li, ${ARTICLE_ROOT_SELECTOR} blockquote`;

const REFERENCE_HEADING_PATTERN = /^(references|sources|citations)$/i;
const SENTENCE_SPLIT_PATTERN = /(\s*[^.!?]+(?:[.!?]+(?=\s|$)|$))/g;

type NarrationBlock = {
  element: HTMLElement;
  cumulativeWords: number;
  words: number;
};

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function getWordCount(text: string) {
  return normalizeText(text)
    .split(/\s+/)
    .filter(Boolean).length;
}

function isBlockFarFromViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const upperBound = viewportHeight * 0.18;
  const lowerBound = viewportHeight * 0.72;

  return rect.top < upperBound || rect.bottom > lowerBound;
}

function clearActiveState(element: HTMLElement | null, attributeName = "data-audio-active") {
  if (element) {
    element.removeAttribute(attributeName);
  }
}

function splitIntoSentenceParts(text: string) {
  const parts = text.match(SENTENCE_SPLIT_PATTERN);
  if (!parts) {
    return [text];
  }

  return parts.filter((part) => normalizeText(part).length > 0);
}

function replaceTextNodeWithSegments(
  node: Text,
  block: HTMLElement,
  segments: NarrationSegment[],
  cumulativeWordsRef: { current: number },
) {
  const text = node.textContent ?? "";
  if (!normalizeText(text)) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const part of splitIntoSentenceParts(text)) {
    if (!normalizeText(part)) {
      fragment.append(part);
      continue;
    }

    const span = document.createElement("span");
    span.dataset.audioSegment = "true";
    span.textContent = part;
    fragment.append(span);

    const words = Math.max(1, getWordCount(part));
    cumulativeWordsRef.current += words;
    segments.push({
      block,
      element: span,
      words,
      cumulativeWords: cumulativeWordsRef.current,
    });
  }

  node.parentNode?.replaceChild(fragment, node);
}

function decorateTextSegments(element: HTMLElement, cumulativeWordsRef: { current: number }) {
  const segments: NarrationSegment[] = [];

  if (!element.dataset.audioDecorated) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parentElement = node.parentElement;
        if (!parentElement) {
          return NodeFilter.FILTER_REJECT;
        }

        if (
          parentElement.closest("[data-audio-segment='true']") ||
          ["SCRIPT", "STYLE"].includes(parentElement.tagName)
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return normalizeText(node.textContent ?? "")
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes: Text[] = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }

    textNodes.forEach((node) =>
      replaceTextNodeWithSegments(node, element, segments, cumulativeWordsRef),
    );
    element.dataset.audioDecorated = "true";
  }

  const existingSegments = Array.from(
    element.querySelectorAll<HTMLSpanElement>("[data-audio-segment='true']"),
  );

  if (segments.length === 0) {
    return existingSegments.map((segment) => {
      const words = Math.max(1, getWordCount(segment.textContent ?? ""));
      cumulativeWordsRef.current += words;
      return {
        block: element,
        element: segment,
        words,
        cumulativeWords: cumulativeWordsRef.current,
      };
    });
  }

  return segments;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "We could not prepare the AI narration right now. Please try again in a moment.";
}

export default function ArticleAudioReader({
  estimatedListenMinutes,
  slug,
  title,
}: ArticleAudioReaderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blocksRef = useRef<NarrationBlock[]>([]);
  const segmentsRef = useRef<NarrationSegment[]>([]);
  const activeBlockRef = useRef<HTMLElement | null>(null);
  const activeSegmentRef = useRef<HTMLElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const buttonLabel = useMemo(() => {
    if (isLoading) {
      return "Preparing AI narration";
    }

    if (audioReady) {
      return isPlaying ? "Pause narration" : "Resume narration";
    }

    return "Listen to this article";
  }, [audioReady, isLoading, isPlaying]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const root = document.querySelector<HTMLElement>(ARTICLE_ROOT_SELECTOR);
      const titleElement = document.querySelector<HTMLElement>(TITLE_SELECTOR);
      const elements = Array.from(document.querySelectorAll<HTMLElement>(ARTICLE_BLOCK_SELECTOR));
      const cumulativeWordsRef = { current: 0 };

      const narrationBlocks: HTMLElement[] = [];
      const narrationSegments: NarrationSegment[] = [];

      if (titleElement) {
        narrationBlocks.push(titleElement);
        narrationSegments.push(...decorateTextSegments(titleElement, cumulativeWordsRef));
      }

      for (const element of elements) {
        if (!root?.contains(element)) {
          continue;
        }

        const normalizedBlockText = normalizeText(element.textContent ?? "");
        if (!normalizedBlockText) {
          continue;
        }

        if (
          element.matches("h2, h3, h4") &&
          REFERENCE_HEADING_PATTERN.test(normalizedBlockText)
        ) {
          break;
        }

        narrationBlocks.push(element);
        narrationSegments.push(...decorateTextSegments(element, cumulativeWordsRef));
      }

      let cumulativeWords = 0;
      blocksRef.current = narrationBlocks
        .map((element) => {
          const words = Math.max(1, getWordCount(element.textContent ?? ""));
          cumulativeWords += words;
          return {
            element,
            words,
            cumulativeWords,
          };
        })
        .filter((block) => block.words > 0);

      segmentsRef.current = narrationSegments;
    });

    return () => {
      window.cancelAnimationFrame(frame);
      clearActiveState(activeSegmentRef.current);
      clearActiveState(activeBlockRef.current, "data-audio-container-active");
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!duration || !segmentsRef.current.length) {
      return;
    }

    const totalWords = segmentsRef.current[segmentsRef.current.length - 1]?.cumulativeWords ?? 0;
    if (!totalWords) {
      return;
    }

    const progress = Math.min(1, Math.max(0, currentTime / duration));
    const currentWordTarget = Math.max(1, Math.ceil(progress * totalWords));
    const nextSegment =
      segmentsRef.current.find((segment) => segment.cumulativeWords >= currentWordTarget) ?? null;

    if (!nextSegment) {
      return;
    }

    if (activeSegmentRef.current !== nextSegment.element) {
      clearActiveState(activeSegmentRef.current);
      nextSegment.element.setAttribute("data-audio-active", "true");
      activeSegmentRef.current = nextSegment.element;
    }

    if (activeBlockRef.current !== nextSegment.block) {
      clearActiveState(activeBlockRef.current, "data-audio-container-active");
      nextSegment.block.setAttribute("data-audio-container-active", "true");
      activeBlockRef.current = nextSegment.block;
    }

    if (isPlaying && isBlockFarFromViewport(nextSegment.element)) {
      nextSegment.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime, duration, isPlaying]);

  async function playCurrentAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.playbackRate = playbackRate;
    setIsMiniPlayerVisible(true);

    try {
      await audio.play();
    } catch {
      setError("Audio is ready. Tap play in the mini-player if playback did not start automatically.");
    }
  }

  async function fetchAudio() {
    const response = await fetch("/api/blog-audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug } satisfies BlogAudioRequest),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "We could not generate audio for this article.");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const audio = audioRef.current;

    if (!audio) {
      throw new Error("Audio player is unavailable.");
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = objectUrl;
    audio.src = objectUrl;
    audio.load();
    setAudioReady(true);
  }

  async function handlePrimaryAction() {
    if (isLoading) {
      return;
    }

    setError(null);
    const audio = audioRef.current;

    if (audioReady && audio) {
      if (audio.paused) {
        await playCurrentAudio();
      } else {
        audio.pause();
      }
      return;
    }

    setIsLoading(true);
    setIsMiniPlayerVisible(true);

    try {
      await fetchAudio();
      await playCurrentAudio();
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      setIsMiniPlayerVisible(false);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTogglePlay() {
    const audio = audioRef.current;
    if (!audio || isLoading) {
      return;
    }

    if (audio.paused) {
      void playCurrentAudio();
      return;
    }

    audio.pause();
  }

  function handleSeek(time: number) {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = time;
    setCurrentTime(time);
  }

  function handlePlaybackRateChange(nextRate: number) {
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  }

  function handleClosePlayer() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    clearActiveState(activeSegmentRef.current);
    clearActiveState(activeBlockRef.current, "data-audio-container-active");
    setIsMiniPlayerVisible(false);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-6 rounded-[26px] border border-white/10 bg-background/75 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI Listening Mode
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Estimated listen time: {estimatedListenMinutes} min</span>
              <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline-block" />
              <span>AI-generated voice</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handlePrimaryAction()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <AudioLines className="h-4.5 w-4.5" />
            )}
            {buttonLabel}
          </button>
        </div>

        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          Narrated with an AI voice tuned for calm, professional long-form reading.
        </p>

        {error ? (
          <div className="mt-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </motion.div>

      <audio
        ref={audioRef}
        preload="none"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => {
          setIsPlaying(true);
          setError(null);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={() => {
          setIsPlaying(false);
          clearActiveState(activeSegmentRef.current);
          clearActiveState(activeBlockRef.current, "data-audio-container-active");
        }}
      />

      <ArticleAudioMiniPlayer
        articleTitle={title}
        currentTime={currentTime}
        duration={duration}
        isLoading={isLoading}
        isPlaying={isPlaying}
        playbackRate={playbackRate}
        visible={isMiniPlayerVisible}
        onClose={handleClosePlayer}
        onSeek={handleSeek}
        onTogglePlay={handleTogglePlay}
        onPlaybackRateChange={handlePlaybackRateChange}
      />
    </>
  );
}
