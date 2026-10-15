import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { VirtualLabModule } from './VirtualLabModule.tsx';

type SidebarNavKey = 'Beranda' | 'Misi Sains' | 'Lab Virtual' | 'Tantangan' | 'Peringkat';

interface PathNodeItem {
  id: number;
  title: string;
  subtitle: string;
  topicTag: string;
  zoneLabel: string;
  nodeIcon: string;
  starReward: number;
  xpReward: number;
  status: 'completed' | 'active' | 'locked';
  offsetClass: string;
  question: string;
  options: string[];
  correctIdx: number;
}

const INITIAL_PATH_NODES: PathNodeItem[] = [
  {
    id: 1,
    title: 'Pos 1: Anatomi Tubuh & Panca Indra Manusia 👁️',
    subtitle: 'Mengenal Fungsi Mata, Telinga, Kulit, Hidung, Lidah & Organ Tubuh di Bumi',
    topicTag: '🌍 Zona Dasar Bumi · Biologi Manusia',
    zoneLabel: '🌍 Zona Dasar Bumi · Biologi Manusia',
    nodeIcon: '👁️',
    starReward: 30,
    xpReward: 60,
    status: 'completed',
    offsetClass: 'translate-x-0',
    question: 'Bagian mata manakah yang berfungsi mengatur banyak sedikitnya cahaya yang masuk ke mata?',
    options: ['Pupil & Iris Mata', 'Daun Telinga', 'Ujung Lidah'],
    correctIdx: 0,
  },
  {
    id: 2,
    title: 'Pos 2: Dunia Tumbuhan & Ekosistem Hewan 🌿',
    subtitle: 'Fotosintesis Tumbuhan Hijau, Rantai Makanan & Habitat Makhluk Hidup',
    topicTag: '🌿 Zona Ekosistem Darat · Flora & Fauna',
    zoneLabel: '🌿 Zona Ekosistem Darat · Flora & Fauna',
    nodeIcon: '🌿',
    starReward: 35,
    xpReward: 70,
    status: 'completed',
    offsetClass: '-translate-x-8 sm:-translate-x-14',
    question: 'Proses tumbuhan hijau membuat makanannya sendiri dengan bantuan cahaya matahari dan klorofil disebut?',
    options: ['Fotosintesis', 'Kondensasi', 'Adaptasi'],
    correctIdx: 0,
  },
  {
    id: 3,
    title: 'Pos 3: Siklus Air, Kondensasi Awan & Hujan 🌧️',
    subtitle: 'Penguapan Air Bumi, Kondensasi Awan di Atmosfer & Turunnya Titik Hujan',
    topicTag: '☁️ Zona Tengah Atmosfer · Misi Aktif',
    zoneLabel: '☁️ Zona Atmosfer & Langit Biru · Siklus Air',
    nodeIcon: '🌧️',
    starReward: 40,
    xpReward: 80,
    status: 'active',
    offsetClass: 'translate-x-4 sm:translate-x-10',
    question: 'Proses berubahnya uap air di atmosfer langit biru menjadi titik-titik air pembentuk awan hujan disebut?',
    options: ['Kondensasi (Pengembunan)', 'Evaporasi (Penguapan)', 'Sublimasi'],
    correctIdx: 0,
  },
  {
    id: 4,
    title: 'Pos 4: Energi Panas & Wujud Benda ⚡',
    subtitle: 'Perpindahan Kalor, Eksperimen Suhu & Perubahan Wujud Padat, Cair, Gas',
    topicTag: '🚀 Zona Lapisan Atas · Fisika & Energi',
    zoneLabel: '🚀 Zona Transisi Angkasa · Kalor & Energi',
    nodeIcon: '⚡',
    starReward: 50,
    xpReward: 95,
    status: 'locked',
    offsetClass: '-translate-x-8 sm:-translate-x-14',
    question: 'Perubahan wujud benda padat menjadi cair karena menerima energi panas (kalor) disebut?',
    options: ['Mencair (Melebur)', 'Membeku', 'Mengembun'],
    correctIdx: 0,
  },
  {
    id: 5,
    title: 'Pos 5: Tata Surya & Gravitasi 🪐',
    subtitle: 'Orbit Planet Mengelilingi Matahari, Cincin Saturnus & Gaya Gravitasi Antariksa',
    topicTag: '🪐 Zona Puncak Galaksi · Astronomi SD',
    zoneLabel: '🪐 Puncak Luar Angkasa · Tata Surya & Gravitasi',
    nodeIcon: '🪐',
    starReward: 60,
    xpReward: 120,
    status: 'locked',
    offsetClass: 'translate-x-4 sm:translate-x-8',
    question: 'Gaya tarik-menarik yang menjaga planet-planet tetap beredar pada orbitnya mengelilingi Matahari disebut?',
    options: ['Gaya Gravitasi Matahari', 'Gaya Gesek Udara', 'Gaya Pegas'],
    correctIdx: 0,
  },
];

interface StudentDashboardMOneProps {
  initialActiveNav?: SidebarNavKey;
  onOpenVirtualLab?: () => void;
  onSwitchToLanding3D?: () => void;
  onNavigatePage?: (route: 'landing' | 'login' | 'register' | 'dashboard' | 'virtual-lab' | 'misi-sains' | 'tantangan-kuis' | 'peringkat' | 'landing-3d') => void;
  hideSidebar?: boolean;
}

