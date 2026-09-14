import { BookItem, FireRock, FinishGate, Particle, Platform, Player } from '../types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public render(
    player: Player,
    platforms: Platform[],
    books: BookItem[],
    fireRocks: FireRock[],
    finishGate: FinishGate,
    particles: Particle[],
    cameraX: number,
    levelWidth: number,
    time: number
  ) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Parallax School Background
    this.drawBackground(cameraX, levelWidth, time);

    // Save context for camera translation
    ctx.save();
    ctx.translate(-cameraX, 0);

    // 1.5. Render School Campus Environment (Fence, Trees, Ceremony Flagpoles in Courtyard)
    this.drawSchoolEnvironment(levelWidth, time);

    // 2. Render Platforms (Ground, Desks, Bookshelves, Floating Grass)
    this.drawPlatforms(platforms);

    // 3. Render Finish Gate
    this.drawFinishGate(finishGate, time);

    // 4. Render Collectible Books
    this.drawBooks(books, time);

    // 5. Render Fire Rocks (Rintangan Batu Api)
    this.drawFireRocks(fireRocks, time);

    // 6. Render Particles
    this.drawParticles(particles);

    // 7. Render Student Character (Siswa Sekolah)
    this.drawStudent(player, time);

    ctx.restore();
  }

  // --- BACKGROUND & PARALLAX ---
  private drawBackground(cameraX: number, levelWidth: number, time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Sky Gradient: Bright, refreshing morning school sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#38bdf8');   // Vivid clear morning blue
    skyGrad.addColorStop(0.5, '#bae6fd');  // Soft light sky
    skyGrad.addColorStop(0.85, '#fef08a'); // Warm sunrise horizon glow
    skyGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Distant Morning Sun with glowing atmospheric corona
    ctx.save();
    const sunX = w * 0.85 - ((cameraX * 0.03) % (w + 150));
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.beginPath();
    ctx.arc(sunX, 85, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.beginPath();
    ctx.arc(sunX, 85, 68, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Floating Clouds (Parallax 0.12)
    this.drawClouds(cameraX, time);

    // 4. Distant Mountains (Parallax 0.10)
    this.drawDistantMountains(cameraX);

    // 5. Distant School Campus Panorama (Parallax 0.20 - sits comfortably low on horizon)
    this.drawDistantCampus(cameraX, time);
  }

  private drawClouds(cameraX: number, time: number) {
    const ctx = this.ctx;
    const clouds = [
      { base: 60, y: 55, scale: 1.1, speed: 10 },
      { base: 360, y: 100, scale: 0.85, speed: 7 },
      { base: 680, y: 65, scale: 1.25, speed: 9 },
      { base: 1050, y: 90, scale: 0.9, speed: 12 },
    ];

    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    clouds.forEach(c => {
      const x = ((c.base + time * c.speed - cameraX * 0.10) % (this.width + 400)) - 100;
      ctx.beginPath();
      ctx.arc(x, c.y, 24 * c.scale, 0, Math.PI * 2);
      ctx.arc(x + 22 * c.scale, c.y - 10 * c.scale, 30 * c.scale, 0, Math.PI * 2);
      ctx.arc(x + 50 * c.scale, c.y - 6 * c.scale, 24 * c.scale, 0, Math.PI * 2);
      ctx.arc(x + 68 * c.scale, c.y + 4 * c.scale, 18 * c.scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Distant Mountain Ridges (Layer 1: far background, low on horizon)
  private drawDistantMountains(cameraX: number) {
    const ctx = this.ctx;
    const w = this.width;
    ctx.save();

    // Soft teal rolling hills sitting between y = 420 and y = 480
    const offset = -(cameraX * 0.10) % 600;
    ctx.fillStyle = 'rgba(153, 246, 228, 0.55)'; // Soft pastel teal/mint
    for (let x = -200 + offset; x < w + 600; x += 300) {
      ctx.beginPath();
      ctx.moveTo(x, 480);
      ctx.quadraticCurveTo(x + 150, 390, x + 300, 480);
      ctx.fill();
    }

    const offset2 = -(cameraX * 0.14) % 700;
    ctx.fillStyle = 'rgba(110, 231, 183, 0.45)'; // Soft emerald ridge
    for (let x = -250 + offset2; x < w + 700; x += 350) {
      ctx.beginPath();
      ctx.moveTo(x, 480);
      ctx.quadraticCurveTo(x + 175, 410, x + 350, 480);
      ctx.fill();
    }

    ctx.restore();
  }

  // Distant School Campus Panorama (Layer 2: distant horizon silhouette, strictly below y = 370)
  private drawDistantCampus(cameraX: number, time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const loopWidth = 1100;
    // Seamless positive modulo wrapping
    const rawOffset = -(cameraX * 0.18);
    const campusOffset = ((rawOffset % loopWidth) + loopWidth) % loopWidth - 400;

    ctx.save();
    // Atmospheric perspective: soft opacity so distant buildings never compete with foreground
    ctx.globalAlpha = 0.55;

    for (let bx = campusOffset; bx < w + 600; bx += 550) {
      // 1. Distant Classroom Wings (low profile, sits at y = 410 to 480)
      ctx.fillStyle = '#e2e8f0'; // Clean pale slate
      ctx.fillRect(bx, 410, 220, 70);

      // Classroom Wing Red Tile Roof
      ctx.fillStyle = '#f87171'; // Soft terracotta/red
      ctx.beginPath();
      ctx.moveTo(bx - 10, 410);
      ctx.lineTo(bx + 110, 380);
      ctx.lineTo(bx + 230, 410);
      ctx.closePath();
      ctx.fill();

      // Soft Distant Classroom Windows
      ctx.fillStyle = '#93c5fd';
      for (let col = 0; col < 6; col++) {
        ctx.fillRect(bx + 16 + col * 32, 424, 18, 14);
      }

      // 2. Distant Central Bell / Clock Tower (proportional, peaks at y = 345 - far below mid-air platforms)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(bx + 85, 360, 50, 50);

      // Tower triangular roof
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(bx + 78, 360);
      ctx.lineTo(bx + 110, 325);
      ctx.lineTo(bx + 142, 360);
      ctx.closePath();
      ctx.fill();

      // Small distant clock face
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bx + 110, 382, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Clock hands
      ctx.beginPath();
      ctx.moveTo(bx + 110, 382);
      ctx.lineTo(bx + 110, 375);
      ctx.moveTo(bx + 110, 382);
      ctx.lineTo(bx + 115, 382);
      ctx.stroke();

      // 3. Distant Green Campus Trees flanking the building
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(bx + 250, 440, 32, 0, Math.PI * 2);
      ctx.arc(bx + 280, 448, 26, 0, Math.PI * 2);
      ctx.arc(bx - 30, 445, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- SCHOOL ENVIRONMENT (IN WORLD SPACE, BEHIND PLATFORMS) ---
  private drawSchoolEnvironment(levelWidth: number, time: number) {
    const ctx = this.ctx;
    const groundY = 480;

    ctx.save();

    // 1. School Courtyard Perimeter Fence (Pagar Sekolah) along ground sections
    const groundSections = [
      { start: 0, end: 650 },
      { start: 750, end: 1450 },
      { start: 1600, end: 2300 },
      { start: 2420, end: 3380 },
    ];

    groundSections.forEach(sec => {
      // Horizontal fence rails
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(sec.start, groundY - 32, sec.end - sec.start, 4);
      ctx.fillRect(sec.start, groundY - 18, sec.end - sec.start, 4);

      // Fence posts
      for (let fx = sec.start + 15; fx < sec.end - 10; fx += 32) {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(fx, groundY - 40, 5, 40);
        // Post pointed cap
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(fx - 1, groundY - 40);
        ctx.lineTo(fx + 2.5, groundY - 45);
        ctx.lineTo(fx + 6, groundY - 40);
        ctx.closePath();
        ctx.fill();
      }
    });

    // 2. Campus Shade Trees (Pohon Peneduh Halaman Sekolah)
    // Placed at fixed, natural coordinates firmly rooted on groundY (480)
    const trees = [
      { x: 120, height: 110, crownR: 44 },
      { x: 790, height: 120, crownR: 48 },
      { x: 1390, height: 105, crownR: 42 },
      { x: 1720, height: 115, crownR: 46 },
      { x: 2260, height: 110, crownR: 45 },
      { x: 2500, height: 125, crownR: 50 },
      { x: 3100, height: 110, crownR: 44 },
    ];

    trees.forEach((t, idx) => {
      const sway = Math.sin(time * 2 + idx) * 3;
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(t.x - 7, groundY - t.height, 14, t.height);
      // Trunk root flare
      ctx.beginPath();
      ctx.moveTo(t.x - 14, groundY);
      ctx.lineTo(t.x - 7, groundY - 20);
      ctx.lineTo(t.x + 7, groundY - 20);
      ctx.lineTo(t.x + 14, groundY);
      ctx.closePath();
      ctx.fill();

      // Foliage Canopies
      const crownY = groundY - t.height;
      ctx.fillStyle = idx % 2 === 0 ? '#15803d' : '#16a34a';
      ctx.beginPath();
      ctx.arc(t.x + sway, crownY, t.crownR, 0, Math.PI * 2);
      ctx.arc(t.x - t.crownR * 0.45 + sway, crownY + 10, t.crownR * 0.75, 0, Math.PI * 2);
      ctx.arc(t.x + t.crownR * 0.45 + sway, crownY + 12, t.crownR * 0.75, 0, Math.PI * 2);
      ctx.arc(t.x + sway, crownY - t.crownR * 0.35, t.crownR * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Canopy highlight
      ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
      ctx.beginPath();
      ctx.arc(t.x + sway - 6, crownY - 10, t.crownR * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Dignified Indonesian Ceremonial Flagpoles (Tiang Bendera Merah Putih)
    // Anchored firmly on the ground in Lapangan Upacara (x = 880) and near Gerbang Sekolah (x = 3140)
    const flagpoles = [880, 3140];
    flagpoles.forEach(poleX => {
      // Concrete Pedestal Base on ground
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(poleX - 16, groundY - 8, 32, 8);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(poleX - 10, groundY - 16, 20, 8);

      // Silver flagpole extending up to y = 260
      const poleTopY = 260;
      const poleH = groundY - 16 - poleTopY;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(poleX - 2.5, poleTopY, 5, poleH);

      // Gold sphere finial on top
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(poleX, poleTopY - 3, 5, 0, Math.PI * 2);
      ctx.fill();

      // Sang Saka Merah Putih (Indonesian Flag) fluttering proudly
      const flutter = Math.round(Math.sin(time * 5 + poleX * 0.01) * 4);
      const flagLeft = poleX + 2.5;
      const flagRight = flagLeft + 42;
      const topY1 = poleTopY + 4;
      const topY2 = topY1 + flutter;
      const midY1 = topY1 + 14;
      const midY2 = midY1 + flutter;
      const botY1 = topY1 + 28;
      const botY2 = botY1 + flutter;

      // Red Top
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(flagLeft, topY1);
      ctx.lineTo(flagRight, topY2);
      ctx.lineTo(flagRight, midY2);
      ctx.lineTo(flagLeft, midY1);
      ctx.closePath();
      ctx.fill();

      // White Bottom (with 0.5px overlap to avoid rendering seam lines)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(flagLeft, midY1 - 0.5);
      ctx.lineTo(flagRight, midY2 - 0.5);
      ctx.lineTo(flagRight, botY2);
      ctx.lineTo(flagLeft, botY1);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }

  // --- PLATFORMS ---
  private drawPlatforms(platforms: Platform[]) {
    const ctx = this.ctx;

    platforms.forEach(p => {
      if (p.type === 'ground') {
        // Lush Ground: Green top grass layer with earth below
        // Top Grass
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(p.x, p.y, p.width, 16);

        // Grass blades detailing
        ctx.fillStyle = '#22c55e';
        for (let gx = p.x; gx < p.x + p.width - 10; gx += 14) {
          ctx.beginPath();
          ctx.moveTo(gx, p.y);
          ctx.lineTo(gx + 5, p.y - 7);
          ctx.lineTo(gx + 10, p.y);
          ctx.fill();
        }

        // Earth/Dirt body
        ctx.fillStyle = '#78350f';
        ctx.fillRect(p.x, p.y + 16, p.width, p.height - 16);

        // Subsoil stones
        ctx.fillStyle = '#92400e';
        for (let sx = p.x + 20; sx < p.x + p.width - 20; sx += 60) {
          ctx.beginPath();
          ctx.arc(sx, p.y + 45, 8, 0, Math.PI * 2);
          ctx.arc(sx + 30, p.y + 70, 11, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p.type === 'desk') {
        // School Study Desk Platform
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        const pw = Math.round(p.width);

        // Desk Wooden Top with subtle bevel
        ctx.fillStyle = '#b45309';
        ctx.fillRect(px, py, pw, 10);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(px, py, pw, 3);

        // Desk Metal Frame & Drawer
        ctx.fillStyle = '#475569';
        ctx.fillRect(px + 8, py + 10, pw - 16, 12);
        // Small drawer pull knob
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(px + pw / 2 - 4, py + 14, 8, 3);

        // Metal Legs
        ctx.fillStyle = '#334155';
        ctx.fillRect(px + 12, py + 22, 6, 8);
        ctx.fillRect(px + pw - 18, py + 22, 6, 8);
      } else if (p.type === 'bookshelf') {
        // Library Bookshelf Platform
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        const pw = Math.round(p.width);
        const ph = Math.round(p.height);

        // Shelf Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(px + 3, py + ph, pw - 6, 4);

        // Mahogany wooden frame
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(px, py, pw, ph);
        // Top ledge highlight
        ctx.fillStyle = '#9a3412';
        ctx.fillRect(px, py, pw, 3);

        // Colorful book spines on the shelf
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        let curX = px + 6;
        let colorIdx = 0;
        while (curX < px + pw - 12) {
          const bw = 10 + (colorIdx % 3) * 2;
          ctx.fillStyle = colors[colorIdx % colors.length];
          ctx.fillRect(curX, py + 3, bw, ph - 6);
          // Book title line (clear integer alignment)
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fillRect(curX + 2, py + 8, bw - 4, 2);
          curX += bw + 3;
          colorIdx++;
        }
      } else if (p.type === 'brick') {
        // School Brick Wall Platform
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        const pw = Math.round(p.width);
        const ph = Math.round(p.height);

        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(px, py, pw, ph);
        // Mortar lines
        ctx.strokeStyle = '#fecaca';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px, py, pw, ph);
        ctx.beginPath();
        ctx.moveTo(px, py + ph / 2);
        ctx.lineTo(px + pw, py + ph / 2);
        for (let bx = px + 18; bx < px + pw; bx += 36) {
          ctx.moveTo(bx, py);
          ctx.lineTo(bx, py + ph / 2);
          ctx.moveTo(bx + 18, py + ph / 2);
          ctx.lineTo(bx + 18, py + ph);
        }
        ctx.stroke();
      } else {
        // Floating Grass Island Platform
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        const pw = Math.round(p.width);
        const ph = Math.round(p.height);

        // Earthen floating island rock underside
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(px + 4, py + 8);
        ctx.lineTo(px + pw - 4, py + 8);
        ctx.quadraticCurveTo(px + pw - 6, py + ph + 4, px + pw * 0.55, py + ph + 6);
        ctx.quadraticCurveTo(px + pw * 0.4, py + ph + 8, px + pw * 0.3, py + ph + 4);
        ctx.quadraticCurveTo(px + 6, py + ph, px + 4, py + 8);
        ctx.closePath();
        ctx.fill();

        // Subsoil stone flecks
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(px + pw * 0.45, py + 14, 4, 0, Math.PI * 2);
        ctx.arc(px + pw * 0.65, py + 13, 3, 0, Math.PI * 2);
        ctx.fill();

        // Lush Top Grass Layer
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(px, py, pw, 10);

        // Grass Highlight & Blades
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px + 2, py + 1, pw - 4, 3);
        for (let gx = px + 6; gx < px + pw - 8; gx += 14) {
          ctx.beginPath();
          ctx.moveTo(gx, py);
          ctx.lineTo(gx + 3, py - 4);
          ctx.lineTo(gx + 6, py);
          ctx.fill();
        }
      }
    });
  }

  // --- COLLECTIBLE BOOKS ---
  private drawBooks(books: BookItem[], time: number) {
    const ctx = this.ctx;

    books.forEach(b => {
      if (b.collected) return;

      const hover = Math.sin(time * 3 + b.bounceOffset) * 6;
      const x = Math.round(b.x);
      const y = Math.round(b.y + hover);
      const bw = Math.round(b.width);
      const bh = Math.round(b.height);

      // Glow halo for golden and special books
      if (b.subject === 'golden') {
        ctx.save();
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 14;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.beginPath();
        ctx.arc(x + bw / 2, y + bh / 2, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      // Book Base Cover
      let coverColor = '#2563eb'; // math
      if (b.subject === 'science') coverColor = '#059669';
      if (b.subject === 'art') coverColor = '#9333ea'; // Buku Ungu (Seni Rupa & Desain Kreatif)
      if (b.subject === 'history') coverColor = '#ea580c';
      if (b.subject === 'golden') coverColor = '#ca8a04';

      // Book Drop Shadow (integer aligned)
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(x + 3, y + 3, bw, bh);

      // Book Spine & Cover with robust cross-browser rounded corners
      ctx.fillStyle = coverColor;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, bw, bh, 4);
      } else {
        const radius = 4;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + bw - radius, y);
        ctx.quadraticCurveTo(x + bw, y, x + bw, y + radius);
        ctx.lineTo(x + bw, y + bh - radius);
        ctx.quadraticCurveTo(x + bw, y + bh, x + bw - radius, y + bh);
        ctx.lineTo(x + radius, y + bh);
        ctx.quadraticCurveTo(x, y + bh, x, y + bh - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }
      ctx.fill();

      // Pages on right side
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x + bw - 6, y + 3, 4, bh - 6);

      // Bookmark ribbon hanging from bottom
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(x + Math.floor(bw / 2) - 3, y + bh);
      ctx.lineTo(x + Math.floor(bw / 2) + 3, y + bh);
      ctx.lineTo(x + Math.floor(bw / 2), y + bh + 7);
      ctx.closePath();
      ctx.fill();

      // Cover Emblem / Symbol
      ctx.fillStyle = '#ffffff';
      if (b.subject === 'golden') {
        // Golden Star
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', x + bw / 2 - 2, y + bh / 2 + 5);
      } else if (b.subject === 'art') {
        // Palette / diamond clean emblem for purple art book without awkward line artifacts
        ctx.fillStyle = '#f3e8ff';
        ctx.beginPath();
        ctx.arc(x + 10, y + 12, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(x + 5, y + 18, bw - 14, 2);
      } else {
        // Book clean title stripes
        ctx.fillRect(x + 4, y + 9, bw - 12, 3);
        ctx.fillRect(x + 4, y + 16, bw - 14, 2);
      }

      // Sparkle particle around book
      const sparkleOffset = (time * 2 + b.bounceOffset) % 1;
      ctx.fillStyle = b.subject === 'golden' ? '#fef08a' : (b.subject === 'art' ? '#e9d5ff' : '#ffffff');
      ctx.beginPath();
      ctx.arc(
        Math.round(x + Math.sin(time * 4) * 16 + bw / 2),
        Math.round(y - 4 + sparkleOffset * 6),
        2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();
    });
  }

  // --- FIRE ROCKS (BATU API) ---
  private drawFireRocks(fireRocks: FireRock[], time: number) {
    const ctx = this.ctx;

    fireRocks.forEach(rock => {
      const cx = rock.x;
      const cy = rock.y;
      const r = rock.radius;

      ctx.save();

      // 1. Ambient Fire Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 2.2);
      glowGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      glowGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.2)');
      glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Flickering Animated Flame Tongues on Top/Sides
      const flameCount = 5;
      for (let i = 0; i < flameCount; i++) {
        const flameAngle = -Math.PI / 2 + ((i - 2) * Math.PI) / 6;
        const flamePulse = Math.sin(time * 12 + rock.flamePhase + i) * 6;
        const flameHeight = r * 1.2 + flamePulse;

        const fx = cx + Math.cos(flameAngle) * (r * 0.7);
        const fy = cy + Math.sin(flameAngle) * (r * 0.7);
        const tipX = cx + Math.cos(flameAngle) * flameHeight;
        const tipY = cy + Math.sin(flameAngle) * flameHeight;

        const flameGrad = ctx.createLinearGradient(fx, fy, tipX, tipY);
        flameGrad.addColorStop(0, '#f97316');
        flameGrad.addColorStop(0.6, '#ef4444');
        flameGrad.addColorStop(1, 'rgba(254, 240, 138, 0.1)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(fx - 6, fy);
        ctx.quadraticCurveTo(tipX + Math.sin(time * 8 + i) * 4, (fy + tipY) / 2, tipX, tipY);
        ctx.quadraticCurveTo(tipX - Math.sin(time * 8 + i) * 4, (fy + tipY) / 2, fx + 6, fy);
        ctx.fill();
      }

      // 3. Jagged Molten Rock Core (Dark Charcoal Magma Rock)
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      // Draw craggy rock contour
      const points = 8;
      for (let p = 0; p < points; p++) {
        const angle = (p * Math.PI * 2) / points;
        const dist = r * (0.85 + (Math.sin(p * 3 + rock.flamePhase) * 0.15));
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Rock Border
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 4. Glowing Magma Cracks inside the rock
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.5, cy - r * 0.2);
      ctx.lineTo(cx, cy + r * 0.3);
      ctx.lineTo(cx + r * 0.4, cy - r * 0.1);
      ctx.stroke();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.2, cy - r * 0.1);
      ctx.lineTo(cx + r * 0.1, cy + r * 0.2);
      ctx.stroke();

      // 5. Rising Ember Spark
      const emberY = cy - r - ((time * 30 + rock.flamePhase * 10) % 25);
      const emberX = cx + Math.sin(time * 6 + rock.flamePhase) * 10;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(emberX, emberY, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  // --- SCHOOL FINISH GATE (GERBANG SEKOLAH) ---
  private drawFinishGate(gate: FinishGate, time: number) {
    const ctx = this.ctx;
    const x = gate.x;
    const y = gate.y;
    const w = gate.width;
    const h = gate.height;

    ctx.save();

    // Pillar 1 & Pillar 2 (School Gate Posts)
    const pillarWidth = 22;
    ctx.fillStyle = '#1e293b'; // Slate dark blue pillars
    ctx.fillRect(x, y, pillarWidth, h);
    ctx.fillRect(x + w - pillarWidth, y, pillarWidth, h);

    // Pillar Gold Capitals
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 3, y - 6, pillarWidth + 6, 8);
    ctx.fillRect(x + w - pillarWidth - 3, y - 6, pillarWidth + 6, 8);

    // School Archway Beam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + pillarWidth - 2, y + 8, w - (pillarWidth * 2) + 4, 30);

    // Sign text "GERBANG SEKOLAH"
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GERBANG SEKOLAH', x + w / 2, y + 26);

    // School Bell in center
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(x + w / 2, y - 4, 10, Math.PI, 0);
    ctx.lineTo(x + w / 2 + 10, y + 8);
    ctx.lineTo(x + w / 2 - 10, y + 8);
    ctx.closePath();
    ctx.fill();

    // Gate Iron Bars with gentle welcoming light
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    for (let barX = x + pillarWidth + 10; barX < x + w - pillarWidth - 6; barX += 14) {
      ctx.beginPath();
      ctx.moveTo(barX, y + 38);
      ctx.lineTo(barX, y + h);
      ctx.stroke();
    }

    // Welcoming Pathway Light
    const gateGlow = ctx.createRadialGradient(x + w / 2, y + h - 20, 10, x + w / 2, y + h - 20, 60);
    gateGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    gateGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = gateGlow;
    ctx.fillRect(x - 20, y + 30, w + 40, h);

    // Finish Pennants fluttering on top
    const pennants = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
    pennants.forEach((col, idx) => {
      const px = x + 10 + idx * 18;
      const flutter = Math.sin(time * 6 + idx) * 3;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(px, y - 10);
      ctx.lineTo(px + 12, y - 10 + flutter);
      ctx.lineTo(px + 6, y - 2);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }

  // --- STUDENT CHARACTER (SISWA SEKOLAH) ---
  private drawStudent(player: Player, time: number) {
    const ctx = this.ctx;
    const x = player.x;
    const y = player.y;
    const w = player.width;
    const h = player.height;

    // Flash when invulnerable after damage
    if (player.invulnerableTimer > 0) {
      if (Math.floor(time * 20) % 2 === 0) {
        return; // blinking effect
      }
    }

    ctx.save();
    const cx = x + w / 2;
    const cy = y + h / 2;

    // Flip horizontal if facing left
    if (player.facing === 'left') {
      ctx.translate(cx, cy);
      ctx.scale(-1, 1);
      ctx.translate(-cx, -cy);
    }

    const isRunning = Math.abs(player.vx) > 0.4 && player.isGrounded;
    const isAirborne = !player.isGrounded;
    const runCycle = Math.sin(player.runFrame * 1.2);

    // 1. School Backpack (Tas Ransel) on student's back
    ctx.save();
    const backpackX = cx - 18;
    const backpackY = cy - 2;
    const backpackBounce = isRunning ? Math.abs(Math.sin(player.runFrame * 1.2)) * 2 : 0;

    // Backpack Body (Vibrant Navy/Teal)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(backpackX - 4, backpackY - 14 - backpackBounce, 14, 24, 4);
    ctx.fill();
    // Backpack Pocket
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(backpackX - 3, backpackY - 4 - backpackBounce, 12, 12);
    // Yellow zipper
    ctx.fillStyle = '#facc15';
    ctx.fillRect(backpackX + 1, backpackY - 12 - backpackBounce, 4, 3);
    // Ruler / Pencil sticking out of backpack
    ctx.fillStyle = '#f97316';
    ctx.fillRect(backpackX - 1, backpackY - 20 - backpackBounce, 3, 10);
    ctx.restore();

    // 2. Legs & Shoes (Walking animation or Jump tuck)
    ctx.fillStyle = '#1e3a8a'; // Navy Blue School Shorts/Skirt
    const legW = 6;
    const legH = 12;

    let leg1Angle = 0;
    let leg2Angle = 0;
    if (isRunning) {
      leg1Angle = runCycle * 0.6;
      leg2Angle = -runCycle * 0.6;
    } else if (isAirborne) {
      leg1Angle = 0.4;
      leg2Angle = -0.3;
    }

    // Left Leg (Back)
    ctx.save();
    ctx.translate(cx - 3, cy + 10);
    ctx.rotate(leg2Angle);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-legW / 2, 0, legW, legH);
    // White sock & Black School Shoes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-legW / 2, legH - 4, legW, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-legW / 2 - 1, legH - 2, legW + 3, 4);
    ctx.restore();

    // Right Leg (Front)
    ctx.save();
    ctx.translate(cx + 4, cy + 10);
    ctx.rotate(leg1Angle);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-legW / 2, 0, legW, legH);
    // White sock & Black School Shoes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-legW / 2, legH - 4, legW, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-legW / 2 - 1, legH - 2, legW + 3, 4);
    ctx.restore();

    // 3. Body / School Uniform Shirt (Crisp White Shirt)
    ctx.fillStyle = '#f8fafc'; // White shirt
    ctx.beginPath();
    ctx.roundRect(cx - 9, cy - 8, 18, 18, 3);
    ctx.fill();

    // Red School Necktie (Dasi Merah Siswa)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 7);
    ctx.lineTo(cx + 2, cy - 7);
    ctx.lineTo(cx + 3, cy + 3);
    ctx.lineTo(cx, cy + 6);
    ctx.lineTo(cx - 3, cy + 3);
    ctx.closePath();
    ctx.fill();

    // Shirt Collar
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 8);
    ctx.lineTo(cx, cy - 4);
    ctx.lineTo(cx + 5, cy - 8);
    ctx.stroke();

    // 4. Arms
    ctx.fillStyle = '#f8fafc'; // Shirt sleeve
    const armAngle = isRunning ? -runCycle * 0.7 : (isAirborne ? -0.8 : 0.1);
    ctx.save();
    ctx.translate(cx + 2, cy - 4);
    ctx.rotate(armAngle);
    ctx.fillRect(-3, 0, 6, 8);
    // Hand
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(0, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Student Head & Face
    // Skin Tone
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(cx, cy - 17, 11, 0, Math.PI * 2);
    ctx.fill();

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath();
    ctx.arc(cx + 5, cy - 14, 3, 0, Math.PI * 2);
    ctx.fill();

    // Big Expressive Eye
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx + 4, cy - 18, 2.8, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + 5, cy - 19, 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Cheerful Smile
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx + 3, cy - 14, 3, 0.2, Math.PI * 0.85);
    ctx.stroke();

    // 6. Student Hair & Cap / Haircut (Neat Student Hair)
    ctx.fillStyle = '#451a03'; // Dark brown neat hair
    ctx.beginPath();
    ctx.arc(cx - 1, cy - 20, 11, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineTo(cx + 8, cy - 18);
    ctx.lineTo(cx + 2, cy - 24);
    ctx.lineTo(cx - 6, cy - 20);
    ctx.closePath();
    ctx.fill();

    // Indonesian School Cap (Topi Sekolah Merah-Putih / Biru)
    ctx.fillStyle = '#dc2626'; // Red cap top
    ctx.beginPath();
    ctx.arc(cx, cy - 25, 9, Math.PI, 0);
    ctx.fill();
    // White Cap Visor / Front
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx + 5, cy - 24, 7, 2.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Cap logo emblem
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx + 2, cy - 27, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- PARTICLES ---
  private drawParticles(particles: Particle[]) {
    const ctx = this.ctx;

    particles.forEach(p => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;

      if (p.type === 'star') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'confetti') {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 1.5);
      } else if (p.type === 'fire') {
        const rad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.size);
        rad.addColorStop(0, '#fef08a');
        rad.addColorStop(0.5, '#ef4444');
        rad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Dust / Smoke
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }
}
