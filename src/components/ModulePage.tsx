import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ModulePageProps {
  posId: string;
  onBack: () => void;
  onComplete: () => void;
}

const MODULE_DATA: Record<string, { title: string; topic: string; audioText: string; readingText: string; gameInstruction: string }> = {
  '1': {
    title: 'Pos 1: Anatomi Tubuh & Panca Indra',
    topic: 'Mata, Telinga, Kulit, Hidung, Lidah',
    audioText: 'Hai Kadet! Kita akan belajar tentang panca indra. Mata kita punya pupil yang mengatur cahaya masuk. Telinga menangkap getaran suara. Kulit merasakan sentuhan. Hidung mencium bau. Lidah merasakan rasa manis, asin, asam, pahit!',
    readingText: '👁️ **Mata Kita Menakjubkan!**\n\nMata manusia punya **pupil** (lingkaran hitam di tengah) dan **iris** (bagian berwarna). Pupil mengatur cahaya yang masuk — membesar di tempat gelap, mengecil di tempat terang!\n\n👂 **Telinga Mendengar Getaran**\n\nSuara adalah getaran udara. Telinga kita menangkap getaran itu dan otak kita mengubahnya jadi bunyi yang kita dengar!\n\n🖐️ **Kulit Merasakan Sentuhan**\n\nKulit punya sensor sentuhan, panas, dingin, dan sakit. Makanya kita bisa merasakan es dingin atau air hangat!',
    gameInstruction: '🎮 **Mini-Game:** Seret gambar organ (mata, telinga, hidung, lidah, kulit) ke kotak yang sesuai dengan fungsinya!',
  },
  '2': {
    title: 'Pos 2: Dunia Tumbuhan & Ekosistem',
    topic: 'Fotosintesis, Rantai Makanan, Habitat',
    audioText: 'Tumbuhan hijau bisa membuat makanannya sendiri! Prosesnya disebut fotosintesis. Daun tumbuhan punya klorofil berwarna hijau yang menangkap cahaya matahari. Cahaya matahari + air + udara = makanan untuk tumbuhan! Rantai makanan dimulai dari tumbuhan, dimakan hewan herbivora, lalu dimakan karnivora.',
    readingText: '🌿 **Fotosintesis: Pabrik Makanan Tumbuhan**\n\nTumbuhan hijau punya **klorofil** di daunnya. Klorofil menangkap cahaya matahari dan mengubahnya jadi energi. Dengan bantuan air dari akar dan CO₂ dari udara, tumbuhan membuat glukosa (gula) sebagai makanannya!\n\n🦋 **Rantai Makanan**\n\nTumbuhan → Ulat → Burung → Elang. Setiap makhluk hidup saling bergantung dalam ekosistem!',
    gameInstruction: '🎮 **Mini-Game:** Susun rantai makanan yang benar dengan menyeret kartu makhluk hidup dari tumbuhan hingga predator puncak!',
  },
  '3': {
    title: 'Pos 3: Siklus Air & Kondensasi',
    topic: 'Penguapan, Kondensasi, Hujan',
    audioText: 'Air laut dan sungai menguap jadi uap air karena panas matahari. Uap air naik ke langit dan mendingin, berubah jadi titik-titik air kecil yang membentuk awan. Proses ini namanya kondensasi! Saat awan penuh air, titik-titik air jatuh sebagai hujan ke bumi. Lalu siklusnya berulang lagi!',
    readingText: '🌧️ **Siklus Air: Petualangan Tetes Air**\n\n**1. Evaporasi (Penguapan):** Matahari memanaskan air laut, danau, sungai. Air berubah jadi uap air yang tak terlihat dan naik ke langit.\n\n**2. Kondensasi (Pengembunan):** Di langit yang dingin, uap air berubah jadi titik-titik air kecil dan membentuk awan putih!\n\n**3. Presipitasi (Hujan):** Saat awan penuh, titik-titik air jatuh sebagai hujan ke bumi. Air kembali ke sungai dan laut, lalu siklus berulang!',
    gameInstruction: '🎮 **Mini-Game:** Seret tetes air melalui siklus air — mulai dari laut → uap → awan → hujan → kembali ke laut!',
  },
  '4': {
    title: 'Pos 4: Energi Panas & Wujud Benda',
    topic: 'Kalor, Perubahan Wujud, Suhu',
    audioText: 'Energi panas disebut kalor. Kalor bisa berpindah dari benda panas ke benda dingin. Es batu di gelas air hangat akan mencair karena menerima kalor. Sebaliknya, air yang didinginkan di freezer akan membeku jadi es!',
    readingText: '⚡ **Kalor dan Perubahan Wujud**\n\n**Mencair (Melebur):** Es padat + kalor → air cair\n\n**Membeku:** Air cair - kalor → es padat\n\n**Menguap:** Air cair + kalor → uap air gas\n\n**Mengembun:** Uap air gas - kalor → titik air cair\n\nKalor berpindah dari benda panas ke dingin sampai suhunya sama!',
    gameInstruction: '🎮 **Mini-Game:** Seret es batu ke dalam panci panas dan lihat perubahannya dari padat → cair → gas!',
  },
  '5': {
    title: 'Pos 5: Tata Surya & Gravitasi',
    topic: 'Planet, Orbit, Gaya Gravitasi',
    audioText: 'Tata surya kita punya Matahari di tengah dan 8 planet yang mengelilinginya. Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus. Gravitasi Matahari menarik semua planet agar tetap di orbitnya dan tidak terbang ke luar angkasa!',
    readingText: '🪐 **Tata Surya Kita**\n\n**Matahari** adalah bintang raksasa yang memancarkan cahaya dan panas.\n\n**8 Planet:** Merkurius (paling dekat), Venus, Bumi (rumah kita!), Mars (planet merah), Jupiter (terbesar), Saturnus (bercincin), Uranus, Neptunus.\n\n**Gravitasi:** Gaya tarik-menarik antar benda. Gravitasi Matahari sangat kuat dan menjaga planet-planet tetap beredar di orbitnya!',
    gameInstruction: '🎮 **Mini-Game:** Seret planet-planet ke orbit yang benar mengelilingi Matahari!',
  },
};

