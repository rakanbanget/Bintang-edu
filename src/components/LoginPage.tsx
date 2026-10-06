import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BintangEduMascot } from './BintangEduLogo.tsx';

interface LoginPageProps {
  onBackToHome?: () => void;
  onGoToRegister?: () => void;
  onNotify?: (msg: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onGoToRegister,
  onNotify,
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

            {/* Form login */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 py-3 font-heading text-sm font-bold tracking-wide text-indigo-950 shadow-lg shadow-orange-300/40 transition-all hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Masuk Petualangan</span>
                <Icon icon="lucide:rocket" className="h-4 w-4" />
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
