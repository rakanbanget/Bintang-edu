import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

/* ─── Planet Data ─── */
interface PlanetData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  orbitRadius: number;  // percent of container half-width
  size: number;         // px diameter
  basePeriod: number;   // base orbit duration in seconds (Normal speed)
  fact: string;
  distance: string;
  temperature: string;
}

const PLANETS: PlanetData[] = [
  {
    id: 'merkurius', name: 'Merkurius', emoji: '🪨',
    color: 'from-gray-400 to-gray-500',
    orbitRadius: 16, size: 10, basePeriod: 6,
    fact: 'Planet terkecil & tercepat! Satu tahun di Merkurius cuma 88 hari Bumi. Permukaannya penuh kawah seperti Bulan! 🌑',
    distance: '57,9 juta km', temperature: '−173°C s/d 427°C',
  },
  {
    id: 'venus', name: 'Venus', emoji: '🌤️',
    color: 'from-orange-300 to-yellow-400',
    orbitRadius: 24, size: 13, basePeriod: 10,
    fact: 'Planet terpanas di Tata Surya (462°C)! Venus berputar terbalik — matahari terbit dari barat! 🔥',
    distance: '108,2 juta km', temperature: '462°C (rata-rata)',
  },
  {
    id: 'bumi', name: 'Bumi', emoji: '🌍',
    color: 'from-blue-400 to-green-400',
    orbitRadius: 32, size: 14, basePeriod: 14,
    fact: 'Rumah kita! Satu-satunya planet dengan air cair & kehidupan. 71% permukaan Bumi tertutup air laut! 🌊',
    distance: '149,6 juta km', temperature: '15°C (rata-rata)',
  },
  {
    id: 'mars', name: 'Mars', emoji: '🔴',
    color: 'from-red-400 to-red-600',
    orbitRadius: 40, size: 12, basePeriod: 18,
    fact: 'Planet Merah! Punya gunung tertinggi Tata Surya: Olympus Mons (21,9 km)! Robot Perseverance sedang menjelajahinya! 🤖',
    distance: '227,9 juta km', temperature: '−63°C (rata-rata)',
  },
  {
    id: 'yupiter', name: 'Yupiter', emoji: '🟤',
    color: 'from-amber-600 to-orange-700',
    orbitRadius: 52, size: 22, basePeriod: 24,
    fact: 'Planet terbesar! Bisa muat 1.300 Bumi di dalamnya! Badai Besar Merahnya sudah berusia 350+ tahun! 🌀',
    distance: '778,5 juta km', temperature: '−110°C (awan atas)',
  },
  {
    id: 'saturnus', name: 'Saturnus', emoji: '💍',
    color: 'from-yellow-500 to-amber-400',
    orbitRadius: 64, size: 20, basePeriod: 32,
    fact: 'Terkenal dengan cincin es & batu! Saturnus sangat ringan — bisa mengapung di air raksasa! Punya 146 bulan! 🛸',
    distance: '1,43 miliar km', temperature: '−140°C (awan atas)',
  },
];

/* ─── Speed Presets ─── */
const SPEED_OPTIONS = [
  { label: 'Lambat', value: 0.3, icon: 'lucide:snail' },
  { label: 'Normal', value: 1, icon: 'lucide:play' },
  { label: 'Cepat', value: 3, icon: 'lucide:zap' },
];

/* ─── Component ─── */
interface SolarSystemMiniLabProps {
  isAuthenticated?: boolean;
}

