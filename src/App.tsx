/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Navbar, NavTab } from './components/Navbar.tsx';
import {
  HeroSection,
  DAILY_SCIENCE_SCHEDULE,
  DailyScheduleTopic,
} from './components/HeroSection.tsx';
import {
  ScienceModulesSection,
  ActiveFeatureKey,
} from './components/ScienceModulesSection.tsx';
import { FooterSection } from './components/FooterSection.tsx';
import { BintangEduMascot } from './components/BintangEduLogo.tsx';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('Home');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [activeFeature, setActiveFeature] =
    useState<ActiveFeatureKey>('kuis-gamifikasi');
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(125);

  // Modal Pencarian, Profil Ilmuwan ("Mintion"), dan Application Entry (Childhood Dream)
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [applicationModalOpen, setApplicationModalOpen] =
    useState<boolean>(false);

  const [studentName, setStudentName] = useState<string>('Mintion');
  const [studentGrade, setStudentGrade] = useState<string>('Kelas 5 SD');
  const [selectedDreamRole, setSelectedDreamRole] = useState<string>(
    'Astronaut & Penjelajah Antariksa'
  );

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const handleSelectNavTab = (tab: NavTab) => {
    setActiveNavTab(tab);
    if (tab === 'Activity') {
      setActiveFeature('populer-sains');
    } else if (tab === 'Shop') {
      setActiveFeature('ai-generator');
    } else if (tab === 'Tours') {
      setActiveFeature('kuis-gamifikasi');
    }
  };

  const handleSelectScheduleTopic = (index: number) => {
    setActiveTopicIndex(index);
    const chosen = DAILY_SCIENCE_SCHEDULE[index];
    if (chosen) {
      setActiveQuizIndex(chosen.quizIndex);
    }
  };

  const handleStartExperiment = (topic: DailyScheduleTopic) => {
    setActiveFeature('kuis-gamifikasi');
    setActiveQuizIndex(topic.quizIndex);
    showToast(`🚀 Experience Dimulai: ${topic.title}`);
    const panelEl = document.getElementById('interactive-feature-panel');
    if (panelEl) {
      panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAddStars = (stars: number, reason: string) => {
    setTotalStars((prev) => prev + stars);
    showToast(
      `⭐ Fantastic, ${studentName}! +${stars} Bintang dari ${reason}!`
    );
  };

  const handleFooterMenuClick = (menuName: string) => {
    showToast(`✨ Membuka informasi ${menuName} Bintang Edu`);
  };

  const filteredScheduleTopics = DAILY_SCIENCE_SCHEDULE.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-indigo-950 via-blue-900 to-purple-950 bg-space-stars text-white font-body selection:bg-yellow-300 selection:text-indigo-950">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-yellow-300/60 bg-indigo-950/95 px-5 py-3.5 shadow-2xl backdrop-blur-md">
          <Icon
            icon="lucide:sparkles"
            className="h-4 w-4 text-yellow-300 shrink-0 animate-pulse"
          />
          <span className="font-heading text-xs sm:text-sm font-bold text-white">
            {toastMessage}
          </span>
        </div>
      )}

      {/* 1. NAVBAR ATAS (Logo Resmi Bintang Edu + Menu Home, Activity, Shop, Tours, About + Profil Mintion) */}
      <Navbar
        activeTab={activeNavTab}
        onSelectTab={handleSelectNavTab}
        onNotify={showToast}
      />

      {/* 2. KONTEN UTAMA DASHBOARD 3D RUANG ANGKASA */}
      <main>
        {/* Panggung 3D "CHILDHOOD DREAM" + Karakter Astronaut & Bintang Edu + Gamepad 3D */}
        <HeroSection
          activeTopicIndex={activeTopicIndex}
          onSelectTopic={handleSelectScheduleTopic}
          onStartExperiment={handleStartExperiment}
          onOpenApplicationModal={() => setApplicationModalOpen(true)}
          onAddStars={handleAddStars}
          onNotify={showToast}
          totalStars={totalStars}
        />

        {/* Wahana Eksplorasi Sains & Simulasi Interaktif Bintang Edu */}
        <ScienceModulesSection
          activeFeature={activeFeature}
          onSelectFeature={setActiveFeature}
          activeQuizIndex={activeQuizIndex}
          onSelectQuizIndex={setActiveQuizIndex}
          onAddStars={handleAddStars}
          onNotify={showToast}
        />
      </main>

      {/* 3. FOOTER PENUTUP */}
      <FooterSection onFooterMenuClick={handleFooterMenuClick} />

      {/* ================================================================
          MODAL APPLICATION ENTRY (Pilih Cita-Cita Masa Kecil "Childhood Dream")
         ================================================================ */}
      {applicationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/25 bg-gradient-to-b from-indigo-900 via-blue-900 to-purple-950 p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setApplicationModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-blue-200 hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Tutup Pendaftaran Mimpi"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-indigo-950 shadow-md">
                <Icon icon="lucide:rocket" className="h-6 w-6" />
              </div>
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-yellow-300">
                  Bintang Edu • Application Entry
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Wujudkan Cita-Cita Sainsmu!
                </h3>
              </div>
            </div>

            <p className="mt-3 font-body text-xs sm:text-sm font-semibold text-blue-100/90">
              Pilih profesi impian masa kecilmu untuk membuka misi eksperimen
              antariksa dan mendapatkan lencana bintang khusus:
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  role: 'Astronaut & Penjelajah Antariksa',
                  emoji: '👨‍🚀',
                  topicIdx: 0,
                },
                {
                  role: 'Ilmuwan Alam & Botani',
                  emoji: '🌱',
                  topicIdx: 1,
                },
                {
                  role: 'Insinyur Robot & Fisika',
                  emoji: '🤖',
                  topicIdx: 2,
                },
                {
                  role: 'Guru Sains & Peneliti Cuaca',
                  emoji: '🌈',
                  topicIdx: 3,
                },
              ].map((item) => {
                const isSelected = selectedDreamRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      setSelectedDreamRole(item.role);
                      handleSelectScheduleTopic(item.topicIdx);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-yellow-300 bg-yellow-400/20 text-white shadow-md'
                        : 'border-white/15 bg-white/5 text-blue-100 hover:border-yellow-300/50'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-heading text-xs sm:text-sm font-bold leading-snug">
                      {item.role}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setApplicationModalOpen(false);
                handleAddStars(30, `Misi Cita-Cita: ${selectedDreamRole}`);
                const currentTopic =
                  DAILY_SCIENCE_SCHEDULE[activeTopicIndex] ||
                  DAILY_SCIENCE_SCHEDULE[0];
                handleStartExperiment(currentTopic);
              }}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-xl hover:from-yellow-200 hover:to-yellow-300 cursor-pointer"
            >
              🚀 MULAI EXPERIENCE SEKARANG (+30 ⭐)
            </button>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL PENCARIAN TOPIK SAINS (Tombol Search di Navbar)
         ================================================================ */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/25 bg-gradient-to-b from-indigo-900 to-purple-950 p-6 sm:p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-blue-200 hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Tutup Pencarian"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <Icon
                icon="lucide:search"
                className="h-5 w-5 text-yellow-300"
              />
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                Cari Petualangan & Modul Sains SD
              </h3>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik topik: Tata Surya, Fotosintesis, Magnet, Air..."
                autoFocus
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 font-body text-sm font-bold text-white placeholder-blue-200/70 focus:border-yellow-300 focus:outline-none"
              />
            </div>

            <div className="mt-4 space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {filteredScheduleTopics.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    handleSelectScheduleTopic(idx);
                    setSearchModalOpen(false);
                    handleStartExperiment(item);
                  }}
                  className="w-full flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left transition-colors hover:border-yellow-300 hover:bg-white/15 cursor-pointer"
                >
                  <div>
                    <div className="font-heading text-xs font-bold text-yellow-300">
                      {item.category} • {item.grade}
                    </div>
                    <div className="font-heading text-sm font-bold text-white">
                      {item.title}
                    </div>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-indigo-950">
                    <Icon icon="lucide:play" className="h-3.5 w-3.5 ml-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL PROFIL ILMUWAN CILIK ("Mintion" di Kanan Navbar)
         ================================================================ */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/25 bg-gradient-to-b from-indigo-900 to-purple-950 p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-blue-200 hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Tutup Profil"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <BintangEduMascot className="h-16 w-16" withBadge={true} />
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3.5 py-1 font-heading text-xs font-bold text-indigo-950 shadow-sm">
                <Icon icon="lucide:star" className="h-3.5 w-3.5" />
                <span>Total Koleksi: {totalStars} Bintang</span>
              </div>
              <h3 className="mt-3 font-heading text-xl font-bold text-white">
                Profil Kapten Impian
              </h3>
              <p className="mt-1 font-body text-xs sm:text-sm font-bold text-blue-200">
                Cita-cita: {selectedDreamRole}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setProfileModalOpen(false);
                showToast(
                  `👨‍🚀 Profil disimpan: ${studentName} (${studentGrade})`
                );
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block font-heading text-xs font-bold text-yellow-300 mb-1">
                  Nama Panggilan Anak
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 font-body text-sm font-bold text-white focus:border-yellow-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading text-xs font-bold text-yellow-300 mb-1">
                  Kelas Sekolah Dasar (SD)
                </label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  className="w-full rounded-xl border border-white/25 bg-indigo-950 px-4 py-2.5 font-body text-sm font-bold text-white focus:border-yellow-300 focus:outline-none"
                >
                  <option value="Kelas 1 SD">Kelas 1 SD</option>
                  <option value="Kelas 2 SD">Kelas 2 SD</option>
                  <option value="Kelas 3 SD">Kelas 3 SD</option>
                  <option value="Kelas 4 SD">Kelas 4 SD</option>
                  <option value="Kelas 5 SD">Kelas 5 SD</option>
                  <option value="Kelas 6 SD">Kelas 6 SD</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 py-3 font-heading text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-lg hover:bg-yellow-300 cursor-pointer"
              >
                <Icon icon="lucide:user-check" className="h-4 w-4" />
                <span>SIMPAN PROFIL SAINS</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
