import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { BintangEduMascot } from './BintangEduLogo.tsx';

export type NavTab = 'Home' | 'Activity' | 'Tours' | 'About';

export interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNotify?: (msg: string) => void;
  onGoToLogin?: () => void;
  onGoToRegister?: () => void;
  onOpenSearch?: () => void;
  onOpenProfile?: () => void;
  studentName?: string;
  totalStars?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onGoToLogin,
  onGoToRegister,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: NavTab; href: string }[] = [
    { label: 'Home',     href: '#beranda' },
    { label: 'Activity', href: '#ruang-eksplorasi' },
    { label: 'Tours',    href: '#kuis-section' },
    { label: 'About',    href: '#tentang' },
  ];

  const handleNavClick = (item: { label: NavTab; href: string }) => {
    onSelectTab(item.label);
    setMobileMenuOpen(false);
    const el = document.querySelector(item.href) || document.querySelector(item.href === '#ruang-eksplorasi' ? '#modul-sains' : '#kuis-interaktif');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-purple-600">
      {/* ── Main bar ── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 lg:px-14">

        {/* ════ KIRI: Logo ════ */}
        <a
          href="#beranda"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick({ label: 'Home', href: '#beranda' });
          }}
          className="group flex items-center gap-3 focus:outline-none shrink-0"
        >
          {/* Ikon logo — w-12 h-12 */}
          <BintangEduMascot
            className="h-12 w-12 shrink-0 transition-transform duration-200 group-hover:scale-105"
            withBadge={true}
          />
          {/* Brand teks */}
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-xl font-bold tracking-wide text-white">
              Bintang <span className="text-yellow-300">Edu</span>
            </span>
            <span className="mt-0.5 font-body text-[11px] font-normal tracking-wide text-purple-200/80">
              Belajar Sains, Bermain Tanpa Batas
            </span>
          </div>
        </a>

        {/* ════ TENGAH: Menu ════ */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                className="relative flex flex-col items-center pb-2 cursor-pointer group"
              >
                {/* Label */}
                <span
                  className={`font-heading text-base font-semibold tracking-wide whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-white/70 group-hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
                {/* Garis indikator kuning — absolute, selebar tombol */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3.5px] rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.85)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ════ KANAN: Masuk & Daftar ════ */}
        <div className="hidden md:flex items-center gap-5">
          {/* Tombol Masuk */}
          <button
            type="button"
            onClick={() => {
              if (onGoToLogin) onGoToLogin();
              else navigate('/login');
            }}
            className="font-heading text-base font-bold text-white hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            Masuk
          </button>

          {/* Tombol Daftar — amber chunky pill */}
          <button
            type="button"
            onClick={() => {
              if (onGoToRegister) onGoToRegister();
              else navigate('/register');
            }}
            className="rounded-full bg-amber-400 hover:bg-amber-300 px-6 py-2.5 font-heading text-sm font-extrabold text-slate-950 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Daftar
          </button>
        </div>

        {/* ════ Hamburger Mobile ════ */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Buka Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white md:hidden cursor-pointer hover:bg-white/25 transition-colors"
        >
          <Icon
            icon={mobileMenuOpen ? 'lucide:x' : 'lucide:menu'}
            className="h-5 w-5"
          />
        </button>
      </div>

      {/* ── Garis pemisah horizontal tipis di bawah navbar (Under-Navbar Divider) ── */}
      <div className="h-[1px] w-full border-b border-purple-400/20" />

      {/* ════ Dropdown Mobile ════ */}
      {mobileMenuOpen && (
        <div className="mx-4 mb-3 rounded-2xl border border-white/20 bg-purple-600/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 font-heading text-sm font-bold tracking-wide cursor-pointer transition-colors ${
                  activeTab === item.label
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                {activeTab === item.label && (
                  <span className="h-2 w-2 rounded-full bg-slate-950/40" />
                )}
              </button>
            ))}

            <div className="mt-3 pt-3 border-t border-white/15 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoToLogin) onGoToLogin();
                  else navigate('/login');
                }}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-heading text-sm font-bold text-white hover:bg-white/15 cursor-pointer"
              >
                <Icon icon="lucide:log-in" className="h-4 w-4 shrink-0" />
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoToRegister) onGoToRegister();
                  else navigate('/register');
                }}
                className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 font-heading text-sm font-extrabold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                <Icon icon="lucide:user-plus" className="h-4 w-4 shrink-0" />
                Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
