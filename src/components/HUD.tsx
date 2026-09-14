import React from 'react';
import { BookOpen, Heart, Volume2, VolumeX, RotateCcw, Pause, Play, Trophy, Flag } from 'lucide-react';

interface HUDProps {
  score: number;
  booksCollected: number;
  totalBooks: number;
  lives: number;
  maxLives: number;
  highScore: number;
  progressPercent: number;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  booksCollected,
  totalBooks,
  lives,
  maxLives,
  highScore,
  progressPercent,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onRestart,
}) => {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col p-3 md:p-4" aria-label="Game Status Bar">
      {/* Top Bar with Metrics and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Score & High Score */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-md border border-amber-200">
          <div className="flex items-center gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500 font-bold text-white shadow-sm text-xs">
              ★
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Skor</div>
              <div id="hud-score-display" className="font-mono text-lg font-black leading-tight text-slate-900">
                {score}
              </div>
            </div>
          </div>

          <div className="mx-1 h-6 w-px bg-amber-200" />

          <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700">{highScore}</span>
          </div>
        </div>

        {/* Center: Books & Lives */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-2 shadow-md backdrop-blur-md border border-sky-200">
          {/* Books collected */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">Buku</div>
              <div className="font-mono text-sm font-bold text-slate-900">
                <span className="text-blue-600">{booksCollected}</span> / {totalBooks}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-sky-200" />

          {/* Lives (Hearts) */}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxLives }).map((_, i) => {
              const isFilled = i < lives;
              return (
                <Heart
                  key={i}
                  className={`h-5 w-5 transition-transform ${
                    isFilled
                      ? 'fill-red-500 text-red-500 scale-105'
                      : 'fill-slate-200 text-slate-300 scale-95 opacity-60'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-2xl bg-white/90 p-1.5 shadow-md backdrop-blur-md border border-slate-200">
          <button
            id="hud-mute-btn"
            onClick={onToggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-slate-700" />}
          </button>

          <button
            id="hud-pause-btn"
            onClick={onTogglePause}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            title={isPaused ? 'Lanjutkan' : 'Jeda'}
            aria-label={isPaused ? 'Lanjutkan' : 'Jeda'}
          >
            {isPaused ? <Play className="h-4 w-4 text-emerald-600" /> : <Pause className="h-4 w-4 text-slate-700" />}
          </button>

          <button
            id="hud-restart-btn"
            onClick={onRestart}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            title="Mulai Ulang (R)"
            aria-label="Mulai Ulang"
          >
            <RotateCcw className="h-4 w-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Progress Bar towards School Finish Gate */}
      <div className="pointer-events-auto mx-auto mt-2 flex w-full max-w-md items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs shadow-sm backdrop-blur-sm border border-slate-200">
        <span className="font-semibold text-[11px] text-slate-600">Awal</span>
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-500 transition-all duration-150"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
        <div className="flex items-center gap-1 font-semibold text-[11px] text-emerald-700">
          <Flag className="h-3 w-3 text-emerald-600" />
          <span>Gerbang</span>
        </div>
      </div>
    </header>
  );
};
