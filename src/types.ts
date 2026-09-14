export type GameScreen = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isJumping: boolean;
  facing: 'left' | 'right';
  lives: number;
  maxLives: number;
  invulnerableTimer: number; // seconds of invulnerability after damage
  runFrame: number;
  coyoteTime: number;
  jumpBuffer: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'brick' | 'desk' | 'bookshelf' | 'floating_grass';
  moving?: {
    axis: 'x' | 'y';
    distance: number;
    speed: number;
    startX: number;
    startY: number;
  };
}

export interface BookItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  subject: 'math' | 'science' | 'art' | 'history' | 'golden';
  title: string;
  points: number;
  bounceOffset: number;
}

export interface FireRock {
  id: string;
  x: number;
  y: number;
  radius: number;
  patrol?: {
    startX: number;
    endX: number;
    speed: number;
    direction: number;
  };
  flamePhase: number;
  flameSizeMultiplier?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'smoke' | 'star' | 'dust' | 'fire' | 'confetti';
}

export interface FinishGate {
  x: number;
  y: number;
  width: number;
  height: number;
  reached: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  targetBooks: number;
  playerStart: { x: number; y: number };
  platforms: Platform[];
  books: BookItem[];
  fireRocks: FireRock[];
  finishGate: FinishGate;
}

export interface GameStats {
  score: number;
  booksCollected: number;
  totalBooks: number;
  timeElapsed: number;
  highScore: number;
}
