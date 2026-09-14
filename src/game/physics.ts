import { BookItem, FireRock, FinishGate, Particle, Platform, Player } from '../types';

export const GRAVITY = 0.55;
export const MAX_FALL_SPEED = 12;
export const MOVE_SPEED = 4.8;
export const ACCELERATION = 0.8;
export const FRICTION = 0.82;
export const JUMP_FORCE = -11.5;

export function updatePhysics(
  player: Player,
  keys: { left: boolean; right: boolean; jump: boolean },
  platforms: Platform[],
  books: BookItem[],
  fireRocks: FireRock[],
  finishGate: FinishGate,
  particles: Particle[],
  levelWidth: number,
  levelHeight: number,
  deltaTime: number,
  callbacks: {
    onCollectBook: (book: BookItem) => void;
    onHurt: () => void;
    onGameOver: () => void;
    onVictory: () => void;
  }
) {
  // Update timers
  if (player.invulnerableTimer > 0) {
    player.invulnerableTimer = Math.max(0, player.invulnerableTimer - deltaTime);
  }
  if (player.coyoteTime > 0) {
    player.coyoteTime = Math.max(0, player.coyoteTime - deltaTime);
  }
  if (player.jumpBuffer > 0) {
    player.jumpBuffer = Math.max(0, player.jumpBuffer - deltaTime);
  }

  // 1. Moving Platforms Update
  platforms.forEach(p => {
    if (p.moving) {
      const { axis, distance, speed, startX, startY } = p.moving;
      const progress = (Math.sin(Date.now() * 0.002 * speed) + 1) / 2; // 0 to 1
      const oldX = p.x;
      const oldY = p.y;

      if (axis === 'x') {
        p.x = startX + distance * progress;
        // If player is standing on this platform, carry them along
        if (player.isGrounded && isPlayerOnPlatform(player, p)) {
          player.x += p.x - oldX;
        }
      } else if (axis === 'y') {
        p.y = startY + distance * progress;
        if (player.isGrounded && isPlayerOnPlatform(player, p)) {
          player.y += p.y - oldY;
        }
      }
    }
  });

  // 2. Fire Rocks Patrol & Animation Phase
  fireRocks.forEach(rock => {
    rock.flamePhase += deltaTime * 2;
    if (rock.patrol) {
      rock.x += rock.patrol.speed * rock.patrol.direction;
      if (rock.x >= rock.patrol.endX) {
        rock.x = rock.patrol.endX;
        rock.patrol.direction = -1;
      } else if (rock.x <= rock.patrol.startX) {
        rock.x = rock.patrol.startX;
        rock.patrol.direction = 1;
      }
    }
  });

  // 3. Horizontal Movement
  if (keys.left) {
    player.vx -= ACCELERATION;
    player.facing = 'left';
    player.runFrame += 0.2;
    // Spawn tiny run dust particle occasionally
    if (player.isGrounded && Math.random() < 0.25) {
      spawnDust(particles, player.x + player.width / 2 + 5, player.y + player.height);
    }
  } else if (keys.right) {
    player.vx += ACCELERATION;
    player.facing = 'right';
    player.runFrame += 0.2;
    if (player.isGrounded && Math.random() < 0.25) {
      spawnDust(particles, player.x + player.width / 2 - 5, player.y + player.height);
    }
  } else {
    player.vx *= FRICTION;
    if (Math.abs(player.vx) < 0.05) {
      player.vx = 0;
      player.runFrame = 0;
    }
  }

  // Clamp horizontal speed
  player.vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, player.vx));

  // 4. Jumping with Coyote Time & Jump Buffer
  if (keys.jump) {
    player.jumpBuffer = 0.12; // 120ms buffer
  }

  const canJump = player.isGrounded || player.coyoteTime > 0;
  if (player.jumpBuffer > 0 && canJump && !player.isJumping) {
    player.vy = JUMP_FORCE;
    player.isGrounded = false;
    player.isJumping = true;
    player.coyoteTime = 0;
    player.jumpBuffer = 0;

    // Jump puff particles
    for (let i = 0; i < 4; i++) {
      spawnDust(particles, player.x + player.width / 2 + (Math.random() * 10 - 5), player.y + player.height);
    }
  }

  // 5. Apply Gravity
  player.vy += GRAVITY;
  if (player.vy > MAX_FALL_SPEED) {
    player.vy = MAX_FALL_SPEED;
  }

  // 6. Integrate & Collide X
  player.x += player.vx;
  // Level boundaries X
  if (player.x < 10) {
    player.x = 10;
    player.vx = 0;
  }
  if (player.x + player.width > levelWidth - 10) {
    player.x = levelWidth - 10 - player.width;
    player.vx = 0;
  }

  // Horizontal collision with platforms
  for (const p of platforms) {
    if (checkAABB(player, p)) {
      if (player.vx > 0) {
        player.x = p.x - player.width;
        player.vx = 0;
      } else if (player.vx < 0) {
        player.x = p.x + p.width;
        player.vx = 0;
      }
    }
  }

  // 7. Integrate & Collide Y
  const prevY = player.y;
  player.y += player.vy;
  let onGroundThisFrame = false;

  for (const p of platforms) {
    if (checkAABB(player, p)) {
      // Landing on top of platform
      if (player.vy > 0 && prevY + player.height <= p.y + 14) {
        player.y = p.y - player.height;
        player.vy = 0;
        player.isGrounded = true;
        player.isJumping = false;
        player.coyoteTime = 0.15; // 150ms coyote time
        onGroundThisFrame = true;
      }
      // Hitting bottom of platform (head bonk)
      else if (player.vy < 0 && prevY >= p.y + p.height - 10) {
        player.y = p.y + p.height;
        player.vy = 0;
      }
    }
  }

  if (!onGroundThisFrame) {
    player.isGrounded = false;
  }

  // 8. Pit Fall Check (Jatuh ke Jurang)
  if (player.y > levelHeight + 60) {
    player.lives -= 1;
    callbacks.onHurt();

    if (player.lives <= 0) {
      callbacks.onGameOver();
      return;
    } else {
      // Respawn at safe start or nearest platform left
      player.x = Math.max(90, player.x - 350);
      player.y = 300;
      player.vx = 0;
      player.vy = 0;
      player.invulnerableTimer = 2.0;
    }
  }

  // 9. Collect Books
  books.forEach(book => {
    if (!book.collected) {
      const bookBox = {
        x: book.x,
        y: book.y,
        width: book.width,
        height: book.height,
      };

      if (checkAABB(player, bookBox)) {
        book.collected = true;
        callbacks.onCollectBook(book);

        // Spawn golden sparkle particles
        const colors = book.subject === 'golden' ? ['#fef08a', '#facc15', '#ffffff'] : ['#60a5fa', '#93c5fd', '#ffffff'];
        for (let i = 0; i < 12; i++) {
          particles.push({
            x: book.x + book.width / 2,
            y: book.y + book.height / 2,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5 - 1.5,
            life: 0.8,
            maxLife: 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 3.5 + 2,
            type: 'star',
          });
        }
      }
    }
  });

  // 10. Fire Rocks Collision (Rintangan Batu Api)
  if (player.invulnerableTimer <= 0) {
    for (const rock of fireRocks) {
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      const dist = Math.hypot(playerCenterX - rock.x, playerCenterY - rock.y);

      // Collision threshold
      if (dist < rock.radius + player.width * 0.42) {
        player.lives -= 1;
        player.invulnerableTimer = 1.8; // 1.8s invulnerable blinking
        player.vy = -7; // small knockback upwards
        player.vx = player.x < rock.x ? -5 : 5;

        // Spawn fire particles
        for (let i = 0; i < 16; i++) {
          particles.push({
            x: rock.x,
            y: rock.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 2,
            life: 0.6,
            maxLife: 0.6,
            color: '#ef4444',
            size: Math.random() * 5 + 3,
            type: 'fire',
          });
        }

        callbacks.onHurt();

        if (player.lives <= 0) {
          callbacks.onGameOver();
          return;
        }
        break;
      }
    }
  }

  // 11. Finish Gate Check (Gerbang Sekolah)
  const gateBox = {
    x: finishGate.x,
    y: finishGate.y,
    width: finishGate.width,
    height: finishGate.height,
  };

  if (checkAABB(player, gateBox) && !finishGate.reached) {
    finishGate.reached = true;
    // Confetti celebration particles
    const confettiColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff'];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: finishGate.x + finishGate.width / 2 + (Math.random() - 0.5) * 80,
        y: finishGate.y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 7 - 2,
        life: 2.2,
        maxLife: 2.2,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 4 + 3,
        type: 'confetti',
      });
    }
    callbacks.onVictory();
  }

  // 12. Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= deltaTime;

    if (p.type === 'confetti' || p.type === 'dust') {
      p.vy += 0.12; // gravity on confetti/dust
    } else if (p.type === 'fire') {
      p.vy -= 0.05; // fire rises
      p.size = Math.max(0.5, p.size - 0.05);
    }

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function checkAABB(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function isPlayerOnPlatform(player: Player, p: Platform): boolean {
  return (
    player.x + player.width > p.x &&
    player.x < p.x + p.width &&
    Math.abs(player.y + player.height - p.y) < 3
  );
}

function spawnDust(particles: Particle[], x: number, y: number) {
  particles.push({
    x,
    y: y - 2,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -Math.random() * 0.8 - 0.2,
    life: 0.35,
    maxLife: 0.35,
    color: 'rgba(214, 211, 209, 0.7)',
    size: Math.random() * 2.5 + 1.5,
    type: 'dust',
  });
}