export const StudentDashboardMOne: React.FC<StudentDashboardMOneProps> = ({
  initialActiveNav = 'Beranda',
  onOpenVirtualLab,
  onSwitchToLanding3D,
  onNavigatePage,
  hideSidebar = false,
}) => {
  const [activeNav, setActiveNav] = useState<SidebarNavKey>(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.includes('virtual-lab')
    ) {
      return 'Lab Virtual';
    }
    return initialActiveNav;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [starCount, setStarCount] = useState<number>(1240);
  const [streakDays, setStreakDays] = useState<number>(7);
  const [xpEarned, setXpEarned] = useState<number>(120);
  const [studyMinutes, setStudyMinutes] = useState<number>(32);
  const [pathNodes, setPathNodes] = useState<PathNodeItem[]>(INITIAL_PATH_NODES);
  const [selectedNodeModal, setSelectedNodeModal] = useState<PathNodeItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [expandedNodeId, setExpandedNodeId] = useState<number | null>(null);

  // === STATE GABUNG KELAS (JOIN CLASS) ===
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [joinClassCode, setJoinClassCode] = useState('');
  const [joinClassStatus, setJoinClassStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [joinedClassName, setJoinedClassName] = useState<string | null>(null);

  useEffect(() => {
    if (initialActiveNav && initialActiveNav !== 'Lab Virtual') {
      setActiveNav(initialActiveNav);
    }
  }, [initialActiveNav]);

  // Sinkronisasi tombol Back/Forward browser antara '/dashboard' dan '/virtual-lab'
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('virtual-lab')) {
        if (onOpenVirtualLab) {
          onOpenVirtualLab();
        } else {
          setActiveNav('Lab Virtual');
        }
      } else {
        setActiveNav('Beranda');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onOpenVirtualLab]);

  // Hitung persentase progres stasiun (default: 2 dari 5 selesai = 40%)
  const completedCount = pathNodes.filter((n) => n.status === 'completed').length;
  const levelProgressPercent = Math.round((completedCount / pathNodes.length) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Handler untuk bergabung ke Grup Kelas menggunakan Kode Unik Guru
  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinClassCode.trim()) return;

    setJoinClassStatus('loading');
    // Simulasi pengecekan kode grup (dalam real app, ini akan jadi API call)
    setTimeout(() => {
      const code = joinClassCode.trim().toUpperCase();
      // Mock: kode yang dimulai dengan 'BINTANG' dianggap valid
      if (code.startsWith('BINTANG')) {
        setJoinClassStatus('success');
        setJoinedClassName(`Kelas dari kode ${code}`);
        showToast(`🎉 Berhasil bergabung ke kelas! Kode: ${code}`);
        // Simpan ke localStorage sebagai penanda
        const joinedClasses = JSON.parse(localStorage.getItem('joinedClasses') || '[]');
        if (!joinedClasses.includes(code)) {
          joinedClasses.push(code);
          localStorage.setItem('joinedClasses', JSON.stringify(joinedClasses));
        }
      } else {
        setJoinClassStatus('error');
        showToast('❌ Kode grup tidak ditemukan. Pastikan kode dari guru benar!');
      }
      setTimeout(() => {
        setJoinClassStatus('idle');
        setJoinClassCode('');
        setShowJoinClassModal(false);
      }, 2000);
    }, 1200);
  };

  const handleSidebarNav = (nav: SidebarNavKey, targetId?: string) => {
    if (onNavigatePage) {
      if (nav === 'Lab Virtual') {
        onNavigatePage('virtual-lab');
        return;
      }
      if (nav === 'Misi Sains') {
        onNavigatePage('misi-sains');
        return;
      }
      if (nav === 'Tantangan') {
        onNavigatePage('tantangan-kuis');
        return;
      }
      if (nav === 'Peringkat') {
        onNavigatePage('peringkat');
        return;
      }
    }

    if (nav === 'Lab Virtual') {
      if (onOpenVirtualLab) {
        onOpenVirtualLab();
        return;
      }
      setActiveNav('Lab Virtual');
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('virtual-lab')
      ) {
        window.history.pushState({}, '', '/virtual-lab');
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    setActiveNav(nav);
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.includes('virtual-lab')
    ) {
      window.history.pushState({}, '', '/dashboard');
    }

    const sectionMap: Record<SidebarNavKey, string> = {
      Beranda: 'level-banner-section',
      'Misi Sains': 'galaxy-path-section',
      'Lab Virtual': 'galaxy-path-section',
      Tantangan: 'daily-target-widget',
      Peringkat: 'podium-widget',
    };
    const resolvedTarget = targetId || sectionMap[nav];
    window.setTimeout(() => {
      if (resolvedTarget) {
        const el = document.getElementById(resolvedTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
    showToast(`🚀 Membuka menu navigasi: ${nav}`);
  };

  const handleNodeTrigger = (node: PathNodeItem) => {
    setExpandedNodeId((prev) => (prev === node.id ? null : node.id));
  };

  const handleNodeClick = (node: PathNodeItem) => {
    if (node.status === 'locked') {
      showToast(
        `🔒 Pos #${node.id} "${node.title}" masih terkunci! Selesaikan misi berbintang terlebih dahulu.`
      );
      return;
    }
    setSelectedNodeModal(node);
    setSelectedOption(null);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    if (!selectedNodeModal) return;
    setSelectedOption(optionIdx);

    if (optionIdx !== selectedNodeModal.correctIdx) {
      showToast('💡 Hampir tepat! Coba perhatikan petunjuk sains dari Kadet Foxy.');
      return;
    }

    const addedStars = selectedNodeModal.starReward;
    const addedXp = selectedNodeModal.xpReward;
    setStarCount((prev) => prev + addedStars);
    setXpEarned((prev) => prev + addedXp);
    setStudyMinutes((prev) => Math.min(45, prev + 6));

    setPathNodes((prev) =>
      prev.map((item) => {
        if (item.id === selectedNodeModal.id) {
          return { ...item, status: 'completed' };
        }
        if (item.id === selectedNodeModal.id + 1 && item.status === 'locked') {
          return { ...item, status: 'active' };
        }
        return item;
      })
    );

    showToast(
      `🎉 Pos #${selectedNodeModal.id} "${selectedNodeModal.title}" selesai! +${addedStars} ⭐ & +${addedXp} XP!`
    );

    window.setTimeout(() => {
      setSelectedNodeModal(null);
      setSelectedOption(null);
    }, 850);
  };

  const filteredNodes = pathNodes.filter(
    (node) =>
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.topicTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dailyTargetPercent = Math.min(100, Math.round((studyMinutes / 45) * 100));

  // Fallback jika StudentDashboardMOne dirender langsung tanpa parent router
  if (activeNav === 'Lab Virtual') {
    return (
      <VirtualLabModule
        activeNav="Lab Virtual"
        starCount={starCount}
        streakDays={streakDays}
        xpEarned={xpEarned}
        levelProgressPercent={levelProgressPercent}
        onAddReward={(stars, xp, reason) => {
          setStarCount((prev) => prev + stars);
          setXpEarned((prev) => prev + xp);
          setStudyMinutes((prev) => Math.min(45, prev + 8));
          showToast(`🎉 ${reason} (+${stars} ⭐ & +${xp} XP)`);
        }}
        onNavigateSidebar={(nav) => handleSidebarNav(nav)}
        onSelectNav={(nav) => handleSidebarNav(nav)}
        onBackToDashboard={() => handleSidebarNav('Beranda')}
        onSwitchToLanding3D={onSwitchToLanding3D}
      />
    );
  }

  return (
    <div
      className="dashboard-bright-shell relative min-h-screen overflow-x-hidden bg-slate-50 bg-gradient-to-b from-slate-50 via-[#F8FAFC] to-[#F0F9FF] text-[#0F172A] font-jakarta antialiased selection:bg-[#FACC15] selection:text-slate-950"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 55%, #F0F9FF 100%)',
        color: '#0F172A',
      }}
    >
      {/* Efek Pendaran Pastel Cerah Latar Belakang (Bright Clean Theme) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      {/* Toast Feedback Interaktif (Bright Claymorphism) */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border-2 border-[#0EA5E9] bg-white px-5 py-3.5 text-[#0F172A] shadow-[0_16px_36px_rgba(14,165,233,0.22),inset_0_2px_4px_rgba(255,255,255,0.95)] transition-all"
          style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FACC15] text-sm font-black text-[#0F172A]">
            ⭐
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          1. SIDEBAR KIRI (w-64, fixed di Desktop) — BRIGHT CLAYMORPHISM
          Logo resmi Bintang Edu (Maskot Bintang Bertoga di Atas Buku Terbuka)
          + Menu navigasi utama + Kartu profil siswa di bawah
          ===================================================================== */}
      {!hideSidebar && (
        <aside
          className="relative z-30 w-full lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-white/95 backdrop-blur-xl border-b lg:border-b-0 lg:border-r-2 border-slate-200/90 shadow-[6px_0_28px_rgba(15,23,42,0.06)] flex flex-col justify-between p-6 select-none text-[#0F172A]"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            color: '#0F172A',
            borderColor: 'rgba(226, 232, 240, 0.95)',
          }}
        >
        <div>
          {/* Logo Resmi Bintang Edu: Maskot Bintang Bertoga di Atas Buku Terbuka */}
          <div className="flex items-center justify-between lg:justify-start gap-3 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#0EA5E9] p-1.5 shadow-[0_8px_20px_rgba(99,102,241,0.28),inset_0_2px_4px_rgba(255,255,255,0.45)] border-2 border-white"
              >
                <svg viewBox="0 0 64 64" className="h-9 w-9 drop-shadow-sm" aria-label="Logo Bintang Edu">
                  {/* Buku Terbuka di Bawah (Biru Langit & Putih) */}
                  <path
                    d="M10 46 Q21 41 32 47 Q43 41 54 46 L54 55 Q43 50 32 56 Q21 50 10 55 Z"
                    fill="#38BDF8"
                  />
                  <path
                    d="M12 43 Q22 38 32 44 Q42 38 52 43 L52 51 Q42 46 32 52 Q22 46 12 51 Z"
                    fill="#FFFFFF"
                  />
                  <line x1="32" y1="44" x2="32" y2="55" stroke="#0EA5E9" strokeWidth="2" />
                  {/* Tubuh Maskot Bintang Emas Ceria */}
                  <path
                    d="M32 14 L36.8 24.2 L48 25.6 L39.8 33.4 L41.9 44.5 L32 39.2 L22.1 44.5 L24.2 33.4 L16 25.6 L27.2 24.2 Z"
                    fill="#FACC15"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  {/* Wajah Ceria Bintang */}
                  <circle cx="28.5" cy="29" r="1.7" fill="#0F172A" />
                  <circle cx="35.5" cy="29" r="1.7" fill="#0F172A" />
                  <path d="M29 33 Q32 35.8 35 33" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  {/* Toga Wisuda Navy Blue Tua di Atas Bintang */}
                  <polygon points="32,6 16,13 32,19 48,13" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
                  <rect x="24" y="16" width="16" height="4" rx="1.5" fill="#1E293B" />
                  {/* Tali Kuncir Toga Kuning Emas */}
                  <path d="M44 14.5 L46 23" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="46" cy="24" r="2" fill="#F59E0B" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-[#0F172A] leading-none">
                    <span className="text-[#0F172A]">Bintang</span> <span className="text-[#0284C7]">Edu</span>
                  </span>
                  <span className="rounded-md bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-[10px] font-extrabold text-[#4F46E5]">
                    M-ONE
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-[#64748B]">
                  Eksplorasi Sains Galaksi SD
                </p>
              </div>
            </div>

            {/* Badge Ringkas di Layar Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <span className="rounded-xl bg-amber-50 border border-amber-300 px-2.5 py-1 text-xs font-extrabold text-amber-900 tabular-nums shadow-sm">
                ⭐ {starCount.toLocaleString('en-US')}
              </span>
              <span className="rounded-xl bg-orange-50 border border-orange-300 px-2.5 py-1 text-xs font-extrabold text-orange-800 tabular-nums shadow-sm">
                🔥 {streakDays}h
              </span>
            </div>
          </div>

          {/* Menu Navigasi Utama Sidebar */}
          <div className="mt-6">
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2.5">
              Navigasi Utama Galaksi
            </p>
            <nav
              aria-label="Menu Navigasi Utama"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5"
            >
              {(
                [
                  {
                    key: 'Beranda',
                    icon: 'solar:home-smile-bold-duotone',
                    target: 'level-banner-section',
                    badge: undefined,
                    accentColor: 'text-[#0284C7]',
                  },
                  {
                    key: 'Misi Sains',
                    icon: 'solar:compass-big-bold-duotone',
                    target: 'galaxy-path-section',
                    badge: 'Aktif',
                    accentColor: 'text-emerald-500',
                  },
                  {
                    key: 'Lab Virtual',
                    icon: 'solar:test-tube-bold-duotone',
                    target: 'galaxy-path-section',
                    badge: 'Sains Air',
                    accentColor: 'text-orange-500',
                  },
                  {
                    key: 'Tantangan',
                    icon: 'solar:bolt-circle-bold-duotone',
                    target: 'daily-target-widget',
                    badge: '+120 XP',
                    accentColor: 'text-pink-500',
                  },
                  {
                    key: 'Peringkat',
                    icon: 'solar:cup-star-bold-duotone',
                    target: 'podium-widget',
                    badge: '#3',
                    accentColor: 'text-amber-500',
                  },
                ] as {
                  key: SidebarNavKey;
                  icon: string;
                  target: string;
                  badge?: string;
                  accentColor: string;
                }[]
              ).map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSidebarNav(item.key, item.target)}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-indigo-600 text-white border border-sky-200 border-b-4 border-b-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.32),inset_0_2px_4px_rgba(255,255,255,0.45)]'
                        : 'text-[#0F172A] hover:bg-slate-100 hover:text-[#4F46E5] border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        icon={item.icon}
                        className={`text-xl shrink-0 ${isActive ? 'text-white' : item.accentColor}`}
                      />
                      <span>{item.key}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`hidden xl:inline-flex rounded-lg px-2 py-0.5 text-[10px] font-extrabold tabular-nums ${
                          isActive
                            ? 'bg-[#FACC15] text-[#0F172A]'
                            : 'bg-sky-50 text-[#0284C7] border border-sky-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Tombol Menuju Landing Page Panggung 3D */}
            {onSwitchToLanding3D && (
              <button
                type="button"
                onClick={onSwitchToLanding3D}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-indigo-200 border-b-4 border-b-indigo-300 bg-indigo-50/90 hover:bg-indigo-100 px-3.5 py-2.5 text-xs font-extrabold text-[#4F46E5] shadow-[0_6px_14px_rgba(99,102,241,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] transition-all hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
              >
                <Icon icon="solar:planet-3-bold-duotone" className="text-base text-[#0284C7]" />
                <span>Panggung Galaksi 3D</span>
              </button>
            )}
          </div>
        </div>

        {/* Kartu Profil Siswa di Bawah Sidebar (Bright Claymorphism) */}
        <div
          className="mt-6 lg:mt-0 rounded-3xl border-2 border-slate-200/90 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F0F9FF] p-4 text-[#0F172A] shadow-[0_12px_26px_rgba(15,23,42,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)]"
          style={{
            backgroundColor: '#F8FAFC',
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 55%, #F0F9FF 100%)',
            borderColor: '#E2E8F0',
            color: '#0F172A',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] text-sm font-extrabold text-white shadow-md border-2 border-white">
              MT
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-[#0F172A]">Minton</p>
              <p className="truncate text-xs font-bold text-[#4F46E5]">
                Kelas 5 SD · Kadet Lv. 7
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#475569] mb-1.5">
              <span>Progres Kadet Sains</span>
              <span className="text-[#0284C7] font-extrabold tabular-nums">{levelProgressPercent}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 p-0.5 border border-slate-300/80 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#10B981] transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
              <span>Kompetisi M-ONE</span>
              <a
                href="/dashboard-siswa.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0284C7] hover:text-[#4F46E5] font-extrabold underline transition-colors"
              >
                Single-File HTML ↗
              </a>
            </div>
          </div>
        </div>
      </aside>
      )}

      {/* =====================================================================
          WRAPPER KONTEN UTAMA DESKTOP (lg:pl-64) — HYBRID WORKSPACE
          Grid 12 Kolom:
          - Area Konten Utama (Tengah, lg:col-span-8) — BRIGHT CLAYMORPHISM
          - Panel Kanan (Widgets, lg:col-span-4) — MUTLAK GELAP GALAKSI (COSMIC DARK)
          ===================================================================== */}
      <div
        className="relative z-10 lg:pl-64 min-h-screen transition-all duration-300 ease-in-out"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="mx-auto max-w-[1440px] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start transition-all duration-300 ease-in-out">
          {/* =================================================================
              2. AREA KONTEN UTAMA (Tengah, lg:col-span-8) — BRIGHT CLAYMORPHISM
              - Top bar dengan search bar pencarian materi & badge poin (⭐ 1,240 Bintang, 🔥 7 Hari Streak)
              - Banner level atas ("Level 3, Stasiun 2: Petualangan Tata Surya & Air") dengan progress bar
              - Jalur Petualangan Galaksi (Gamified Learning Path ala Duolingo)
              ================================================================= */}
          <main className="lg:col-span-8 space-y-6 min-w-0">
            {/* Top Bar: Search Bar Pencarian Materi & Badge Poin (Bright Claymorphism) */}
            <header
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-2 border-slate-200/90 bg-white/95 p-4 sm:px-6 text-[#0F172A] shadow-[0_14px_34px_rgba(15,23,42,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                color: '#0F172A',
              }}
            >
              {/* Search Bar Pencarian Materi */}
              <div className="relative flex-1 max-w-md">
                <Icon
                  icon="solar:magnifer-linear"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#0284C7]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pos orbit: anatomi tubuh, siklus air, metamorfosis, energi, tata surya..."
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-sm font-bold text-[#0F172A] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 shadow-inner transition-all"
                  style={{
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    borderColor: '#E2E8F0',
                  }}
                />
              </div>

              {/* Badge Poin (⭐ 1,240 Bintang Warm Star Yellow & 🔥 7 Hari Streak Ceria) */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setStarCount((prev) => prev + 10);
                    showToast('⭐ +10 Bintang Emas Bintang Edu ditambahkan!');
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-amber-300 border-b-4 border-b-amber-400 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-amber-900 shadow-[0_6px_16px_rgba(245,158,11,0.18),inset_0_2px_4px_rgba(255,255,255,0.9)] transition-transform hover:scale-105 cursor-pointer tabular-nums whitespace-nowrap"
                  style={{ backgroundColor: '#FFFBEB', color: '#78350F' }}
                >
                  <span className="text-base leading-none">⭐</span>
                  <span>{starCount.toLocaleString('en-US')} Bintang</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStreakDays((d) => d + 1);
                    showToast('🔥 Streak belajar harianmu makin menyala!');
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-orange-200 border-b-4 border-b-orange-300 bg-orange-50 hover:bg-orange-100 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-orange-800 shadow-[0_6px_16px_rgba(249,115,22,0.15),inset_0_2px_4px_rgba(255,255,255,0.9)] transition-transform hover:scale-105 cursor-pointer tabular-nums whitespace-nowrap"
                  style={{ backgroundColor: '#FFF7ED', color: '#9A3412' }}
                >
                  <span className="text-base leading-none">🔥</span>
                  <span>{streakDays} Hari Streak</span>
                </button>
              </div>
            </header>

            {/* ================================================================
                SECTION: GABUNG KELAS DENGAN KODE GURU
               ================================================================ */}
            <section className="cosmic-dark-card relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c0f45] via-[#1e1b4b] to-[#312e81] p-5 sm:p-6 text-white shadow-xl border border-purple-500/30">
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 border border-amber-400/40 text-2xl">
                    🏫
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">Gabung Kelas dengan Kode</h3>
                    <p className="text-xs text-purple-200/80 font-medium">Masukkan kode dari guru untuk bergabung ke kelas dan mulai belajar bersama!</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJoinClassModal(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 text-xs sm:text-sm font-extrabold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Icon icon="solar:key-bold" className="h-4 w-4" />
                  <span>Masukkan Kode Kelas</span>
                </button>
              </div>
            </section>

            {/* Banner Level Atas ("Level 3, Stasiun 2: Jelajahi Kurikulum Sains Terpadu SD") — WAJIB GELAP GALAKSI (COSMIC DARK CARD) */}
            <section
              id="level-banner-section"
              aria-label="Banner Level Atas"
              className="cosmic-dark-card relative overflow-hidden rounded-3xl bg-slate-950 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-6 sm:p-7 text-white shadow-[0_22px_48px_rgba(2,6,23,0.38),0_0_28px_rgba(56,189,248,0.24),inset_0_2px_6px_rgba(255,255,255,0.22)] border-2 border-indigo-400/65 border-b-[5px] border-b-[#38BDF8]"
              style={{
                backgroundColor: '#0F172A',
                backgroundImage:
                  'linear-gradient(135deg, #0F172A 0%, #1E1B4B 52%, #312E81 100%)',
                color: '#FFFFFF',
                borderColor: 'rgba(129, 140, 248, 0.65)',
              }}
            >
              {/* Taburan Bintang & Pendaran Nebula Halus di Dalam Kartu Stasiun Aktif */}
              <div
                className="pointer-events-none absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1.6px), radial-gradient(circle, rgba(250,204,21,0.8) 1px, transparent 1.6px)',
                  backgroundSize: '32px 32px, 48px 48px',
                  backgroundPosition: '0 0, 16px 20px',
                }}
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#FACC15]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#38BDF8]/25 blur-3xl" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-indigo-950/90 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FACC15] border border-indigo-400/60 shadow-sm">
                    <span>🚀 Kurikulum Sains SD 🇮🇩</span>
                    <span aria-hidden="true">•</span>
                    <span className="text-[#38BDF8]">Stasiun Aktif</span>
                  </div>
                  <h1
                    className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.18)]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Level 3, Stasiun 2: Jelajahi Kurikulum Sains Terpadu SD
                  </h1>
                  <p
                    className="mt-1 text-xs sm:text-sm font-medium text-indigo-100/95"
                    style={{ color: '#E0E7FF' }}
                  >
                    Selesaikan 5 Pos Orbit Sains SD (Makhluk Hidup, Siklus Air, Ekosistem, Energi &amp; Tata Surya) bersama Kadet Minton &amp; Kadet Foxy!
                  </p>
                  {/* Kategori Stasiun dengan Aksen Gelap Galaksi Berpendar */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-950/85 border border-sky-400/60 px-2.5 py-1 text-[11px] font-extrabold text-sky-200 shadow-sm">
                      👁️ Anatomi &amp; Panca Indra
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/85 border border-emerald-400/60 px-2.5 py-1 text-[11px] font-extrabold text-emerald-200 shadow-sm">
                      💧 Siklus Air &amp; Kondensasi
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-pink-950/85 border border-pink-400/60 px-2.5 py-1 text-[11px] font-extrabold text-pink-200 shadow-sm">
                      🦋 Metamorfosis &amp; Ekosistem
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-orange-950/85 border border-orange-400/60 px-2.5 py-1 text-[11px] font-extrabold text-orange-200 shadow-sm">
                      ⚡ Energi &amp; Wujud Benda
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-950/85 border border-amber-400/60 px-2.5 py-1 text-[11px] font-extrabold text-[#FACC15] shadow-sm">
                      🪐 Tata Surya
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      const activeNode = pathNodes.find((n) => n.status === 'active') || pathNodes[0];
                      if (activeNode) handleNodeClick(activeNode);
                    }}
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FACC15] hover:bg-[#F59E0B] border-2 border-amber-200 border-b-4 border-b-[#D97706] px-5 py-3 text-xs sm:text-sm font-extrabold text-[#0F172A] shadow-[0_8px_22px_rgba(250,204,21,0.4),inset_0_2px_4px_rgba(255,255,255,0.85)] transition-all cursor-pointer active:translate-y-0.5"
                    style={{ backgroundColor: '#FACC15', color: '#0F172A' }}
                  >
                    <Icon icon="solar:play-circle-bold" className="text-lg text-[#0F172A]" />
                    <span>Lanjutkan Pos Orbit #{Math.min(pathNodes.length, completedCount + 1)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSidebarNav('Lab Virtual')}
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500/20 hover:bg-sky-500/35 border border-[#38BDF8] px-4 py-2 text-xs font-extrabold text-[#38BDF8] shadow-sm transition-all cursor-pointer"
                  >
                    <span>🔬</span>
                    <span>Buka Lab Virtual (/virtual-lab)</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar Kontras di Atas Kartu Gelap Galaksi */}
              <div className="relative z-10 mt-5 pt-4 border-t border-indigo-400/35">
                <div className="mb-2 flex items-center justify-between text-xs font-extrabold">
                  <span className="text-white" style={{ color: '#FFFFFF' }}>
                    Progres Stasiun ({completedCount} dari {pathNodes.length} Pos Selesai)
                  </span>
                  <span className="text-[#FACC15] tabular-nums" style={{ color: '#FACC15' }}>
                    {levelProgressPercent}%
                  </span>
                </div>
                <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-indigo-400/50 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#6366F1] to-[#FACC15] transition-all duration-500"
                    style={{ width: `${levelProgressPercent}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Kotak Kartu Peta Jalur Petualangan Galaksi Vertikal (Bottom-to-Top Earth-to-Space Journey) */}
            <section
              id="galaxy-path-section"
              aria-label="Jalur Petualangan Galaksi Vertikal Bumi ke Antariksa"
              className="relative overflow-hidden rounded-3xl p-5 sm:p-8 text-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] border-4 border-white ring-2 ring-slate-200/90"
              style={{
                background:
                  'linear-gradient(to top, #047857 0%, #059669 12%, #10B981 22%, #0EA5E9 42%, #0284C7 56%, #312E81 76%, #1E1B4B 90%, #090D1F 100%)',
                color: '#FFFFFF',
              }}
            >
              {/* CSS Keyframes untuk Animasi Interaktif Materi Sains (Kondensasi Awan, Hujan Berkilau, Roket Meluncur, Bumi Berputar, & Bintang Berkelip) */}
              <style>{`
                @keyframes floatCloudSlow {
                  0%, 100% { transform: translate3d(-12px, 0px, 0) scale(1); }
                  50% { transform: translate3d(16px, -6px, 0) scale(1.03); }
                }
                @keyframes floatCloudReverse {
                  0%, 100% { transform: translate3d(12px, 0px, 0) scale(1); }
                  50% { transform: translate3d(-16px, 5px, 0) scale(1.04); }
                }
                @keyframes rainDropFall {
                  0% { transform: translateY(-6px) scale(0.8); opacity: 0; }
                  25% { opacity: 1; }
                  80% { opacity: 0.95; }
                  100% { transform: translateY(38px) scale(1.05); opacity: 0; }
                }
                @keyframes rocketGlidePath {
                  0%, 100% { transform: translate3d(0px, 0px, 0) rotate(-18deg); }
                  50% { transform: translate3d(22px, -26px, 0) rotate(-8deg); }
                }
                @keyframes earthSpinSlow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes starSparklePulse {
                  0%, 100% { transform: scale(0.75) rotate(0deg); opacity: 0.45; }
                  50% { transform: scale(1.3) rotate(18deg); opacity: 1; }
                }
                @keyframes cadetFloat3D {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-9px); }
                }
                .anim-cloud-slow {
                  animation: floatCloudSlow 7s ease-in-out infinite;
                }
                .anim-cloud-reverse {
                  animation: floatCloudReverse 8.5s ease-in-out infinite;
                }
                .anim-rain-1 {
                  animation: rainDropFall 1.8s linear infinite;
                }
                .anim-rain-2 {
                  animation: rainDropFall 1.8s linear 0.45s infinite;
                }
                .anim-rain-3 {
                  animation: rainDropFall 1.8s linear 0.9s infinite;
                }
                .anim-rain-4 {
                  animation: rainDropFall 1.8s linear 1.35s infinite;
                }
                .anim-rocket-glide {
                  animation: rocketGlidePath 4.2s ease-in-out infinite;
                }
                .anim-earth-spin {
                  animation: earthSpinSlow 38s linear infinite;
                }
                .anim-star-sparkle {
                  animation: starSparklePulse 2.6s ease-in-out infinite;
                }
                .anim-cadet-3d {
                  animation: cadetFloat3D 4s ease-in-out infinite;
                }
              `}</style>

              {/* =============================================================
                  ZONA 3 (PUNCAK PETA - ATAS): LUAR ANGKASA / MALAM GALAKSI (indigo-950)
                  Bintang Berkilau, Komet, Matahari Kosmik, Planet Saturnus, & Roket
                  ============================================================= */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[42%] opacity-80"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.95) 1.3px, transparent 1.8px), radial-gradient(circle, rgba(253,224,71,0.85) 1.1px, transparent 1.6px)',
                  backgroundSize: '34px 34px, 52px 52px',
                  backgroundPosition: '0 0, 17px 21px',
                }}
                aria-hidden="true"
              />

              {/* Taburan Bintang Berkelip di Zona Antariksa Atas */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
                <span className="anim-star-sparkle absolute top-24 left-[34%] text-sm sm:text-base">✨</span>
                <span className="anim-star-sparkle absolute top-36 right-[28%] text-xs sm:text-sm" style={{ animationDelay: '0.6s' }}>⭐</span>
                <span className="anim-star-sparkle absolute top-[22%] left-[18%] text-base sm:text-lg" style={{ animationDelay: '1.1s' }}>⭐</span>
                <span className="anim-star-sparkle absolute top-[30%] right-[20%] text-sm sm:text-base" style={{ animationDelay: '0.4s' }}>✨</span>

                {/* Komet / Bintang Jatuh Kosmik di Puncak Antariksa */}
                <svg className="absolute top-28 left-[38%] h-12 w-24 opacity-90" viewBox="0 0 120 50" fill="none">
                  <path d="M10 40 L105 8" stroke="url(#cometTailGrad)" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="12" cy="39" r="4.5" fill="#FEF08A" />
                  <defs>
                    <linearGradient id="cometTailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FEF08A" />
                      <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* ILUSTRASI PUNCAK KANAN ATAS: MATAHARI KOSMIK BERSINAR (Pos 5: Tata Surya & Gravitasi) */}
              <div
                className="pointer-events-none absolute top-20 -right-8 sm:right-2 z-0 select-none"
                aria-hidden="true"
              >
                <div className="relative flex h-40 w-40 sm:h-52 sm:w-52 items-center justify-center">
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300/55 via-orange-500/45 to-rose-500/25 blur-2xl animate-pulse" />
                  <svg
                    viewBox="0 0 240 240"
                    className="relative h-full w-full drop-shadow-[0_0_38px_rgba(251,146,60,0.9)]"
                  >
                    <defs>
                      <radialGradient id="cosmicSunCore" cx="40%" cy="38%" r="65%">
                        <stop offset="0%" stopColor="#FFFBEB" />
                        <stop offset="30%" stopColor="#FDE047" />
                        <stop offset="68%" stopColor="#FB923C" />
                        <stop offset="100%" stopColor="#EA580C" />
                      </radialGradient>
                      <linearGradient id="sunFlareOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="50%" stopColor="#F97316" />
                        <stop offset="100%" stopColor="#E11D48" />
                      </linearGradient>
                    </defs>
                    <g className="origin-center anim-earth-spin">
                      <path
                        d="M120 10 C132 28 148 22 158 18 C156 38 172 42 188 38 C178 56 192 68 210 72 C194 88 204 104 222 114 C202 124 206 142 218 158 C196 160 192 178 198 196 C178 188 166 202 162 220 C146 204 132 214 120 230 C108 214 94 204 78 220 C74 202 62 188 42 196 C48 178 44 160 22 158 C34 142 38 124 18 114 C36 104 46 88 30 72 C48 68 62 56 52 38 C68 42 84 38 82 18 C92 22 108 28 120 10 Z"
                        fill="url(#sunFlareOuter)"
                        opacity="0.92"
                      />
                      <path
                        d="M120 24 C135 42 155 34 170 32 C166 52 186 58 202 58 C188 76 200 94 214 106 C196 120 202 140 210 156 C188 158 182 178 184 194 C164 184 148 198 140 214 C126 198 110 206 96 216 C90 198 74 186 54 192 C60 174 52 156 32 152 C44 136 46 116 28 102 C46 90 54 72 42 54 C60 56 78 48 76 28 C92 34 108 40 120 24 Z"
                        fill="#FBBF24"
                        opacity="0.85"
                      />
                    </g>
                    <circle cx="120" cy="120" r="70" fill="url(#cosmicSunCore)" />
                    <ellipse
                      cx="96"
                      cy="90"
                      rx="26"
                      ry="14"
                      transform="rotate(-24 96 90)"
                      fill="#FFFFFF"
                      opacity="0.55"
                    />
                  </svg>
                </div>
              </div>

              {/* ILUSTRASI PUNCAK KIRI ATAS: PLANET CINCIN SATURNUS DI ZONA ANTARIKSA */}
              <div
                className="pointer-events-none absolute top-24 left-2 sm:left-6 z-0 select-none"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 220 150"
                  className="h-28 w-40 sm:h-36 sm:w-52 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
                >
                  <defs>
                    <linearGradient id="saturnBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="45%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#7E22CE" />
                    </linearGradient>
                    <linearGradient id="saturnRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#FDE047" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#F472B6" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>
                  <ellipse
                    cx="110"
                    cy="76"
                    rx="92"
                    ry="26"
                    transform="rotate(-16 110 76)"
                    fill="none"
                    stroke="url(#saturnRingGrad)"
                    strokeWidth="12"
                    opacity="0.7"
                  />
                  <circle cx="110" cy="76" r="42" fill="url(#saturnBodyGrad)" />
                  <path d="M70 66 Q110 78 150 64" stroke="#FEF08A" strokeWidth="5" fill="none" opacity="0.55" />
                  <path d="M72 84 Q110 96 148 82" stroke="#FFE4E6" strokeWidth="4" fill="none" opacity="0.45" />
                  <path
                    d="M 22 101 A 92 26 -16 0 0 198 51"
                    fill="none"
                    stroke="url(#saturnRingGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* ROKET MELUNCUR NAIK MENUJU PUNCAK ANTARIKSA (DI SEKITAR POS 4) */}
              <div
                className="pointer-events-none absolute top-[28%] left-4 sm:left-12 z-10 select-none anim-rocket-glide"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 120 120"
                  className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-[0_12px_22px_rgba(249,115,22,0.65)]"
                >
                  <circle cx="60" cy="114" r="3" fill="#FEF08A" opacity="0.8" />
                  <circle cx="52" cy="118" r="2" fill="#FDBA74" opacity="0.7" />
                  <path d="M46 86 C50 106 60 116 60 116 C60 116 70 106 74 86 Z" fill="#F97316" />
                  <path d="M52 86 C55 100 60 108 60 108 C60 108 65 100 68 86 Z" fill="#FDE047" />
                  <path d="M42 64 L26 82 L44 82 Z" fill="#EC4899" />
                  <path d="M78 64 L94 82 L76 82 Z" fill="#EC4899" />
                  <path
                    d="M60 18 C42 36 40 62 42 84 L78 84 C80 62 78 36 60 18 Z"
                    fill="#F8FAFC"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                  />
                  <path d="M60 18 C51 27 47 36 45 42 L75 42 C73 36 69 27 60 18 Z" fill="#EF4444" />
                  <circle cx="60" cy="58" r="10" fill="#38BDF8" stroke="#4F46E5" strokeWidth="3" />
                  <circle cx="57" cy="55" r="3" fill="#FFFFFF" />
                </svg>
              </div>

              {/* =============================================================
                  ZONA 2 (TENGAH PETA): ATMOSFER & AWAN LANGIT BIRU
                  Animasi Awan Putih Lembut & Titik Air Hujan Berkilau (Pos 3)
                  ============================================================= */}
              <div
                className="pointer-events-none absolute top-[46%] left-2 sm:left-10 z-10 select-none anim-cloud-slow"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 180 110"
                  className="h-20 w-32 sm:h-24 sm:w-40 drop-shadow-[0_10px_20px_rgba(14,165,233,0.4)]"
                >
                  <defs>
                    <linearGradient id="fluffyCloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E0F2FE" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M42 74 C24 74 14 62 14 48 C14 35 24 25 37 24 C43 10 58 2 76 2 C98 2 115 16 119 35 C123 33 128 32 133 32 C149 32 162 44 162 59 C162 68 154 74 142 74 Z"
                    fill="url(#fluffyCloudGrad1)"
                  />
                  <g className="anim-rain-1">
                    <path d="M52 78 C52 78 46 88 46 92 C46 95.5 48.7 98 52 98 C55.3 98 58 95.5 58 92 C58 88 52 78 52 78 Z" fill="#E0F2FE" />
                  </g>
                  <g className="anim-rain-2">
                    <path d="M82 80 C82 80 76 90 76 94 C76 97.5 78.7 100 82 100 C85.3 100 88 97.5 88 94 C88 90 82 80 82 80 Z" fill="#BAE6FD" />
                  </g>
                  <g className="anim-rain-3">
                    <path d="M112 78 C112 78 106 88 106 92 C106 95.5 108.7 98 112 98 C115.3 98 118 95.5 118 92 C118 88 112 78 112 78 Z" fill="#E0F2FE" />
                  </g>
                </svg>
              </div>

              {/* Awan Kondensasi & Hujan Interaktif di Zona Tengah Atmosfer (Sebelah Kanan Pos 3) */}
              <div
                onClick={() => {
                  setStarCount((prev) => prev + 10);
                  showToast('🌧️✨ Eksperimen Kondensasi di Zona Atmosfer: Uap air mendingin menjadi awan & titik hujan! (+10 ⭐)');
                }}
                title="Klik untuk melihat simulasi Kondensasi & Hujan!"
                className="absolute top-[48%] right-2 sm:right-8 z-20 cursor-pointer select-none anim-cloud-reverse group"
              >
                <div className="relative flex flex-col items-center">
                  <span className="mb-1 rounded-full bg-slate-900/95 border border-[#38BDF8] px-2.5 py-0.5 text-[10px] font-extrabold text-sky-200 shadow-md backdrop-blur-sm group-hover:bg-[#FACC15] group-hover:text-[#0F172A] transition-colors">
                    💧 Animasi Kondensasi &amp; Hujan
                  </span>
                  <svg
                    viewBox="0 0 210 135"
                    className="h-28 w-44 sm:h-32 sm:w-52 drop-shadow-[0_14px_26px_rgba(14,165,233,0.5)]"
                  >
                    <defs>
                      <linearGradient id="condensationCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="65%" stopColor="#E0F2FE" />
                        <stop offset="100%" stopColor="#BAE6FD" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M46 82 C26 82 12 69 12 52 C12 37 24 25 39 24 C47 9 64 0 85 0 C111 0 132 16 137 38 C143 35 149 34 156 34 C175 34 190 48 190 65 C190 75 180 82 166 82 Z"
                      fill="url(#condensationCloudGrad)"
                    />
                    <ellipse cx="78" cy="30" rx="28" ry="12" fill="#FFFFFF" opacity="0.85" />
                    <g className="anim-rain-1">
                      <path d="M48 86 C48 86 41 98 41 103 C41 107 44.1 110 48 110 C51.9 110 55 107 55 103 C55 98 48 86 48 86 Z" fill="#E0F2FE" />
                      <circle cx="46" cy="102" r="2" fill="#FFFFFF" />
                    </g>
                    <g className="anim-rain-2">
                      <path d="M82 88 C82 88 75 100 75 105 C75 109 78.1 112 82 112 C85.9 112 89 109 89 105 C89 100 82 88 82 88 Z" fill="#BAE6FD" />
                      <circle cx="80" cy="104" r="2" fill="#FFFFFF" />
                    </g>
                    <g className="anim-rain-3">
                      <path d="M116 86 C116 86 109 98 109 103 C109 107 112.1 110 116 110 C119.9 110 123 107 123 103 C123 98 116 86 116 86 Z" fill="#E0F2FE" />
                      <circle cx="114" cy="102" r="2" fill="#FFFFFF" />
                    </g>
                    <g className="anim-rain-4">
                      <path d="M148 88 C148 88 141 100 141 105 C141 109 144.1 112 148 112 C151.9 112 155 109 155 105 C155 100 148 88 148 88 Z" fill="#BAE6FD" />
                      <circle cx="146" cy="104" r="2" fill="#FFFFFF" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* =============================================================
                  ZONA 1 (DASAR PETA - PALING BAWAH): PERMUKAAN BUMI HIJAU & EKOSISTEM
                  Bukit Rumput Hijau, Pepohonan Rindang, Sungai Biru, & Flora/Fauna
                  ============================================================= */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none overflow-hidden"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 900 260"
                  preserveAspectRatio="none"
                  className="h-56 sm:h-64 w-full"
                >
                  <defs>
                    <linearGradient id="earthHillBack" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="earthHillFront" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="earthRiverStream" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                  </defs>
                  {/* Perbukitan Hijau Belakang */}
                  <path
                    d="M0 110 Q180 40 380 95 T760 75 Q840 65 900 95 L900 260 L0 260 Z"
                    fill="url(#earthHillBack)"
                    opacity="0.92"
                  />
                  {/* Perbukitan Rumput Hijau Depan */}
                  <path
                    d="M0 150 Q220 95 450 145 T900 125 L900 260 L0 260 Z"
                    fill="url(#earthHillFront)"
                  />
                  {/* Aliran Sungai Ekosistem Bumi */}
                  <path
                    d="M420 145 C470 175 390 210 460 260 L545 260 C485 210 540 175 485 145 Z"
                    fill="url(#earthRiverStream)"
                    opacity="0.85"
                  />
                  {/* Siluet Pohon Ekosistem Kiri */}
                  <g transform="translate(55, 58)">
                    <rect x="28" y="55" width="12" height="42" rx="4" fill="#78350F" />
                    <circle cx="34" cy="40" r="28" fill="#059669" />
                    <circle cx="18" cy="50" r="20" fill="#10B981" />
                    <circle cx="50" cy="50" r="20" fill="#34D399" />
                  </g>
                  <g transform="translate(135, 82) scale(0.82)">
                    <rect x="28" y="55" width="12" height="42" rx="4" fill="#78350F" />
                    <circle cx="34" cy="40" r="28" fill="#10B981" />
                    <circle cx="18" cy="50" r="20" fill="#34D399" />
                    <circle cx="50" cy="50" r="20" fill="#6EE7B7" />
                  </g>
                  {/* Siluet Pohon Ekosistem Kanan */}
                  <g transform="translate(760, 52)">
                    <rect x="28" y="55" width="12" height="44" rx="4" fill="#78350F" />
                    <circle cx="34" cy="40" r="28" fill="#059669" />
                    <circle cx="18" cy="50" r="20" fill="#10B981" />
                    <circle cx="50" cy="50" r="20" fill="#34D399" />
                  </g>
                  <g transform="translate(685, 86) scale(0.78)">
                    <rect x="28" y="55" width="12" height="42" rx="4" fill="#78350F" />
                    <circle cx="34" cy="40" r="28" fill="#10B981" />
                    <circle cx="18" cy="50" r="20" fill="#34D399" />
                    <circle cx="50" cy="50" r="20" fill="#6EE7B7" />
                  </g>
                </svg>
              </div>

              {/* =============================================================
                  HEADER INSTRUKSI PETA & INDIKATOR GRADASI BUMI -> ANTARIKSA (COSMIC DARK GLASS)
                  ============================================================= */}
              <div
                className="relative z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-400/45 bg-slate-900/85 px-4 py-3 text-white shadow-[0_10px_24px_rgba(2,6,23,0.55),inset_0_2px_4px_rgba(255,255,255,0.14)] backdrop-blur-md"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)', color: '#FFFFFF' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3 w-3 rounded-full bg-[#38BDF8] animate-ping" />
                  <span className="text-xs sm:text-sm font-extrabold tracking-wide text-white">
                    Perjalanan Vertikal Bumi ke Antariksa (Mulai dari Pos 1 di Dasar Bumi ➔ Pos 5 di Puncak Galaksi)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-extrabold text-sky-100">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-300/50" />{' '}
                    Selesai
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15] ring-2 ring-amber-300/60" />{' '}
                    Aktif (Pos 3)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Terkunci
                  </span>
                </div>
              </div>

              {/* Badge Penanda Puncak Galaksi (Top Zone Indicator) */}
              <div className="relative z-10 mt-5 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-400/60 bg-indigo-950/90 px-4 py-1.5 text-xs font-extrabold text-[#FACC15] shadow-lg backdrop-blur-md">
                  🪐 PUNCAK PETA: ZONA LUAR ANGKASA &amp; TATA SURYA (POS 5 &amp; POS 4) ✨
                </span>
              </div>

              {/* =============================================================
                  JALUR BERKELOK VERTIKAL (DASHED TRACK DARI BAWAH KE ATAS)
                  ============================================================= */}
              <svg
                viewBox="0 0 440 1050"
                className="pointer-events-none absolute inset-x-0 top-32 mx-auto h-[1020px] w-full max-w-[420px] opacity-90"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 220 990 C 140 900, 120 810, 175 720 C 235 620, 330 560, 275 450 C 220 340, 120 270, 185 170 C 225 110, 250 75, 240 40"
                  stroke="rgba(255, 255, 255, 0.24)"
                  strokeWidth="44"
                  strokeLinecap="round"
                />
                <path
                  d="M 220 990 C 140 900, 120 810, 175 720 C 235 620, 330 560, 275 450 C 220 340, 120 270, 185 170 C 225 110, 250 75, 240 40"
                  stroke="url(#bottomToTopRoadGrad)"
                  strokeWidth="30"
                  strokeLinecap="round"
                />
                <path
                  d="M 220 990 C 140 900, 120 810, 175 720 C 235 620, 330 560, 275 450 C 220 340, 120 270, 185 170 C 225 110, 250 75, 240 40"
                  stroke="#FACC15"
                  strokeWidth="4.5"
                  strokeDasharray="12 14"
                  strokeLinecap="round"
                  opacity="0.95"
                />
                <defs>
                  <linearGradient id="bottomToTopRoadGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="45%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* =============================================================
                  RANGKAIAN ELEMEN POS DARI BAWAH KE ATAS (flex-col-reverse):
                  - Elemen #1 di array (Pos 1: Anatomi Tubuh) dirender PALING BAWAH (Dasar Bumi)
                  - Elemen #2 di array (Pos 2: Dunia Tumbuhan) dirender di atas Pos 1
                  - Elemen #3 di array (Pos 3: Siklus Air, Kondensasi Awan & Hujan) dirender di TENGAH
                    bersama Karakter 3D Kadet Minton & Kadet Foxy + animasi awan/hujan
                  - Elemen #4 di array (Pos 4: Energi Panas & Wujud Benda) dirender di atas Pos 3
                  - Elemen #5 di array (Pos 5: Tata Surya & Gravitasi) dirender PALING ATAS (Puncak Galaksi)
                  ============================================================= */}
              <div className="relative z-10 mt-6 flex flex-col-reverse items-center gap-10 pb-8">
                {filteredNodes.map((node) => {
                  const isCompleted = node.status === 'completed';
                  const isActive = node.status === 'active';
                  const isAtmosphereCenter = node.id === 3;
                  const isPos1 = node.id === 1;
                  const isPos2 = node.id === 2;
                  const isPos3 = node.id === 3;
                  const isPos4 = node.id === 4;
                  const isPos5 = node.id === 5;
                  const isClayPos = isPos1 || isPos2 || isPos3 || isPos4 || isPos5;
                  const isCardOpen = hoveredNodeId === node.id || expandedNodeId === node.id;

                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId((prev) => (prev === node.id ? null : prev))}
                      className={`group/posnode relative flex flex-col items-center transition-transform ${node.offsetClass}`}
                    >
                      {/* Badge Zona Lingkungan di Atas Setiap Node (Cosmic Dark Glass) */}
                      <span
                        className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-extrabold tracking-wide shadow-md backdrop-blur-md border ${
                          node.id <= 2
                            ? 'bg-slate-900/90 border-emerald-400/55 text-emerald-300'
                            : node.id === 3
                            ? 'bg-slate-900/90 border-sky-400/60 text-sky-200'
                            : 'bg-slate-900/90 border-indigo-400/60 text-[#FACC15]'
                        }`}
                      >
                        {node.zoneLabel}
                      </span>

                      {/* KHUSUS POS 3 (TENGAH ATMOSFER): TAMPILKAN KARAKTER 3D KADET MINTON & KADET FOXY + ANIMASI AWAN/HUJAN */}
                      {isAtmosphereCenter && (
                        <div className="relative z-20 mb-3 flex flex-col items-center">
                          {/* Awan Hujan Mini Mengambang di Samping Kadet */}
                          <div
                            className="pointer-events-none absolute -top-4 -left-16 sm:-left-24 z-20 select-none anim-cloud-slow"
                            aria-hidden="true"
                          >
                            <svg viewBox="0 0 110 80" className="h-14 w-20 sm:h-16 sm:w-24 drop-shadow-md">
                              <path
                                d="M24 46 C14 46 8 39 8 30 C8 22 14 16 22 15 C26 6 36 1 48 1 C62 1 72 10 75 22 C78 21 81 20 84 20 C94 20 102 28 102 37 C102 42 96 46 88 46 Z"
                                fill="#FFFFFF"
                                opacity="0.95"
                              />
                              <g className="anim-rain-1">
                                <circle cx="34" cy="54" r="2.8" fill="#38BDF8" />
                              </g>
                              <g className="anim-rain-2">
                                <circle cx="54" cy="56" r="3" fill="#0EA5E9" />
                              </g>
                              <g className="anim-rain-3">
                                <circle cx="74" cy="54" r="2.8" fill="#38BDF8" />
                              </g>
                            </svg>
                          </div>

                          <div className="mb-2 inline-flex items-center gap-2 rounded-2xl border-2 border-[#FACC15] bg-white px-4 py-1 text-xs font-black uppercase tracking-wider text-[#0F172A] shadow-xl animate-bounce">
                            <span>🌧️ POS AKTIF: MULAI MISI SIKLUS AIR! 👇</span>
                          </div>

                          <div
                            onClick={() => handleNodeClick(node)}
                            title="Klik untuk memulai misi Pos 3 bersama Kadet Minton & Kadet Foxy!"
                            className="group relative flex items-center justify-center cursor-pointer select-none anim-cadet-3d"
                          >
                            <div className="pointer-events-none absolute -inset-5 rounded-full bg-gradient-to-tr from-[#FACC15]/55 via-[#38BDF8]/50 to-white/40 blur-2xl animate-pulse" />

                            <svg
                              viewBox="0 0 320 240"
                              className="relative z-10 h-36 w-52 sm:h-44 sm:w-64 drop-shadow-[0_16px_28px_rgba(15,23,42,0.55)] transition-transform duration-300 group-hover:scale-105"
                            >
                              <defs>
                                <radialGradient id="cadetSkin3D" cx="38%" cy="32%" r="70%">
                                  <stop offset="0%" stopColor="#FFF1E6" />
                                  <stop offset="55%" stopColor="#FCD5B5" />
                                  <stop offset="100%" stopColor="#E6A97E" />
                                </radialGradient>
                                <radialGradient id="helmetBubbleGlass3D" cx="30%" cy="25%" r="75%">
                                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                                  <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.16" />
                                  <stop offset="78%" stopColor="#A855F7" stopOpacity="0.28" />
                                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6" />
                                </radialGradient>
                                <radialGradient id="magicStar3D" cx="35%" cy="30%" r="70%">
                                  <stop offset="0%" stopColor="#FFFBEB" />
                                  <stop offset="40%" stopColor="#FDE047" />
                                  <stop offset="80%" stopColor="#F59E0B" />
                                  <stop offset="100%" stopColor="#D97706" />
                                </radialGradient>
                                <linearGradient id="spacesuitBody3D" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FFFFFF" />
                                  <stop offset="65%" stopColor="#E2E8F0" />
                                  <stop offset="100%" stopColor="#94A3B8" />
                                </linearGradient>
                                <radialGradient id="foxFurCompanion3D" cx="35%" cy="30%" r="70%">
                                  <stop offset="0%" stopColor="#FDBA74" />
                                  <stop offset="55%" stopColor="#F97316" />
                                  <stop offset="100%" stopColor="#C2410C" />
                                </radialGradient>
                              </defs>

                              <ellipse cx="155" cy="222" rx="96" ry="11" fill="#090D16" opacity="0.45" />

                              {/* Pendamping Kanan: Maskot Rubah Kadet Foxy 3D */}
                              <g transform="translate(192, 62) scale(0.62)">
                                <path d="M138 158 C170 156 185 134 176 116 C168 102 150 112 140 128 Z" fill="url(#foxFurCompanion3D)" />
                                <circle cx="173" cy="120" r="9" fill="#FFF7ED" />
                                <rect x="64" y="124" width="76" height="60" rx="26" fill="url(#spacesuitBody3D)" stroke="#CBD5E1" strokeWidth="3" />
                                <rect x="84" y="138" width="36" height="18" rx="5" fill="#312E81" />
                                <path d="M60 62 C50 34 64 26 82 42 Z" fill="url(#foxFurCompanion3D)" />
                                <path d="M144 62 C154 34 140 26 122 42 Z" fill="url(#foxFurCompanion3D)" />
                                <ellipse cx="102" cy="80" rx="44" ry="38" fill="url(#foxFurCompanion3D)" />
                                <path d="M62 86 C72 72 88 80 102 92 C116 80 132 72 142 86 C138 106 122 116 102 116 C82 116 66 106 62 86 Z" fill="#FFF7ED" />
                                <circle cx="82" cy="78" r="7" fill="#1E1B4B" />
                                <circle cx="80" cy="75" r="2.5" fill="#FFFFFF" />
                                <circle cx="122" cy="78" r="7" fill="#1E1B4B" />
                                <circle cx="120" cy="75" r="2.5" fill="#FFFFFF" />
                                <ellipse cx="102" cy="89" rx="5" ry="3.8" fill="#1E1B4B" />
                                <path d="M95 96 Q102 103 109 96" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                <circle cx="102" cy="76" r="54" fill="url(#helmetBubbleGlass3D)" stroke="#BAE6FD" strokeWidth="2.5" />
                                <path d="M64 50 A44 44 0 0 1 110 30" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.65" />
                              </g>

                              {/* Karakter Utama: Kadet Astronot Cilik 3D Ceria Memegang Bintang Ajaib */}
                              <rect x="82" y="118" width="88" height="68" rx="18" fill="#4F46E5" stroke="#818CF8" strokeWidth="2.5" />
                              <rect x="98" y="182" width="22" height="30" rx="10" fill="url(#spacesuitBody3D)" stroke="#94A3B8" strokeWidth="2" />
                              <rect x="132" y="182" width="22" height="30" rx="10" fill="url(#spacesuitBody3D)" stroke="#94A3B8" strokeWidth="2" />
                              <ellipse cx="109" cy="212" rx="14" ry="7" fill="#6366F1" />
                              <ellipse cx="143" cy="212" rx="14" ry="7" fill="#6366F1" />
                              <rect x="86" y="126" width="80" height="66" rx="28" fill="url(#spacesuitBody3D)" stroke="#CBD5E1" strokeWidth="2.5" />
                              <ellipse cx="126" cy="130" rx="38" ry="10" fill="#6366F1" />
                              <rect x="104" y="142" width="44" height="24" rx="7" fill="#1E1B4B" stroke="#A5B4FC" strokeWidth="1.8" />
                              <circle cx="116" cy="154" r="4" fill="#34D399" />
                              <circle cx="127" cy="154" r="4" fill="#FBBF24" />
                              <circle cx="138" cy="154" r="4" fill="#F472B6" />
                              <rect x="88" y="172" width="76" height="10" rx="5" fill="#4338CA" />
                              <rect x="116" y="169" width="20" height="16" rx="4" fill="#FACC15" />
                              <path d="M88 138 C64 132 52 114 58 98 C62 88 74 92 78 104 L94 130 Z" fill="url(#spacesuitBody3D)" stroke="#CBD5E1" strokeWidth="2" />
                              <circle cx="58" cy="96" r="10" fill="#6366F1" />
                              <path d="M164 138 C182 144 192 156 184 168 C178 176 166 170 158 156 Z" fill="url(#spacesuitBody3D)" stroke="#CBD5E1" strokeWidth="2" />
                              <circle cx="126" cy="80" r="42" fill="url(#cadetSkin3D)" />
                              <circle cx="84" cy="82" r="8" fill="#FCD5B5" />
                              <circle cx="168" cy="82" r="8" fill="#FCD5B5" />
                              <path d="M86 72 C88 42 112 32 136 36 C156 38 168 54 166 72 C156 58 142 54 128 56 C114 58 98 54 86 72 Z" fill="#451A03" />
                              <path d="M114 38 C122 26 138 26 144 36 C134 36 124 38 114 38 Z" fill="#78350F" />
                              <ellipse cx="109" cy="80" rx="7.5" ry="8.5" fill="#1E1B4B" />
                              <circle cx="106.5" cy="76.5" r="3.2" fill="#FFFFFF" />
                              <circle cx="111.5" cy="83" r="1.5" fill="#38BDF8" />
                              <ellipse cx="143" cy="80" rx="7.5" ry="8.5" fill="#1E1B4B" />
                              <circle cx="140.5" cy="76.5" r="3.2" fill="#FFFFFF" />
                              <circle cx="145.5" cy="83" r="1.5" fill="#38BDF8" />
                              <path d="M100 67 Q109 62 117 67" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                              <path d="M135 67 Q143 62 152 67" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                              <ellipse cx="97" cy="90" rx="7" ry="4" fill="#FB7185" opacity="0.55" />
                              <ellipse cx="155" cy="90" rx="7" ry="4" fill="#FB7185" opacity="0.55" />
                              <ellipse cx="126" cy="86" rx="3.5" ry="2.5" fill="#E6A97E" />
                              <path d="M113 94 Q126 107 139 94 Z" fill="#E11D48" />
                              <path d="M116 95 Q126 99 136 95" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                              <circle cx="126" cy="78" r="55" fill="url(#helmetBubbleGlass3D)" stroke="#BAE6FD" strokeWidth="3" />
                              <path d="M84 52 A46 46 0 0 1 138 29" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.75" />
                              <g transform="translate(18, 42)">
                                <circle cx="36" cy="40" r="30" fill="#FDE047" opacity="0.32" />
                                <path
                                  d="M36 8 L44.5 26.5 L64.5 29 L49.8 43 L53.5 63 L36 53.2 L18.5 63 L22.2 43 L7.5 29 L27.5 26.5 Z"
                                  fill="url(#magicStar3D)"
                                  stroke="#FEF08A"
                                  strokeWidth="2.5"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>

                            <span className="absolute -bottom-2 rounded-full border-2 border-[#FACC15] bg-[#0F172A]/95 px-3.5 py-1 text-[11px] font-extrabold text-[#FACC15] shadow-lg">
                              🧑‍🚀 Kadet Minton &amp; Kadet Foxy di Pos 3 (Atmosfer) 🌧️
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Tombol Node Pos Persegi Claymorphism 3D (Node Trigger: Hover atau Klik untuk menampilkan Kartu Penjelasan Besar) */}
                      <button
                        type="button"
                        onClick={() => handleNodeTrigger(node)}
                        aria-expanded={isCardOpen}
                        aria-label={node.title}
                        title="Arahkan kursor (hover) atau klik untuk membuka detail materi & ilustrasi 3D"
                        className={`group relative flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer select-none active:translate-y-1 ${
                          isPos1
                            ? 'h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-b from-[#A7F3D0] via-[#34D399] to-[#059669] border-2 border-white/85 text-white ring-4 ring-emerald-200/50 shadow-[0_16px_32px_rgba(6,78,59,0.55),0_6px_12px_rgba(16,185,129,0.45),inset_0_4px_8px_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(4,120,87,0.6)] hover:scale-105'
                            : isPos2
                            ? 'h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-b from-[#D9F99D] via-[#4ADE80] to-[#059669] border-2 border-white/85 text-white ring-4 ring-lime-200/50 shadow-[0_16px_32px_rgba(6,78,59,0.55),0_6px_12px_rgba(34,197,94,0.45),inset_0_4px_8px_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(21,128,61,0.6)] hover:scale-105'
                            : isPos3
                            ? 'h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-b from-[#E0F2FE] via-[#38BDF8] to-[#0284C7] border-2 border-white/95 text-white ring-8 ring-[#FACC15]/55 shadow-[0_18px_36px_rgba(2,132,199,0.6),0_8px_18px_rgba(250,204,21,0.5),inset_0_5px_10px_rgba(255,255,255,0.95),inset_0_-6px_12px_rgba(3,105,161,0.65)] hover:scale-105'
                            : isPos4
                            ? 'h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-b from-[#FEF3C7] via-[#FB923C] to-[#EA580C] border-2 border-white/90 text-white ring-4 ring-amber-300/50 shadow-[0_16px_32px_rgba(154,52,18,0.6),0_6px_14px_rgba(251,146,60,0.45),inset_0_4px_8px_rgba(255,255,255,0.92),inset_0_-6px_12px_rgba(194,65,12,0.65)] hover:scale-105'
                            : isPos5
                            ? 'h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-b from-[#4338CA] via-[#1E1B4B] to-[#0F172A] border-2 border-indigo-200/90 text-white ring-4 ring-[#FACC15]/50 shadow-[0_18px_36px_rgba(15,23,42,0.85),0_6px_16px_rgba(99,102,241,0.55),inset_0_4px_8px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(15,23,42,0.9)] hover:scale-105'
                            : `h-20 w-20 sm:h-24 sm:w-24 rounded-full active:border-b-0 ${
                                isActive
                                  ? 'bg-gradient-to-b from-[#FACC15] via-amber-400 to-[#F59E0B] border-b-[7px] border-amber-700 text-[#0F172A] ring-8 ring-white/55 shadow-[0_14px_32px_rgba(250,204,21,0.75)] hover:scale-105'
                                  : isCompleted
                                  ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-b-[7px] border-emerald-800 text-white ring-4 ring-emerald-200/40 shadow-[0_10px_24px_rgba(16,185,129,0.55)] hover:scale-105'
                                  : 'bg-gradient-to-b from-slate-200 to-slate-300 border-b-[7px] border-slate-500 text-slate-700 ring-4 ring-white/25 shadow-lg hover:scale-105'
                              }`
                        }`}
                      >
                        <span
                          className={`pointer-events-none absolute inset-1.5 ${
                            isClayPos
                              ? 'rounded-[20px] border-2 border-white/65 shadow-[inset_0_2px_4px_rgba(255,255,255,0.75)]'
                              : 'rounded-full border-2 border-white/45'
                          }`}
                        />

                        {/* Ikon Utama Pos: Pos 1 (Anatomi 3D), Pos 2 (Flora & Fauna 3D), Pos 3 (Awan & Siklus Air 3D), Pos 4 (Api & Panci Kalor 3D), Pos 5 (Tata Surya & Saturnus 3D) */}
                        {isPos1 ? (
                          <svg
                            viewBox="0 0 100 100"
                            className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_6px_10px_rgba(6,78,59,0.45)]"
                            aria-hidden="true"
                          >
                            <defs>
                              <radialGradient id="claySkinBtnPos1" cx="35%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#FFF1E6" />
                                <stop offset="55%" stopColor="#FDBA8C" />
                                <stop offset="100%" stopColor="#F97316" />
                              </radialGradient>
                              <radialGradient id="clayBrainBtnPos1" cx="35%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#FCE7F3" />
                                <stop offset="55%" stopColor="#F472B6" />
                                <stop offset="100%" stopColor="#DB2777" />
                              </radialGradient>
                              <radialGradient id="clayLungBtnPos1" cx="30%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#FFE4E6" />
                                <stop offset="55%" stopColor="#FB7185" />
                                <stop offset="100%" stopColor="#E11D48" />
                              </radialGradient>
                              <radialGradient id="clayStomachBtnPos1" cx="35%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#FEF9C3" />
                                <stop offset="60%" stopColor="#FACC15" />
                                <stop offset="100%" stopColor="#D97706" />
                              </radialGradient>
                              <radialGradient id="clayGutBtnPos1" cx="35%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#D1FAE5" />
                                <stop offset="55%" stopColor="#34D399" />
                                <stop offset="100%" stopColor="#059669" />
                              </radialGradient>
                            </defs>
                            {/* Siluet Tubuh 3D Clay Bulat */}
                            <circle cx="50" cy="22" r="15" fill="url(#claySkinBtnPos1)" />
                            <path
                              d="M26 44 C26 37 35 35 50 35 C65 35 74 37 74 44 L76 68 C76 73 71 76 67 74 L65 52 L63 88 C63 93 55 93 54 88 L50 72 L46 88 C45 93 37 93 37 88 L35 52 L33 74 C29 76 24 73 24 68 Z"
                              fill="url(#claySkinBtnPos1)"
                            />
                            {/* Inner Highlight Siluet Tubuh */}
                            <path d="M40 12 A12 12 0 0 1 58 12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
                            {/* Otak 3D Clay (Separuh Kanan Kepala) */}
                            <path d="M50 11 C58 11 62 16 62 21 C62 26 58 29 50 29 Z" fill="url(#clayBrainBtnPos1)" />
                            <path d="M53 14 C57 14 59 17 59 19" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85" />
                            {/* Mata Ramah Anak (Separuh Kiri Kepala) */}
                            <circle cx="44" cy="21" r="2.3" fill="#0F172A" />
                            <circle cx="43.3" cy="20.2" r="0.9" fill="#FFFFFF" />
                            {/* Trakea Biru Pastel */}
                            <rect x="48" y="30" width="4" height="12" rx="2" fill="#38BDF8" />
                            {/* Paru-Paru Kiri & Kanan 3D Clay */}
                            <path d="M47 41 C41 41 37 46 37 53 C37 58 42 60 47 58 Z" fill="url(#clayLungBtnPos1)" />
                            <path d="M53 41 C59 41 63 46 63 53 C63 58 58 60 53 58 Z" fill="url(#clayLungBtnPos1)" />
                            <path d="M40 45 C41 43 44 43 45 44" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
                            <path d="M55 44 C57 43 59 43 60 45" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
                            {/* Jantung 3D Clay */}
                            <circle cx="51" cy="51" r="4.2" fill="#E11D48" />
                            <circle cx="49.8" cy="49.8" r="1.3" fill="#FFE4E6" />
                            {/* Hati & Lambung 3D Clay */}
                            <ellipse cx="44" cy="63" rx="6" ry="4" fill="#F97316" />
                            <ellipse cx="55" cy="63" rx="6" ry="4.2" fill="url(#clayStomachBtnPos1)" />
                            <path d="M52 61.5 Q55 60.5 58 62" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
                            {/* Usus 3D Clay */}
                            <rect x="40" y="68" width="20" height="10" rx="5" fill="url(#clayGutBtnPos1)" />
                            <path d="M43 70.5 L57 70.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                          </svg>
                        ) : isPos2 ? (
                          <svg
                            viewBox="0 0 100 100"
                            className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_6px_10px_rgba(6,78,59,0.45)]"
                            aria-hidden="true"
                          >
                            <defs>
                              <radialGradient id="claySproutBtnPos2" cx="30%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#F7FEE7" />
                                <stop offset="50%" stopColor="#84CC16" />
                                <stop offset="100%" stopColor="#15803D" />
                              </radialGradient>
                              <radialGradient id="clayEleBtnPos2" cx="35%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#F8FAFC" />
                                <stop offset="55%" stopColor="#94A3B8" />
                                <stop offset="100%" stopColor="#475569" />
                              </radialGradient>
                              <radialGradient id="clayEarPinkBtnPos2" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#FCE7F3" />
                                <stop offset="60%" stopColor="#F472B6" />
                                <stop offset="100%" stopColor="#DB2777" />
                              </radialGradient>
                              <radialGradient id="clayChickBtnPos2" cx="35%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#FEFCE8" />
                                <stop offset="55%" stopColor="#FACC15" />
                                <stop offset="100%" stopColor="#D97706" />
                              </radialGradient>
                              <radialGradient id="claySoilBtnPos2" cx="40%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#D6D3D1" />
                                <stop offset="45%" stopColor="#92400E" />
                                <stop offset="100%" stopColor="#451A03" />
                              </radialGradient>
                            </defs>
                            {/* Tanah Subur 3D Clay di Dasar */}
                            <ellipse cx="32" cy="84" rx="20" ry="7" fill="url(#claySoilBtnPos2)" />
                            {/* Batang & Tunas Hijau Segar 3D Clay (Kiri) */}
                            <path d="M32 82 C32 64 33 48 35 34" stroke="#65A30D" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                            <path d="M34 48 C18 46 10 34 14 22 C24 22 34 32 34 48 Z" fill="url(#claySproutBtnPos2)" />
                            <path d="M35 38 C49 34 56 22 50 12 C40 14 34 24 35 38 Z" fill="url(#claySproutBtnPos2)" />
                            <path d="M17 26 C22 25 28 30 31 38" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.88" />
                            <path d="M47 16 C43 18 39 24 37 31" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.88" />
                            {/* Anak Ayam Kuning 3D Clay di Atas Kepala Gajah */}
                            <circle cx="67" cy="27" r="9.5" fill="url(#clayChickBtnPos2)" />
                            <path d="M63 20 A7 7 0 0 1 72 20" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9" />
                            <circle cx="64.5" cy="26.5" r="1.6" fill="#0F172A" />
                            <circle cx="70" cy="26.5" r="1.6" fill="#0F172A" />
                            <polygon points="66,28 69,28 67.5,31" fill="#EA580C" />
                            {/* Bayi Gajah Imut 3D Clay (Kanan) */}
                            <ellipse cx="47" cy="58" rx="11" ry="14" fill="url(#clayEleBtnPos2)" />
                            <ellipse cx="48" cy="59" rx="7" ry="9.5" fill="url(#clayEarPinkBtnPos2)" />
                            <ellipse cx="85" cy="58" rx="11" ry="14" fill="url(#clayEleBtnPos2)" />
                            <ellipse cx="84" cy="59" rx="7" ry="9.5" fill="url(#clayEarPinkBtnPos2)" />
                            <circle cx="66" cy="57" r="17" fill="url(#clayEleBtnPos2)" />
                            <path d="M56 45 A13 13 0 0 1 76 45" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
                            <circle cx="59.5" cy="56" r="3.2" fill="#0F172A" />
                            <circle cx="58.5" cy="54.8" r="1.2" fill="#FFFFFF" />
                            <circle cx="72.5" cy="56" r="3.2" fill="#0F172A" />
                            <circle cx="71.5" cy="54.8" r="1.2" fill="#FFFFFF" />
                            <ellipse cx="55.5" cy="61.5" rx="3" ry="1.8" fill="#FB7185" opacity="0.65" />
                            <ellipse cx="76.5" cy="61.5" rx="3" ry="1.8" fill="#FB7185" opacity="0.65" />
                            {/* Belalai Gajah 3D Clay */}
                            <path d="M63 60 C63 72 68 77 73 74 C76 72 75 68 72 69" stroke="url(#clayEleBtnPos2)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                            <path d="M64 62 C64 70 68 74 72 72" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                          </svg>
                        ) : isPos3 ? (
                          <svg
                            viewBox="0 0 100 100"
                            className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_6px_12px_rgba(3,105,161,0.5)]"
                            aria-hidden="true"
                          >
                            <defs>
                              <radialGradient id="clayCloudPuffBtnPos3" cx="62%" cy="28%" r="72%">
                                <stop offset="0%" stopColor="#FFFDF9" />
                                <stop offset="45%" stopColor="#F0F9FF" />
                                <stop offset="80%" stopColor="#BAE6FD" />
                                <stop offset="100%" stopColor="#7DD3FC" />
                              </radialGradient>
                              <radialGradient id="claySunBtnPos3" cx="35%" cy="28%" r="70%">
                                <stop offset="0%" stopColor="#FEFCE8" />
                                <stop offset="50%" stopColor="#FACC15" />
                                <stop offset="100%" stopColor="#EA580C" />
                              </radialGradient>
                              <radialGradient id="clayDropBtnPos3" cx="35%" cy="28%" r="70%">
                                <stop offset="0%" stopColor="#E0F2FE" />
                                <stop offset="50%" stopColor="#38BDF8" />
                                <stop offset="100%" stopColor="#0369A1" />
                              </radialGradient>
                            </defs>
                            {/* Panah Lingkaran Siklus Air */}
                            <path d="M22 66 A34 30 0 0 1 20 34" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <polygon points="17,36 24,36 21,29" fill="#FDE047" />
                            <path d="M78 34 A34 30 0 0 1 78 66" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <polygon points="75,64 82,64 78,71" fill="#E0F2FE" />
                            {/* Matahari 3D Clay di Kanan Atas */}
                            <circle cx="74" cy="24" r="11" fill="url(#claySunBtnPos3)" />
                            <path d="M68 17 A8 8 0 0 1 79 17" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85" />
                            {/* Awan Estetik 3D Bertekstur Bola-Bola Empuk (Gaya awan estetik.jpeg) */}
                            <circle cx="49" cy="36" r="15" fill="url(#clayCloudPuffBtnPos3)" />
                            <circle cx="34" cy="43" r="12" fill="url(#clayCloudPuffBtnPos3)" />
                            <circle cx="64" cy="44" r="11.5" fill="url(#clayCloudPuffBtnPos3)" />
                            <circle cx="24" cy="51" r="8.5" fill="url(#clayCloudPuffBtnPos3)" />
                            <circle cx="74" cy="51" r="8" fill="url(#clayCloudPuffBtnPos3)" />
                            <ellipse cx="49" cy="50" rx="22" ry="11" fill="url(#clayCloudPuffBtnPos3)" />
                            <circle cx="38" cy="52" r="9.5" fill="url(#clayCloudPuffBtnPos3)" />
                            <circle cx="61" cy="52" r="9" fill="url(#clayCloudPuffBtnPos3)" />
                            {/* Inner Highlight Putih Awan 3D */}
                            <path d="M39 26 A13 13 0 0 1 59 26" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95" />
                            <path d="M25 36 A10 10 0 0 1 39 33" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
                            {/* 3 Tetesan Hujan 3D Clay Timbul */}
                            <path d="M35 65 C35 65 30 74 30 78 C30 81 32.2 83 35 83 C37.8 83 40 81 40 78 C40 74 35 65 35 65 Z" fill="url(#clayDropBtnPos3)" />
                            <circle cx="33.5" cy="77" r="1.4" fill="#FFFFFF" opacity="0.9" />
                            <path d="M50 68 C50 68 45 77 45 81 C45 84 47.2 86 50 86 C52.8 86 55 84 55 81 C55 77 50 68 50 68 Z" fill="url(#clayDropBtnPos3)" />
                            <circle cx="48.5" cy="80" r="1.4" fill="#FFFFFF" opacity="0.9" />
                            <path d="M65 65 C65 65 60 74 60 78 C60 81 62.2 83 65 83 C67.8 83 70 81 70 78 C70 74 65 65 65 65 Z" fill="url(#clayDropBtnPos3)" />
                            <circle cx="63.5" cy="77" r="1.4" fill="#FFFFFF" opacity="0.9" />
                          </svg>
                        ) : isPos4 ? (
                          <svg
                            viewBox="0 0 100 100"
                            className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_6px_12px_rgba(124,45,18,0.55)]"
                            aria-hidden="true"
                          >
                            <defs>
                              <radialGradient id="clayPotBtnPos4" cx="32%" cy="25%" r="72%">
                                <stop offset="0%" stopColor="#FFEDD5" />
                                <stop offset="45%" stopColor="#FB923C" />
                                <stop offset="85%" stopColor="#EA580C" />
                                <stop offset="100%" stopColor="#9A3412" />
                              </radialGradient>
                              <radialGradient id="clayWaterBtnPos4" cx="35%" cy="25%" r="70%">
                                <stop offset="0%" stopColor="#E0F2FE" />
                                <stop offset="55%" stopColor="#38BDF8" />
                                <stop offset="100%" stopColor="#0284C7" />
                              </radialGradient>
                              <radialGradient id="clayFlameOuterBtnPos4" cx="50%" cy="65%" r="65%">
                                <stop offset="0%" stopColor="#FDE047" />
                                <stop offset="50%" stopColor="#F97316" />
                                <stop offset="100%" stopColor="#DC2626" />
                              </radialGradient>
                              <radialGradient id="clayFlameCoreBtnPos4" cx="50%" cy="70%" r="60%">
                                <stop offset="0%" stopColor="#FEFCE8" />
                                <stop offset="55%" stopColor="#FDE047" />
                                <stop offset="100%" stopColor="#F59E0B" />
                              </radialGradient>
                              <radialGradient id="clayWoodBtnPos4" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#D6D3D1" />
                                <stop offset="40%" stopColor="#92400E" />
                                <stop offset="100%" stopColor="#451A03" />
                              </radialGradient>
                            </defs>
                            {/* Uap Air Mendidih 3D Clay di Atas Panci */}
                            <circle cx="36" cy="14" r="4" fill="#FFFFFF" opacity="0.88" />
                            <circle cx="46" cy="11" r="5" fill="#FFFFFF" opacity="0.92" />
                            <circle cx="56" cy="14" r="3.8" fill="#FFFFFF" opacity="0.88" />
                            {/* Gagang Kiri & Kanan Panci 3D Clay */}
                            <rect x="13" y="29" width="9" height="6" rx="3" fill="#1E293B" />
                            <rect x="68" y="29" width="9" height="6" rx="3" fill="#1E293B" />
                            {/* Badan Panci Pemanas Air 3D Clay */}
                            <rect x="20" y="22" width="50" height="33" rx="10" fill="url(#clayPotBtnPos4)" />
                            <path d="M26 25 L64 25" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
                            {/* Jendela Cutaway Air Mendidih di Dalam Panci */}
                            <rect x="25" y="30" width="40" height="20" rx="6" fill="url(#clayWaterBtnPos4)" />
                            <path d="M27 34 Q35 31 45 34 T63 34" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9" />
                            <circle cx="35" cy="43" r="2.2" fill="#E0F2FE" opacity="0.9" />
                            <circle cx="46" cy="40" r="2.8" fill="#FFFFFF" opacity="0.95" />
                            <circle cx="55" cy="44" r="2" fill="#E0F2FE" opacity="0.9" />
                            {/* Kayu Bakar Menyilang 3D Clay di Dasar */}
                            <rect x="20" y="80" width="50" height="9" rx="4.5" transform="rotate(-10 45 84)" fill="url(#clayWoodBtnPos4)" />
                            <rect x="20" y="80" width="50" height="9" rx="4.5" transform="rotate(10 45 84)" fill="url(#clayWoodBtnPos4)" />
                            <circle cx="21" cy="79" r="3.5" fill="#FDE68A" />
                            <circle cx="69" cy="79" r="3.5" fill="#FDE68A" />
                            {/* Api Hangat Kartun 3D Berlapis di Bawah Panci */}
                            <path d="M28 80 C22 69 30 57 37 62 C39 51 51 51 53 62 C60 57 68 69 62 80 Z" fill="url(#clayFlameOuterBtnPos4)" />
                            <path d="M34 80 C31 71 38 62 45 55 C52 62 59 71 56 80 Z" fill="url(#clayFlameCoreBtnPos4)" />
                            <path d="M32 66 C34 61 38 58 42 56" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.88" />
                            {/* Termometer 3D Clay di Sisi Kanan */}
                            <rect x="80" y="20" width="8" height="44" rx="4" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="1.5" />
                            <circle cx="84" cy="64" r="6.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                            <rect x="82.2" y="27" width="3.6" height="34" rx="1.8" fill="#EF4444" />
                            <circle cx="82.5" cy="62.5" r="1.8" fill="#FFFFFF" opacity="0.9" />
                          </svg>
                        ) : isPos5 ? (
                          <svg
                            viewBox="0 0 100 100"
                            className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_6px_12px_rgba(15,23,42,0.75)]"
                            aria-hidden="true"
                          >
                            <defs>
                              <radialGradient id="claySunBtnPos5" cx="35%" cy="28%" r="70%">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="35%" stopColor="#FEF08A" />
                                <stop offset="75%" stopColor="#FACC15" />
                                <stop offset="100%" stopColor="#EA580C" />
                              </radialGradient>
                              <radialGradient id="claySaturnBtnPos5" cx="32%" cy="25%" r="72%">
                                <stop offset="0%" stopColor="#FEF3C7" />
                                <stop offset="45%" stopColor="#FDBA74" />
                                <stop offset="85%" stopColor="#D97706" />
                                <stop offset="100%" stopColor="#78350F" />
                              </radialGradient>
                              <linearGradient id="clayRingBtnPos5" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FDE68A" />
                                <stop offset="50%" stopColor="#C4B5FD" />
                                <stop offset="100%" stopColor="#38BDF8" />
                              </linearGradient>
                              <radialGradient id="clayEarthBtnPos5" cx="35%" cy="28%" r="70%">
                                <stop offset="0%" stopColor="#E0F2FE" />
                                <stop offset="50%" stopColor="#38BDF8" />
                                <stop offset="100%" stopColor="#0369A1" />
                              </radialGradient>
                              <radialGradient id="clayMarsBtnPos5" cx="35%" cy="28%" r="70%">
                                <stop offset="0%" stopColor="#FFE4E6" />
                                <stop offset="55%" stopColor="#FB7185" />
                                <stop offset="100%" stopColor="#BE123C" />
                              </radialGradient>
                            </defs>
                            {/* Jalur Orbit Melingkar Rapi */}
                            <ellipse cx="30" cy="34" rx="48" ry="34" fill="none" stroke="#818CF8" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.65" />
                            <ellipse cx="30" cy="34" rx="64" ry="48" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.55" />
                            {/* Bintang 3D Clay */}
                            <circle cx="76" cy="18" r="2.2" fill="#FDE047" />
                            <circle cx="18" cy="76" r="2" fill="#E0F2FE" />
                            {/* Matahari Emas Bersinar 3D Clay (Kiri Atas) */}
                            <circle cx="26" cy="28" r="16" fill="#FACC15" opacity="0.25" />
                            <circle cx="26" cy="28" r="12.5" fill="url(#claySunBtnPos5)" />
                            <path d="M19 20 A9 9 0 0 1 32 19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.92" />
                            {/* Planet Bumi 3D Clay di Jalur Orbit Dalam */}
                            <circle cx="66" cy="29" r="6.5" fill="url(#clayEarthBtnPos5)" />
                            <path d="M63 27 Q66 25 69 28 Q67 32 63 30 Z" fill="#34D399" />
                            <circle cx="64" cy="26.5" r="1.4" fill="#FFFFFF" opacity="0.9" />
                            {/* Planet Mars 3D Clay */}
                            <circle cx="26" cy="64" r="5.2" fill="url(#clayMarsBtnPos5)" />
                            <circle cx="24.5" cy="62.2" r="1.2" fill="#FFFFFF" opacity="0.9" />
                            {/* Planet Saturnus Bercincin 3D Clay (Fokus Utama Kanan Bawah) */}
                            <g transform="rotate(-18 62 64)">
                              {/* Cincin Belakang */}
                              <path d="M36 64 A26 8.5 0 0 1 88 64" fill="none" stroke="url(#clayRingBtnPos5)" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                              {/* Bola Planet Saturnus 3D Clay */}
                              <circle cx="62" cy="64" r="14" fill="url(#claySaturnBtnPos5)" />
                              {/* Sabuk Atmosfer Pastel Saturnus */}
                              <path d="M49 61 Q62 64 75 61" stroke="#FEF3C7" strokeWidth="2.2" fill="none" opacity="0.7" />
                              {/* Inner Highlight Putih Saturnus */}
                              <path d="M53 54 A11 11 0 0 1 71 54" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.92" />
                              {/* Cincin Depan Saturnus 3D Clay */}
                              <path d="M88 64 A26 8.5 0 0 1 36 64" fill="none" stroke="url(#clayRingBtnPos5)" strokeWidth="6" strokeLinecap="round" />
                              <path d="M84 65 A22 7 0 0 1 40 65" fill="none" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
                            </g>
                          </svg>
                        ) : (
                          <span className="text-3xl sm:text-4xl leading-none drop-shadow-sm select-none">
                            {node.nodeIcon}
                          </span>
                        )}

                        {/* Lencana Nomor Pos di Kanan Atas */}
                        <span
                          className={`absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-black shadow-sm tabular-nums ${
                            isActive
                              ? 'bg-[#0EA5E9] text-white'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isPos4
                              ? 'bg-orange-600 text-white'
                              : isPos5
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-600 text-white'
                          }`}
                        >
                          {node.id}
                        </span>

                        {/* Lencana Status di Kanan Bawah (✓ Selesai / ★ Aktif / 🔒 Terkunci) */}
                        <span
                          className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[11px] font-black shadow-sm ${
                            isActive
                              ? 'bg-amber-500 text-[#0F172A]'
                              : isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isPos4
                              ? 'bg-amber-600 text-white'
                              : isPos5
                              ? 'bg-indigo-900 text-[#FACC15]'
                              : 'bg-slate-700 text-white'
                          }`}
                        >
                          {isActive ? '★' : isCompleted ? '✓' : '🔒'}
                        </span>
                      </button>

                      {/* Lencana Mini Ringkas di Bawah Ikon Persegi (Bright Claymorphism) */}
                      <button
                        type="button"
                        onClick={() => handleNodeTrigger(node)}
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-2xl border-2 px-3.5 py-1 text-[11px] font-extrabold shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer ${
                          isPos3
                            ? 'bg-white border-[#FACC15] text-[#0F172A]'
                            : 'bg-white/95 border-white text-[#0F172A]'
                        }`}
                        style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                      >
                        <span>{node.title}</span>
                        <span
                          className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-black border ${
                            isPos3
                              ? 'bg-[#FACC15] border-amber-400 text-[#0F172A]'
                              : isPos4
                              ? 'bg-orange-100 border-orange-300 text-orange-900'
                              : isPos5
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-900'
                              : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          }`}
                        >
                          {isCardOpen ? '▲ Tutup' : '▼ Detail 3D'}
                        </span>
                      </button>

                      {/* WRAPPER TRANSISI HALUS (COLLAPSE DEFAULT -> FADE-IN & SLIDE-DOWN SAAT HOVER / KLIK NODE PERSEGI) */}
                      <div
                        aria-hidden={!isCardOpen}
                        className={`grid transition-all duration-300 ease-in-out ${
                          isCardOpen
                            ? 'grid-rows-[1fr] opacity-100 translate-y-0 scale-100 mt-2.5 pointer-events-auto'
                            : 'grid-rows-[0fr] opacity-0 -translate-y-3 scale-95 mt-0 pointer-events-none'
                        }`}
                      >
                        <div className="overflow-hidden p-1">
                          {/* Kartu Besar Penjelasan Materi, Sub-Topik & Panggung Ilustrasi Claymorphism 3D (Bright Claymorphism) */}
                          <div
                            className={`text-center backdrop-blur-xl border-4 transition-all duration-300 ease-in-out ${
                              isPos3
                                ? 'rounded-3xl p-4 max-w-[365px] sm:max-w-[420px] bg-gradient-to-b from-white via-[#F0F9FF] to-[#E0F2FE] border-[#FACC15] text-[#0F172A] shadow-[0_20px_40px_rgba(2,132,199,0.28),0_6px_16px_rgba(250,204,21,0.35),inset_0_3px_6px_rgba(255,255,255,0.95)]'
                                : isPos4
                                ? 'rounded-3xl p-4 max-w-[365px] sm:max-w-[420px] bg-gradient-to-b from-white via-[#FFFBEB] to-[#FFEDD5] border-white text-[#0F172A] shadow-[0_18px_36px_rgba(124,45,18,0.28),0_6px_16px_rgba(251,146,60,0.28),inset_0_3px_6px_rgba(255,255,255,0.95)]'
                                : isPos5
                                ? 'rounded-3xl p-4 max-w-[375px] sm:max-w-[435px] bg-gradient-to-b from-white via-[#EEF2FF] to-[#E0E7FF] border-white text-[#0F172A] shadow-[0_20px_42px_rgba(15,23,42,0.35),0_6px_18px_rgba(99,102,241,0.3),inset_0_3px_6px_rgba(255,255,255,0.95)]'
                                : isClayPos
                                ? 'rounded-3xl p-4 max-w-[355px] sm:max-w-[400px] bg-gradient-to-b from-white via-[#F0FDF4] to-[#DCFCE7] border-white text-[#0F172A] shadow-[0_18px_36px_rgba(6,78,59,0.28),0_6px_14px_rgba(16,185,129,0.25),inset_0_3px_6px_rgba(255,255,255,0.95)]'
                                : 'rounded-2xl px-4 py-2.5 max-w-[300px] shadow-xl bg-white border-white text-[#0F172A]'
                            }`}
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#0F172A',
                            }}
                          >
                        <p className="text-xs sm:text-sm font-extrabold leading-snug text-[#0F172A]">
                          {node.title}
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold leading-snug text-[#475569]">
                          {node.subtitle}
                        </p>

                        {/* PANEL ILUSTRASI CLAYMORPHISM 3D ANATOMI TUBUH MANUSIA (KHUSUS POS 1) */}
                        {isPos1 && (
                          <div
                            className="mt-3 rounded-3xl bg-white/90 p-3 border-2 border-emerald-200 shadow-sm"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}
                          >
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              {/* Panggung Clay 3D Siluet & Organ Tubuh Anak SD */}
                              <div className="relative flex-shrink-0 rounded-3xl bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 p-2 border-2 border-white shadow-sm">
                                <span className="absolute top-1.5 left-2 rounded-full bg-white/95 border border-emerald-300 px-2 py-0.5 text-[9px] font-black text-emerald-900 shadow-sm">
                                  3D CLAY ANATOMI
                                </span>
                                <svg
                                  viewBox="0 0 220 260"
                                  className="h-40 w-32 sm:h-44 sm:w-36 mx-auto drop-shadow-[0_10px_16px_rgba(15,23,42,0.18)]"
                                  role="img"
                                  aria-label="Ilustrasi Claymorphism 3D Anatomi Tubuh dan Panca Indra Manusia"
                                >
                                  <defs>
                                    {/* Filter Deep Soft Clay Drop Shadow */}
                                    <filter id="claySoftShadowPos1" x="-15%" y="-15%" width="130%" height="135%">
                                      <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.18" />
                                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.12" />
                                    </filter>

                                    {/* 1. Clay Kulit/Siluet Tubuh Pastel Peach */}
                                    <radialGradient id="clayBodyPeach" cx="35%" cy="20%" r="75%">
                                      <stop offset="0%" stopColor="#FFF5ED" />
                                      <stop offset="45%" stopColor="#FED7AA" />
                                      <stop offset="85%" stopColor="#FDBA74" />
                                      <stop offset="100%" stopColor="#EA580C" />
                                    </radialGradient>

                                    {/* 2. Clay Rambut Cokelat Pastel Empuk */}
                                    <radialGradient id="clayHairBrown" cx="35%" cy="25%" r="70%">
                                      <stop offset="0%" stopColor="#D6D3D1" />
                                      <stop offset="30%" stopColor="#A8A29E" />
                                      <stop offset="70%" stopColor="#78350F" />
                                      <stop offset="100%" stopColor="#451A03" />
                                    </radialGradient>

                                    {/* 3. Clay Otak Pastel Pink Cerah */}
                                    <radialGradient id="clayBrainPink" cx="32%" cy="24%" r="72%">
                                      <stop offset="0%" stopColor="#FDF2F8" />
                                      <stop offset="45%" stopColor="#F9A8D4" />
                                      <stop offset="85%" stopColor="#EC4899" />
                                      <stop offset="100%" stopColor="#BE185D" />
                                    </radialGradient>

                                    {/* 4. Clay Rongga Dada / X-Ray Cutaway Indigo Lembut */}
                                    <linearGradient id="clayCavityDark" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#334155" />
                                      <stop offset="50%" stopColor="#1E293B" />
                                      <stop offset="100%" stopColor="#0F172A" />
                                    </linearGradient>

                                    {/* 5. Clay Paru-Paru Coral Rose Pastel */}
                                    <radialGradient id="clayLungCoral" cx="30%" cy="25%" r="72%">
                                      <stop offset="0%" stopColor="#FFF1F2" />
                                      <stop offset="45%" stopColor="#FDA4AF" />
                                      <stop offset="82%" stopColor="#F43F5E" />
                                      <stop offset="100%" stopColor="#BE123C" />
                                    </radialGradient>

                                    {/* 6. Clay Jantung Merah Berry Timbul */}
                                    <radialGradient id="clayHeartRed" cx="32%" cy="25%" r="70%">
                                      <stop offset="0%" stopColor="#FFE4E6" />
                                      <stop offset="40%" stopColor="#FB7185" />
                                      <stop offset="80%" stopColor="#E11D48" />
                                      <stop offset="100%" stopColor="#881337" />
                                    </radialGradient>

                                    {/* 7. Clay Trakea & Pembuluh Biru Sky */}
                                    <linearGradient id="clayTracheaSky" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#E0F2FE" />
                                      <stop offset="50%" stopColor="#38BDF8" />
                                      <stop offset="100%" stopColor="#0284C7" />
                                    </linearGradient>

                                    {/* 8. Clay Hati (Liver) Amber Terracotta */}
                                    <radialGradient id="clayLiverAmber" cx="30%" cy="25%" r="75%">
                                      <stop offset="0%" stopColor="#FFEDD5" />
                                      <stop offset="45%" stopColor="#FB923C" />
                                      <stop offset="85%" stopColor="#EA580C" />
                                      <stop offset="100%" stopColor="#9A3412" />
                                    </radialGradient>

                                    {/* 9. Clay Lambung (Stomach) Warm Star Yellow */}
                                    <radialGradient id="clayStomachYellow" cx="35%" cy="25%" r="75%">
                                      <stop offset="0%" stopColor="#FEFCE8" />
                                      <stop offset="45%" stopColor="#FDE047" />
                                      <stop offset="85%" stopColor="#EAB308" />
                                      <stop offset="100%" stopColor="#A16207" />
                                    </radialGradient>

                                    {/* 10. Clay Usus Besar (Large Intestine) Pastel Mint Emerald */}
                                    <radialGradient id="clayColonMint" cx="30%" cy="25%" r="75%">
                                      <stop offset="0%" stopColor="#ECFDF5" />
                                      <stop offset="45%" stopColor="#6EE7B7" />
                                      <stop offset="85%" stopColor="#10B981" />
                                      <stop offset="100%" stopColor="#047857" />
                                    </radialGradient>

                                    {/* 11. Clay Usus Halus (Small Intestine) Pastel Apricot Pink */}
                                    <radialGradient id="claySmallGutPink" cx="35%" cy="25%" r="75%">
                                      <stop offset="0%" stopColor="#FFF7ED" />
                                      <stop offset="50%" stopColor="#FDBA74" />
                                      <stop offset="85%" stopColor="#F97316" />
                                      <stop offset="100%" stopColor="#C2410C" />
                                    </radialGradient>
                                  </defs>

                                  {/* Bayangan Pijakan Dasar Clay */}
                                  <ellipse cx="110" cy="248" rx="52" ry="7" fill="#0F172A" opacity="0.16" />

                                  {/* ================= SILUET TUBUH ANAK SD 3D CLAY ================= */}
                                  <g filter="url(#claySoftShadowPos1)">
                                    {/* Badan, Lengan & Kaki Membulat Empuk (Clay Silhouette) */}
                                    <path
                                      d="M98 66 L122 66 C122 74 126 78 140 80 C158 82 170 92 174 110 L182 152 C184 161 178 167 171 166 C165 165 162 160 160 151 L153 114 L148 114 L148 175 L146 234 C146 243 138 247 131 247 C124 247 119 242 118 234 L114 186 L106 186 L102 234 C101 242 96 247 89 247 C82 247 74 243 74 234 L72 175 L72 114 L67 114 L60 151 C58 160 55 165 49 166 C42 167 36 161 38 152 L46 110 C50 92 62 82 80 80 C94 78 98 74 98 66 Z"
                                      fill="url(#clayBodyPeach)"
                                    />
                                    {/* Inner Highlight Putih Tipis di Bahu & Lengan (Efek Clay Timbul) */}
                                    <path
                                      d="M49 108 C54 90 66 84 84 82 M136 82 C154 84 166 90 171 108"
                                      stroke="#FFFFFF"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.75"
                                    />

                                    {/* Telinga Kiri & Kanan (Panca Indra Pendengaran) */}
                                    <circle cx="71" cy="44" r="9" fill="url(#clayBodyPeach)" />
                                    <circle cx="71" cy="44" r="4.5" fill="#F97316" opacity="0.35" />
                                    <circle cx="149" cy="44" r="9" fill="url(#clayBodyPeach)" />
                                    <circle cx="149" cy="44" r="4.5" fill="#F97316" opacity="0.35" />

                                    {/* Kepala Membulat 3D Clay */}
                                    <rect x="74" y="12" width="72" height="58" rx="29" fill="url(#clayBodyPeach)" />
                                    {/* Kilau Inner Highlight Kepala */}
                                    <path
                                      d="M86 18 C96 14 114 14 128 17"
                                      stroke="#FFFFFF"
                                      strokeWidth="3.2"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.8"
                                    />

                                    {/* Rambut Anak (Separuh Kiri Kepala) */}
                                    <path
                                      d="M73 38 C72 20 86 10 110 10 L110 24 C96 24 84 29 76 40 Z"
                                      fill="url(#clayHairBrown)"
                                    />
                                    <path
                                      d="M82 18 C90 14 100 13 107 14"
                                      stroke="#FFFFFF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.55"
                                    />

                                    {/* Panca Indra Wajah (Mata, Hidung, Mulut Ramah di Separuh Kiri) */}
                                    <path d="M85 33 Q92 29 98 33" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                                    <circle cx="92" cy="41" r="5.5" fill="#FFFFFF" />
                                    <circle cx="92.5" cy="41" r="3.4" fill="#0F172A" />
                                    <circle cx="91" cy="39.5" r="1.4" fill="#FFFFFF" />
                                    <ellipse cx="85" cy="49" rx="5" ry="2.8" fill="#FB7185" opacity="0.55" />
                                    <path d="M106 42 Q103 46 107 48" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                    <path d="M95 55 Q103 61 110 55" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                  </g>

                                  {/* ================= CUTAWAY OTAK 3D CLAY (SEPARUH KANAN KEPALA) ================= */}
                                  <g filter="url(#claySoftShadowPos1)">
                                    <path
                                      d="M110 15 C129 15 142 26 142 41 C142 54 130 63 110 63 Z"
                                      fill="#FFF1F2"
                                      stroke="#FDE68A"
                                      strokeWidth="2.5"
                                    />
                                    <path
                                      d="M111 19 C125 19 137 27 137 39 C137 49 128 57 116 57 C113 57 111 55 111 51 Z"
                                      fill="url(#clayBrainPink)"
                                    />
                                    <path
                                      d="M115 28 C122 26 128 29 130 34 M115 38 C123 36 129 40 132 45 M115 48 C121 47 125 50 127 53"
                                      stroke="#9D174D"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.45"
                                    />
                                    <path
                                      d="M115 22 C123 22 130 26 133 33"
                                      stroke="#FFFFFF"
                                      strokeWidth="2.6"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.9"
                                    />
                                  </g>

                                  {/* ================= RONGGA ORGAN TUBUH (TORSO CUTAWAY) ================= */}
                                  <rect
                                    x="78"
                                    y="83"
                                    width="64"
                                    height="98"
                                    rx="30"
                                    fill="url(#clayCavityDark)"
                                    stroke="#FDE68A"
                                    strokeWidth="2.5"
                                  />

                                  {/* Pembuluh Darah Leher & Bahu (Merah Arteri & Biru Vena) */}
                                  <path d="M107 64 L107 88 M107 76 L92 88 M107 76 L124 88" stroke="#EF4444" strokeWidth="2.6" strokeLinecap="round" />
                                  <path d="M113 64 L113 88 M113 78 L96 90 M113 78 L128 90" stroke="#38BDF8" strokeWidth="2.6" strokeLinecap="round" />

                                  {/* ================= 1. TRAKEA 3D CLAY (BIRU LANGIT) ================= */}
                                  <g filter="url(#claySoftShadowPos1)">
                                    <rect x="105" y="72" width="10" height="28" rx="5" fill="url(#clayTracheaSky)" />
                                    <path d="M107 78 H113 M107 83 H113 M107 88 H113 M107 93 H113" stroke="#E0F2FE" strokeWidth="1.6" strokeLinecap="round" />
                                    <path d="M107.5 74 V95" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
                                  </g>

                                  {/* ================= 2. PARU-PARU KIRI & KANAN 3D CLAY ================= */}
                                  <g filter="url(#claySoftShadowPos1)">
                                    <path
                                      d="M104 92 C92 90 82 99 82 114 C82 126 89 133 98 131 C103 130 105 124 105 114 Z"
                                      fill="url(#clayLungCoral)"
                                    />
                                    <path
                                      d="M116 92 C128 90 138 99 138 114 C138 126 131 133 122 131 C117 130 115 124 115 114 Z"
                                      fill="url(#clayLungCoral)"
                                    />
                                    <path d="M104 102 C97 104 93 110 91 118 M98 108 L92 110" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                                    <path d="M116 102 C123 104 127 110 129 118 M122 108 L128 110" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                                    <path d="M86 105 C88 97 94 94 101 95" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.88" />
                                    <path d="M119 95 C126 94 132 97 134 105" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.88" />
                                  </g>

                                  {/* ================= 3. JANTUNG 3D CLAY (DI TENGAH PARU-PARU) ================= */}
                                  <g filter="url(#claySoftShadowPos1)">
                                    <path
                                      d="M112 106 C108 102 102 105 103 112 C104 118 111 123 114 125 C117 123 122 118 122 112 C122 105 116 102 112 106 Z"
                                      fill="url(#clayHeartRed)"
                                    />
                                    <circle cx="108" cy="109" r="2.2" fill="#FFFFFF" opacity="0.9" />
                                  </g>

                                  {/* ================= 4. HATI (LIVER) & LAMBUNG (STOMACH) 3D CLAY ================= */}
                                  <g filter="url(#claySoftShadowPos1)">
                                    <path
                                      d="M85 135 C85 130 94 128 108 130 C112 131 113 136 109 139 C102 144 92 146 87 143 C84 141 84 138 85 135 Z"
                                      fill="url(#clayLiverAmber)"
                                    />
                                    <path d="M89 133 C95 131 102 131 106 132" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" fill="none" opacity="0.85" />

                                    <path
                                      d="M115 131 C124 129 134 133 135 141 C136 148 128 153 118 151 C111 150 109 145 112 141 C114 138 113 133 115 131 Z"
                                      fill="url(#clayStomachYellow)"
                                    />
                                    <path d="M119 134 C125 133 130 136 131 141" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />
                                  </g>

                                  {/* ================= 5. USUS BESAR & USUS HALUS 3D CLAY ================= */}
                                  <g filter="url(#claySoftShadowPos1)">
                                    <path
                                      d="M88 152 C88 147 95 145 110 145 C125 145 132 147 132 152 L132 167 C132 173 126 176 118 175 L113 175 L113 180 C113 183 107 183 107 180 L107 175 L102 175 C94 176 88 173 88 167 Z"
                                      fill="url(#clayColonMint)"
                                    />
                                    <rect x="95" y="152" width="30" height="17" rx="8.5" fill="url(#claySmallGutPink)" />
                                    <path
                                      d="M99 157 Q105 154 110 158 T121 157 M99 163 Q105 160 110 164 T121 163"
                                      stroke="#FFF7ED"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.85"
                                    />
                                    <path
                                      d="M93 149 C102 147 118 147 127 149"
                                      stroke="#FFFFFF"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.9"
                                    />
                                  </g>
                                </svg>
                              </div>

                              {/* Daftar Lencana Organ & Panca Indra Bergaya Bright Claymorphism 3D */}
                              <div className="flex flex-col gap-2 text-left w-full">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_4px_10px_rgba(5,150,105,0.35),inset_0_2px_3px_rgba(255,255,255,0.6)] w-fit">
                                  ✨ Sistem Organ &amp; Panca Indra 3D
                                </div>

                                {/* Pill 1: Otak & Panca Indra */}
                                <div className="flex items-center gap-2 rounded-2xl bg-pink-50 px-3 py-1.5 border border-pink-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-pink-400 to-rose-500 text-xs text-white shadow-sm">
                                    🧠
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Otak &amp; 5 Panca Indra</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Mata, Telinga, Hidung, Lidah, Kulit</p>
                                  </div>
                                </div>

                                {/* Pill 2: Paru-Paru & Jantung */}
                                <div className="flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1.5 border border-sky-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 text-xs text-white shadow-sm">
                                    🫁
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Paru-Paru &amp; Jantung</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Pernapasan Oksigen &amp; Pompa Darah</p>
                                  </div>
                                </div>

                                {/* Pill 3: Hati, Lambung & Usus */}
                                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1.5 border border-emerald-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-emerald-600 text-xs text-white shadow-sm">
                                    🍎
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Lambung, Hati &amp; Usus</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Sistem Pencernaan Energi Tubuh</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PANEL ILUSTRASI CLAYMORPHISM 3D DUNIA TUMBUHAN & EKOSISTEM HEWAN (KHUSUS POS 2) */}
                        {isPos2 && (
                          <div
                            className="mt-3 rounded-3xl bg-white/90 p-3 border-2 border-lime-200 shadow-sm"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}
                          >
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              {/* Panggung Clay 3D Tunas Hijau Segar & Kelompok Hewan Imut (Gajah, Anak Ayam, Rusa) */}
                              <div className="relative flex-shrink-0 rounded-3xl bg-gradient-to-b from-lime-50 via-emerald-50 to-teal-100 p-2 border-2 border-white shadow-sm">
                                <span className="absolute top-1.5 left-2 z-10 rounded-full bg-white/95 border border-lime-300 px-2 py-0.5 text-[9px] font-black text-lime-900 shadow-sm">
                                  3D CLAY FLORA &amp; FAUNA
                                </span>
                                <svg
                                  viewBox="0 0 240 260"
                                  className="h-40 w-36 sm:h-44 sm:w-40 mx-auto drop-shadow-[0_10px_16px_rgba(15,23,42,0.18)]"
                                  role="img"
                                  aria-label="Ilustrasi Claymorphism 3D Tunas Tumbuhan Hijau Segar dan Kelompok Hewan Kartun Gajah, Rusa, serta Anak Ayam"
                                >
                                  <defs>
                                    {/* Filter Deep Soft Clay Drop Shadow */}
                                    <filter id="claySoftShadowPos2" x="-15%" y="-15%" width="130%" height="135%">
                                      <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#064E3B" floodOpacity="0.22" />
                                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.12" />
                                    </filter>

                                    {/* 1. Clay Daun Tunas Hijau Botani Segar (Sunlit Lime-Emerald) */}
                                    <radialGradient id="claySproutLeafPos2" cx="30%" cy="22%" r="75%">
                                      <stop offset="0%" stopColor="#F7FEE7" />
                                      <stop offset="38%" stopColor="#A3E635" />
                                      <stop offset="78%" stopColor="#22C55E" />
                                      <stop offset="100%" stopColor="#15803D" />
                                    </radialGradient>

                                    {/* 2. Clay Batang Tunas Hijau Muda */}
                                    <linearGradient id="clayStemPos2" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#D9F99D" />
                                      <stop offset="50%" stopColor="#65A30D" />
                                      <stop offset="100%" stopColor="#166534" />
                                    </linearGradient>

                                    {/* 3. Clay Tanah Subur Cokelat Hangat */}
                                    <radialGradient id="claySoilMoundPos2" cx="38%" cy="25%" r="75%">
                                      <stop offset="0%" stopColor="#E7E5E4" />
                                      <stop offset="28%" stopColor="#A8A29E" />
                                      <stop offset="62%" stopColor="#78350F" />
                                      <stop offset="100%" stopColor="#451A03" />
                                    </radialGradient>

                                    {/* 4. Clay Bayi Gajah Biru-Abu Pastel Empuk */}
                                    <radialGradient id="clayElephantBodyPos2" cx="35%" cy="22%" r="75%">
                                      <stop offset="0%" stopColor="#F8FAFC" />
                                      <stop offset="45%" stopColor="#CBD5E1" />
                                      <stop offset="82%" stopColor="#64748B" />
                                      <stop offset="100%" stopColor="#334155" />
                                    </radialGradient>

                                    {/* 5. Clay Telinga Dalam Gajah Pink Pastel */}
                                    <radialGradient id="clayElephantEarPinkPos2" cx="35%" cy="28%" r="72%">
                                      <stop offset="0%" stopColor="#FDF2F8" />
                                      <stop offset="48%" stopColor="#F9A8D4" />
                                      <stop offset="85%" stopColor="#EC4899" />
                                      <stop offset="100%" stopColor="#BE185D" />
                                    </radialGradient>

                                    {/* 6. Clay Anak Ayam Kuning Bintang Hangat */}
                                    <radialGradient id="clayChickYellowPos2" cx="35%" cy="22%" r="72%">
                                      <stop offset="0%" stopColor="#FEFCE8" />
                                      <stop offset="45%" stopColor="#FDE047" />
                                      <stop offset="82%" stopColor="#EAB308" />
                                      <stop offset="100%" stopColor="#CA8A04" />
                                    </radialGradient>

                                    {/* 7. Clay Rusa Kecil (Fawn) Cokelat Karamel Hangat */}
                                    <radialGradient id="clayDeerAmberPos2" cx="32%" cy="22%" r="75%">
                                      <stop offset="0%" stopColor="#FFF7ED" />
                                      <stop offset="42%" stopColor="#FDBA74" />
                                      <stop offset="80%" stopColor="#EA580C" />
                                      <stop offset="100%" stopColor="#9A3412" />
                                    </radialGradient>

                                    {/* 8. Clay Rumput Padang Ekosistem */}
                                    <linearGradient id="clayMeadowBasePos2" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#86EFAC" />
                                      <stop offset="55%" stopColor="#22C55E" />
                                      <stop offset="100%" stopColor="#15803D" />
                                    </linearGradient>
                                  </defs>

                                  {/* Bokeh Sinar Matahari Pagi (Sudut Kanan Atas seperti Foto Tunas) */}
                                  <circle cx="195" cy="40" r="28" fill="#FEF08A" opacity="0.65" />
                                  <circle cx="195" cy="40" r="16" fill="#FFFFFF" opacity="0.7" />
                                  <circle cx="52" cy="54" r="14" fill="#FEF9C3" opacity="0.55" />

                                  {/* Pijakan Padang Rumput Hijau Empuk di Dasar */}
                                  <ellipse cx="120" cy="236" rx="102" ry="18" fill="url(#clayMeadowBasePos2)" />
                                  <path
                                    d="M36 232 C75 224 165 224 204 232"
                                    stroke="#FFFFFF"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    fill="none"
                                    opacity="0.65"
                                  />

                                  {/* ================= 1. BAYI GAJAH 3D CLAY (TENGAH-KANAN) ================= */}
                                  <g filter="url(#claySoftShadowPos2)">
                                    {/* Telinga Kiri & Kanan Lebar Membulat */}
                                    <ellipse cx="102" cy="132" rx="24" ry="30" fill="url(#clayElephantBodyPos2)" />
                                    <ellipse cx="104" cy="134" rx="15" ry="21" fill="url(#clayElephantEarPinkPos2)" />
                                    <path d="M86 112 A20 24 0 0 1 112 106" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />

                                    <ellipse cx="194" cy="132" rx="24" ry="30" fill="url(#clayElephantBodyPos2)" />
                                    <ellipse cx="192" cy="134" rx="15" ry="21" fill="url(#clayElephantEarPinkPos2)" />
                                    <path d="M184 106 A20 24 0 0 1 210 112" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />

                                    {/* Badan & Kaki Empuk Gajah */}
                                    <rect x="116" y="158" width="64" height="68" rx="28" fill="url(#clayElephantBodyPos2)" />
                                    <rect x="120" y="200" width="22" height="32" rx="11" fill="url(#clayElephantBodyPos2)" />
                                    <rect x="154" y="200" width="22" height="32" rx="11" fill="url(#clayElephantBodyPos2)" />
                                    {/* Kuku Kaki Gajah Putih */}
                                    <circle cx="126" cy="229" r="3" fill="#F8FAFC" />
                                    <circle cx="133" cy="229" r="3" fill="#F8FAFC" />
                                    <circle cx="160" cy="229" r="3" fill="#F8FAFC" />
                                    <circle cx="167" cy="229" r="3" fill="#F8FAFC" />

                                    {/* Kepala Gajah Bulat Besar 3D Clay */}
                                    <circle cx="148" cy="130" r="36" fill="url(#clayElephantBodyPos2)" />
                                    {/* Jambul Kecil Gajah */}
                                    <path d="M144 95 C142 86 147 83 150 92 C154 84 160 87 153 95" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                    {/* Inner Highlight Putih Kepala Gajah */}
                                    <path d="M124 104 A30 30 0 0 1 172 104" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.88" />

                                    {/* Mata Besar Berkilau (Khas Kartun 3D) */}
                                    <circle cx="132" cy="128" r="8" fill="#FFFFFF" />
                                    <circle cx="133" cy="128.5" r="5.5" fill="#3E2723" />
                                    <circle cx="131" cy="126" r="2.2" fill="#FFFFFF" />
                                    <circle cx="135" cy="131" r="1" fill="#FFFFFF" />

                                    <circle cx="164" cy="128" r="8" fill="#FFFFFF" />
                                    <circle cx="163" cy="128.5" r="5.5" fill="#3E2723" />
                                    <circle cx="161" cy="126" r="2.2" fill="#FFFFFF" />
                                    <circle cx="165" cy="131" r="1" fill="#FFFFFF" />

                                    {/* Alis & Pipi Merona */}
                                    <path d="M125 116 Q132 112 138 116" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                    <path d="M158 116 Q164 112 171 116" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                    <ellipse cx="121" cy="139" rx="6.5" ry="3.8" fill="#FB7185" opacity="0.6" />
                                    <ellipse cx="175" cy="139" rx="6.5" ry="3.8" fill="#FB7185" opacity="0.6" />

                                    {/* Belalai Gajah Melengkung Ceria */}
                                    <path
                                      d="M144 136 C143 160 150 176 164 174 C171 173 173 166 167 164 C162 163 160 168 164 170"
                                      stroke="url(#clayElephantBodyPos2)"
                                      strokeWidth="13"
                                      strokeLinecap="round"
                                      fill="none"
                                    />
                                    <path
                                      d="M144 138 C144 156 150 170 162 170"
                                      stroke="#FFFFFF"
                                      strokeWidth="2.4"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.8"
                                    />
                                    {/* Kalung Daun Ekosistem di Leher Gajah */}
                                    <path d="M122 166 Q148 178 174 166" stroke="#15803D" strokeWidth="2" fill="none" />
                                    <ellipse cx="136" cy="173" rx="5" ry="2.5" transform="rotate(20 136 173)" fill="#22C55E" />
                                    <ellipse cx="158" cy="173" rx="5" ry="2.5" transform="rotate(-20 158 173)" fill="#22C55E" />
                                  </g>

                                  {/* ================= 2. ANAK AYAM KUNING 3D CLAY (DI ATAS KEPALA GAJAH) ================= */}
                                  <g filter="url(#claySoftShadowPos2)">
                                    {/* Sayap Kecil Mengepak */}
                                    <ellipse cx="125" cy="72" rx="9" ry="5" transform="rotate(-25 125 72)" fill="url(#clayChickYellowPos2)" />
                                    <ellipse cx="169" cy="72" rx="9" ry="5" transform="rotate(25 169 72)" fill="url(#clayChickYellowPos2)" />
                                    {/* Badan & Kepala Bulat Anak Ayam */}
                                    <circle cx="147" cy="68" r="20" fill="url(#clayChickYellowPos2)" />
                                    {/* Jambul Anak Ayam */}
                                    <path d="M144 48 C144 41 148 41 148 48 C151 42 155 44 151 49" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
                                    {/* Inner Highlight Putih Anak Ayam */}
                                    <path d="M134 55 A15 15 0 0 1 160 55" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.92" />
                                    {/* Mata & Paruh Oranye Anak Ayam */}
                                    <circle cx="140" cy="66" r="3.6" fill="#0F172A" />
                                    <circle cx="139" cy="64.8" r="1.3" fill="#FFFFFF" />
                                    <circle cx="154" cy="66" r="3.6" fill="#0F172A" />
                                    <circle cx="153" cy="64.8" r="1.3" fill="#FFFFFF" />
                                    <ellipse cx="135" cy="71" rx="3.5" ry="2" fill="#FB7185" opacity="0.65" />
                                    <ellipse cx="159" cy="71" rx="3.5" ry="2" fill="#FB7185" opacity="0.65" />
                                    <polygon points="144,69 150,69 147,75" fill="#F97316" />
                                    {/* Kaki Kecil di Atas Kepala Gajah */}
                                    <path d="M141 87 L139 93 M153 87 L155 93" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
                                  </g>

                                  {/* ================= 3. RUSA KECIL BERBINTIK 3D CLAY (SISI KIRI) ================= */}
                                  <g filter="url(#claySoftShadowPos2)">
                                    {/* Badan Rusa & Bintik Putih */}
                                    <rect x="24" y="182" width="44" height="32" rx="16" fill="url(#clayDeerAmberPos2)" />
                                    <circle cx="34" cy="193" r="2.5" fill="#FFF7ED" opacity="0.9" />
                                    <circle cx="43" cy="190" r="2.2" fill="#FFF7ED" opacity="0.9" />
                                    <circle cx="39" cy="199" r="2.2" fill="#FFF7ED" opacity="0.9" />
                                    {/* Kaki Rusa */}
                                    <rect x="28" y="206" width="8" height="28" rx="4" fill="url(#clayDeerAmberPos2)" />
                                    <rect x="54" y="206" width="8" height="28" rx="4" fill="url(#clayDeerAmberPos2)" />
                                    {/* Dada Krem Halus */}
                                    <ellipse cx="60" cy="196" rx="9" ry="12" fill="#FFF7ED" />
                                    {/* Tanduk Rusa Kecil Membulat */}
                                    <path d="M44 136 L40 124 M42 130 L36 128" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" />
                                    <path d="M62 136 L66 124 M64 130 L70 128" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" />
                                    {/* Telinga Rusa */}
                                    <ellipse cx="32" cy="146" rx="9" ry="5" transform="rotate(-25 32 146)" fill="url(#clayDeerAmberPos2)" />
                                    <ellipse cx="74" cy="146" rx="9" ry="5" transform="rotate(25 74 146)" fill="url(#clayDeerAmberPos2)" />
                                    {/* Kepala Rusa 3D Clay */}
                                    <circle cx="53" cy="156" r="21" fill="url(#clayDeerAmberPos2)" />
                                    <path d="M40 142 A16 16 0 0 1 66 142" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85" />
                                    {/* Mata & Hidung Rusa */}
                                    <circle cx="46" cy="155" r="4.2" fill="#3E2723" />
                                    <circle cx="44.8" cy="153.5" r="1.6" fill="#FFFFFF" />
                                    <circle cx="61" cy="155" r="4.2" fill="#3E2723" />
                                    <circle cx="59.8" cy="153.5" r="1.6" fill="#FFFFFF" />
                                    <ellipse cx="54" cy="163" rx="4" ry="2.8" fill="#1E293B" />
                                    <path d="M50 168 Q54 172 58 168" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
                                  </g>

                                  {/* ================= 4. TUNAS TUMBUHAN HIJAU SEGAR & TANAH SUBUR 3D CLAY (IKON UTAMA DEPAN) ================= */}
                                  <g filter="url(#claySoftShadowPos2)">
                                    {/* Gundukan Tanah Subur Berlapis (Seperti Foto Referensi Tunas) */}
                                    <path
                                      d="M54 244 C54 228 74 218 96 218 C118 218 138 228 138 244 Z"
                                      fill="url(#claySoilMoundPos2)"
                                    />
                                    <circle cx="72" cy="236" r="8" fill="url(#claySoilMoundPos2)" />
                                    <circle cx="118" cy="237" r="7" fill="url(#claySoilMoundPos2)" />
                                    <circle cx="95" cy="232" r="9" fill="url(#claySoilMoundPos2)" />
                                    <path d="M72 224 Q96 218 120 224" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45" />

                                    {/* Batang Tunas Hijau Segar Timbul */}
                                    <path
                                      d="M96 226 C96 192 95 156 97 118"
                                      stroke="url(#clayStemPos2)"
                                      strokeWidth="8"
                                      strokeLinecap="round"
                                      fill="none"
                                    />
                                    <path
                                      d="M94.5 220 C94.5 190 94 158 95.5 122"
                                      stroke="#FFFFFF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.75"
                                    />

                                    {/* Daun Bawah Kiri (3D Clay Botanical Leaf) */}
                                    <path
                                      d="M95 170 C68 168 48 152 46 134 C66 130 88 144 95 170 Z"
                                      fill="url(#claySproutLeafPos2)"
                                    />
                                    <path d="M52 138 C68 142 82 152 92 166" stroke="#ECFCCB" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
                                    <path d="M54 135 C68 133 82 141 90 155" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />

                                    {/* Daun Bawah Kanan */}
                                    <path
                                      d="M97 164 C122 162 140 148 142 132 C124 128 104 140 97 164 Z"
                                      fill="url(#claySproutLeafPos2)"
                                    />
                                    <path d="M136 135 C122 140 108 148 100 160" stroke="#ECFCCB" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
                                    <path d="M134 132 C121 131 109 138 102 150" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />

                                    {/* Daun Puncak Kiri (Menjulang Segar ke Atas) */}
                                    <path
                                      d="M96 126 C74 114 60 86 64 58 C86 68 98 94 96 126 Z"
                                      fill="url(#claySproutLeafPos2)"
                                    />
                                    <path d="M68 66 C78 82 88 102 94 120" stroke="#ECFCCB" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
                                    <path d="M68 63 C82 72 91 90 93 110" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.92" />

                                    {/* Daun Puncak Kanan (Bulat Lebar Berurat Daun Halus) */}
                                    <path
                                      d="M97 124 C120 112 136 86 130 60 C108 66 96 92 97 124 Z"
                                      fill="url(#claySproutLeafPos2)"
                                    />
                                    <path d="M126 66 C116 84 106 102 99 118" stroke="#ECFCCB" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
                                    <path d="M124 64 C111 71 102 88 100 108" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.92" />
                                  </g>
                                </svg>
                              </div>

                              {/* Daftar Lencana Flora & Fauna Bergaya Bright Claymorphism 3D */}
                              <div className="flex flex-col gap-2 text-left w-full">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-lime-600 to-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_4px_10px_rgba(22,163,74,0.35),inset_0_2px_3px_rgba(255,255,255,0.65)] w-fit">
                                  🌱 Dunia Flora &amp; Sahabat Fauna 3D
                                </div>

                                {/* Pill 1: Tunas Hijau & Fotosintesis */}
                                <div className="flex items-center gap-2 rounded-2xl bg-lime-50 px-3 py-1.5 border border-lime-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-lime-400 to-emerald-600 text-xs text-white shadow-sm">
                                    🌱
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Tunas Tumbuhan &amp; Fotosintesis</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Daun Hijau, Sinar Matahari &amp; Tanah Subur</p>
                                  </div>
                                </div>

                                {/* Pill 2: Gajah, Rusa & Anak Ayam */}
                                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 border border-amber-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-orange-500 text-xs text-white shadow-sm">
                                    🐘
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Gajah, Rusa &amp; Anak Ayam</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Kelompok Hewan Herbivora &amp; Omnivora</p>
                                  </div>
                                </div>

                                {/* Pill 3: Rantai Makanan & Habitat */}
                                <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-3 py-1.5 border border-teal-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-teal-400 to-emerald-600 text-xs text-white shadow-sm">
                                    🦌
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Ekosistem &amp; Rantai Makanan</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Hubungan Harmonis Flora &amp; Fauna Bumi</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PANEL ILUSTRASI CLAYMORPHISM 3D SIKLUS AIR, KONDENSASI AWAN & HUJAN (KHUSUS POS 3) */}
                        {isPos3 && (
                          <div
                            className="mt-3 rounded-3xl bg-white/90 p-3 border-2 border-sky-200 shadow-sm"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}
                          >
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              {/* Panggung Clay 3D Awan Estetik Empuk & Diagram Siklus Air */}
                              <div className="relative flex-shrink-0 rounded-3xl bg-gradient-to-b from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] p-2 border-2 border-white shadow-sm">
                                <span className="absolute top-1.5 left-2 z-10 rounded-full bg-white/95 border border-sky-300 px-2 py-0.5 text-[9px] font-black text-sky-900 shadow-sm">
                                  3D CLAY SIKLUS AIR
                                </span>
                                <svg
                                  viewBox="0 0 250 260"
                                  className="h-44 w-40 sm:h-48 sm:w-44 mx-auto drop-shadow-[0_10px_16px_rgba(15,23,42,0.25)]"
                                  role="img"
                                  aria-label="Ilustrasi Claymorphism 3D Awan Estetik dan Diagram Siklus Air: Evaporasi, Kondensasi, Presipitasi, serta Pengumpulan"
                                >
                                  <defs>
                                    {/* Filter Deep Soft Clay Drop Shadow */}
                                    <filter id="claySoftShadowPos3" x="-15%" y="-15%" width="130%" height="135%">
                                      <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0C4A6E" floodOpacity="0.28" />
                                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.16" />
                                    </filter>

                                    {/* 1. Clay Awan Estetik Putih-Biru Pastel (Terinspirasi awan estetik.jpeg) */}
                                    <radialGradient id="clayAestheticCloudPos3" cx="62%" cy="26%" r="72%">
                                      <stop offset="0%" stopColor="#FFFDF9" />
                                      <stop offset="42%" stopColor="#F8FAFC" />
                                      <stop offset="76%" stopColor="#BAE6FD" />
                                      <stop offset="100%" stopColor="#7DD3FC" />
                                    </radialGradient>

                                    {/* 2. Clay Awan Hujan Biru-Keperakan Lembut */}
                                    <radialGradient id="clayRainCloudPos3" cx="55%" cy="25%" r="74%">
                                      <stop offset="0%" stopColor="#F8FAFC" />
                                      <stop offset="45%" stopColor="#E0F2FE" />
                                      <stop offset="80%" stopColor="#7DD3FC" />
                                      <stop offset="100%" stopColor="#38BDF8" />
                                    </radialGradient>

                                    {/* 3. Clay Matahari Evaporasi Kuning-Oranye Hangat */}
                                    <radialGradient id="claySunWarmPos3" cx="35%" cy="28%" r="70%">
                                      <stop offset="0%" stopColor="#FEFCE8" />
                                      <stop offset="45%" stopColor="#FDE047" />
                                      <stop offset="82%" stopColor="#F59E0B" />
                                      <stop offset="100%" stopColor="#EA580C" />
                                    </radialGradient>

                                    {/* 4. Clay Tetesan Air Hujan Biru Langit Timbul */}
                                    <radialGradient id="clayWaterDropPos3" cx="35%" cy="25%" r="72%">
                                      <stop offset="0%" stopColor="#F0F9FF" />
                                      <stop offset="45%" stopColor="#38BDF8" />
                                      <stop offset="85%" stopColor="#0284C7" />
                                      <stop offset="100%" stopColor="#0369A1" />
                                    </radialGradient>

                                    {/* 5. Clay Gunung & Puncak Salju */}
                                    <linearGradient id="clayMountainPos3" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#CBD5E1" />
                                      <stop offset="50%" stopColor="#64748B" />
                                      <stop offset="100%" stopColor="#334155" />
                                    </linearGradient>

                                    {/* 6. Clay Bukit Hijau & Danau Pengumpulan */}
                                    <linearGradient id="clayHillGreenPos3" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#86EFAC" />
                                      <stop offset="55%" stopColor="#22C55E" />
                                      <stop offset="100%" stopColor="#15803D" />
                                    </linearGradient>

                                    <linearGradient id="clayLakeWaterPos3" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#38BDF8" />
                                      <stop offset="50%" stopColor="#0284C7" />
                                      <stop offset="100%" stopColor="#0369A1" />
                                    </linearGradient>
                                  </defs>

                                  {/* Sinar Diagonal Matahari (Seperti Diagram Siklus Air) */}
                                  <polygon points="215,38 115,175 155,195 235,55" fill="#FEF08A" opacity="0.16" />
                                  <polygon points="200,28 95,165 120,175 215,42" fill="#FFFFFF" opacity="0.12" />

                                  {/* ================= 1. GUNUNG, BUKIT HIJAU & DANAU PENGUMPULAN (BAWAH) ================= */}
                                  <g filter="url(#claySoftShadowPos3)">
                                    {/* Gunung di Kiri (Tempat Presipitasi & Air Terjun) */}
                                    <path
                                      d="M8 198 L48 114 C52 106 60 106 64 114 L106 198 Z"
                                      fill="url(#clayMountainPos3)"
                                    />
                                    <path
                                      d="M62 198 L94 134 C98 127 105 127 109 134 L142 198 Z"
                                      fill="#475569"
                                    />
                                    {/* Puncak Salju Clay Putih Empuk */}
                                    <path
                                      d="M48 114 C52 106 60 106 64 114 L74 135 C66 138 62 132 56 136 C50 132 45 138 38 135 Z"
                                      fill="#F8FAFC"
                                    />
                                    <path d="M51 112 L61 112" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

                                    {/* Bukit Hijau & Pohon di Kanan */}
                                    <path
                                      d="M118 198 Q180 152 242 182 L242 225 L118 225 Z"
                                      fill="url(#clayHillGreenPos3)"
                                    />
                                    {/* Pohon Bulat 3D Clay di Kanan */}
                                    <rect x="203" y="160" width="5" height="16" rx="2" fill="#78350F" />
                                    <circle cx="205.5" cy="154" r="11" fill="#22C55E" />
                                    <circle cx="199" cy="158" r="8" fill="#4ADE80" />
                                    <circle cx="212" cy="158" r="8" fill="#16A34A" />

                                    {/* Air Terjun & Danau Pengumpulan 3D Clay */}
                                    <path
                                      d="M78 158 C84 168 84 184 86 198 L98 198 C96 184 95 168 89 158 Z"
                                      fill="#BAE6FD"
                                    />
                                    <rect x="10" y="194" width="230" height="54" rx="24" fill="url(#clayLakeWaterPos3)" />
                                    {/* Buih Air Terjun Clay */}
                                    <circle cx="84" cy="196" r="5" fill="#F0F9FF" />
                                    <circle cx="92" cy="197" r="6" fill="#FFFFFF" />
                                    <circle cx="100" cy="196" r="4.5" fill="#E0F2FE" />
                                    {/* Inner Highlight Permukaan Danau */}
                                    <path d="M26 202 H165" stroke="#BAE6FD" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                                  </g>

                                  {/* ================= 2. MATAHARI 3D CLAY & UAP EVAPORASI (KANAN) ================= */}
                                  <g filter="url(#claySoftShadowPos3)">
                                    {/* Sinar Bintang Matahari Bulat */}
                                    <circle cx="210" cy="44" r="23" fill="#FACC15" opacity="0.32" />
                                    <circle cx="210" cy="44" r="17" fill="url(#claySunWarmPos3)" />
                                    <path d="M201 33 A12 12 0 0 1 219 33" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />

                                    {/* 3 Garis Panah Uap Air Bergelombang (Evaporasi) */}
                                    <path d="M168 182 Q164 172 168 162 T168 142" stroke="#FB923C" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    <polygon points="164,144 172,144 168,137" fill="#FB923C" />
                                    <path d="M180 180 Q176 170 180 160 T180 140" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    <polygon points="176,142 184,142 180,135" fill="#FDBA74" />
                                    <path d="M192 182 Q188 172 192 162 T192 142" stroke="#FB923C" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    <polygon points="188,144 196,144 192,137" fill="#FB923C" />
                                  </g>

                                  {/* ================= 3. AWAN ESTETIK 3D EMPUK (TENGAH & KIRI ATAS - GAYA awan estetik.jpeg) ================= */}
                                  {/* Awan Kondensasi Kanan Atas (Menerima Uap Air) */}
                                  <g filter="url(#claySoftShadowPos3)">
                                    <circle cx="164" cy="64" r="16" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="148" cy="71" r="12.5" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="180" cy="71" r="12" fill="url(#clayAestheticCloudPos3)" />
                                    <ellipse cx="164" cy="76" rx="24" ry="10" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="154" cy="77" r="9.5" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="174" cy="77" r="9.5" fill="url(#clayAestheticCloudPos3)" />
                                    <path d="M153 53 A13 13 0 0 1 174 53" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95" />
                                  </g>

                                  {/* Awan Utama Estetik 3D Bertekstur Bola-Bola Empuk (Kiri Atas - Persis awan estetik.jpeg) */}
                                  <g filter="url(#claySoftShadowPos3)">
                                    {/* Kubah Puncak Awan 3D */}
                                    <circle cx="68" cy="54" r="22" fill="url(#clayAestheticCloudPos3)" />
                                    {/* Bola Awan Kiri Tengah & Kanan Tengah */}
                                    <circle cx="44" cy="65" r="17" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="91" cy="64" r="15" fill="url(#clayAestheticCloudPos3)" />
                                    {/* Bola Awan Ujung Kiri & Ujung Kanan */}
                                    <circle cx="28" cy="76" r="12.5" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="105" cy="75" r="12" fill="url(#clayAestheticCloudPos3)" />
                                    {/* Bantal Tengah & Bola-Bola Dasar Awan 3D Empuk */}
                                    <ellipse cx="68" cy="74" rx="34" ry="16" fill="url(#clayRainCloudPos3)" />
                                    <circle cx="46" cy="79" r="14" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="69" cy="81" r="15.5" fill="url(#clayAestheticCloudPos3)" />
                                    <circle cx="92" cy="79" r="13.5" fill="url(#clayAestheticCloudPos3)" />
                                    {/* Inner Highlight Putih Berkilau di Tepi Dalam Awan 3D */}
                                    <path d="M53 39 A19 19 0 0 1 83 39" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.96" />
                                    <path d="M32 55 A14 14 0 0 1 50 51" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
                                    <path d="M84 52 A12 12 0 0 1 100 58" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.88" />
                                  </g>

                                  {/* ================= 4. TETESAN AIR HUJAN 3D CLAY (PRESIPITASI) ================= */}
                                  <g filter="url(#claySoftShadowPos3)">
                                    <g className="anim-rain-1">
                                      <path d="M44 96 C44 96 39 105 39 109 C39 112 41.2 114 44 114 C46.8 114 49 112 49 109 C49 105 44 96 44 96 Z" fill="url(#clayWaterDropPos3)" />
                                      <circle cx="42.5" cy="108" r="1.5" fill="#FFFFFF" opacity="0.9" />
                                    </g>
                                    <g className="anim-rain-2">
                                      <path d="M64 100 C64 100 59 109 59 113 C59 116 61.2 118 64 118 C66.8 118 69 116 69 113 C69 109 64 100 64 100 Z" fill="url(#clayWaterDropPos3)" />
                                      <circle cx="62.5" cy="112" r="1.5" fill="#FFFFFF" opacity="0.9" />
                                    </g>
                                    <g className="anim-rain-3">
                                      <path d="M84 96 C84 96 79 105 79 109 C79 112 81.2 114 84 114 C86.8 114 89 112 89 109 C89 105 84 96 84 96 Z" fill="url(#clayWaterDropPos3)" />
                                      <circle cx="82.5" cy="108" r="1.5" fill="#FFFFFF" opacity="0.9" />
                                    </g>
                                  </g>

                                  {/* ================= 5. PANAH LINGKARAN & LABEL 4 TAHAP SIKLUS AIR (SEPERTI image.png) ================= */}
                                  {/* Panah Atas: Kondensasi (Kanan ke Kiri) */}
                                  <path d="M142 56 Q125 46 108 54" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                  <polygon points="111,48 103,56 113,59" fill="#FACC15" />

                                  {/* Panah Kiri: Presipitasi (Atas ke Bawah) */}
                                  <path d="M30 98 Q18 135 30 168" stroke="#BAE6FD" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                  <polygon points="24,166 33,174 35,163" fill="#BAE6FD" />

                                  {/* Panah Bawah: Pengumpulan (Kiri ke Kanan di Danau) */}
                                  <path d="M52 214 Q105 228 156 214" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                  <polygon points="153,208 163,212 156,220" fill="#FACC15" />

                                  {/* Panah Kanan: Evaporasi (Bawah ke Atas) */}
                                  <path d="M214 168 Q226 128 206 90" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                  <polygon points="202,94 203,83 212,89" fill="#FDE047" />

                                  {/* Lencana Label 4 Tahap di Dalam Diagram */}
                                  <rect x="92" y="28" width="66" height="16" rx="8" fill="#0F172A" opacity="0.88" stroke="#7DD3FC" strokeWidth="1" />
                                  <text x="125" y="39" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="900">KONDENSASI</text>

                                  <rect x="6" y="172" width="64" height="16" rx="8" fill="#0F172A" opacity="0.88" stroke="#7DD3FC" strokeWidth="1" />
                                  <text x="38" y="183" textAnchor="middle" fill="#BAE6FD" fontSize="8.5" fontWeight="900">PRESIPITASI</text>

                                  <rect x="172" y="114" width="62" height="16" rx="8" fill="#0F172A" opacity="0.88" stroke="#FACC15" strokeWidth="1" />
                                  <text x="203" y="125" textAnchor="middle" fill="#FDE047" fontSize="8.5" fontWeight="900">EVAPORASI</text>

                                  <rect x="82" y="232" width="76" height="16" rx="8" fill="#0F172A" opacity="0.88" stroke="#38BDF8" strokeWidth="1" />
                                  <text x="120" y="243" textAnchor="middle" fill="#E0F2FE" fontSize="8.5" fontWeight="900">PENGUMPULAN</text>
                                </svg>
                              </div>

                              {/* Daftar Lencana Tahapan Siklus Air Bergaya Bright Claymorphism 3D */}
                              <div className="flex flex-col gap-2 text-left w-full">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_4px_10px_rgba(2,132,199,0.35),inset_0_2px_3px_rgba(255,255,255,0.65)] w-fit">
                                  ☁️ Awan 3D &amp; Siklus Air Atmosfer
                                </div>

                                {/* Pill 1: Evaporasi */}
                                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 border border-amber-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-orange-500 text-xs text-white shadow-sm">
                                    ☀️
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">1. Evaporasi (Penguapan)</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Air bumi menguap oleh hangat matahari</p>
                                  </div>
                                </div>

                                {/* Pill 2: Kondensasi Awan 3D */}
                                <div className="flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1.5 border border-sky-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-sky-300 to-sky-600 text-xs text-white shadow-sm">
                                    ☁️
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">2. Kondensasi Awan Empuk</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Uap air mendingin jadi gumpalan awan 3D</p>
                                  </div>
                                </div>

                                {/* Pill 3: Presipitasi & Pengumpulan */}
                                <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-1.5 border border-indigo-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-blue-700 text-xs text-white shadow-sm">
                                    🌧️
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">3. Presipitasi &amp; Pengumpulan</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Turunnya titik hujan &amp; mengalir ke danau</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PANEL ILUSTRASI CLAYMORPHISM 3D ENERGI PANAS API & PEMANASAN WUJUD BENDA PANCI A/B (KHUSUS POS 4) */}
                        {isPos4 && (
                          <div
                            className="mt-3 rounded-3xl bg-white/90 p-3 border-2 border-amber-200 shadow-sm"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}
                          >
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              {/* Panggung Clay 3D: Eksperimen Panci A & Panci B + Api Unggun Hangat Kartun 3D */}
                              <div className="relative flex-shrink-0 rounded-3xl bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 p-2 border-2 border-white shadow-sm overflow-hidden">
                                <span className="absolute top-1.5 left-2 z-10 rounded-full bg-white/95 border border-amber-300 px-2 py-0.5 text-[8.5px] font-black text-amber-900 shadow-sm">
                                  🔥 3D CLAY KALOR &amp; WUJUD
                                </span>
                                <svg
                                  viewBox="0 0 280 225"
                                  className="h-40 w-44 sm:h-44 sm:w-48 mx-auto drop-shadow-[0_10px_16px_rgba(124,45,18,0.2)]"
                                  role="img"
                                  aria-label="Ilustrasi Claymorphism 3D Energi Panas Api Kartun dan Eksperimen Pemanasan Air Panci A serta Panci B"
                                >
                                  <defs>
                                    {/* Filter Deep Soft Clay Drop Shadow */}
                                    <filter id="claySoftShadowPos4" x="-15%" y="-15%" width="130%" height="135%">
                                      <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#7C2D12" floodOpacity="0.22" />
                                      <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#431407" floodOpacity="0.14" />
                                    </filter>

                                    {/* 1. Clay Wadah Panci Pemanas Oranye-Koral Hangat */}
                                    <radialGradient id="clayPotBodyPos4" cx="32%" cy="24%" r="72%">
                                      <stop offset="0%" stopColor="#FFEDD5" />
                                      <stop offset="35%" stopColor="#FB923C" />
                                      <stop offset="80%" stopColor="#EA580C" />
                                      <stop offset="100%" stopColor="#9A3412" />
                                    </radialGradient>

                                    {/* 2. Clay Tutup Panci Oranye Keemasan */}
                                    <radialGradient id="clayPotLidPos4" cx="35%" cy="22%" r="72%">
                                      <stop offset="0%" stopColor="#FEF3C7" />
                                      <stop offset="45%" stopColor="#F59E0B" />
                                      <stop offset="85%" stopColor="#D97706" />
                                      <stop offset="100%" stopColor="#92400E" />
                                    </radialGradient>

                                    {/* 3. Clay Air di Dalam Panci (Wujud Cair) */}
                                    <linearGradient id="clayWaterInsidePos4" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#BAE6FD" />
                                      <stop offset="45%" stopColor="#38BDF8" />
                                      <stop offset="100%" stopColor="#0284C7" />
                                    </linearGradient>

                                    {/* 4. Clay Api Hangat Kartun 3D - Lapisan Luar (Merah-Oranye) */}
                                    <radialGradient id="clayFlameOuterPos4" cx="50%" cy="68%" r="68%">
                                      <stop offset="0%" stopColor="#FDBA74" />
                                      <stop offset="45%" stopColor="#F97316" />
                                      <stop offset="85%" stopColor="#EF4444" />
                                      <stop offset="100%" stopColor="#B91C1C" />
                                    </radialGradient>

                                    {/* 5. Clay Api Hangat Kartun 3D - Lapisan Tengah (Oranye Keemasan) */}
                                    <radialGradient id="clayFlameMidPos4" cx="50%" cy="70%" r="65%">
                                      <stop offset="0%" stopColor="#FEF08A" />
                                      <stop offset="50%" stopColor="#FB923C" />
                                      <stop offset="100%" stopColor="#EA580C" />
                                    </radialGradient>

                                    {/* 6. Clay Api Hangat Kartun 3D - Inti Dalam (Kuning Keemasan Pastel) */}
                                    <radialGradient id="clayFlameCorePos4" cx="50%" cy="72%" r="60%">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="45%" stopColor="#FEF08A" />
                                      <stop offset="85%" stopColor="#FACC15" />
                                      <stop offset="100%" stopColor="#F59E0B" />
                                    </radialGradient>

                                    {/* 7. Clay Kayu Bakar Cokelat Hangat */}
                                    <linearGradient id="clayWoodLogPos4" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#B45309" />
                                      <stop offset="50%" stopColor="#78350F" />
                                      <stop offset="100%" stopColor="#451A03" />
                                    </linearGradient>

                                    {/* 8. Clay Dudukan Kompor Slate */}
                                    <linearGradient id="clayStoveBasePos4" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#475569" />
                                      <stop offset="55%" stopColor="#1E293B" />
                                      <stop offset="100%" stopColor="#0F172A" />
                                    </linearGradient>
                                  </defs>

                                  {/* Aura Hangat Kalor di Latar Belakang */}
                                  <circle cx="140" cy="145" r="78" fill="#FDE68A" opacity="0.35" />
                                  <circle cx="140" cy="165" r="52" fill="#FDBA74" opacity="0.3" />

                                  {/* =========================================================
                                      1. PANCI A (KIRI ATAS): VOLUME AIR BANYAK + TERMOMETER A
                                      (Merujuk Gambar Referensi Panci A & Panci B)
                                      ========================================================= */}
                                  <g filter="url(#claySoftShadowPos4)">
                                    {/* Label Lencana PANCI A */}
                                    <rect x="20" y="25" width="60" height="15" rx="7.5" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
                                    <text x="50" y="35.5" textAnchor="middle" fill="#9A3412" fontSize="8.5" fontWeight="900">PANCI A</text>

                                    {/* Uap Air Tipis Panci A */}
                                    <path d="M40 50 Q38 44 42 41" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
                                    <path d="M58 49 Q56 43 60 40" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />

                                    {/* Gagang Kiri & Kanan Panci A */}
                                    <rect x="8" y="69" width="11" height="6" rx="3" fill="url(#clayStoveBasePos4)" />
                                    <rect x="81" y="69" width="11" height="6" rx="3" fill="url(#clayStoveBasePos4)" />

                                    {/* Tutup Panci A 3D Clay */}
                                    <path d="M18 62 C18 54 82 54 82 62 Z" fill="url(#clayPotLidPos4)" />
                                    <rect x="43" y="50" width="14" height="5" rx="2.5" fill="url(#clayStoveBasePos4)" />
                                    <path d="M26 59 Q50 55 74 59" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9" />

                                    {/* Badan Wadah Panci A (Besar) 3D Clay */}
                                    <rect x="16" y="61" width="68" height="46" rx="11" fill="url(#clayPotBodyPos4)" />
                                    {/* Inner Highlight Putih Panci A */}
                                    <path d="M22 65 L78 65" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />

                                    {/* Jendela Cutaway Air Banyak di Panci A */}
                                    <rect x="22" y="69" width="56" height="33" rx="7" fill="#E0F2FE" stroke="#FED7AA" strokeWidth="1.2" />
                                    {/* Air Biru Penuh (Tinggi) */}
                                    <rect x="23" y="74" width="54" height="27" rx="6" fill="url(#clayWaterInsidePos4)" />
                                    <path d="M25 76 Q37 73 50 76 T75 76" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.92" />
                                    {/* Gelembung Kalor Air Panci A */}
                                    <circle cx="34" cy="93" r="2.2" fill="#E0F2FE" opacity="0.85" />
                                    <circle cx="50" cy="89" r="2.6" fill="#FFFFFF" opacity="0.9" />
                                    <circle cx="64" cy="94" r="2" fill="#E0F2FE" opacity="0.85" />
                                    <text x="50" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900">AIR BANYAK</text>

                                    {/* Dudukan Tungku & Api Pemanas Panci A */}
                                    <rect x="22" y="107" width="56" height="6" rx="3" fill="url(#clayStoveBasePos4)" />
                                    <path d="M32 122 C29 115 34 109 39 113 C41 106 49 106 51 113 C55 108 61 114 58 122 Z" fill="url(#clayFlameOuterPos4)" />
                                    <path d="M37 122 C35 116 40 112 45 109 C50 112 54 116 52 122 Z" fill="url(#clayFlameCorePos4)" />
                                    <rect x="18" y="121" width="64" height="5" rx="2.5" fill="url(#clayStoveBasePos4)" />

                                    {/* Termometer Panci A (Suhu Sedang ~65°C) */}
                                    <rect x="97" y="54" width="11" height="52" rx="5.5" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="1.8" />
                                    <circle cx="102.5" cy="105" r="7.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.8" />
                                    <rect x="100.3" y="76" width="4.4" height="26" rx="2.2" fill="#EF4444" />
                                    <line x1="100" y1="63" x2="105" y2="63" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                                    <line x1="100" y1="71" x2="105" y2="71" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                                    <line x1="100" y1="79" x2="105" y2="79" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                                    <circle cx="100.5" cy="103" r="2" fill="#FFFFFF" opacity="0.9" />
                                  </g>

                                  {/* =========================================================
                                      2. PANCI B (KANAN ATAS): VOLUME AIR SEDIKIT + TERMOMETER B
                                      (Air sedikit lebih cepat panas & menguap jadi wujud gas!)
                                      ========================================================= */}
                                  <g filter="url(#claySoftShadowPos4)">
                                    {/* Label Lencana PANCI B */}
                                    <rect x="174" y="25" width="60" height="15" rx="7.5" fill="#FFFBEB" stroke="#EA580C" strokeWidth="1.5" />
                                    <text x="204" y="35.5" textAnchor="middle" fill="#9A3412" fontSize="8.5" fontWeight="900">PANCI B</text>

                                    {/* Gumpalan Uap Gas 3D Clay Mengepul (Perubahan Wujud Cair ➔ Gas) */}
                                    <circle cx="192" cy="48" r="5.5" fill="#FFFFFF" opacity="0.92" />
                                    <circle cx="204" cy="44" r="7" fill="#FFFFFF" opacity="0.96" />
                                    <circle cx="216" cy="48" r="5.5" fill="#FFFFFF" opacity="0.92" />
                                    <path d="M199 40 A5 5 0 0 1 209 40" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                                    {/* Gagang Kiri & Kanan Panci B */}
                                    <rect x="165" y="75" width="10" height="6" rx="3" fill="url(#clayStoveBasePos4)" />
                                    <rect x="233" y="75" width="10" height="6" rx="3" fill="url(#clayStoveBasePos4)" />

                                    {/* Tutup Panci B Terangkat Sedikit karena Mendidih */}
                                    <g transform="rotate(-4 204 64)">
                                      <path d="M174 68 C174 60 234 60 234 68 Z" fill="url(#clayPotLidPos4)" />
                                      <rect x="197" y="56" width="14" height="5" rx="2.5" fill="url(#clayStoveBasePos4)" />
                                      <path d="M182 65 Q204 61 226 65" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9" />
                                    </g>

                                    {/* Badan Wadah Panci B 3D Clay */}
                                    <rect x="172" y="67" width="64" height="40" rx="11" fill="url(#clayPotBodyPos4)" />
                                    {/* Inner Highlight Putih Panci B */}
                                    <path d="M178 71 L230 71" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />

                                    {/* Jendela Cutaway Air Sedikit di Panci B */}
                                    <rect x="178" y="74" width="52" height="28" rx="7" fill="#E0F2FE" stroke="#FED7AA" strokeWidth="1.2" />
                                    {/* Air Biru Sedikit ( Setengah Volume - Cepat Panas!) */}
                                    <rect x="179" y="86" width="50" height="15" rx="5" fill="url(#clayWaterInsidePos4)" />
                                    <path d="M181 88 Q192 85 204 88 T227 88" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.95" />
                                    {/* Gelembung Mendidih Banyak */}
                                    <circle cx="189" cy="94" r="2.5" fill="#FFFFFF" opacity="0.95" />
                                    <circle cx="199" cy="91" r="3" fill="#FFFFFF" opacity="0.95" />
                                    <circle cx="210" cy="93" r="2.6" fill="#FFFFFF" opacity="0.95" />
                                    <circle cx="219" cy="91" r="2.2" fill="#E0F2FE" opacity="0.95" />
                                    <text x="204" y="82" textAnchor="middle" fill="#0369A1" fontSize="6" fontWeight="900">AIR SEDIKIT</text>

                                    {/* Dudukan Tungku & Api Pemanas Panci B */}
                                    <rect x="176" y="107" width="56" height="6" rx="3" fill="url(#clayStoveBasePos4)" />
                                    <path d="M186 122 C183 115 188 109 193 113 C195 106 203 106 205 113 C209 108 215 114 212 122 Z" fill="url(#clayFlameOuterPos4)" />
                                    <path d="M191 122 C189 116 194 112 199 109 C204 112 208 116 206 122 Z" fill="url(#clayFlameCorePos4)" />
                                    <rect x="172" y="121" width="64" height="5" rx="2.5" fill="url(#clayStoveBasePos4)" />

                                    {/* Termometer Panci B (Suhu Tinggi Mendidih ~98°C!) */}
                                    <rect x="249" y="54" width="11" height="52" rx="5.5" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1.8" />
                                    <circle cx="254.5" cy="105" r="7.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.8" />
                                    {/* Raksa Merah Tinggi Penuh */}
                                    <rect x="252.3" y="60" width="4.4" height="42" rx="2.2" fill="#EF4444" />
                                    <line x1="252" y1="63" x2="257" y2="63" stroke="#FECACA" strokeWidth="1.2" strokeLinecap="round" />
                                    <line x1="252" y1="71" x2="257" y2="71" stroke="#FECACA" strokeWidth="1.2" strokeLinecap="round" />
                                    <line x1="252" y1="79" x2="257" y2="79" stroke="#FECACA" strokeWidth="1.2" strokeLinecap="round" />
                                    <circle cx="252.5" cy="103" r="2" fill="#FFFFFF" opacity="0.9" />
                                    {/* Indikator Panas Tinggi */}
                                    <text x="254.5" y="49" textAnchor="middle" fill="#DC2626" fontSize="7.5" fontWeight="900">PANAS!</text>
                                  </g>

                                  {/* =========================================================
                                      3. API UNGGUN HANGAT KARTUN 3D DI TENGAH BAWAH
                                      (Merujuk Gambar Referensi Api Kartun 3D & Kayu Menyilang)
                                      ========================================================= */}
                                  <g filter="url(#claySoftShadowPos4)">
                                    {/* Kayu Bakar Menyilang 3D Clay */}
                                    <g transform="rotate(-14 140 198)">
                                      <rect x="92" y="191" width="96" height="15" rx="7.5" fill="url(#clayWoodLogPos4)" />
                                      <path d="M100 194 L178 194" stroke="#FDE68A" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                                      <circle cx="95" cy="198.5" r="6.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
                                      <circle cx="95" cy="198.5" r="3" fill="none" stroke="#B45309" strokeWidth="1.2" />
                                    </g>
                                    <g transform="rotate(14 140 198)">
                                      <rect x="92" y="191" width="96" height="15" rx="7.5" fill="url(#clayWoodLogPos4)" />
                                      <path d="M100 194 L178 194" stroke="#FDE68A" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                                      <circle cx="185" cy="198.5" r="6.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
                                      <circle cx="185" cy="198.5" r="3" fill="none" stroke="#B45309" strokeWidth="1.2" />
                                    </g>

                                    {/* Lapisan 1: Api Luar Merah-Oranye Empuk 3D Clay */}
                                    <path
                                      d="M104 195 C90 174 102 146 116 154 C118 130 134 114 142 104 C154 118 162 136 162 152 C174 142 188 168 176 195 Z"
                                      fill="url(#clayFlameOuterPos4)"
                                    />
                                    {/* Inner Highlight Putih Api Luar */}
                                    <path
                                      d="M124 134 C129 123 135 115 141 109"
                                      stroke="#FFFFFF"
                                      strokeWidth="2.8"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.88"
                                    />
                                    <path
                                      d="M103 170 C102 162 106 155 112 153"
                                      stroke="#FFFFFF"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.8"
                                    />

                                    {/* Lapisan 2: Api Tengah Oranye Hangat 3D Clay */}
                                    <path
                                      d="M114 195 C106 178 115 158 125 163 C128 144 136 132 142 124 C150 134 155 148 154 162 C163 156 172 176 166 195 Z"
                                      fill="url(#clayFlameMidPos4)"
                                    />

                                    {/* Lapisan 3: Inti Api Kuning Keemasan Pastel 3D Clay */}
                                    <path
                                      d="M124 195 C119 182 126 166 141 146 C154 166 161 182 156 195 Z"
                                      fill="url(#clayFlameCorePos4)"
                                    />
                                    {/* Kilau Putih Inti Api */}
                                    <path
                                      d="M132 174 C134 165 137 158 141 153"
                                      stroke="#FFFFFF"
                                      strokeWidth="2.4"
                                      strokeLinecap="round"
                                      fill="none"
                                      opacity="0.95"
                                    />

                                    {/* Percikan Bara Api 3D Bulat Mengambang */}
                                    <circle cx="96" cy="142" r="4" fill="#FB923C" />
                                    <circle cx="95" cy="141" r="1.4" fill="#FFFFFF" opacity="0.9" />
                                    <circle cx="182" cy="138" r="4.5" fill="#FACC15" />
                                    <circle cx="180.8" cy="136.8" r="1.5" fill="#FFFFFF" opacity="0.9" />
                                    <circle cx="164" cy="118" r="3.2" fill="#F97316" />
                                    <circle cx="116" cy="122" r="3" fill="#FDE047" />
                                  </g>

                                  {/* Lencana Wujud Benda di Bawah: PADAT ➔ CAIR ➔ GAS */}
                                  <g filter="url(#claySoftShadowPos4)">
                                    <rect x="6" y="152" width="76" height="22" rx="11" fill="#E0F2FE" stroke="#FFFFFF" strokeWidth="1.8" />
                                    <text x="44" y="166" textAnchor="middle" fill="#0369A1" fontSize="7.8" fontWeight="900">🧊 PADAT ➔ CAIR</text>

                                    <rect x="198" y="152" width="76" height="22" rx="11" fill="#FEF3C7" stroke="#FFFFFF" strokeWidth="1.8" />
                                    <text x="236" y="166" textAnchor="middle" fill="#B45309" fontSize="7.8" fontWeight="900">💧 CAIR ➔ GAS ♨️</text>
                                  </g>
                                </svg>
                              </div>

                              {/* Lencana Penjelasan Energi Panas & Wujud Benda Bergaya Bright Claymorphism 3D */}
                              <div className="flex-1 text-left space-y-2 w-full">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_4px_10px_rgba(234,88,12,0.35),inset_0_2px_3px_rgba(255,255,255,0.65)] w-fit">
                                  🔥 Energi Panas Api &amp; Wujud Benda 3D
                                </div>

                                {/* Pill 1: Sumber Energi Panas & Api 3D */}
                                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 border border-amber-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-red-500 text-xs text-white shadow-sm">
                                    🔥
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Energi Panas (Kalor Api 3D)</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Kalor mengalir dari api menghangatkan panci</p>
                                  </div>
                                </div>

                                {/* Pill 2: Eksperimen Panci A & Panci B */}
                                <div className="flex items-center gap-2 rounded-2xl bg-orange-50 px-3 py-1.5 border border-orange-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-orange-400 to-orange-600 text-xs text-white shadow-sm">
                                    🌡️
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Panci A vs Panci B (Termometer)</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Air sedikit di Panci B lebih cepat naik suhunya</p>
                                  </div>
                                </div>

                                {/* Pill 3: Perubahan Wujud Padat, Cair & Gas */}
                                <div className="flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1.5 border border-sky-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 text-xs text-white shadow-sm">
                                    ♨️
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Perubahan Wujud Benda</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Mencair (Es ➔ Air) &amp; Menguap (Air ➔ Gas)</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PANEL ILUSTRASI CLAYMORPHISM 3D DIAGRAM TATA SURYA LENGKAP & GRAVITASI (KHUSUS POS 5 - PUNCAK GALAKSI) */}
                        {isPos5 && (
                          <div
                            className="mt-3 rounded-3xl bg-white/95 p-3 border-2 border-indigo-200 shadow-sm"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                          >
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              {/* Panggung Clay 3D: Diagram Tata Surya Lengkap (Matahari Emas, Jalur Orbit Melingkar & Bola Planet 3D Empuk hingga Saturnus Bercincin) */}
                              <div className="relative flex-shrink-0 rounded-3xl bg-gradient-to-b from-[#090D16] via-[#1E1B4B] to-[#312E81] p-2 border-2 border-indigo-200/90 shadow-md overflow-hidden">
                                <span className="absolute top-1.5 left-2 z-10 rounded-full bg-indigo-950/90 border border-[#FACC15]/70 px-2 py-0.5 text-[8.5px] font-black text-[#FACC15] shadow-sm">
                                  🪐 3D CLAY TATA SURYA
                                </span>
                                <svg
                                  viewBox="0 0 280 225"
                                  className="h-40 w-44 sm:h-44 sm:w-48 mx-auto drop-shadow-[0_10px_18px_rgba(15,23,42,0.6)]"
                                  role="img"
                                  aria-label="Ilustrasi Claymorphism 3D Diagram Tata Surya Lengkap dengan Matahari Emas, Jalur Orbit Melingkar, Bola Planet 3D Empuk, dan Saturnus Bercincin"
                                >
                                  <defs>
                                    {/* Filter Deep Soft Clay Drop Shadow untuk Planet 3D */}
                                    <filter id="claySoftShadowPos5" x="-20%" y="-20%" width="140%" height="145%">
                                      <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#020617" floodOpacity="0.65" />
                                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#312E81" floodOpacity="0.4" />
                                    </filter>

                                    {/* 1. Clay Matahari Emas Bersinar (Warm Star Yellow & Golden Orange) */}
                                    <radialGradient id="claySunGoldPos5" cx="35%" cy="28%" r="70%">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="28%" stopColor="#FEF08A" />
                                      <stop offset="65%" stopColor="#FACC15" />
                                      <stop offset="90%" stopColor="#F97316" />
                                      <stop offset="100%" stopColor="#C2410C" />
                                    </radialGradient>

                                    {/* 2. Clay Planet Merkurius (Pastel Lavender-Silver) */}
                                    <radialGradient id="clayMercuryPos5" cx="32%" cy="28%" r="70%">
                                      <stop offset="0%" stopColor="#F8FAFC" />
                                      <stop offset="50%" stopColor="#CBD5E1" />
                                      <stop offset="85%" stopColor="#94A3B8" />
                                      <stop offset="100%" stopColor="#475569" />
                                    </radialGradient>

                                    {/* 3. Clay Planet Venus (Pastel Peach-Amber) */}
                                    <radialGradient id="clayVenusPos5" cx="32%" cy="28%" r="70%">
                                      <stop offset="0%" stopColor="#FFFBEB" />
                                      <stop offset="45%" stopColor="#FDE68A" />
                                      <stop offset="85%" stopColor="#F59E0B" />
                                      <stop offset="100%" stopColor="#B45309" />
                                    </radialGradient>

                                    {/* 4. Clay Planet Bumi (Sky Blue & Emerald Green) */}
                                    <radialGradient id="clayEarthPos5" cx="32%" cy="25%" r="72%">
                                      <stop offset="0%" stopColor="#E0F2FE" />
                                      <stop offset="45%" stopColor="#38BDF8" />
                                      <stop offset="85%" stopColor="#0284C7" />
                                      <stop offset="100%" stopColor="#0C4A6E" />
                                    </radialGradient>

                                    {/* 5. Clay Planet Mars (Coral Red Pastel) */}
                                    <radialGradient id="clayMarsPos5" cx="32%" cy="26%" r="72%">
                                      <stop offset="0%" stopColor="#FFE4E6" />
                                      <stop offset="45%" stopColor="#FB7185" />
                                      <stop offset="85%" stopColor="#E11D48" />
                                      <stop offset="100%" stopColor="#881337" />
                                    </radialGradient>

                                    {/* 6. Clay Planet Jupiter (Raksasa Oranye-Karamel Pastel) */}
                                    <radialGradient id="clayJupiterPos5" cx="32%" cy="25%" r="72%">
                                      <stop offset="0%" stopColor="#FFF7ED" />
                                      <stop offset="40%" stopColor="#FDBA74" />
                                      <stop offset="78%" stopColor="#EA580C" />
                                      <stop offset="100%" stopColor="#7C2D12" />
                                    </radialGradient>

                                    {/* 7. Clay Planet Saturnus (Emas-Krem Pastel) & Cincin 3D */}
                                    <radialGradient id="claySaturnBodyPos5" cx="32%" cy="25%" r="72%">
                                      <stop offset="0%" stopColor="#FEFCE8" />
                                      <stop offset="45%" stopColor="#FDE047" />
                                      <stop offset="82%" stopColor="#D97706" />
                                      <stop offset="100%" stopColor="#78350F" />
                                    </radialGradient>
                                    <linearGradient id="claySaturnRingPos5" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#FEF08A" />
                                      <stop offset="45%" stopColor="#FDBA74" />
                                      <stop offset="75%" stopColor="#C4B5FD" />
                                      <stop offset="100%" stopColor="#38BDF8" />
                                    </linearGradient>

                                    {/* 8. Clay Planet Uranus & Neptunus (Cyan & Indigo Pastel) */}
                                    <radialGradient id="clayUranusPos5" cx="32%" cy="26%" r="72%">
                                      <stop offset="0%" stopColor="#ECFEFF" />
                                      <stop offset="48%" stopColor="#67E8F9" />
                                      <stop offset="85%" stopColor="#0891B2" />
                                      <stop offset="100%" stopColor="#164E63" />
                                    </radialGradient>
                                    <radialGradient id="clayNeptunePos5" cx="32%" cy="26%" r="72%">
                                      <stop offset="0%" stopColor="#EEF2FF" />
                                      <stop offset="48%" stopColor="#818CF8" />
                                      <stop offset="85%" stopColor="#4F46E5" />
                                      <stop offset="100%" stopColor="#1E1B4B" />
                                    </radialGradient>
                                  </defs>

                                  {/* Nebula Galaksi Lembut & Bintang-Bintang 3D di Latar Malam Galaksi */}
                                  <ellipse cx="155" cy="110" rx="115" ry="78" fill="#4338CA" opacity="0.2" />
                                  <circle cx="42" cy="118" r="56" fill="#FACC15" opacity="0.14" />
                                  <circle cx="24" cy="40" r="1.8" fill="#FDE047" opacity="0.9" />
                                  <circle cx="132" cy="18" r="2.2" fill="#E0F2FE" opacity="0.95" />
                                  <circle cx="255" cy="24" r="2" fill="#FDE047" opacity="0.9" />
                                  <circle cx="264" cy="142" r="1.8" fill="#C4B5FD" opacity="0.85" />
                                  <circle cx="72" cy="198" r="1.8" fill="#E0F2FE" opacity="0.85" />

                                  {/* =========================================================
                                      1. JALUR ORBIT MELINGKAR / ELIPS RAPI MENGELILINGI MATAHARI
                                      ========================================================= */}
                                  <g opacity="0.72">
                                    {/* Orbit 1: Merkurius */}
                                    <ellipse cx="38" cy="118" rx="48" ry="34" fill="none" stroke="#94A3B8" strokeWidth="1.3" strokeDasharray="3 3" />
                                    {/* Orbit 2: Venus */}
                                    <ellipse cx="38" cy="118" rx="74" ry="50" fill="none" stroke="#FDE68A" strokeWidth="1.4" strokeDasharray="4 3" />
                                    {/* Orbit 3: Bumi */}
                                    <ellipse cx="38" cy="118" rx="104" ry="66" fill="none" stroke="#38BDF8" strokeWidth="1.7" strokeDasharray="5 4" />
                                    {/* Orbit 4: Mars */}
                                    <ellipse cx="38" cy="118" rx="134" ry="80" fill="none" stroke="#FB7185" strokeWidth="1.4" strokeDasharray="4 4" />
                                    {/* Orbit 5: Jupiter */}
                                    <ellipse cx="38" cy="118" rx="168" ry="93" fill="none" stroke="#FDBA74" strokeWidth="1.6" strokeDasharray="6 4" />
                                    {/* Orbit 6: Saturnus */}
                                    <ellipse cx="38" cy="118" rx="204" ry="104" fill="none" stroke="#C4B5FD" strokeWidth="1.8" strokeDasharray="6 4" />
                                    {/* Orbit 7: Uranus & Neptunus */}
                                    <ellipse cx="38" cy="118" rx="236" ry="114" fill="none" stroke="#67E8F9" strokeWidth="1.4" strokeDasharray="4 4" />
                                  </g>

                                  {/* =========================================================
                                      2. MATAHARI EMAS BERSINAR 3D CLAY (PUSAT GRAVITASI)
                                      ========================================================= */}
                                  <g filter="url(#claySoftShadowPos5)">
                                    {/* Korona Sinar Matahari Empuk */}
                                    <circle cx="38" cy="118" r="34" fill="#F59E0B" opacity="0.28" />
                                    <circle cx="38" cy="118" r="28" fill="url(#claySunGoldPos5)" />
                                    {/* Inner Highlight Putih Matahari 3D */}
                                    <path d="M20 99 A22 22 0 0 1 54 99" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.95" />
                                    {/* Wajah Ramah Matahari (Opsional Halus & Ramah Anak SD) */}
                                    <circle cx="32" cy="115" r="2.3" fill="#7C2D12" />
                                    <circle cx="31.2" cy="114.2" r="0.9" fill="#FFFFFF" />
                                    <circle cx="45" cy="115" r="2.3" fill="#7C2D12" />
                                    <circle cx="44.2" cy="114.2" r="0.9" fill="#FFFFFF" />
                                    <path d="M34 122 Q38.5 126 43 122" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" fill="none" />
                                    {/* Label MATAHARI */}
                                    <rect x="10" y="150" width="56" height="13" rx="6.5" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.2" />
                                    <text x="38" y="159" textAnchor="middle" fill="#92400E" fontSize="7" fontWeight="900">MATAHARI</text>
                                  </g>

                                  {/* =========================================================
                                      3. BOLA-BOLA PLANET 3D BERTEKSTUR EMPUK DI JALUR ORBIT
                                      ========================================================= */}
                                  <g filter="url(#claySoftShadowPos5)">
                                    {/* Planet 1: Merkurius */}
                                    <circle cx="78" cy="96" r="6.5" fill="url(#clayMercuryPos5)" />
                                    <path d="M74 92 A5 5 0 0 1 82 92" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.9" />

                                    {/* Planet 2: Venus */}
                                    <circle cx="96" cy="148" r="8.5" fill="url(#clayVenusPos5)" />
                                    <path d="M90 142 A6.5 6.5 0 0 1 101 142" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9" />

                                    {/* Planet 3: Bumi 3D + Bulan Kecil */}
                                    <circle cx="122" cy="76" r="11.5" fill="url(#clayEarthPos5)" />
                                    {/* Benua Hijau 3D Clay di Bumi */}
                                    <path d="M115 72 C119 69 124 71 125 75 C126 79 121 83 116 80 Z" fill="#34D399" />
                                    <path d="M125 77 C128 76 131 79 129 83 C126 84 124 81 125 77 Z" fill="#10B981" />
                                    {/* Inner Highlight Putih Bumi */}
                                    <path d="M114 68 A9 9 0 0 1 129 68" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.95" />
                                    {/* Bulan Kecil Mengorbit Bumi */}
                                    <circle cx="137" cy="66" r="3.2" fill="#E2E8F0" />
                                    <circle cx="136" cy="65" r="1" fill="#FFFFFF" />
                                    <text x="122" y="96" textAnchor="middle" fill="#BAE6FD" fontSize="6.8" fontWeight="900">BUMI</text>

                                    {/* Planet 4: Mars (Planet Merah Pastel) */}
                                    <circle cx="152" cy="158" r="9.5" fill="url(#clayMarsPos5)" />
                                    <circle cx="155" cy="160" r="2" fill="#BE123C" opacity="0.55" />
                                    <path d="M146 151 A7.5 7.5 0 0 1 158 151" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.9" />
                                    <text x="152" y="176" textAnchor="middle" fill="#FECDD3" fontSize="6.5" fontWeight="900">MARS</text>

                                    {/* Planet 5: Jupiter (Planet Raksasa Belang Oranye-Krem) */}
                                    <circle cx="182" cy="56" r="16" fill="url(#clayJupiterPos5)" />
                                    {/* Sabuk Awan Jupiter Pastel */}
                                    <path d="M167 52 Q182 56 197 52" stroke="#FEF3C7" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.8" />
                                    <path d="M168 59 Q182 63 196 59" stroke="#FDE68A" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
                                    {/* Bintik Merah Besar Jupiter */}
                                    <ellipse cx="187" cy="61" rx="3.8" ry="2.4" fill="#E11D48" opacity="0.85" />
                                    {/* Inner Highlight Putih Jupiter */}
                                    <path d="M171 44 A13 13 0 0 1 193 44" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" fill="none" opacity="0.95" />
                                    <text x="182" y="81" textAnchor="middle" fill="#FED7AA" fontSize="6.8" fontWeight="900">JUPITER</text>

                                    {/* Planet 6: SATURNUS BERCINCIN 3D CLAY (Bintang Utama di Kanan Tengah) */}
                                    <g transform="rotate(-16 218 128)">
                                      {/* Cincin Belakang Saturnus */}
                                      <path
                                        d="M184 128 A34 11 0 0 1 252 128"
                                        fill="none"
                                        stroke="url(#claySaturnRingPos5)"
                                        strokeWidth="6.5"
                                        strokeLinecap="round"
                                        opacity="0.85"
                                      />
                                      {/* Bola Planet Saturnus 3D Empuk */}
                                      <circle cx="218" cy="128" r="16.5" fill="url(#claySaturnBodyPos5)" />
                                      {/* Sabuk Halus Saturnus */}
                                      <path d="M203 125 Q218 129 233 125" stroke="#FFFBEB" strokeWidth="2.4" fill="none" opacity="0.7" />
                                      {/* Inner Highlight Putih Bola Saturnus */}
                                      <path d="M207 116 A13 13 0 0 1 229 116" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95" />
                                      {/* Cincin Depan Saturnus Berlapis 3D Clay */}
                                      <path
                                        d="M252 128 A34 11 0 0 1 184 128"
                                        fill="none"
                                        stroke="url(#claySaturnRingPos5)"
                                        strokeWidth="7"
                                        strokeLinecap="round"
                                      />
                                      {/* Inner Highlight Putih Cincin Saturnus */}
                                      <path
                                        d="M248 129 A30 9.5 0 0 1 188 129"
                                        fill="none"
                                        stroke="#FFFFFF"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        opacity="0.9"
                                      />
                                    </g>
                                    <rect x="191" y="151" width="54" height="13" rx="6.5" fill="#312E81" stroke="#FDE047" strokeWidth="1.2" />
                                    <text x="218" y="160" textAnchor="middle" fill="#FEF08A" fontSize="6.8" fontWeight="900">SATURNUS</text>

                                    {/* Planet 7: Uranus (Biru Es Pastel) */}
                                    <circle cx="246" cy="64" r="9.5" fill="url(#clayUranusPos5)" />
                                    <ellipse cx="246" cy="64" rx="14" ry="4" transform="rotate(-65 246 64)" fill="none" stroke="#CFFAFE" strokeWidth="1.5" opacity="0.8" />
                                    <path d="M240 57 A7.5 7.5 0 0 1 252 57" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.92" />

                                    {/* Planet 8: Neptunus (Biru Indigo Galaksi) */}
                                    <circle cx="256" cy="182" r="9" fill="url(#clayNeptunePos5)" />
                                    <path d="M250 176 A7 7 0 0 1 262 176" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.92" />
                                  </g>

                                  {/* Lencana Info Gravitasi & Orbit di Bagian Bawah Panggung */}
                                  <g filter="url(#claySoftShadowPos5)">
                                    <rect x="10" y="195" width="126" height="21" rx="10.5" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
                                    <text x="73" y="208.5" textAnchor="middle" fill="#E0E7FF" fontSize="7.5" fontWeight="900">🧲 GRAVITASI MATAHARI</text>

                                    <rect x="144" y="195" width="126" height="21" rx="10.5" fill="#312E81" stroke="#FACC15" strokeWidth="1.5" />
                                    <text x="207" y="208.5" textAnchor="middle" fill="#FEF08A" fontSize="7.5" fontWeight="900">🪐 8 PLANET BERORBIT</text>
                                  </g>
                                </svg>
                              </div>

                              {/* Lencana Penjelasan Tata Surya & Gravitasi Bergaya Bright Claymorphism 3D */}
                              <div className="flex-1 text-left space-y-2 w-full">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(99,102,241,0.45),inset_0_2px_3px_rgba(255,255,255,0.65)] w-fit">
                                  🪐 Tata Surya &amp; Gravitasi 3D
                                </div>

                                {/* Pill 1: Matahari Pusat Gravitasi */}
                                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 border border-amber-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-orange-500 text-xs text-white shadow-sm">
                                    ☀️
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Matahari &amp; Gaya Gravitasi</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Tarikan gravitasi menjaga planet tetap di orbit</p>
                                  </div>
                                </div>

                                {/* Pill 2: Susunan 8 Planet 3D */}
                                <div className="flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1.5 border border-sky-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-indigo-600 text-xs text-white shadow-sm">
                                    🌍
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">8 Bola Planet Berorbit Melingkar</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Merkurius, Venus, Bumi, Mars hingga Neptunus</p>
                                  </div>
                                </div>

                                {/* Pill 3: Cincin Saturnus & Planet Raksasa */}
                                <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-1.5 border border-indigo-200 shadow-sm">
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-purple-500 to-indigo-800 text-xs text-white shadow-sm">
                                    🪐
                                  </span>
                                  <div className="leading-tight">
                                    <p className="text-[11px] font-black text-[#0F172A]">Saturnus Bercincin &amp; Raksasa Gas</p>
                                    <p className="text-[10px] font-bold text-[#475569]">Cincin indah dari jutaan bongkahan es &amp; debu</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2">
                              <p
                                className={`text-[11px] font-extrabold tabular-nums ${
                                  isCompleted
                                    ? 'text-emerald-800'
                                    : isActive
                                    ? 'text-[#0284C7]'
                                    : isPos4
                                    ? 'text-orange-900'
                                    : 'text-indigo-900'
                                }`}
                              >
                                {isCompleted
                                  ? `✅ Selesai (Hijau) · +${node.starReward} ⭐`
                                  : isActive
                                  ? `🌟 Pos Aktif (Atmosfer) · +${node.starReward} ⭐`
                                  : `🔒 Terkunci #${node.id} · +${node.starReward} ⭐`}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleNodeClick(node)}
                                className={`rounded-xl px-3 py-1 text-[10px] font-black shadow-sm transition-transform hover:scale-105 cursor-pointer ${
                                  isActive
                                    ? 'bg-[#FACC15] text-[#0F172A] border border-amber-400'
                                    : isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-indigo-600 text-white'
                                }`}
                              >
                                {isCompleted || isActive ? `🎮 Mulai Kuis Pos #${node.id}` : '🔒 Info Pos'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Badge Penanda Dasar Bumi (Bottom Zone Indicator) */}
              <div className="relative z-10 mt-2 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-300 bg-white/95 px-4 py-1.5 text-xs font-extrabold text-emerald-950 shadow-md backdrop-blur-md">
                  🌍 DASAR PETA ( TITIK AWAL ): ZONA PERMUKAAN BUMI &amp; EKOSISTEM HIJAU (POS 1 &amp; POS 2) 🌿
                </span>
              </div>
            </section>
          </main>

          {/* =================================================================
              3. PANEL KANAN (Widgets, lg:col-span-4) — WAJIB GELAP GALAKSI (COSMIC DARK)
              - Podium Penjelajah Terbaik (Liga Bintang M-ONE: Emas #1, Perak #2, Perunggu #3)
              - Widget Target Harian & Statistik Kadet
              ================================================================= */}
          <aside id="right-cosmic-panel" className="lg:col-span-4 space-y-6">
            {/* Widget 1: Podium Penjelajah Terbaik / Leaderboard (Forced Cosmic Dark Galaxy Card) */}
            <section
              id="podium-widget"
              aria-label="Podium Penjelajah Terbaik"
              className="cosmic-dark-card rounded-3xl border-2 border-indigo-400/60 bg-slate-950 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 p-6 text-white relative overflow-hidden"
              style={{
                backgroundColor: '#020617',
                backgroundImage:
                  'linear-gradient(180deg, #020617 0%, #1E1B4B 52%, #090D1F 100%)',
                color: '#FFFFFF',
                borderColor: 'rgba(129, 140, 248, 0.65)',
                boxShadow:
                  '0 24px 50px rgba(2, 6, 23, 0.45), 0 0 28px rgba(99, 102, 241, 0.28), inset 0 2px 6px rgba(255, 255, 255, 0.22), inset 0 -6px 16px rgba(2, 6, 23, 0.9)',
              }}
            >
              {/* Partikel Bintang & Nebula Lembut di Dalam Kartu Gelap Kanan */}
              <div
                className="pointer-events-none absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.95) 1px, transparent 1.6px), radial-gradient(circle, rgba(250,204,21,0.85) 1px, transparent 1.6px)',
                  backgroundSize: '28px 28px, 46px 46px',
                  backgroundPosition: '0 0, 14px 18px',
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl"
                style={{ backgroundColor: 'rgba(56, 189, 248, 0.22)' }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full blur-3xl"
                style={{ backgroundColor: 'rgba(250, 204, 21, 0.16)' }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-extrabold shadow-sm"
                      style={{
                        backgroundColor: 'rgba(250, 204, 21, 0.18)',
                        borderColor: 'rgba(250, 204, 21, 0.65)',
                        color: '#FACC15',
                      }}
                    >
                      🏆 Liga Bintang M-ONE
                    </span>
                    <h2
                      className="mt-1.5 text-lg sm:text-xl font-extrabold tracking-tight"
                      style={{ color: '#FFFFFF' }}
                    >
                      Podium Penjelajah Terbaik
                    </h2>
                  </div>
                  <span
                    className="rounded-xl px-2.5 py-1 text-[11px] font-extrabold border shadow-sm"
                    style={{
                      backgroundColor: 'rgba(14, 165, 233, 0.22)',
                      borderColor: 'rgba(56, 189, 248, 0.55)',
                      color: '#38BDF8',
                    }}
                  >
                    Minggu Ini
                  </span>
                </div>

                {/* Urutan Podium Berjenjang: Perak (#2), Emas (#1 Paling Tinggi), Perunggu (#3) */}
                <div className="mt-6 grid grid-cols-3 items-end gap-2.5 pt-4">
                  {/* Peringkat 2: Podium Perak (Cosmic Metallic Silver-Blue) */}
                  <div className="flex flex-col items-center">
                    <div className="mb-2 flex flex-col items-center text-center">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border-4 text-2xl"
                        style={{
                          borderColor: '#94A3B8',
                          background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
                          boxShadow: '0 6px 14px rgba(56, 189, 248, 0.38)',
                        }}
                      >
                        🐬
                      </div>
                      <span
                        className="mt-1.5 text-xs font-extrabold truncate max-w-[85px]"
                        style={{ color: '#FFFFFF' }}
                      >
                        Bima Sakti
                      </span>
                      <span
                        className="text-[11px] font-extrabold tabular-nums"
                        style={{ color: '#FACC15' }}
                      >
                        ⭐ 1,410
                      </span>
                    </div>
                    <div
                      className="w-full h-24 rounded-t-2xl flex flex-col items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(180deg, #475569 0%, #334155 52%, #1E293B 100%)',
                        borderTop: '4px solid #CBD5E1',
                        color: '#FFFFFF',
                        boxShadow:
                          '0 8px 20px rgba(2, 6, 23, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.35)',
                      }}
                    >
                      <span className="text-2xl font-black leading-none" style={{ color: '#FFFFFF' }}>
                        2
                      </span>
                      <span
                        className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                        style={{ color: '#E2E8F0' }}
                      >
                        Perak
                      </span>
                    </div>
                  </div>

                  {/* Peringkat 1: Podium Emas (Tertinggi di Tengah) */}
                  <div className="flex flex-col items-center">
                    <div className="mb-2 flex flex-col items-center text-center">
                      <span className="text-2xl -mb-1 animate-bounce">👑</span>
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full border-4 text-3xl"
                        style={{
                          borderColor: '#FACC15',
                          background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
                          boxShadow: '0 8px 22px rgba(250, 204, 21, 0.5)',
                        }}
                      >
                        🦊
                      </div>
                      <span
                        className="mt-1.5 text-xs sm:text-sm font-extrabold truncate max-w-[95px]"
                        style={{ color: '#FACC15' }}
                      >
                        Alya Putri
                      </span>
                      <span
                        className="text-[11px] font-extrabold tabular-nums"
                        style={{ color: '#FFFFFF' }}
                      >
                        ⭐ 1,580
                      </span>
                    </div>
                    <div
                      className="w-full h-32 rounded-t-2xl flex flex-col items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(180deg, #FACC15 0%, #F59E0B 55%, #B45309 100%)',
                        borderTop: '4px solid #FEF08A',
                        color: '#020617',
                        boxShadow:
                          '0 10px 24px rgba(250, 204, 21, 0.4), inset 0 3px 6px rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <span className="text-3xl font-black leading-none" style={{ color: '#020617' }}>
                        1
                      </span>
                      <span
                        className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                        style={{ color: '#020617' }}
                      >
                        Emas
                      </span>
                    </div>
                  </div>

                  {/* Peringkat 3: Podium Perunggu (Minton / Kamu) */}
                  <div className="flex flex-col items-center">
                    <div className="mb-2 flex flex-col items-center text-center">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border-4 text-2xl"
                        style={{
                          borderColor: '#F59E0B',
                          background: 'linear-gradient(135deg, #0EA5E9 0%, #1E1B4B 100%)',
                          boxShadow: '0 6px 14px rgba(14, 165, 233, 0.38)',
                        }}
                      >
                        👨‍🚀
                      </div>
                      <span
                        className="mt-1.5 text-xs font-extrabold truncate max-w-[85px]"
                        style={{ color: '#38BDF8' }}
                      >
                        Minton
                      </span>
                      <span
                        className="text-[11px] font-extrabold tabular-nums"
                        style={{ color: '#FACC15' }}
                      >
                        ⭐ {starCount.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div
                      className="w-full h-20 rounded-t-2xl flex flex-col items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(180deg, #D97706 0%, #B45309 55%, #78350F 100%)',
                        borderTop: '4px solid #FDE68A',
                        color: '#FFFFFF',
                        boxShadow:
                          '0 8px 20px rgba(2, 6, 23, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                      }}
                    >
                      <span className="text-2xl font-black leading-none" style={{ color: '#FFFFFF' }}>
                        3
                      </span>
                      <span
                        className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                        style={{ color: '#FEF3C7' }}
                      >
                        Perunggu
                      </span>
                    </div>
                  </div>
                </div>

                {/* Daftar Penjelajah Peringkat 4 & 5 (Cosmic Dark Sub-Card) */}
                <div
                  className="mt-4 space-y-2 rounded-2xl bg-slate-950/90 p-3 border border-indigo-400/40 backdrop-blur-md shadow-inner"
                  style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.82)',
                    borderColor: 'rgba(129, 140, 248, 0.42)',
                  }}
                >
                  <div
                    className="flex items-center justify-between rounded-xl bg-slate-900 border border-indigo-400/30 px-3 py-2"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      borderColor: 'rgba(129, 140, 248, 0.32)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-xs font-black w-4 tabular-nums"
                        style={{ color: '#38BDF8' }}
                      >
                        4
                      </span>
                      <span className="text-base">🐼</span>
                      <div>
                        <p className="text-xs font-extrabold" style={{ color: '#FFFFFF' }}>
                          Daffa Pratama
                        </p>
                        <p className="text-[10px] font-semibold" style={{ color: '#BAE6FD' }}>
                          Kelas 4 SD · Stasiun 2
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-extrabold tabular-nums"
                      style={{ color: '#FACC15' }}
                    >
                      ⭐ 1,120
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between rounded-xl bg-slate-900 border border-indigo-400/25 px-3 py-2"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.88)',
                      borderColor: 'rgba(129, 140, 248, 0.28)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-xs font-black w-4 tabular-nums"
                        style={{ color: '#38BDF8' }}
                      >
                        5
                      </span>
                      <span className="text-base">🐨</span>
                      <div>
                        <p className="text-xs font-extrabold" style={{ color: '#FFFFFF' }}>
                          Nadia Kirana
                        </p>
                        <p className="text-[10px] font-semibold" style={{ color: '#BAE6FD' }}>
                          Kelas 5 SD · Stasiun 2
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-extrabold tabular-nums"
                      style={{ color: '#FACC15' }}
                    >
                      ⭐ 980
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Widget 2: Target Harian & Statistik Kadet (Forced Cosmic Dark Galaxy Card) */}
            <section
              id="daily-target-widget"
              aria-label="Widget Target Harian Kadet"
              className="cosmic-dark-card rounded-3xl border-2 border-indigo-400/60 bg-slate-950 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 p-6 space-y-5 text-white relative overflow-hidden"
              style={{
                backgroundColor: '#020617',
                backgroundImage:
                  'linear-gradient(180deg, #090D1F 0%, #1E1B4B 52%, #020617 100%)',
                color: '#FFFFFF',
                borderColor: 'rgba(129, 140, 248, 0.65)',
                boxShadow:
                  '0 24px 50px rgba(2, 6, 23, 0.45), 0 0 28px rgba(99, 102, 241, 0.28), inset 0 2px 6px rgba(255, 255, 255, 0.22), inset 0 -6px 16px rgba(2, 6, 23, 0.9)',
              }}
            >
              {/* Partikel Bintang Halus pada Kartu Statistik Kanan */}
              <div
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1.5px)',
                  backgroundSize: '32px 32px',
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full blur-2xl"
                style={{ backgroundColor: 'rgba(99, 102, 241, 0.25)' }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold mb-1"
                    style={{
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
                      borderColor: 'rgba(56, 189, 248, 0.55)',
                      color: '#38BDF8',
                    }}
                  >
                    🛸 Radar Statistik Kadet
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold" style={{ color: '#FFFFFF' }}>
                    Target Harian Kadet
                  </h2>
                  <p className="text-xs font-semibold" style={{ color: '#BAE6FD' }}>
                    Misi Rutin Penjelajah Sains Galaksi
                  </p>
                </div>
                <span
                  className="rounded-xl border-2 px-3 py-1 text-xs font-extrabold tabular-nums"
                  style={{
                    backgroundColor: '#020617',
                    borderColor: '#FACC15',
                    color: '#FACC15',
                    boxShadow: '0 0 14px rgba(250, 204, 21, 0.28)',
                  }}
                >
                  +{xpEarned} XP
                </span>
              </div>

              {/* Lingkaran Progres & Statistik Target Harian (Cosmic Dark Sub-Card) */}
              <div
                className="relative z-10 flex items-center gap-5 rounded-2xl bg-slate-950 border border-indigo-400/40 p-4 backdrop-blur-md shadow-inner"
                style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.82)',
                  borderColor: 'rgba(129, 140, 248, 0.42)',
                }}
              >
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1E293B"
                      strokeWidth="9"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#dailyTargetGrad)"
                      strokeWidth="9"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (dailyTargetPercent / 100) * 251.2}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="dailyTargetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#FACC15" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span
                      className="text-lg font-extrabold tabular-nums"
                      style={{ color: '#FFFFFF' }}
                    >
                      {dailyTargetPercent}%
                    </span>
                    <span className="text-[10px] font-extrabold" style={{ color: '#FACC15' }}>
                      Tercapai
                    </span>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: '#C7D2FE' }}>
                      Durasi Eksplorasi
                    </p>
                    <p
                      className="text-sm font-extrabold tabular-nums"
                      style={{ color: '#FFFFFF' }}
                    >
                      {studyMinutes} / 45 Menit
                    </p>
                  </div>
                  <div
                    className="pt-2 border-t"
                    style={{ borderColor: 'rgba(129, 140, 248, 0.3)' }}
                  >
                    <p className="text-[11px] font-semibold" style={{ color: '#C7D2FE' }}>
                      Pos Diselesaikan
                    </p>
                    <p
                      className="text-sm font-extrabold tabular-nums"
                      style={{ color: '#FACC15' }}
                    >
                      {completedCount} / {pathNodes.length} Pos Galaksi
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist Misi Target Harian sesuai Alur Bottom-to-Top Bumi ke Antariksa (Cosmic Dark Card) */}
              <div className="relative z-10 space-y-2.5">
                <div
                  className="flex items-center justify-between rounded-2xl border px-3.5 py-2.5"
                  style={{
                    backgroundColor: 'rgba(6, 78, 59, 0.55)',
                    borderColor: 'rgba(52, 211, 153, 0.45)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">
                      ✓
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
                      Pos 1: Anatomi Tubuh &amp; Panca Indra 👁️
                    </span>
                  </div>
                  <span
                    className="text-xs font-extrabold whitespace-nowrap"
                    style={{ color: '#FACC15' }}
                  >
                    +30 ⭐
                  </span>
                </div>

                <div
                  className="flex items-center justify-between rounded-2xl border px-3.5 py-2.5"
                  style={{
                    backgroundColor: 'rgba(6, 78, 59, 0.55)',
                    borderColor: 'rgba(52, 211, 153, 0.45)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">
                      ✓
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
                      Pos 2: Dunia Tumbuhan &amp; Ekosistem Hewan 🌿
                    </span>
                  </div>
                  <span
                    className="text-xs font-extrabold whitespace-nowrap"
                    style={{ color: '#FACC15' }}
                  >
                    +35 ⭐
                  </span>
                </div>

                <div
                  className="flex items-center justify-between rounded-2xl border px-3.5 py-2.5"
                  style={{
                    backgroundColor: 'rgba(8, 47, 73, 0.78)',
                    borderColor: 'rgba(56, 189, 248, 0.65)',
                    boxShadow: '0 0 15px rgba(14, 165, 233, 0.25)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0EA5E9] text-xs font-bold text-white animate-pulse">
                      ★
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
                      Pos 3: Siklus Air, Kondensasi Awan &amp; Hujan 🌧️
                    </span>
                  </div>
                  <span
                    className="text-xs font-extrabold whitespace-nowrap"
                    style={{ color: '#FACC15' }}
                  >
                    +40 ⭐
                  </span>
                </div>

                <div
                  className="flex items-center justify-between rounded-2xl border px-3.5 py-2.5"
                  style={{
                    backgroundColor: 'rgba(30, 27, 75, 0.8)',
                    borderColor: 'rgba(251, 191, 36, 0.45)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                      🔥
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#F8FAFC' }}>
                      Pos 4 &amp; 5: Energi Panas, Tata Surya &amp; Gravitasi 🪐
                    </span>
                  </div>
                  <span
                    className="text-xs font-extrabold whitespace-nowrap"
                    style={{ color: '#FDE047' }}
                  >
                    +60 XP
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const activeNode = pathNodes.find((n) => n.status === 'active');
                  if (activeNode) handleNodeClick(activeNode);
                }}
                className="relative z-10 w-full rounded-2xl bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-indigo-600 hover:from-[#38BDF8] hover:to-indigo-500 border-b-4 border-sky-900 py-3 text-xs sm:text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(14,165,233,0.38),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #0EA5E9 0%, #38BDF8 50%, #4F46E5 100%)',
                  color: '#FFFFFF',
                }}
              >
                Kerjakan Target Hari Ini ➔
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* =====================================================================
          MODAL KUIS SAAT NODE MISI DI JALUR GALAKSI DIKLIK (BRIGHT CLAYMORPHISM)
          ===================================================================== */}
      {selectedNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl border-4 border-white bg-gradient-to-b from-white via-[#F8FAFC] to-[#F0F9FF] p-6 text-[#0F172A] shadow-[0_24px_54px_rgba(15,23,42,0.28),inset_0_3px_6px_rgba(255,255,255,0.95)] space-y-4"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-extrabold text-amber-900">
                ⭐ Pos Misi #{selectedNodeModal.id} · +{selectedNodeModal.starReward} Bintang
              </span>
              <button
                type="button"
                onClick={() => setSelectedNodeModal(null)}
                className="rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-extrabold text-[#475569] hover:bg-slate-200 hover:text-[#0F172A] cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">{selectedNodeModal.title}</h3>
              <p className="text-xs font-bold text-[#475569]">{selectedNodeModal.subtitle}</p>
            </div>

            <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-4 shadow-inner">
              <p className="text-xs sm:text-sm font-extrabold text-[#0284C7]">
                🦊 Tantangan Sains Kadet Foxy:
              </p>
              <p className="mt-1 text-xs sm:text-sm font-bold text-[#0F172A]">
                {selectedNodeModal.question}
              </p>
            </div>

            <div className="space-y-2.5">
              {selectedNodeModal.options.map((opt, idx) => {
                const isChosen = selectedOption === idx;
                const isRight = idx === selectedNodeModal.correctIdx;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswerQuiz(idx)}
                    className={`w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                      isChosen
                        ? isRight
                          ? 'bg-emerald-500 border-emerald-700 text-white'
                          : 'bg-rose-500 border-rose-700 text-white'
                        : 'bg-white border-slate-200 hover:border-[#0EA5E9] hover:bg-sky-50 text-[#0F172A]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: GABUNG KELAS DENGAN KODE GURU
         ================================================================ */}
      {showJoinClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-800">
            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={() => {
                setShowJoinClassModal(false);
                setJoinClassCode('');
                setJoinClassStatus('idle');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            {/* Header Modal */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-md">
                🔑
              </div>
              <div>
                <h2 className="font-heading text-lg font-black text-slate-900">Gabung Kelas</h2>
                <p className="text-xs text-slate-500 font-medium">Masukkan kode unik yang diberikan guru kamu</p>
              </div>
            </div>

            {/* Status Sukses */}
            {joinClassStatus === 'success' ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
                <div className="text-4xl">🎉</div>
                <h3 className="text-base font-black text-emerald-800">Berhasil Bergabung!</h3>
                <p className="text-xs text-emerald-600 font-medium">{joinedClassName}</p>
              </div>
            ) : (
              <form onSubmit={handleJoinClass} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kode Kelas dari Guru</label>
                  <input
                    type="text"
                    value={joinClassCode}
                    onChange={(e) => setJoinClassCode(e.target.value.toUpperCase())}
                    placeholder='Contoh: BINTANG-5A-882'
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-center text-lg font-mono font-black tracking-widest focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                    autoFocus
                    maxLength={20}
                  />
                </div>

                {joinClassStatus === 'error' && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700 flex items-center gap-2">
                    <Icon icon="lucide:alert-circle" className="h-4 w-4 shrink-0" />
                    <span>Kode tidak ditemukan. Cek kembali kode dari gurumu!</span>
                  </div>
                )}

                <div className="rounded-2xl bg-indigo-50/70 border border-indigo-100 p-3 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-indigo-700 flex items-center gap-1.5">
                    <Icon icon="solar:info-circle-bold" className="h-3.5 w-3.5" />
                    Cara mendapatkan kode:
                  </p>
                  <p>Minta kode kelas dari guru kamu. Kode biasanya tertulis di papan tulis atau dikirim lewat grup chat.</p>
                </div>

                <button
                  type="submit"
                  disabled={!joinClassCode.trim() || joinClassStatus === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joinClassStatus === 'loading' ? (
                    <>
                      <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />
                      <span>Mencari kelas...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:login-3-bold" className="h-4 w-4" />
                      <span>Gabung Kelas Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
