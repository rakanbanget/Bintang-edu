import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface StudentDashboardSimpleProps {
  onSwitchToLanding3D?: () => void;
  onLogout?: () => void;
}

interface UserData {
  name: string;
  email: string;
  role: string;
  learning_style?: 'auditory' | 'reading' | null;
}

export const StudentDashboardSimple: React.FC<StudentDashboardSimpleProps> = ({
  onSwitchToLanding3D,
  onLogout,
}) => {
  const [user, setUser] = useState<UserData>({
    name: 'Minton',
    email: 'minton@bintangedu.id',
    role: 'student',
    learning_style: null,
  });
  const [joinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const [loadingJoin, setLoadingJoin] = useState(false);

  useEffect(() => {
    // Load user dari localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Parse user failed', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
  };

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      alert('Masukkan kode grup terlebih dahulu');
      return;
    }
    setLoadingJoin(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ group_code: groupCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal bergabung grup');
      alert('✅ Berhasil bergabung dengan grup!');
      setGroupCode('');
      setJoinGroupModalOpen(false);
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setLoadingJoin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 p-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between rounded-2xl border-2 border-white bg-white/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-2xl font-bold text-white shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Halo, {user.name}! 🚀
            </h1>
            <p className="text-sm font-medium text-slate-600">
              {user.email} • {user.role === 'student' ? 'Siswa' : user.role}
            </p>
            {user.learning_style && (
              <p className="mt-1 text-xs font-bold text-indigo-600">
                Gaya Belajar: {user.learning_style === 'auditory' ? '🎧 Auditory' : '📖 Reading'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onSwitchToLanding3D && (
            <button
              onClick={onSwitchToLanding3D}
              className="rounded-xl border-2 border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 transition-all hover:bg-indigo-100"
            >
              <Icon icon="solar:planet-3-bold-duotone" className="mr-2 inline text-lg" />
              Landing Page
            </button>
          )}
          <button
            onClick={() => setJoinGroupModalOpen(true)}
            className="rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 transition-all hover:bg-sky-100"
          >
            <Icon icon="solar:users-group-rounded-bold-duotone" className="mr-2 inline text-lg" />
            Join Grup
          </button>
          <button
            onClick={handleLogout}
            className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition-all hover:bg-rose-100"
          >
            <Icon icon="solar:logout-3-bold-duotone" className="mr-2 inline text-lg" />
            Logout
          </button>
        </div>
      </header>

      {/* Konten Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-white bg-white/80 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-3 flex items-center gap-3">
            <Icon icon="solar:star-bold-duotone" className="text-3xl text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">Bintang Emas</h3>
          </div>
          <p className="text-4xl font-extrabold text-amber-600">1,240</p>
          <p className="mt-1 text-xs text-slate-600">Total bintang terkumpul</p>
        </div>

        <div className="rounded-2xl border-2 border-white bg-white/80 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-3 flex items-center gap-3">
            <Icon icon="solar:fire-bold-duotone" className="text-3xl text-orange-500" />
            <h3 className="text-lg font-bold text-slate-900">Streak</h3>
          </div>
          <p className="text-4xl font-extrabold text-orange-600">7 Hari</p>
          <p className="mt-1 text-xs text-slate-600">Belajar berturut-turut</p>
        </div>

        <div className="rounded-2xl border-2 border-white bg-white/80 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-3 flex items-center gap-3">
            <Icon icon="solar:graph-up-bold-duotone" className="text-3xl text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900">Progress</h3>
          </div>
          <p className="text-4xl font-extrabold text-emerald-600">40%</p>
          <p className="mt-1 text-xs text-slate-600">Modul selesai</p>
        </div>
      </div>

      {/* Info Survey Gaya Belajar */}
      {!user.learning_style && (
        <div className="mt-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <Icon icon="solar:lightbulb-bolt-bold-duotone" className="text-4xl text-amber-600" />
            <div>
              <h3 className="text-lg font-bold text-amber-900">
                📝 Isi Survei Gaya Belajarmu!
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Materi akan disesuaikan dengan gaya belajarmu: Auditory (🎧 mendengar) atau Reading (📖 membaca).
              </p>
              <button className="mt-3 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-amber-600">
                Isi Survei Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modul Sains */}
      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-extrabold text-slate-900">
          📚 Modul Sains Interaktif
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { id: 1, title: 'Sistem Tata Surya', category: 'Astronomi', icon: 'solar:planet-bold-duotone' },
            { id: 2, title: 'Siklus Air', category: 'Geografi', icon: 'solar:cloud-rain-bold-duotone' },
            { id: 3, title: 'Rantai Makanan', category: 'Biologi', icon: 'solar:leaf-bold-duotone' },
          ].map((mod) => (
            <div
              key={mod.id}
              className="cursor-pointer rounded-xl border-2 border-white bg-white/80 p-5 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:shadow-xl"
            >
              <Icon icon={mod.icon} className="mb-3 text-4xl text-indigo-600" />
              <h4 className="text-lg font-bold text-slate-900">{mod.title}</h4>
              <p className="mt-1 text-xs font-medium text-slate-600">{mod.category}</p>
              <button className="mt-3 w-full rounded-lg bg-indigo-500 px-3 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-600">
                Mulai Belajar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Join Grup */}
      {joinGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-white bg-white p-6 shadow-2xl">
            <button
              onClick={() => setJoinGroupModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <Icon icon="lucide:x" className="h-5 w-5" />
            </button>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Bergabung Grup Sains</h2>
              <p className="mt-1 text-sm text-slate-600">
                Masukkan kode grup yang dibagikan guru atau orang tua
              </p>
            </div>
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
              placeholder="Contoh: SAINS123ABC"
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-bold text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setJoinGroupModalOpen(false)}
                className="flex-1 rounded-lg border-2 border-slate-300 py-2 font-bold text-slate-700 transition-all hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleJoinGroup}
                disabled={loadingJoin}
                className="flex-1 rounded-lg bg-indigo-500 py-2 font-bold text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
              >
                {loadingJoin ? 'Bergabung...' : 'Bergabung'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
