import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { AppViewRoute, UserSession } from '../types/navigation.ts';

interface AuthAndLandingPageProps {
  initialMode?: 'landing' | 'login' | 'register';
  onNavigate: (route: AppViewRoute) => void;
  onLoginSuccess: (user: Partial<UserSession>) => void;
}

export const AuthAndLandingPage: React.FC<AuthAndLandingPageProps> = ({
  initialMode = 'landing',
  onNavigate,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Form states
  const [fullName, setFullName] = useState<string>('Kadet Bintang Cilik');
  const [email, setEmail] = useState<string>('kadet@bintangedu.id');
  const [password, setPassword] = useState<string>('Bintang123!');
  const [confirmPassword, setConfirmPassword] = useState<string>('Bintang123!');
  const [grade, setGrade] = useState<string>('Kelas 5 SD');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ['Sangat Pendek 👶', 'Cukup Aman 🛡️', 'Bagus & Kuat 🚀', 'Kuat Super Galaksi! ⭐'];
  const strengthColors = ['bg-rose-400', 'bg-amber-400', 'bg-sky-400', 'bg-emerald-400'];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Mohon masukkan email dan password kadet!');
      return;
    }
    setErrorMsg(null);
    onLoginSuccess({
      email,
      name: fullName || 'Kadet Penjelajah',
      grade,
    });
    onNavigate('dashboard');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Lengkapi data pendaftaran kadet ya!');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password konfirmasi tidak cocok!');
      return;
    }
    setErrorMsg(null);
    onLoginSuccess({
      name: fullName,
      email,
      grade,
      stars: 100, // Bonus pendaftaran baru
      xp: 50,
    });
    onNavigate('dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    onLoginSuccess({
      name: `Kadet (${provider})`,
      email: `kadet.${provider.toLowerCase()}@bintangedu.id`,
    });
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between selection:bg-yellow-300 selection:text-indigo-950">
      {/* 1. Header Bersih Landing / Auth */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#0EA5E9] p-1.5 shadow-md border-2 border-white">
            <svg viewBox="0 0 64 64" className="h-8 w-8 drop-shadow-sm">
              <path d="M10 46 Q21 41 32 47 Q43 41 54 46 L54 55 Q43 50 32 56 Q21 50 10 55 Z" fill="#38BDF8" />
              <path d="M12 43 Q22 38 32 44 Q42 38 52 43 L52 51 Q42 46 32 52 Q22 46 12 51 Z" fill="#FFFFFF" />
              <path
                d="M32 14 L36.8 24.2 L48 25.6 L39.8 33.4 L41.9 44.5 L32 39.2 L22.1 44.5 L24.2 33.4 L16 25.6 L27.2 24.2 Z"
                fill="#FACC15"
                stroke="#F59E0B"
                strokeWidth="1.5"
              />
              <circle cx="28.5" cy="29" r="1.7" fill="#0F172A" />
              <circle cx="35.5" cy="29" r="1.7" fill="#0F172A" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">
              Bintang <span className="text-[#0284C7]">Edu</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-500">Platform Sains Interaktif SD</p>
          </div>
        </div>

        {/* Quick Nav Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          {authMode === 'landing' ? (
            <>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Daftar Gratis 🚀
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAuthMode('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <Icon icon="solar:arrow-left-linear" className="text-base" />
              <span>Kembali ke Beranda</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT: LANDING vs LOGIN vs REGISTER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {authMode === 'landing' && (
          <div className="space-y-12">
            {/* HERO BANNER BIRU-UNGU CERAH ELEGAN */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 border border-indigo-400/40 p-8 sm:p-12 text-white shadow-2xl">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-purple-400/30 px-3.5 py-1 text-xs font-bold text-yellow-300">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Petualangan Sains Resmi Kurikulum Merdeka SD</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                    Jelajahi Sains Bersama <br />
                    <span className="text-yellow-300 drop-shadow-sm">
                      Kadet Antariksa Bintang Edu!
                    </span>
                  </h2>

                  <p className="text-white/95 font-medium text-sm sm:text-base leading-relaxed max-w-xl drop-shadow-xs">
                    Belajar siklus air, orbit gravitasi tata surya, dan fotosintesis tanaman lewat laboratorium virtual
                    beranimasi 60 FPS, kuis berhadiah bintang ⭐, dan misi sains gamifikasi yang seru!
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('dashboard')}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 text-white font-black text-sm sm:text-base shadow-xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Mulai Berpetualang 🚀</span>
                      <Icon icon="solar:arrow-right-bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('virtual-lab')}
                      className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Icon icon="solar:test-tube-bold-duotone" className="text-sky-300 text-lg" />
                      <span>Masuk Lab Virtual</span>
                    </button>
                  </div>

                  {/* Highlights Mini */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                    <div>
                      <p className="text-xl font-black text-yellow-300">100%</p>
                      <p className="text-[11px] text-slate-400">Interaktif & Visual</p>
                    </div>
                    <div>
                      <p className="text-xl font-black text-sky-300">3 Modul</p>
                      <p className="text-[11px] text-slate-400">Lab Fisika & Biologi</p>
                    </div>
                    <div>
                      <p className="text-xl font-black text-emerald-300">5 Pos</p>
                      <p className="text-[11px] text-slate-400">Orbit Kurikulum SD</p>
                    </div>
                  </div>
                </div>

                {/* Maskot / 3D Visual Box */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 p-6 border-2 border-indigo-400/40 shadow-[0_20px_50px_rgba(79,70,229,0.35)] flex flex-col items-center justify-center text-center">
                    <div className="absolute -top-3 -right-3 rounded-full bg-yellow-400 text-indigo-950 font-black px-3 py-1 text-xs shadow-lg animate-bounce">
                      ✨ Level Baru!
                    </div>
                    <div className="text-7xl mb-3 animate-pulse">🚀</div>
                    <h3 className="text-xl font-black text-white">Laboratorium Galaksi</h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-[200px]">
                      Tempat eksperimen fisika molekul air, tata surya & klorofil tanaman!
                    </p>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="mt-4 px-4 py-2 rounded-xl bg-white text-indigo-950 font-black text-xs hover:bg-yellow-300 transition-colors cursor-pointer"
                    >
                      Buka Akun Saya
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FITUR UNGGULAN KARTU PUTIH CLAYMORPHISM */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-black tracking-wider uppercase text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  Wahana Eksplorasi Sains
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Kenapa Belajar di Bintang Edu Lebih Menyenangkan?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Didesain khusus untuk imajinasi anak-anak Sekolah Dasar usia 7-12 tahun.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kartu 1 */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="h-14 w-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-3xl mb-4 border border-sky-200">
                    🔬
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Lab Virtual Real-time</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Eksperimen molekul air H2O dalam panci ajaib, simulasi gravitasi di Mars dan Jupiter, serta fotosintesis
                    kebun ajaib.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('virtual-lab')}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    <span>Coba Lab Virtual</span>
                    <Icon icon="solar:arrow-right-linear" />
                  </button>
                </div>

                {/* Kartu 2 */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4 border border-emerald-200">
                    🗺️
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Misi Jalur Galaksi</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Jelajahi 5 Pos Orbit terpadu mulai dari Anatomi Tubuh Manusia, Siklus Air Atmosfer, Kalor Energi, hingga
                    Puncak Tata Surya.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('misi-sains')}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <span>Buka Jalur Misi</span>
                    <Icon icon="solar:arrow-right-linear" />
                  </button>
                </div>

                {/* Kartu 3 */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="h-14 w-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mb-4 border border-amber-200">
                    🏆
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Tantangan Kuis & Podium</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Kumpulkan Bintang Emas ⭐, naikkan XP kadet, capai status beruntun (streak), dan bersaing di podium
                    penjelajah terbaik se-Indonesia.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('tantangan-kuis')}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    <span>Mulai Kuis Harian</span>
                    <Icon icon="solar:arrow-right-linear" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FORM LOGIN CARD */}
        {authMode === 'login' && (
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white items-center justify-center text-2xl shadow-md mb-3">
                  🚀
                </div>
                <h3 className="text-2xl font-black text-slate-900">Selamat Datang, Kadet!</h3>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  Masuk untuk melanjutkan petualangan sains antariksamu
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-600 flex items-center gap-2">
                  <Icon icon="solar:danger-triangle-bold" className="text-base shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Kadet / Sekolah
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: minton@bintangedu.id"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-semibold text-slate-800 outline-none transition-all"
                    />
                    <Icon
                      icon="solar:letter-bold-duotone"
                      className="absolute left-3 top-3.5 text-slate-400 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      Kata Sandi Rahasia
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Fitur reset password demo: Gunakan password apa saja!')}
                      className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                    >
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      required
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-semibold text-slate-800 outline-none transition-all"
                    />
                    <Icon
                      icon="solar:lock-keyhole-bold-duotone"
                      className="absolute left-3 top-3.5 text-slate-400 text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <Icon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="text-lg" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                    />
                    <span>Ingat saya di pesawat ruang angkasa ini</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-sky-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:login-2-bold" className="text-lg" />
                  <span>Masuk ke Kokpit Sains 🚀</span>
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Atau Masuk Cepat Dengan
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Icon icon="logos:google-icon" className="text-base" />
                    <span>Google Belajar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('RumahBelajar')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Icon icon="solar:diploma-bold-duotone" className="text-base text-indigo-500" />
                    <span>Akun Sekolah</span>
                  </button>
                </div>

                <p className="text-xs font-bold text-slate-500 mt-5">
                  Belum punya akun kadet?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-sky-600 font-black hover:underline cursor-pointer"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. FORM REGISTER CARD */}
        {authMode === 'register' && (
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-sky-600 text-white items-center justify-center text-2xl shadow-md mb-3">
                  ⭐
                </div>
                <h3 className="text-2xl font-black text-slate-900">Daftar Kadet Sains Baru</h3>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  Dapatkan 100 Bintang Bonus & seragam astronot pertamamu!
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-600 flex items-center gap-2">
                  <Icon icon="solar:danger-triangle-bold" className="text-base shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Kadet
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="contoh: Bintang Pratama"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-semibold text-slate-800 outline-none transition-all"
                    />
                    <Icon icon="solar:user-bold-duotone" className="absolute left-3 top-3.5 text-slate-400 text-lg" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Tingkat Kelas SD
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-bold text-slate-800 outline-none transition-all cursor-pointer bg-white"
                  >
                    <option value="Kelas 1 SD">Kelas 1 SD (Kadet Bintang Muda)</option>
                    <option value="Kelas 2 SD">Kelas 2 SD (Kadet Langit)</option>
                    <option value="Kelas 3 SD">Kelas 3 SD (Kadet Bumi)</option>
                    <option value="Kelas 4 SD">Kelas 4 SD (Kadet Penjelajah)</option>
                    <option value="Kelas 5 SD">Kelas 5 SD (Kadet Orbit Sains)</option>
                    <option value="Kelas 6 SD">Kelas 6 SD (Komandan Bintang Galaksi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Kadet / Orang Tua
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: orangtua@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-semibold text-slate-800 outline-none transition-all"
                    />
                    <Icon
                      icon="solar:letter-bold-duotone"
                      className="absolute left-3 top-3.5 text-slate-400 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Buat Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter..."
                      required
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-semibold text-slate-800 outline-none transition-all"
                    />
                    <Icon
                      icon="solar:lock-keyhole-bold-duotone"
                      className="absolute left-3 top-3.5 text-slate-400 text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <Icon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="text-lg" />
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Kekuatan Sandi:</span>
                      <span className="text-slate-700">{strengthLabels[strengthScore] || 'Lemah'}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strengthScore >= 1 ? strengthColors[strengthScore] : 'bg-transparent'}`} />
                      <div className={`h-full ${strengthScore >= 2 ? strengthColors[strengthScore] : 'bg-transparent'}`} />
                      <div className={`h-full ${strengthScore >= 3 ? strengthColors[strengthScore] : 'bg-transparent'}`} />
                      <div className={`h-full ${strengthScore >= 4 ? strengthColors[strengthScore] : 'bg-transparent'}`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Ulangi Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi..."
                      required
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-semibold text-slate-800 outline-none transition-all"
                    />
                    <Icon
                      icon="solar:shield-check-bold-duotone"
                      className="absolute left-3 top-3.5 text-slate-400 text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <Icon
                        icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        className="text-lg"
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-600 text-white font-black text-sm shadow-lg shadow-emerald-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Icon icon="solar:user-plus-bold" className="text-lg" />
                  <span>Daftar & Terima +100 ⭐ Bonus</span>
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-500">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-sky-600 font-black hover:underline cursor-pointer"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER RINGKAS */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-bold text-slate-500">
        <p>© 2026 Bintang Edu Platform — Petualangan Sains SD Ramah Anak Indonesia 🇮🇩</p>
      </footer>
    </div>
  );
};