export const ModulePage: React.FC<ModulePageProps> = ({ posId, onBack, onComplete }) => {
  const [user, setUser] = useState<{ id?: number; name: string; learning_style: string | null }>({ name: '', learning_style: null });
  const [loading, setLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const module = MODULE_DATA[posId] || MODULE_DATA['1'];
  const isAuditory = user.learning_style === 'auditory';

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleCompleteModule = async () => {
    if (!gameCompleted) {
      alert('⚠️ Selesaikan Mini-Game dulu ya, Kadet!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: user.id,
          module_id: parseInt(posId),
          score: 100,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal kirim skor');
      alert('🎉 Selamat! Misi berhasil diselesaikan! Skor kamu: 100 ⭐');
      onComplete();
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
    // Simulasi audio playback (di production pakai <audio> element atau Web Speech API)
    if (!audioPlaying) {
      alert(`🎧 Audio dimulai: "${module.audioText.substring(0, 50)}..."`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border-2 border-white bg-white/95 p-4 shadow-xl">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
          >
            <Icon icon="lucide:arrow-left" />
            Kembali ke Peta
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-950">
            <Icon icon="lucide:user" />
            {user.name}
            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs">
              {isAuditory ? '🎧 Auditory' : '📖 Reading'}
            </span>
          </div>
        </div>

        {/* Module Title */}
        <div className="mb-6 rounded-3xl border-4 border-white bg-gradient-to-r from-sky-400 to-indigo-500 p-6 text-center shadow-2xl">
          <h1 className="text-2xl font-extrabold text-white">{module.title}</h1>
          <p className="mt-2 text-sm font-bold text-sky-50">{module.topic}</p>
        </div>

        {/* Adaptive Content */}
        <div className="mb-6 space-y-6">
          {isAuditory ? (
            // AUDITORY MODE
            <div className="rounded-3xl border-4 border-amber-300 bg-amber-50 p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-amber-900">🎧 Mode Audio Voiceover</h2>
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600"
                >
                  <Icon icon={audioPlaying ? 'lucide:pause' : 'lucide:play'} />
                  {audioPlaying ? 'Jeda' : 'Putar Audio'}
                </button>
              </div>
              <p className="text-sm font-bold leading-relaxed text-amber-900">{module.audioText}</p>
              <div className="mt-4 rounded-xl border-2 border-amber-400 bg-amber-100 p-4">
                <Icon icon="lucide:volume-2" className="mx-auto h-12 w-12 text-amber-600" />
                <p className="mt-2 text-center text-xs font-bold text-amber-800">
                  Dengarkan dengan seksama penjelasan sains dari Kadet Foxy!
                </p>
              </div>
            </div>
          ) : (
            // READING MODE
            <div className="rounded-3xl border-4 border-sky-300 bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-lg font-extrabold text-sky-900">📖 Mode Membaca Komik Sains</h2>
              <div className="prose prose-sm max-w-none whitespace-pre-line text-sm font-bold leading-relaxed text-slate-900">
                {module.readingText}
              </div>
              <div className="mt-4 rounded-xl border-2 border-sky-400 bg-sky-50 p-4">
                <Icon icon="lucide:book-open" className="mx-auto h-12 w-12 text-sky-600" />
                <p className="mt-2 text-center text-xs font-bold text-sky-800">
                  Baca dengan teliti cerita sains dari Kadet Foxy!
                </p>
              </div>
            </div>
          )}

          {/* Mini-Game Canvas Placeholder */}
          <div className="rounded-3xl border-4 border-emerald-300 bg-emerald-50 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-extrabold text-emerald-900">{module.gameInstruction}</h2>
            <div className="relative aspect-video rounded-xl border-4 border-emerald-400 bg-white shadow-inner">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Icon icon="lucide:gamepad-2" className="mx-auto h-16 w-16 text-emerald-500" />
                  <p className="mt-4 text-sm font-bold text-emerald-900">
                    [Canvas Mini-Game Drag-and-Drop Placeholder]
                  </p>
                  <button
                    onClick={() => setGameCompleted(true)}
                    disabled={gameCompleted}
                    className="mt-4 rounded-xl bg-emerald-500 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-600 disabled:bg-emerald-300"
                  >
                    {gameCompleted ? '✅ Game Selesai' : 'Simulasi: Selesai Game'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        <button
          onClick={handleCompleteModule}
          disabled={loading || !gameCompleted}
          className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 py-4 text-lg font-extrabold text-indigo-950 shadow-2xl hover:from-yellow-300 hover:to-orange-300 disabled:opacity-50"
        >
          {loading ? 'Mengirim Skor...' : '🚀 Selesaikan Misi & Kirim Skor (100 ⭐)'}
        </button>
      </div>
    </div>
  );
};
