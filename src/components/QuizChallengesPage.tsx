import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AppSidebar } from './AppSidebar.tsx';
import { AppViewRoute, UserSession } from '../types/navigation.ts';

interface QuizQuestion {
  id: number;
  question: string;
  topic: string;
  badge: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  starReward: number;
  xpReward: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Pada suhu berapakah air murni di Bumi mulai membeku menjadi es padat kristal?',
    topic: 'Siklus Air & Kalor',
    badge: 'Fisika SD',
    options: ['0° Celcius atau lebih rendah', '50° Celcius', '100° Celcius', '25° Celcius'],
    correctIdx: 0,
    explanation:
      'Tepat sekali! Pada suhu 0°C titik beku air tercapai, molekul H2O berhenti bergerak bebas dan saling mengikat erat membentuk kristal es padat.',
    starReward: 20,
    xpReward: 35,
  },
  {
    id: 2,
    question: 'Zat hijau daun pada tumbuhan yang berfungsi menangkap cahaya matahari untuk fotosintesis disebut apa?',
    topic: 'Tumbuhan & Ekosistem',
    badge: 'Biologi SD',
    options: ['Klorofil', 'Oksigen', 'Karbondioksida', 'Glukosa'],
    correctIdx: 0,
    explanation:
      'Hebat! Klorofil adalah pigmen hijau daun yang menjadi panel surya alami tanaman untuk memasak makanan!',
    starReward: 25,
    xpReward: 40,
  },
  {
    id: 3,
    question: 'Di antara planet berikut, manakah yang memiliki gaya gravitasi paling kuat di tata surya kita?',
    topic: 'Tata Surya Antariksa',
    badge: 'Astronomi SD',
    options: ['Jupiter (Raksasa Gas)', 'Mars (Planet Merah)', 'Bumi', 'Merkurius'],
    correctIdx: 0,
    explanation:
      'Luar biasa! Jupiter adalah planet terbesar di tata surya dengan massa raksasa, sehingga gaya gravitasinya mencapai 24.8 m/s²!',
    starReward: 30,
    xpReward: 50,
  },
  {
    id: 4,
    question: 'Mengapa es batu bisa mengapung di permukaan air minum yang kamu tuangkan?',
    topic: 'Sifat Air & Massa Jenis',
    badge: 'Fisika Dasar',
    options: [
      'Massa jenis es lebih kecil daripada air cair karena rongga kisi udara',
      'Es memiliki suhu yang lebih panas dari air',
      'Es terbuat dari minyak',
      'Air menarik es ke atas dengan magnet',
    ],
    correctIdx: 0,
    explanation:
      'Tepat! Kristal es membentuk rongga heksagonal yang membuat massa jenisnya lebih ringan daripada air cair, sehingga mengapung dengan indah!',
    starReward: 25,
    xpReward: 45,
  },
  {
    id: 5,
    question: 'Gas apakah yang dihasilkan oleh tumbuhan saat melakukan fotosintesis di siang hari yang kita hirup?',
    topic: 'Daur Kehidupan',
    badge: 'Lingkungan Hidup',
    options: ['Gas Oksigen (O₂)', 'Gas Karbondioksida (CO₂)', 'Gas Metana', 'Uap Belerang'],
    correctIdx: 0,
    explanation:
      'Pintar sekali! Daun menyerap karbondioksida dan air, lalu melepas oksigen bersih yang sangat dibutuhkan paru-paru kita.',
    starReward: 20,
    xpReward: 35,
  },
];

interface QuizChallengesPageProps {
  user: UserSession;
  onNavigate: (route: AppViewRoute) => void;
  onAddReward: (stars: number, xp: number) => void;
  hideSidebar?: boolean;
}

