import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { AppViewRoute, UserSession } from '../types/navigation.ts';

interface AppSidebarProps {
  currentRoute: AppViewRoute;
  onNavigate: (route: AppViewRoute) => void;
  user: UserSession;
  onLogout?: () => void;
  activeTeacherTab?: string;
  onSelectTeacherTab?: (tab: any) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentRoute,
  onNavigate,
  user,
  onLogout,
  activeTeacherTab = 'monitoring',
  onSelectTeacherTab,
}) => {
  const isTeacher =
    user.role === 'teacher' ||
    user.role === 'parent' ||
    user.role?.toLowerCase().includes('guru') ||
    user.role?.toLowerCase().includes('pendidik') ||
    user.role?.toLowerCase().includes('orang tua') ||
    user.role?.toLowerCase().includes('ortu');

  const isParent =
    user.role === 'parent' ||
    user.role?.toLowerCase().includes('orang tua') ||
    user.role?.toLowerCase().includes('ortu');

  // Menu EduAdmin khusus Guru / Pengajar (Pure Quiz & Class Management)
  const teacherNavItems = [
    {
      tab: 'monitoring',
      label: 'Monitoring Siswa',
      icon: 'solar:chart-square-bold',
      badge: '28 Siswa',
      accentColor: 'text-emerald-400',
    },
    {
      tab: 'quizzes',
      label: 'Kelola Kuis',
      icon: 'solar:document-add-bold',
      badge: '4 Kuis',
      accentColor: 'text-amber-400',
    },
    {
      tab: 'groups',
      label: 'Grup Kelas & Kode',
      icon: 'solar:users-group-two-rounded-bold',
      badge: 'Grup',
      accentColor: 'text-sky-400',
    },
  ];

  // Menu Gamifikasi Galaksi khusus Siswa (STASIUN, MISI, TANTANGAN, PERINGKAT)
  const studentNavItems = [
    {
      route: 'dashboard' as AppViewRoute,
      label: 'Beranda',
      icon: 'solar:home-smile-bold-duotone',
      accentColor: 'text-[#0284C7]',
    },
    {
      route: 'misi-sains' as AppViewRoute,
      label: 'Misi Sains',
      icon: 'solar:compass-big-bold-duotone',
      badge: '5 Pos',
      accentColor: 'text-emerald-500',
    },
    {
      route: 'virtual-lab' as AppViewRoute,
      label: 'Lab Virtual',
      icon: 'solar:test-tube-bold-duotone',
      badge: '3 Modul',
      accentColor: 'text-orange-500',
    },
    {
      route: 'tantangan-kuis' as AppViewRoute,
      label: 'Tantangan',
      icon: 'solar:bolt-circle-bold-duotone',
      badge: '+120 XP',
      accentColor: 'text-pink-500',
    },
    {
      route: 'peringkat' as AppViewRoute,
      label: 'Peringkat',
      icon: 'solar:cup-star-bold-duotone',
      badge: '#3',
      accentColor: 'text-amber-500',
    },
  ];

  return (
    <aside
      aria-label={isTeacher ? 'Sidebar EduAdmin Guru Bintang Edu' : 'Sidebar Navigasi Galaksi Siswa'}
      className={`relative z-30 w-full lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 flex flex-col justify-between p-6 select-none transition-colors duration-300 ${
        isTeacher
          ? 'bg-[#120a2a] text-white border-b lg:border-b-0 lg:border-r border-purple-900/40 shadow-2xl'
          : 'bg-white/95 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-slate-200/90 shadow-[4px_0_24px_rgba(15,23,42,0.04)] text-[#0F172A]'
      }`}
    >
      <div>
        {/* Brand Logo Resmi */}
        <div className={`flex items-center justify-between lg:justify-start gap-3 pb-6 border-b ${
          isTeacher ? 'border-purple-900/40' : 'border-slate-200/80'
        }`}>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#0EA5E9] p-1.5 shadow-[0_8px_20px_rgba(99,102,241,0.25),inset_0_2px_4px_rgba(255,255,255,0.45)] border-2 border-white transition-transform group-hover:scale-105">
              <svg viewBox="0 0 64 64" className="h-9 w-9 drop-shadow-sm" aria-label="Logo Bintang Edu">
                <path d="M10 46 Q21 41 32 47 Q43 41 54 46 L54 55 Q43 50 32 56 Q21 50 10 55 Z" fill="#38BDF8" />
                <path d="M12 43 Q22 38 32 44 Q42 38 52 43 L52 51 Q42 46 32 52 Q22 46 12 51 Z" fill="#FFFFFF" />
                <line x1="32" y1="44" x2="32" y2="55" stroke="#0EA5E9" strokeWidth="2" />
                <path
                  d="M32 14 L36.8 24.2 L48 25.6 L39.8 33.4 L41.9 44.5 L32 39.2 L22.1 44.5 L24.2 33.4 L16 25.6 L27.2 24.2 Z"
                  fill="#FACC15"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="28.5" cy="29" r="1.7" fill="#0F172A" />
                <circle cx="35.5" cy="29" r="1.7" fill="#0F172A" />
                <path d="M29 33 Q32 35.8 35 33" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                <polygon points="32,6 16,13 32,19 48,13" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
                <rect x="24" y="16" width="16" height="4" rx="1.5" fill="#1E293B" />
                <path d="M44 14.5 L46 23" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
                <circle cx="46" cy="24" r="2" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-lg font-black tracking-tight leading-none ${
                  isTeacher ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  Bintang <span className={isTeacher ? 'text-amber-400' : 'text-[#0284C7]'}>Edu</span>
                </span>
                <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-extrabold ${
                  isTeacher
                    ? isParent
                      ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                      : 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-indigo-50 border-indigo-200 text-[#4F46E5]'
                }`}>
                  {isTeacher ? (isParent ? 'ORTU' : 'EDUADMIN') : 'M-ONE'}
                </span>
              </div>
              <p className={`mt-1 text-[11px] font-bold ${
                isTeacher ? 'text-purple-300/80' : 'text-[#64748B]'
              }`}>
                {isTeacher
                  ? (isParent ? 'Portal Wali Murid' : 'Portal Pengajar Sains')
                  : 'Eksplorasi Sains Galaksi'}
              </p>
            </div>
          </button>

          {/* Mobile Status Header */}
          {isTeacher ? (
            <div className="flex lg:hidden items-center gap-2 text-xs font-black tabular-nums">
              <span className={`px-2 py-1 rounded-lg ${isParent ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-purple-900/60 text-purple-200 border border-purple-700/50'}`}>
                {isParent ? '👩‍👦 Mode Orang Tua' : '👨‍🏫 Mode Guru'}
              </span>
            </div>
          ) : (
            <div className="flex lg:hidden items-center gap-2 text-xs font-black text-slate-700 tabular-nums">
              <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded-lg">⭐ {user.stars}</span>
              <span className="bg-orange-100 text-orange-900 px-2 py-1 rounded-lg">🔥 {user.streak}h</span>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════
            KONDISIONAL MENU UTAMA: EDUADMIN (GURU) vs GALAKSI (SISWA)
           ════════════════════════════════════════════════════════════ */}
        <div className="mt-6">
          <p className={`px-3 text-[11px] font-extrabold uppercase tracking-wider mb-2.5 ${
            isTeacher ? 'text-purple-300/70' : 'text-[#64748B]'
          }`}>
            {isTeacher ? 'Menu EduAdmin Guru' : 'Navigasi Galaksi'}
          </p>

          {isTeacher ? (
            /* MENU KHUSUS GURU / PENDIDIK */
            <nav aria-label="Menu EduAdmin Guru" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
              {teacherNavItems.map((item) => {
                const isActive = activeTeacherTab === item.tab && currentRoute === 'dashboard';
                return (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => {
                      if (onSelectTeacherTab) onSelectTeacherTab(item.tab);
                      onNavigate('dashboard');
                    }}
                    className={`relative flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-black transition-all cursor-pointer whitespace-nowrap overflow-hidden ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTeacherNavBg"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 border border-purple-300/60 shadow-[0_8px_20px_rgba(147,51,234,0.35)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                      <Icon
                        icon={item.icon}
                        className={`text-xl shrink-0 transition-colors ${isActive ? 'text-white' : item.accentColor}`}
                      />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`relative z-10 hidden xl:inline-flex rounded-lg px-2 py-0.5 text-[10px] font-black tabular-nums transition-colors ${
                          isActive
                            ? 'bg-[#FACC15] text-[#0F172A]'
                            : 'bg-purple-900/60 text-purple-200 border border-purple-700/50'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            /* MENU KHUSUS SISWA / KADET */
            <nav aria-label="Menu Navigasi Galaksi Siswa" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
              {studentNavItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className={`relative flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-black transition-all cursor-pointer whitespace-nowrap overflow-hidden ${
                      isActive
                        ? 'text-white'
                        : 'text-[#0F172A] hover:bg-slate-100 hover:text-[#4F46E5]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-indigo-600 border border-sky-200 border-b-4 border-b-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.28),inset_0_2px_4px_rgba(255,255,255,0.45)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                      <Icon
                        icon={item.icon}
                        className={`text-xl shrink-0 transition-colors ${isActive ? 'text-white' : item.accentColor}`}
                      />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`relative z-10 hidden xl:inline-flex rounded-lg px-2 py-0.5 text-[10px] font-black tabular-nums transition-colors ${
                          isActive ? 'bg-[#FACC15] text-[#0F172A]' : 'bg-sky-50 text-[#0284C7] border border-sky-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Quick links to Landing Page */}
          <div className="mt-4 space-y-1.5">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className={`w-full flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                isTeacher
                  ? 'border border-purple-800/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200'
                  : 'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon icon="solar:globus-bold-duotone" className={`text-base ${isTeacher ? 'text-amber-400' : 'text-indigo-500'}`} />
                <span>Landing Page</span>
              </span>
              <Icon icon="solar:arrow-right-linear" className={`text-sm ${isTeacher ? 'text-purple-400' : 'text-slate-400'}`} />
            </button>

            {/* Tombol 3D hanya untuk siswa (HILANGKAN DARI GURU) */}
            {!isTeacher && (
              <button
                type="button"
                onClick={() => onNavigate('landing-3d')}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 px-3.5 py-2 text-xs font-extrabold text-[#4F46E5] transition-all cursor-pointer"
              >
                <Icon icon="solar:planet-3-bold-duotone" className="text-base text-[#0284C7]" />
                <span>Panggung Galaksi 3D</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          KARTU PROFIL DI BAWAH: EDUADMIN GURU vs KADET SISWA
         ════════════════════════════════════════════════════════════ */}
      <div className={`mt-6 lg:mt-0 rounded-2xl p-4 shadow-xs ${
        isTeacher
          ? 'border border-purple-800/50 bg-[#1a0f3c] text-white shadow-xl'
          : 'border border-slate-200/90 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F0F9FF] text-[#0F172A]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-sm border ${
            isTeacher
              ? 'bg-gradient-to-br from-amber-400 to-purple-600 border-purple-400/50'
              : 'bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] border-white'
          }`}>
            {isTeacher ? (isParent ? 'OT' : 'GR') : (user.avatarSeed || 'KD')}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#1a0f3c] bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-black ${isTeacher ? 'text-white' : 'text-[#0F172A]'}`}>
              {user.name || (isTeacher ? (isParent ? 'Bapak/Ibu Wali Murid' : 'Bapak/Ibu Guru') : 'Kadet Siswa')}
            </p>
            <p className={`truncate text-xs font-bold ${isTeacher ? 'text-amber-300' : 'text-indigo-600'}`}>
              {isTeacher
                ? isParent
                  ? '👩‍👦 Wali Murid'
                  : '👨‍🏫 Guru Sains SD'
                : `${user.grade} · Lv. ${user.level}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userRole');
              localStorage.removeItem('userName');
              localStorage.removeItem('isAuthenticated');
              document.body.style.overflow = '';
              if (onLogout) {
                onLogout();
              } else {
                onNavigate('login');
              }
            }}
            title="Ganti Akun / Keluar"
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isTeacher
                ? 'hover:bg-white/10 text-purple-300 hover:text-white'
                : 'hover:bg-slate-200/60 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon icon="solar:logout-2-bold-duotone" className="text-base" />
          </button>
        </div>

        {/* Progress Bar Khusus Guru vs Siswa */}
        <div className={`mt-3 pt-3 border-t ${isTeacher ? 'border-purple-800/50' : 'border-slate-200/80'}`}>
          {isTeacher ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-purple-200/80 mb-1.5">
                <span>Rerata Nilai Kuis Kelas</span>
                <span className="text-amber-300 font-black tabular-nums">88.5%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-purple-950/70 border border-purple-800/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-purple-500 transition-all duration-500"
                  style={{ width: '88.5%' }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-[#475569] mb-1.5">
                <span>Level Progres Galaksi</span>
                <span className="text-[#0284C7] font-black tabular-nums">
                  {Math.round((user.completedMissions.length / 5) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#10B981] transition-all duration-500"
                  style={{ width: `${Math.round((user.completedMissions.length / 5) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
