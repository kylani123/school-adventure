import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LEVEL_1 } from '../game/levels';
import { updatePhysics } from '../game/physics';
import { GameRenderer } from '../game/renderer';
import { BookItem, FireRock, FinishGate, GameScreen, Particle, Platform, Player } from '../types';
import { audio } from '../utils/audio';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface GameCanvasProps {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  booksCollected: number;
  setBooksCollected: React.Dispatch<React.SetStateAction<number>>;
  totalBooks: number;
  lives: number;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  maxLives: number;
  setProgressPercent: (pct: number) => void;
  isPaused: boolean;
  onRestart: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  screen,
  setScreen,
  score,
  setScore,
  booksCollected,
  setBooksCollected,
  totalBooks,
  lives,
  setLives,
  maxLives,
  setProgressPercent,
  isPaused,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Game Entities (kept in ref for 60fps performance)
  const playerRef = useRef<Player>({
    x: LEVEL_1.playerStart.x,
    y: LEVEL_1.playerStart.y,
    width: 32,
    height: 44,
    vx: 0,
    vy: 0,
    isGrounded: false,
    isJumping: false,
    facing: 'right',
    lives: 3,
    maxLives: 3,
    invulnerableTimer: 0,
    runFrame: 0,
    coyoteTime: 0,
    jumpBuffer: 0,
  });

  const platformsRef = useRef<Platform[]>([]);
  const booksRef = useRef<BookItem[]>([]);
  const fireRocksRef = useRef<FireRock[]>([]);
  const finishGateRef = useRef<FinishGate>({ ...LEVEL_1.finishGate });
  const particlesRef = useRef<Particle[]>([]);
  const cameraXRef = useRef<number>(0);

  // Controls state
  const keysRef = useRef({
    left: false,
    right: false,
    jump: false,
  });

  // On-screen control states (visual feedback)
  const [activeLeft, setActiveLeft] = useState(false);
  const [activeRight, setActiveRight] = useState(false);
  const [activeJump, setActiveJump] = useState(false);

  // Initialize or Reset level state
  const initLevel = useCallback(() => {
    // Deep copy level data
    platformsRef.current = LEVEL_1.platforms.map(p => ({
      ...p,
      moving: p.moving ? { ...p.moving } : undefined,
    }));
    booksRef.current = LEVEL_1.books.map(b => ({ ...b, collected: false }));
    fireRocksRef.current = LEVEL_1.fireRocks.map(r => ({
      ...r,
      patrol: r.patrol ? { ...r.patrol } : undefined,
    }));
    finishGateRef.current = { ...LEVEL_1.finishGate, reached: false };
    particlesRef.current = [];
    cameraXRef.current = 0;

    playerRef.current = {
      x: LEVEL_1.playerStart.x,
      y: LEVEL_1.playerStart.y,
      width: 32,
      height: 44,
      vx: 0,
      vy: 0,
      isGrounded: false,
      isJumping: false,
      facing: 'right',
      lives: maxLives,
      maxLives: maxLives,
      invulnerableTimer: 0,
      runFrame: 0,
      coyoteTime: 0,
      jumpBuffer: 0,
    };
  }, [maxLives]);

  // Handle level initialization on mount or screen change to playing
  useEffect(() => {
    if (screen === 'playing') {
      initLevel();
    }
  }, [screen, initLevel]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'playing') return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
        setActiveLeft(true);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
        setActiveRight(true);
      } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!keysRef.current.jump) {
          audio.playJump();
        }
        keysRef.current.jump = true;
        setActiveJump(true);
      } else if (e.code === 'KeyR') {
        onRestart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
        setActiveLeft(false);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
        setActiveRight(false);
      } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.jump = false;
        setActiveJump(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen, onRestart]);

  // Main 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderer = new GameRenderer(ctx, canvas.width, canvas.height);
    let animationFrameId: number;
    let lastTime = performance.now();

    const renderLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap at 50ms to prevent collision tunneling
      lastTime = currentTime;

      if (screen === 'playing' && !isPaused) {
        // Run Physics
        updatePhysics(
          playerRef.current,
          keysRef.current,
          platformsRef.current,
          booksRef.current,
          fireRocksRef.current,
          finishGateRef.current,
          particlesRef.current,
          LEVEL_1.width,
          LEVEL_1.height,
          dt,
          {
            onCollectBook: (book: BookItem) => {
              audio.playCollectBook(book.subject === 'golden');
              setScore(prev => prev + book.points);
              setBooksCollected(prev => prev + 1);
            },
            onHurt: () => {
              audio.playHurt();
              setLives(playerRef.current.lives);
            },
            onGameOver: () => {
              audio.playGameOver();
              setLives(0);
              setScreen('gameover');
            },
            onVictory: () => {
              audio.playVictory();
              // Victory bonus
              const remainingLifeBonus = playerRef.current.lives * 150;
              const finishBonus = 500;
              setScore(prev => prev + finishBonus + remainingLifeBonus);
              setScreen('victory');
            },
          }
        );

        // Update Progress toward Finish Gate
        const totalDistance = LEVEL_1.finishGate.x - LEVEL_1.playerStart.x;
        const currentProgress = (playerRef.current.x - LEVEL_1.playerStart.x) / totalDistance;
        setProgressPercent(Math.max(0, Math.min(100, currentProgress * 100)));

        // Camera Tracking
        const targetCameraX = playerRef.current.x - canvas.width * 0.35;
        const maxCameraX = LEVEL_1.width - canvas.width;
        const clampedTargetX = Math.max(0, Math.min(maxCameraX, targetCameraX));
        cameraXRef.current += (clampedTargetX - cameraXRef.current) * 0.1;
      }

      // Render Frame
      renderer.render(
        playerRef.current,
        platformsRef.current,
        booksRef.current,
        fireRocksRef.current,
        finishGateRef.current,
        particlesRef.current,
        cameraXRef.current,
        LEVEL_1.width,
        currentTime * 0.001
      );

      // If Paused, overlay a subtle scrim and "DIJEDA" notice
      if (isPaused && screen === 'playing') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PERMAINAN DIJEDA', canvas.width / 2, canvas.height / 2 - 10);

        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#fde68a';
        ctx.fillText('Tekan tombol Jeda atau tombol (P) untuk melanjutkan', canvas.width / 2, canvas.height / 2 + 25);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [screen, isPaused, setScore, setBooksCollected, setLives, setProgressPercent, setScreen]);

  // Resize canvas responsively to container
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      // Keep crisp internal coordinate system
      // Fixed 960x540 (16:9 ratio) ensures platform physics feel consistent across screens
      canvas.width = 960;
      canvas.height = 540;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Touch / On-Screen Control Handlers
  const handleTouchLeftStart = () => {
    keysRef.current.left = true;
    setActiveLeft(true);
  };
  const handleTouchLeftEnd = () => {
    keysRef.current.left = false;
    setActiveLeft(false);
  };

  const handleTouchRightStart = () => {
    keysRef.current.right = true;
    setActiveRight(true);
  };
  const handleTouchRightEnd = () => {
    keysRef.current.right = false;
    setActiveRight(false);
  };

  const handleTouchJumpStart = () => {
    if (!keysRef.current.jump) {
      audio.playJump();
    }
    keysRef.current.jump = true;
    setActiveJump(true);
  };
  const handleTouchJumpEnd = () => {
    keysRef.current.jump = false;
    setActiveJump(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-900 select-none"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        id="game-canvas"
        className="max-h-full max-w-full aspect-[16/9] object-contain shadow-2xl"
      />

      {/* On-Screen Mobile / Accessibility Action Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex items-center justify-between px-4 sm:px-8">
        {/* Left & Right D-Pad */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            id="control-left-btn"
            onMouseDown={handleTouchLeftStart}
            onMouseUp={handleTouchLeftEnd}
            onMouseLeave={handleTouchLeftEnd}
            onTouchStart={handleTouchLeftStart}
            onTouchEnd={handleTouchLeftEnd}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 backdrop-blur-md transition-all active:scale-90 ${
              activeLeft
                ? 'bg-blue-600/90 text-white border-blue-400 scale-95 shadow-inner'
                : 'bg-white/80 text-slate-800 border-white/60 shadow-lg hover:bg-white/95'
            }`}
            aria-label="Gerak Kiri"
          >
            <ArrowLeft className="h-7 w-7" />
          </button>

          <button
            id="control-right-btn"
            onMouseDown={handleTouchRightStart}
            onMouseUp={handleTouchRightEnd}
            onMouseLeave={handleTouchRightEnd}
            onTouchStart={handleTouchRightStart}
            onTouchEnd={handleTouchRightEnd}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 backdrop-blur-md transition-all active:scale-90 ${
              activeRight
                ? 'bg-blue-600/90 text-white border-blue-400 scale-95 shadow-inner'
                : 'bg-white/80 text-slate-800 border-white/60 shadow-lg hover:bg-white/95'
            }`}
            aria-label="Gerak Kanan"
          >
            <ArrowRight className="h-7 w-7" />
          </button>
        </div>

        {/* Keyboard Helper Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md border border-white/10">
          <span>A / D: Jalan</span>
          <span>•</span>
          <span>Spasi: Lompat</span>
          <span>•</span>
          <span>R: Mulai Ulang</span>
        </div>

        {/* Jump Button */}
        <div className="pointer-events-auto">
          <button
            id="control-jump-btn"
            onMouseDown={handleTouchJumpStart}
            onMouseUp={handleTouchJumpEnd}
            onMouseLeave={handleTouchJumpEnd}
            onTouchStart={handleTouchJumpStart}
            onTouchEnd={handleTouchJumpEnd}
            className={`flex h-16 w-16 items-center justify-center rounded-3xl border-2 backdrop-blur-md transition-all active:scale-90 ${
              activeJump
                ? 'bg-amber-500 text-white border-amber-300 scale-95 shadow-inner'
                : 'bg-amber-400/90 text-slate-900 border-amber-200 shadow-xl hover:bg-amber-400'
            }`}
            aria-label="Lompat"
          >
            <ArrowUp className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
