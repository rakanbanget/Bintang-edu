import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BintangEduMascot } from './BintangEduLogo.tsx';

interface RegisterPageProps {
  onBackToHome?: () => void;
  onGoToLogin?: () => void;
  onNotify?: (msg: string) => void;
  onRegisterSuccess?: (userData?: any) => void;
}

const GRADE_OPTIONS = [
  { value: 'kelas-1', label: 'Kelas 1 SD' },
  { value: 'kelas-2', label: 'Kelas 2 SD' },
  { value: 'kelas-3', label: 'Kelas 3 SD' },
  { value: 'kelas-4', label: 'Kelas 4 SD' },
  { value: 'kelas-5', label: 'Kelas 5 SD' },
  { value: 'kelas-6', label: 'Kelas 6 SD' },
];

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onBackToHome,
  onGoToLogin,
  onNotify,
  onRegisterSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = (params.get('role') || localStorage.getItem('userRole') || '').toLowerCase();
      if (r.includes('guru') || r.includes('teacher') || r.includes('pendidik') || r.includes('ortu') || r.includes('parent') || r.includes('orang tua')) return 'teacher';
    }
    return 'teacher'; // Prioritaskan guru / orang tua agar memudahkan langsung terdaftar ke EduAdmin
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('kelas-5');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    
    const score = [hasLength, hasUpper, hasLower, hasDigit].filter(Boolean).length;
    
    if (score === 4) return { score, label: '✅ Password Kuat!', color: 'text-green-400' };
    if (score >= 2) return { score, label: '⚠️ Password Sedang', color: 'text-yellow-400' };
    return { score, label: '❌ Password Lemah', color: 'text-red-400' };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      const msg = '⚠️ Isi semua data formulir terlebih dahulu!';
      setErrorMessage(msg);
      onNotify?.(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = '⚠️ Konfirmasi password tidak cocok!';
      setErrorMessage(msg);
      onNotify?.(msg);
      return;
    }

    if (!agreeTerms) {
      const msg = '⚠️ Centang persetujuan syarat & ketentuan untuk melanjutkan!';
      setErrorMessage(msg);
      onNotify?.(msg);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Pendaftaran gagal. Silakan coba kembali.');
      }

      const userRoleNormalized = role === 'teacher' ? 'guru' : 'siswa';
      const registeredName = data.user?.name || fullName || (role === 'teacher' ? 'Bapak/Ibu Guru & Orang Tua' : 'Kadet');

      const userObject = {
        ...(data.user || {}),
        name: registeredName,
        email,
        role: role,
        grade: role === 'teacher' ? 'Pendidik / Orang Tua SD' : (GRADE_OPTIONS.find(g => g.value === selectedGrade)?.label || 'Kelas 5 SD'),
      };

      localStorage.setItem('token', data.token || 'auth-token');
      localStorage.setItem('user', JSON.stringify(userObject));
      localStorage.setItem('userRole', userRoleNormalized);
      localStorage.setItem('userName', registeredName);
      localStorage.setItem('isAuthenticated', 'true');
      document.body.style.overflow = '';

      const successNotice =
        role === 'teacher'
          ? `Selamat Datang di Portal EduAdmin Guru & Orang Tua, ${registeredName}! 👨‍🏫👩‍👦`
          : `Selamat Datang di Stasiun Bintang Edu, ${registeredName}! 🎉`;
      setSuccessMessage(successNotice);
      onNotify?.(successNotice);
      
      // Transisi langsung ke Dashboard EduAdmin Guru & Orang Tua
      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess(userObject);
      }, 150);
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Network')) {
        const userRoleNormalized = role === 'teacher' ? 'guru' : 'siswa';
        const fallbackUser = {
          id: Date.now(),
          name: fullName || (role === 'teacher' ? 'Bapak/Ibu Guru & Orang Tua' : 'Kadet'),
          email,
          role,
          grade: role === 'teacher' ? 'Pendidik / Orang Tua SD' : (GRADE_OPTIONS.find(g => g.value === selectedGrade)?.label || 'Kelas 5 SD'),
        };
        localStorage.setItem('token', 'local-token');
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        localStorage.setItem('userRole', userRoleNormalized);
        localStorage.setItem('userName', fallbackUser.name);
        localStorage.setItem('isAuthenticated', 'true');
        document.body.style.overflow = '';
        if (onRegisterSuccess) onRegisterSuccess(fallbackUser);
        return;
      }
      const errMsg = err.message || 'Pendaftaran gagal';
      setErrorMessage(errMsg);
      onNotify?.(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
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

      {/* Tombol kembali */}
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
                <div className="absolute -bottom-2 -left-6 text-cyan-300 animate-drift">
                  <Icon icon="lucide:sparkles" className="h-12 w-12" />
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
                Mulai Petualanganmu <br />Sebagai Ilmuwan Cilik!
              </h2>
              <p className="font-body text-sm font-semibold text-indigo-100 leading-relaxed">
                Daftarkan dirimu dan bergabunglah dengan komunitas petualang sains! Jelajahi tata surya, lakukan eksperimen seru, dan kumpulkan bintang pengetahuanmu!
              </p>
            </div>

            {/* Fitur highlight */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center text-yellow-300/80">
                  <Icon icon="lucide:book-open" className="h-8 w-8" />
                </div>
                <p className="font-body text-xs font-bold text-indigo-100">Modul Sains</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center text-cyan-300/80">
                  <Icon icon="lucide:gamepad-2" className="h-8 w-8" />
                </div>
                <p className="font-body text-xs font-bold text-indigo-100">Kuis Seru</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center text-orange-300/80">
                  <Icon icon="lucide:star" className="h-8 w-8" />
                </div>
                <p className="font-body text-xs font-bold text-indigo-100">Kumpulkan Bintang</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Panel Formulir */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md my-8">
            
            {/* Logo Mobile */}
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
              <span>Buat Akun Petualang</span>
              <Icon icon="lucide:user-plus" className="h-6 w-6 text-purple-600 shrink-0" />
            </h1>
            <p className="mt-2 font-body text-xs font-semibold text-slate-500 text-center">
              Daftar gratis dan mulai jelajahi galaksi sains!
            </p>

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

            {/* Form register */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Pilihan Peran / Role */}
              <div>
                <label className="mb-1.5 block font-body text-xs font-bold text-indigo-950">
                  Daftar Sebagai
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`rounded-xl border-2 py-2.5 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'student'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon icon="lucide:graduation-cap" className="h-4 w-4" />
                    <span>Siswa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`rounded-xl border-2 py-2.5 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'teacher'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon icon="lucide:book-open" className="h-4 w-4" />
                    <span>Guru / Orang Tua</span>
                  </button>
                </div>
              </div>

              {/* Input Nama Lengkap */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-1.5 block font-body text-xs font-bold text-indigo-950"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:user"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="register-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkapmu"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 font-body text-sm font-semibold text-indigo-950 placeholder:text-slate-400 placeholder:font-normal outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              {/* Input Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-1.5 block font-body text-xs font-bold text-indigo-950"
                >
                  Email
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:mail"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 font-body text-sm font-semibold text-indigo-950 placeholder:text-slate-400 placeholder:font-normal outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              {/* Input Kata Sandi */}
              <div>
                <label
                  htmlFor="register-password"
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
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
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
                {/* Password Strength Indicator */}
                {password && (
                  <div className={`mt-2 flex items-center gap-2 text-xs font-bold ${passwordStrength.color}`}>
                    <Icon icon={passwordStrength.score === 4 ? 'lucide:shield-check' : passwordStrength.score >= 2 ? 'lucide:shield-alert' : 'lucide:shield-x'} className="h-3.5 w-3.5" />
                    <span>{passwordStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Input Konfirmasi Kata Sandi */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-1.5 block font-body text-xs font-bold text-indigo-950"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:lock"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 font-body text-sm font-semibold text-indigo-950 placeholder:text-slate-400 placeholder:font-normal outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    <Icon icon={showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'} className="h-4 w-4" />
                  </button>
                </div>
                {/* Confirm Password Mismatch Indicator */}
                {confirmPassword && password !== confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold text-red-400">
                    <Icon icon="lucide:x-circle" className="h-3.5 w-3.5" />
                    <span>Konfirmasi password tidak cocok!</span>
                  </div>
                )}
                {confirmPassword && password === confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold text-green-400">
                    <Icon icon="lucide:check-circle" className="h-3.5 w-3.5" />
                    <span>Password cocok!</span>
                  </div>
                )}
              </div>

              {/* Pilihan Jenjang Kelas (Khusus Siswa, ditiadakan untuk Guru / Orang Tua) */}
              {role === 'student' && (
                <div>
                  <label
                    htmlFor="register-grade"
                    className="mb-1.5 block font-body text-xs font-bold text-indigo-950"
                  >
                    Jenjang Kelas
                  </label>
                  <div className="relative">
                    <Icon
                      icon="lucide:graduation-cap"
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      id="register-grade"
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 font-body text-sm font-semibold text-indigo-950 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 cursor-pointer appearance-none"
                    >
                      <option value="" disabled className="text-slate-400">
                        Pilih jenjang kelasmu
                      </option>
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>
                    <Icon
                      icon="lucide:chevron-down"
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Persetuan */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-purple-600 cursor-pointer shrink-0"
                />
                <label
                  htmlFor="agree-terms"
                  className="font-body text-xs font-semibold text-slate-500 cursor-pointer select-none leading-relaxed"
                >
                  Saya menyetujui{' '}
                  <span className="text-purple-600 hover:text-purple-800 cursor-pointer">
                    Syarat & Ketentuan
                  </span>{' '}
                  dan{' '}
                  <span className="text-purple-600 hover:text-purple-800 cursor-pointer">
                    Kebijakan Privasi
                  </span>{' '}
                  Bintang Edu
                </label>
              </div>

              {/* Tombol aksi utama */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 py-3 font-heading text-sm font-bold tracking-wide text-indigo-950 shadow-lg shadow-orange-300/40 transition-all hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />
                    <span>Memproses Misi... 🚀</span>
                  </>
                ) : (
                  <>
                    <span>Buat Akun Petualang</span>
                    <Icon icon="lucide:rocket" className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Tautan ke Login */}
            <p className="mt-6 text-center font-body text-xs font-semibold text-slate-500">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={onGoToLogin}
                className="font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
