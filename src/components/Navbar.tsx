import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BintangEduMascot } from './BintangEduLogo.tsx';

export type NavTab = 'Home' | 'Activity' | 'Tours' | 'About';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNotify?: (msg: string) => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onNotify,
  onLoginClick,
  onRegisterClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: NavTab; href: string }[] = [
    { label: 'Home', href: '#beranda' },
    { label: 'Activity', href: '#modul-sains' },
    { label: 'Tours', href: '#kuis-interaktif' },
    { label: 'About', href: '#tentang' },
  ];

  const handleNavClick = (item: { label: NavTab; href: string }) => {
    onSelectTab(item.label);
    setMobileMenuOpen(false);
    const el = document.querySelector(item.href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-30 w-full pt-5 pb-2 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/15 pb-4">
        {/* 1. Kiri: Logo Resmi Bintang Edu + Slogan */}
        <a
          href="#beranda"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick({ label: 'Home', href: '#beranda' });
          }}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <BintangEduMascot
            className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 transition-transform group-hover:scale-105"
            withBadge={true}
          />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 font-heading text-xl sm:text-2xl font-bold tracking-tight leading-none drop-shadow-sm">
              <span className="text-yellow-300">Bintang</span>
              <span className="text-white">Edu</span>
            </div>
            <span className="mt-0.5 font-body text-[10px] sm:text-[11px] font-bold tracking-wide text-blue-200/90">
              Belajar Sains, Bermain Tanpa Batas
            </span>
          </div>
        </a>

        {/* 2. Tengah: Menu Navigasi (Home, Activity, Tours, About) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`relative py-1.5 font-heading text-sm font-bold tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-yellow-300'
                    : 'text-blue-100/80 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-[3px] rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.9)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Kanan: Tombol Login & Daftar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onLoginClick?.()}
            className="hidden sm:block font-heading text-sm font-bold text-white hover:text-yellow-300 transition-colors cursor-pointer"
          >
            Masuk
          </button>
          
          <button
            type="button"
            onClick={() => onRegisterClick?.()}
            className="rounded-full bg-yellow-400 px-5 py-2 font-heading text-sm font-bold text-indigo-950 shadow-md transition-all hover:bg-yellow-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Daftar
          </button>

          {/* Hamburger Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu Mobile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white md:hidden cursor-pointer"
          >
            <Icon
              icon={mobileMenuOpen ? 'lucide:x' : 'lucide:menu'}
              className="h-5 w-5"
            />
          </button>
        </div>
      </div>

      {/* Dropdown Navigasi Mobile */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-2xl border border-white/20 bg-indigo-950/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`rounded-xl px-4 py-2.5 text-left font-heading text-xs font-bold tracking-wider ${
                  activeTab === item.label
                    ? 'bg-yellow-400 text-indigo-950'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
