import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  AstronautAndStarMascot3D,
  Rocket3D,
  PinkRingedPlanet3D,
  DinoBuddy3D,
  SpaceCupcake3D,
  BlueRingedPlanet3D,
  InteractiveGamepad3D,
} from './KidoIllustrations.tsx';

export interface DailyScheduleTopic {
  id: string;
  time: string;
  grade: string;
  category: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  starBonus: number;
  quizIndex: number;
  isLive?: boolean;
}

export const DAILY_SCIENCE_SCHEDULE: DailyScheduleTopic[] = [
  {
    id: 'tata-surya',
    time: '09:00 WIB',
    grade: 'SD KELAS 4–6',
    category: 'ASTRONAUT DREAM',
    title: 'MISTERI TATA SURYA & DUNIA PLANET',
    highlightWord: 'TATA SURYA',
    subtitle:
      'Terbang bersama Si Bintang Pintar menjelajahi cincin es Saturnus, rahasia gravitasi Matahari, dan urutan 8 planet di galaksi kita!',
    starBonus: 25,
    quizIndex: 0,
    isLive: true,
  },
  {
    id: 'fotosintesis',
    time: '10:30 WIB',
    grade: 'SD KELAS 3–4',
    category: 'BOTANIST DREAM',
    title: 'DAPUR AJAIB TUMBUHAN & FOTOSINTESIS',
    highlightWord: 'FOTOSINTESIS',
    subtitle:
      'Cari tahu bagaimana daun hijau memasak makanan menggunakan cahaya matahari dan menghasilkan oksigen segar untuk kita hirup.',
    starBonus: 20,
    quizIndex: 1,
  },
  {
    id: 'gaya-magnet',
    time: '13:00 WIB',
    grade: 'SD KELAS 4–5',
    category: 'ENGINEER DREAM',
    title: 'EKSPERIMEN GAYA TARIK & KUTUB MAGNET',
    highlightWord: 'KUTUB MAGNET',
    subtitle:
      'Uji benda-benda di sekitarmu yang bisa menempel pada magnet dan buktikan kekuatan tarik-menarik kutub Utara dan Selatan!',
    starBonus: 30,
    quizIndex: 2,
  },
  {
    id: 'siklus-air',
    time: '15:30 WIB',
    grade: 'SD KELAS 1–5',
    category: 'EXPLORER DREAM',
    title: 'PETUALANGAN AWAN HUJAN & SIKLUS AIR',
    highlightWord: 'SIKLUS AIR',
    subtitle:
      'Ikuti perjalanan tetesan air laut yang menguap ke angkasa, berkumpul menjadi awan mendung, lalu turun sebagai hujan dan pelangi.',
    starBonus: 20,
    quizIndex: 3,
  },
];

