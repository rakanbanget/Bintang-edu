import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BintangEduMascot } from './BintangEduLogo.tsx';

<<<<<<< HEAD
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  learning_style?: string | null;
}

=======
>>>>>>> f3aebd2586ba85aef31e016c75ed5d168fbf403c
interface LoginPageProps {
  onBackToHome?: () => void;
  onGoToRegister?: () => void;
  onNotify?: (msg: string) => void;
<<<<<<< HEAD
  onLoginSuccess?: (userData?: any) => void;
=======
>>>>>>> f3aebd2586ba85aef31e016c75ed5d168fbf403c
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onGoToRegister,
  onNotify,
<<<<<<< HEAD
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'student' | 'teacher' | 'parent'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = (params.get('role') || localStorage.getItem('userRole') || '').toLowerCase();
      if (r.includes('guru') || r.includes('teacher') || r.includes('pendidik')) return 'teacher';
      if (r.includes('ortu') || r.includes('parent') || r.includes('orang tua')) return 'parent';
    }
    return 'teacher'; // Prioritaskan guru agar memudahkan pengajar langsung masuk
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      const msg = '⚠️ Isi email dan kata sandi terlebih dahulu!';
      setErrorMessage(msg);
      onNotify?.(msg);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Email atau kata sandi tidak sesuai!');
      }

      const backendRole = (data.user?.role || '').toLowerCase();
      // Prioritas: Jika user memilih tab Guru ATAU akun database adalah teacher -> role MUST be teacher!
      const isTeacher = loginRole === 'teacher' || backendRole === 'teacher' || backendRole.includes('guru') || backendRole.includes('pendidik');
      const isParent = !isTeacher && (loginRole === 'parent' || backendRole === 'parent' || backendRole.includes('orang tua'));

      const finalRole = isTeacher ? 'teacher' : isParent ? 'parent' : 'student';
      const userRoleNormalized = isTeacher ? 'guru' : isParent ? 'orang tua' : 'siswa';
      const userName = data.user?.name || (userRoleNormalized === 'guru' ? 'Bapak/Ibu Guru' : 'Kadet');

      const userObject = {
        ...data.user,
        role: finalRole,
        name: userName,
        grade: isTeacher ? 'Pendidik Sains SD' : isParent ? 'Wali Murid SD' : (data.user?.grade || 'Kelas 5 SD'),
      };

      localStorage.setItem('token', data.token || 'auth-token');
      localStorage.setItem('user', JSON.stringify(userObject));
      localStorage.setItem('userRole', userRoleNormalized);
      localStorage.setItem('userName', userName);
      localStorage.setItem('isAuthenticated', 'true');
      document.body.style.overflow = '';

      const successNotice =
        finalRole === 'teacher'
          ? `Selamat Datang di Portal EduAdmin Guru, ${userName}! 👨‍🏫`
          : finalRole === 'parent'
          ? `Selamat Datang di Portal Orang Tua, ${userName}! 👩‍👦`
          : `Selamat Datang di Stasiun Bintang Edu, ${userName}! 🚀`;
      setSuccessMessage(successNotice);
      if (onNotify) onNotify(successNotice);

      // Transisi ke dashboard
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(userObject);
      }, 150);
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Network')) {
        const isTeacher = loginRole === 'teacher';
        const isParent = !isTeacher && loginRole === 'parent';
        const finalRole = isTeacher ? 'teacher' : isParent ? 'parent' : 'student';
        const userRoleNormalized = isTeacher ? 'guru' : isParent ? 'orang tua' : 'siswa';
        const fallbackUser = {
          id: Date.now(),
          name: isTeacher ? 'Bapak/Ibu Guru' : isParent ? 'Wali Murid' : 'Kadet Pengguna',
          email,
          role: finalRole,
          grade: isTeacher ? 'Pendidik Sains SD' : isParent ? 'Wali Murid SD' : 'Kelas 5 SD',
        };
        localStorage.setItem('token', 'local-token');
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        localStorage.setItem('userRole', userRoleNormalized);
        localStorage.setItem('userName', fallbackUser.name);
        localStorage.setItem('isAuthenticated', 'true');
        document.body.style.overflow = '';
        if (onLoginSuccess) onLoginSuccess(fallbackUser);
        return;
      }
      const errMsg = err.message || 'Email atau kata sandi tidak cocok.';
      setErrorMessage(errMsg);
      if (onNotify) onNotify(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
=======
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onNotify?.('⚠️ Isi email/nomor ponsel dan kata sandi dulu ya!');
      return;
    }
    onNotify?.('🚀 Selamat datang kembali, Ilmuwan Cilik! Memasuki petualangan...');
