import React, { useEffect } from 'react';
import { RotateCcw, Home, Star, BookOpen, Heart, Trophy } from 'lucide-react';

interface GameWinModalProps {
  score: number;
  booksCollected: number;
  totalBooks: number;
  remainingLives: number;
  maxLives: number;
  highScore: number;
  onRestart: () => void;
  onGoHome: () => void;
}

export const GameWinModal: React.FC<GameWinModalProps> = ({
  score,
  booksCollected,
  totalBooks,
  remainingLives,
  maxLives,
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

  // Calculate stars (1, 2, or 3)
  const bookPercentage = totalBooks > 0 ? booksCollected / totalBooks : 1;
  let stars = 1;
  if (bookPercentage >= 0.9 && remainingLives >= 2) {
    stars = 3;
  } else if (bookPercentage >= 0.6) {
    stars = 2;
  }

  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border-4 border-amber-400">
        {/* Star Ribbon / Trophy Icon */}
        <div className="relative -mt-14 mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-500 ring-8 ring-white shadow-lg">
          <Trophy className="h-10 w-10 fill-amber-400 text-amber-600 animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Selamat! Kamu Berhasil!
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Siswa berhasil melewati rintangan batu api dan sampai di Gerbang Sekolah dengan selamat!
        </p>

        {/* 3 Stars Award */}
        <div className="my-4 flex items-center justify-center gap-2">
          {[1, 2, 3].map(s => {
            const active = s <= stars;
            return (
              <Star
                key={s}
                className={`h-10 w-10 transition-all ${
                  active
                    ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md'
                    : 'fill-slate-200 text-slate-300 scale-90'
                }`}
              />
            );
          })}
        </div>

        {isNewHighScore && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-300">
            <Trophy className="h-3.5 w-3.5 text-amber-600" />
            <span>Rekor Skor Tertinggi Baru!</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-6 grid w-full grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-amber-50 p-2.5 border border-amber-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Total Skor</span>
            <div className="mt-1 font-mono text-lg font-black text-slate-900">{score}</div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-2.5 border border-blue-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Buku Pelajaran</span>
            <div className="mt-1 flex items-center justify-center gap-1 font-mono text-sm font-bold text-blue-700">
              <BookOpen className="h-3.5 w-3.5" />
              {booksCollected}/{totalBooks}
            </div>
          </div>

          <div className="rounded-2xl bg-red-50 p-2.5 border border-red-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Sisa Nyawa</span>
            <div className="mt-1 flex items-center justify-center gap-1 font-mono text-sm font-bold text-red-600">
              <Heart className="h-3.5 w-3.5 fill-red-500" />
              {remainingLives}/{maxLives}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col sm:flex-row items-center gap-3">
          <button
            id="gamewin-restart-btn"
            onClick={onRestart}
            className="flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-green-700 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Main Lagi (R)</span>
          </button>

          <button
            id="gamewin-home-btn"
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