export const SolarSystemMiniLab: React.FC<SolarSystemMiniLabProps> = ({
  isAuthenticated = false,
}) => {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [speed, setSpeed] = useState(1);
  const [isRotating, setIsRotating] = useState(true);
  const [heatSun, setHeatSun] = useState(false);
  const [showGravity, setShowGravity] = useState(false);
  const [clickPulse, setClickPulse] = useState<string | null>(null);

  /* Click pulse effect */
  const triggerPulse = (id: string) => {
    setClickPulse(id);
    setTimeout(() => setClickPulse(null), 500);
  };

  /* Memoize background stars so they don't re-randomize on every render */
  const bgStars = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        key: i,
        w: Math.random() * 2 + 0.5,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
        delay: Math.random() * 4,
        dur: 2.5 + Math.random() * 2.5,
      })),
    [],
  );

  return (
    <section className="relative w-full px-4 md:px-8 py-10 md:py-16">
      {/* Inline keyframes – injected once */}
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit-counter {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(-360deg); }
        }
        @keyframes sun-pulse {
          0%, 100% { box-shadow: 0 0 25px rgba(250,204,21,0.6); }
          50%      { box-shadow: 0 0 50px rgba(250,204,21,0.9), 0 0 80px rgba(251,146,60,0.4); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: var(--star-o); }
          50%      { opacity: 0.05; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        {/* ─── Card Container ─── */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#1c0f45] via-[#13092d] to-[#0d0521] p-5 md:p-8 shadow-[0_22px_48px_rgba(2,6,23,0.38),0_0_28px_rgba(139,92,246,0.24)]">

          {/* Background stars */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {bgStars.map((s) => (
              <div
                key={s.key}
                className="absolute rounded-full bg-white"
                style={{
                  width: s.w,
                  height: s.w,
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  '--star-o': s.opacity,
                  opacity: s.opacity,
                  animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* ─── Header ─── */}
          <div className="relative z-10 mb-6 md:mb-8 text-center">
            <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300 mb-3">
              ⚡ Eksperimen Instan
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              🧪 Mini Lab Sains{' '}
              <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Tata Surya
              </span>
            </h2>
            <p className="mt-2 text-sm text-purple-200/80 max-w-lg mx-auto">
              Klik planet, atur kecepatan orbit, dan temukan fakta sains yang menakjubkan!
            </p>
          </div>

          {/* ─── Main Content Grid ─── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ══ LEFT: Orbit Viewer (3 cols) ══ */}
            <div className="lg:col-span-3">
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl border border-purple-500/30 bg-[#0d0720] overflow-hidden shadow-inner">

                {/* ── Orbit rings (static ellipses) ── */}
                {PLANETS.map((p) => (
                  <div
                    key={`ring-${p.id}`}
                    className="pointer-events-none absolute rounded-full border border-purple-400/20"
                    style={{
                      width: `${p.orbitRadius * 2}%`,
                      height: `${p.orbitRadius * 2}%`,
                      top: `${50 - p.orbitRadius}%`,
                      left: `${50 - p.orbitRadius}%`,
                    }}
                  />
                ))}

                {/* ── Sun (center) ── */}
                <div className="absolute z-20" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div
                    className="rounded-full transition-all duration-700 flex items-center justify-center"
                    style={{
                      width: heatSun ? 56 : 40,
                      height: heatSun ? 56 : 40,
                      background: heatSun
                        ? 'radial-gradient(circle, #fde047 0%, #fb923c 50%, #ef4444 100%)'
                        : 'radial-gradient(circle, #fde047 0%, #f59e0b 60%, #ea580c 100%)',
                      animation: 'sun-pulse 2.5s ease-in-out infinite',
                      boxShadow: heatSun
                        ? '0 0 40px rgba(251,146,60,0.8), 0 0 80px rgba(250,204,21,0.4)'
                        : '0 0 25px rgba(250,204,21,0.6)',
                    }}
                  >
                    <span className="text-lg select-none">☀️</span>
                  </div>
                </div>

                {/* ── Heat wave rings ── */}
                {heatSun && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <div
                      className="absolute rounded-full border border-orange-400/20"
                      style={{ width: 120, height: 120, animation: 'orbit-spin 3s linear infinite' }}
                    />
                    <div
                      className="absolute rounded-full border border-red-400/10"
                      style={{ width: 160, height: 160, animation: 'orbit-spin 4.5s linear infinite reverse' }}
                    />
                  </div>
                )}

                {/* ── Orbiting Planets ── */}
                {/*
                  Each planet is wrapped in a rotating container div:
                  1. Outer div: centered at 50%/50%, sized to orbit diameter, spins via CSS animation
                  2. Inner planet dot: positioned at the right edge (top: 50%, left: 100%), counter-rotates to stay upright
                */}
                {PLANETS.map((planet) => {
                  const isSelected = selectedPlanet?.id === planet.id;
                  const isPulsing = clickPulse === planet.id;
                  const duration = planet.basePeriod / speed; // faster speed → shorter duration
                  const gravityScale = showGravity ? 0.82 : 1;

                  return (
                    <div
                      key={planet.id}
                      className="absolute pointer-events-none"
                      style={{
                        /* center the orbit container */
                        top: '50%',
                        left: '50%',
                        width: `${planet.orbitRadius * 2 * gravityScale}%`,
                        height: `${planet.orbitRadius * 2 * gravityScale}%`,
                        marginTop: `-${planet.orbitRadius * gravityScale}%`,
                        marginLeft: `-${planet.orbitRadius * gravityScale}%`,
                        /* CSS orbit rotation */
                        animation: `orbit-spin ${duration}s linear infinite`,
                        animationPlayState: isRotating ? 'running' : 'paused',
                        transition: 'width 0.8s ease, height 0.8s ease, margin 0.8s ease',
                      }}
                    >
                      {/* Planet dot – positioned at right edge, counter-rotates */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlanet(planet);
                          triggerPulse(planet.id);
                        }}
                        className={`absolute pointer-events-auto cursor-pointer rounded-full transition-transform duration-200 hover:scale-[1.8] ${
                          isSelected ? 'scale-[1.4] z-40' : 'z-30'
                        }`}
                        style={{
                          width: planet.size,
                          height: planet.size,
                          top: '50%',
                          left: '100%',
                          /* counter-rotate so planet doesn't spin on its axis */
                          animation: `orbit-counter ${duration}s linear infinite`,
                          animationPlayState: isRotating ? 'running' : 'paused',
                        }}
                        title={planet.name}
                      >
                        {/* Planet sphere */}
                        <div
                          className={`w-full h-full rounded-full bg-gradient-to-br ${planet.color} transition-shadow duration-300 ${
                            isSelected
                              ? 'shadow-[0_0_14px_rgba(251,191,36,0.7)] ring-2 ring-amber-400/80 ring-offset-1 ring-offset-[#0d0720]'
                              : 'shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                          } ${isPulsing ? 'animate-ping' : ''}`}
                        />
                        {/* Label */}
                        {isSelected && (
                          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#13092d]/90 px-2 py-0.5 text-[8px] font-bold text-amber-300 border border-amber-400/30">
                            {planet.name}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}

                {/* Gravity lines */}
                {showGravity && (
                  <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full">
                    {PLANETS.map((p) => (
                      <line
                        key={`grav-${p.id}`}
                        x1="50%" y1="50%"
                        x2={`${50 + p.orbitRadius * 0.82}%`} y2="50%"
                        stroke="rgba(34,211,238,0.15)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ))}
                  </svg>
                )}

                {/* Hint overlay */}
                {!selectedPlanet && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 rounded-full bg-[#13092d]/90 border border-purple-500/30 px-4 py-1.5 backdrop-blur-sm">
                    <p className="text-[10px] md:text-xs text-purple-200/90 font-medium text-center">
                      👆 Klik planet untuk melihat fakta sains!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ══ RIGHT: Controls & Info (2 cols) ══ */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* ── Planet Fact Card ── */}
              <div className={`flex-1 rounded-2xl border p-4 transition-all duration-500 ${
                selectedPlanet
                  ? 'border-amber-400/30 bg-gradient-to-br from-[#1c0f45]/90 to-[#13092d]/90 shadow-xl'
                  : 'border-purple-500/20 bg-[#120a2a]/70'
              }`}>
                {selectedPlanet ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${selectedPlanet.color} text-xl shadow-lg`}>
                        {selectedPlanet.emoji}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white">{selectedPlanet.name}</h3>
                        <p className="text-[10px] text-purple-200/70 font-medium">
                          Jarak: {selectedPlanet.distance}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed text-purple-100/90">
                      {selectedPlanet.fact}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-[10px] font-semibold text-blue-200">
                        <Icon icon="lucide:thermometer" className="h-3 w-3" />
                        {selectedPlanet.temperature}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-400/30 px-3 py-1 text-[10px] font-semibold text-purple-200">
                        <Icon icon="lucide:ruler" className="h-3 w-3" />
                        {selectedPlanet.distance}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center py-6">
                    <div className="text-4xl mb-3">🪐</div>
                    <p className="text-sm font-semibold text-purple-200/70">Pilih planet di simulator</p>
                    <p className="text-[10px] text-purple-300/40 mt-1">untuk melihat fakta sains menarik!</p>
                  </div>
                )}
              </div>

              {/* ── Planet Quick Select ── */}
              <div className="rounded-2xl border border-purple-500/20 bg-[#120a2a]/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200/70 mb-2">Pilih Planet</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {PLANETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlanet(p);
                        triggerPulse(p.id);
                      }}
                      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-left transition-all duration-200 cursor-pointer ${
                        selectedPlanet?.id === p.id
                          ? 'bg-amber-400/20 border border-amber-400/50 shadow-sm'
                          : 'bg-purple-950/40 border border-transparent hover:bg-purple-900/40 hover:border-purple-400/30'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full bg-gradient-to-br ${p.color} flex-shrink-0`} />
                      <span className={`text-[10px] font-semibold truncate ${
                        selectedPlanet?.id === p.id ? 'text-amber-300' : 'text-purple-200/80'
                      }`}>
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Speed Control ── */}
              <div className="rounded-2xl border border-purple-500/20 bg-[#120a2a]/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200/70 mb-2">Kecepatan Rotasi</p>
                <div className="flex gap-2">
                  {SPEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSpeed(opt.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                        speed === opt.value
                          ? 'bg-purple-600/40 border border-purple-400/60 text-white shadow-sm'
                          : 'bg-purple-950/40 border border-transparent text-purple-200/60 hover:bg-purple-900/40 hover:text-white'
                      }`}
                    >
                      <Icon icon={opt.icon} className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Toggles ── */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRotating(!isRotating)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold transition-all duration-200 cursor-pointer border ${
                    isRotating
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-400/30 text-rose-300/80'
                  }`}
                >
                  <Icon icon={isRotating ? 'lucide:pause' : 'lucide:play'} className="h-3.5 w-3.5" />
                  {isRotating ? 'Jeda' : 'Putar'}
                </button>

                <button
                  type="button"
                  onClick={() => setHeatSun(!heatSun)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold transition-all duration-200 cursor-pointer border ${
                    heatSun
                      ? 'bg-orange-500/25 border-orange-400/50 text-orange-300'
                      : 'bg-purple-950/40 border-purple-500/20 text-purple-200/60 hover:text-white'
                  }`}
                >
                  <Icon icon="lucide:flame" className="h-3.5 w-3.5" />
                  Panas
                </button>

                <button
                  type="button"
                  onClick={() => setShowGravity(!showGravity)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold transition-all duration-200 cursor-pointer border ${
                    showGravity
                      ? 'bg-cyan-500/25 border-cyan-400/50 text-cyan-300'
                      : 'bg-purple-950/40 border-purple-500/20 text-purple-200/60 hover:text-white'
                  }`}
                >
                  <Icon icon="lucide:magnet" className="h-3.5 w-3.5" />
                  Gravitasi
                </button>
              </div>

              {/* ── CTA Button ── */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    navigate('/virtual-lab');
                  }
                }}
                className="group w-full rounded-2xl bg-amber-400 hover:bg-amber-300 py-3.5 px-5 text-sm font-extrabold text-slate-950 shadow-[0_6px_24px_rgba(250,204,21,0.35)] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(250,204,21,0.45)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  Buka Lab Sains Full 3D
                  <Icon icon="lucide:rocket" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  {!isAuthenticated && (
                    <span className="text-[10px] font-semibold text-slate-800/70">(Butuh Login)</span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
