"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { GripHorizontal, Pause, Play, X, Loader2, Sparkles } from "lucide-react";

type ArticleAudioMiniPlayerProps = {
  articleTitle: string;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  isPlaying: boolean;
  playbackRate: number;
  visible: boolean;
  onClose: () => void;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onPlaybackRateChange: (rate: number) => void;
};

const speedOptions = [1, 1.25, 1.5];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

export default function ArticleAudioMiniPlayer({
  articleTitle,
  currentTime,
  duration,
  isLoading,
  isPlaying,
  playbackRate,
  visible,
  onClose,
  onSeek,
  onTogglePlay,
  onPlaybackRateChange,
}: ArticleAudioMiniPlayerProps) {
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement | null>(null);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-[70]"
        >
          <div ref={constraintsRef} className="absolute inset-0">
            <motion.div
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              dragConstraints={constraintsRef}
              className="pointer-events-auto absolute bottom-4 left-1/2 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 overflow-hidden rounded-[28px] border border-white/10 bg-background/80 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl"
            >
              <div className="bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_32%)] p-4 sm:p-5">
                <div className="mb-3 flex justify-center">
                  <button
                    type="button"
                    onPointerDown={(event) => dragControls.start(event)}
                    aria-label="Drag audio player"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
                  >
                    <GripHorizontal className="h-3.5 w-3.5" />
                    Move Player
                  </button>
                </div>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Article Reader
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-foreground sm:text-base">
                      {articleTitle}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      AI-generated voice for editorial listening
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start lg:self-auto">
                    <button
                      type="button"
                      onClick={onTogglePlay}
                      disabled={isLoading}
                      aria-label={isPlaying ? "Pause article audio" : "Play article audio"}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 translate-x-[1px]" />
                      )}
                    </button>

                    <div className="rounded-full border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground">
                      {playbackRate}x
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close article audio player"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition hover:text-foreground"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="w-12 text-xs font-medium tabular-nums text-muted-foreground">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={Math.min(currentTime, duration || 0)}
                      onChange={(event) => onSeek(Number(event.target.value))}
                      aria-label="Seek article audio"
                      disabled={isLoading || duration <= 0}
                      className="audio-progress h-2 w-full"
                    />
                    <span className="w-12 text-right text-xs font-medium tabular-nums text-muted-foreground">
                      {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => onPlaybackRateChange(speed)}
                        aria-pressed={playbackRate === speed}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          playbackRate === speed
                            ? "bg-foreground text-background"
                            : "border border-border bg-background/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
