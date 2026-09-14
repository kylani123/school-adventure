import React, { useEffect } from 'react';
import { RotateCcw, Home, Flame, BookOpen, Trophy } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  booksCollected: number;
  totalBooks: number;
  highScore: number;
  onRestart: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  booksCollected,
  totalBooks,
  highScore,
  onRestart,
  onGoHome,
}) => {
  // Listen for Space or Enter or R to restart quickly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyR' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border-4 border-red-400">
        {/* Flame Danger Icon Header */}
        <div className="relative -mt-14 mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500 ring-8 ring-white shadow-lg">
          <Flame className="h-10 w-10 fill-red-500 animate-pulse" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Game Over!
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Siswa terkena batu api! Jangan menyerah, ayo belajar dari rintangan dan coba lagi!
        </p>

        {isNewHighScore && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-300">
            <Trophy className="h-3.5 w-3.5 text-amber-600" />
            <span>Rekor Baru Tercapai!</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="my-5 grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-3 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Skor Akhir</span>
            <span className="mt-1 font-mono text-2xl font-black text-slate-900">{score}</span>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-3 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Buku Pelajaran</span>
            <span className="mt-1 flex items-center gap-1 font-mono text-xl font-bold text-blue-600">
              <BookOpen className="h-4 w-4" />
              {booksCollected} / {totalBooks}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col sm:flex-row items-center gap-3">
          <button
            id="gameover-restart-btn"
            onClick={onRestart}
            className="flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-amber-600 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Coba Lagi (R)</span>
          </button>

          <button
            id="gameover-home-btn"
            onClick={onGoHome}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="h-5 w-5" />
            <span className="sm:hidden">Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
