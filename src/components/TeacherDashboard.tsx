import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { UserSession, AppViewRoute } from '../types/navigation.ts';

// =========================================================================
// DATA TYPES: PURE QUIZ & CLASS MANAGEMENT (NO CURRICULUM WORDS)
// =========================================================================

export interface ClassGroup {
  id: string;
  name: string;
  grade: string;
  code: string;
  createdAt: string;
  studentCount: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizItem {
  id: string;
  title: string;
  topic: 'Tata Surya' | 'Siklus Air' | 'Gaya Magnet' | 'Wujud Benda & Panas' | string;
  targetGroupId: string;
  targetGroupName: string;
  questions: QuizQuestion[];
  status: 'Aktif' | 'Draft' | 'Selesai';
  publishedAt: string;
  participantsCount: number;
  averageScore: number;
}

export interface StudentQuizSubmission {
  id: string;
  studentName: string;
  groupId: string;
  groupName: string;
  grade: string;
  quizId: string;
  quizTitle: string;
  topic: string;
  status: 'Selesai' | 'Pending' | 'Mengerjakan';
  score: number | null;
  submittedAt: string;
  answersDetail: {
    questionText: string;
    studentOption: string;
    correctOption: string;
    isCorrect: boolean;
  }[];
}

// =========================================================================
// INITIAL MOCK DATA
// =========================================================================

const INITIAL_GROUPS: ClassGroup[] = [
  {
    id: 'grp-1',
    name: 'Kelas 5-A Sains',
    grade: 'Kelas 5 SD',
    code: 'SAINS-5A-882',
    createdAt: '2026-10-10',
    studentCount: 14,
  },
  {
    id: 'grp-2',
    name: 'Kelas 4-B Eksplorasi',
    grade: 'Kelas 4 SD',
    code: 'SAINS-4B-317',
    createdAt: '2026-10-12',
    studentCount: 12,
  },
  {
    id: 'grp-3',
    name: 'Kelas 5-B Petualang',
    grade: 'Kelas 5 SD',
    code: 'SAINS-5B-504',
    createdAt: '2026-10-14',
    studentCount: 2,
  },
];

const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'quiz-1',
    title: 'Kuis Evaluasi Tata Surya & Rotasi Planet',
    topic: 'Tata Surya',
    targetGroupId: 'grp-1',
    targetGroupName: 'Kelas 5-A Sains',
    status: 'Aktif',
    publishedAt: '2026-10-14',
    participantsCount: 12,
    averageScore: 91.5,
    questions: [
      {
        id: 1,
        question: 'Planet apakah yang memiliki cincin es terluas di Tata Surya?',
        options: ['Mars', 'Saturnus', 'Jupiter', 'Venus'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'Gaya tarik yang menjaga planet tetap berada pada orbitnya adalah?',
        options: ['Gaya Gesek', 'Gaya Magnet', 'Gaya Gravitasi Matahari', 'Gaya Pegas'],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Kuis Tantangan Siklus Air & Pembentukan Hujan',
    topic: 'Siklus Air',
    targetGroupId: 'grp-2',
    targetGroupName: 'Kelas 4-B Eksplorasi',
    status: 'Aktif',
    publishedAt: '2026-10-13',
    participantsCount: 10,
    averageScore: 84.0,
    questions: [
      {
        id: 1,
        question: 'Peristiwa penguapan air permukaan bumi oleh panas matahari disebut?',
        options: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Infiltrasi'],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: 'Perubahan uap air menjadi titik-titik air pembentuk awan adalah?',
        options: ['Membeku', 'Kondensasi', 'Menyublim', 'Menguap'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'Kuis Interaktif Gaya Magnet & Elektromagnet',
    topic: 'Gaya Magnet',
    targetGroupId: 'grp-1',
    targetGroupName: 'Kelas 5-A Sains',
    status: 'Aktif',
    publishedAt: '2026-10-11',
    participantsCount: 14,
    averageScore: 88.0,
    questions: [
      {
        id: 1,
        question: 'Kutub magnet yang senama jika didekatkan akan?',
        options: ['Tarik-menarik', 'Tolak-menolak', 'Diam saja', 'Menempel erat'],
        correctAnswer: 1,
      },
    ],
  },
];

const INITIAL_SUBMISSIONS: StudentQuizSubmission[] = [
  {
    id: 'sub-1',
    studentName: 'Minton Cadence',
    groupId: 'grp-1',
    groupName: 'Kelas 5-A Sains',
    grade: 'Kelas 5 SD',
    quizId: 'quiz-1',
    quizTitle: 'Kuis Evaluasi Tata Surya & Rotasi Planet',
    topic: 'Tata Surya',
    status: 'Selesai',
    score: 95,
    submittedAt: '10 Menit Lalu',
    answersDetail: [
      {
        questionText: 'Planet apakah yang memiliki cincin es terluas di Tata Surya?',
        studentOption: 'Saturnus',
        correctOption: 'Saturnus',
        isCorrect: true,
      },
      {
        questionText: 'Gaya tarik yang menjaga planet tetap berada pada orbitnya adalah?',
        studentOption: 'Gaya Gravitasi Matahari',
        correctOption: 'Gaya Gravitasi Matahari',
        isCorrect: true,
      },
    ],
  },
  {
    id: 'sub-2',
    studentName: 'Siti Rahmawati',
    groupId: 'grp-1',
    groupName: 'Kelas 5-A Sains',
    grade: 'Kelas 5 SD',
    quizId: 'quiz-1',
    quizTitle: 'Kuis Evaluasi Tata Surya & Rotasi Planet',
    topic: 'Tata Surya',
    status: 'Selesai',
    score: 90,
    submittedAt: '25 Menit Lalu',
    answersDetail: [
      {
        questionText: 'Planet apakah yang memiliki cincin es terluas di Tata Surya?',
        studentOption: 'Saturnus',
        correctOption: 'Saturnus',
        isCorrect: true,
      },
      {
        questionText: 'Gaya tarik yang menjaga planet tetap berada pada orbitnya adalah?',
        studentOption: 'Gaya Gravitasi Matahari',
        correctOption: 'Gaya Gravitasi Matahari',
        isCorrect: true,
      },
    ],
  },
  {
    id: 'sub-3',
    studentName: 'Budi Pratama',
    groupId: 'grp-2',
    groupName: 'Kelas 4-B Eksplorasi',
    grade: 'Kelas 4 SD',
    quizId: 'quiz-2',
    quizTitle: 'Kuis Tantangan Siklus Air & Pembentukan Hujan',
    topic: 'Siklus Air',
    status: 'Mengerjakan',
    score: null,
    submittedAt: 'Sedang Berlangsung',
    answersDetail: [],
  },
  {
    id: 'sub-4',
    studentName: 'Aisyah Putri',
    groupId: 'grp-2',
    groupName: 'Kelas 4-B Eksplorasi',
    grade: 'Kelas 4 SD',
    quizId: 'quiz-2',
    quizTitle: 'Kuis Tantangan Siklus Air & Pembentukan Hujan',
    topic: 'Siklus Air',
    status: 'Selesai',
    score: 85,
    submittedAt: '1 Jam Lalu',
    answersDetail: [
      {
        questionText: 'Peristiwa penguapan air permukaan bumi oleh panas matahari disebut?',
        studentOption: 'Evaporasi',
        correctOption: 'Evaporasi',
        isCorrect: true,
      },
      {
        questionText: 'Perubahan uap air menjadi titik-titik air pembentuk awan adalah?',
        studentOption: 'Kondensasi',
        correctOption: 'Kondensasi',
        isCorrect: true,
      },
    ],
  },
  {
    id: 'sub-5',
    studentName: 'Rian Firmansyah',
    groupId: 'grp-1',
    groupName: 'Kelas 5-A Sains',
    grade: 'Kelas 5 SD',
    quizId: 'quiz-1',
    quizTitle: 'Kuis Evaluasi Tata Surya & Rotasi Planet',
    topic: 'Tata Surya',
    status: 'Pending',
    score: null,
    submittedAt: 'Belum Dikerjakan',
    answersDetail: [],
  },
  {
    id: 'sub-6',
    studentName: 'Farhan Maulana',
    groupId: 'grp-2',
    groupName: 'Kelas 4-B Eksplorasi',
    grade: 'Kelas 4 SD',
    quizId: 'quiz-2',
    quizTitle: 'Kuis Tantangan Siklus Air & Pembentukan Hujan',
    topic: 'Siklus Air',
    status: 'Selesai',
    score: 80,
    submittedAt: '2 Jam Lalu',
    answersDetail: [
      {
        questionText: 'Peristiwa penguapan air permukaan bumi oleh panas matahari disebut?',
        studentOption: 'Evaporasi',
        correctOption: 'Evaporasi',
        isCorrect: true,
      },
      {
        questionText: 'Perubahan uap air menjadi titik-titik air pembentuk awan adalah?',
        studentOption: 'Membeku',
        correctOption: 'Kondensasi',
        isCorrect: false,
      },
    ],
  },
];

interface TeacherDashboardProps {
  user: UserSession;
  onNavigate: (route: AppViewRoute) => void;
  onNotify?: (msg: string) => void;
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onNavigate,
  onNotify,
  initialTab = 'monitoring',
  onTabChange,
}) => {
  // Normalize tab value
  const normalizeTab = (tab?: string): 'monitoring' | 'quizzes' | 'groups' => {
    if (tab === 'quizzes' || tab === 'generator') return 'quizzes';
    if (tab === 'groups' || tab === 'classes') return 'groups';
    return 'monitoring';
  };

  const [activeTab, setActiveTab] = useState<'monitoring' | 'quizzes' | 'groups'>(
    normalizeTab(initialTab)
  );

  const handleSelectTab = (tab: 'monitoring' | 'quizzes' | 'groups') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  // === DATA STATES ===
  const [groups, setGroups] = useState<ClassGroup[]>(INITIAL_GROUPS);
  const [quizzes, setQuizzes] = useState<QuizItem[]>(INITIAL_QUIZZES);
  const [submissions, setSubmissions] = useState<StudentQuizSubmission[]>(INITIAL_SUBMISSIONS);

  // === FILTER STATES ===
  const [searchStudent, setSearchStudent] = useState('');
  const [filterGroup, setFilterGroup] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // === MODAL STATES ===
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupGrade, setNewGroupGrade] = useState('Kelas 5 SD');

  // === STATE MODAL AI QUIZ GENERATOR (2-STEP FLOW) ===
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [quizModalStep, setQuizModalStep] = useState<1 | 2>(1);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Step 1: Input Materi & Prompt AI
  const [newQuizTitle, setNewQuizTitle] = useState('Kuis Sains: Tata Surya & Gravitasi Planet');
  const [newQuizTopic, setNewQuizTopic] = useState<'Tata Surya' | 'Siklus Air' | 'Gaya Magnet' | 'Wujud Benda & Panas'>('Tata Surya');
  const [newQuizTargetGroup, setNewQuizTargetGroup] = useState('grp-1');
  const [materialInputMode, setMaterialInputMode] = useState<'text' | 'file'>('text');
  const [materialText, setMaterialText] = useState(
    'Matahari merupakan pusat Tata Surya yang dikelilingi oleh 8 planet: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus. Gaya gravitasi Matahari menjaga planet-planet tetap berputar pada orbitnya. Planet Saturnus memiliki cincin es terluas, sedangkan Jupiter adalah planet terbesar.'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questionCountChoice, setQuestionCountChoice] = useState<number>(3);

  // Step 2: Preview & Edit Hasil AI
  const [quizQuestionsList, setQuizQuestionsList] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: 'Planet apakah yang memiliki cincin es terluas di Tata Surya?',
      options: ['Mars', 'Saturnus', 'Jupiter', 'Venus'],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Gaya tarik yang menjaga planet tetap beredar pada orbitnya mengelilingi Matahari adalah?',
      options: ['Gaya Gesek Udara', 'Gaya Magnet Bumi', 'Gaya Gravitasi Matahari', 'Gaya Pegas'],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: 'Planet manakah yang merupakan planet terbesar dalam sistem Tata Surya kita?',
      options: ['Jupiter', 'Neptunus', 'Bumi', 'Uranus'],
      correctAnswer: 0,
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<StudentQuizSubmission | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Bank Soal AI Mock per Topik
  const AI_SAMPLE_QUESTIONS: Record<string, QuizQuestion[]> = {
    'Tata Surya': [
      {
        id: 101,
        question: 'Planet apakah yang memiliki cincin es terluas di Tata Surya?',
        options: ['Mars', 'Saturnus', 'Jupiter', 'Venus'],
        correctAnswer: 1,
      },
      {
        id: 102,
        question: 'Gaya tarik yang menjaga planet tetap beredar pada orbitnya mengelilingi Matahari adalah?',
        options: ['Gaya Gesek Udara', 'Gaya Magnet Bumi', 'Gaya Gravitasi Matahari', 'Gaya Pegas'],
        correctAnswer: 2,
      },
      {
        id: 103,
        question: 'Planet terdekat dari Matahari yang memiliki suhu permukaan sangat panas di siang hari adalah?',
        options: ['Merkurius', 'Venus', 'Bumi', 'Mars'],
        correctAnswer: 0,
      },
      {
        id: 104,
        question: 'Planet terbesar dalam tata surya yang memiliki satelit alami bernama Ganymede adalah?',
        options: ['Uranus', 'Bumi', 'Jupiter', 'Saturnus'],
        correctAnswer: 2,
      },
      {
        id: 105,
        question: 'Berapakah jumlah planet utama yang mengorbit Matahari di tata surya kita?',
        options: ['7 Planet', '8 Planet', '9 Planet', '10 Planet'],
        correctAnswer: 1,
      },
    ],
    'Siklus Air': [
      {
        id: 201,
        question: 'Peristiwa penguapan air di permukaan bumi oleh energi panas matahari disebut?',
        options: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Infiltrasi'],
        correctAnswer: 0,
      },
      {
        id: 202,
        question: 'Perubahan uap air di atmosfer menjadi butiran titik-titik air pembentuk awan adalah?',
        options: ['Membeku', 'Kondensasi (Pengembunan)', 'Menyublim', 'Transpirasi'],
        correctAnswer: 1,
      },
      {
        id: 203,
        question: 'Turunnya titik-titik air dari awan di atmosfer ke permukaan bumi disebut peristiwa?',
        options: ['Evaporasi', 'Kondensasi', 'Presipitasi (Hujan)', 'Transpirasi'],
        correctAnswer: 2,
      },
      {
        id: 204,
        question: 'Penguapan air yang dilepaskan melalui pori-pori stomata daun tumbuhan hijau disebut?',
        options: ['Transpirasi', 'Infiltrasi', 'Presipitasi', 'Sublimasi'],
        correctAnswer: 0,
      },
    ],
    'Gaya Magnet': [
      {
        id: 301,
        question: 'Kutub magnet yang senama (misal Utara dengan Utara) jika didekatkan akan?',
        options: ['Tarik-menarik', 'Tolak-menolak', 'Saling menempel kuat', 'Diam tidak bereaksi'],
        correctAnswer: 1,
      },
      {
        id: 302,
        question: 'Benda di bawah ini yang dapat ditarik dengan sangat kuat oleh magnet adalah?',
        options: ['Klip kertas dari besi', 'Penghapus karet', 'Penggaris mika plastik', 'Kertas HVS'],
        correctAnswer: 0,
      },
      {
        id: 303,
        question: 'Daerah di sekitar magnet yang masih dipengaruhi oleh gaya tarikan magnet disebut?',
        options: ['Kutub Magnet', 'Medan Magnet', 'Garis Magnet', 'Sudut Deklinasi'],
        correctAnswer: 1,
      },
    ],
    'Wujud Benda & Panas': [
      {
        id: 401,
        question: 'Perubahan wujud benda dari zat padat menjadi zat cair akibat pemanasan disebut?',
        options: ['Mencair / Melebur', 'Membeku', 'Menguap', 'Mengembun'],
        correctAnswer: 0,
      },
      {
        id: 402,
        question: 'Perpindahan energi panas melalui zat perantara tanpa disertai perpindahan partikel zatnya adalah?',
        options: ['Konduksi', 'Konveksi', 'Radiasi', 'Evaporasi'],
        correctAnswer: 0,
      },
      {
        id: 403,
        question: 'Panas dari pancaran sinar matahari yang sampai ke permukaan bumi berpindah secara?',
        options: ['Konduksi', 'Radiasi', 'Konveksi', 'Sublimasi'],
        correctAnswer: 1,
      },
    ],
  };

  // === HANDLERS ===

  // 1. Buat Grup Kelas dengan Kode Unik otomatis (e.g. SAINS-5A-882)
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    // Generate kode unik e.g. SAINS-5A-882
    const cleanLetters = newGroupName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const initials = cleanLetters.length >= 2 ? cleanLetters.substring(0, 3) : 'SAINS';
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `SAINS-${initials}-${randomNum}`;

    const newGroup: ClassGroup = {
      id: `grp-${Date.now()}`,
      name: newGroupName.trim(),
      grade: newGroupGrade,
      code,
      createdAt: new Date().toISOString().split('T')[0],
      studentCount: 0,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setNewGroupName('');
    setShowCreateGroupModal(false);
    onNotify?.(`🏫 Grup "${newGroup.name}" berhasil dibuat! Kode: ${code}`);
  };

  // Salin Kode Grup
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onNotify?.(`📋 Kode "${code}" berhasil disalin! Bagikan ke siswa.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 2. AI Quiz Generator: Generate Kuis dari Materi via Express Backend (Step 1 -> Step 2)
  const handleGenerateQuizAI = async () => {
    if (!newQuizTitle.trim()) {
      alert('Harap masukkan judul kuis!');
      return;
    }
    if (materialInputMode === 'text' && !materialText.trim()) {
      alert('Harap masukkan teks materi atau prompt sains!');
      return;
    }
    if (materialInputMode === 'file' && !uploadedFileName) {
      alert('Harap unggah file materi atau gunakan mode teks!');
      return;
    }

    setIsGeneratingQuiz(true);

    try {
      let response: Response;

      if (materialInputMode === 'file' && uploadedFile) {
        // Mode File: Kirim Multipart Form-Data (PDF)
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('topic', newQuizTopic);
        formData.append('targetGroup', newQuizTargetGroup);
        response = await fetch('http://localhost:5001/api/generate-quiz', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Mode Teks: Kirim JSON payload
        response = await fetch('http://localhost:5001/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            materiText: materialText,
            topic: newQuizTopic,
            targetGroup: newQuizTargetGroup,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const rawData = await response.json();
      const questionsArray = Array.isArray(rawData) ? rawData : (rawData.questions || []);

      if (questionsArray && questionsArray.length > 0) {
        const formatted: QuizQuestion[] = questionsArray.map((q: any, idx: number) => {
          const rawOpts = Array.isArray(q.options) && q.options.length >= 2
            ? q.options
            : ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'];

          // Pastikan minimal ada 4 pilihan
          while (rawOpts.length < 4) {
            rawOpts.push(`Pilihan ${['A', 'B', 'C', 'D'][rawOpts.length]}`);
          }

          let ansIdx = 0;
          if (typeof q.answer === 'number' && q.answer >= 0 && q.answer < rawOpts.length) {
            ansIdx = q.answer;
          } else if (typeof q.answer === 'string') {
            const cleanAns = q.answer.trim().toLowerCase();
            const found = rawOpts.findIndex((opt: string) => opt.trim().toLowerCase() === cleanAns);
            if (found !== -1) {
              ansIdx = found;
            } else {
              const letter = cleanAns.toUpperCase();
              if (letter === 'A') ansIdx = 0;
              else if (letter === 'B') ansIdx = 1;
              else if (letter === 'C') ansIdx = 2;
              else if (letter === 'D') ansIdx = 3;
            }
          }

          return {
            id: Date.now() + idx,
            question: q.question || `Pertanyaan Sains #${idx + 1}`,
            options: rawOpts,
            correctAnswer: ansIdx,
          };
        });

        setQuizQuestionsList(formatted);
        setQuizModalStep(2);
        onNotify?.(`✨ AI berhasil menyusun ${formatted.length} butir soal dari materi! Silakan tinjau dan edit.`);
      } else {
        throw new Error('Format data kuis tidak valid');
      }
    } catch (error) {
      console.warn('⚠️ Gagal terhubung ke backend Express.js, beralih ke bank soal lokal:', error);
      const bank = AI_SAMPLE_QUESTIONS[newQuizTopic] || AI_SAMPLE_QUESTIONS['Tata Surya'];
      const generated = bank.slice(0, questionCountChoice).map((q, idx) => ({
        ...q,
        id: Date.now() + idx,
        options: [...q.options],
      }));
      setQuizQuestionsList(generated);
      setQuizModalStep(2);
      onNotify?.(`✨ Mode Cerdas Cepat: ${generated.length} soal kuis berhasil disiapkan!`);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // 3. Edit Question Text di Step 2
  const handleUpdateQuestionText = (index: number, text: string) => {
    setQuizQuestionsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], question: text };
      return updated;
    });
  };

  // 4. Edit Option Text di Step 2
  const handleUpdateOptionText = (qIndex: number, optIndex: number, text: string) => {
    setQuizQuestionsList((prev) => {
      const updated = [...prev];
      const newOpts = [...updated[qIndex].options];
      newOpts[optIndex] = text;
      updated[qIndex] = { ...updated[qIndex], options: newOpts };
      return updated;
    });
  };

  // 5. Ganti Kunci Jawaban di Step 2
  const handleSetCorrectAnswer = (qIndex: number, optIndex: number) => {
    setQuizQuestionsList((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], correctAnswer: optIndex };
      return updated;
    });
  };

  // 6. Hapus Soal di Step 2
  const handleDeleteQuestion = (index: number) => {
    if (quizQuestionsList.length <= 1) {
      alert('Kuis harus memiliki minimal 1 pertanyaan!');
      return;
    }
    setQuizQuestionsList((prev) => prev.filter((_, i) => i !== index));
  };

  // 7. Tambah Soal Manual di Step 2
  const handleAddNewQuestionManual = () => {
    const newQ: QuizQuestion = {
      id: Date.now(),
      question: 'Tuliskan pertanyaan baru di sini...',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      correctAnswer: 0,
    };
    setQuizQuestionsList((prev) => [...prev, newQ]);
  };

  // 8. Publikasikan Kuis Baru ke Grup (Final Step)
  const handlePublishQuiz = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newQuizTitle.trim()) {
      alert('Judul kuis tidak boleh kosong!');
      return;
    }
    if (quizQuestionsList.length === 0) {
      alert('Kuis harus memiliki minimal 1 pertanyaan!');
      return;
    }

    // Validasi kelengkapan teks soal & opsi
    for (let i = 0; i < quizQuestionsList.length; i++) {
      if (!quizQuestionsList[i].question.trim()) {
        alert(`Pertanyaan nomor ${i + 1} masih kosong!`);
        return;
      }
      if (quizQuestionsList[i].options.some((opt) => !opt.trim())) {
        alert(`Semua opsi jawaban pada soal nomor ${i + 1} harus diisi!`);
        return;
      }
    }

    const targetG = groups.find((g) => g.id === newQuizTargetGroup) || groups[0];

    const newQuiz: QuizItem = {
      id: `quiz-${Date.now()}`,
      title: newQuizTitle.trim(),
      topic: newQuizTopic,
      targetGroupId: targetG.id,
      targetGroupName: targetG.name,
      questions: quizQuestionsList,
      status: 'Aktif',
      publishedAt: new Date().toISOString().split('T')[0],
      participantsCount: 0,
      averageScore: 0,
    };

    setQuizzes((prev) => [newQuiz, ...prev]);

    // Masukkan submission pending untuk siswa grup tersebut
    const newPendingSubmissions: StudentQuizSubmission[] = [
      {
        id: `sub-${Date.now()}-1`,
        studentName: 'Minton Cadence',
        groupId: targetG.id,
        groupName: targetG.name,
        grade: targetG.grade,
        quizId: newQuiz.id,
        quizTitle: newQuiz.title,
        topic: newQuiz.topic,
        status: 'Pending',
        score: null,
        submittedAt: 'Baru Diterbitkan',
        answersDetail: [],
      },
    ];

    setSubmissions((prev) => [...newPendingSubmissions, ...prev]);

    setShowCreateQuizModal(false);
    setNewQuizTitle('');
    setQuizQuestionsList([]);
    onNotify?.(`✨ Kuis "${newQuiz.title}" berhasil dipublikasikan ke ${targetG.name}!`);
    handleSelectTab('quizzes');
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchName = sub.studentName.toLowerCase().includes(searchStudent.toLowerCase());
    const matchGroup = filterGroup === 'Semua' || sub.groupId === filterGroup;
    const matchStatus = filterStatus === 'Semua' || sub.status === filterStatus;
    return matchName && matchGroup && matchStatus;
  });

  const displayName = user?.name || localStorage.getItem('userName') || 'Bapak/Ibu Guru';

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 lg:ml-64 flex flex-col font-sans antialiased">
      {/* ================================================================
          1. WHITE TOPBAR (EDUADMIN STYLE)
         ================================================================ */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-900 text-amber-400 font-black text-lg shadow-sm">
            ⭐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-base sm:text-lg font-black text-slate-900 leading-tight">
                EduAdmin Bintang Edu
              </h1>
              <span className="rounded-md bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                Portal Guru
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Manajemen Kelas & Kuis Sains SD
            </p>
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-3">
          {/* Tombol Emas Buat Kuis Baru */}
          <button
            type="button"
            onClick={() => {
              setQuizModalStep(1);
              setShowCreateQuizModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 text-xs sm:text-sm font-black shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Icon icon="solar:document-add-bold" className="h-4 w-4" />
            <span>✨ Buat Kuis Baru</span>
          </button>

          {/* Tombol Buat Grup */}
          <button
            type="button"
            onClick={() => setShowCreateGroupModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Icon icon="solar:users-group-two-rounded-bold" className="h-4 w-4" />
            <span>+ Buat Grup</span>
          </button>

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 text-white text-xs font-black shadow-xs">
              GR
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="text-left text-xs">
              <p className="font-black text-slate-900 leading-none">{displayName}</p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">Guru Sains SD</p>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================
          MAIN CONTAINER: PADDING & SPACING
         ================================================================ */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto w-full">
        {/* 4 SUMMARY METRIC CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Ringkasan Metrik">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Siswa Bergabung
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">28</span>
              <span className="text-xs font-bold text-emerald-600">Aktif</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Grup Kelas Aktif
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-purple-700">{groups.length}</span>
              <span className="text-xs font-bold text-slate-500">Grup</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Kuis Dipublikasikan
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-600">{quizzes.length}</span>
              <span className="text-xs font-bold text-amber-500">Kuis Aktif</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Rerata Nilai Kuis
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-500">88.5</span>
              <span className="text-xs font-bold text-emerald-600">/ 100</span>
            </div>
          </div>
        </section>

        {/* ================================================================
            NAVIGATION TABS (PURE QUIZ & CLASS MANAGEMENT)
           ================================================================ */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { key: 'monitoring' as const, label: '📊 Monitoring Siswa & Nilai', count: submissions.length },
            { key: 'quizzes' as const, label: '✨ Buat & Kelola Kuis', count: quizzes.length },
            { key: 'groups' as const, label: '🏫 Grup Kelas & Kode', count: groups.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSelectTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === tab.key ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ================================================================
            TAB 1: MONITORING SISWA & NILAI (REAL-TIME STATUS & SCORE)
           ================================================================ */}
        {activeTab === 'monitoring' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Icon icon="lucide:search" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama siswa..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="text-slate-500">Grup:</span>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold bg-white focus:border-purple-600 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua Grup</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>

                <span className="text-slate-500 ml-2">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold bg-white focus:border-purple-600 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Mengerjakan">Mengerjakan</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Monitoring Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Nama Siswa</th>
                      <th className="px-5 py-3.5">Grup Kelas</th>
                      <th className="px-5 py-3.5">Kuis Ditugaskan</th>
                      <th className="px-5 py-3.5">Status Kuis</th>
                      <th className="px-5 py-3.5">Skor Real-Time</th>
                      <th className="px-5 py-3.5">Waktu Submit</th>
                      <th className="px-5 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs">
                                {sub.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                              </div>
                              <div>
                                <span className="block font-black">{sub.studentName}</span>
                                <span className="text-[11px] text-slate-400 font-medium">{sub.grade}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-slate-700">
                            <span className="rounded-md bg-purple-50 text-purple-800 px-2.5 py-1 text-xs font-bold border border-purple-200">
                              {sub.groupName}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-800">
                            <span className="line-clamp-1">{sub.quizTitle}</span>
                            <span className="text-[11px] text-indigo-600 block">{sub.topic}</span>
                          </td>
                          <td className="px-5 py-3.5 font-bold">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                                sub.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.status === 'Mengerjakan'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            {sub.score !== null ? (
                              <span className="font-heading font-black text-base text-slate-900">
                                {sub.score} <span className="text-xs font-bold text-slate-400">/ 100</span>
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">
                            {sub.submittedAt}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {sub.answersDetail.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setSelectedSubmission(sub)}
                                className="font-bold text-xs text-purple-700 hover:text-purple-900 underline cursor-pointer"
                              >
                                Lihat Jawaban →
                              </button>
                            ) : (
                              <span className="text-xs text-slate-300">Belum Ada</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-xs">
                          Tidak ada data siswa atau kuis yang cocok dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 2: BUAT & KELOLA KUIS (QUIZ MANAGEMENT)
           ================================================================ */}
        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-heading text-base font-black text-slate-900">
                  Daftar Kuis Sains Aktif
                </h3>
                <p className="text-xs text-slate-500">Kelola soal dan publikasikan kuis baru ke grup kelas</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuizModalStep(1);
                  setShowCreateQuizModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 text-xs sm:text-sm font-black shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <Icon icon="solar:document-add-bold" className="h-4 w-4" />
                <span>✨ Buat Kuis Baru</span>
              </button>
            </div>

            {/* Grid Kartu Kuis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 text-xs font-black">
                        {quiz.topic}
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold">
                        {quiz.status}
                      </span>
                    </div>

                    <h4 className="font-heading text-sm font-black text-slate-900 leading-snug">
                      {quiz.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Target Grup:</span>
                        <span className="font-black text-purple-700">{quiz.targetGroupName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Jumlah Soal:</span>
                        <span className="font-black text-slate-800">{quiz.questions.length} Pertanyaan</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Rerata Nilai:</span>
                        <span className="font-black text-amber-500">{quiz.averageScore} / 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-medium">Rilis: {quiz.publishedAt}</span>
                    <button
                      type="button"
                      onClick={() => onNotify?.(`📋 Membuka lembar soal: ${quiz.title}`)}
                      className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Detail Soal →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 3: GRUP KELAS & KODE (CLASS MANAGEMENT)
           ================================================================ */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-heading text-base font-black text-slate-900">
                  Daftar Grup Kelas
                </h3>
                <p className="text-xs text-slate-500">
                  Bagikan kode grup unik kepada siswa untuk bergabung ke kelas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateGroupModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <Icon icon="solar:users-group-two-rounded-bold" className="h-4 w-4" />
                <span>+ Buat Grup</span>
              </button>
            </div>

            {/* Grid Kartu Grup */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-lg text-white shadow-sm font-black">
                        🏫
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-black text-slate-900">{group.name}</h4>
                        <p className="text-xs font-bold text-slate-500">{group.grade}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-black">
                      {group.studentCount} Siswa
                    </span>
                  </div>

                  {/* Kode Grup Unik */}
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Kode Gabung Siswa
                      </span>
                      <span className="font-mono text-base font-black text-purple-800 tracking-wider">
                        {group.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(group.code)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        copiedCode === group.code
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      <Icon
                        icon={copiedCode === group.code ? 'lucide:check' : 'lucide:copy'}
                        className="h-3.5 w-3.5"
                      />
                      <span>{copiedCode === group.code ? 'Tersalin!' : 'Salin Kode'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium">
                    Dibuat pada: {group.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================================================================
          MODAL 1: BUAT GRUP KELAS
         ================================================================ */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <button
              type="button"
              onClick={() => setShowCreateGroupModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 text-xl font-black">
                🏫
              </div>
              <div>
                <h3 className="font-heading text-base font-black text-slate-900">Buat Grup Kelas Baru</h3>
                <p className="text-xs text-slate-500">Kode unik akan dibuat otomatis untuk siswa join</p>
              </div>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Grup / Kelas</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder='Contoh: "Kelas 5-A Sains"'
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:border-purple-600 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tingkat Kelas</label>
                <select
                  value={newGroupGrade}
                  onChange={(e) => setNewGroupGrade(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-purple-600 focus:outline-none cursor-pointer"
                >
                  <option value="Kelas 1 SD">Kelas 1 SD</option>
                  <option value="Kelas 2 SD">Kelas 2 SD</option>
                  <option value="Kelas 3 SD">Kelas 3 SD</option>
                  <option value="Kelas 4 SD">Kelas 4 SD</option>
                  <option value="Kelas 5 SD">Kelas 5 SD</option>
                  <option value="Kelas 6 SD">Kelas 6 SD</option>
                </select>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-xs text-purple-900 font-medium border border-purple-100">
                💡 Kode unik e.g. <strong className="font-mono">SAINS-5A-882</strong> akan digenerate otomatis setelah grup dibuat.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim()}
                  className="flex-1 rounded-xl bg-purple-700 hover:bg-purple-800 text-white py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  Buat Grup Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL 2: AI-POWERED QUIZ GENERATOR (2-STEP FLOW)
         ================================================================ */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl lg:max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Modal Top Header */}
            <div className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-6">
              <button
                type="button"
                onClick={() => setShowCreateQuizModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 text-2xl font-black shadow-md">
                  ✨
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-black text-white leading-tight">
                    AI-Powered Quiz Generator
                  </h3>
                  <p className="text-xs text-purple-200/80 font-medium">
                    Generator kuis instan berbasis AI dari materi sains (2 Langkah: Input Materi ➔ Preview & Edit)
                  </p>
                </div>
              </div>
            </div>

            {/* Step Indicator Navigation Bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-bold">
              <button
                type="button"
                onClick={() => setQuizModalStep(1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  quizModalStep === 1
                    ? 'bg-purple-900 text-white shadow-xs font-black'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer font-extrabold'
                }`}
              >
                <span>{quizModalStep === 2 ? '✅' : '1'}</span>
                <span>Langkah 1: Input Materi & Prompt AI</span>
              </button>
              <Icon icon="solar:arrow-right-linear" className="text-slate-400 text-sm" />
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  quizModalStep === 2
                    ? 'bg-purple-900 text-white shadow-xs font-black'
                    : 'bg-slate-200/70 text-slate-500 font-bold'
                }`}
              >
                <span>2</span>
                <span>Langkah 2: Preview & Edit Hasil AI</span>
              </div>
            </div>

            {/* ==============================================================
                LANGKAH 1: INPUT MATERI & PROMPT AI
               ============================================================== */}
            {quizModalStep === 1 && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {/* Field Judul Kuis */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Judul Kuis</label>
                  <input
                    type="text"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder='Contoh: "Kuis Sains: Tata Surya & Gravitasi Planet"'
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:border-purple-600 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Grid 2-Kolom: Topik Sains & Target Grup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">Topik Sains</label>
                    <select
                      value={newQuizTopic}
                      onChange={(e) => setNewQuizTopic(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-purple-600 focus:outline-none cursor-pointer bg-white"
                    >
                      <option value="Tata Surya">Tata Surya</option>
                      <option value="Siklus Air">Siklus Air</option>
                      <option value="Gaya Magnet">Gaya Magnet</option>
                      <option value="Wujud Benda & Panas">Wujud Benda & Panas</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">Target Grup Kelas</label>
                    <select
                      value={newQuizTargetGroup}
                      onChange={(e) => setNewQuizTargetGroup(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-purple-600 focus:outline-none cursor-pointer bg-white"
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({g.grade}) - Kode: {g.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pilihan Sumber Materi (Textarea ATAU Upload File) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-700">Sumber Materi Kuis untuk AI</label>
                    {/* Toggle Mode */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setMaterialInputMode('text')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                          materialInputMode === 'text'
                            ? 'bg-white text-purple-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        📝 Teks Ringkasan
                      </button>
                      <button
                        type="button"
                        onClick={() => setMaterialInputMode('file')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                          materialInputMode === 'file'
                            ? 'bg-white text-purple-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        📁 Upload File
                      </button>
                    </div>
                  </div>

                  {materialInputMode === 'text' ? (
                    <div className="space-y-2">
                      <textarea
                        rows={4}
                        value={materialText}
                        onChange={(e) => setMaterialText(e.target.value)}
                        placeholder="Ketik atau tempel ringkasan materi IPA di sini. AI akan menganalisis fakta-fakta penting untuk membuat soal pilihan ganda..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium focus:border-purple-600 focus:outline-none resize-none leading-relaxed"
                      />
                      {/* Presets Cepat */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="font-bold text-slate-400">Pilihan Cepat:</span>
                        {[
                          { label: '🪐 Tata Surya', topic: 'Tata Surya' as const, text: 'Matahari adalah pusat Tata Surya yang dikelilingi oleh 8 planet. Planet Saturnus memiliki cincin es terluas. Jupiter merupakan planet terbesar dengan gravitasi yang sangat kuat.' },
                          { label: '🌧️ Siklus Air', topic: 'Siklus Air' as const, text: 'Air di bumi menguap karena panas matahari (evaporasi). Uap air membubung ke atmosfer lalu mengembun menjadi awan (kondensasi), kemudian jatuh kembali ke bumi sebagai hujan (presipitasi).' },
                          { label: '🧲 Gaya Magnet', topic: 'Gaya Magnet' as const, text: 'Magnet memiliki dua kutub: Utara dan Selatan. Kutub yang senama akan tolak-menolak, sedangkan kutub berbeda nama tarik-menarik. Magnet dapat menarik benda berbahan besi.' },
                          { label: '🔥 Wujud Benda', topic: 'Wujud Benda & Panas' as const, text: 'Wujud zat terdiri dari padat, cair, dan gas. Perubahan padat menjadi cair disebut mencair karena kalor. Perpindahan panas sinar matahari sampai ke bumi melalui radiasi.' },
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setNewQuizTopic(preset.topic);
                              setMaterialText(preset.text);
                              setNewQuizTitle(`Kuis Sains: ${preset.topic}`);
                            }}
                            className="rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-0.5 font-bold border border-purple-200 transition-colors cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
                      {uploadedFileName ? (
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200 shadow-xs max-w-md mx-auto">
                          <div className="flex items-center gap-2.5 text-left">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                              📄
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{uploadedFileName}</p>
                              <p className="text-[10px] text-emerald-600 font-bold">Siap dianalisis oleh AI · 245 KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFile(null);
                              setUploadedFileName(null);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <Icon icon="lucide:x" className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block space-y-2">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadedFile(file);
                                setUploadedFileName(file.name);
                                onNotify?.(`📁 File "${file.name}" berhasil diunggah!`);
                              }
                            }}
                          />
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 mx-auto text-xl font-bold">
                            📂
                          </div>
                          <p className="text-xs font-bold text-slate-800">
                            Klik untuk memilih file materi sains
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Mendukung file dokumen PDF, Word (.docx), atau Teks (.txt) maks 10MB
                          </p>
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {/* Target Jumlah Soal */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-black text-slate-700">Target Jumlah Soal AI</label>
                  <div className="flex items-center gap-2">
                    {[3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCountChoice(cnt)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          questionCountChoice === cnt
                            ? 'bg-purple-900 text-white shadow-xs font-black'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {cnt} Soal Pilihan Ganda
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 1 Footer Action */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateQuizModal(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isGeneratingQuiz}
                    onClick={handleGenerateQuizAI}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin text-slate-950" />
                        <span>AI sedang menyusun soal...</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="solar:magic-stick-3-bold" className="h-4 w-4" />
                        <span>✨ Generate Kuis dengan AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                LANGKAH 2: PREVIEW & EDIT HASIL AI (SEBELUM PUBLISH)
               ============================================================== */}
            {quizModalStep === 2 && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {/* Banner Info Hasil AI */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 p-3.5 rounded-2xl border border-purple-200 text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-black text-purple-900">
                      <Icon icon="solar:sparkles-bold" className="h-4 w-4 text-amber-500" />
                      <span>{quizQuestionsList.length} Soal AI Siap Ditinjau & Diedit</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Kuis: <strong className="text-slate-900">{newQuizTitle}</strong> · Topik: {newQuizTopic}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewQuestionManual}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-purple-100 text-purple-800 px-3 py-1.5 text-xs font-black border border-purple-300 shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Icon icon="solar:add-circle-bold" className="h-4 w-4 text-purple-700" />
                    <span>+ Tambah Soal Manual</span>
                  </button>
                </div>

                {/* Daftar Soal Hasil AI yang Bisa Diedit */}
                <div className="space-y-4">
                  {quizQuestionsList.map((qItem, qIdx) => (
                    <div
                      key={qItem.id || qIdx}
                      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3.5"
                    >
                      {/* Header Soal */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-900 text-white font-black text-xs">
                            {qIdx + 1}
                          </span>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                            Pertanyaan #{qIdx + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(qIdx)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Icon icon="lucide:trash-2" className="h-3.5 w-3.5" />
                          <span>Hapus Soal</span>
                        </button>
                      </div>

                      {/* Input Teks Pertanyaan */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Teks Pertanyaan (Dapat Diedit Langsung):
                        </label>
                        <textarea
                          rows={2}
                          value={qItem.question}
                          onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm font-semibold focus:border-purple-600 focus:outline-none resize-none leading-relaxed bg-slate-50/60"
                        />
                      </div>

                      {/* 4 Opsi Jawaban & Pemilih Kunci */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Pilihan Jawaban (Klik tombol KUNCI untuk menetapkan jawaban yang benar):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {qItem.options.map((optText, optIdx) => {
                            const isCorrect = qItem.correctAnswer === optIdx;
                            const optionLetter = ['A', 'B', 'C', 'D'][optIdx];
                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {optionLetter}
                                </span>
                                <input
                                  type="text"
                                  value={optText}
                                  onChange={(e) => handleUpdateOptionText(qIdx, optIdx, e.target.value)}
                                  placeholder={`Pilihan ${optionLetter}`}
                                  className="flex-1 bg-transparent text-xs font-medium focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSetCorrectAnswer(qIdx, optIdx)}
                                  className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                                  }`}
                                >
                                  {isCorrect ? '✓ Kunci' : 'Kunci?'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step 2 Footer Actions (Regenerate, Edit Materi, & Publikasikan) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuizModalStep(1)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
                      <span>Edit Materi</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateQuizAI}
                      disabled={isGeneratingQuiz}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 px-3.5 py-2.5 text-xs font-bold text-purple-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Icon icon="solar:restart-bold" className={`h-4 w-4 ${isGeneratingQuiz ? 'animate-spin' : ''}`} />
                      <span>Regenerate AI</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePublishQuiz()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Icon icon="solar:rocket-bold" className="h-4 w-4" />
                    <span>🚀 Publikasikan Kuis ke Grup</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL 3: DETAIL LEMBAR JAWABAN SISWA
         ================================================================ */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <button
              type="button"
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-black text-slate-900">
                  Lembar Evaluasi Siswa
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedSubmission.studentName} · {selectedSubmission.groupName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Skor Akhir</span>
                <span className="font-heading text-xl font-black text-emerald-600">
                  {selectedSubmission.score} <span className="text-xs font-bold text-slate-400">/ 100</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedSubmission.answersDetail.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                    ans.isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-red-50/70 border-red-200 text-red-950'
                  }`}
                >
                  <p className="font-bold">
                    {idx + 1}. {ans.questionText}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 text-[11px]">
                    <span>
                      Jawaban Siswa: <strong>{ans.studentOption}</strong>
                    </span>
                    <span className="font-bold">
                      {ans.isCorrect ? '✅ Benar (+50)' : `❌ Kunci: ${ans.correctOption}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedSubmission(null)}
              className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Tutup Lembar Jawaban
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
