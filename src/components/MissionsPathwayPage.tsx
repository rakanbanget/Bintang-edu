import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { AppSidebar } from './AppSidebar.tsx';
import { AppViewRoute, UserSession } from '../types/navigation.ts';
import { StationId } from './VirtualLabModule.tsx';

interface MissionData {
  id: number;
  orbitName: string;
  title: string;
  subtitle: string;
  zone: string;
  tag: string;
  icon: string;
  targetObjective: string;
  stars: number;
  xp: number;
  status: 'completed' | 'active' | 'locked';
  progress: number;
  actionLabStation?: StationId;
}

interface MissionsPathwayPageProps {
  user: UserSession;
  onNavigate: (route: AppViewRoute) => void;
  onOpenStation: (stationId: StationId) => void;
  onUpdateMissionStatus: (missionId: number, status: 'completed' | 'active') => void;
  hideSidebar?: boolean;
}

export const MissionsPathwayPage: React.FC<MissionsPathwayPageProps> = ({
  user,
  onNavigate,
  onOpenStation,
  onUpdateMissionStatus,
  hideSidebar = false,
}) => {
  const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);
  const [filterZone, setFilterZone] = useState<string>('semua');
  const [toastText, setToastText] = useState<string | null>(null);

  const missions: MissionData[] = [
    {
      id: 1,
      orbitName: 'Pos Orbit 1',
      title: 'Anatomi Tubuh & Panca Indra Manusia 👁️',
      subtitle: 'Mengenal Fungsi Mata, Telinga, Kulit, Lidah & Saraf Manusia',
      zone: 'Zona Bumi & Biologi Manusia',
      tag: 'Biologi SD',
      icon: '👁️',
      targetObjective: 'Pahami cara kerja pupil mata mengatur intensitas cahaya, frekuensi telinga, dan indra perasa lidah.',
      stars: 30,
      xp: 60,
      status: 'completed',
      progress: 100,
      actionLabStation: 'human-anatomy',
    },
    {
      id: 2,
      orbitName: 'Pos Orbit 2',
      title: 'Dunia Tumbuhan & Ekosistem Hewan 🌿',
      subtitle: 'Fotosintesis Klorofil Daun & Rantai Makanan Makhluk Hidup',
      zone: 'Zona Ekosistem Darat & Flora',
      tag: 'Botani & Ekologi',
      icon: '🌿',
      targetObjective: 'Buktikan peran sinar matahari dan klorofil dalam menghasilkan glukosa dan oksigen O2 serta rantai makanan.',
      stars: 35,
      xp: 70,
      status: 'completed',
      progress: 100,
      actionLabStation: 'photosynthesis',
    },
    {
      id: 3,
      orbitName: 'Pos Orbit 3',
      title: 'Siklus Air, Kondensasi Awan & Hujan 🌧️',
      subtitle: 'Evaporasi Air Laut, Pembentukan Awan & Titik Hujan Berputar',
      zone: 'Zona Atmosfer & Cuaca',
      tag: 'Hidrologi Aktif',
      icon: '🌧️',
      targetObjective: 'Uji perubahan molekul air dari es padat (0°C), cair (50°C), hingga uap gas mendidih (100°C).',
      stars: 40,
      xp: 80,
      status: 'active',
      progress: 65,
      actionLabStation: 'water-cycle',
    },
    {
      id: 4,
      orbitName: 'Pos Orbit 4',
      title: 'Energi Panas & Perubahan Wujud Benda ⚡',
      subtitle: 'Perpindahan Kalor Konduksi, Konveksi, Radiasi & Suhu Termal',
      zone: 'Zona Fisika Terapan',
      tag: 'Termodinamika',
      icon: '⚡',
      targetObjective: 'Eksperimen bagaimana logam mengalirkan panas lebih cepat daripada kayu dan plastik.',
      stars: 50,
      xp: 95,
      status: 'locked',
      progress: 0,
    },
    {
      id: 5,
      orbitName: 'Pos Orbit 5',
      title: 'Tata Surya, Planet & Gravitasi Orbit 🪐',
      subtitle: 'Mengelilingi Matahari, Cincin Saturnus & Kuat Gravitasi Ruang Angkasa',
      zone: 'Puncak Galaksi & Astronomi',
      tag: 'Astronomi Antariksa',
      icon: '🪐',
      targetObjective: 'Bandingkan gaya gravitasi planet Bumi vs Mars vs Monster Jupiter pada lintasan orbit!',
      stars: 60,
      xp: 120,
      status: 'locked',
      progress: 0,
      actionLabStation: 'solar-system',
    },
  ];

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3000);
  };

  const completedCount = missions.filter((m) => m.status === 'completed').length;
  const totalStarsReward = missions.reduce((acc, m) => acc + m.stars, 0);

  const filteredMissions = missions.filter((m) => {
    if (filterZone === 'semua') return true;
    if (filterZone === 'aktif') return m.status === 'active';
    if (filterZone === 'selesai') return m.status === 'completed';
    if (filterZone === 'terkunci') return m.status === 'locked';
    return true;
  });

  const handleStartMission = (mission: MissionData) => {
    if (mission.status === 'locked') {
      showToast(`🔒 ${mission.title} masih terkunci! Selesaikan Pos Orbit sebelumnya terlebih dahulu.`);
      return;
    }
    if (mission.actionLabStation) {
      onOpenStation(mission.actionLabStation);
      onNavigate('virtual-lab');
    } else {
      setSelectedMission(mission);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-yellow-300/80 bg-indigo-950 px-5 py-3.5 shadow-2xl backdrop-blur-md text-white">
          <Icon icon="solar:sparkles-bold" className="h-5 w-5 text-yellow-300 animate-spin" />
          <span className="text-xs sm:text-sm font-bold">{toastText}</span>
        </div>
      )}

      {/* Sidebar 3-Kolom Konsisten */}
      {!hideSidebar && <AppSidebar currentRoute="misi-sains" onNavigate={onNavigate} user={user} />}

      {/* Wrapper Konten Utama */}
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 transition-all duration-300 ease-in-out">
          {/* HEADER JALUR MISI */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border border-indigo-900/50 p-6 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-xs font-black text-sky-300">
                  <Icon icon="solar:compass-big-bold-duotone" />
                  <span>Jalur Ekspedisi Kurikulum Merdeka Sains SD</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                  Peta Pos Orbit Sains Galaksi 🚀
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Selesaikan 5 Pos Orbit secara berurutan untuk membuka lisensi Astronot Peneliti Utama Bintang Edu!
                </p>
              </div>

              {/* Stats Badge */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                <div className="text-center">
                  <p className="text-2xl font-black text-yellow-300">{completedCount}/5</p>
                  <p className="text-[11px] font-bold text-slate-300">Pos Selesai</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-black text-sky-300">{totalStarsReward} ⭐</p>
                  <p className="text-[11px] font-bold text-slate-300">Total Bintang</p>
                </div>
              </div>
            </div>
          </div>

          {/* FILTER TAB BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'semua', label: 'Semua Pos Orbit' },
                { id: 'aktif', label: 'Misi Aktif (1)' },
                { id: 'selesai', label: 'Sudah Selesai (2)' },
                { id: 'terkunci', label: 'Terkunci (2)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterZone(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    filterZone === f.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('virtual-lab')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-black transition-all cursor-pointer"
            >
              <Icon icon="solar:test-tube-bold-duotone" className="text-base text-orange-500" />
              <span>Buka Lab Virtual Terkait</span>
            </button>
          </div>

          {/* VERTICAL STEPPER / PATHWAY CARDS */}
          <div className="relative space-y-6 before:absolute before:inset-y-4 before:left-8 sm:before:left-10 before:w-1 before:bg-gradient-to-b before:from-emerald-400 before:via-sky-400 before:to-slate-300 before:rounded-full">
            {filteredMissions.map((item, index) => {
              const isLocked = item.status === 'locked';
              const isActive = item.status === 'active';
              const isCompleted = item.status === 'completed';

              return (
                <div
                  key={item.id}
                  className={`relative pl-16 sm:pl-20 transition-all ${
                    isLocked ? 'opacity-80' : 'hover:-translate-y-0.5'
                  }`}
                >
                  {/* Node Badge on the Line */}
                  <div
                    className={`absolute left-4 sm:left-6 top-6 -translate-x-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl text-lg font-black shadow-md border-2 border-white transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                        : isActive
                        ? 'bg-sky-500 text-white ring-4 ring-sky-200 animate-pulse'
                        : 'bg-slate-300 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : item.id}
                  </div>

                  {/* Main Card */}
                  <div
                    className={`rounded-3xl border p-5 sm:p-7 shadow-xs transition-all ${
                      isActive
                        ? 'bg-white border-sky-300 shadow-md ring-2 ring-sky-100'
                        : isCompleted
                        ? 'bg-white border-emerald-200/90'
                        : 'bg-white/80 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isActive
                                ? 'bg-sky-100 text-sky-800 animate-pulse'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.orbitName} · {item.tag}
                          </span>
                          <span className="text-xs font-bold text-slate-400">|</span>
                          <span className="text-xs font-bold text-slate-500">{item.zone}</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                          <span>{item.title}</span>
                          {isCompleted && (
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Lulus Riset
                            </span>
                          )}
                          {isActive && (
                            <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                              Misi Sedang Berjalan
                            </span>
                          )}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600">{item.subtitle}</p>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-start gap-2">
                          <Icon icon="solar:target-bold-duotone" className="text-base text-sky-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Tujuan Misi:</strong> {item.targetObjective}
                          </span>
                        </div>
                      </div>

                      {/* Right Side Action and Rewards */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-black">
                          <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-xl">
                            ⭐ +{item.stars} Bintang
                          </span>
                          <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-xl">
                            🚀 +{item.xp} XP
                          </span>
                        </div>

                        {/* Button Action */}
                        <div>
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={() => handleStartMission(item)}
                              className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Icon icon="solar:refresh-circle-bold" className="text-base" />
                              <span>Ulangi Riset</span>
                            </button>
                          ) : isActive ? (
                            <button
                              type="button"
                              onClick={() => handleStartMission(item)}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-black shadow-md shadow-sky-500/25 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2 animate-bounce sm:animate-none"
                            >
                              <span>Lanjutkan Misi 🚀</span>
                              <Icon icon="solar:arrow-right-linear" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartMission(item)}
                              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center gap-1.5"
                            >
                              <Icon icon="solar:lock-keyhole-bold" />
                              <span>Terkunci</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar inside Card */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Progres Pos: {item.progress}%</span>
                      <div className="w-40 sm:w-60 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* MODAL DETAIL MISI NON-LAB */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black">
                {selectedMission.orbitName}
              </span>
              <button
                type="button"
                onClick={() => setSelectedMission(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <Icon icon="solar:close-circle-bold" className="text-2xl" />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900">{selectedMission.title}</h3>
            <p className="text-xs text-slate-600">{selectedMission.subtitle}</p>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-950 space-y-2">
              <p className="font-bold">📖 Panduan Singkat Penelitian:</p>
              <p className="leading-relaxed">{selectedMission.targetObjective}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setSelectedMission(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateMissionStatus(selectedMission.id, 'completed');
                  showToast(`🎉 Berhasil menyelesaikan ${selectedMission.title}!`);
                  setSelectedMission(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Tandai Selesai & Klaim ⭐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
