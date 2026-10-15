import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { AppSidebar } from './AppSidebar.tsx';
import { AppViewRoute, UserSession } from '../types/navigation.ts';

export interface CadetRank {
  rank: number;
  name: string;
  school: string;
  grade: string;
  stars: number;
  xp: number;
  streak: number;
  trend: 'up' | 'down' | 'same';
  trendDiff: number;
  badge: string;
  avatarSeed: string;
  avatarBg: string;
  specialAura?: string;
  isCurrentUser?: boolean;
}

const INITIAL_LEADERBOARD_DATA: CadetRank[] = [
  {
    rank: 1,
    name: 'Alya Putri Antariksa',
    school: 'SDN Menteng 01 Jakarta',
    grade: 'Kelas 5 SD',
    stars: 3450,
    xp: 3820,
    streak: 18,
    trend: 'up',
    trendDiff: 2,
    badge: '👑 Komandan Utama Galaksi',
    avatarSeed: 'AP',
    avatarBg: 'from-amber-400 via-yellow-300 to-amber-500',
    specialAura: 'ring-4 ring-yellow-400/80 shadow-[0_0_35px_rgba(250,204,21,0.6)]',
  },
  {
    rank: 2,
    name: 'Rafi Alamsyah',
    school: 'SD Bintang Kejora Bandung',
    grade: 'Kelas 6 SD',
    stars: 3120,
    xp: 3410,
    streak: 15,
    trend: 'same',
    trendDiff: 0,
    badge: '🥈 Kapten Penjelajah Orbit',
    avatarSeed: 'RA',
    avatarBg: 'from-slate-300 via-slate-100 to-slate-400',
    specialAura: 'ring-4 ring-slate-300/80 shadow-[0_0_25px_rgba(203,213,225,0.5)]',
  },
  {
    rank: 3,
    name: 'Kenzo Pratama',
    school: 'SD Cendekia Medan',
    grade: 'Kelas 5 SD',
    stars: 2890,
    xp: 3100,
    streak: 12,
    trend: 'up',
    trendDiff: 1,
    badge: '🥉 Letnan Peneliti Asteroid',
    avatarSeed: 'KP',
    avatarBg: 'from-amber-600 via-orange-400 to-amber-700',
    specialAura: 'ring-4 ring-amber-600/70 shadow-[0_0_25px_rgba(217,119,6,0.45)]',
  },
  {
    rank: 4,
    name: 'Siti Nurhaliza',
    school: 'SD Negeri 5 Yogyakarta',
    grade: 'Kelas 4 SD',
    stars: 2640,
    xp: 2870,
    streak: 11,
    trend: 'up',
    trendDiff: 3,
    badge: '🌿 Master Klorofil SD',
    avatarSeed: 'SN',
    avatarBg: 'from-emerald-400 to-teal-500',
  },
  {
    rank: 5,
    name: 'Farhan Dwi Cahyo',
    school: 'SD Harapan Bangsa Bali',
    grade: 'Kelas 4 SD',
    stars: 2480,
    xp: 2690,
    streak: 14,
    trend: 'down',
    trendDiff: 1,
    badge: '⚡ Teknisi Termal Sains',
    avatarSeed: 'FD',
    avatarBg: 'from-blue-400 to-indigo-500',
  },
  {
    rank: 6,
    name: 'Nadia Safira',
    school: 'SD Al-Azhar Makassar',
    grade: 'Kelas 5 SD',
    stars: 2320,
    xp: 2510,
    streak: 9,
    trend: 'up',
    trendDiff: 2,
    badge: '🌧️ Ahli Hidrologi Awan',
    avatarSeed: 'NS',
    avatarBg: 'from-cyan-400 to-sky-600',
  },
  {
    rank: 7,
    name: 'Dimas Aditya',
    school: 'SDN 1 Semarapura',
    grade: 'Kelas 5 SD',
    stars: 2190,
    xp: 2380,
    streak: 10,
    trend: 'same',
    trendDiff: 0,
    badge: '🪐 Kadet Orbit Planet',
    avatarSeed: 'DA',
    avatarBg: 'from-purple-400 to-indigo-600',
  },
  {
    rank: 8,
    name: 'Zahra Amelia',
    school: 'SD Labschool UPI Bandung',
    grade: 'Kelas 6 SD',
    stars: 2050,
    xp: 2210,
    streak: 8,
    trend: 'down',
    trendDiff: 2,
    badge: '🧪 Peneliti Larutan Kimia',
    avatarSeed: 'ZA',
    avatarBg: 'from-pink-400 to-rose-500',
  },
  {
    rank: 9,
    name: 'Gibran Rakabuming',
    school: 'SD Nusantara Solo',
    grade: 'Kelas 5 SD',
    stars: 1940,
    xp: 2090,
    streak: 7,
    trend: 'up',
    trendDiff: 4,
    badge: '🚀 Navigator Roket Junior',
    avatarSeed: 'GR',
    avatarBg: 'from-orange-400 to-amber-600',
  },
  {
    rank: 10,
    name: 'Annisa Fitriani',
    school: 'SD Muhammadiyah 1 Surakarta',
    grade: 'Kelas 5 SD',
    stars: 1820,
    xp: 1980,
    streak: 6,
    trend: 'same',
    trendDiff: 0,
    badge: '🌸 Botanis Cilik Kebun',
    avatarSeed: 'AF',
    avatarBg: 'from-fuchsia-400 to-purple-600',
  },
  {
    rank: 11,
    name: 'Bima Satria Dewa',
    school: 'SD Taruna Bangsa Surabaya',
    grade: 'Kelas 4 SD',
    stars: 1690,
    xp: 1810,
    streak: 7,
    trend: 'up',
    trendDiff: 1,
    badge: '⚡ Penjelajah Medan Magnet',
    avatarSeed: 'BS',
    avatarBg: 'from-teal-400 to-emerald-600',
  },
  {
    rank: 12,
    name: 'Minton Cadence',
    school: 'SD Pelita Sains Surabaya',
    grade: 'Kelas 5 SD',
    stars: 1240,
    xp: 1420,
    streak: 7,
    trend: 'up',
    trendDiff: 3,
    badge: '💧 Kadet Panci Ajaib Air',
    avatarSeed: 'MT',
    avatarBg: 'from-sky-400 to-indigo-600',
    isCurrentUser: true,
  },
  {
    rank: 13,
    name: 'Clara Shinta',
    school: 'SD Santa Maria Jakarta',
    grade: 'Kelas 5 SD',
    stars: 1180,
    xp: 1350,
    streak: 5,
    trend: 'down',
    trendDiff: 1,
    badge: '🔬 Detektif Sel Organisme',
    avatarSeed: 'CS',
    avatarBg: 'from-violet-400 to-purple-600',
  },
  {
    rank: 14,
    name: 'Reza Rahardian',
    school: 'SDIT Insan Mandiri Bogor',
    grade: 'Kelas 6 SD',
    stars: 1090,
    xp: 1240,
    streak: 4,
    trend: 'up',
    trendDiff: 2,
    badge: '☀️ Pengamat Surya Teleskop',
    avatarSeed: 'RR',
    avatarBg: 'from-yellow-400 to-amber-600',
  },
  {
    rank: 15,
    name: 'Kayla Kirana',
    school: 'SD Unggulan Padang',
    grade: 'Kelas 4 SD',
    stars: 980,
    xp: 1120,
    streak: 5,
    trend: 'down',
    trendDiff: 3,
    badge: '🌿 Pahlawan Rantai Makanan',
    avatarSeed: 'KK',
    avatarBg: 'from-lime-400 to-green-600',
  },
];

