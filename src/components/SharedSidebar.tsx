import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

type NavItem = 'Beranda' | 'Misi Sains' | 'Lab Virtual' | 'Tantangan' | 'Peringkat';

interface SharedSidebarProps {
  currentPage: NavItem;
  userName?: string;
}

const NAV_ITEMS: { key: NavItem; label: string; icon: string; path: string }[] = [
  { key: 'Beranda', label: 'Beranda', icon: 'solar:home-smile-bold-duotone', path: '/dashboard' },
  { key: 'Misi Sains', label: 'Misi Sains', icon: 'solar:compass-big-bold-duotone', path: '/missions' },
  { key: 'Lab Virtual', label: 'Lab Virtual', icon: 'solar:test-tube-bold-duotone', path: '/virtual-lab' },
  { key: 'Tantangan', label: 'Tantangan', icon: 'solar:bolt-circle-bold-duotone', path: '/challenges' },
  { key: 'Peringkat', label: 'Peringkat', icon: 'solar:cup-star-bold-duotone', path: '/rankings' },
];

export const SharedSidebar: React.FC<SharedSidebarProps> = ({ currentPage, userName = 'aqilarakan' }) => {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r-2 border-slate-200 bg-white/95 backdrop-blur-xl p-6 shadow-sm z-30">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] shadow-md border-2 border-white">
            <Icon icon="solar:star-bold" className="text-white text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-extrabold text-slate-900">Bintang</span>
              <span className="text-lg font-extrabold text-sky-600">Edu</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400">M-ONE GALAKSI</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1.5">
          {NAV_ITEMS.map(item => {
            const isActive = currentPage === item.key;
            const isLabVirtual = item.key === 'Lab Virtual';
            
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                  isActive
                    ? isLabVirtual
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200 border border-sky-200 border-b-4 border-b-sky-700'
                      : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200 border border-sky-200 border-b-4 border-b-sky-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    icon={item.icon}
                    className={`text-xl ${
                      isActive
                        ? 'text-white'
                        : item.key === 'Beranda'
                        ? 'text-sky-500'
                        : item.key === 'Misi Sains'
                        ? 'text-emerald-500'
                        : item.key === 'Lab Virtual'
                        ? 'text-indigo-500'
                        : item.key === 'Tantangan'
                        ? 'text-pink-500'
                        : 'text-amber-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
                {isActive && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-lg font-bold">Aktif</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center font-black text-sky-600 text-xs">
          {userName.substring(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-slate-900">{userName}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Kadet Penjelajah</p>
        </div>
      </div>
    </aside>
  );
};
