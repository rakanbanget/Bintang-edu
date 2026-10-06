import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BintangEduMascot } from './BintangEduLogo.tsx';

interface RegisterPageProps {
  onBackToHome?: () => void;
  onGoToLogin?: () => void;
  onNotify?: (msg: string) => void;
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
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim() || !password.trim() || !selectedGrade) {
      onNotify?.('⚠️ Isi semua data yang diperlukan ya!');
      return;
    }

    if (password !== confirmPassword) {
      onNotify?.('⚠️ Kata sandi dan konfirmasi tidak cocok!');
      return;
    }

    if (!agreeTerms) {
      onNotify?.('⚠️ Centang persetujuan untuk melanjutkan!');
      return;
    }

    onNotify?.('🎉 Selamat! Akun Petualangmu berhasil dibuat! Siap menjelajah galaksi sains!');
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

            {/* Form register */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              </div>

              {/* Pilihan Jenjang Kelas */}
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
                className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 py-3 font-heading text-sm font-bold tracking-wide text-indigo-950 shadow-lg shadow-orange-300/40 transition-all hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-6"
              >
                <span>Buat Akun Petualang</span>
                <Icon icon="lucide:rocket" className="h-4 w-4" />
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
