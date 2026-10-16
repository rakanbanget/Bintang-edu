import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { BintangEduMascot } from './BintangEduLogo.tsx';
import {
  IconPopulerSains3D,
  IconKuisGamifikasi3D,
  IconLeaderboard3D,
  IconMultiSensori3D,
  AppBannerMascotTablet,
} from './KidoIllustrations.tsx';

export type ActiveFeatureKey =
  | 'populer-sains'
  | 'kuis-gamifikasi'
  | 'leaderboard'
  | 'multi-sensori';

export interface ScienceQuizItem {
  id: number;
  topic: string;
  grade: string;
  question: string;
  options: { code: string; text: string }[];
  correctIndex: number;
  explanation: string;
  stars: number;
}

export const INTERACTIVE_QUIZZES: ScienceQuizItem[] = [
  {
    id: 1,
    topic: 'Misteri Tata Surya & Planet',
    grade: 'Kelas 5–6 SD',
    question:
      'Planet manakah di Tata Surya kita yang terkenal memiliki cincin indah dari bongkahan es dan debu antariksa?',
    options: [
      { code: 'A', text: 'Planet Mars (Planet Merah)' },
      { code: 'B', text: 'Planet Saturnus (Planet Bercincin)' },
      { code: 'C', text: 'Planet Merkurius' },
      { code: 'D', text: 'Planet Venus (Bintang Kejora)' },
    ],
    correctIndex: 1,
    explanation:
      'Benar! Saturnus memiliki sistem cincin raksasa yang tersusun dari miliaran bongkahan es dan batuan antariksa.',
    stars: 25,
  },
  {
    id: 2,
    topic: 'Dapur Ajaib Tumbuhan (Fotosintesis)',
    grade: 'Kelas 3–4 SD',
    question:
      'Saat tumbuhan memasak makanannya sendiri dengan bantuan cahaya matahari, gas apa yang dihasilkan untuk kita hirup?',
    options: [
      { code: 'A', text: 'Gas Oksigen (O₂)' },
      { code: 'B', text: 'Gas Karbon Dioksida (CO₂)' },
      { code: 'C', text: 'Gas Nitrogen' },
      { code: 'D', text: 'Gas Helium' },
    ],
    correctIndex: 0,
    explanation:
      'Tepat sekali! Fotosintesis menghasilkan gas Oksigen (O₂) yang sangat dibutuhkan manusia dan hewan untuk bernapas.',
    stars: 20,
  },
  {
    id: 3,
    topic: 'Eksperimen Gaya & Kutub Magnet',
    grade: 'Kelas 4–5 SD',
    question:
      'Apa yang akan terjadi jika dua kutub magnet yang sama (Utara dengan Utara) didekatkan satu sama lain?',
    options: [
      { code: 'A', text: 'Saling tarik-menarik dengan kuat' },
      { code: 'B', text: 'Meleleh karena panas' },
      { code: 'C', text: 'Saling tolak-menolak' },
      { code: 'D', text: 'Kehilangan daya magnetnya' },
    ],
    correctIndex: 2,
    explanation:
      'Pintar! Kutub magnet yang senama akan saling tolak-menolak, sedangkan kutub yang berbeda (Utara & Selatan) akan tarik-menarik.',
    stars: 30,
  },
  {
    id: 4,
    topic: 'Petualangan Siklus Air & Hujan',
    grade: 'Kelas 1–5 SD',
    question:
      'Proses menguapnya air laut menuju langit karena panas sinar matahari sebelum membentuk awan disebut...',
    options: [
      { code: 'A', text: 'Presipitasi' },
      { code: 'B', text: 'Evaporasi' },
      { code: 'C', text: 'Kondensasi' },
      { code: 'D', text: 'Infiltrasi' },
    ],
    correctIndex: 1,
    explanation:
      'Hebat! Evaporasi adalah proses penguapan air akibat panas matahari sebelum berkumpul menjadi titik-titik awan.',
    stars: 20,
  },
];