interface HeroSectionProps {
  activeTopicIndex: number;
  onSelectTopic: (index: number) => void;
  onStartExperiment: (topic: DailyScheduleTopic) => void;
  onOpenApplicationModal?: () => void;
  onAddStars?: (stars: number, reason: string) => void;
  onNotify?: (msg: string) => void;
  totalStars: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeTopicIndex,
  onSelectTopic,
  onStartExperiment,
  onOpenApplicationModal,
  onAddStars,
  onNotify,
}) => {
  const [gamepadScreenMode, setGamepadScreenMode] = useState<number>(0);
  const [activeBubbleQuote, setActiveBubbleQuote] = useState<string>(
    'Wonderful experience!'
  );

  const activeTopic =
    DAILY_SCIENCE_SCHEDULE[activeTopicIndex] || DAILY_SCIENCE_SCHEDULE[0];

  const handlePressGamepad = () => {
    const nextMode = gamepadScreenMode + 1;
    setGamepadScreenMode(nextMode);
    if (nextMode % 2 === 1 && onAddStars) {
      onAddStars(15, 'Mini-Game Konsol 3D Bintang Edu');
    } else if (onNotify) {
      onNotify('🎮 Mode Konsol 3D Bintang Edu diubah! Klik lagi untuk kejutan!');
    }
  };

  const handleBubbleClick = (message: string) => {
    setActiveBubbleQuote(message);
    if (onNotify) {
      onNotify(`💬 Pesan Sahabat Antariksa: "${message}"`);
    }
  };

  const scrollToModules = () => {
    const el = document.getElementById('modul-sains');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="beranda"
      className="relative z-20 pt-2 pb-10 px-4 sm:px-8 lg:px-12 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        {/* ================================================================
            PANGGUNG UTAMA 3D RUANG ANGKASA ("Chasing Yesterday's Dreams" Style)
           ================================================================ */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/15 bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-950 px-5 pt-8 pb-24 sm:px-10 sm:pt-10 sm:pb-28 lg:px-14 shadow-[0_30px_80px_rgba(15,23,42,0.85)]">
          {/* Pendaran Atmosfer Biru Terang di Kanan Atas & Ungu di Kiri Bawah */}
          <div className="pointer-events-none absolute -top-24 -right-20 h-[420px] w-[420px] rounded-full bg-sky-400/25 blur-[95px]" />
          <div className="pointer-events-none absolute top-1/3 left-1/3 h-80 w-80 rounded-full bg-blue-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-purple-700/30 blur-[90px]" />

          {/* Jejak Cahaya Bima Sakti Melengkung dari Atas ke Kiri Bawah */}
          <svg
            viewBox="0 0 1200 700"
            fill="none"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="milkyWayTrail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M360 -20 C540 90, 440 280, 260 440 C150 540, 80 630, 30 700 L190 700 C250 610, 350 500, 460 390 C630 220, 690 60, 490 -20 Z"
              fill="url(#milkyWayTrail)"
            />
          </svg>

          {/* Setengah Lingkaran Planet Biru Besar di Tepi Kiri Tengah */}
          <div className="pointer-events-none absolute top-36 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-sky-400/25 via-blue-700/35 to-indigo-950/60 blur-[1px] border border-sky-300/15" />

          {/* Planet Pink Bercincin Tersenyum di Pojok Kiri Atas */}
          <div className="absolute top-5 left-5 sm:top-7 sm:left-10 z-20">
            <PinkRingedPlanet3D />
          </div>

          {/* ==============================================================
              GRID UTAMA HERO:
              - Sisi Kiri (5 Kolom): Astronaut 3D + Bintang Edu + Balon Dialog + Dino
              - Sisi Tengah & Kanan (7 Kolom): Roket + "CHILDHOOD DREAM" + Deskripsi
                + Bar "Application entry / Experience" + Planet Biru + Gamepad 3D
             ============================================================== */}
          <div className="relative z-20 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-4 pt-6 sm:pt-4">
            {/* ============================================================
                KOLOM KIRI: ASTRONAUT 3D, BINTANG BERSINAR, BALON DIALOG & DINO
               ============================================================ */}
            <div className="relative lg:col-span-5 flex flex-col items-center">
              {/* Karakter Astronaut 3D & Maskot Bintang Edu */}
              <AstronautAndStarMascot3D
                onStarClick={() => {
                  if (onAddStars) {
                    onAddStars(25, 'Bintang Impian Bintang Edu');
                  }
                }}
              />

              {/* BALON DIALOG 1: "Fantastic!" (Mengambang di Kiri Tengah) */}
              <button
                type="button"
                onClick={() => handleBubbleClick('Fantastic! Sains itu seru!')}
                className="group absolute bottom-28 left-0 sm:left-2 z-30 flex items-center gap-2.5 rounded-full border border-white/25 bg-indigo-900/75 pl-2 pr-5 py-1.5 shadow-xl backdrop-blur-md transition-transform hover:scale-105 cursor-pointer animate-pulse"
                style={{ animationDuration: '3.4s' }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 text-xs font-bold text-white ring-2 ring-white/70">
                  🧑‍🚀
                </span>
                <span className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-yellow-300">
                  Fantastic!
                </span>
              </button>

              {/* BALON DIALOG 2: "Wonderful experience!" + Karakter Dino 3D di Kiri Bawah */}
              <div className="relative mt-1 flex w-full items-center justify-start gap-2 pl-2 sm:pl-4">
                <DinoBuddy3D
                  onClick={() =>
                    handleBubbleClick('Rawr! Ayo mulai eksperimen sains!')
                  }
                />

                <button
                  type="button"
                  onClick={() => handleBubbleClick('Wonderful experience!')}
                  className="group -ml-3 mt-4 flex items-center gap-2.5 rounded-full border border-white/25 bg-indigo-900/75 pl-2 pr-5 py-2 shadow-xl backdrop-blur-md transition-transform hover:scale-105 cursor-pointer animate-bounce"
                  style={{ animationDuration: '3.2s' }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 text-xs font-bold text-white ring-2 ring-white/70">
                    🌟
                  </span>
                  <span className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-yellow-300 whitespace-nowrap">
                    {activeBubbleQuote}
                  </span>
                </button>
              </div>
            </div>

            {/* ============================================================
                KOLOM TENGAH & KANAN:
                Roket 3D + Judul "CHILDHOOD DREAM" + Deskripsi + Tombol "Experience"
                + Planet Bercincin Biru + Widget Gamepad 3D
               ============================================================ */}
            <div className="relative lg:col-span-7 flex flex-col justify-center lg:pl-4">
              {/* Roket 3D Meluncur di Atas Judul "CHILDHOOD DREAM" */}
              <div className="relative mb-1 flex items-center justify-center lg:justify-start lg:pl-20">
                <Rocket3D />
              </div>

              {/* JUDUL BESAR 3D: "CHILDHOOD DREAM" (Gradasi Putih & Kuning Cerah) */}
              <div className="relative z-20 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300/35 bg-white/10 px-3.5 py-1 mb-2 backdrop-blur-sm">
                  <Icon
                    icon="lucide:sparkles"
                    className="h-3.5 w-3.5 text-yellow-300 animate-pulse"
                  />
                  <span className="font-heading text-[11px] sm:text-xs font-bold uppercase tracking-wider text-yellow-200">
                    Bintang Edu • Petualangan Sains & Impian SD
                  </span>
                </div>

                <h1 className="font-heading text-4xl sm:text-6xl xl:text-[68px] font-bold uppercase leading-[1.04] tracking-wider select-none title-3d-dream">
                  <span className="block bg-gradient-to-b from-white via-blue-50 to-yellow-200 bg-clip-text text-transparent">
                    PETUALANGAN
                  </span>
                  <span className="mt-1 inline-flex items-center justify-center lg:justify-start gap-3">
                    <span className="bg-gradient-to-b from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                      GALAKSI SAINS
                    </span>
                    <SpaceCupcake3D />
                  </span>
                </h1>
              </div>

              {/* PARAGRAF DESKRIPSI + PLANET BIRU BERCINCIN DI SISI KANAN */}
              <div className="relative z-20 mt-4 grid grid-cols-1 lg:grid-cols-12 items-start gap-6">
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  <p className="font-body text-xs sm:text-sm leading-relaxed font-semibold text-blue-100/90 max-w-md mx-auto lg:mx-0">
                    Terbang bersama roket ilmu pengetahuan! Platform edukasi sains interaktif untuk anak SD yang membuat belajar tata surya dan eksperimen jadi seru tanpa batas.
                  </p>

                  {/* BAR AKSI: "▸ Mulai Petualangan" & Tombol Kuning "Coba Eksperimen" */}
                  <div className="mx-auto lg:mx-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-indigo-950/65 p-2.5 pl-5 shadow-2xl backdrop-blur-md max-w-md">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenApplicationModal) {
                          onOpenApplicationModal();
                        } else {
                          onStartExperiment(activeTopic);
                        }
                      }}
                      className="group inline-flex items-center gap-2.5 font-heading text-xs sm:text-sm font-bold text-white transition-colors hover:text-yellow-300 cursor-pointer whitespace-nowrap"
                    >
                      <Icon
                        icon="lucide:play"
                        className="h-3.5 w-3.5 text-white transition-transform group-hover:translate-x-0.5 group-hover:text-yellow-300"
                      />
                      <span>Mulai Petualangan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartExperiment(activeTopic)}
                      className="rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 px-7 py-2.5 font-heading text-xs sm:text-sm font-bold tracking-wide text-indigo-950 shadow-[0_6px_20px_rgba(250,204,21,0.45)] transition-all duration-200 hover:from-yellow-200 hover:to-yellow-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      Coba Eksperimen
                    </button>
                  </div>
                </div>

                {/* SISI KANAN: Planet Biru Bercincin & Widget Gamepad Interaktif 3D */}
                <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center relative">
                  {/* Planet Biru Bercincin di Kanan Atas Gamepad */}
                  <div className=" -mt-6 lg:-mt-16 -mr-4 lg:-mr-10">
                    <BlueRingedPlanet3D />
                  </div>

                  {/* Widget Gamepad 3D Interaktif */}
                  <div className="-mt-10 sm:-mt-14 z-30">
                    <InteractiveGamepad3D
                      screenMode={gamepadScreenMode}
                      onPressButton={handlePressGamepad}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==============================================================
              IKON SOSIAL VERTIKAL DI KANAN BAWAH (Persis Referensi Visual)
             ============================================================== */}
          <div className="hidden sm:flex flex-col items-center gap-3.5 absolute right-6 bottom-12 z-30">
            <button
              type="button"
              onClick={() =>
                onNotify?.('📸 Galeri Dokumentasi Sains Bintang Edu dibuka!')
              }
              aria-label="Galeri Bintang Edu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-950 shadow-md transition-transform hover:scale-110 hover:bg-yellow-300 cursor-pointer"
            >
              <Icon icon="lucide:instagram" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onNotify?.('💬 Komunitas Diskusi Ilmuwan Cilik Bintang Edu!')
              }
              aria-label="Komunitas Bintang Edu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-950 shadow-md transition-transform hover:scale-110 hover:bg-yellow-300 cursor-pointer"
            >
              <Icon icon="lucide:message-circle" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onNotify?.('🚀 Bagikan Misi Impian Sainsmu ke teman-teman!')
              }
              aria-label="Bagikan Bintang Edu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-950 shadow-md transition-transform hover:scale-110 hover:bg-yellow-300 cursor-pointer"
            >
              <Icon icon="lucide:share-2" className="h-4 w-4" />
            </button>
          </div>

          {/* ==============================================================
              KUBAH BULAN BERKAWAH DI TENGAH BAWAH + TOMBOL PANAH GULIR (↓)
             ============================================================== */}
          <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 w-[360px] sm:w-[490px] h-28 z-10 flex items-end justify-center">
            <svg viewBox="0 0 500 130" className="w-full h-full">
              <defs>
                <linearGradient id="moonHorizonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="45%" stopColor="#4338CA" />
                  <stop offset="100%" stopColor="#1E1B4B" />
                </linearGradient>
              </defs>
              <path
                d="M10 130 C75 20, 425 20, 490 130 Z"
                fill="url(#moonHorizonGrad)"
              />
              {/* Kawah-kawah Bulan */}
              <ellipse cx="145" cy="88" rx="22" ry="11" fill="#312E81" opacity="0.7" />
              <ellipse cx="345" cy="80" rx="28" ry="14" fill="#312E81" opacity="0.75" />
              <circle cx="290" cy="108" r="10" fill="#312E81" opacity="0.65" />
              <circle cx="195" cy="110" r="8" fill="#312E81" opacity="0.6" />
            </svg>
          </div>

          {/* Tombol Bulat Panah Bawah (↓) di Tengah Bulan */}
          <button
            type="button"
            onClick={scrollToModules}
            aria-label="Gulir ke Modul Sains Bintang Edu"
            title="Jelajahi Modul Sains di Bawah"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-indigo-950/60 text-white shadow-lg backdrop-blur-md transition-all hover:border-yellow-300 hover:bg-yellow-400 hover:text-indigo-950 cursor-pointer animate-bounce"
            style={{ animationDuration: '2.5s' }}
          >
            <Icon icon="lucide:arrow-down" className="h-5 w-5" />
          </button>
        </div>

        {/* ================================================================
            BARIS PILIHAN MISI IMPIAN HARIAN (Timeline Misi Sains Bintang Edu)
           ================================================================ */}
        <div className="mt-6 rounded-3xl border border-white/15 bg-indigo-950/60 px-4 py-4 sm:px-6 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DAILY_SCIENCE_SCHEDULE.map((item, idx) => {
              const isSelected = idx === activeTopicIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTopic(idx)}
                  className={`group flex flex-col justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-yellow-300 bg-gradient-to-r from-indigo-900 to-blue-900 text-white shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                      : 'border-white/15 bg-white/5 hover:border-yellow-300/50 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-heading text-xs font-bold tracking-wider uppercase text-yellow-300">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 font-heading text-[10px] font-bold uppercase ${
                        isSelected
                          ? 'bg-yellow-400 text-indigo-950'
                          : 'bg-white/10 text-blue-200'
                      }`}
                    >
                      {item.grade}
                    </span>
                  </div>

                  <p className="mt-1.5 font-heading text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
