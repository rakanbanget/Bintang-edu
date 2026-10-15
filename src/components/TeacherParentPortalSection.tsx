import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { AppViewRoute } from '../types/navigation.ts';

interface GeneratedWorksheet {
  title: string;
  grade: string;
  topic: string;
  difficulty: string;
  learningGoal: string;
  homeMaterials: string[];
  steps: string[];
  discussionQuestion: string;
  scienceFunFact: string;
}

const SAMPLE_TEMPLATES: Record<string, GeneratedWorksheet> = {
  'tata-surya': {
    title: 'Lembar Eksperimen: Meniru Orbit & Gravitasi Planet',
    grade: 'Kelas 4–5 SD',
    topic: 'Tata Surya & Gravitasi',
    difficulty: 'Sedang (Menyenangkan)',
    learningGoal: 'Siswa memahami gaya tarik gravitasi yang menjaga 8 planet tetap mengorbit Matahari tanpa bertabrakan.',
    homeMaterials: [
      '1 buah baskom besar atau kain lentur',
      '1 buah bola berat (jeruk / apel) sebagai Matahari',
      '3 kelereng kecil / bola bekel sebagai Planet',
    ],
    steps: [
      'Bentangkan kain secara horizontal dan letakkan jeruk tepat di tengah hingga kain melengkung ke bawah.',
      'Dorong kelereng perlahan di tepi kain secara melingkar mengitari jeruk.',
      'Amati bagaimana kelereng terus berputar mengitari pusat lengkungan—itulah miniatur gravitasi Matahari!',
    ],
    discussionQuestion: 'Apa yang terjadi pada kelereng saat kecepatannya mulai berkurang? Bagaimana jika massa Matahari lebih besar?',
    scienceFunFact: 'Gravitasi Matahari sangat kuat sehingga mampu mengikat planet Neptunus yang berjarak 4,5 miliar kilometer!',
  },
  'fotosintesis': {
    title: 'Lembar Eksperimen: Menangkap Gelembung Oksigen Daun',
    grade: 'Kelas 3–4 SD',
    topic: 'Fotosintesis Tumbuhan',
    difficulty: 'Mudah (Aman di Rumah)',
    learningGoal: 'Siswa membuktikan secara visual bahwa daun hijau memproduksi gas oksigen saat terkena sinar matahari.',
    homeMaterials: [
      '1 gelas bening transparan',
      'Air bersih secukupnya',
      '1–2 helai daun segar yang baru dipetik',
      'Sinar matahari pagi / lampu meja',
    ],
    steps: [
      'Isi gelas bening dengan air bersih hingga tiga perempat penuh.',
      'Celupkan daun segar ke dasar air dan pastikan seluruh permukaan daun terendam.',
      'Jemur di bawah sinar matahari selama 20–30 menit, lalu amati butiran gelembung udara di tepi daun.',
    ],
    discussionQuestion: 'Dari manakah gelembung oksigen itu berasal? Apa yang dibutuhkan tumbuhan untuk membuat makanannya?',
    scienceFunFact: 'Satu pohon rindang dewasa dapat menghasilkan pasokan oksigen harian untuk 2 hingga 4 manusia bernapas!',
  },
  'magnet': {
    title: 'Lembar Eksperimen: Detektif Kutub & Gaya Tolak Magnet',
    grade: 'Kelas 5 SD',
    topic: 'Gaya & Kutub Magnet',
    difficulty: 'Menantang & Seru',
    learningGoal: 'Siswa membedakan interaksi tarik-menarik dan tolak-menolak antar kutub magnet serta sifat benda feromagnetik.',
    homeMaterials: [
      '2 buah magnet kulkas atau magnet batang',
      'Klip kertas logam, jarum pentul, dan sendok plastik',
      'Selembar kertas putih dan sedikit serbuk pensil / peniti',
    ],
    steps: [
      'Dekatkan kutub utara magnet dengan kutub utara magnet lainnya perlahan-lahan.',
      'Rasakan gaya tolak kasat mata yang seolah mendorong tanganmu menjauh tanpa bersentuhan.',
      'Uji benda mana saja di mejamu yang dapat ditarik kuat oleh magnet dan kelompokkan hasilnya.',
    ],
    discussionQuestion: 'Mengapa jarum kompas selalu menunjuk ke arah kutub utara Bumi? Apakah Bumi kita sebuah magnet?',
    scienceFunFact: 'Inti luar Bumi tersusun dari besi cair yang berputar cepat dan menghasilkan medan magnet pelindung Bumi!',
  },
};