interface LeaderboardRankingPageProps {
  user: UserSession;
  onNavigate: (route: AppViewRoute) => void;
  hideSidebar?: boolean;
}

export const LeaderboardRankingPage: React.FC<LeaderboardRankingPageProps> = ({
  user,
  onNavigate,
  hideSidebar = false,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'mingguan' | 'bulanan' | 'sepanjang_masa'>('mingguan');
  const [filterGrade, setFilterGrade] = useState<string>('semua');
  const [searchKadet, setSearchKadet] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync user stars into list if present
  const updatedLeaderboard = INITIAL_LEADERBOARD_DATA.map((k) => {
    if (k.isCurrentUser) {
      return {
        ...k,
        stars: user.stars || k.stars,
        xp: user.xp || k.xp,
        streak: user.streak || k.streak,
        name: user.name || k.name,
        grade: user.grade || k.grade,
      };
    }
    return k;
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Top 3 Podium
  const rank1 = updatedLeaderboard[0];
  const rank2 = updatedLeaderboard[1];
  const rank3 = updatedLeaderboard[2];

  // User Current Rank Item
  const userRankItem = updatedLeaderboard.find((k) => k.isCurrentUser) || {
    rank: 12,
    name: user.name || 'Minton Cadence',
    school: 'SD Pelita Sains Surabaya',
    grade: user.grade || 'Kelas 5 SD',
    stars: user.stars || 1240,
    xp: user.xp || 1420,
    streak: user.streak || 7,
    trend: 'up' as const,
    trendDiff: 3,
    badge: '💧 Kadet Panci Ajaib Air',
    avatarSeed: user.avatarSeed || 'MT',
    avatarBg: 'from-sky-400 to-indigo-600',
    isCurrentUser: true,
  };

  // Filter 4th onwards
  const filteredList = updatedLeaderboard.slice(3).filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchKadet.toLowerCase()) ||
      item.school.toLowerCase().includes(searchKadet.toLowerCase());

    if (!matchSearch) return false;
    if (filterGrade === 'semua') return true;
    if (filterGrade === 'kelas4') return item.grade.includes('4');
    if (filterGrade === 'kelas5') return item.grade.includes('5');
    if (filterGrade === 'kelas6') return item.grade.includes('6');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f4f6fc] font-sans text-slate-800 antialiased selection:bg-yellow-300 selection:text-indigo-950 transition-all duration-300 ease-in-out">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-yellow-300/80 bg-slate-950/95 px-5 py-3.5 shadow-2xl backdrop-blur-md text-white">
          <Icon icon="solar:sparkles-bold" className="h-5 w-5 text-yellow-300 animate-spin" />
          <span className="text-xs sm:text-sm font-bold">{toastMsg}</span>
        </div>
      )}

      {/* 1. SIDEBAR KIRI DESIGN SYSTEM BINTANG EDU */}
      {!hideSidebar && <AppSidebar currentRoute="peringkat" onNavigate={onNavigate} user={user} />}

      {/* 2. WRAPPER UTAMA RESPONSIVE DESKTOP (lg:pl-64, CONTAINER LEBAR WEB) */}
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out">
        {/* Sub-Header Topbar Navigation / Breadcrumbs */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-300 text-amber-600">
              <Icon icon="solar:cup-star-bold-duotone" className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 leading-none">
                  Peringkat Kadet Galaksi
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  Nasional SD
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                Liga Penjelajah Sains Bintang Edu Season 3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('tantangan-kuis')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black border border-indigo-200 transition-colors cursor-pointer"
            >
              <Icon icon="solar:bolt-circle-bold" className="text-base text-pink-500" />
              <span className="hidden sm:inline">Tambah Poin (+XP):</span>
              <span>Kuis Harian ⚡</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('virtual-lab')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-black shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              <Icon icon="solar:test-tube-bold-duotone" className="text-base" />
              <span>Lab Virtual 🔬</span>
            </button>
          </div>
        </div>

        {/* =================================================================
            STRUKTUR 3-KOLOM DESKTOP WEB YANG LUAS & KONSISTEN:
            - Kolom 1: AppSidebar Kiri (w-64 desktop fixed)
            - Kolom 2: Podium 3D Top 3 & Card List Peringkat Kadet (lg:col-span-8)
            - Kolom 3: Highlight Kadet Kamu, Statistik & Hadiah (lg:col-span-4)
            ================================================================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1520px] w-full mx-auto transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* =================================================================
                KOLOM UTAMA (KIRI/TENGAH, lg:col-span-8):
                - Banner Header Galaksi
                - Podium 3D Gaming Top 3 (Emas, Perak, Perunggu)
                - Filter Bar & Search
                - Kartu List Melayang Peringkat 4 ke Bawah
                ================================================================= */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. BANNER HEADER GALAKSI */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 border-2 border-indigo-900/60 p-6 sm:p-8 text-white shadow-xl">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-xs font-black text-amber-300">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                      <span>Liga Sains SD Terbuka se-Indonesia 🇮🇩</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                      Podium Juara Sains Antariksa 🚀
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Kumpulkan Bintang Emas ⭐ dari simulasi Lab Virtual, selesaikan 5 Pos Orbit, dan
                      rebut tempat tertinggi di Podium 3D Bintang Edu!
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl text-center">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Reset Mingguan</p>
                      <p className="text-lg font-black text-amber-300 tabular-nums">2 Hari 14 Jam</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. VISUAL PODIUM 3D GAMING GALAKSI (TOP 3 JUARA) */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b0f19] via-[#111827] to-[#0f172a] border-2 border-indigo-950 p-6 sm:p-8 text-white shadow-2xl">
                {/* Glowing Cosmic Aura Behind Podium */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 text-center mb-6">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/25 shadow-xs">
                    🏆 Top 3 Penjelajah Bintang Terhebat
                  </span>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Kadet dengan koleksi bintang tertinggi pekan ini
                  </p>
                </div>

                {/* 3D PODIUM STAGE CONTAINER (CONTAINER WEB YANG LUAS & MEGAH) */}
                <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 items-end w-full max-w-3xl mx-auto pt-6 pb-2">
                  {/* ========================================================
                      PODIUM 2: PERAK (KIRI)
                      ======================================================== */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative mb-3 flex flex-col items-center">
                      {/* Avatar */}
                      <div
                        className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${rank2.avatarBg} text-slate-800 flex items-center justify-center font-black text-base sm:text-xl shadow-lg border-2 border-slate-300 transition-transform group-hover:scale-105 ${rank2.specialAura}`}
                      >
                        {rank2.avatarSeed}
                        {/* Rank Pill */}
                        <div className="absolute -top-2.5 -right-2.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 text-slate-900 font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow-md">
                          2
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 w-full px-1">
                      <p className="font-black text-xs sm:text-sm text-slate-200 truncate">
                        {rank2.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                        {rank2.school}
                      </p>
                      <div className="inline-flex items-center gap-1 bg-white/10 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-amber-300">
                        ⭐ {rank2.stars.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* 3D Podium Block 2 */}
                    <div className="w-full mt-3 h-28 sm:h-36 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-t-4 border-slate-300 shadow-[0_-8px_20px_rgba(203,213,225,0.15)] flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                      <span className="font-black text-3xl sm:text-5xl text-slate-400/40 tracking-tighter">
                        2
                      </span>
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-300 mt-1">
                        SILVER 🥈
                      </span>
                    </div>
                  </div>

                  {/* ========================================================
                      PODIUM 1: EMAS (TENGAH - LEBIH TINGGI & BERCORAK EMAS)
                      ======================================================== */}
                  <div className="flex flex-col items-center text-center group -translate-y-2 sm:-translate-y-4">
                    <div className="relative mb-3 flex flex-col items-center">
                      {/* Floating Crown Animation */}
                      <div className="text-2xl sm:text-3xl mb-1 animate-bounce">
                        👑
                      </div>

                      {/* Avatar */}
                      <div
                        className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${rank1.avatarBg} text-amber-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-2xl border-4 border-yellow-300 transition-transform group-hover:scale-105 ${rank1.specialAura}`}
                      >
                        {rank1.avatarSeed}
                        {/* Rank 1 Crown Badge */}
                        <div className="absolute -top-3 -right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 text-indigo-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-slate-950 shadow-lg">
                          1
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 w-full px-1">
                      <div className="inline-flex items-center gap-1">
                        <p className="font-black text-sm sm:text-base text-yellow-300 truncate max-w-[180px] sm:max-w-[260px]">
                          {rank1.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-300 truncate hidden sm:block">
                        {rank1.school}
                      </p>
                      <div className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-black text-yellow-300 shadow-sm">
                        ⭐ {rank1.stars.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* 3D Podium Block 1 (Higher, Golden Glowing Edge) */}
                    <div className="w-full mt-3 h-40 sm:h-48 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-amber-600 via-amber-800 to-indigo-950 border-t-4 border-yellow-400 shadow-[0_-12px_30px_rgba(250,204,21,0.25)] flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-yellow-300/10 opacity-60 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                      <span className="font-black text-4xl sm:text-6xl text-yellow-300/50 tracking-tighter">
                        1
                      </span>
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-yellow-300 mt-1 flex items-center gap-1">
                        <span>GOLD</span>
                        <span className="text-amber-200">🥇</span>
                      </span>
                      <span className="text-[9px] font-bold text-amber-200/80">
                        {rank1.badge.replace('👑 ', '')}
                      </span>
                    </div>
                  </div>

                  {/* ========================================================
                      PODIUM 3: PERUNGGU (KANAN)
                      ======================================================== */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative mb-3 flex flex-col items-center">
                      {/* Avatar */}
                      <div
                        className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${rank3.avatarBg} text-white flex items-center justify-center font-black text-base sm:text-xl shadow-lg border-2 border-amber-600 transition-transform group-hover:scale-105 ${rank3.specialAura}`}
                      >
                        {rank3.avatarSeed}
                        {/* Rank Pill */}
                        <div className="absolute -top-2.5 -right-2.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow-md">
                          3
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 w-full px-1">
                      <p className="font-black text-xs sm:text-sm text-slate-200 truncate">
                        {rank3.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                        {rank3.school}
                      </p>
                      <div className="inline-flex items-center gap-1 bg-white/10 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-amber-300">
                        ⭐ {rank3.stars.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* 3D Podium Block 3 */}
                    <div className="w-full mt-3 h-24 sm:h-32 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-amber-800 via-stone-800 to-slate-900 border-t-4 border-amber-600 shadow-[0_-8px_20px_rgba(217,119,6,0.15)] flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                      <span className="font-black text-3xl sm:text-5xl text-amber-500/40 tracking-tighter">
                        3
                      </span>
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400 mt-1">
                        BRONZE 🥉
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. FILTER BAR & SEARCH */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Kadet */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchKadet}
                    onChange={(e) => setSearchKadet(e.target.value)}
                    placeholder="Cari nama kadet atau sekolah..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <Icon
                    icon="solar:magnifer-linear"
                    className="absolute left-3 top-2.5 text-slate-400 text-sm"
                  />
                </div>

                {/* Filter Periode & Kelas */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {(['mingguan', 'bulanan', 'sepanjang_masa'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setFilterPeriod(p);
                          showToast(`🔄 Menampilkan leaderboard ${p}`);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-extrabold capitalize transition-all cursor-pointer ${
                          filterPeriod === p
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {p === 'sepanjang_masa' ? 'All-Time' : p}
                      </button>
                    ))}
                  </div>

                  <select
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer outline-none"
                  >
                    <option value="semua">Semua Kelas</option>
                    <option value="kelas4">Kelas 4 SD</option>
                    <option value="kelas5">Kelas 5 SD</option>
                    <option value="kelas6">Kelas 6 SD</option>
                  </select>
                </div>
              </div>

              {/* 4. KARTU LIST PERINGKAT MELAYANG (WHITE FLOATING CARDS, RANK 04 - 15+) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Daftar Penjelajah Peringkat 04 — {filteredList.length + 3}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400">
                    Menampilkan {filteredList.length} Kadet
                  </span>
                </div>

                {filteredList.map((kadet) => {
                  const isCurrent = kadet.isCurrentUser;
                  const rankFormatted = String(kadet.rank).padStart(2, '0');

                  return (
                    <div
                      key={kadet.rank}
                      className={`relative rounded-2xl border transition-all duration-200 flex items-center justify-between p-3.5 sm:p-4 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-indigo-50/90 via-sky-50 to-white border-2 border-indigo-400 ring-4 ring-indigo-100 shadow-md'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Left Side: Nomor Rank + Avatar + Name + School */}
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Nomor Urut */}
                        <div className="flex items-center justify-center w-8 sm:w-10 shrink-0">
                          <span
                            className={`font-black text-sm sm:text-base tabular-nums ${
                              isCurrent
                                ? 'text-indigo-600 font-extrabold'
                                : 'text-slate-400'
                            }`}
                          >
                            #{rankFormatted}
                          </span>
                        </div>

                        {/* Avatar */}
                        <div
                          className={`relative h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-tr ${kadet.avatarBg} text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-sm border border-white shrink-0`}
                        >
                          {kadet.avatarSeed}
                          {isCurrent && (
                            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                          )}
                        </div>

                        {/* Detail Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-xs sm:text-sm font-black truncate ${
                                isCurrent ? 'text-indigo-950 font-extrabold' : 'text-slate-800'
                              }`}
                            >
                              {kadet.name}
                            </p>
                            {isCurrent && (
                              <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 shadow-xs">
                                <Icon icon="solar:user-bold" className="text-xs" />
                                <span>Kamu!</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-bold text-slate-500">
                            <span className="truncate">{kadet.school}</span>
                            <span>•</span>
                            <span className="shrink-0 text-slate-400">{kadet.grade}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Trend Status + Total Bintang */}
                      <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-right">
                        {/* Trend Peringkat (Naik/Turun/Stabil) */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-12">
                          {kadet.trend === 'up' && (
                            <span className="inline-flex items-center text-[11px] font-black text-emerald-600">
                              <Icon icon="solar:arrow-up-bold" className="text-sm" />
                              <span>+{kadet.trendDiff}</span>
                            </span>
                          )}
                          {kadet.trend === 'down' && (
                            <span className="inline-flex items-center text-[11px] font-black text-rose-500">
                              <Icon icon="solar:arrow-down-bold" className="text-sm" />
                              <span>-{kadet.trendDiff}</span>
                            </span>
                          )}
                          {kadet.trend === 'same' && (
                            <span className="text-[11px] font-black text-slate-400">
                              ▬
                            </span>
                          )}
                          <span className="text-[9px] font-bold text-slate-400">Trend</span>
                        </div>

                        {/* Bintang & XP */}
                        <div className="bg-amber-50/80 border border-amber-200/80 px-3 py-1.5 rounded-xl">
                          <p className="text-xs sm:text-sm font-black text-amber-800 tabular-nums">
                            ⭐ {kadet.stars.toLocaleString('id-ID')}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 tabular-nums">
                            {kadet.xp} XP
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =================================================================
                KOLOM SAMPING (KANAN, lg:col-span-4):
                - Sticky Highlight Card "KADET KAMU" (Posisi Kamu Saat Ini)
                - Kartu Statistik Pencapaian Kadet
                - Kartu Reward Musim & Hadiah Juara
                ================================================================= */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
              {/* 1. STICKY / HIGHLIGHT CARD "KADET KAMU" */}
              <div className="rounded-3xl border-2 border-indigo-400 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-sky-300 text-xs font-black border border-indigo-400/30">
                    <Icon icon="solar:star-rainbow-bold" className="text-sm text-yellow-300" />
                    <span>Kartu Posisi Kadet</span>
                  </span>
                  <span className="text-xs font-extrabold text-amber-300">
                    {userRankItem.badge}
                  </span>
                </div>

                {/* Profile Snapshot */}
                <div className="flex items-center gap-3.5 mt-4">
                  <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md border-2 border-white shrink-0">
                    {userRankItem.avatarSeed}
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-indigo-950 bg-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black text-white truncate">
                      {userRankItem.name}
                    </p>
                    <p className="text-xs font-bold text-slate-300 truncate">
                      {userRankItem.school}
                    </p>
                    <p className="text-[11px] font-extrabold text-sky-400 mt-0.5">
                      {userRankItem.grade} • Kadet Lv. 7
                    </p>
                  </div>
                </div>

                {/* Highlight Big Rank Metric */}
                <div className="mt-5 grid grid-cols-2 gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                  <div className="text-center border-r border-white/10 pr-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Peringkat Saat Ini
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="text-3xl font-black text-amber-300">
                        #{userRankItem.rank}
                      </span>
                      <span className="inline-flex items-center text-xs font-bold text-emerald-400">
                        <Icon icon="solar:arrow-up-bold" />
                        <span>{userRankItem.trendDiff}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-center pl-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Koleksi Bintang
                    </p>
                    <p className="text-3xl font-black text-yellow-300 mt-0.5 tabular-nums">
                      ⭐ {userRankItem.stars.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Jarak ke Top 10 */}
                <div className="mt-4 p-3 rounded-xl bg-indigo-900/40 border border-indigo-400/20 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-300">Target Top 10 Galaksi:</span>
                    <span className="text-amber-300 font-black">Butuh +580 ⭐</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                      style={{ width: '68%' }}
                    />
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  type="button"
                  onClick={() => onNavigate('tantangan-kuis')}
                  className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:opacity-95 text-indigo-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:bolt-circle-bold" className="text-lg" />
                  <span>Ambil Misi & Naikkan Posisi! 🚀</span>
                </button>
              </div>

              {/* 2. STAT PENCAPAIAN KADET (STREAK, WAKTU BELAJAR, TOTAL MISI) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Icon icon="solar:chart-square-bold" className="text-indigo-600 text-lg" />
                  <span>Statistik Performa Pekan Ini</span>
                </h3>

                <div className="space-y-3">
                  {/* Streak Card */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/70 border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-xs">
                        🔥
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">Streak Belajar Aktif</p>
                        <p className="text-[11px] font-bold text-orange-800">
                          Konsisten 7 hari berturut-turut!
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-orange-600 tabular-nums">
                      {userRankItem.streak} Hari
                    </span>
                  </div>

                  {/* Lab Virtual Selesai */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/70 border border-sky-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xl shadow-xs">
                        🔬
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">Eksperimen Lab Virtual</p>
                        <p className="text-[11px] font-bold text-sky-800">
                          Sains Air & Gravitasi Selesai
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-sky-600 tabular-nums">
                      2 / 3
                    </span>
                  </div>

                  {/* Akurasi Kuis */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-xs">
                        🎯
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">Akurasi Jawaban Kuis</p>
                        <p className="text-[11px] font-bold text-emerald-800">
                          18 dari 20 soal tepat
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-emerald-600 tabular-nums">
                      90%
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. REWARD MUSIM & HADIAH PODIUM */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Hadiah Akhir Pekan Ini
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700">🥇 Juara 1:</span>
                    <span className="font-black text-amber-800">Badge Mahkota Emas + 1.000 ⭐</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700">🥈 Juara 2:</span>
                    <span className="font-black text-slate-800">Badge Helm Perak + 500 ⭐</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700">🥉 Juara 3:</span>
                    <span className="font-black text-orange-800">Badge Medali Perunggu + 250 ⭐</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700">🎖️ Top 10:</span>
                    <span className="font-black text-indigo-800">Sertifikat Kadet Teladan SD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