interface ScienceModulesSectionProps {
  activeFeature: ActiveFeatureKey;
  onSelectFeature: (feature: ActiveFeatureKey) => void;
  activeQuizIndex: number;
  onSelectQuizIndex: (idx: number) => void;
  onAddStars: (stars: number, reason: string) => void;
  onNotify: (msg: string) => void;
  onNavigate?: (route: any) => void;
}

export const ScienceModulesSection: React.FC<ScienceModulesSectionProps> = ({
  activeFeature,
  onSelectFeature,
  activeQuizIndex,
  onSelectQuizIndex,
  onAddStars,
  onNotify,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completedQuizIds, setCompletedQuizIds] = useState<number[]>([]);

  const currentQuiz =
    INTERACTIVE_QUIZZES[activeQuizIndex] || INTERACTIVE_QUIZZES[0];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQuiz.correctIndex;

  const handleCardQuizClick = async (quizId: number, topic: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const isLoggedIn = Boolean(token || user);

    if (!isLoggedIn) {
      onNotify('🔐 Masuk atau daftar terlebih dahulu untuk mengakses modul eksperimen sains!');
      navigate('/login');
      return;
    }

    // Jika SUDAH Login: Panggil API GET /api/quiz/:id dari backend Express.js (Port 5001)
    try {
      const res = await fetch(`http://localhost:5001/api/quiz/${quizId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Quiz data from Express (Port 5001):', data);
      }
    } catch (err) {
      console.warn('Catatan koneksi API Express.js Port 5001:', err);
    }

    onNotify(`🚀 Menyiapkan modul simulator sains: ${topic}!`);
    navigate('/virtual-lab');
  };

  const handleAnswerQuiz = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optIndex);
    if (
      optIndex === currentQuiz.correctIndex &&
      !completedQuizIds.includes(currentQuiz.id)
    ) {
      setCompletedQuizIds((prev) => [...prev, currentQuiz.id]);
      onAddStars(currentQuiz.stars, `Kuis ${currentQuiz.topic}`);
    }
  };

  const handleSwitchQuiz = (idx: number) => {
    setSelectedOption(null);
    onSelectQuizIndex(idx);
  };

  const handleCardAction = (featureKey: ActiveFeatureKey) => {
    onSelectFeature(featureKey);
    const panelEl = document.getElementById('interactive-feature-panel');
    if (panelEl) {
      panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section
      id="ruang-eksplorasi"
      className="relative z-20 py-4 px-4 sm:px-8 lg:px-12"
    >
      <div id="modul-sains" />
      <div className="mx-auto max-w-6xl">
        {/* ================================================================
            CONTAINER KACA GALAKSI 3D (Selaras dengan Tema Ruang Angkasa)
           ================================================================ */}
        <div className="rounded-[36px] border border-purple-500/30 bg-gradient-to-br from-[#1c0f45] via-[#13092d] to-[#0d0521] p-6 sm:p-10 lg:p-12 text-white shadow-[0_22px_48px_rgba(2,6,23,0.38),0_0_28px_rgba(139,92,246,0.24)] backdrop-blur-xl">
          {/* Header Bagian Eksplorasi Mimpi & Sains */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-500/20 pb-6">
            <div>
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-amber-300">
                ✨ Bintang Edu • Childhood Dream Lab
              </span>
              <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-white">
                Jelajahi Wahana Sains & Wujudkan Mimpimu!
              </h2>
            </div>
            <p className="max-w-md font-body text-xs sm:text-sm font-semibold text-purple-200/85">
              Pilih misi interaktif di bawah ini untuk memulai simulasi
              eksperimen, bermain kuis antariksa, dan mengumpulkan Bintang
              Prestasi.
            </p>
          </div>

          {/* ==============================================================
              BAGIAN 1: GRID 2 KOLOM DENGAN 4 KARTU WAHANA 3D
             ============================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KARTU 1: POPULER SAINS */}
            <div
              onClick={() => handleCardAction('populer-sains')}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                activeFeature === 'populer-sains'
                  ? 'border-amber-400 bg-gradient-to-br from-[#1c0f45] to-[#13092d] shadow-[0_0_30px_rgba(250,204,21,0.2)]'
                  : 'border-purple-500/20 bg-[#120a2a]/60 hover:border-amber-400/60 hover:bg-[#1a0e40]/70'
              }`}
            >
              <div
                className="animate-bounce"
                style={{ animationDuration: '3.2s' }}
              >
                <IconPopulerSains3D />
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  MODUL & VIDEO IPA
                </span>
                <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
                  Populer Sains
                </h3>
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-purple-100/85">
                  Jelajahi topik sains paling disukai anak SD: rahasia cincin
                  Saturnus, dapur fotosintesis tumbuhan, hingga siklus pelangi.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction('populer-sains');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-md transition-all hover:bg-amber-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>LIHAT POPULER</span>
                </button>
              </div>
            </div>

            {/* KARTU 2: TANTANGAN KUIS GAMIFIKASI */}
            <div
              id="kuis-section"
              onClick={() => handleCardAction('kuis-gamifikasi')}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                activeFeature === 'kuis-gamifikasi'
                  ? 'border-cyan-300 bg-gradient-to-br from-[#1c0f45] to-[#13092d] shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                  : 'border-purple-500/20 bg-[#120a2a]/60 hover:border-cyan-300/60 hover:bg-[#1a0e40]/70'
              }`}
            >
              <div
                className="animate-bounce"
                style={{ animationDuration: '2.9s' }}
              >
                <IconKuisGamifikasi3D />
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  MISI BINTANG PRESTASI
                </span>
                <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
                  Tantangan Kuis Gamifikasi
                </h3>
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-purple-100/85">
                  Uji pemahaman sains lewat kuis interaktif seru! Jawab soal
                  dengan tepat dan kumpulkan Bintang Prestasi setiap hari.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction('kuis-gamifikasi');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-md transition-all hover:bg-cyan-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>MAINKAN KUIS</span>
                </button>
              </div>
            </div>

            {/* KARTU 3: LEADERBOARD & PERINGKAT KADET */}
            <div
              onClick={() => handleCardAction('leaderboard')}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                activeFeature === 'leaderboard'
                  ? 'border-amber-400 bg-gradient-to-br from-[#1c0f45] to-[#13092d] shadow-[0_0_30px_rgba(251,191,36,0.25)]'
                  : 'border-purple-500/20 bg-[#120a2a]/60 hover:border-amber-400/60 hover:bg-[#1a0e40]/70'
              }`}
            >
              <div
                className="animate-bounce"
                style={{ animationDuration: '3.4s' }}
              >
                <IconLeaderboard3D />
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  KLASEMEN & PRESTASI KADET
                </span>
                <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
                  Papan Peringkat Galaksi
                </h3>
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-purple-100/85">
                  Pantau posisi kadet bintang terhebat dari seluruh sekolah di
                  Indonesia. Kumpulkan bintang kuis dan raih trofi juara antariksa!
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction('leaderboard');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-md transition-all hover:bg-amber-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>LIHAT LEADERBOARD</span>
                </button>
              </div>
            </div>

            {/* KARTU 4: PANDUAN MULTI-SENSORI */}
            <div
              onClick={() => handleCardAction('multi-sensori')}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                activeFeature === 'multi-sensori'
                  ? 'border-purple-400 bg-gradient-to-br from-[#1c0f45] to-[#13092d] shadow-[0_0_30px_rgba(192,132,252,0.25)]'
                  : 'border-purple-500/20 bg-[#120a2a]/60 hover:border-purple-400/60 hover:bg-[#1a0e40]/70'
              }`}
            >
              <div
                className="animate-bounce"
                style={{ animationDuration: '3.1s' }}
              >
                <IconMultiSensori3D />
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-purple-300">
                  METODE ADAPTIF SD
                </span>
                <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
                  Panduan Multi-Sensori
                </h3>
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-purple-100/85">
                  Belajar konsep abstrak IPA jauh lebih mudah lewat kombinasi
                  ilustrasi visual 3D, narasi cerita suara, dan aktivitas
                  praktik.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction('multi-sensori');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-purple-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-md transition-all hover:bg-purple-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>BUKA PANDUAN</span>
                </button>
              </div>
            </div>
          </div>

          {/* ==============================================================
              BAGIAN 2: PANEL INTERAKTIF AKTIF (SIMULASI & KUIS)
             ============================================================== */}
          <div
            id="interactive-feature-panel"
            className="mt-8 rounded-3xl border border-purple-500/25 bg-[#120a2a]/80 p-6 sm:p-8 backdrop-blur-md"
          >
            {/* Tab Switcher Cepat */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:sparkles"
                  className="h-5 w-5 text-amber-300 animate-pulse"
                />
                <span className="font-heading text-sm sm:text-base font-bold text-white">
                  Ruang Eksplorasi & Simulasi Bintang Edu
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  {
                    key: 'populer-sains',
                    label: '1. Populer Sains',
                  },
                  {
                    key: 'kuis-gamifikasi',
                    label: '2. Kuis Gamifikasi',
                  },
                  {
                    key: 'leaderboard',
                    label: '3. Leaderboard Galaksi',
                  },
                  {
                    key: 'multi-sensori',
                    label: '4. Panduan Multi-Sensori',
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => onSelectFeature(tab.key as ActiveFeatureKey)}
                    className={`rounded-full px-4 py-1.5 font-heading text-xs font-bold transition-all cursor-pointer ${
                      activeFeature === tab.key
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-purple-950/40 text-purple-200 border border-purple-500/20 hover:border-amber-400/60 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KONTEN 1: POPULER SAINS */}
            {activeFeature === 'populer-sains' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {INTERACTIVE_QUIZZES.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-2xl border border-purple-500/20 bg-[#120a2a]/75 p-5 shadow-md transition-all hover:border-yellow-300"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-0.5 font-heading text-[11px] font-bold text-cyan-300">
                          {item.grade}
                        </span>
                        <span className="font-heading text-xs font-bold text-yellow-300">
                          ⭐ +{item.stars}
                        </span>
                      </div>
                      <h4 className="mt-3 font-heading text-base font-bold text-white">
                        {item.topic}
                      </h4>
                      <p className="mt-1.5 font-body text-xs font-semibold leading-relaxed text-blue-100/80">
                        {item.explanation}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleSwitchQuiz(idx);
                          onSelectFeature('kuis-gamifikasi');
                          const el = document.getElementById('interactive-feature-panel');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 border border-white/20 py-2 font-heading text-xs font-bold text-white hover:bg-white/20 transition-colors cursor-pointer"
                      >
                        <span>Mainkan Kuis</span>
                        <Icon icon="lucide:chevron-right" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCardQuizClick(item.id, item.topic)}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-400 py-2 font-heading text-xs font-bold text-slate-950 hover:bg-amber-300 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
                      >
                        <span>Mulai Eksperimen</span>
                        <Icon icon="lucide:rocket" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* KONTEN 2: TANTANGAN KUIS GAMIFIKASI */}
            {activeFeature === 'kuis-gamifikasi' && (
              <div className="mt-6 grid gap-6 lg:grid-cols-12 items-start">
                <div className="lg:col-span-4 space-y-2.5">
                  <p className="font-heading text-xs font-bold uppercase tracking-wider text-yellow-300 mb-2">
                    Pilih Misi Kuis Sains:
                  </p>
                  {INTERACTIVE_QUIZZES.map((q, idx) => {
                    const isDone = completedQuizIds.includes(q.id);
                    const isCurrent = idx === activeQuizIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSwitchQuiz(idx)}
                        className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-yellow-300 bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-md'
                            : 'border-purple-500/20 bg-[#120a2a]/60 text-blue-100 hover:border-yellow-300/50'
                        }`}
                      >
                        <div>
                          <div className="font-heading text-xs font-bold text-yellow-300">
                            {q.grade}
                          </div>
                          <div className="font-heading text-sm font-bold text-white">
                            {q.topic}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 font-heading text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-400 text-slate-950'
                              : isCurrent
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-white/10 text-blue-100'
                          }`}
                        >
                          {isDone ? '✓ Selesai' : `+${q.stars} ⭐`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-8 rounded-2xl border border-purple-500/20 bg-[#120a2a]/80 p-6 sm:p-7 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-4">
                    <div>
                      <span className="font-heading text-xs font-bold uppercase tracking-wider text-cyan-300">
                        {currentQuiz.topic} • {currentQuiz.grade}
                      </span>
                      <h4 className="mt-1 font-heading text-lg sm:text-xl font-bold text-white">
                        {currentQuiz.question}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3.5 py-1 font-heading text-xs font-bold text-slate-950">
                      <Icon icon="lucide:award" className="h-4 w-4" />
                      Hadiah +{currentQuiz.stars} Bintang
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {currentQuiz.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isRight = idx === currentQuiz.correctIndex;

                      let btnStyle =
                        'border-purple-500/20 bg-white/5 text-white hover:border-yellow-300 hover:bg-white/10';
                      if (isAnswered) {
                        if (isRight) {
                          btnStyle =
                            'border-emerald-400 bg-emerald-500/20 text-white';
                        } else if (isSelected && !isRight) {
                          btnStyle =
                            'border-amber-400 bg-amber-500/20 text-white';
                        } else {
                          btnStyle =
                            'border-white/10 bg-white/5 text-blue-200/50 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt.code}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleAnswerQuiz(idx)}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-bold ${
                                isAnswered && isRight
                                  ? 'bg-emerald-400 text-slate-950'
                                  : isSelected
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {opt.code}
                            </span>
                            <span className="font-body text-sm font-bold">
                              {opt.text}
                            </span>
                          </div>
                          {isAnswered && isRight && (
                            <Icon
                              icon="lucide:check-circle-2"
                              className="h-4 w-4 shrink-0 text-emerald-400"
                            />
                          )}
                          {isAnswered && isSelected && !isRight && (
                            <Icon
                              icon="lucide:x-circle"
                              className="h-4 w-4 shrink-0 text-amber-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-yellow-300/30 bg-indigo-900/90 p-4 text-white">
                      <div>
                        <span className="font-heading text-xs font-bold text-yellow-300">
                          {isCorrect
                            ? `🎉 Jawaban Tepat! +${currentQuiz.stars} Bintang`
                            : '💡 Penjelasan Sains Bintang Edu:'}
                        </span>
                        <p className="mt-0.5 font-body text-xs sm:text-sm font-semibold text-blue-100">
                          {currentQuiz.explanation}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedOption(null)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-2 font-heading text-xs font-bold text-white hover:bg-white/20 cursor-pointer"
                        >
                          <Icon icon="lucide:rotate-ccw" className="h-3.5 w-3.5" />
                          <span>Coba Lagi</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCardQuizClick(currentQuiz.id, currentQuiz.topic)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 font-heading text-xs font-bold text-slate-950 hover:bg-amber-300 shadow-md cursor-pointer whitespace-nowrap"
                        >
                          <Icon icon="lucide:flask-conical" className="h-3.5 w-3.5" />
                          <span>Praktik di Lab</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KONTEN 3: LEADERBOARD & PERINGKAT KADET GALAKSI */}
            {activeFeature === 'leaderboard' && (
              <div className="mt-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-indigo-900/40 border border-amber-400/30 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-extrabold text-2xl shadow-lg">
                      🏆
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xs font-bold uppercase tracking-wider text-amber-300">
                          Klasemen Musim Sains SD se-Indonesia
                        </span>
                        <span className="rounded-full bg-emerald-400/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                          Live Update
                        </span>
                      </div>
                      <h4 className="mt-0.5 font-heading text-lg sm:text-xl font-bold text-white">
                        Top Kadet Penjelajah Galaksi Terhebat
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => (onNavigate ? onNavigate('peringkat') : navigate('/leaderboard'))}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 px-5 py-2.5 font-heading text-xs sm:text-sm font-extrabold text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Icon icon="solar:cup-star-bold-duotone" className="text-base" />
                      <span>Buka Leaderboard Lengkap</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectFeature('kuis-gamifikasi')}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-5 py-2.5 font-heading text-xs sm:text-sm font-bold text-white cursor-pointer transition-all"
                    >
                      <Icon icon="solar:stars-minimalistic-bold-duotone" className="text-base text-yellow-300" />
                      <span>Kumpulkan Bintang</span>
                    </button>
                  </div>
                </div>

                {/* 3 Kartu Juara Podium Teratas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      rank: 1,
                      name: 'Alya Putri Antariksa',
                      school: 'SDN Menteng 01 Jakarta',
                      grade: 'Kelas 5 SD',
                      stars: 3450,
                      xp: 3820,
                      streak: 18,
                      badge: '👑 Komandan Utama Galaksi',
                      borderColor: 'border-amber-400',
                      bgPodium: 'bg-gradient-to-b from-amber-500/20 via-slate-900/80 to-indigo-950/90',
                      medalBg: 'bg-amber-400 text-slate-950',
                      medalIcon: '🥇',
                    },
                    {
                      rank: 2,
                      name: 'Rafi Alamsyah',
                      school: 'SD Bintang Kejora Bandung',
                      grade: 'Kelas 6 SD',
                      stars: 3120,
                      xp: 3410,
                      streak: 15,
                      badge: '🥈 Kapten Penjelajah Orbit',
                      borderColor: 'border-slate-300/80',
                      bgPodium: 'bg-gradient-to-b from-slate-400/15 via-slate-900/80 to-indigo-950/90',
                      medalBg: 'bg-slate-300 text-slate-950',
                      medalIcon: '🥈',
                    },
                    {
                      rank: 3,
                      name: 'Kenzo Pratama',
                      school: 'SD Cendekia Medan',
                      grade: 'Kelas 5 SD',
                      stars: 2890,
                      xp: 3100,
                      streak: 12,
                      badge: '🥉 Penjelajah Sains Cilik',
                      borderColor: 'border-amber-700/80',
                      bgPodium: 'bg-gradient-to-b from-amber-700/15 via-slate-900/80 to-indigo-950/90',
                      medalBg: 'bg-amber-700 text-white',
                      medalIcon: '🥉',
                    },
                  ].map((cadet) => (
                    <div
                      key={cadet.rank}
                      className={`relative rounded-3xl border ${cadet.borderColor} ${cadet.bgPodium} p-5 shadow-lg flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-heading text-xs font-black ${cadet.medalBg}`}>
                            <span>{cadet.medalIcon}</span>
                            <span>Peringkat #{cadet.rank}</span>
                          </span>
                          <span className="flex items-center gap-1 font-heading text-xs font-bold text-amber-300">
                            <Icon icon="solar:fire-bold" className="text-orange-400" />
                            <span>{cadet.streak} Hari Aktif</span>
                          </span>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-lg shadow-md border border-white/20">
                            {cadet.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-heading text-sm sm:text-base font-bold text-white line-clamp-1">
                              {cadet.name}
                            </h5>
                            <p className="font-body text-xs text-purple-200/80 line-clamp-1">
                              {cadet.school} · {cadet.grade}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] font-bold text-amber-200 text-center">
                          {cadet.badge}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-heading text-xs font-extrabold">
                        <span className="text-amber-300 flex items-center gap-1">
                          <Icon icon="solar:star-bold" className="text-amber-400" />
                          <span>{cadet.stars.toLocaleString('id-ID')} ⭐</span>
                        </span>
                        <span className="text-cyan-300 flex items-center gap-1">
                          <Icon icon="solar:bolt-bold" className="text-cyan-400" />
                          <span>{cadet.xp.toLocaleString('id-ID')} XP</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KONTEN 4: PANDUAN MULTI-SENSORI */}
            {activeFeature === 'multi-sensori' && (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-purple-500/20 bg-[#120a2a]/80 p-5 shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                      <Icon icon="lucide:eye" className="h-5 w-5" />
                    </div>
                    <h4 className="mt-3 font-heading text-base font-bold text-white">
                      1. Sensori Visual 3D
                    </h4>
                    <p className="mt-1.5 font-body text-xs sm:text-sm font-semibold leading-relaxed text-blue-100/85">
                      Ilustrasi galaksi 3D yang bergerak hidup membantu anak
                      membayangkan konsep ruang angkasa dengan mudah.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-[#120a2a]/80 p-5 shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                      <Icon icon="lucide:volume-2" className="h-5 w-5" />
                    </div>
                    <h4 className="mt-3 font-heading text-base font-bold text-white">
                      2. Sensori Audio Bercerita
                    </h4>
                    <p className="mt-1.5 font-body text-xs sm:text-sm font-semibold leading-relaxed text-blue-100/85">
                      Setiap topik dilengkapi dongeng sains interaktif dari Si
                      Bintang Pintar sehingga anak tidak cepat bosan membaca teks.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-[#120a2a]/80 p-5 shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400 text-slate-950">
                      <Icon icon="lucide:hand" className="h-5 w-5" />
                    </div>
                    <h4 className="mt-3 font-heading text-base font-bold text-white">
                      3. Praktik Kinestetik
                    </h4>
                    <p className="mt-1.5 font-body text-xs sm:text-sm font-semibold leading-relaxed text-blue-100/85">
                      Anak diajak menyentuh, memilih simulasi eksperimen, dan
                      mempraktikkan percobaan sains sederhana yang aman di rumah.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-purple-400/30 bg-purple-950/60 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:sparkles" className="h-6 w-6 text-yellow-300 shrink-0" />
                    <div>
                      <h5 className="font-heading text-sm font-bold text-white">Eksplorasi Metode Adaptif di Simulator Lab Virtual</h5>
                      <p className="font-body text-xs text-blue-200">Uji langsung simulasi molekul air, gravitasi tata surya, dan fotosintesis 60 FPS.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/virtual-lab')}
                    className="inline-flex items-center gap-2 rounded-full bg-purple-400 hover:bg-purple-300 px-5 py-2 font-heading text-xs font-bold text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <span>Buka Lab Virtual</span>
                    <Icon icon="lucide:arrow-right" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* ==============================================================
              BAGIAN 3: TENTANG KAMI (ABOUT)
             ============================================================== */}
          <div id="tentang" className="relative mt-8 pt-8 border-t border-white/15 overflow-hidden">
            {/* Background Glows & Spatial Gradient Spheres */}
            <div className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

            {/* Floating Space Particles / Stars */}
            <div className="pointer-events-none absolute top-4 left-10 text-yellow-300/40 animate-pulse">
              <Icon icon="lucide:sparkles" className="h-5 w-5" />
            </div>
            <div className="pointer-events-none absolute bottom-6 right-16 text-cyan-300/30 animate-bounce">
              <Icon icon="lucide:star" className="h-4 w-4" />
            </div>
            <div className="pointer-events-none absolute top-12 right-10 text-yellow-200/50">
              <Icon icon="lucide:star" className="h-3 w-3" />
            </div>
            <div className="pointer-events-none absolute bottom-12 left-1/4 text-indigo-300/40">
              <Icon icon="lucide:sparkles" className="h-4 w-4" />
            </div>

            {/* Glassmorphism Card Container */}
            <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl animate-pulse" />
                    <BintangEduMascot className="relative h-32 w-32 shrink-0" withBadge={true} />
                  </div>
                  <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-yellow-300 shadow-sm">
                      <Icon icon="lucide:star" className="h-3.5 w-3.5 text-yellow-300" />
                      Tentang Kami
                    </span>
                    <h3 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-white">
                      Bintang Edu
                    </h3>
                    <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-blue-100/85">
                      Bintang Edu adalah platform edukasi sains interaktif yang dirancang khusus untuk anak Sekolah Dasar (SD). Kami percaya bahwa belajar sains harus menyenangkan, penuh eksplorasi, dan bermain tanpa batas.
                    </p>
                    <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-blue-100/85">
                      Melalui modul interaktif, kuis gamifikasi, dan generator lembar eksperimen, kami mengajak siswa-siswi menjadi ilmuwan cilik yang berani bermimpi dan menemukan keajaiban di setiap fenomena alam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