interface StudentPreview {
  id: string;
  name: string;
  grade: string;
  level: number;
  accuracy: number;
  currentStation: string;
  dominantSensory: 'Visual 3D' | 'Kinestetik' | 'Auditori';
  stars: number;
  status: 'Aktif Belajar' | 'Perlu Pendampingan' | 'Selesai Misi';
  aiNote: string;
  sensoryBreakdown: { visual: number; kinesthetic: number; auditory: number };
}

const PREVIEW_STUDENTS: StudentPreview[] = [
  {
    id: 'std-2',
    name: 'Siti Rahmawati',
    grade: 'Kelas 5 SD',
    level: 8,
    accuracy: 94,
    currentStation: 'Stasiun 3 (Dapur Fotosintesis)',
    dominantSensory: 'Kinestetik',
    stars: 180,
    status: 'Selesai Misi',
    aiNote: 'Unggul dalam eksperimen praktikum daun. Siap tantangan level lanjut.',
    sensoryBreakdown: { visual: 25, kinesthetic: 55, auditory: 20 },
  },
  {
    id: 'std-3',
    name: 'Budi Pratama',
    grade: 'Kelas 5 SD',
    level: 5,
    accuracy: 72,
    currentStation: 'Stasiun 1 (Siklus Air & Hujan)',
    dominantSensory: 'Auditori',
    stars: 90,
    status: 'Perlu Pendampingan',
    aiNote: 'Lebih mudah menyerap penjelasan audio/cerita dibanding teks panjang.',
    sensoryBreakdown: { visual: 20, kinesthetic: 30, auditory: 50 },
  },
  {
    id: 'std-1',
    name: 'Minton Cadence',
    grade: 'Kelas 5 SD',
    level: 7,
    accuracy: 88,
    currentStation: 'Stasiun 2 (Planet Saturnus)',
    dominantSensory: 'Visual 3D',
    stars: 125,
    status: 'Aktif Belajar',
    aiNote: 'Sangat memahami gravitasi planet. Perlu penguatan materi fotosintesis.',
    sensoryBreakdown: { visual: 50, kinesthetic: 30, auditory: 20 },
  },
];

interface TeacherParentPortalSectionProps {
  onNavigate?: (route: AppViewRoute) => void;
  onOpenTeacherTab?: (tab: 'students' | 'generator' | 'analytics' | 'curriculum') => void;
  onNotify?: (msg: string) => void;
  isAuthenticated?: boolean;
}

