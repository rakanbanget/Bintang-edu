import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BintangEduMascot } from './BintangEduLogo.tsx';
import {
  IconPopulerSains3D,
  IconKuisGamifikasi3D,
  IconAIGenerator3D,
  IconMultiSensori3D,
  AppBannerMascotTablet,
} from './KidoIllustrations.tsx';

export type ActiveFeatureKey =
  | 'populer-sains'
  | 'kuis-gamifikasi'
  | 'ai-generator'
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
}

export const ScienceModulesSection: React.FC<ScienceModulesSectionProps> = ({
  activeFeature,
  onSelectFeature,
  activeQuizIndex,
  onSelectQuizIndex,
  onAddStars,
  onNotify,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completedQuizIds, setCompletedQuizIds] = useState<number[]>([]);

  const [aiGrade, setAiGrade] = useState('Kelas 4 SD');
  const [aiTopic, setAiTopic] = useState('Tata Surya & Planet');
  const [generatedSheet, setGeneratedSheet] = useState<{
    title: string;
    objective: string;
    experimentSteps: string[];
    funFact: string;
  } | null>(null);

  const currentQuiz =
    INTERACTIVE_QUIZZES[activeQuizIndex] || INTERACTIVE_QUIZZES[0];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQuiz.correctIndex;

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

  const handleGenerateAISheet = (e: React.FormEvent) => {
    e.preventDefault();
    const templates: Record<
      string,
      {
        title: string;
        objective: string;
        experimentSteps: string[];
        funFact: string;
      }
    > = {
      'Tata Surya & Planet': {
        title: `Lembar Eksperimen AI: Model Orbit Planet (${aiGrade})`,
        objective:
          'Siswa memahami susunan 8 planet mengelilingi Matahari serta perbedaan ukuran planet batuan dan raksasa gas.',
        experimentSteps: [
          'Siapkan bola kuning sebagai Matahari di tengah meja dan plastisin warna-warni sebagai planet.',
          'Susun urutan planet dari terdekat: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus.',
          'Tambahkan cincin kertas melingkar pada bola Saturnus lalu putar mengelilingi Matahari!',
        ],
        funFact:
          'Tahukah kamu? Satu hari di planet Venus lebih lama daripada satu tahun di Venus karena rotasinya sangat lambat!',
      },
      'Fotosintesis & Tumbuhan': {
        title: `Lembar Eksperimen AI: Gelembung Oksigen Daun (${aiGrade})`,
        objective:
          'Siswa membuktikan secara langsung bahwa daun hijau menghasilkan gas oksigen ketika terkena cahaya matahari.',
        experimentSteps: [
          'Masukkan sehelai daun segar ke dalam gelas bening berisi air bersih.',
          'Letakkan gelas di bawah sinar matahari pagi selama 20–30 menit.',
          'Amati munculnya gelembung-gelembung udara kecil di permukaan daun—itulah oksigen!',
        ],
        funFact:
          'Daun berwarna hijau karena memiliki zat klorofil yang bekerja seperti panel surya alami penangkap cahaya!',
      },
      'Gaya & Magnet': {
        title: `Lembar Eksperimen AI: Detektif Benda Magnetis (${aiGrade})`,
        objective:
          'Siswa mampu membedakan benda feromagnetik (ditarik kuat oleh magnet) dan benda non-magnetik di rumah/kelas.',
        experimentSteps: [
          'Kumpulkan 5 benda: klip kertas besi, penghapus karet, pensil kayu, sendok logam, dan uang koin.',
          'Dekatkan magnet batang pada masing-masing benda dan catat mana yang menempel.',
          'Coba dekatkan dua ujung magnet bertanda sama untuk merasakan gaya tolak-menolaknya!',
        ],
        funFact:
          'Bumi tempat kita berpijak sebenarnya adalah sebuah magnet raksasa yang membuat jarum kompas selalu menunjuk Utara!',
      },
    };

    const chosen =
      templates[aiTopic] || templates['Tata Surya & Planet'];
    setGeneratedSheet(chosen);
    onNotify(`✨ Modul AI "${chosen.title}" berhasil dibuat!`);
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
      id="modul-sains"
      className="relative z-20 py-4 px-4 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* ================================================================
            CONTAINER KACA GALAKSI 3D (Selaras dengan Tema Ruang Angkasa)
           ================================================================ */}
        <div className="rounded-[36px] border border-white/15 bg-indigo-950/65 p-6 sm:p-10 lg:p-12 text-white shadow-2xl backdrop-blur-xl">
          {/* Header Bagian Eksplorasi Mimpi & Sains */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-6">
            <div>
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-yellow-300">
                ✨ Bintang Edu • Childhood Dream Lab
              </span>
              <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-white">
                Jelajahi Wahana Sains & Wujudkan Mimpimu!
              </h2>
            </div>
            <p className="max-w-md font-body text-xs sm:text-sm font-semibold text-blue-200/85">
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
                  ? 'border-yellow-300 bg-gradient-to-br from-indigo-900/90 to-blue-900/80 shadow-[0_0_30px_rgba(250,204,21,0.2)]'
                  : 'border-white/15 bg-white/5 hover:border-yellow-300/60 hover:bg-white/10'
              }`}
            >
              <div
                className="animate-bounce"
                style={{ animationDuration: '3.2s' }}
              >
                <IconPopulerSains3D />
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-yellow-300">
                  MODUL & VIDEO IPA
                </span>
                <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
                  Populer Sains
                </h3>
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-blue-100/85">
                  Jelajahi topik sains paling disukai anak SD: rahasia cincin
                  Saturnus, dapur fotosintesis tumbuhan, hingga siklus pelangi.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction('populer-sains');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-md transition-all hover:bg-yellow-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>LIHAT POPULER</span>
                </button>
              </div>
            </div>

            {/* KARTU 2: TANTANGAN KUIS GAMIFIKASI */}
            <div
              id="kuis-interaktif"
              onClick={() => handleCardAction('kuis-gamifikasi')}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                activeFeature === 'kuis-gamifikasi'
                  ? 'border-cyan-300 bg-gradient-to-br from-blue-900/90 to-indigo-900/80 shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                  : 'border-white/15 bg-white/5 hover:border-cyan-300/60 hover:bg-white/10'
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
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-blue-100/85">
                  Uji pemahaman sains lewat kuis interaktif seru! Jawab soal
                  dengan tepat dan kumpulkan Bintang Prestasi setiap hari.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction('kuis-gamifikasi');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-md transition-all hover:bg-cyan-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>MAINKAN KUIS</span>
                </button>
              </div>
            </div>

            {/* KARTU 3: AI GENERATOR UNTUK GURU/ORTU */}
            <div
              onClick={() => handleCardAction('ai-generator')}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                activeFeature === 'ai-generator'
                  ? 'border-emerald-300 bg-gradient-to-br from-indigo-900/90 to-purple-900/80 shadow-[0_0_30px_rgba(52,211,153,0.22)]'
                  : 'border-white/15 bg-white/5 hover:border-emerald-300/60 hover:bg-white/10'
              }`}
            >
              <div
                className="animate-bounce"
                style={{ animationDuration: '3.4s' }}
              >
                <IconAIGenerator3D />
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  FITUR GURU & ORANG TUA
                </span>
                <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
                  AI Generator untuk Guru/Ortu
                </h3>
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-blue-100/85">
                  Susun lembar kerja eksperimen IPA di rumah, rangkuman materi
                  kurikulum SD, dan ide praktik sains instan berbasis AI.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction('ai-generator');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-md transition-all hover:bg-emerald-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>BUAT MODUL AI</span>
                </button>
              </div>
            </div>

            {/* KARTU 4: PANDUAN MULTI-SENSORI */}
            <div
              onClick={() => handleCardAction('multi-sensori')}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                activeFeature === 'multi-sensori'
                  ? 'border-purple-300 bg-gradient-to-br from-purple-900/90 to-indigo-900/80 shadow-[0_0_30px_rgba(192,132,252,0.25)]'
                  : 'border-white/15 bg-white/5 hover:border-purple-300/60 hover:bg-white/10'
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
                <p className="mt-2 font-body text-sm font-semibold leading-relaxed text-blue-100/85">
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
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-purple-400 px-6 py-2.5 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-md transition-all hover:bg-purple-300 hover:scale-105 active:scale-95 cursor-pointer"
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
            className="mt-8 rounded-3xl border border-white/15 bg-indigo-900/50 p-6 sm:p-8 backdrop-blur-md"
          >
            {/* Tab Switcher Cepat */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:sparkles"
                  className="h-5 w-5 text-yellow-300 animate-pulse"
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
                    key: 'ai-generator',
                    label: '3. AI Generator Guru/Ortu',
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
                        ? 'bg-yellow-400 text-indigo-950 shadow-md'
                        : 'bg-white/10 text-blue-100 border border-white/15 hover:border-yellow-300/60'
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
                    className="flex flex-col justify-between rounded-2xl border border-white/15 bg-indigo-950/75 p-5 shadow-md transition-all hover:border-yellow-300"
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
                    <button
                      type="button"
                      onClick={() => {
                        handleSwitchQuiz(idx);
                        onSelectFeature('kuis-gamifikasi');
                      }}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2 font-heading text-xs font-bold text-indigo-950 hover:bg-yellow-300 cursor-pointer"
                    >
                      <span>Mainkan Kuis</span>
                      <Icon icon="lucide:chevron-right" className="h-3.5 w-3.5" />
                    </button>
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
                            : 'border-white/15 bg-indigo-950/60 text-blue-100 hover:border-yellow-300/50'
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
                              ? 'bg-emerald-400 text-indigo-950'
                              : isCurrent
                              ? 'bg-yellow-400 text-indigo-950'
                              : 'bg-white/10 text-blue-100'
                          }`}
                        >
                          {isDone ? '✓ Selesai' : `+${q.stars} ⭐`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-8 rounded-2xl border border-white/15 bg-indigo-950/80 p-6 sm:p-7 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-4">
                    <div>
                      <span className="font-heading text-xs font-bold uppercase tracking-wider text-cyan-300">
                        {currentQuiz.topic} • {currentQuiz.grade}
                      </span>
                      <h4 className="mt-1 font-heading text-lg sm:text-xl font-bold text-white">
                        {currentQuiz.question}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3.5 py-1 font-heading text-xs font-bold text-indigo-950">
                      <Icon icon="lucide:award" className="h-4 w-4" />
                      Hadiah +{currentQuiz.stars} Bintang
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {currentQuiz.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isRight = idx === currentQuiz.correctIndex;

                      let btnStyle =
                        'border-white/15 bg-white/5 text-white hover:border-yellow-300 hover:bg-white/10';
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
                                  ? 'bg-emerald-400 text-indigo-950'
                                  : isSelected
                                  ? 'bg-amber-400 text-indigo-950'
                                  : 'bg-yellow-400 text-indigo-950'
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
                      <button
                        type="button"
                        onClick={() => setSelectedOption(null)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2 font-heading text-xs font-bold text-indigo-950 hover:bg-yellow-300 cursor-pointer"
                      >
                        <Icon icon="lucide:rotate-ccw" className="h-3.5 w-3.5" />
                        <span>Coba Lagi</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KONTEN 3: AI GENERATOR UNTUK GURU / ORTU */}
            {activeFeature === 'ai-generator' && (
              <div className="mt-6 grid gap-6 lg:grid-cols-12 items-start">
                <form
                  onSubmit={handleGenerateAISheet}
                  className="lg:col-span-5 rounded-2xl border border-white/15 bg-indigo-950/80 p-6 shadow-md space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:book-open"
                      className="h-5 w-5 text-emerald-300"
                    />
                    <h4 className="font-heading text-base font-bold text-white">
                      Generator Lembar Eksperimen AI
                    </h4>
                  </div>

                  <div>
                    <label className="block font-heading text-xs font-bold text-yellow-300 mb-1">
                      Pilih Jenjang Kelas SD
                    </label>
                    <select
                      value={aiGrade}
                      onChange={(e) => setAiGrade(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-indigo-900 px-3.5 py-2.5 font-body text-sm font-bold text-white focus:border-yellow-300 focus:outline-none"
                    >
                      <option value="Kelas 1–2 SD">Kelas 1–2 SD</option>
                      <option value="Kelas 3–4 SD">Kelas 3–4 SD</option>
                      <option value="Kelas 5–6 SD">Kelas 5–6 SD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-heading text-xs font-bold text-yellow-300 mb-1">
                      Topik Kurikulum Sains IPA
                    </label>
                    <select
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-indigo-900 px-3.5 py-2.5 font-body text-sm font-bold text-white focus:border-yellow-300 focus:outline-none"
                    >
                      <option value="Tata Surya & Planet">
                        Tata Surya & Planet
                      </option>
                      <option value="Fotosintesis & Tumbuhan">
                        Fotosintesis & Tumbuhan
                      </option>
                      <option value="Gaya & Magnet">Gaya & Magnet</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-yellow-400 py-3 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-md hover:bg-yellow-300 cursor-pointer"
                  >
                    ✨ SUSUN PANDUAN EKSPERIMEN AI
                  </button>
                </form>

                <div className="lg:col-span-7 rounded-2xl border border-white/15 bg-indigo-950/80 p-6 shadow-md">
                  {generatedSheet ? (
                    <div className="space-y-3">
                      <span className="inline-block rounded-full bg-emerald-400/20 border border-emerald-400/40 px-3 py-1 font-heading text-xs font-bold text-emerald-300">
                        Siap Dicetak / Dipraktikkan
                      </span>
                      <h4 className="font-heading text-lg font-bold text-white">
                        {generatedSheet.title}
                      </h4>
                      <p className="font-body text-xs sm:text-sm font-semibold text-blue-100">
                        <strong className="text-yellow-300">
                          Tujuan Belajar:
                        </strong>{' '}
                        {generatedSheet.objective}
                      </p>
                      <div className="space-y-2 pt-1">
                        <div className="font-heading text-xs font-bold uppercase text-cyan-300">
                          Langkah Eksperimen Bersama Anak:
                        </div>
                        {generatedSheet.experimentSteps.map((step, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 rounded-xl bg-white/5 border border-white/10 p-3 font-body text-xs sm:text-sm font-semibold text-white"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-heading text-xs font-bold text-indigo-950">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl bg-indigo-900/90 border border-yellow-300/30 p-3.5 text-xs font-semibold text-blue-100">
                        <strong className="text-yellow-300">
                          🌟 Fakta Sains Seru:{' '}
                        </strong>
                        {generatedSheet.funFact}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Icon
                        icon="lucide:sparkles"
                        className="h-10 w-10 text-yellow-300 mb-2 animate-pulse"
                      />
                      <h4 className="font-heading text-base font-bold text-white">
                        Pilih Kelas & Topik Sains di Samping
                      </h4>
                      <p className="mt-1 max-w-md font-body text-xs sm:text-sm font-semibold text-blue-200/80">
                        AI Generator Bintang Edu akan membuatkan langkah
                        eksperimen sederhana beserta fakta sains menarik untuk
                        mendampingi anak belajar di rumah atau sekolah.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KONTEN 4: PANDUAN MULTI-SENSORI */}
            {activeFeature === 'multi-sensori' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-indigo-950/80 p-5 shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-indigo-950">
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

                <div className="rounded-2xl border border-white/15 bg-indigo-950/80 p-5 shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-indigo-950">
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

                <div className="rounded-2xl border border-white/15 bg-indigo-950/80 p-5 shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400 text-indigo-950">
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
