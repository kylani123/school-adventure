import React from 'react';
import { Play, BookOpen, Flame, Trophy, Volume2, VolumeX, ArrowLeftRight, ArrowUp } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  highScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  highScore,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 p-4 sm:p-6 select-none font-sans">
      {/* Decorative Cloud Background Elements */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-56 w-56 rounded-full bg-white/40 blur-2xl" />
      <div className="pointer-events-none absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-white/30 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-emerald-600 to-transparent opacity-40" />

      {/* Main Card Container */}
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center rounded-3xl bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md border-4 border-amber-300">
        {/* Top Badges */}
        <div className="flex w-full items-center justify-between">
          {/* High score badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 border border-amber-200 text-xs font-bold text-amber-800">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Skor Tertinggi: {highScore}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="menu-toggle-sound-btn"
            onClick={onToggleMute}
            className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            title={isMuted ? 'Suara Mati' : 'Suara Aktif'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-slate-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-600" />}
            <span>{isMuted ? 'Mute' : 'Musik On'}</span>
          </button>
        </div>

        {/* Character & School Adventure Mascot */}
        <div className="my-4 flex flex-col items-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg ring-4 ring-amber-300">
            {/* SVG Student Icon with Backpack & School Cap */}
            <svg viewBox="0 0 100 100" className="h-24 w-24 drop-shadow-md">
              {/* Backpack */}
              <rect x="22" y="44" width="18" height="28" rx="5" fill="#0284c7" />
              <rect x="24" y="56" width="14" height="12" rx="2" fill="#0369a1" />
              <rect x="28" y="38" width="6" height="8" rx="1" fill="#f97316" />

              {/* Body / Shirt */}
              <rect x="36" y="48" width="30" height="24" rx="4" fill="#ffffff" />
              {/* Tie */}
              <polygon points="51,50 47,60 51,64 55,60" fill="#dc2626" />
              {/* Legs & Shoes */}
              <rect x="40" y="72" width="8" height="14" rx="2" fill="#1e3a8a" />
              <rect x="52" y="72" width="8" height="14" rx="2" fill="#1e3a8a" />
              <rect x="38" y="84" width="12" height="6" rx="2" fill="#0f172a" />
              <rect x="50" y="84" width="12" height="6" rx="2" fill="#0f172a" />

              {/* Head */}
              <circle cx="51" cy="34" r="14" fill="#fcd34d" />
              {/* Cap */}
              <path d="M 37 32 A 14 14 0 0 1 65 32 Z" fill="#dc2626" />
              <ellipse cx="66" cy="33" rx="8" ry="3" fill="#ffffff" />
              {/* Eye & Smile */}
              <circle cx="56" cy="34" r="2.5" fill="#0f172a" />
              <circle cx="57" cy="33" r="1" fill="#ffffff" />
              <path d="M 53 39 Q 56 42 59 39" stroke="#92400e" strokeWidth="1.5" fill="none" />
              {/* Rosy Cheek */}
              <circle cx="57" cy="38" r="2.5" fill="rgba(244,114,182,0.6)" />
            </svg>

            {/* Sparkle badge */}
            <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-amber-900 shadow">
              ★
            </span>
          </div>

          <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            School Adventure
          </h1>
          <p className="mt-1 text-center text-sm font-medium text-slate-600 max-w-sm">
            Petualangan seru siswa sekolah mengumpulkan buku pelajaran dan menghindari rintangan batu api!
          </p>
        </div>

        {/* Start Game Button (Prominent & Pulsing) */}
        <button
          id="btn-start-adventure"
          onClick={onStartGame}
          className="group relative flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl hover:from-emerald-600 hover:to-green-700 active:scale-95 cursor-pointer"
        >
          <Play className="h-6 w-6 fill-white" />
          <span>MULAI PETUALANGAN</span>
        </button>

        {/* How to Play Guide Card */}
        <div className="mt-6 w-full rounded-2xl bg-slate-50 p-4 border border-slate-200">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Panduan Bermain (Kontrol Desktop)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm border border-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800">A / D</span> atau <span className="font-bold text-slate-800">◄ ►</span>
                <p className="text-[11px] text-slate-500">Bergerak ke kiri & kanan</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm border border-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold">
                <ArrowUp className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800">Spasi / W / ▲</span>
                <p className="text-[11px] text-slate-500">Melompat ke platform</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm border border-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 font-bold">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-amber-700">Kumpulkan Buku</span>
                <p className="text-[11px] text-slate-500">Dapatkan skor & prestasi</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm border border-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 font-bold">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-red-600">Hindari Batu Api</span>
                <p className="text-[11px] text-slate-500">Rintangan membakar nyawa!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