>>>>>>> f3aebd2586ba85aef31e016c75ed5d168fbf403c
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 relative overflow-hidden">
      {/* Dekorasi latar galaksi yang hidup */}
      <div className="pointer-events-none absolute top-10 left-10 text-yellow-300/60 animate-floaty">
        <Icon icon="lucide:sparkles" className="h-10 w-10" />
      </div>
      <div className="pointer-events-none absolute top-20 right-20 text-white/20 animate-twinkle">
        <Icon icon="lucide:star" className="h-4 w-4" />
      </div>
      <div className="pointer-events-none absolute bottom-12 right-14 text-cyan-300/40 animate-drift">
        <Icon icon="lucide:star" className="h-8 w-8" />
      </div>
      <div className="pointer-events-none absolute top-1/3 right-10 text-yellow-200/40 animate-twinkle">
        <Icon icon="lucide:star" className="h-5 w-5" />
      </div>
      <div className="pointer-events-none absolute bottom-1/4 left-16 text-indigo-200/40 animate-floaty">
        <Icon icon="lucide:sparkles" className="h-6 w-6" />
      </div>
      <div className="pointer-events-none absolute top-1/2 left-20 text-orange-300/20 animate-drift">
        <Icon icon="lucide:circle" className="h-12 w-12" />
      </div>
      <div className="pointer-events-none absolute bottom-1/3 right-1/4 text-purple-300/20 animate-twinkle">
        <Icon icon="lucide:sparkle" className="h-6 w-6" />
      </div>

      {/* Bola glow lembut */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

      {/* Tombol kembali (mobile & desktop) */}
      {onBackToHome && (
        <button
          type="button"
          onClick={onBackToHome}
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-1.5 font-body text-xs font-bold text-white hover:text-yellow-300 transition-colors cursor-pointer"
        >
          <Icon icon="lucide:arrow-left" className="h-4 w-4" />
          Kembali ke Beranda
        </button>
      )}

      {/* Split-Screen Layout: Dual Panel */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {/* KOLOM KIRI: Panel Visual Galaksi (hidden di mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white">
          <div className="max-w-lg text-center space-y-6">
            {/* Maskot Astronot */}
            <div className="flex justify-center">
              <div className="relative">
                <BintangEduMascot className="h-40 w-40 drop-shadow-2xl" withBadge={true} />
                <div className="absolute -top-6 -right-8 text-yellow-300 animate-floaty">
                  <Icon icon="lucide:rocket" className="h-16 w-16" />
                </div>
              </div>
            </div>

            {/* Logo & Branding */}
            <div>
              <div className="font-heading text-5xl font-bold tracking-tight leading-none">
                <span className="text-yellow-400">Bintang</span>{' '}
                <span className="text-white">Edu</span>
              </div>
              <p className="mt-2 font-body text-sm font-bold tracking-wide text-indigo-200">
                Belajar Sains, Bermain Tanpa Batas
              </p>
            </div>

            {/* Teks Inspiratif */}
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-bold text-white leading-snug">
                Petualangan Sains <br />Tanpa Batas
              </h2>
              <p className="font-body text-sm font-semibold text-indigo-100 leading-relaxed">
                Bergabunglah dengan ribuan ilmuwan cilik yang sudah menjelajahi galaksi pengetahuan bersama Bintang Edu. Terbang bersama roket ilmu pengetahuan!
              </p>
            </div>

            {/* Dekorasi icon */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="text-yellow-300/70 animate-twinkle">
                <Icon icon="lucide:sparkles" className="h-8 w-8" />
              </div>
              <div className="text-cyan-300/70 animate-floaty">
                <Icon icon="lucide:telescope" className="h-10 w-10" />
              </div>
              <div className="text-orange-300/70 animate-drift">
                <Icon icon="lucide:atom" className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Panel Formulir */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            
            {/* Logo Mobile (tampil di mobile saja) */}
            <div className="lg:hidden flex flex-col items-center text-center mb-6">
              <BintangEduMascot className="h-20 w-20" withBadge={true} />
              <div className="mt-2 font-heading text-2xl font-bold tracking-tight leading-none">
                <span className="text-yellow-500">Bintang</span>{' '}
                <span className="text-indigo-800">Edu</span>
              </div>
              <p className="mt-1 font-body text-[11px] font-bold tracking-wide text-indigo-400">
                Belajar Sains, Bermain Tanpa Batas
              </p>
            </div>

            {/* Judul form */}
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-indigo-950 text-center flex items-center justify-center gap-2">
              <span>Masuk Petualangan</span>
              <Icon icon="lucide:rocket" className="h-6 w-6 text-purple-600 shrink-0" />
            </h1>
            <p className="mt-2 font-body text-xs font-semibold text-slate-500 text-center">
              Lanjutkan petualangan sainsmu di galaksi pengetahuan
            </p>

<<<<<<< HEAD
            {/* Galaxy Alert Banner */}
            {errorMessage && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-red-700 shadow-sm animate-pulse">
                <Icon icon="lucide:alert-triangle" className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <span className="font-body text-xs font-bold leading-relaxed">{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-800 shadow-sm">
                <Icon icon="lucide:check-circle-2" className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                <span className="font-body text-xs font-bold leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Form login */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Pilihan Peran / Role Masuk */}
              <div>
                <label className="mb-1.5 block font-body text-xs font-bold text-indigo-950">
                  Masuk Sebagai
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginRole('student')}
                    className={`rounded-xl border-2 py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginRole === 'student'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon icon="lucide:graduation-cap" className="h-4 w-4" />
                    <span>Siswa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('teacher')}
                    className={`rounded-xl border-2 py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginRole === 'teacher'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon icon="lucide:book-open" className="h-4 w-4" />
                    <span>Guru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('parent')}
                    className={`rounded-xl border-2 py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginRole === 'parent'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon icon="lucide:heart-handshake" className="h-4 w-4" />
                    <span>Orang Tua</span>
                  </button>
                </div>
              </div>

=======
            {/* Form login */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
>>>>>>> f3aebd2586ba85aef31e016c75ed5d168fbf403c
              {/* Input Email / Nomor Ponsel */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block font-body text-xs font-bold text-indigo-950"
                >
                  Email / Nomor Ponsel
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:user"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com / 0812xxxx"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 font-body text-sm font-semibold text-indigo-950 placeholder:text-slate-400 placeholder:font-normal outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              {/* Input Kata Sandi */}
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block font-body text-xs font-bold text-indigo-950"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:lock"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 font-body text-sm font-semibold text-indigo-950 placeholder:text-slate-400 placeholder:font-normal outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    <Icon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Ingat saya + Lupa sandi */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 font-body text-xs font-semibold text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded accent-purple-600 cursor-pointer"
                  />
                  Ingat saya
                </label>
                <button
                  type="button"
                  onClick={() => onNotify?.('📧 Tautan reset kata sandi dikirim ke emailmu!')}
                  className="font-body text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>

              {/* Tombol aksi utama kuning/oranye */}
              <button
                type="submit"
<<<<<<< HEAD
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 py-3 font-heading text-sm font-bold tracking-wide text-indigo-950 shadow-lg shadow-orange-300/40 transition-all hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Petualangan</span>
                    <Icon icon="lucide:rocket" className="h-4 w-4" />
                  </>
                )}
=======
                className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 py-3 font-heading text-sm font-bold tracking-wide text-indigo-950 shadow-lg shadow-orange-300/40 transition-all hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Masuk Petualangan</span>
                <Icon icon="lucide:rocket" className="h-4 w-4" />
>>>>>>> f3aebd2586ba85aef31e016c75ed5d168fbf403c
              </button>
            </form>

            {/* Tautan ke Register */}
            <p className="mt-6 text-center font-body text-xs font-semibold text-slate-500">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={onGoToRegister}
                className="font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors cursor-pointer"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