export const QuizChallengesPage: React.FC<QuizChallengesPageProps> = ({
  user,
  onNavigate,
  onAddReward,
  hideSidebar = false,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(45);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [toastText, setToastText] = useState<string | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  // Timer Countdown per soal
  useEffect(() => {
    if (!timerActive || isAnswered || quizCompleted) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isAnswered, quizCompleted, currentIdx]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    showToast('⏰ Waktu habis untuk pertanyaan ini!');
  };

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3000);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIdx) {
      setScore((prev) => prev + 1);
      onAddReward(currentQ.starReward, currentQ.xpReward);
      showToast(`⭐ Jawaban Tepat! +${currentQ.starReward} Bintang & +${currentQ.xpReward} XP!`);
    } else {
      showToast('💡 Masih belum tepat, baca penjelasan sains ya!');
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setSecondsLeft(45);
    } else {
      setQuizCompleted(true);
      setTimerActive(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setSecondsLeft(45);
    setTimerActive(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-yellow-300 bg-indigo-950 px-5 py-3.5 shadow-2xl text-white">
          <Icon icon="solar:sparkles-bold" className="h-5 w-5 text-yellow-300 animate-spin" />
          <span className="text-xs sm:text-sm font-bold">{toastText}</span>
        </div>
      )}

      {/* Sidebar Navigasi Utama */}
      {!hideSidebar && <AppSidebar currentRoute="tantangan-kuis" onNavigate={onNavigate} user={user} />}

      {/* Konten Utama */}
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-8 transition-all duration-300 ease-in-out">
          {/* HEADER TANTANGAN KUIS */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-blue-950 border border-indigo-900/50 p-6 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-black text-pink-300">
                  <Icon icon="solar:bolt-circle-bold-duotone" />
                  <span>Arena Tantangan Kuis Kilat SD</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                  Kuis Harian Sains Antariksa ⚡
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Uji pemahaman sainsmu, kumpulkan bintang bonus, dan pertahankan rentetan hari (Streak {user.streak} Hari 🔥)!
                </p>
              </div>

              {/* Status Timer & Progress */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                <div className="text-center">
                  <p className="text-2xl font-black text-pink-400 tabular-nums">
                    {secondsLeft}s
                  </p>
                  <p className="text-[11px] font-bold text-slate-300">Sisa Waktu</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-black text-yellow-300">
                    {currentIdx + 1}/{QUIZ_QUESTIONS.length}
                  </p>
                  <p className="text-[11px] font-bold text-slate-300">Soal</p>
                </div>
              </div>
            </div>
          </div>

          {/* QUESTION BOX OR RESULT */}
          {!quizCompleted ? (
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Progress Bar Soal */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-black">
                      {currentQ.topic}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span>{currentQ.badge}</span>
                  </span>
                  <span className="font-black text-slate-800">
                    Reward: +{currentQ.starReward} ⭐ | +{currentQ.xpReward} XP
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 transition-all duration-300"
                    style={{
                      width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Teks Pertanyaan */}
              <div className="py-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {currentQ.question}
                </h2>
              </div>

              {/* Opsi Pilihan Jawaban */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQ.options.map((opt, oIdx) => {
                  let btnStyle = 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-800';

                  if (isAnswered) {
                    if (oIdx === currentQ.correctIdx) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300 font-black';
                    } else if (selectedOption === oIdx) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-800 font-bold';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${btnStyle}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-300 text-xs font-black shadow-xs">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-xs sm:text-sm font-bold flex-1">{opt}</span>
                      {isAnswered && oIdx === currentQ.correctIdx && (
                        <Icon icon="solar:check-circle-bold" className="text-emerald-600 text-xl shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box After Answer */}
              {isAnswered && (
                <div className="p-5 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-xs sm:text-sm space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 font-black text-indigo-900">
                    <Icon icon="solar:lightbulb-bold" className="text-lg text-amber-500" />
                    <span>Penjelasan Sains Kadet Foxy:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {currentQ.explanation}
                  </p>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>
                        {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil Kuis 🏆'}
                      </span>
                      <Icon icon="solar:arrow-right-linear" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* KARTU HASIL AKHIR KUIS */
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-8 sm:p-12 text-center shadow-lg space-y-6">
              <div className="inline-flex h-20 w-20 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-600 items-center justify-center text-4xl shadow-md animate-bounce">
                🏆
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  Tantangan Harian Selesai!
                </span>
                <h2 className="text-3xl font-black text-slate-900">
                  Luar Biasa, Kadet {user.name}!
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Kamu berhasil menjawab <strong>{score} dari {QUIZ_QUESTIONS.length} soal</strong> dengan benar!
                </p>
              </div>

              {/* Score summary cards */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <p className="text-2xl font-black text-amber-700">+{score * 25}</p>
                  <p className="text-xs font-bold text-amber-900">⭐ Bintang Baru</p>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <p className="text-2xl font-black text-sky-700">+{score * 40}</p>
                  <p className="text-xs font-bold text-sky-900">🚀 XP Diperoleh</p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                  <p className="text-2xl font-black text-orange-700">{user.streak + 1} Hari</p>
                  <p className="text-xs font-bold text-orange-900">🔥 Streak Bertambah</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-black transition-all cursor-pointer flex items-center gap-2"
                >
                  <Icon icon="solar:restart-bold" />
                  <span>Ulangi Kuis</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('peringkat')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Icon icon="solar:cup-star-bold" />
                  <span>Lihat Peringkat Podium 🏆</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
