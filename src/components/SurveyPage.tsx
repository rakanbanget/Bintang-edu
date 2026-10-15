import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface SurveyPageProps {
  onComplete: () => void;
  onBack: () => void;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({ onComplete, onBack }) => {
  const [selectedStyle, setSelectedStyle] = useState<'auditory' | 'reading' | null>(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 1,
      text: 'Saat belajar materi baru, kamu lebih suka:',
      options: [
        { value: 'auditory', label: '🎧 Mendengarkan penjelasan lisan dari guru atau audio' },
        { value: 'reading', label: '📖 Membaca teks dan melihat ilustrasi/gambar' },
      ],
    },
    {
      id: 2,
      text: 'Untuk menghafal fakta sains, cara mana yang paling mudah?',
      options: [
        { value: 'auditory', label: '🎤 Mengulang-ulang sambil bersuara atau mendengar rekaman' },
        { value: 'reading', label: '📚 Menulis atau membaca catatan berulang kali' },
      ],
    },
    {
      id: 3,
      text: 'Saat mengerjakan tugas, kamu biasanya:',
      options: [
        { value: 'auditory', label: '🗣️ Bicara sendiri atau minta dijelaskan ulang' },
        { value: 'reading', label: '✍️ Membaca instruksi dengan teliti lalu langsung menulis' },
      ],
    },
  ];

  const handleSubmit = async () => {
    if (!selectedStyle) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch('http://localhost:5001/api/students/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ learning_style: selectedStyle }),
      });

      const data = await res.json();
      if (data.success) {
        // Update user di localStorage
        const updatedUser = { ...user, learning_style: selectedStyle };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onComplete();
      } else {
        alert('Gagal menyimpan gaya belajar: ' + data.message);
      }
    } catch (error) {
      console.error('Submit survey error:', error);
      alert('Network error saat mengirim survei.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={onBack}
            className="rounded-full border-2 border-slate-300 bg-white p-3 text-slate-700 transition-all hover:bg-slate-100"
          >
            <Icon icon="lucide:arrow-left" className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              🎓 Survei Gaya Belajar
            </h1>
            <p className="text-slate-600">
              Pilih gaya belajar yang cocok agar materi Bintang Edu lebih menyenangkan!
            </p>
          </div>
        </div>

        {/* Petunjuk */}
        <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <Icon icon="solar:lightbulb-bolt-bold-duotone" className="text-3xl text-amber-600" />
            <div>
              <h3 className="text-lg font-bold text-amber-900">
                Kenapa harus mengisi survei?
              </h3>
              <ul className="mt-2 list-inside list-disc text-sm text-amber-800 space-y-1">
                <li>Modul sains akan disesuaikan dengan cara belajarmu</li>
                <li>Materi audio atau teks akan muncul sesuai preferensi</li>
                <li>Proses belajar lebih efektif dan menyenangkan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pilihan Gaya */}
        <div className="mb-8 grid gap-6">
          <div className="rounded-2xl border-2 border-white bg-white/80 p-6 shadow-xl backdrop-blur-md">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Pilih gaya belajar utama:
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setSelectedStyle('auditory')}
                className={`rounded-xl border-2 p-6 text-left transition-all ${
                  selectedStyle === 'auditory'
                    ? 'border-sky-500 bg-sky-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-sky-300'
                }`}
              >
                <Icon icon="solar:headphones-bold-duotone" className="mb-3 text-4xl text-sky-600" />
                <h3 className="text-lg font-bold text-slate-900">🎧 Auditory</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Lebih mudah memahami dengan mendengarkan penjelasan audio, diskusi, atau narasi lisan.
                </p>
                {selectedStyle === 'auditory' && (
                  <div className="mt-3 text-xs font-bold text-sky-600">✓ Dipilih</div>
                )}
              </button>

              <button
                onClick={() => setSelectedStyle('reading')}
                className={`rounded-xl border-2 p-6 text-left transition-all ${
                  selectedStyle === 'reading'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <Icon icon="solar:book-bold-duotone" className="mb-3 text-4xl text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">📖 Reading</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Lebih mudah memahami dengan membaca teks, melihat diagram, ilustrasi, dan catatan visual.
                </p>
                {selectedStyle === 'reading' && (
                  <div className="mt-3 text-xs font-bold text-emerald-600">✓ Dipilih</div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="sticky bottom-6 flex items-center justify-between rounded-2xl border-2 border-white bg-white/90 p-6 shadow-2xl backdrop-blur-md">
          <div>
            <p className="text-sm font-medium text-slate-600">
              {selectedStyle ? (
                <>
                  Kamu memilih <span className="font-bold text-indigo-700">{selectedStyle === 'auditory' ? '🎧 Auditory' : '📖 Reading'}</span>
                </>
              ) : (
                'Pilih salah satu gaya belajar di atas'
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="rounded-xl border-2 border-slate-300 px-6 py-3 font-bold text-slate-700 transition-all hover:bg-slate-100"
            >
              Lewati (Nanti)
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedStyle || loading}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan & Lanjut ke Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
