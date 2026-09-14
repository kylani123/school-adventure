/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameScreen } from './types';
import { LEVEL_1 } from './game/levels';
import { audio } from './utils/audio';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { GameWinModal } from './components/GameWinModal';

const HIGH_SCORE_KEY = 'school_adventure_highscore';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [score, setScore] = useState<number>(0);
  const [booksCollected, setBooksCollected] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(audio.isMuted);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(HIGH_SCORE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const maxLives = 3;
  const totalBooks = LEVEL_1.books.length;

  // Sync high score when game ends
  useEffect(() => {
    if ((screen === 'gameover' || screen === 'victory') && score > highScore) {
      setHighScore(score);
      if (typeof window !== 'undefined') {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    }
  }, [screen, score, highScore]);

  // Handle Pause shortcut key (P or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (screen === 'playing') {
          setIsPaused(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen]);

  // Start new game
  const handleStartGame = useCallback(() => {
    audio.playClick();
    setScore(0);
    setBooksCollected(0);
    setLives(maxLives);
    setProgressPercent(0);
    setIsPaused(false);
    setScreen('playing');
    audio.startBgm();
  }, [maxLives]);

  // Restart game
  const handleRestart = useCallback(() => {
    audio.playClick();
    setScore(0);
    setBooksCollected(0);
    setLives(maxLives);
    setProgressPercent(0);
    setIsPaused(false);
    setScreen('playing');
    audio.startBgm();
  }, [maxLives]);

  // Return to Menu
  const handleGoHome = useCallback(() => {
    audio.playClick();
    audio.stopBgm();
    setIsPaused(false);
    setScreen('menu');
  }, []);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Toggle Pause
  const handleTogglePause = useCallback(() => {
    audio.playClick();
    setIsPaused(prev => !prev);
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-950 font-sans text-slate-800">
      {/* 1. Main Menu View */}
      {screen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          highScore={highScore}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. Active Platformer Gameplay View */}
      {(screen === 'playing' || screen === 'gameover' || screen === 'victory') && (
        <div className="relative h-full w-full">
          {/* Top Floating HUD Status Bar */}
          <HUD
            score={score}
            booksCollected={booksCollected}
            totalBooks={totalBooks}
            lives={lives}
            maxLives={maxLives}
            highScore={highScore}
            progressPercent={progressPercent}
            isMuted={isMuted}
            isPaused={isPaused}
            onToggleMute={handleToggleMute}
            onTogglePause={handleTogglePause}
            onRestart={handleRestart}
          />

          {/* Game Canvas with 60FPS Physics and Graphics */}
          <GameCanvas
            screen={screen}
            setScreen={setScreen}
            score={score}
            setScore={setScore}
            booksCollected={booksCollected}
            setBooksCollected={setBooksCollected}
            totalBooks={totalBooks}
            lives={lives}
            setLives={setLives}
            maxLives={maxLives}
            setProgressPercent={setProgressPercent}
            isPaused={isPaused}
            onRestart={handleRestart}
          />

          {/* 3. Game Over Screen Modal */}
          {screen === 'gameover' && (
            <GameOverModal
              score={score}
              booksCollected={booksCollected}
              totalBooks={totalBooks}
              highScore={highScore}
              onRestart={handleRestart}
              onGoHome={handleGoHome}
            />
          )}

          {/* 4. Victory / Game Win Screen Modal */}
          {screen === 'victory' && (
            <GameWinModal
              score={score}
              booksCollected={booksCollected}
              totalBooks={totalBooks}
              remainingLives={lives}
              maxLives={maxLives}
              highScore={highScore}
              onRestart={handleRestart}
              onGoHome={handleGoHome}
            />
          )}
        </div>
      )}
    </div>
  );
}
