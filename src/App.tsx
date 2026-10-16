/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Navbar, NavTab } from './components/Navbar.tsx';
import {
  HeroSection,
  DAILY_SCIENCE_SCHEDULE,
  DailyScheduleTopic,
} from './components/HeroSection.tsx';
import {
  ScienceModulesSection,
  ActiveFeatureKey,
} from './components/ScienceModulesSection.tsx';
import { FooterSection } from './components/FooterSection.tsx';
import { SolarSystemMiniLab } from './components/SolarSystemMiniLab.tsx';
import { BintangEduMascot } from './components/BintangEduLogo.tsx';
import { StudentDashboardMOne } from './components/StudentDashboardMOne.tsx';
import { TeacherDashboard } from './components/TeacherDashboard.tsx';
import { VirtualLabModule, SidebarNavKey, StationId } from './components/VirtualLabModule.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { RegisterPage } from './components/RegisterPage.tsx';
import { MissionsPathwayPage } from './components/MissionsPathwayPage.tsx';
import { QuizChallengesPage } from './components/QuizChallengesPage.tsx';
import { LeaderboardRankingPage } from './components/LeaderboardRankingPage.tsx';
import { AppSidebar } from './components/AppSidebar.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppViewRoute, UserSession, DEFAULT_USER } from './types/navigation.ts';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Global Routing State
  const [currentRoute, setCurrentRoute] = useState<AppViewRoute>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.includes('virtual-lab')) return 'virtual-lab';
      if (p.includes('misi-sains') || p.includes('misi')) return 'misi-sains';
      if (p.includes('tantangan') || p.includes('kuis') || p.includes('challenges')) return 'tantangan-kuis';
      if (p.includes('peringkat') || p.includes('leaderboard')) return 'peringkat';
      if (p === '/login') return 'login';
      if (p === '/register') return 'register';
      if (p === '/dashboard') return 'dashboard';
      if (p === '/' || p === '/landing') return 'landing';
    }
    return 'landing';
  });

  const [initialLabStation, setInitialLabStation] = useState<StationId>('human-anatomy');
  const [userSession, setUserSession] = useState<UserSession>(() => {
    // Check localStorage for logged-in user session
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('user');
        const savedRole = (localStorage.getItem('userRole') || '').toLowerCase();
        const savedName = localStorage.getItem('userName');
        if (saved) {
          const parsed = JSON.parse(saved);
          const rawRole = (savedRole || parsed.role || '').toLowerCase();
          const isTeacher = rawRole.includes('guru') || rawRole.includes('teacher') || rawRole.includes('pendidik');
          const isParent = rawRole.includes('ortu') || rawRole.includes('parent') || rawRole.includes('orang tua');
          const roleToUse = isTeacher ? 'teacher' : isParent ? 'parent' : 'student';

          return {
            ...DEFAULT_USER,
            ...parsed,
            role: roleToUse,
            name: savedName || parsed.name || (isTeacher ? 'Bapak/Ibu Guru' : DEFAULT_USER.name),
            grade: isTeacher ? 'Pendidik Sains SD' : isParent ? 'Wali Murid SD' : (parsed.grade || 'Kelas 5 SD'),
            isAuthenticated: true,
          };
        } else if (savedRole) {
          const isTeacher = savedRole.includes('guru') || savedRole.includes('teacher') || savedRole.includes('pendidik');
          const isParent = savedRole.includes('ortu') || savedRole.includes('parent') || savedRole.includes('orang tua');
          return {
            ...DEFAULT_USER,
            name: savedName || (isTeacher ? 'Bapak/Ibu Guru' : isParent ? 'Wali Murid' : 'Kadet Penjelajah'),
            role: isTeacher ? 'teacher' : isParent ? 'parent' : 'student',
            grade: isTeacher ? 'Pendidik Sains SD' : isParent ? 'Wali Murid SD' : 'Kelas 5 SD',
            isAuthenticated: true,
          };
        }
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_USER;
  });
  const [dashboardInitialNav, setDashboardInitialNav] = useState<SidebarNavKey>('Beranda');
  const [teacherDashboardTab, setTeacherDashboardTab] = useState<string>('monitoring');

  // Synchronize route with react-router location
  useEffect(() => {
    const p = location.pathname;
    if (p.includes('virtual-lab')) {
      setCurrentRoute('virtual-lab');
    } else if (p.includes('misi-sains') || p.includes('misi')) {
      setCurrentRoute('misi-sains');
    } else if (p.includes('tantangan') || p.includes('kuis') || p.includes('challenges')) {
      setCurrentRoute('tantangan-kuis');
    } else if (p.includes('peringkat') || p.includes('leaderboard')) {
      setCurrentRoute('peringkat');
    } else if (p === '/login') {
      setCurrentRoute('login');
    } else if (p === '/register') {
      setCurrentRoute('register');
    } else if (p === '/' || p === '/landing') {
      setCurrentRoute('landing');
    } else if (p === '/dashboard') {
      setCurrentRoute('dashboard');
    }
  }, [location.pathname]);

  const navigateTo = (route: AppViewRoute, station?: StationId) => {
    // Pastikan semua modal dialog dan overflow terkunci dibersihkan saat berpindah rute
    setApplicationModalOpen(false);
    setSearchModalOpen(false);
    setProfileModalOpen(false);
    document.body.style.overflow = '';

    if (station) {
      setInitialLabStation(station);
    }
    const pathMap: Record<AppViewRoute, string> = {
      landing: '/',
      login: '/login',
      register: '/register',
      dashboard: '/dashboard',
      'virtual-lab': '/virtual-lab',
      'misi-sains': '/misi-sains',
      'tantangan-kuis': '/tantangan',
      peringkat: '/leaderboard',
      'landing-3d': '/landing-3d',
    };
    const targetPath = pathMap[route] || '/dashboard';
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setCurrentRoute(route);
  };

  const handleSidebarNavFromLegacy = (nav: SidebarNavKey) => {
    if (nav === 'Lab Virtual') {
      navigateTo('virtual-lab');
    } else if (nav === 'Misi Sains') {
      navigateTo('misi-sains');
    } else if (nav === 'Tantangan') {
      navigateTo('tantangan-kuis');
    } else if (nav === 'Peringkat') {
      navigateTo('peringkat');
    } else {
      setDashboardInitialNav('Beranda');
      navigateTo('dashboard');
    }
  };

  const [activeNavTab, setActiveNavTab] = useState<NavTab>('Home');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [activeFeature, setActiveFeature] =
    useState<ActiveFeatureKey>('kuis-gamifikasi');
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(125);

  // Modal Pencarian, Profil Ilmuwan ("Mintion"), dan Application Entry (Childhood Dream)
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [applicationModalOpen, setApplicationModalOpen] =
    useState<boolean>(false);

  const [studentName, setStudentName] = useState<string>('Mintion');
  const [studentGrade, setStudentGrade] = useState<string>('Kelas 5 SD');
  const [selectedDreamRole, setSelectedDreamRole] = useState<string>(
    'Astronaut & Penjelajah Antariksa'
  );

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const handleSelectNavTab = (tab: NavTab) => {
    setActiveNavTab(tab);
    if (tab === 'Activity') {
      setActiveFeature('populer-sains');
    } else if (tab === 'Shop') {
      setActiveFeature('ai-generator');
    } else if (tab === 'Tours') {
      setActiveFeature('kuis-gamifikasi');
    }
  };

  const handleSelectScheduleTopic = (index: number) => {
    setActiveTopicIndex(index);
    const chosen = DAILY_SCIENCE_SCHEDULE[index];
    if (chosen) {
      setActiveQuizIndex(chosen.quizIndex);
    }
  };

  const handleStartExperiment = (topic: DailyScheduleTopic) => {
    setActiveFeature('kuis-gamifikasi');
    setActiveQuizIndex(topic.quizIndex);
    showToast(`🚀 Experience Dimulai: ${topic.title}`);
    const panelEl = document.getElementById('interactive-feature-panel');
    if (panelEl) {
      panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAddStars = (stars: number, reason: string) => {
    setTotalStars((prev) => prev + stars);
    showToast(
      `⭐ Fantastic, ${studentName}! +${stars} Bintang dari ${reason}!`
    );
  };

  const handleFooterMenuClick = (menuName: string) => {
    showToast(`✨ Membuka informasi ${menuName} Bintang Edu`);
  };

  const filteredScheduleTopics = DAILY_SCIENCE_SCHEDULE.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =========================================================================
  // ROUTING VIEW RENDERERS (SMOOTH SPA NAVIGATION & PERSISTENT SHELL)
  // =========================================================================

  // Helper untuk merender konten 5 modul utama (tanpa duplikasi sidebar)
  const renderAuthenticatedPage = () => {
    const isTeacherOrParent =
      userSession.role === 'teacher' ||
      userSession.role === 'parent' ||
      userSession.role?.toLowerCase().includes('guru') ||
      userSession.role?.toLowerCase().includes('pendidik') ||
      userSession.role?.toLowerCase().includes('orang tua') ||
      userSession.role?.toLowerCase().includes('ortu');

    // ISOLASI KETAT GURU / ORANG TUA:
    // Mencegah akun guru/ortu melihat rute gamifikasi siswa (misi, tantangan, peringkat)
    if (isTeacherOrParent && currentRoute !== 'virtual-lab') {
      return (
        <TeacherDashboard
          user={userSession}
          onNavigate={navigateTo}
          onNotify={showToast}
          initialTab={teacherDashboardTab}
          onTabChange={(tab) => setTeacherDashboardTab(tab)}
        />
      );
    }

    switch (currentRoute) {
      case 'misi-sains':
        return (
          <MissionsPathwayPage
            user={userSession}
            onNavigate={navigateTo}
            onOpenStation={(stId) => navigateTo('virtual-lab', stId)}
            onUpdateMissionStatus={(mId) => {
              setUserSession((prev) => {
                const completed = prev.completedMissions.includes(mId)
                  ? prev.completedMissions
                  : [...prev.completedMissions, mId];
                return {
                  ...prev,
                  completedMissions: completed,
                  stars: prev.stars + 40,
                  xp: prev.xp + 80,
                };
              });
            }}
            hideSidebar={true}
          />
        );
      case 'tantangan-kuis':
        return (
          <QuizChallengesPage
            user={userSession}
            onNavigate={navigateTo}
            onAddReward={(addedStars, addedXp) => {
              setUserSession((prev) => ({
                ...prev,
                stars: prev.stars + addedStars,
                xp: prev.xp + addedXp,
              }));
            }}
            hideSidebar={true}
          />
        );
      case 'peringkat':
        return (
          <LeaderboardRankingPage
            user={userSession}
            onNavigate={navigateTo}
            hideSidebar={true}
          />
        );
      case 'virtual-lab':
        return (
          <VirtualLabModule
            activeNav="Lab Virtual"
            initialStation={initialLabStation}
            starCount={userSession.stars}
            streakDays={userSession.streak}
            xpEarned={userSession.xp}
            levelProgressPercent={Math.round((userSession.completedMissions.length / 5) * 100)}
            onNavigateSidebar={handleSidebarNavFromLegacy}
            onSelectNav={handleSidebarNavFromLegacy}
            onBackToDashboard={() => navigateTo('dashboard')}
            onAddReward={(stars, xp) => {
              setUserSession((prev) => ({
                ...prev,
                stars: prev.stars + stars,
                xp: prev.xp + xp,
              }));
            }}
            onSwitchToLanding3D={() => navigateTo('landing-3d')}
            hideSidebar={true}
          />
        );
      case 'dashboard':
      default:
        if (isTeacherOrParent) {
          return (
            <TeacherDashboard
              user={userSession}
              onNavigate={navigateTo}
              onNotify={showToast}
              initialTab={teacherDashboardTab}
              onTabChange={(tab) => setTeacherDashboardTab(tab)}
            />
          );
        }
        return (
          <StudentDashboardMOne
            initialActiveNav={dashboardInitialNav}
            onOpenVirtualLab={() => navigateTo('virtual-lab')}
            onSwitchToLanding3D={() => navigateTo('landing-3d')}
            onNavigatePage={navigateTo}
            hideSidebar={true}
          />
        );
    }
  };

  // Handler terpadu untuk login dan registrasi berbasis Role (Guru, Ortu, Siswa)
  const handleAuthSuccess = (userData?: any) => {
    // Bersihkan semua modal dialog & overflow lock secara instan
    setApplicationModalOpen(false);
    setSearchModalOpen(false);
    setProfileModalOpen(false);
    document.body.style.overflow = '';

    const roleStr = (userData?.role || localStorage.getItem('userRole') || '').toLowerCase();
    const isTeacher = roleStr === 'teacher' || roleStr.includes('guru') || roleStr.includes('pendidik');
    const isParent = roleStr === 'parent' || roleStr.includes('orang tua') || roleStr.includes('ortu');

    const determinedName =
      userData?.name ||
      localStorage.getItem('userName') ||
      (isTeacher ? 'Bapak/Ibu Guru' : isParent ? 'Wali Murid' : 'Minton Cadence');

    const determinedRole = isTeacher ? 'teacher' : isParent ? 'parent' : 'student';

    const updatedSession: UserSession = {
      name: determinedName,
      email: userData?.email || '',
      role: determinedRole,
      grade: userData?.grade || (isTeacher ? 'Pendidik Sains SD' : isParent ? 'Wali Murid SD' : 'Kelas 5 SD'),
      level: isTeacher ? 10 : isParent ? 8 : 7,
      avatarSeed: determinedName ? determinedName.substring(0, 2).toUpperCase() : (isTeacher ? 'GR' : isParent ? 'OT' : 'MT'),
      stars: isTeacher ? 500 : isParent ? 200 : 1240,
      xp: isTeacher ? 650 : isParent ? 300 : 120,
      streak: 5,
      completedMissions: [1, 2, 3],
      isAuthenticated: true,
    };

    setUserSession(updatedSession);
    try {
      localStorage.setItem('user', JSON.stringify(updatedSession));
      localStorage.setItem('userRole', isTeacher ? 'guru' : isParent ? 'orang tua' : 'siswa');
      localStorage.setItem('userName', determinedName);
      localStorage.setItem('isAuthenticated', 'true');
    } catch (e) {
      // ignore
    }

    if (isTeacher) {
      showToast(`👨‍🏫 Selamat Datang, ${updatedSession.name}! Membuka Dashboard Guru...`);
    } else if (isParent) {
      showToast(`👩‍👦 Selamat Datang, ${updatedSession.name}! Membuka Portal Orang Tua...`);
    } else {
      showToast(`🚀 Selamat Datang, Kadet ${updatedSession.name}!`);
    }
    navigateTo('dashboard');
  };

  // 1. HALAMAN AUTH: LOGIN & REGISTER (Galaxy-Styled Dedicated Pages)
  if (currentRoute === 'login') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen"
        >
          <LoginPage
            onBackToHome={() => navigateTo('landing')}
            onGoToRegister={() => navigateTo('register')}
            onNotify={showToast}
            onLoginSuccess={handleAuthSuccess}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (currentRoute === 'register') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="register"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen"
        >
          <RegisterPage
            onBackToHome={() => navigateTo('landing')}
            onGoToLogin={() => navigateTo('login')}
            onNotify={showToast}
            onRegisterSuccess={handleAuthSuccess}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 2. LIMA HALAMAN UTAMA APLIKASI WEB BINTANG EDU DENGAN SHELL & SIDEBAR PERSISTEN
  const isMainAppRoute =
    currentRoute === 'dashboard' ||
    currentRoute === 'misi-sains' ||
    currentRoute === 'virtual-lab' ||
    currentRoute === 'tantangan-kuis' ||
    currentRoute === 'peringkat';

  if (isMainAppRoute) {
    return (
      <div className="relative min-h-screen bg-[#f4f6fc] text-slate-800 antialiased selection:bg-yellow-300 selection:text-indigo-950 overflow-x-hidden">
        {/* Global Toast Notification */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-yellow-300/80 bg-slate-950/95 px-5 py-3.5 shadow-2xl backdrop-blur-md text-white"
          >
            <Icon icon="solar:sparkles-bold" className="h-5 w-5 text-yellow-300 animate-spin" />
            <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          </motion.div>
        )}

        {/* 1. SIDEBAR KIRI KONSISTEN & PERSISTEN (TIDAK ME-RE-RENDER / MELOMPAT SAAT HALAMAN BERGANTI) */}
        <AppSidebar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          user={userSession}
          activeTeacherTab={teacherDashboardTab}
          onSelectTeacherTab={(tab) => {
            setTeacherDashboardTab(tab);
            navigateTo('dashboard');
          }}
          onLogout={() => {
            setUserSession(DEFAULT_USER);
            showToast('👋 Sampai jumpa lagi di misi berikutnya!');
            navigateTo('login');
          }}
        />

        {/* 2. MAIN-CONTENT AREA: STABIL min-h-screen & overflow-y-auto, WRAPPER TRANSISI CSS SMOOTH ROUTING */}
        <main className="min-h-screen overflow-y-auto transition-all duration-300 ease-in-out">
          <div
            key={currentRoute}
            className="w-full min-h-screen transition-all duration-300 ease-in-out animate-page-fade"
          >
            {renderAuthenticatedPage()}
          </div>
        </main>
      </div>
    );
  }

  // 7. PANGGUNG GALAKSI 3D ('landing' & 'landing-3d')
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-purple-600 via-[#7c3aed] to-[#0f0b29] text-white font-body selection:bg-yellow-300 selection:text-indigo-950 transition-all duration-300 ease-in-out">
      {/* Tombol Kembali ke Dashboard Peserta Siswa (hanya tampil di landing-3d, sembunyi di landing utama '/') */}
      {currentRoute !== 'landing' && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            className="inline-flex items-center gap-2 rounded-2xl border border-yellow-300/60 bg-purple-600/90 px-4 py-2.5 font-heading text-xs font-bold text-yellow-300 shadow-xl backdrop-blur-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Icon icon="lucide:layout-dashboard" className="h-4 w-4" />
            <span>
              {userSession.role === 'teacher' || userSession.role?.toLowerCase().includes('guru')
                ? 'Dashboard Guru'
                : userSession.role === 'parent' || userSession.role?.toLowerCase().includes('orang tua')
                ? 'Portal Orang Tua'
                : 'Dashboard Siswa'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('landing')}
            className="inline-flex items-center gap-2 rounded-2xl border border-sky-300/60 bg-purple-600/90 px-4 py-2.5 font-heading text-xs font-bold text-sky-300 shadow-xl backdrop-blur-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Icon icon="solar:globus-bold-duotone" className="h-4 w-4" />
            <span>Halaman Landing</span>
          </button>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-yellow-300/60 bg-purple-700/95 px-5 py-3.5 shadow-2xl backdrop-blur-md">
          <Icon
            icon="lucide:sparkles"
            className="h-4 w-4 text-yellow-300 shrink-0 animate-pulse"
          />
          <span className="font-heading text-xs sm:text-sm font-bold text-white">
            {toastMessage}
          </span>
        </div>
      )}

      {/* 1. NAVBAR ATAS (Logo Resmi Bintang Edu + Menu Home, Activity, Shop, Tours, About + Profil Mintion) */}
      <Navbar
        activeTab={activeNavTab}
        onSelectTab={handleSelectNavTab}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        studentName={studentName}
        totalStars={totalStars}
        onGoToLogin={() => navigateTo('login')}
        onGoToRegister={() => navigateTo('register')}
      />

      {/* 2. KONTEN UTAMA DASHBOARD 3D RUANG ANGKASA */}
      <main>
        {/* Panggung 3D "CHILDHOOD DREAM" + Karakter Astronaut & Bintang Edu + Gamepad 3D */}
        <HeroSection
          activeTopicIndex={activeTopicIndex}
          onSelectTopic={handleSelectScheduleTopic}
          onStartExperiment={handleStartExperiment}
          onOpenApplicationModal={() => setApplicationModalOpen(true)}
          onAddStars={handleAddStars}
          onNotify={showToast}
          totalStars={totalStars}
          onNavigate={navigateTo}
          isAuthenticated={userSession.isAuthenticated}
        />

        {/* Wahana Eksplorasi Sains & Simulasi Interaktif Bintang Edu */}
        <ScienceModulesSection
          activeFeature={activeFeature}
          onSelectFeature={setActiveFeature}
          activeQuizIndex={activeQuizIndex}
          onSelectQuizIndex={setActiveQuizIndex}
          onAddStars={handleAddStars}
          onNotify={showToast}
          onNavigate={navigateTo}
        />

        {/* 🧪 Mini Lab Tata Surya Interaktif — Try-It-Out Eksperimen Instan */}
        <SolarSystemMiniLab isAuthenticated={userSession.isAuthenticated} />
      </main>

      {/* 3. FOOTER PENUTUP */}
      <FooterSection onFooterMenuClick={handleFooterMenuClick} />

      {/* ================================================================
          MODAL APPLICATION ENTRY (Pilih Cita-Cita Masa Kecil "Childhood Dream")
         ================================================================ */}
      {applicationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-600/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/25 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setApplicationModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-blue-200 hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Tutup Pendaftaran Mimpi"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-indigo-950 shadow-md">
                <Icon icon="lucide:rocket" className="h-6 w-6" />
              </div>
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-yellow-300">
                  Bintang Edu • Application Entry
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Wujudkan Cita-Cita Sainsmu!
                </h3>
              </div>
            </div>

            <p className="mt-3 font-body text-xs sm:text-sm font-semibold text-blue-100/90">
              Pilih profesi impian masa kecilmu untuk membuka misi eksperimen
              antariksa dan mendapatkan lencana bintang khusus:
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  role: 'Astronaut & Penjelajah Antariksa',
                  emoji: '👨‍🚀',
                  topicIdx: 0,
                },
                {
                  role: 'Ilmuwan Alam & Botani',
                  emoji: '🌱',
                  topicIdx: 1,
                },
                {
                  role: 'Insinyur Robot & Fisika',
                  emoji: '🤖',
                  topicIdx: 2,
                },
                {
                  role: 'Guru Sains & Peneliti Cuaca',
                  emoji: '🌈',
                  topicIdx: 3,
                },
              ].map((item) => {
                const isSelected = selectedDreamRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      setSelectedDreamRole(item.role);
                      handleSelectScheduleTopic(item.topicIdx);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-yellow-300 bg-yellow-400/20 text-white shadow-md'
                        : 'border-white/15 bg-white/5 text-blue-100 hover:border-yellow-300/50'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-heading text-xs sm:text-sm font-bold leading-snug">
                      {item.role}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setApplicationModalOpen(false);
                handleAddStars(30, `Misi Cita-Cita: ${selectedDreamRole}`);
                const currentTopic =
                  DAILY_SCIENCE_SCHEDULE[activeTopicIndex] ||
                  DAILY_SCIENCE_SCHEDULE[0];
                handleStartExperiment(currentTopic);
              }}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-slate-900 shadow-xl hover:from-yellow-200 hover:to-yellow-300 cursor-pointer"
            >
              🚀 MULAI EXPERIENCE SEKARANG (+30 ⭐)
            </button>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL PENCARIAN TOPIK SAINS (Tombol Search di Navbar)
         ================================================================ */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-600/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/25 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 p-6 sm:p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-blue-200 hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Tutup Pencarian"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <Icon
                icon="lucide:search"
                className="h-5 w-5 text-yellow-300"
              />
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                Cari Petualangan & Modul Sains SD
              </h3>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik topik: Tata Surya, Fotosintesis, Magnet, Air..."
                autoFocus
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 font-body text-sm font-bold text-white placeholder-blue-200/70 focus:border-yellow-300 focus:outline-none"
              />
            </div>

            <div className="mt-4 space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {filteredScheduleTopics.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    handleSelectScheduleTopic(idx);
                    setSearchModalOpen(false);
                    handleStartExperiment(item);
                  }}
                  className="w-full flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left transition-colors hover:border-yellow-300 hover:bg-white/15 cursor-pointer"
                >
                  <div>
                    <div className="font-heading text-xs font-bold text-yellow-300">
                      {item.category} • {item.grade}
                    </div>
                    <div className="font-heading text-sm font-bold text-white">
                      {item.title}
                    </div>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-indigo-950">
                    <Icon icon="lucide:play" className="h-3.5 w-3.5 ml-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL PROFIL ILMUWAN CILIK ("Mintion" di Kanan Navbar)
         ================================================================ */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-600/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/25 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-blue-200 hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Tutup Profil"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <BintangEduMascot className="h-16 w-16" withBadge={true} />
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3.5 py-1 font-heading text-xs font-bold text-indigo-950 shadow-sm">
                <Icon icon="lucide:star" className="h-3.5 w-3.5" />
                <span>Total Koleksi: {totalStars} Bintang</span>
              </div>
              <h3 className="mt-3 font-heading text-xl font-bold text-white">
                Profil Kapten Impian
              </h3>
              <p className="mt-1 font-body text-xs sm:text-sm font-bold text-blue-200">
                Cita-cita: {selectedDreamRole}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setProfileModalOpen(false);
                showToast(
                  `👨‍🚀 Profil disimpan: ${studentName} (${studentGrade})`
                );
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block font-heading text-xs font-bold text-yellow-300 mb-1">
                  Nama Panggilan Anak
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 font-body text-sm font-bold text-white focus:border-yellow-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading text-xs font-bold text-yellow-300 mb-1">
                  Kelas Sekolah Dasar (SD)
                </label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  className="w-full rounded-xl border border-white/25 bg-purple-600 px-4 py-2.5 font-body text-sm font-bold text-white focus:border-yellow-300 focus:outline-none"
                >
                  <option value="Kelas 1 SD">Kelas 1 SD</option>
                  <option value="Kelas 2 SD">Kelas 2 SD</option>
                  <option value="Kelas 3 SD">Kelas 3 SD</option>
                  <option value="Kelas 4 SD">Kelas 4 SD</option>
                  <option value="Kelas 5 SD">Kelas 5 SD</option>
                  <option value="Kelas 6 SD">Kelas 6 SD</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 py-3 font-heading text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-lg hover:bg-yellow-300 cursor-pointer"
              >
                <Icon icon="lucide:user-check" className="h-4 w-4" />
                <span>SIMPAN PROFIL SAINS</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
