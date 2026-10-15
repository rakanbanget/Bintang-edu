import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { MoleculeSimulator } from './MoleculeSimulator';

type SidebarNavKey = 'Beranda' | 'Misi Sains' | 'Lab Virtual' | 'Tantangan' | 'Peringkat';

interface VirtualLabPageProps {
  onNotify?: (msg: string) => void;
}

interface StationCard {
  id: string;
  title: string;
  category: string;
  icon: string;
  status: 'active' | 'locked';
  gradient: string;
  badgeColor: string;
  level: string;
}

export const VirtualLabPage: React.FC<VirtualLabPageProps> = ({ onNotify }) => {
  const navigate = useNavigate();
  
  // -- SYNCED DASHBOARD STATES --
  const [user, setUser] = useState<{ name: string; role: string; learning_style: string | null }>(
    () => JSON.parse(localStorage.getItem('user') || '{"name": "Minton", "role": "student", "learning_style": null}')
  );
  const [activeNav, setActiveNav] = useState<SidebarNavKey>('Lab Virtual');
  const [starCount, setStarCount] = useState<number>(1240);
  const [streakDays, setStreakDays] = useState<number>(7);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelProgressPercent, setLevelProgressPercent] = useState<number>(33);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // -- LAB SPECIFIC STATES --
  const [temperature, setTemperature] = useState<number>(25);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [isCooling, setIsCooling] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [loadingScore, setLoadingScore] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<string>('water-cycle');

  // -- DASHBOARD SYNC LOGIC --
  useEffect(() => {
    const syncDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }

        const scoresRes = await fetch('http://localhost:5001/api/scores/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const scoresData = await scoresRes.json();
        if (scoresRes.ok && scoresData.scores) {
          // Mock progress calculation similar to dashboard
          const completedCount = scoresData.scores.length;
          setLevelProgressPercent(Math.min(100, Math.round((completedCount / 6) * 100)));
          setStarCount(1240 + completedCount * 50);
        }
      } catch (err) {
        console.error('Sync lab error:', err);
      }
    };
    syncDashboardData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(prev => prev === msg ? null : prev), 3000);
    onNotify?.(msg);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSidebarNav = (nav: SidebarNavKey) => {
    setActiveNav(nav);
    if (nav === 'Beranda') navigate('/dashboard');
    else if (nav === 'Lab Virtual') navigate('/virtual-lab');
    else showToast(`🚀 Membuka menu navigasi: ${nav}`);
  };

  // -- LAB SIMULATOR LOGIC --
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHeating && temperature < 100) {
      timer = setInterval(() => setTemperature((t) => Math.min(100, t + 1)), 70);
    } else if (isCooling && temperature > 0) {
      timer = setInterval(() => setTemperature((t) => Math.max(0, t - 1)), 70);
    }
    return () => clearInterval(timer);
  }, [isHeating, isCooling, temperature]);

  const handleToggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const utter = new SpeechSynthesisUtterance();
      utter.text = `Halo Kadet ${user.name}! Suhu lab saat ini ${temperature} derajat Celsius. Kondisi molekul sedang ${temperature >= 100 ? 'berubah menjadi uap' : temperature <= 0 ? 'membeku menjadi padat' : 'mengalir sebagai cairan'}.`;
      utter.lang = 'id-ID';
      utter.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utter);
    }
  };

  const handleSendReport = async () => {
    if (temperature < 100) {
      showToast('⚠️ Naikkan suhu hingga 100°C untuk mengirim laporan!');
      return;
    }
    setLoadingScore(true);
    setTimeout(() => {
      setReportSubmitted(true);
      setStarCount(s => s + 100);
      showToast('🎉 Laporan Berhasil! +100 Bintang ditambahkan.');
      setLoadingScore(false);
    }, 1000);
  };

  const stations: StationCard[] = [
    { id: 'water-cycle', title: 'Siklus Air & Wujud Benda', category: 'Fisika & Termal', icon: 'solar:water-drop-bold-duotone', status: 'active', gradient: 'from-[#6366F1] via-[#4F46E5] to-[#0EA5E9]', badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200', level: 'Pos Orbit 01' },
    { id: 'solar-gravity', title: 'Tata Surya & Gravitasi', category: 'Kosmologi Galaksi', icon: 'solar:planet-3-bold-duotone', status: 'locked', gradient: 'from-slate-200 to-slate-300', badgeColor: 'bg-slate-100 text-slate-400 border-slate-200', level: 'Pos Orbit 02' },
    { id: 'photosynthesis', title: 'Fotosintesis Tumbuhan', category: 'Biologi Ekosistem', icon: 'solar:leaf-bold-duotone', status: 'locked', gradient: 'from-slate-200 to-slate-300', badgeColor: 'bg-slate-100 text-slate-400 border-slate-200', level: 'Pos Orbit 03' },
  ];

  const getWaterState = () => {
    if (temperature <= 0) return { label: 'PADAT (ES)', color: 'text-blue-500', icon: 'solar:snowflake-bold-duotone', badge: 'bg-blue-50 border-blue-200 text-blue-600', fill: 'bg-blue-400' };
    if (temperature >= 100) return { label: 'GAS (UAP AIR)', color: 'text-orange-500', icon: 'solar:wind-bold-duotone', badge: 'bg-orange-50 border-orange-200 text-orange-600', fill: 'bg-orange-500' };
    return { label: 'CAIR (AIR)', color: 'text-sky-500', icon: 'solar:water-drop-bold-duotone', badge: 'bg-sky-50 border-sky-200 text-sky-600', fill: 'bg-sky-400' };
  };

  const state = getWaterState();

  return (
    <div
      className="dashboard-bright-shell relative min-h-screen overflow-x-hidden bg-slate-50 bg-gradient-to-b from-slate-50 via-[#F8FAFC] to-[#F0F9FF] text-[#0F172A] font-jakarta antialiased selection:bg-[#FACC15] selection:text-slate-950"
      style={{ backgroundColor: '#F8FAFC', backgroundImage: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 55%, #F0F9FF 100%)', color: '#0F172A' }}
    >
      {/* Background Pastel Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border-2 border-[#0EA5E9] bg-white px-5 py-3.5 text-[#0F172A] shadow-[0_16px_36px_rgba(14,165,233,0.22),inset_0_2px_4px_rgba(255,255,255,0.95)] transition-all">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FACC15] text-sm font-black text-[#0F172A]">⭐</span>
          <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{toastMessage}</span>
        </div>
      )}

      {/* 1. SIDEBAR KIRI (IDENTICAL TO DASHBOARD) */}
      <aside
        className="relative z-30 w-full lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-white/95 backdrop-blur-xl border-b lg:border-b-0 lg:border-r-2 border-slate-200/90 shadow-[6px_0_28px_rgba(15,23,42,0.06)] flex flex-col justify-between p-6 select-none text-[#0F172A]"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.96)', color: '#0F172A', borderColor: 'rgba(226, 232, 240, 0.95)' }}
      >
        <div>
          <div className="flex items-center justify-between lg:justify-start gap-3 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#0EA5E9] p-1.5 shadow-[0_8px_20px_rgba(99,102,241,0.28),inset_0_2px_4px_rgba(255,255,255,0.45)] border-2 border-white">
                <svg viewBox="0 0 64 64" className="h-9 w-9 drop-shadow-sm">
                  <path d="M10 46 Q21 41 32 47 Q43 41 54 46 L54 55 Q43 50 32 56 Q21 50 10 55 Z" fill="#38BDF8" />
                  <path d="M12 43 Q22 38 32 44 Q42 38 52 43 L52 51 Q42 46 32 52 Q22 46 12 51 Z" fill="#FFFFFF" />
                  <line x1="32" y1="44" x2="32" y2="55" stroke="#0EA5E9" strokeWidth="2" />
                  <path d="M32 14 L36.8 24.2 L48 25.6 L39.8 33.4 L41.9 44.5 L32 39.2 L22.1 44.5 L24.2 33.4 L16 25.6 L27.2 24.2 Z" fill="#FACC15" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" />
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
                  <span className="text-lg font-extrabold tracking-tight text-[#0F172A] leading-none">Bintang <span className="text-[#0284C7]">Edu</span></span>
                  <span className="rounded-md bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-[10px] font-extrabold text-[#4F46E5]">M-ONE</span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-[#64748B]">Eksplorasi Sains Galaksi SD</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2.5">Navigasi Utama Galaksi</p>
            <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
              {[
                { key: 'Beranda', icon: 'solar:home-smile-bold-duotone', accentColor: 'text-[#0284C7]' },
                { key: 'Misi Sains', icon: 'solar:compass-big-bold-duotone', accentColor: 'text-emerald-500' },
                { key: 'Lab Virtual', icon: 'solar:test-tube-bold-duotone', accentColor: 'text-orange-500', badge: 'Aktif' },
                { key: 'Tantangan', icon: 'solar:bolt-circle-bold-duotone', accentColor: 'text-pink-500' },
                { key: 'Peringkat', icon: 'solar:cup-star-bold-duotone', accentColor: 'text-amber-500' },
              ].map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSidebarNav(item.key as SidebarNavKey)}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-indigo-600 text-white border border-sky-200 border-b-4 border-b-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.32),inset_0_2px_4px_rgba(255,255,255,0.45)]'
                        : 'text-[#0F172A] hover:bg-slate-100 hover:text-[#4F46E5] border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon icon={item.icon} className={`text-xl shrink-0 ${isActive ? 'text-white' : item.accentColor}`} />
                      <span>{item.key}</span>
                    </span>
                    {item.badge && <span className={`hidden xl:inline-flex rounded-lg px-2 py-0.5 text-[10px] font-extrabold ${isActive ? 'bg-[#FACC15] text-[#0F172A]' : 'bg-sky-50 text-[#0284C7]'}`}>{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
            <button
              onClick={() => navigate('/')}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-indigo-200 border-b-4 border-b-indigo-300 bg-indigo-50/90 hover:bg-indigo-100 px-3.5 py-2.5 text-xs font-extrabold text-[#4F46E5] shadow-[0_6px_14px_rgba(99,102,241,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Icon icon="solar:planet-3-bold-duotone" className="text-base text-[#0284C7]" />
              <span>Panggung Galaksi 3D</span>
            </button>
          </div>
        </div>

        <div className="mt-6 lg:mt-0 rounded-3xl border-2 border-slate-200/90 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F0F9FF] p-4 text-[#0F172A] shadow-[0_12px_26px_rgba(15,23,42,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)]">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] text-sm font-extrabold text-white shadow-md border-2 border-white">
              {user.name.substring(0, 2).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-[#0F172A]">{user.name}</p>
              <p className="truncate text-[10px] font-bold text-[#4F46E5]">{user.learning_style || 'Kadet Penjelajah'}</p>
              <div className="flex gap-2 mt-1">
                <button onClick={handleLogout} className="text-[10px] font-bold text-rose-600 hover:underline"><Icon icon="lucide:log-out" inline /> Keluar</button>
              </div>
            </div>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#475569] mb-1.5">
              <span>Progres Kadet Sains</span>
              <span className="text-[#0284C7] font-extrabold tabular-nums">{levelProgressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 p-0.5 border border-slate-300/80">
              <div className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#10B981] transition-all duration-500" style={{ width: `${levelProgressPercent}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="relative z-10 lg:pl-64 min-h-screen" style={{ backgroundColor: 'transparent' }}>
        <div className="mx-auto max-w-[1440px] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* MIDDLE COLUMN: lg:col-span-8 */}
          <main className="lg:col-span-8 space-y-6 min-w-0">
            {/* Top Bar Header (IDENTICAL TO DASHBOARD) */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-2 border-slate-200/90 bg-white/95 p-4 sm:px-6 text-[#0F172A] shadow-[0_14px_34px_rgba(15,23,42,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl">
              <div className="relative flex-1 max-w-md">
                <Icon icon="solar:magnifer-linear" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#0284C7]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari topik eksperimen: siklus air, gravitasi, fotosintesis..."
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-sm font-bold text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-amber-300 border-b-4 border-b-amber-400 bg-[#FFFBEB] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#78350F] shadow-sm tabular-nums whitespace-nowrap">
                  <span>⭐</span> <span>{starCount.toLocaleString('en-US')} Bintang</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-orange-200 border-b-4 border-b-orange-300 bg-[#FFF7ED] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#9A3412] shadow-sm tabular-nums whitespace-nowrap">
                  <span>🔥</span> <span>{streakDays} Hari Streak</span>
                </div>
              </div>
            </header>

            {/* Banner Lab Virtual (Cosmic Dark Banner) */}
            <section
              className="cosmic-dark-card relative overflow-hidden rounded-3xl bg-slate-950 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-6 sm:p-8 text-white shadow-[0_22px_48px_rgba(2,6,23,0.38),0_0_28px_rgba(56,189,248,0.24),inset_0_2px_6px_rgba(255,255,255,0.22)] border-2 border-indigo-400/65 border-b-[5px] border-b-[#38BDF8]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-45"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1.6px), radial-gradient(circle, rgba(250,204,21,0.8) 1px, transparent 1.6px)', backgroundSize: '32px 32px, 48px 48px', backgroundPosition: '0 0, 16px 20px' }}
              />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/90 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#FACC15] border border-indigo-400/60 shadow-sm">
                   🔭 STASIUN LAB VIRTUAL ADAPTIF
                </div>
                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Lab Sains Galaksi: Siklus Air</h1>
                <p className="mt-2 text-xs sm:text-sm font-medium text-indigo-100/90 max-w-2xl">
                  Selamat datang di workbench interaktif! Di sini kamu bisa memanipulasi variabel alam semesta secara nyata. Ubah suhu untuk melihat perubahan wujud molekul air secara langsung!
                </p>
              </div>
            </section>

            {/* Experiment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               {stations.map(st => (
                 <button
                  key={st.id}
                  onClick={() => st.status === 'active' && setSelectedStation(st.id)}
                  className={`group relative flex flex-col items-start rounded-3xl border-2 p-5 transition-all ${st.status === 'active' ? 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-xl' : 'bg-slate-100/50 border-slate-100 opacity-60'}`}
                 >
                   <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110 bg-gradient-to-br ${st.gradient}`}>
                      <Icon icon={st.icon} className="text-2xl text-white" />
                   </div>
                   <span className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase ${st.badgeColor}`}>{st.status === 'active' ? 'Aktif' : 'Terkunci'}</span>
                   <h3 className="mt-2 text-sm font-black text-slate-900">{st.title}</h3>
                   <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{st.category}</p>
                   {st.status === 'active' && st.id === selectedStation && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />}
                 </button>
               ))}
            </div>

            {/* Workbench Simulator Card (Bright Card) */}
            <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-[0_12px_24px_rgba(15,23,42,0.05)] relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center"><Icon icon="solar:atom-bold-duotone" className="text-2xl text-sky-600" /></div>
                       <div>
                          <h2 className="text-lg font-black text-slate-900">Workbench Simulator Interaktif</h2>
                          <p className="text-xs font-bold text-slate-400">Manipulasi variabel suhu dan amati molekul</p>
                       </div>
                    </div>
                    <div className={`rounded-2xl px-4 py-2 border-2 font-black text-sm ${state.badge}`}>
                       {state.label}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                    {/* Visualizer - Interactive Molecule Canvas */}
                    <div className="md:col-span-5 flex flex-col items-center">
                       <MoleculeSimulator 
                         temperature={temperature}
                         isHeating={isHeating}
                         isCooling={isCooling}
                       />
                    </div>

                    {/* Controls */}
                    <div className="md:col-span-7 space-y-6">
                       <div className="rounded-3xl border-2 border-slate-100 bg-slate-50 p-6 shadow-inner">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sensor Termal Digital</p>
                          <div className="flex items-baseline gap-2">
                             <span className="text-6xl font-black text-slate-900 tabular-nums tracking-tighter">{temperature}</span>
                             <span className="text-3xl font-black text-sky-500">°C</span>
                          </div>
                          <div className="mt-5 h-4 w-full rounded-full bg-slate-200 p-1">
                             <div className={`h-full rounded-full transition-all duration-300 ${state.fill} shadow-[0_0_12px_rgba(14,165,233,0.4)]`} style={{ width: `${temperature}%` }} />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                             <span>❄️ 0°C (Beku)</span>
                             <span>Kamar (25°C)</span>
                             <span>🔥 100°C (Uap)</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={temperature}
                            onChange={(e) => setTemperature(parseInt(e.target.value))}
                            className="w-full h-3 bg-slate-200 rounded-xl appearance-none cursor-pointer accent-sky-500 shadow-inner"
                          />
                       </div>

                       <div className="grid grid-cols-3 gap-4">
                          <button
                            onMouseDown={() => setIsHeating(true)}
                            onMouseUp={() => setIsHeating(false)}
                            className="group flex flex-col items-center gap-1 py-4 rounded-2xl bg-orange-50 border-2 border-orange-100 text-orange-600 font-black transition-all hover:bg-orange-100 hover:scale-105 active:scale-95"
                          >
                             <Icon icon="solar:fire-bold" className="text-xl group-hover:animate-bounce" />
                             <span className="text-[10px] uppercase">Panaskan</span>
                          </button>
                          <button
                            onMouseDown={() => setIsCooling(true)}
                            onMouseUp={() => setIsCooling(false)}
                            className="group flex flex-col items-center gap-1 py-4 rounded-2xl bg-sky-50 border-2 border-sky-100 text-sky-600 font-black transition-all hover:bg-sky-100 hover:scale-105 active:scale-95"
                          >
                             <Icon icon="solar:snowflake-bold" className="text-xl group-hover:animate-spin" />
                             <span className="text-[10px] uppercase">Dinginkan</span>
                          </button>
                          <button
                            onClick={() => setTemperature(25)}
                            className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-500 font-black transition-all hover:bg-slate-200"
                          >
                             <Icon icon="solar:refresh-bold" className="text-xl" />
                             <span className="text-[10px] uppercase">Reset</span>
                          </button>
                       </div>
                    </div>
                 </div>
               </div>
            </section>
          </main>

          {/* RIGHT COLUMN: lg:col-span-4 (IDENTICAL WIDGET STYLE) */}
          <aside className="lg:col-span-4 space-y-6">
             {/* Penjelasan Adaptif Widget (Cosmic Dark Card matching Dashboard) */}
             <section className="cosmic-dark-card rounded-3xl border-2 border-indigo-400/60 bg-slate-950 bg-gradient-to-b from-slate-950 via-[#1E1B4B] to-slate-950 p-6 text-white relative overflow-hidden shadow-xl">
               <div className="relative z-10 space-y-5">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-2xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                     <Icon icon="solar:magic-stick-3-bold-duotone" className="text-2xl text-sky-400" />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-sky-100">Kadet Foxy: Penjelasan</h3>
                 </div>

                 {user.learning_style === 'auditory' ? (
                   <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Icon icon="solar:headphones-round-bold-duotone" className="text-xl text-sky-400" />
                           <span className="text-xs font-bold text-sky-200">Voice Explainer</span>
                        </div>
                        <button onClick={handleToggleAudio} className="h-9 w-9 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-lg transition-all">
                          <Icon icon={isPlayingAudio ? 'solar:pause-bold' : 'solar:play-bold'} className="text-lg" />
                        </button>
                     </div>
                     <div className="flex gap-1 h-6 items-center px-1">
                        {[3,7,4,9,5,8,4,10,6,7,4].map((h, i) => (
                          <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-sky-400 animate-pulse' : 'bg-white/10'}`} style={{ height: `${h * 10}%` }} />
                        ))}
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {[
                       { t: 'Kondensasi', d: 'Uap mendingin jadi cair (Embun)', color: 'text-sky-400', bg: 'bg-sky-500/10' },
                       { t: 'Evaporasi', d: 'Air panas jadi uap (Gas)', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                       { t: 'Kristalisasi', d: 'Air beku jadi padat (Es)', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                     ].map((f, i) => (
                       <div key={i} className={`flex items-start gap-3 rounded-2xl border border-white/5 p-3.5 ${f.bg} transition-all hover:bg-white/10`}>
                         <div className={`mt-1 h-2 w-2 rounded-full ${f.color.replace('text', 'bg')}`} />
                         <div>
                           <p className={`text-[10px] font-black uppercase tracking-wider ${f.color}`}>{f.t}</p>
                           <p className="text-xs font-medium text-slate-300 mt-0.5">{f.d}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </section>

             {/* Misi Lab Widget (Bright Card) */}
             <section className="rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-lg shadow-emerald-500/5 space-y-5">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                     <Icon icon="solar:target-bold-duotone" className="text-2xl text-emerald-600" />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800">Tugas Eksperimen</h3>
                </div>
                
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                   <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                     "Gunakan slider suhu atau tombol panaskan untuk mencapai <span className="text-orange-600 font-black">100°C</span>. Amati perubahan molekul menjadi uap air!"
                   </p>
                </div>

                <div className="flex items-center justify-between px-2">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Hadiah Bintang</p>
                      <p className="text-lg font-black text-slate-900">+100 ⭐</p>
                   </div>
                   <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl border-2 border-amber-200 shadow-inner">⭐</div>
                </div>

                <button
                  onClick={handleSendReport}
                  disabled={reportSubmitted || loadingScore}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${reportSubmitted ? 'bg-slate-200 text-slate-400 border-2 border-slate-300' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-200 hover:scale-[1.03] active:scale-95 border-b-4 border-emerald-700'}`}
                >
                  {loadingScore ? 'Memproses...' : reportSubmitted ? 'Laporan Diterima ✅' : 'Kirim Laporan Riset'}
                </button>
             </section>

             {/* Fakta Cepat Widget */}
             <div className="rounded-3xl border-2 border-slate-100 bg-slate-50/80 p-6 flex items-start gap-4">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-xl shadow-sm">💡</div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fakta Cepat</p>
                   <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">
                      Tahukah kamu? Air adalah satu-satunya zat di Bumi yang secara alami ditemukan dalam tiga wujud sekaligus: padat, cair, dan gas!
                   </p>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};