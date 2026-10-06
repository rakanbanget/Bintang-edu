import React from 'react';
import { Icon } from '@iconify/react';
import { BintangEduMascot } from './BintangEduLogo.tsx';

interface FooterSectionProps {
  onFooterMenuClick?: (menuName: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onFooterMenuClick,
}) => {
  const footerMenus = [
    { label: 'Site Map', href: '#beranda' },
    { label: 'Team', href: '#tentang' },
    { label: 'Blog', href: '#modul-sains' },
    { label: 'Contacts', href: '#kontak' },
  ];

  return (
    <footer
      id="kontak"
      className="relative z-20 pt-8 pb-12 px-5 sm:px-8 lg:px-12 text-blue-200"
    >
      <div className="mx-auto max-w-6xl">
        {/* Baris Utama Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/15 pb-8">
          {/* 1. Kiri: Logo Resmi Bintang Edu + Slogan */}
          <a
            href="#beranda"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <BintangEduMascot
              className="h-11 w-11 shrink-0 transition-transform group-hover:scale-105"
              withBadge={true}
            />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 font-heading text-2xl font-bold tracking-tight leading-none">
                <span className="text-yellow-300">Bintang</span>
                <span className="text-white text-lg font-bold">Edu</span>
              </div>
              <span className="mt-0.5 font-body text-[11px] font-bold text-blue-200">
                Belajar Sains, Bermain Tanpa Batas
              </span>
            </div>
          </a>

          {/* 2. Tengah: Menu Site Map, Team, Blog, dan Contacts */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-9"
          >
            {footerMenus.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (onFooterMenuClick) {
                    e.preventDefault();
                    onFooterMenuClick(item.label);
                  }
                }}
                className="font-heading text-xs sm:text-sm font-bold tracking-wide text-blue-200 transition-colors hover:text-yellow-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 3. Kanan: Tombol Kontak Melingkar (Iconify) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                onFooterMenuClick?.('Hubungi Kami: halo@bintang-edu.id')
              }
              aria-label="Email Bintang Edu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100 border border-white/20 transition-all hover:bg-yellow-400 hover:text-indigo-950 cursor-pointer"
            >
              <Icon icon="lucide:mail" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onFooterMenuClick?.('Layanan Bantuan: (021) 5088-7799')
              }
              aria-label="Telepon Bintang Edu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100 border border-white/20 transition-all hover:bg-yellow-400 hover:text-indigo-950 cursor-pointer"
            >
              <Icon icon="lucide:phone" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onFooterMenuClick?.('Portal Resmi: www.bintang-edu.id')
              }
              aria-label="Website Bintang Edu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100 border border-white/20 transition-all hover:bg-yellow-400 hover:text-indigo-950 cursor-pointer"
            >
              <Icon icon="lucide:globe" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Baris Copyright Kecil di Bawah */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-body text-xs font-bold text-blue-200/85">
          <p>
            © {new Date().getFullYear()} Bintang Edu — Belajar Sains, Bermain
            Tanpa Batas. All rights reserved.
          </p>
          <p>Platform Edukasi Sains AI Anak Sekolah Dasar (Kelas 1–6 SD)</p>
        </div>
      </div>
    </footer>
  );
};
