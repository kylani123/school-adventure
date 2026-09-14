import { LevelData } from '../types';

export const LEVEL_1: LevelData = {
  id: 1,
  name: "Gerbang Petualangan Sekolah",
  subtitle: "Kumpulkan semua buku pelajaran & hindari batu api untuk mencapai Gerbang Sekolah!",
  width: 3400,
  height: 600,
  targetBooks: 12,
  playerStart: { x: 90, y: 400 },
  finishGate: {
    x: 3200,
    y: 350,
    width: 90,
    height: 130,
    reached: false,
  },
  platforms: [
    // Ground Section 1: Halaman Depan (0 to 650)
    { x: 0, y: 480, width: 650, height: 120, type: 'ground' },

    // Elevating platforms 1 (Desk & Floating Grass)
    { x: 220, y: 390, width: 110, height: 24, type: 'desk' },
    { x: 380, y: 310, width: 120, height: 24, type: 'floating_grass' },
    { x: 530, y: 250, width: 110, height: 24, type: 'bookshelf' },

    // Ground Gap 1 (650 to 750 is a pit with fire danger)
    // Ground Section 2: Lapangan Sekolah (750 to 1450)
    { x: 750, y: 480, width: 700, height: 120, type: 'ground' },

    // Raised platforms in Section 2
    { x: 820, y: 370, width: 120, height: 24, type: 'desk' },
    { x: 990, y: 300, width: 130, height: 24, type: 'brick' },
    { x: 1170, y: 240, width: 120, height: 24, type: 'bookshelf' },
    { x: 1320, y: 340, width: 110, height: 24, type: 'desk' },

    // Moving platform over Gap 2 (1450 to 1600)
    {
      x: 1480,
      y: 400,
      width: 100,
      height: 22,
      type: 'brick',
      moving: {
        axis: 'y',
        distance: 120,
        speed: 1.2,
        startX: 1480,
        startY: 400,
      },
    },

    // Ground Section 3: Koridor Luar Kelas (1600 to 2300)
    { x: 1600, y: 480, width: 700, height: 120, type: 'ground' },

    // Multi-tier Platforms Section 3 (Study Rooftop / Library)
    { x: 1680, y: 380, width: 110, height: 24, type: 'desk' },
    { x: 1840, y: 300, width: 130, height: 24, type: 'brick' },
    {
      x: 2010,
      y: 260,
      width: 110,
      height: 22,
      type: 'desk',
      moving: {
        axis: 'x',
        distance: 140,
        speed: 1.5,
        startX: 2010,
        startY: 260,
      },
    },
    { x: 2200, y: 350, width: 100, height: 24, type: 'bookshelf' },

    // Ground Gap 3 (2300 to 2420)
    // Ground Section 4: Taman Sekolah & Menuju Gerbang (2420 to 3400)
    { x: 2420, y: 480, width: 980, height: 120, type: 'ground' },

    // High Challenge Platforms before Finish
    { x: 2530, y: 390, width: 110, height: 24, type: 'floating_grass' },
    { x: 2690, y: 310, width: 120, height: 24, type: 'brick' },
    { x: 2860, y: 240, width: 130, height: 24, type: 'bookshelf' },
    { x: 3040, y: 330, width: 110, height: 24, type: 'desk' },
  ],
  books: [
    // Area 1: Halaman Depan (3 buku)
    {
      id: 'b1',
      x: 265,
      y: 345,
      width: 28,
      height: 32,
      collected: false,
      subject: 'math',
      title: 'Buku Matematika',
      points: 100,
      bounceOffset: 0,
    },
    {
      id: 'b2',
      x: 430,
      y: 265,
      width: 28,
      height: 32,
      collected: false,
      subject: 'science',
      title: 'Buku Sains Alam',
      points: 100,
      bounceOffset: 1,
    },
    {
      id: 'b3',
      x: 580,
      y: 205,
      width: 28,
      height: 32,
      collected: false,
      subject: 'art',
      title: 'Buku Seni Rupa',
      points: 150,
      bounceOffset: 2,
    },

    // Area 2: Lapangan (4 buku)
    {
      id: 'b4',
      x: 870,
      y: 325,
      width: 28,
      height: 32,
      collected: false,
      subject: 'history',
      title: 'Buku Sejarah',
      points: 100,
      bounceOffset: 0.5,
    },
    {
      id: 'b5',
      x: 1045,
      y: 255,
      width: 28,
      height: 32,
      collected: false,
      subject: 'math',
      title: 'Buku Aljabar',
      points: 100,
      bounceOffset: 1.5,
    },
    {
      id: 'b6',
      x: 1220,
      y: 195,
      width: 28,
      height: 32,
      collected: false,
      subject: 'golden',
      title: 'Buku Emas Prestasi',
      points: 250,
      bounceOffset: 2.2,
    },
    {
      id: 'b7',
      x: 1370,
      y: 295,
      width: 28,
      height: 32,
      collected: false,
      subject: 'science',
      title: 'Buku Fisika',
      points: 100,
      bounceOffset: 3,
    },

    // Area 3: Koridor (3 buku)
    {
      id: 'b8',
      x: 1730,
      y: 335,
      width: 28,
      height: 32,
      collected: false,
      subject: 'art',
      title: 'Buku Desain Kreatif',
      points: 100,
      bounceOffset: 0.8,
    },
    {
      id: 'b9',
      x: 1895,
      y: 255,
      width: 28,
      height: 32,
      collected: false,
      subject: 'history',
      title: 'Buku Geografi Dunia',
      points: 100,
      bounceOffset: 1.8,
    },
    {
      id: 'b10',
      x: 2245,
      y: 305,
      width: 28,
      height: 32,
      collected: false,
      subject: 'math',
      title: 'Buku Geometri',
      points: 100,
      bounceOffset: 2.5,
    },

    // Area 4: Taman Sekolah & Gerbang (3 buku)
    {
      id: 'b11',
      x: 2580,
      y: 345,
      width: 28,
      height: 32,
      collected: false,
      subject: 'science',
      title: 'Buku Biologi',
      points: 100,
      bounceOffset: 1.2,
    },
    {
      id: 'b12',
      x: 2740,
      y: 265,
      width: 28,
      height: 32,
      collected: false,
      subject: 'golden',
      title: 'Ensiklopedia Emas',
      points: 300,
      bounceOffset: 2.8,
    },
    {
      id: 'b13',
      x: 2915,
      y: 195,
      width: 28,
      height: 32,
      collected: false,
      subject: 'history',
      title: 'Buku Bahasa & Sastra',
      points: 150,
      bounceOffset: 0.3,
    },
  ],
  fireRocks: [
    // Area 1: Satu batu api di tanah halaman (jauh di bawah, mudah dilompati)
    {
      id: 'fr1',
      x: 500,
      y: 456,
      radius: 20,
      flamePhase: 0,
      flameSizeMultiplier: 0.9,
    },

    // Area 2: Batu api patroli perlahan di tanah lapangan
    {
      id: 'fr2',
      x: 900,
      y: 456,
      radius: 20,
      flamePhase: 1,
      patrol: {
        startX: 880,
        endX: 1060,
        speed: 1.1,
        direction: 1,
      },
    },
    // Batu api di tanah sebelum jurang kedua
    {
      id: 'fr4',
      x: 1400,
      y: 456,
      radius: 20,
      flamePhase: 3.1,
    },

    // Area 3: Batu api patroli di tanah koridor (jauh di bawah gedung sekolah)
    {
      id: 'fr5',
      x: 1800,
      y: 456,
      radius: 20,
      flamePhase: 0.5,
      patrol: {
        startX: 1720,
        endX: 1950,
        speed: 1.3,
        direction: 1,
      },
    },

    // Area 4: Rintangan di tanah taman menuju gerbang
    {
      id: 'fr7',
      x: 2560,
      y: 456,
      radius: 22,
      flamePhase: 2.9,
    },
    // Batu api di tanah sebelum gerbang finish
    {
      id: 'fr8',
      x: 2980,
      y: 456,
      radius: 22,
      flamePhase: 0.8,
      patrol: {
        startX: 2900,
        endX: 3060,
        speed: 1.4,
        direction: 1,
      },
    },
  ],
};