export const TeacherParentPortalSection: React.FC<TeacherParentPortalSectionProps> = ({
  onNavigate,
  onOpenTeacherTab,
  onNotify,
  isAuthenticated = false,
}) => {
  const navigate = useNavigate();

  // State untuk Generator Lembar Kerja AI
  const [topicInput, setTopicInput] = useState('Tata Surya & Gravitasi');
  const [selectedGrade, setSelectedGrade] = useState('Kelas 4 SD');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState<GeneratedWorksheet>(SAMPLE_TEMPLATES['tata-surya']);
  const [copied, setCopied] = useState(false);

  // State untuk Tab Monitor Anak
  const [activeTab, setActiveTab] = useState<'monitor' | 'tips'>('monitor');
  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const currentStudent = PREVIEW_STUDENTS[selectedStudentIdx] || PREVIEW_STUDENTS[0];

  // Handler navigasi langsung ke Dashboard Guru dengan Tab Spesifik (Wajib Melalui Autentikasi)
  const handleGoToTeacherDashboard = (targetTab: 'students' | 'generator' | 'analytics' | 'curriculum') => {
    if (isAuthenticated) {
      if (onOpenTeacherTab) {
        onOpenTeacherTab(targetTab);
      } else if (onNavigate) {
        onNavigate('dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (onNotify) {
        onNotify('🔒 Akses Pendidik: Silakan masuk dengan akun Guru terlebih dahulu.');
      }
      if (onNavigate) {
        onNavigate('login');
      } else {
        navigate('/login');
      }
    }
  };

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const query = topicInput.toLowerCase();
      let selected = SAMPLE_TEMPLATES['tata-surya'];

      if (query.includes('foto') || query.includes('daun') || query.includes('tumbuh') || query.includes('oksigen')) {
        selected = SAMPLE_TEMPLATES['fotosintesis'];
      } else if (query.includes('magnet') || query.includes('kutub') || query.includes('gaya')) {
        selected = SAMPLE_TEMPLATES['magnet'];
      }

      setGeneratedSheet({
        ...selected,
        grade: selectedGrade,
        topic: topicInput || selected.topic,
      });

      if (onNotify) {
        onNotify(`✨ Lembar kerja AI untuk topik "${topicInput || selected.topic}" berhasil digenerate!`);
      }
    }, 800);
  };

  const handleCopyWorksheet = () => {
    const textToCopy = `📚 MODUL SAINS BINTANG EDU - ${generatedSheet.title}\n` +
      `Kelas: ${generatedSheet.grade} | Topik: ${generatedSheet.topic}\n` +
      `🎯 Target: ${generatedSheet.learningGoal}\n\n` +
      `🛠️ Alat & Bahan:\n${generatedSheet.homeMaterials.map((m) => `• ${m}`).join('\n')}\n\n` +
      `📝 Langkah Praktik:\n${generatedSheet.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\n` +
      `❓ Diskusi: ${generatedSheet.discussionQuestion}\n` +
      `💡 Fakta: ${generatedSheet.scienceFunFact}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onNotify) onNotify('📋 Lembar kerja berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      if (onNotify) {
        onNotify('📄 Laporan kemajuan belajar siswa (PDF) berhasil diunduh!');
      }
    }, 1100);
  };

  return (
    <section id="portal-guru-ortu" className="relative z-20 py-8 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* ================================================================
            KARTU UTAMA GALAKSI GELAP (100% Selaras Tema Dashboard Guru)
           ================================================================ */}
        <div className="relative overflow-hidden rounded-[36px] border border-purple-500/30 bg-gradient-to-br from-[#1c0f45] via-[#13092d] to-[#0d0521] p-6 sm:p-10 lg:p-12 text-white shadow-[0_22px_48px_rgba(2,6,23,0.38),0_0_28px_rgba(139,92,246,0.24)] backdrop-blur-xl">
          
          {/* Efek Pendaran Atmosfer di Sudut */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          {/* ==============================================================
              HEADER SECTION: JUDUL & BADGE
             ============================================================== */}
          <div className="relative z-10 mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-purple-500/20 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300 mb-2.5">
                <Icon icon="solar:users-group-rounded-bold" className="h-4 w-4 text-amber-400" />
                <span>Kolaborasi & Pantauan Belajar</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                🌟 Portal Khusus Guru & Orang Tua
              </h2>
            </div>
            <p className="max-w-md font-body text-xs sm:text-sm font-semibold text-purple-200/80 leading-relaxed">
              Dampingi kadet cilik bereksplorasi sains! Buat modul praktik di rumah berbasis AI kurikulum SD dan monitor evaluasi pemahaman belajar secara real-time.
            </p>
          </div>

          {/* ==============================================================
              GRID UTAMA: DUA KOLOM FITUR INTERAKTIF (PRESISI DASHBOARD GURU)
             ============================================================== */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ════════════════════════════════════════════════════════════
                KOLOM 1 (7 KOLOM): AI STUDIO LEMBAR KERJA & MODUL IPA
               ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Header Kolom 1 dengan Tombol "Buat Modul AI" */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#1c0f45] to-[#160c38] p-4 rounded-2xl border border-purple-500/30 shadow-md">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 mt-0.5">
                    <Icon icon="solar:magic-stick-3-bold" className="h-5 w-5 text-amber-300" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                      ✨ AI Studio Lembar Kerja & Modul IPA
                    </h3>
                    <p className="font-body text-xs text-purple-200/80 leading-relaxed mt-0.5">
                      Racik lembar kerja eksperimen, rangkuman Kurikulum Merdeka SD, dan modul IPA interaktif instan berbasis AI.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGoToTeacherDashboard('generator')}
                  className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Icon icon="solar:magic-stick-3-bold" className="h-4 w-4" />
                  <span>Buat Modul AI</span>
                </button>
              </div>

              {/* Form Input Generator Cepat */}
              <form
                onSubmit={handleGenerate}
                className="rounded-2xl border border-purple-500/25 bg-[#120a2a]/80 p-5 shadow-lg backdrop-blur-md space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-heading text-[11px] font-bold uppercase tracking-wider text-purple-200/80">
                      Topik Sains Kurikulum SD
                    </label>
                    <div className="relative">
                      <Icon
                        icon="lucide:book-open"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/80 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="Contoh: Tata Surya Kelas 4 SD"
                        className="w-full rounded-xl border border-purple-500/30 bg-[#160c38] pl-10 pr-4 py-2.5 font-body text-xs sm:text-sm text-white placeholder-purple-300/40 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-heading text-[11px] font-bold uppercase tracking-wider text-purple-200/80">
                      Tingkat Kelas
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full rounded-xl border border-purple-500/30 bg-[#160c38] px-3 py-2.5 font-body text-xs sm:text-sm font-semibold text-white focus:border-amber-400 focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Kelas 1 SD">Kelas 1 SD</option>
                      <option value="Kelas 2 SD">Kelas 2 SD</option>
                      <option value="Kelas 3 SD">Kelas 3 SD</option>
                      <option value="Kelas 4 SD">Kelas 4 SD</option>
                      <option value="Kelas 5 SD">Kelas 5 SD</option>
                      <option value="Kelas 6 SD">Kelas 6 SD</option>
                    </select>
                  </div>
                </div>

                {/* Preset Chips Topik Populer */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-heading text-[10px] font-bold uppercase text-purple-300/60 mr-1">
                    Preset:
                  </span>
                  {[
                    { label: '🪐 Tata Surya', val: 'Tata Surya & Gravitasi' },
                    { label: '🌱 Fotosintesis', val: 'Fotosintesis Daun' },
                    { label: '🧲 Gaya Magnet', val: 'Gaya & Kutub Magnet' },
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => setTopicInput(chip.val)}
                      className="rounded-lg border border-purple-500/25 bg-purple-950/40 px-2.5 py-1 text-[11px] font-medium text-purple-200 hover:border-amber-400/50 hover:text-white transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Bar Tombol Aksi Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-400/40 py-2.5 px-4 font-heading text-xs font-bold text-purple-100 shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <>
                        <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin text-amber-300" />
                        <span>Meracik Preview...</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="lucide:sparkles" className="h-4 w-4 text-amber-300" />
                        <span>Preview Singkat di Sini</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoToTeacherDashboard('generator')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 py-2.5 px-4 font-heading text-xs font-extrabold text-slate-950 shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Icon icon="solar:magic-stick-3-bold" className="h-4 w-4" />
                    <span>Buat Modul AI</span>
                  </button>
                </div>
              </form>

              {/* Box Preview Hasil Generate Lembar Kerja */}
              <div className="rounded-2xl border border-purple-500/20 bg-[#120a2a]/90 p-5 shadow-xl space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
                  <div>
                    <span className="inline-block rounded-md bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300 uppercase tracking-wide">
                      Preview Modul AI • {generatedSheet.grade}
                    </span>
                    <h4 className="mt-1 font-heading text-sm sm:text-base font-bold text-white">
                      {generatedSheet.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyWorksheet}
                      title="Salin Lembar Kerja"
                      className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-950/50 px-2.5 py-1.5 text-[11px] font-bold text-purple-200 hover:border-amber-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} className="h-3.5 w-3.5 text-amber-300" />
                      <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      title="Simpan sebagai Dokumen"
                      className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-950/50 px-2.5 py-1.5 text-[11px] font-bold text-purple-200 hover:border-amber-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Icon icon="lucide:file-down" className="h-3.5 w-3.5 text-amber-300" />
                      <span>{downloadingPdf ? 'Mengunduh...' : 'Cetak PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Ringkasan Target & Alat */}
                <div className="space-y-2 text-xs">
                  <div className="rounded-xl bg-purple-950/30 border border-purple-500/15 p-3">
                    <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      🎯 Target Pembelajaran Kurikulum Merdeka:
                    </span>
                    <p className="mt-0.5 font-body text-purple-100/90 leading-relaxed">
                      {generatedSheet.learningGoal}
                    </p>
                  </div>

                  <div className="rounded-xl bg-purple-950/30 border border-purple-500/15 p-3">
                    <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      🧺 Alat & Bahan di Rumah:
                    </span>
                    <ul className="mt-1 list-disc list-inside space-y-1 text-purple-200/85">
                      {generatedSheet.homeMaterials.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-purple-950/30 border border-purple-500/15 p-3">
                    <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      📝 Langkah Eksperimen Singkat:
                    </span>
                    <ol className="mt-1 space-y-1.5 text-purple-200/90">
                      {generatedSheet.steps.map((st, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                KOLOM 2 (5 KOLOM): ANALISIS PROGRESS & GAYA BELAJAR SISWA
               ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Header Kolom 2 dengan Tombol "Pantau Progress Siswa" */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#1c0f45] to-[#160c38] p-4 rounded-2xl border border-purple-500/30 shadow-md">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 mt-0.5">
                    <Icon icon="solar:chart-2-bold" className="h-5 w-5 text-cyan-300" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                      📊 Analisis Progress & Gaya Belajar Siswa
                    </h3>
                    <p className="font-body text-xs text-purple-200/80 leading-relaxed mt-0.5">
                      Pantau rerata kuis, poin bintang, pos orbit aktif, dan gaya belajar dominan (Visual 3D, Narasi, Praktik) seluruh siswa secara real-time.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGoToTeacherDashboard('students')}
                  className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-purple-600/80 hover:bg-purple-600 text-white font-semibold px-5 py-2.5 text-xs sm:text-sm border border-purple-400/30 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Icon icon="solar:users-group-rounded-bold" className="h-4 w-4 text-amber-300" />
                  <span>Pantau Progress Siswa</span>
                </button>
              </div>

              {/* Card Profil & Metrik Real-Time Kadet / Siswa */}
              <div className="rounded-2xl border border-purple-500/25 bg-[#120a2a]/80 p-5 shadow-lg space-y-4">
                
                {/* Selector Siswa Preview (Siti Rahmawati, Budi Pratama, Minton Cadence) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300/80">
                      Pilih Siswa (Sampel Kelas):
                    </span>
                    <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Data
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PREVIEW_STUDENTS.map((std, idx) => (
                      <button
                        key={std.id}
                        type="button"
                        onClick={() => setSelectedStudentIdx(idx)}
                        className={`rounded-xl p-2 text-left transition-all border cursor-pointer ${
                          selectedStudentIdx === idx
                            ? 'bg-purple-900/60 border-amber-400 text-white shadow-sm'
                            : 'bg-purple-950/40 border-purple-500/20 text-purple-300 hover:bg-purple-900/40'
                        }`}
                      >
                        <p className="text-xs font-bold truncate">{std.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-amber-300 font-extrabold">{std.accuracy}% Akurasi</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Switcher Tab Ringkasan / Tips */}
                <div className="flex rounded-xl bg-[#160c38] p-1 border border-purple-500/20">
                  <button
                    type="button"
                    onClick={() => setActiveTab('monitor')}
                    className={`flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'monitor'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-purple-300/70 hover:text-white'
                    }`}
                  >
                    📊 Rapor Siswa Terpilih
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tips')}
                    className={`flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'tips'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-purple-300/70 hover:text-white'
                    }`}
                  >
                    💡 Rekomendasi Adaptif AI
                  </button>
                </div>

                {activeTab === 'monitor' ? (
                  <div className="space-y-4">
                    {/* Header Profil Siswa Terpilih */}
                    <div className="flex items-center gap-3 rounded-xl bg-purple-950/40 border border-purple-500/20 p-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow-md border border-white/20">
                        {currentStudent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading text-sm font-bold text-white truncate">
                            {currentStudent.name}
                          </h4>
                          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="font-body text-xs text-purple-200/70 truncate">
                          {currentStudent.grade} • {currentStudent.status}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300">
                        Lv. {currentStudent.level}
                      </span>
                    </div>

                    {/* Statistik 4 Kotak */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl bg-purple-950/40 border border-purple-500/15 p-3">
                        <span className="text-[10px] font-bold uppercase text-purple-300/70">
                          Akurasi Kuis
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold text-white">{currentStudent.accuracy}%</span>
                          <span className="text-[10px] font-bold text-emerald-400">Tinggi ↗</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-purple-900/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                            style={{ width: `${currentStudent.accuracy}%` }}
                          />
                        </div>
                      </div>

                      <div className="rounded-xl bg-purple-950/40 border border-purple-500/15 p-3">
                        <span className="text-[10px] font-bold uppercase text-purple-300/70">
                          Pos Orbit Aktif
                        </span>
                        <div className="mt-1">
                          <span className="text-xs sm:text-sm font-extrabold text-white block truncate">
                            {currentStudent.currentStation.split('(')[0]}
                          </span>
                          <span className="text-[10px] font-medium text-amber-300 block truncate">
                            {currentStudent.currentStation.includes('(') ? currentStudent.currentStation.split('(')[1].replace(')', '') : 'Tata Surya'}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-purple-950/40 border border-purple-500/15 p-3">
                        <span className="text-[10px] font-bold uppercase text-purple-300/70">
                          Poin Bintang
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold text-amber-300">⭐ {currentStudent.stars}</span>
                        </div>
                        <span className="text-[10px] font-medium text-purple-200/70">
                          Koin Gamifikasi
                        </span>
                      </div>

                      <div className="rounded-xl bg-purple-950/40 border border-purple-500/15 p-3">
                        <span className="text-[10px] font-bold uppercase text-purple-300/70">
                          Gaya Belajar
                        </span>
                        <div className="mt-1">
                          <span className="text-xs sm:text-sm font-extrabold text-cyan-300 block truncate">
                            {currentStudent.dominantSensory}
                          </span>
                          <span className="text-[10px] font-medium text-purple-200/70">
                            Preferensi Utama
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Distribusi Gaya Belajar Multi-Sensori */}
                    <div className="rounded-xl bg-purple-950/30 border border-purple-500/15 p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-200">
                        <span>Distribusi Gaya Belajar ({currentStudent.name}):</span>
                        <span className="text-amber-300">{currentStudent.dominantSensory}</span>
                      </div>
                      <div className="space-y-1.5 text-[10px]">
                        <div>
                          <div className="flex justify-between text-purple-300/80 mb-0.5">
                            <span>Visual 3D & Simulator</span>
                            <span>{currentStudent.sensoryBreakdown.visual}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-purple-900/60 overflow-hidden">
                            <div className="h-full bg-cyan-400" style={{ width: `${currentStudent.sensoryBreakdown.visual}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-purple-300/80 mb-0.5">
                            <span>Praktik Eksperimen (Kinestetik)</span>
                            <span>{currentStudent.sensoryBreakdown.kinesthetic}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-purple-900/60 overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${currentStudent.sensoryBreakdown.kinesthetic}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-purple-300/80 mb-0.5">
                            <span>Narasi Audio & Penjelasan</span>
                            <span>{currentStudent.sensoryBreakdown.auditory}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-purple-900/60 overflow-hidden">
                            <div className="h-full bg-purple-400" style={{ width: `${currentStudent.sensoryBreakdown.auditory}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Tips & Catatan Adaptif AI Siswa */
                  <div className="space-y-3 text-xs leading-relaxed text-purple-100/90">
                    <div className="rounded-xl bg-purple-950/40 border border-purple-500/20 p-3.5 space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <Icon icon="solar:magic-stick-3-bold" className="h-4 w-4" />
                        <span>Catatan Adaptif AI untuk {currentStudent.name}:</span>
                      </div>
                      <p className="font-body text-purple-100/95 leading-relaxed">
                        "{currentStudent.aiNote}"
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 p-3">
                      <Icon icon="solar:star-fall-bold" className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-heading text-xs">Fokus Berbasis Multi-Sensori</strong>
                        Gunakan visualisasi 3D untuk konsep abstrak, perkuat dengan modul eksperimen praktikum di rumah.
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol Aksi Kolom 2 */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/50 py-2.5 px-3 text-xs font-bold text-white hover:border-amber-400 hover:bg-purple-900/60 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Icon icon="lucide:download" className="h-3.5 w-3.5 text-amber-300" />
                    <span>{downloadingPdf ? 'Menyiapkan...' : 'Unduh Laporan PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoToTeacherDashboard('students')}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-purple-600/80 hover:bg-purple-600 text-white font-semibold px-5 py-2.5 text-xs border border-purple-400/30 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <Icon icon="solar:users-group-rounded-bold" className="h-3.5 w-3.5 text-amber-300" />
                    <span>Pantau Progress Siswa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ==============================================================
              BANNER CTA KHUSUS GURU & ORANG TUA DI BAGIAN BAWAH
             ============================================================== */}
          <div className="relative z-10 mt-10 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-purple-950/80 via-[#180e38] to-[#120a2a] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 text-2xl shadow-inner">
                👨‍🏫
              </div>
              <div>
                <h4 className="font-heading text-sm sm:text-base font-bold text-white">
                  Ingin Akses Penuh Dashboard Guru & Seluruh Modul Sains SD?
                </h4>
                <p className="font-body text-xs text-purple-200/80">
                  Pantau perkembangan belajar seluruh kelas, buat lembar kerja tanpa batas, dan selaraskan dengan Kurikulum Merdeka.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleGoToTeacherDashboard('generator')}
                className="rounded-full bg-amber-400 hover:bg-amber-300 px-6 py-2.5 font-heading text-xs sm:text-sm font-extrabold text-slate-950 shadow-[0_6px_20px_rgba(250,204,21,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
              >
                <Icon icon="solar:magic-stick-3-bold" className="h-4 w-4" />
                <span>Buat Modul AI</span>
              </button>
              <button
                type="button"
                onClick={() => handleGoToTeacherDashboard('students')}
                className="rounded-full border border-purple-400/40 bg-purple-600/80 hover:bg-purple-600 px-5 py-2.5 font-heading text-xs sm:text-sm font-semibold text-white transition-all hover:scale-105 cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
              >
                <Icon icon="solar:users-group-rounded-bold" className="h-4 w-4 text-amber-300" />
                <span>Pantau Progress Siswa</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
