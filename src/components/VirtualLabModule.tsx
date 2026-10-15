import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export type SidebarNavKey =
  | 'Beranda'
  | 'Misi Sains'
  | 'Lab Virtual'
  | 'Tantangan'
  | 'Peringkat';

export type StationId = 'water-cycle' | 'solar-system' | 'photosynthesis';
type QuestStep = 1 | 2 | 3;

export interface VirtualLabModuleProps {
  activeNav?: SidebarNavKey;
  initialStation?: StationId;
  starCount?: number;
  streakDays?: number;
  xpEarned?: number;
  levelProgressPercent?: number;
  onNavigateSidebar?: (nav: SidebarNavKey) => void;
  onSelectNav?: (nav: SidebarNavKey) => void;
  onBackToDashboard?: () => void;
  onAddReward?: (stars: number, xp: number, reason: string) => void;
  onSwitchToLanding3D?: () => void;
  hideSidebar?: boolean;
}
type ThermalAction = 'idle' | 'cooling' | 'heating';
type PlanetId = 'mars' | 'earth' | 'jupiter';

interface WaterParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  va: number; // angular velocity
  latticeX: number;
  latticeY: number;
  phaseOffset: number;
  state: 'liquid' | 'gas'; // whether airborne escaping as steam
}

interface SteamBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  wobbleOffset: number;
}

interface BoilingVapor {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  maxLife: number;
  life: number;
}

interface StationCatalogItem {
  id: StationId;
  code: string;
  title: string;
  subtitle: string;
  topic: string;
  icon: string;
  iconBg: string;
  accentText: string;
  rewardStars: number;
  rewardXp: number;
}

const STATION_CATALOG: StationCatalogItem[] = [
  {
    id: 'water-cycle',
    code: 'STASIUN 01',
    title: 'Panci Ajaib Air',
    subtitle: 'Eksperimen Siklus Air & Kalor',
    topic: 'Membeku, Mencair & Menguap',
    icon: 'solar:waterdrops-bold-duotone',
    iconBg: 'from-sky-500 via-blue-600 to-indigo-700',
    accentText: 'text-sky-600',
    rewardStars: 100,
    rewardXp: 50,
  },
  {
    id: 'solar-system',
    code: 'STASIUN 02',
    title: 'Gravitasi Planet',
    subtitle: 'Simulasi Orbit & Tarikan Galaksi',
    topic: 'Bumi, Mars & Raksasa Jupiter',
    icon: 'solar:planet-3-bold-duotone',
    iconBg: 'from-indigo-600 via-violet-600 to-purple-700',
    accentText: 'text-indigo-600',
    rewardStars: 100,
    rewardXp: 50,
  },
  {
    id: 'photosynthesis',
    code: 'STASIUN 03',
    title: 'Kebun Ajaib Sains',
    subtitle: 'Fotosintesis & Oksigen Tumbuhan',
    topic: 'Cahaya, Air & Udara CO₂',
    icon: 'solar:leaf-bold-duotone',
    iconBg: 'from-emerald-500 via-teal-600 to-indigo-700',
    accentText: 'text-emerald-600',
    rewardStars: 100,
    rewardXp: 50,
  },
];

const PLANET_CHOICES: Record<
  PlanetId,
  {
    id: PlanetId;
    name: string;
    emoji: string;
    gravity: number;
    tag: string;
    color: string;
    bgSoft: string;
    border: string;
    kidFact: string;
  }
> = {
  mars: {
    id: 'mars',
    name: 'Planet Mars',
    emoji: '🔴',
    gravity: 3.7,
    tag: 'Gravitasi Ringan',
    color: '#F97316',
    bgSoft: 'bg-orange-50/70',
    border: 'border-orange-200',
    kidFact: 'Di Mars gravitasi lebih ringan, sehingga bola melayang turun perlahan.',
  },
  earth: {
    id: 'earth',
    name: 'Planet Bumi',
    emoji: '🌍',
    gravity: 9.8,
    tag: 'Gravitasi Normal',
    color: '#0EA5E9',
    bgSoft: 'bg-sky-50/70',
    border: 'border-sky-200',
    kidFact: 'Di Bumi bola jatuh dengan percepatan gravitasi normal yang kita rasakan sehari-hari.',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Planet Jupiter',
    emoji: '🟠',
    gravity: 24.8,
    tag: 'Gravitasi Kuat',
    color: '#D97706',
    bgSoft: 'bg-amber-50/70',
    border: 'border-amber-200',
    kidFact: 'Jupiter berukuran raksasa, sehingga gaya tarik gravitasinya menarik bola sangat cepat.',
  },
};

export const VirtualLabModule: React.FC<VirtualLabModuleProps> = ({
  activeNav = 'Lab Virtual',
  initialStation = 'water-cycle',
  starCount = 1240,
  streakDays = 7,
  xpEarned = 120,
  levelProgressPercent = 40,
  onNavigateSidebar,
  onSelectNav,
  onBackToDashboard,
  onAddReward,
  onSwitchToLanding3D,
  hideSidebar = false,
}) => {
  // Active Experiment Station ('water-cycle' is default flagship station)
  const [selectedStation, setSelectedStation] = useState<StationId>(initialStation);

  useEffect(() => {
    if (initialStation) {
      setSelectedStation(initialStation);
    }
  }, [initialStation]);

  // Step-by-Step Guided Quest State (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState<QuestStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<QuestStep, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  // Mascot Voice Helper
  const [isMascotSpeaking, setIsMascotSpeaking] = useState<boolean>(false);

  // Adaptive Science Panel Mode: Audio Mode vs Reading Mode
  const [adaptiveMode, setAdaptiveMode] = useState<'audio' | 'reading'>('audio');

  const toggleSpeechAudio = (textToRead: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isMascotSpeaking) {
        window.speechSynthesis.cancel();
        setIsMascotSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        utterance.onend = () => setIsMascotSpeaking(false);
        utterance.onerror = () => setIsMascotSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsMascotSpeaking(true);
      }
    } else {
      setIsMascotSpeaking((prev) => !prev);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reward & Submission State
  const [showRewardPopup, setShowRewardPopup] = useState<boolean>(false);
  const [hasSubmittedDiscovery, setHasSubmittedDiscovery] = useState<boolean>(false);
  const [localAddedStars, setLocalAddedStars] = useState<number>(0);
  const [localAddedXp, setLocalAddedXp] = useState<number>(0);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  // ============================================================================
  // STATE EKSPERIMEN 1: PANCI AJAIB SAINS (SIKLUS AIR)
  // ============================================================================
  const [temperature, setTemperature] = useState<number>(20);
  const [thermalAction, setThermalAction] = useState<ThermalAction>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<WaterParticle[]>([]);
  const steamRef = useRef<SteamBubble[]>([]);
  const vaporsRef = useRef<BoilingVapor[]>([]);
  const temperatureRef = useRef<number>(temperature);

  useEffect(() => {
    temperatureRef.current = temperature;
  }, [temperature]);

  // ============================================================================
  // STATE EKSPERIMEN 2: GRAVITASI PLANET
  // ============================================================================
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId>('earth');
  const [dropState, setDropState] = useState<'idle' | 'dropping' | 'landed'>('idle');
  const [dropProgress, setDropProgress] = useState<number>(0);
  const [testedPlanets, setTestedPlanets] = useState<Record<PlanetId, boolean>>({
    earth: false,
    mars: false,
    jupiter: false,
  });

  // ============================================================================
  // STATE EKSPERIMEN 3: KEBUN AJAIB TUMBUHAN (FOTOSINTESIS)
  // ============================================================================
  const [sunLevel, setSunLevel] = useState<number>(20);
  const [waterLevel, setWaterLevel] = useState<number>(20);
  const [airCo2Level, setAirCo2Level] = useState<number>(20);

  const showToast = (msg: string) => {
    setToastFeedback(msg);
    window.setTimeout(() => {
      setToastFeedback((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  // Unified Sidebar Navigation Handler
  const handleSidebarMenuClick = (targetNav: SidebarNavKey) => {
    if (targetNav === 'Lab Virtual') {
      return;
    }
    if (onNavigateSidebar) {
      onNavigateSidebar(targetNav);
      return;
    }
    if (onSelectNav) {
      onSelectNav(targetNav);
      return;
    }
    if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  // Switch station from the Galaxy Station Catalog Card Grid
  const handleSelectStation = (station: StationId) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsMascotSpeaking(false);
    setSelectedStation(station);
    setCurrentStep(1);
    setCompletedSteps({ 1: false, 2: false, 3: false });
    setShowRewardPopup(false);
    setHasSubmittedDiscovery(false);
    setThermalAction('idle');
    if (station === 'water-cycle') {
      setTemperature(20);
    } else if (station === 'solar-system') {
      setSelectedPlanet('earth');
      setDropState('idle');
      setDropProgress(0);
      setTestedPlanets({ earth: false, mars: false, jupiter: false });
    } else if (station === 'photosynthesis') {
      setSunLevel(20);
      setWaterLevel(20);
      setAirCo2Level(20);
    }
  };

  // ============================================================================
  // STEP-BY-STEP QUEST EVALUATOR
  // ============================================================================
  useEffect(() => {
    if (selectedStation === 'water-cycle') {
      if (currentStep === 1 && temperature <= 0 && !completedSteps[1]) {
        setCompletedSteps((prev) => ({ ...prev, 1: true }));
        setThermalAction('idle');
        showToast('Langkah 1 berhasil! Air membeku menjadi es padat pada suhu ≤ 0°C.');
      }
      if (
        currentStep === 2 &&
        temperature >= 25 &&
        temperature <= 99 &&
        !completedSteps[2]
      ) {
        setCompletedSteps((prev) => ({ ...prev, 2: true }));
        setThermalAction('idle');
        showToast('Langkah 2 berhasil! Es mencair menjadi air hangat yang bergerak bebas.');
      }
      if (currentStep === 3 && temperature >= 100 && !completedSteps[3]) {
        setCompletedSteps((prev) => ({ ...prev, 3: true }));
        setThermalAction('idle');
        setShowRewardPopup(true);
        showToast('Luar biasa! Air mendidih pada 100°C dan berubah menjadi uap awan.');
      }
    }
  }, [temperature, currentStep, completedSteps, selectedStation]);

  useEffect(() => {
    if (selectedStation === 'solar-system') {
      if (currentStep === 1 && testedPlanets.earth && !completedSteps[1]) {
        setCompletedSteps((prev) => ({ ...prev, 1: true }));
        showToast('Langkah 1 selesai! Kamu telah mengamati kecepatan jatuh bola di Bumi.');
      }
      if (currentStep === 2 && testedPlanets.mars && !completedSteps[2]) {
        setCompletedSteps((prev) => ({ ...prev, 2: true }));
        showToast('Langkah 2 selesai! Di Mars bola jatuh lebih lambat karena gravitasi ringan.');
      }
      if (currentStep === 3 && testedPlanets.jupiter && !completedSteps[3]) {
        setCompletedSteps((prev) => ({ ...prev, 3: true }));
        setShowRewardPopup(true);
        showToast('Langkah 3 selesai! Gravitasi Jupiter menarik bola dengan sangat cepat.');
      }
    }
  }, [testedPlanets, currentStep, completedSteps, selectedStation]);

  useEffect(() => {
    if (selectedStation === 'photosynthesis') {
      if (currentStep === 1 && sunLevel >= 75 && !completedSteps[1]) {
        setCompletedSteps((prev) => ({ ...prev, 1: true }));
        showToast('Langkah 1 selesai! Daun menyerap energi cahaya matahari yang cerah.');
      }
      if (currentStep === 2 && waterLevel >= 75 && !completedSteps[2]) {
        setCompletedSteps((prev) => ({ ...prev, 2: true }));
        showToast('Langkah 2 selesai! Akar tanaman menyerap air segar dengan optimal.');
      }
      if (
        currentStep === 3 &&
        sunLevel >= 75 &&
        waterLevel >= 75 &&
        airCo2Level >= 75 &&
        !completedSteps[3]
      ) {
        setCompletedSteps((prev) => ({ ...prev, 3: true }));
        setShowRewardPopup(true);
        showToast('Eksperimen tuntas! Bunga mekar dan menghasilkan gelembung Oksigen.');
      }
    }
  }, [sunLevel, waterLevel, airCo2Level, currentStep, completedSteps, selectedStation]);

  // Continuous thermal adjustment when Cooling or Heating is active
  useEffect(() => {
    if (thermalAction === 'idle') return;
    const interval = window.setInterval(() => {
      setTemperature((prev) => {
        if (thermalAction === 'heating') {
          return Math.min(110, prev + 3);
        } else {
          return Math.max(-10, prev - 3);
        }
      });
    }, 120);
    return () => window.clearInterval(interval);
  }, [thermalAction]);

  // Planet Gravity Drop Animation
  useEffect(() => {
    if (dropState !== 'dropping') return;
    const g = PLANET_CHOICES[selectedPlanet].gravity;
    const totalDurationMs = Math.max(450, Math.round(1800 * Math.sqrt(9.8 / g)));
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / totalDurationMs);
      const pos = Math.round(ratio * ratio * 100);
      setDropProgress(pos);

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDropState('landed');
        setTestedPlanets((prev) => ({ ...prev, [selectedPlanet]: true }));
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [dropState, selectedPlanet]);

  // ============================================================================
  // HTML5 CANVAS: PANCI AJAIB SAINS (SIKLUS AIR) - ULTRA-DYNAMIC SIMULATOR
  // ============================================================================
  useEffect(() => {
    if (selectedStation !== 'water-cycle') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensi & Area Panci
    const potLeft = 115;
    const potRight = 425;
    const potTop = 62;
    const potBottom = 276;
    const waterBaseTopY = 142; // batas permukaan air cair normal

    // 1. Inisialisasi Partikel Molekul H2O (32 molekul terdistribusi rapi di dalam kisi)
    if (particlesRef.current.length === 0) {
      const cols = 8;
      const rows = 4;
      const startX = 148;
      const startY = 172;
      const gapX = 34;
      const gapY = 28;
      const initial: WaterParticle[] = [];
      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lx = startX + c * gapX + (r % 2 === 1 ? 16 : 0);
          const ly = startY + r * gapY;
          initial.push({
            id: id++,
            x: lx,
            y: ly,
            vx: (Math.random() - 0.5) * 1.8,
            vy: (Math.random() - 0.5) * 1.8,
            radius: 10,
            angle: Math.random() * Math.PI * 2,
            va: (Math.random() - 0.5) * 0.05,
            latticeX: lx,
            latticeY: ly,
            phaseOffset: Math.random() * Math.PI * 2,
            state: 'liquid',
          });
        }
      }
      particlesRef.current = initial;
    }

    // 2. Inisialisasi Gelembung Air Mendidih
    if (steamRef.current.length === 0) {
      const bubbles: SteamBubble[] = [];
      for (let i = 0; i < 24; i++) {
        bubbles.push({
          id: i + 1,
          x: potLeft + 25 + Math.random() * (potRight - potLeft - 50),
          y: potBottom - 10 - Math.random() * 120,
          size: 4 + Math.random() * 8,
          speedY: 1.2 + Math.random() * 2.2,
          speedX: (Math.random() - 0.5) * 0.8,
          opacity: 0.3 + Math.random() * 0.6,
          wobbleOffset: Math.random() * Math.PI * 2,
        });
      }
      steamRef.current = bubbles;
    }

    // 3. Inisialisasi Partikel Kabut Uap Hangat / Panas
    if (vaporsRef.current.length === 0) {
      const vapors: BoilingVapor[] = [];
      for (let i = 0; i < 28; i++) {
        vapors.push({
          id: i + 1,
          x: potLeft + 30 + Math.random() * (potRight - potLeft - 60),
          y: potTop - 10 - Math.random() * 50,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -(0.8 + Math.random() * 1.5),
          radius: 12 + Math.random() * 16,
          opacity: 0.15 + Math.random() * 0.35,
          maxLife: 70 + Math.random() * 60,
          life: Math.random() * 60,
        });
      }
      vaporsRef.current = vapors;
    }

    let animId = 0;
    let frame = 0;

    const render = () => {
      frame++;
      const temp = temperatureRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ======================================================================
      // 1. LATAR BELAKANG LABORATORIUM DINAMIS & EFEK RADIASI KALOR
      // ======================================================================
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (temp <= 0) {
        skyGrad.addColorStop(0, '#EFF6FF');
        skyGrad.addColorStop(0.6, '#DBEAFE');
        skyGrad.addColorStop(1, '#BFDBFE');
      } else if (temp < 100) {
        const warmFactor = Math.min(1, Math.max(0, (temp - 20) / 80));
        skyGrad.addColorStop(0, '#F8FAFC');
        skyGrad.addColorStop(1, warmFactor > 0.4 ? '#FFF7ED' : '#EFF6FF');
      } else {
        skyGrad.addColorStop(0, '#FFFBEB');
        skyGrad.addColorStop(0.5, '#FEF3C7');
        skyGrad.addColorStop(1, '#FED7AA');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Efek Grid Garis Lab Sains Halus
      ctx.strokeStyle = temp <= 0 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      for (let gx = 36; gx < canvas.width; gx += 36) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
        ctx.stroke();
      }
      for (let gy = 36; gy < canvas.height; gy += 36) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(canvas.width, gy);
        ctx.stroke();
      }

      // ======================================================================
      // 2. TUNGKU / PEMANAS ELEKTRONIK & KRISTAL PENDINGIN
      // ======================================================================
      // Landasan tungku tahan panas
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.roundRect(135, potBottom + 8, 270, 16, 8);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(145, potBottom + 9, 250, 4, 2);
      ctx.fill();

      // Indikator Elemen Tungku / Kompor
      if (temp <= 0) {
        // Efek modul pendingin kriogenik (Frost Crystal Plate)
        for (let i = 0; i < 7; i++) {
          const cx = 156 + i * 34;
          const cy = potBottom - 1;
          const shimmer = Math.sin(frame * 0.1 + i) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(56, 189, 248, ${0.75 * shimmer})`;
          ctx.beginPath();
          ctx.roundRect(cx, cy, 24, 10, 4);
          ctx.fill();

          // Aksen bunga es kristal kecil
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(cx + 12, cy + 5, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (temp > 15) {
        // NYALA API PEMANAS MULTI-LAYER (Interaktif Mengikuti Suhu)
        // Semakin panas, api semakin besar, bergetar kencang, dan menyala terang
        const flameIntensity = Math.min(1.4, Math.max(0.15, (temp - 10) / 90));
        const flameCount = 9;
        const flickerSpeed = 0.2 + flameIntensity * 0.35;

        for (let i = 0; i < flameCount; i++) {
          const fx = 158 + i * 28;
          const flicker = Math.sin(frame * flickerSpeed + i * 1.5) * (3 + flameIntensity * 5);
          const fh = 8 + flameIntensity * 22 + flicker;

          // Lapisan Api Luar (Oranye/Merah)
          const fGrad = ctx.createRadialGradient(
            fx,
            potBottom + 5,
            2,
            fx,
            potBottom - fh * 0.45,
            fh + 4
          );
          fGrad.addColorStop(0, '#FEF08A');
          fGrad.addColorStop(0.35, '#FB923C');
          fGrad.addColorStop(0.7, '#EF4444');
          fGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.ellipse(fx, potBottom + 4, 12 * flameIntensity, fh, 0, 0, Math.PI * 2);
          ctx.fill();

          // Lapisan Api Inti Biru/Kuning Panas (Intense Core)
          if (temp >= 50) {
            ctx.fillStyle = temp >= 90 ? 'rgba(96, 165, 250, 0.9)' : 'rgba(254, 240, 138, 0.95)';
            ctx.beginPath();
            ctx.ellipse(fx, potBottom + 3, 4, fh * 0.38, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ======================================================================
      // 3. WADAH PANCI / BEAKER KACA SAINS TRANSPARAN
      // ======================================================================
      // Pegangan Panci Kiri & Kanan (Anti-Panas dengan Silikon Pegangan)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(potLeft - 4, 120, 16, Math.PI * 0.45, Math.PI * 1.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(potRight + 4, 120, 16, -Math.PI * 0.55, Math.PI * 0.55);
      ctx.stroke();

      // Badan Kaca Beaker (Glassmorphism Effect)
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.strokeStyle =
        temp <= 0
          ? '#0284C7'
          : temp >= 100
          ? '#F97316'
          : temp > 50
          ? '#6366F1'
          : '#3B82F6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(potLeft, potTop, potRight - potLeft, potBottom - potTop, [
        12,
        12,
        34,
        34,
      ]);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Skala Ukuran Mililiter (Measurement Grids di Dinding Beaker)
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
      ctx.lineWidth = 1.5;
      for (let ty = potTop + 35; ty <= potBottom - 30; ty += 30) {
        ctx.beginPath();
        ctx.moveTo(potRight - 22, ty);
        ctx.lineTo(potRight - 10, ty);
        ctx.stroke();
      }

      // Kilau Refleksi Kaca Beaker Kiri
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(potLeft + 12, potTop + 24);
      ctx.lineTo(potLeft + 12, potBottom - 36);
      ctx.stroke();

      // ======================================================================
      // 4. MASSA FLUIDA: ES BEKU vs AIR BERGELOMBANG vs AIR MENDIDIH
      // ======================================================================
      if (temp <= 0) {
        // Balok Es Kristal Padat Membeku (Rigid Ice Block)
        const iceGrad = ctx.createLinearGradient(0, 140, 0, potBottom - 6);
        iceGrad.addColorStop(0, 'rgba(186, 230, 253, 0.90)');
        iceGrad.addColorStop(0.5, 'rgba(125, 211, 252, 0.92)');
        iceGrad.addColorStop(1, 'rgba(56, 189, 248, 0.88)');
        ctx.fillStyle = iceGrad;
        ctx.beginPath();
        ctx.roundRect(potLeft + 16, 142, potRight - potLeft - 32, 128, 22);
        ctx.fill();

        // Border Kristal Es Bercahaya Dingin
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Pola Retakan Kristal Es Transparan yang Indah
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(potLeft + 60, 160);
        ctx.lineTo(potLeft + 90, 185);
        ctx.lineTo(potLeft + 130, 175);
        ctx.moveTo(potRight - 80, 170);
        ctx.lineTo(potRight - 110, 195);
        ctx.stroke();
      } else {
        // Air Cair: Permukaan Bergoyang Halus (Tergantung Panas)
        const waveFreq = 0.08 + (temp / 100) * 0.16;
        const waveAmp = temp >= 100 ? 5.5 : 1.5 + (temp / 100) * 2.8;
        const waterTopY = temp >= 100 ? waterBaseTopY + 4 : waterBaseTopY;

        ctx.save();
        const liqGrad = ctx.createLinearGradient(0, waterTopY, 0, potBottom - 4);
        if (temp < 100) {
          const warmTint = Math.min(1, Math.max(0, (temp - 30) / 70));
          liqGrad.addColorStop(
            0,
            warmTint > 0.5 ? 'rgba(96, 165, 250, 0.38)' : 'rgba(56, 189, 248, 0.32)'
          );
          liqGrad.addColorStop(
            1,
            warmTint > 0.5 ? 'rgba(37, 99, 235, 0.58)' : 'rgba(14, 165, 233, 0.55)'
          );
        } else {
          // Saat 100°C mendidih, air bergolak energik
          liqGrad.addColorStop(0, 'rgba(251, 146, 60, 0.32)');
          liqGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.42)');
          liqGrad.addColorStop(1, 'rgba(14, 165, 233, 0.60)');
        }
        ctx.fillStyle = liqGrad;

        // Path Air Bergoyang Permukaannya
        ctx.beginPath();
        ctx.moveTo(potLeft + 6, potBottom - 18);
        ctx.lineTo(potLeft + 6, waterTopY);

        const segments = 16;
        const segWidth = (potRight - potLeft - 12) / segments;
        for (let s = 0; s <= segments; s++) {
          const sx = potLeft + 6 + s * segWidth;
          const sy = waterTopY + Math.sin(frame * waveFreq + s * 0.8) * waveAmp;
          ctx.lineTo(sx, sy);
        }

        ctx.lineTo(potRight - 6, potBottom - 18);
        ctx.arcTo(potRight - 6, potBottom - 4, potRight - 26, potBottom - 4, 26);
        ctx.lineTo(potLeft + 26, potBottom - 4);
        ctx.arcTo(potLeft + 6, potBottom - 4, potLeft + 6, potBottom - 26, 26);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // ======================================================================
      // 5. GELEMBUNG UDARA & AIR MENDIDIH DI DASAR PANCI
      // ======================================================================
      if (temp >= 40) {
        const bubbleSpeedMultiplier = temp >= 100 ? 2.4 : 0.8 + ((temp - 40) / 60) * 1.2;
        const activeCount = temp >= 100 ? steamRef.current.length : Math.round(steamRef.current.length * ((temp - 30) / 70));

        for (let i = 0; i < activeCount; i++) {
          const b = steamRef.current[i];
          b.y -= b.speedY * bubbleSpeedMultiplier;
          b.x += Math.sin(frame * 0.12 + b.wobbleOffset) * (0.8 + bubbleSpeedMultiplier * 0.4);

          // Jika sampai di permukaan air, meletus/reset ke dasar
          if (b.y < waterBaseTopY - 2) {
            b.y = potBottom - 12 - Math.random() * 20;
            b.x = potLeft + 25 + Math.random() * (potRight - potLeft - 50);
          }

          ctx.save();
          ctx.fillStyle =
            temp >= 100
              ? `rgba(255, 255, 255, ${Math.min(0.95, b.opacity + 0.3)})`
              : `rgba(224, 242, 254, ${b.opacity * 0.75})`;
          ctx.strokeStyle = temp >= 100 ? 'rgba(249, 115, 22, 0.45)' : 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(b.x, b.y, temp >= 100 ? b.size * 1.15 : b.size * 0.85, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Kilau gelembung udara kecil
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, Math.max(1, b.size * 0.28), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // ======================================================================
      // 6. UAP AIR (STEAM VAPOR & AWAN MENGEMBUN) KETIKA PANAS (≥ 70°C & 100°C)
      // ======================================================================
      if (temp >= 65) {
        const vaporSpeedFactor = temp >= 100 ? 1.8 : 0.9;
        const currentVapors = vaporsRef.current;

        currentVapors.forEach((v) => {
          v.y += v.vy * vaporSpeedFactor;
          v.x += v.vx + Math.sin(frame * 0.05 + v.id) * 0.4;
          v.life += 1;

          // Siklus hidup kabut uap yang halus
          const lifeProgress = v.life / v.maxLife;
          const currentRadius = v.radius * (1 + lifeProgress * 0.8);
          let currentOpacity = v.opacity * (1 - lifeProgress);
          if (temp < 100) currentOpacity *= 0.6;

          if (v.life >= v.maxLife || v.y < 12) {
            v.life = 0;
            v.y = potTop + 10 + Math.random() * 20;
            v.x = potLeft + 35 + Math.random() * (potRight - potLeft - 70);
            v.radius = 12 + Math.random() * 16;
          }

          ctx.save();
          const vGrad = ctx.createRadialGradient(
            v.x,
            v.y,
            2,
            v.x,
            v.y,
            currentRadius
          );
          vGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.85, currentOpacity * 1.4)})`);
          vGrad.addColorStop(0.6, `rgba(224, 242, 254, ${currentOpacity * 0.8})`);
          vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = vGrad;
          ctx.beginPath();
          ctx.arc(v.x, v.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Banner Awan Mengembun di Langit Atas Saat Mendidih (100°C)
        if (temp >= 100) {
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(225, 30, 20, 0, Math.PI * 2);
          ctx.arc(260, 24, 26, 0, Math.PI * 2);
          ctx.arc(298, 30, 21, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#1E293B';
          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('☁️ Uap Air Menguap ke Udara', 262, 32);
          ctx.restore();
        }
      }

      // ======================================================================
      // 7. STRUKTUR MOLEKUL AIR (H2O) DENGAN KISI KRISTAL ES & DINAMIKA KINETIK
      // ======================================================================
      const particles = particlesRef.current;

      // KONDISI MEMBEKU (<= 0°C): Hubungan Ikatan Hidrogen / Kisi Kristal Es
      if (temp <= 0) {
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.55)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 44) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();

              // Titik ikatan hidrogen di tengah garis
              ctx.fillStyle = '#BAE6FD';
              ctx.beginPath();
              ctx.arc((particles[i].x + particles[j].x) / 2, (particles[i].y + particles[j].y) / 2, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // UPDATE POSISI DAN PERGERAKAN MASING-MASING MOLEKUL H2O
      particles.forEach((p, idx) => {
        if (temp <= 0) {
          // <= 0°C: Molekul terkunci dalam kisi (Lattice), hanya getaran mikro lambat (Shiver)
          const microSpeed = 0.35;
          const shiverX = Math.sin(frame * microSpeed + p.phaseOffset) * 1.1;
          const shiverY = Math.cos(frame * microSpeed + p.phaseOffset) * 1.1;
          p.x += (p.latticeX - p.x) * 0.25 + shiverX;
          p.y += (p.latticeY - p.y) * 0.25 + shiverY;
          p.angle = Math.sin(frame * 0.1 + p.phaseOffset) * 0.15;
        } else if (temp < 100) {
          // 1°C - 99°C: Molekul bebas bergerak & bertumbukan (Kecepatan berbanding lurus dengan suhu)
          // Suhu naik -> kinetik meningkat secara real-time
          const speedMultiplier = 0.6 + (temp / 100) * 2.8;
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;
          p.angle += p.va * speedMultiplier * 1.5;

          const minX = potLeft + 22;
          const maxX = potRight - 22;
          const minY = waterBaseTopY + 10;
          const maxY = potBottom - 16;

          // Pantulan elastis dengan dinding wadah
          if (p.x < minX) {
            p.x = minX;
            p.vx = Math.abs(p.vx);
          } else if (p.x > maxX) {
            p.x = maxX;
            p.vx = -Math.abs(p.vx);
          }

          if (p.y < minY) {
            p.y = minY;
            p.vy = Math.abs(p.vy);
          } else if (p.y > maxY) {
            p.y = maxY;
            p.vy = -Math.abs(p.vy);
          }
        } else {
          // ≥ 100°C: Mendidih, energi kinetik super tinggi & molekul membubung ke atas (Gas)
          const gasSpeed = 3.6;
          p.x += p.vx * gasSpeed;
          p.y += p.vy * gasSpeed - 0.75; // dorongan termal ke atas
          p.angle += p.va * 3.5;

          const minX = potLeft + 20;
          const maxX = potRight - 20;
          const minY = 38;
          const maxY = potBottom - 16;

          if (p.x < minX) {
            p.x = minX;
            p.vx = Math.abs(p.vx);
          } else if (p.x > maxX) {
            p.x = maxX;
            p.vx = -Math.abs(p.vx);
          }

          // Siklus uap: jika molekul sudah terbang ke langit-langit wadah, ia mengembun & turun lagi
          if (p.y < minY) {
            p.y = potBottom - 18;
            p.vy = -(1.2 + Math.random() * 1.5);
            p.x = potLeft + 30 + Math.random() * (potRight - potLeft - 60);
          } else if (p.y > maxY) {
            p.y = maxY;
            p.vy = -Math.abs(p.vy);
          }
        }

        // ====================================================================
        // RENDER DETAIL MOLEKUL AIR (H2O: 1 Atom Oksigen + 2 Atom Hidrogen)
        // ====================================================================
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // 1. Dua Atom Hidrogen (H) Kecil di Atas Atom Oksigen
        const hDistance = 8.5;
        const hAngle1 = Math.PI * 0.35;
        const hAngle2 = Math.PI * 0.65;
        const h1x = Math.cos(hAngle1) * hDistance;
        const h1y = -Math.sin(hAngle1) * hDistance;
        const h2x = -Math.cos(hAngle1) * hDistance;
        const h2y = -Math.sin(hAngle1) * hDistance;

        // Ikatan Kovalen Atom (Garis Penghubung Oksigen ke Hidrogen)
        ctx.strokeStyle = temp <= 0 ? '#93C5FD' : temp >= 100 ? '#FDBA74' : '#7DD3FC';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(h1x, h1y);
        ctx.moveTo(0, 0);
        ctx.lineTo(h2x, h2y);
        ctx.stroke();

        // Gambar Bola Hidrogen (H) Putih/Biru Lembut
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = temp <= 0 ? '#38BDF8' : temp >= 100 ? '#EA580C' : '#0284C7';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.arc(h1x, h1y, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(h2x, h2y, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 2. Atom Oksigen (O) Pusat yang Besar & Glowing
        const oGrad = ctx.createRadialGradient(-2.5, -2.5, 1, 0, 0, p.radius);
        if (temp <= 0) {
          oGrad.addColorStop(0, '#FFFFFF');
          oGrad.addColorStop(0.4, '#38BDF8');
          oGrad.addColorStop(1, '#0284C7');
        } else if (temp < 100) {
          const warmFactor = Math.min(1, Math.max(0, (temp - 25) / 75));
          oGrad.addColorStop(0, '#E0F2FE');
          oGrad.addColorStop(0.45, warmFactor > 0.5 ? '#38BDF8' : '#0EA5E9');
          oGrad.addColorStop(1, warmFactor > 0.5 ? '#2563EB' : '#0369A1');
        } else {
          // Sangat Panas (100°C) -> Warna Energi Kalor Tinggi (Merah/Oranye Kemilau)
          oGrad.addColorStop(0, '#FEF08A');
          oGrad.addColorStop(0.45, '#FB923C');
          oGrad.addColorStop(1, '#EA580C');
        }

        ctx.fillStyle = oGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Kilau Refleksi 3D pada Atom Oksigen
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(-2.5, -2.5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Karakter Senyum Wajah Ceria Ramah Anak pada Beberapa Molekul
        if (idx % 2 === 0) {
          ctx.fillStyle = temp >= 100 ? '#7C2D12' : '#0F172A';
          ctx.beginPath();
          // Dua Mata Lucu
          ctx.arc(-2.5, 0.5, 1.1, 0, Math.PI * 2);
          ctx.arc(2.5, 0.5, 1.1, 0, Math.PI * 2);
          ctx.fill();

          // Senyum Ceria
          ctx.strokeStyle = temp >= 100 ? '#7C2D12' : '#0F172A';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 2, 2.2, 0.2, Math.PI - 0.2);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Permintaan Frame Berikutnya Secara Mulus 60 FPS
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [selectedStation]);

  // ============================================================================
  // HANDLERS FOR CONTROLS & QUEST FLOW
  // ============================================================================
  const handleCoolClick = () => {
    setTemperature((prev) => Math.max(-10, prev - 10));
    setThermalAction((prev) => (prev === 'cooling' ? 'idle' : 'cooling'));
  };

  const handleHeatClick = () => {
    setTemperature((prev) => Math.min(110, prev + 15));
    setThermalAction((prev) => (prev === 'heating' ? 'idle' : 'heating'));
  };

  const handleResetExperiment = () => {
    setThermalAction('idle');
    setCurrentStep(1);
    setCompletedSteps({ 1: false, 2: false, 3: false });
    setShowRewardPopup(false);
    setHasSubmittedDiscovery(false);

    if (selectedStation === 'water-cycle') {
      setTemperature(20);
      showToast('Simulator direset ke kondisi awal (20°C). Silakan mulai dari Langkah 1.');
    } else if (selectedStation === 'solar-system') {
      setSelectedPlanet('earth');
      setDropState('idle');
      setDropProgress(0);
      setTestedPlanets({ earth: false, mars: false, jupiter: false });
      showToast('Simulasi Gravitasi direset ke Langkah 1.');
    } else {
      setSunLevel(20);
      setWaterLevel(20);
      setAirCo2Level(20);
      showToast('Simulasi Fotosintesis direset ke Langkah 1.');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && completedSteps[1]) {
      setCurrentStep(2);
      setThermalAction('idle');
    } else if (currentStep === 2 && completedSteps[2]) {
      setCurrentStep(3);
      setThermalAction('idle');
    }
  };

  const handleSubmitDiscoveryToCaptain = () => {
    if (hasSubmittedDiscovery) return;
    setHasSubmittedDiscovery(true);
    setLocalAddedStars((prev) => prev + 100);
    setLocalAddedXp((prev) => prev + 50);
    if (onAddReward) {
      onAddReward(100, 50, 'Penemuan Lab Virtual Selesai!');
    }
    showToast('Laporan penemuan diterima Kapten Bintang! +100 Bintang & +50 XP ditambahkan.');
  };

  // ============================================================================
  // DYNAMIC THEME & STEP DATA
  // ============================================================================
  const getThermometerTheme = () => {
    if (temperature <= 0) {
      return {
        bg: 'bg-sky-500',
        softBg: 'bg-sky-500/20',
        border: 'border-sky-300/40',
        text: 'text-sky-700',
        phaseLabel: 'Fase Padat (Membeku)',
        desc: 'Molekul air bergerak lambat dan tersusun rapat membentuk kristal es padat.',
      };
    }
    if (temperature < 100) {
      return {
        bg: 'bg-indigo-500',
        softBg: 'bg-indigo-500/20',
        border: 'border-indigo-300/40',
        text: 'text-indigo-700',
        phaseLabel: 'Fase Cair (Mencair & Hangat)',
        desc: 'Molekul air bergerak bebas dan saling mengalir di dalam wadah kaca.',
      };
    }
    return {
      bg: 'bg-orange-500',
      softBg: 'bg-orange-500/20',
      border: 'border-orange-300/40',
      text: 'text-orange-700',
      phaseLabel: 'Fase Gas (Mendidih & Menguap)',
      desc: 'Pada suhu 100°C, molekul air bergerak sangat cepat dan naik menjadi uap awan.',
    };
  };

  const thermoTheme = getThermometerTheme();

  const getStepQuestInfo = () => {
    if (selectedStation === 'water-cycle') {
      let dynamicTitle = '';
      let dynamicInstruction = '';
      let dynamicIsAchieved = false;

      if (currentStep === 1) {
        if (temperature <= 0) {
          dynamicTitle = 'Hore Kadet! Molekul Air Membeku! ❄️';
          dynamicInstruction = `Hebat Kadet Penjelajah 🚀! Pada suhu ${temperature}°C, molekul air kedinginan dan saling bergandengan erat membentuk es padat! Misi 1 berhasil, yuk lanjut ke Misi 2!`;
          dynamicIsAchieved = true;
        } else {
          dynamicTitle = 'Misi 1: Dinginkan Panci sampai 0°C 🧊';
          dynamicInstruction =
            'Ayo Kadet Penjelajah 🚀! Dinginkan Panci sampai 0°C untuk melihat molekul air kaku membeku. Klik tombol [Dinginkan] atau geser slider ke kiri!';
          dynamicIsAchieved = false;
        }
      } else if (currentStep === 2) {
        if (temperature <= 0) {
          dynamicTitle = 'Misi 2: Panaskan Panci & Cairkan Es! 💧';
          dynamicInstruction =
            'Es batu masih beku kaku, Kadet! Panaskan Panci! Perhatikan bagaimana molekul air mulai menari-nari dinamis saat suhunya naik (25°C – 99°C)! Klik [Panaskan] sekarang!';
          dynamicIsAchieved = false;
        } else if (temperature > 0 && temperature < 25) {
          dynamicTitle = 'Misi 2: Es Mulai Meleleh! 💧';
          dynamicInstruction =
            'Bagus sekali Kadet! Es mulai mencair, panaskan sedikit lagi sampai suhunya hangat di atas 25°C agar molekul air berenang bebas!';
          dynamicIsAchieved = false;
        } else if (temperature >= 25 && temperature <= 99) {
          dynamicTitle = 'Hebat Kadet! Air Hangat & Menari Bebas! 🌊';
          dynamicInstruction = `Asyik sekali Kadet Penjelajah 🚀! Es batunya sudah meleleh jadi air hangat (${temperature}°C). Molekul air mulai menari-nari dinamis dan berenang bebas! Misi 2 tuntas!`;
          dynamicIsAchieved = true;
        } else {
          dynamicTitle = 'Air Sangat Panas! Siap untuk Misi 3! 🔥';
          dynamicInstruction = `Airnya sudah mendidih (${temperature}°C)! Klik tombol Lanjut ke Langkah 3 untuk membuka misi perebusan uap awan!`;
          dynamicIsAchieved = true;
        }
      } else {
        if (temperature < 100) {
          dynamicTitle = 'Misi 3: Rebus Panci sampai 100°C! 🔥';
          dynamicInstruction =
            'Dorong suhunya terus sampai 100°C, Kadet Penjelajah 🚀! Saksikan bagaimana energi panas membuat molekul air melompat lepas dan terbang menjadi uap gas awan putih!';
          dynamicIsAchieved = false;
        } else {
          dynamicTitle = 'Misi 3 Selesai! Air Terbang Jadi Uap Gas! 🎈';
          dynamicInstruction =
            'Spektakuler Kadet Penjelajah 🚀! Pada suhu 100°C, air mendidih dan terbang jadi uap gas! Semua 3 misi tuntas! Ayo kirim hasil penemuanmu ke Kapten Bintang!';
          dynamicIsAchieved = true;
        }
      }

      const steps = [
        {
          step: 1 as QuestStep,
          shortLabel: 'Bekukan Air 🧊',
          subLabel: 'Target ≤ 0°C',
          title: 'Langkah 1: Rahasia Membeku Jadi Es Batu',
          instruction:
            'Dinginkan Panci sampai 0°C untuk melihat molekul air kaku membeku dan bergandengan erat.',
          successMsg:
            'Hore Kadet! Molekul air membeku kaku dan saling bergandengan erat! ❄️',
          targetBadge: 'Target: Suhu ≤ 0°C',
          quickHintAction: () => {
            setThermalAction('idle');
            setTemperature(-5);
          },
          quickHintLabel: 'Bekukan ke -5°C 🧊',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
        {
          step: 2 as QuestStep,
          shortLabel: 'Cairkan Air 💧',
          subLabel: 'Target 25°C–99°C',
          title: 'Langkah 2: Menari Jadi Air Hangat',
          instruction:
            'Panaskan Panci! Perhatikan bagaimana molekul air mulai menari-nari dinamis saat suhunya naik.',
          successMsg:
            'Hebat Kadet! Es mencair jadi air hangat dan molekulnya berenang lincah! 🌊',
          targetBadge: 'Target: 25°C – 99°C',
          quickHintAction: () => {
            setThermalAction('idle');
            setTemperature(55);
          },
          quickHintLabel: 'Hangatkan ke 55°C 💧',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
        {
          step: 3 as QuestStep,
          shortLabel: 'Rebus Jadi Uap ☁️',
          subLabel: 'Target 100°C',
          title: 'Langkah 3: Terbang Menjadi Uap Awan',
          instruction:
            'Rebus Panci sampai 100°C! Saksikan air mendidih dan terbang jadi uap gas awan putih.',
          successMsg:
            'Misi 3 Selesai! Air mendidih dan terbang jadi uap gas! 🎈',
          targetBadge: 'Target: Suhu 100°C',
          quickHintAction: () => {
            setThermalAction('idle');
            setTemperature(100);
          },
          quickHintLabel: 'Rebus ke 100°C 🔥',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
      ];

      return {
        stationCode: 'STASIUN EKSPERIMEN 01',
        stationTitle: 'Panci Ajaib Sains · Siklus Air & Kalor',
        stationDesc: 'Eksplorasi perubahan wujud molekul air: Padat, Cair, dan Gas.',
        audioNarration:
          'Halo Kadet Penjelajah 🚀! Kapten Bintang di sini! Air adalah zat paling ajaib di alam semesta. Saat kedinginan di bawah 0°C, molekul air saling berpegangan tangan erat jadi es padat. Saat kita hangatkan, pegangannya lepas dan mereka menari lincah jadi air cair. Dan saat mencapai 100°C, wuuush! Mereka melompat terbang ke angkasa jadi uap awan putih! Coba buktikan sendiri di panci ajaibmu!',
        funFacts: [
          {
            icon: '🧊',
            title: 'Rahasia Es Mengapung',
            desc: 'Saat air membeku jadi es, molekulnya saling bergandengan membentuk struktur berongga udara tersembunyi. Itu kenapa es jadi lebih ringan dan mengapung di atas air!',
          },
          {
            icon: '💧',
            title: 'Tarian Molekul Air',
            desc: 'Makin hangat suhunya, molekul air makin bersemangat menari dan berenang lincah ke sana ke mari di dalam wadah!',
          },
          {
            icon: '☁️',
            title: 'Terbang Jadi Uap Awan',
            desc: 'Pada suhu didih 100°C, molekul air melompat lepas dari panci dan terbang bebas membubung jadi awan di langit!',
          },
          {
            icon: '🌦️',
            title: 'Siklus Hujan Bumi',
            desc: 'Uap air yang terbang tinggi akan kedinginan di langit, mengembun jadi awan tebal, lalu turun kembali sebagai air hujan yang menyegarkan!',
          },
        ],
        steps,
        active: steps[currentStep - 1],
      };
    }

    if (selectedStation === 'solar-system') {
      let dynamicTitle = '';
      let dynamicInstruction = '';
      let dynamicIsAchieved = false;

      if (currentStep === 1) {
        if (selectedPlanet === 'earth' && dropState === 'landed') {
          dynamicTitle = 'Hebat Kadet! Gravitasi Bumi Pas Banget! 🌍✨';
          dynamicInstruction =
            'Bola mendarat dengan mantap! Di Bumi gravitasi 9.8 m/s² menahan kita, atmosfer, dan air laut agar tidak melayang kabur ke luar angkasa. Misi 1 tuntas!';
          dynamicIsAchieved = true;
        } else if (selectedPlanet === 'earth') {
          dynamicTitle = 'Misi 1: Uji Gravitasi Planet Bumi 🌍';
          dynamicInstruction =
            'Kadet Penjelajah 🚀, klik tombol [Jatuhkan Bola] untuk melihat seberapa cepat gravitasi Bumi (9.8 m/s²) menarik bola di rumah kita!';
          dynamicIsAchieved = false;
        } else {
          dynamicTitle = 'Misi 1: Pilih Planet Bumi Dulu Yuk 🌍';
          dynamicInstruction =
            'Ayo Kadet, pilih tombol Planet Bumi di bawah untuk menyelesaikan misi pertama gravitasi rumah kita!';
          dynamicIsAchieved = false;
        }
      } else if (currentStep === 2) {
        if (selectedPlanet === 'mars' && dropState === 'landed') {
          dynamicTitle = 'Melayang di Planet Mars! 🔴🎈 Misi 2 Tuntas!';
          dynamicInstruction =
            'Lucu sekali Kadet! Karena planet Mars lebih kecil, gravitasinya cuma 3.7 m/s². Bola jatuh lambat seperti melayang ditiup angin! Misi 2 berhasil!';
          dynamicIsAchieved = true;
        } else if (selectedPlanet === 'mars') {
          dynamicTitle = 'Misi 2: Jatuhkan Bola di Mars! 🔴';
          dynamicInstruction =
            'Kamu sudah di Planet Mars! Klik [Jatuhkan Bola] dan perhatikan apakah gerak jatuhnya lebih lambat dan melayang!';
          dynamicIsAchieved = false;
        } else {
          dynamicTitle = 'Misi 2: Pindah ke Planet Mars 🔴';
          dynamicInstruction =
            'Ayo Kadet, pilih kartu Planet Mars di bawah untuk membandingkan gravitasinya dengan Bumi!';
          dynamicIsAchieved = false;
        }
      } else {
        if (selectedPlanet === 'jupiter' && dropState === 'landed') {
          dynamicTitle = 'Wuuush Super Cepat! Monster Jupiter 🟠⚡';
          dynamicInstruction =
            'Dahsyat sekali Kadet Penjelajah 🚀! Gravitasi raksasa Jupiter 24.8 m/s² menarik bola secepat kilat! Ketiga planet berhasil kamu teliti!';
          dynamicIsAchieved = true;
        } else if (selectedPlanet === 'jupiter') {
          dynamicTitle = 'Misi 3: Tantang Gravitasi Jupiter! 🟠';
          dynamicInstruction =
            'Kamu sudah di Planet Monster Jupiter! Klik [Jatuhkan Bola] dan rasakan tarikan gravitasi terkuat di tata surya!';
          dynamicIsAchieved = false;
        } else {
          dynamicTitle = 'Misi 3: Mendarat di Jupiter 🟠';
          dynamicInstruction =
            'Ayo Kadet, klik kartu Planet Jupiter di bawah untuk membuka misi gravitasi raksasa!';
          dynamicIsAchieved = false;
        }
      }

      const steps = [
        {
          step: 1 as QuestStep,
          shortLabel: 'Gravitasi Bumi 🌍',
          subLabel: 'Tarikan 9.8 m/s²',
          title: 'Langkah 1: Menakar Gravitasi Rumah Bumi',
          instruction:
            'Pilih Planet Bumi lalu klik [Jatuhkan Bola] untuk mengamati tarikan gravitasi standar kita.',
          successMsg:
            'Pengamatan Langkah 1 berhasil! Di Bumi bola ditarik kecepatan gravitasi normal 9.8 m/s²! 🌍✨',
          targetBadge: 'Target: Uji di Bumi',
          quickHintAction: () => {
            setSelectedPlanet('earth');
            setDropProgress(0);
            setDropState('dropping');
          },
          quickHintLabel: 'Jatuhkan Bola di Bumi 🌍',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
        {
          step: 2 as QuestStep,
          shortLabel: 'Gravitasi Mars 🔴',
          subLabel: 'Ringan 3.7 m/s²',
          title: 'Langkah 2: Melayang di Planet Merah Mars',
          instruction:
            'Pilih Planet Mars lalu jatuhkan bola untuk melihat gravitasi ringan yang membuat bola melayang perlahan.',
          successMsg:
            'Waaah Melayang! Karena Mars lebih kecil, gravitasinya ringan dan bola turun lambat seperti bulu! 🔴🎈',
          targetBadge: 'Target: Uji di Mars',
          quickHintAction: () => {
            setSelectedPlanet('mars');
            setDropProgress(0);
            setDropState('dropping');
          },
          quickHintLabel: 'Jatuhkan Bola di Mars 🔴',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
        {
          step: 3 as QuestStep,
          shortLabel: 'Raksasa Jupiter 🟠',
          subLabel: 'Super 24.8 m/s²',
          title: 'Langkah 3: Tarikan Magnetik Raksasa Jupiter',
          instruction:
            'Terakhir, pilih Planet Jupiter dan jatuhkan bola untuk merasakan tarikan raksasa terkuat di tata surya!',
          successMsg:
            'Wuuush Cepat Sekali! Gravitasi raksasa Jupiter menarik bola secepat kilat! ⚡🎉',
          targetBadge: 'Target: Uji di Jupiter',
          quickHintAction: () => {
            setSelectedPlanet('jupiter');
            setDropProgress(0);
            setDropState('dropping');
          },
          quickHintLabel: 'Jatuhkan Bola di Jupiter 🟠',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
      ];

      return {
        stationCode: 'STASIUN EKSPERIMEN 02',
        stationTitle: 'Tata Surya & Perbandingan Gravitasi Planet',
        stationDesc: 'Bandingkan waktu jatuh benda di Bumi, Mars, dan planet monster Jupiter.',
        audioNarration:
          'Laporan dari Kapten Bintang untuk Kadet Penjelajah 🚀! Setiap planet punya kekuatan gravitasi berbeda-beda tergantung seberapa besar ukurannya. Di Mars kamu akan merasa ringan seperti balon, di Bumi pas untuk hidup, sedangkan di Jupiter kamu akan ditarik super kuat seperti monster magnet raksasa! Ayo uji semuanya!',
        funFacts: [
          {
            icon: '🔴',
            title: 'Lompatan Super di Mars',
            desc: 'Gravitasi Mars hanya sepertiga Bumi! Jika di Bumi kamu bisa melompat setinggi 50 cm, di Mars kamu bisa melompat setinggi 1,5 meter!',
          },
          {
            icon: '🌍',
            title: 'Gravitasi Pas di Bumi',
            desc: 'Tarikan gravitasi Bumi (9.8 m/s²) pas sekali untuk menahan atmosfer dan udara agar kita bisa bernapas nyaman tanpa helm astronot!',
          },
          {
            icon: '🟠',
            title: 'Monster Raksasa Jupiter',
            desc: 'Jupiter memiliki volume 1.300 kali lipat Bumi! Gravitasinya super kuat (24.8 m/s²) membuat berat badanmu terasa 2,5 kali lebih berat!',
          },
          {
            icon: '🛰️',
            title: 'Rahasia Orbit Satelit',
            desc: 'Satelit luar angkasa bisa melayang mengitari planet karena seimbangnya kecepatan terbang dengan gaya tarik gravitasi!',
          },
        ],
        steps,
        active: steps[currentStep - 1],
      };
    }

    // photosynthesis
    let dynamicTitle = '';
    let dynamicInstruction = '';
    let dynamicIsAchieved = false;

    if (currentStep === 1) {
      if (sunLevel >= 75) {
        dynamicTitle = 'Cahaya Berlimpah! Klorofil Aktif! ☀️🌿';
        dynamicInstruction = `Hore Kadet Penjelajah 🚀! Sinar matahari cerah (${sunLevel}%) menyinari daun. Klorofil siap memasak glukosa! Misi 1 tuntas!`;
        dynamicIsAchieved = true;
      } else {
        dynamicTitle = 'Misi 1: Berikan Sinar Matahari! ☀️';
        dynamicInstruction =
          'Kadet Penjelajah 🚀! Koki cilik di daun butuh cahaya untuk mulai memasak! Klik tombol [Tambah Cahaya] sampai minimal 75%!';
        dynamicIsAchieved = false;
      }
    } else if (currentStep === 2) {
      if (waterLevel >= 75) {
        dynamicTitle = 'Segarnya Air Diserap Akar! 💧🌱';
        dynamicInstruction = `Bagus sekali Kadet! Kelembapan air mencapai ${waterLevel}%. Air naik lewat pembuluh xilem menuju dapur daun. Misi 2 tuntas!`;
        dynamicIsAchieved = true;
      } else {
        dynamicTitle = 'Misi 2: Siram Air Segar ke Akar! 💧';
        dynamicInstruction =
          'Tanaman kehausan, Kadet! Klik [Siram Air] sampai minimal 75% agar akar bisa menyedot air tanah naik ke daun!';
        dynamicIsAchieved = false;
      }
    } else {
      if (airCo2Level >= 75 && sunLevel >= 75 && waterLevel >= 75) {
        dynamicTitle = 'Bunga Mekar & Oksigen Berlimpah! 🌸🫧';
        dynamicInstruction =
          'Waaah Luar Biasa Kadet Penjelajah 🚀! Bunga mekar indah dan melepaskan banyak gelembung gas Oksigen (O₂) bersih untuk kita hirup! Semua misi tuntas!';
        dynamicIsAchieved = true;
      } else {
        dynamicTitle = 'Misi 3: Beri Udara CO₂ untuk Memasak! 🌬️';
        dynamicInstruction =
          'Tinggal satu bahan lagi! Klik [Beri Udara CO₂] sampai minimal 75% supaya proses fotosintesis tuntas dan bunga mekar!';
        dynamicIsAchieved = false;
      }
    }

    const steps = [
      {
        step: 1 as QuestStep,
        shortLabel: 'Cahaya Surya ☀️',
        subLabel: 'Target ≥ 75%',
        title: 'Langkah 1: Menyalakan Dapur Matahari',
        instruction:
          'Berikan sinar matahari ke daun agar zat klorofil dapat menyerap energi untuk fotosintesis.',
        successMsg:
          'Langkah 1 selesai! Klorofil daun mulai aktif menyerap energi matahari! ☀️🌿',
        targetBadge: 'Target Cahaya: ≥ 75%',
        quickHintAction: () => setSunLevel(90),
        quickHintLabel: 'Beri Sinar 90% ☀️',
        dynamicTitle,
        dynamicInstruction,
        dynamicIsAchieved,
      },
      {
        step: 2 as QuestStep,
        shortLabel: 'Air & Mineral 💧',
        subLabel: 'Target ≥ 75%',
        title: 'Langkah 2: Sedotan Air Segar Akar',
        instruction:
          'Siram air segar hingga akar dapat menyedot air tanah naik lewat pembuluh xilem menuju daun.',
        successMsg:
          'Langkah 2 selesai! Air tanah naik lewat sedotan xilem menuju daun! 💧🌱',
        targetBadge: 'Target Air: ≥ 75%',
        quickHintAction: () => setWaterLevel(90),
        quickHintLabel: 'Siram Air 90% 💧',
        dynamicTitle,
        dynamicInstruction,
        dynamicIsAchieved,
      },
      {
        step: 3 as QuestStep,
        shortLabel: 'Udara CO₂ & O₂ 🌸',
        subLabel: 'Target ≥ 75%',
        title: 'Langkah 3: Memasak Oksigen Segar Bumi',
        instruction:
          'Beri udara CO₂ agar tanaman meracik makanan dan melepaskan gelembung Oksigen (O₂) segar untuk kita.',
        successMsg:
          'Bunga Mekar Indah! 🌸 Tanaman melepaskan banyak gelembung Oksigen (O₂) segar untuk kita hirup! 🫧🎉',
        targetBadge: 'Target CO₂: ≥ 75%',
        quickHintAction: () => {
          setSunLevel(90);
          setWaterLevel(90);
          setAirCo2Level(90);
        },
        quickHintLabel: 'Nutrisi Sempurna (90%) 🌸',
        dynamicTitle,
        dynamicInstruction,
        dynamicIsAchieved,
      },
    ];

    return {
      stationCode: 'STASIUN EKSPERIMEN 03',
      stationTitle: 'Kebun Ajaib · Simulasi Fotosintesis Tumbuhan',
      stationDesc: 'Bantu koki daun meramu sinar matahari, air, dan CO₂ menjadi Oksigen.',
      audioNarration:
        'Panggilan untuk Kadet Penjelajah 🚀! Tumbuhan adalah pahlawan super bumi! Mereka tidak punya kompor, tapi bisa memasak makanan sendiri menggunakan sinar matahari, air tanah, dan udara CO₂. Yang paling hebat, saat memasak, mereka memberi kita bonus gas Oksigen segar untuk bernapas! Hebat kan teman hijau kita?',
      funFacts: [
        {
          icon: '☀️',
          title: 'Koki Cilik di Daun',
          desc: 'Zat klorofil hijau di daun itu seperti koki cilik yang menangkap energi cahaya matahari untuk meracik makanan lezat (glukosa)!',
        },
        {
          icon: '💧',
          title: 'Sedotan Ajaib Akar',
          desc: 'Tanaman punya sedotan ajaib bernama pembuluh xilem yang mampu menyedot air tanah naik ke pucuk pohon setinggi puluhan meter!',
        },
        {
          icon: '🌬️',
          title: 'Menghisap Karbon Dioksida',
          desc: 'Daun memiliki lubang mulut mikroskopis bernama stomata untuk menghirup gas CO₂ dari udara di sekitarnya!',
        },
        {
          icon: '🌸',
          title: 'Hadiah Oksigen untuk Manusia',
          desc: 'Saat kenyang memasak makanannya sendiri, tumbuhan bermurah hati menghadiahkan gas Oksigen (O₂) segar untuk kita hirup setiap detik!',
        },
      ],
      steps,
      active: steps[currentStep - 1],
    };
  };

  const questInfo = getStepQuestInfo();
  const isCurrentStepDone = completedSteps[currentStep];
  const completedCount =
    (completedSteps[1] ? 1 : 0) +
    (completedSteps[2] ? 1 : 0) +
    (completedSteps[3] ? 1 : 0);
  const questProgressPercent = Math.round((completedCount / 3) * 100);
  const isAllStepsDone = completedSteps[1] && completedSteps[2] && completedSteps[3];
  const isPlantBlooming =
    sunLevel >= 75 && waterLevel >= 75 && airCo2Level >= 75;

  const displayedStars = starCount + localAddedStars;
  const displayedXp = xpEarned + localAddedXp;

  return (
    <div className="min-h-screen w-full bg-slate-100 text-[#0F172A] font-jakarta antialiased selection:bg-indigo-600 selection:text-white">
      {/* Subtle Floating Notification Toast */}
      {toastFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-950/95 text-white border border-indigo-400/40 shadow-[0_12px_30px_rgba(15,23,42,0.28)] backdrop-blur-md"
        >
          <Icon
            icon="solar:stars-minimalistic-bold-duotone"
            className="text-lg text-amber-400 shrink-0"
          />
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {toastFeedback}
          </span>
        </div>
      )}

      {/* =====================================================================
          1. SIDEBAR KIRI PUTIH BINTANG EDU (w-64, fixed di Desktop)
      ===================================================================== */}
      {!hideSidebar && (
        <aside
          aria-label="Sidebar Navigasi Utama Bintang Edu"
          className="relative z-30 w-full lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-white/95 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-slate-200/90 shadow-[4px_0_24px_rgba(15,23,42,0.04)] flex flex-col justify-between p-6 select-none text-[#0F172A]"
        >
        <div>
          {/* Logo Resmi Bintang Edu */}
          <div className="flex items-center justify-between lg:justify-start gap-3 pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#0EA5E9] p-1.5 shadow-[0_8px_20px_rgba(99,102,241,0.25),inset_0_2px_4px_rgba(255,255,255,0.45)] border-2 border-white">
                <svg
                  viewBox="0 0 64 64"
                  className="h-9 w-9 drop-shadow-sm"
                  aria-label="Logo Bintang Edu"
                >
                  <path
                    d="M10 46 Q21 41 32 47 Q43 41 54 46 L54 55 Q43 50 32 56 Q21 50 10 55 Z"
                    fill="#38BDF8"
                  />
                  <path
                    d="M12 43 Q22 38 32 44 Q42 38 52 43 L52 51 Q42 46 32 52 Q22 46 12 51 Z"
                    fill="#FFFFFF"
                  />
                  <line
                    x1="32"
                    y1="44"
                    x2="32"
                    y2="55"
                    stroke="#0EA5E9"
                    strokeWidth="2"
                  />
                  <path
                    d="M32 14 L36.8 24.2 L48 25.6 L39.8 33.4 L41.9 44.5 L32 39.2 L22.1 44.5 L24.2 33.4 L16 25.6 L27.2 24.2 Z"
                    fill="#FACC15"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="28.5" cy="29" r="1.7" fill="#0F172A" />
                  <circle cx="35.5" cy="29" r="1.7" fill="#0F172A" />
                  <path
                    d="M29 33 Q32 35.8 35 33"
                    stroke="#0F172A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <polygon
                    points="32,6 16,13 32,19 48,13"
                    fill="#0F172A"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                  />
                  <rect x="24" y="16" width="16" height="4" rx="1.5" fill="#1E293B" />
                  <path
                    d="M44 14.5 L46 23"
                    stroke="#FACC15"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="46" cy="24" r="2" fill="#F59E0B" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-[#0F172A] leading-none">
                    <span className="text-[#0F172A]">Bintang</span>{' '}
                    <span className="text-[#0284C7]">Edu</span>
                  </span>
                  <span className="rounded-md bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-[10px] font-extrabold text-[#4F46E5]">
                    M-ONE
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-[#64748B]">
                  Eksplorasi Sains Galaksi SD
                </p>
              </div>
            </div>

            <div className="flex lg:hidden items-center gap-2 text-xs font-extrabold text-slate-700 tabular-nums">
              <span>⭐ {displayedStars.toLocaleString('en-US')}</span>
              <span>·</span>
              <span>🔥 {streakDays}h</span>
            </div>
          </div>

          {/* Menu Navigasi Utama Sidebar */}
          <div className="mt-6">
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2.5">
              Navigasi Utama Galaksi
            </p>
            <nav
              aria-label="Menu Navigasi Utama"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5"
            >
              {(
                [
                  {
                    key: 'Beranda',
                    icon: 'solar:home-smile-bold-duotone',
                    badge: undefined,
                    accentColor: 'text-[#0284C7]',
                  },
                  {
                    key: 'Misi Sains',
                    icon: 'solar:compass-big-bold-duotone',
                    badge: 'Aktif',
                    accentColor: 'text-emerald-500',
                  },
                  {
                    key: 'Lab Virtual',
                    icon: 'solar:test-tube-bold-duotone',
                    badge: '3 Modul',
                    accentColor: 'text-orange-500',
                  },
                  {
                    key: 'Tantangan',
                    icon: 'solar:bolt-circle-bold-duotone',
                    badge: '+120 XP',
                    accentColor: 'text-pink-500',
                  },
                  {
                    key: 'Peringkat',
                    icon: 'solar:cup-star-bold-duotone',
                    badge: '#3',
                    accentColor: 'text-amber-500',
                  },
                ] as {
                  key: SidebarNavKey;
                  icon: string;
                  badge?: string;
                  accentColor: string;
                }[]
              ).map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSidebarMenuClick(item.key)}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-indigo-600 text-white border border-sky-200 border-b-4 border-b-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.28),inset_0_2px_4px_rgba(255,255,255,0.45)]'
                        : 'text-[#0F172A] hover:bg-slate-100 hover:text-[#4F46E5] border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        icon={item.icon}
                        className={`text-xl shrink-0 ${
                          isActive ? 'text-white' : item.accentColor
                        }`}
                      />
                      <span>{item.key}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`hidden xl:inline-flex rounded-lg px-2 py-0.5 text-[10px] font-extrabold tabular-nums ${
                          isActive
                            ? 'bg-[#FACC15] text-[#0F172A]'
                            : 'bg-sky-50 text-[#0284C7] border border-sky-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {onSwitchToLanding3D && (
              <button
                type="button"
                onClick={onSwitchToLanding3D}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 px-3.5 py-2.5 text-xs font-extrabold text-[#4F46E5] transition-all cursor-pointer"
              >
                <Icon
                  icon="solar:planet-3-bold-duotone"
                  className="text-base text-[#0284C7]"
                />
                <span>Panggung Galaksi 3D</span>
              </button>
            )}
          </div>
        </div>

        {/* Kartu Profil Siswa di Bawah Sidebar */}
        <div className="mt-6 lg:mt-0 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F0F9FF] p-4 text-[#0F172A] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] text-xs font-extrabold text-white shadow-sm border border-white">
              MT
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-[#0F172A]">Minton</p>
              <p className="truncate text-xs font-bold text-[#4F46E5]">
                Kelas 5 SD · Kadet Lv. 7
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/80">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#475569] mb-1.5">
              <span>Bintang &amp; XP</span>
              <span className="text-[#0284C7] font-extrabold tabular-nums">
                ⭐ {displayedStars} · ⚡ {displayedXp} XP
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#10B981] transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
      )}

      {/* =====================================================================
          2. KONTEN UTAMA LAB VIRTUAL (lg:pl-64)
          Tampilan Rapi, Elegan, Berkelas (White Card + Galaxy Gradient Header
          + Horizontal Stepper Minimalis + Katalog Stasiun Card Grid)
      ===================================================================== */}
      <div className="relative z-10 lg:pl-64 transition-all duration-300 ease-in-out">
        <div className="mx-auto max-w-[1380px] p-4 sm:p-6 lg:p-7 transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ===============================================================
                KOLOM TENGAH (lg:col-span-8):
                Main Workbench Card + Katalog Stasiun Eksperimen Card Grid
            =============================================================== */}
            <main className="lg:col-span-8 space-y-6">
              {/* KARTU UTAMA WORKBENCH SIMULATOR (Putih Bersih + Header Gradien Galaksi) */}
              <section
                aria-label="Workbench Eksperimen Sains"
                className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.05)] overflow-hidden"
              >
                {/* 1. HEADER BANNER GRADIEN GALAKSI BIRU/UNGU YANG ELEGAN */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-950 px-5 py-4 sm:px-6 sm:py-5 text-white">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-sky-400/15 blur-2xl"
                  />

                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-400 text-white shadow-md border border-white/20">
                        <Icon
                          icon={
                            selectedStation === 'water-cycle'
                              ? 'solar:waterdrops-bold-duotone'
                              : selectedStation === 'solar-system'
                              ? 'solar:planet-3-bold-duotone'
                              : 'solar:leaf-bold-duotone'
                          }
                          className="text-2xl"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-sky-300">
                          <span>{questInfo.stationCode}</span>
                          <span aria-hidden="true">·</span>
                          <span>Lab Virtual Bintang Edu</span>
                        </div>
                        <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white mt-0.5">
                          {questInfo.stationTitle}
                        </h1>
                        <p className="text-xs text-indigo-200/90 mt-0.5">
                          {questInfo.stationDesc}
                        </p>
                      </div>
                    </div>

                    {/* Indikator Real-time di Pojok Kanan Header */}
                    {selectedStation === 'water-cycle' && (
                      <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${thermoTheme.bg} text-white shadow-xs`}
                        >
                          <Icon icon="solar:temperature-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                            Termometer Lab
                          </div>
                          <div className="text-lg sm:text-xl font-extrabold text-white tabular-nums leading-none mt-0.5">
                            {temperature}°C
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedStation === 'solar-system' && (
                      <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white">
                          <Icon icon="solar:planet-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                            Percepatan Gravitasi
                          </div>
                          <div className="text-lg sm:text-xl font-extrabold text-amber-300 tabular-nums leading-none mt-0.5">
                            {PLANET_CHOICES[selectedPlanet].gravity} m/s²
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedStation === 'photosynthesis' && (
                      <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                          <Icon icon="solar:leaf-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                            Status Tanaman
                          </div>
                          <div className="text-sm font-extrabold text-emerald-300 leading-none mt-0.5">
                            {isPlantBlooming ? 'Mekar Optimal' : 'Tahap Nutrisi'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. HORIZONTAL STEPPER BAR MINIMALIS & BERSIH (Lingkaran 1 — 2 — 3 + Garis Tipis) */}
                <div
                  aria-label="Tahapan Eksperimen Sains"
                  className="bg-slate-50/90 border-b border-slate-200/80 px-5 py-3.5 sm:px-6"
                >
                  <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {questInfo.steps.map((s, idx) => {
                      const isDone = completedSteps[s.step];
                      const isCurrent = currentStep === s.step;
                      const isUnlocked =
                        s.step === 1 || completedSteps[(s.step - 1) as QuestStep];

                      return (
                        <React.Fragment key={s.step}>
                          <button
                            type="button"
                            onClick={() => {
                              if (isUnlocked) {
                                setCurrentStep(s.step);
                              }
                            }}
                            className={`group flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                              isUnlocked ? 'opacity-100' : 'opacity-55 cursor-not-allowed'
                            }`}
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                                isDone
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : isCurrent
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-xs'
                                  : 'bg-white text-slate-400 border border-slate-300'
                              }`}
                            >
                              {isDone ? (
                                <Icon icon="solar:check-read-linear" className="text-sm" />
                              ) : (
                                s.step
                              )}
                            </span>
                            <div className="min-w-0">
                              <div
                                className={`text-xs font-extrabold leading-tight truncate ${
                                  isCurrent
                                    ? 'text-indigo-950'
                                    : isDone
                                    ? 'text-emerald-700'
                                    : 'text-slate-500'
                                }`}
                              >
                                {s.shortLabel}
                              </div>
                              <div className="text-[11px] font-medium text-slate-400 hidden sm:block">
                                {s.subLabel}
                              </div>
                            </div>
                          </button>

                          {/* Garis Penghubung Tipis Antar Lingkaran */}
                          {idx < questInfo.steps.length - 1 && (
                            <div
                              aria-hidden="true"
                              className="flex-1 mx-3 sm:mx-5 h-0.5 rounded-full bg-slate-200 overflow-hidden"
                            >
                              <div
                                className={`h-full transition-all duration-500 ${
                                  completedSteps[s.step]
                                    ? 'w-full bg-gradient-to-r from-emerald-500 to-indigo-500'
                                    : 'w-0'
                                }`}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* ===========================================================
                    3A. ISI WORKBENCH STASIUN 1: PANCI AJAIB AIR (SIKLUS AIR)
                =========================================================== */}
                {selectedStation === 'water-cycle' && (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Canvas Simulator dengan Frame Rapi */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 shadow-inner">
                      {/* Baris Info Fase & Target di Atas Canvas (Clean Unboxed/Subtle Header) */}
                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white/90 border-b border-slate-200/70 text-xs">
                        <div className="flex items-center gap-2 font-bold text-slate-700">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${thermoTheme.bg}`}
                          />
                          <span>{thermoTheme.phaseLabel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-semibold">
                          <span>Langkah {currentStep}:</span>
                          <span className="font-extrabold text-indigo-600">
                            {questInfo.active.targetBadge}
                          </span>
                          {isCurrentStepDone && (
                            <span className="text-emerald-600 font-extrabold">
                              · Tercapai ✓
                            </span>
                          )}
                        </div>
                      </div>

                      <canvas
                        ref={canvasRef}
                        width={540}
                        height={300}
                        className="w-full h-[250px] sm:h-[285px] block"
                      />

                      <div className="bg-white/95 border-t border-slate-200/70 px-4 py-2.5 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                          <Icon
                            icon="solar:lightbulb-bolt-bold-duotone"
                            className="text-base text-amber-500 shrink-0"
                          />
                          <span>{thermoTheme.desc}</span>
                        </p>
                        <span className="text-xs font-extrabold text-slate-500 tabular-nums shrink-0">
                          Suhu: {temperature}°C
                        </span>
                      </div>
                    </div>

                    {/* Panel Kontrol Proporsional: Slider Halus + Tombol Soft-Rounded (rounded-xl) */}
                    <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 space-y-4">
                      {/* Slider Pengatur Suhu */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span className="text-sky-600">❄ Beku (≤ 0°C)</span>
                          <span className="text-indigo-600">💧 Cair (1°C – 99°C)</span>
                          <span className="text-orange-600">🔥 Mendidih (100°C)</span>
                        </div>
                        <input
                          type="range"
                          min={-10}
                          max={110}
                          value={temperature}
                          aria-label="Pengatur Suhu Eksperimen Air"
                          onChange={(e) => {
                            setThermalAction('idle');
                            setTemperature(Number(e.target.value));
                          }}
                          className="w-full h-2.5 rounded-full accent-indigo-600 cursor-pointer bg-gradient-to-r from-sky-400 via-indigo-300 to-orange-500"
                        />
                      </div>

                      {/* Tombol Kontrol Proporsional (rounded-xl) */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={handleCoolClick}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                              thermalAction === 'cooling'
                                ? 'bg-sky-600 text-white border-sky-700 shadow-sm ring-2 ring-sky-200'
                                : 'bg-white hover:bg-sky-50 text-sky-700 border-sky-200 shadow-2xs'
                            }`}
                          >
                            <Icon
                              icon="solar:snowflake-bold-duotone"
                              className="text-base"
                            />
                            <span>Dinginkan</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleHeatClick}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                              thermalAction === 'heating'
                                ? 'bg-orange-600 text-white border-orange-700 shadow-sm ring-2 ring-orange-200'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-indigo-600 shadow-xs'
                            }`}
                          >
                            <Icon icon="solar:fire-bold-duotone" className="text-base" />
                            <span>Panaskan</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleResetExperiment}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/90 transition-all cursor-pointer"
                        >
                          <Icon icon="solar:restart-bold-duotone" className="text-base" />
                          <span>Ulangi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===========================================================
                    3B. ISI WORKBENCH STASIUN 2: GRAVITASI PLANET
                =========================================================== */}
                {selectedStation === 'solar-system' && (
                  <div className="p-5 sm:p-6 space-y-5">
                    <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 p-5 text-white border border-indigo-500/30 min-h-[260px] flex flex-col justify-between overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs z-10">
                        <div className="flex items-center gap-2 font-bold text-indigo-100">
                          <span>{PLANET_CHOICES[selectedPlanet].emoji}</span>
                          <span>{PLANET_CHOICES[selectedPlanet].name}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-300">
                            {PLANET_CHOICES[selectedPlanet].tag}
                          </span>
                        </div>
                        <span className="text-indigo-200/80 font-medium">
                          Menara Uji Gravitasi: 20 Meter
                        </span>
                      </div>

                      <div className="relative h-40 my-3 flex items-center justify-center">
                        <div className="h-full w-20 rounded-xl border border-dashed border-indigo-400/40 bg-indigo-950/40 relative flex justify-center">
                          <div
                            style={{ top: `${Math.min(76, dropProgress * 0.76)}%` }}
                            className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 border-2 border-white shadow-[0_0_16px_rgba(250,204,21,0.7)] flex items-center justify-center text-lg transition-none"
                          >
                            ⚽
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 py-2 px-3.5 text-center text-xs font-semibold text-indigo-100">
                        {dropState === 'landed'
                          ? PLANET_CHOICES[selectedPlanet].kidFact
                          : `Permukaan ${PLANET_CHOICES[selectedPlanet].name} siap untuk pengujian jatuh bebas.`}
                      </div>
                    </div>

                    {/* Pilihan Planet & Tombol Kontrol Proporsional (rounded-xl) */}
                    <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 space-y-3.5">
                      <div className="grid grid-cols-3 gap-2.5">
                        {(['earth', 'mars', 'jupiter'] as PlanetId[]).map((pid) => {
                          const p = PLANET_CHOICES[pid];
                          const active = selectedPlanet === pid;
                          return (
                            <button
                              key={pid}
                              type="button"
                              onClick={() => {
                                setSelectedPlanet(pid);
                                setDropState('idle');
                                setDropProgress(0);
                              }}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                active
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-indigo-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-lg">{p.emoji}</span>
                                <span
                                  className={`text-[11px] font-bold tabular-nums ${
                                    active ? 'text-indigo-100' : 'text-slate-400'
                                  }`}
                                >
                                  {p.gravity} m/s²
                                </span>
                              </div>
                              <div className="text-xs font-extrabold mt-1">{p.name}</div>
                              <div
                                className={`text-[11px] mt-0.5 ${
                                  active ? 'text-amber-300' : 'text-slate-500'
                                }`}
                              >
                                {testedPlanets[pid] ? 'Sudah Diuji ✓' : p.tag}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDropProgress(0);
                            setDropState('dropping');
                          }}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xs transition-all cursor-pointer"
                        >
                          <Icon icon="solar:rocket-2-bold-duotone" className="text-base" />
                          <span>Jatuhkan Bola</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetExperiment}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/90 transition-all cursor-pointer"
                        >
                          <Icon icon="solar:restart-bold-duotone" className="text-base" />
                          <span>Ulangi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===========================================================
                    3C. ISI WORKBENCH STASIUN 3: KEBUN AJAIB (FOTOSINTESIS)
                =========================================================== */}
                {selectedStation === 'photosynthesis' && (
                  <div className="p-5 sm:p-6 space-y-5">
                    <div
                      className={`rounded-2xl p-5 border transition-colors duration-500 flex flex-col items-center justify-between min-h-[250px] relative overflow-hidden ${
                        sunLevel >= 75
                          ? 'bg-gradient-to-b from-sky-50 via-emerald-50/60 to-amber-50/70 border-emerald-200'
                          : 'bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50/40 border-slate-200'
                      }`}
                    >
                      <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700 z-10">
                        <span>☀️ Cahaya Surya: {sunLevel}%</span>
                        <span>💧 Kelembapan Air: {waterLevel}%</span>
                        <span>🌬️ Kadar CO₂: {airCo2Level}%</span>
                      </div>

                      <div className="my-4 text-center">
                        <div className="text-6xl transition-transform duration-500">
                          {isPlantBlooming
                            ? '🌻'
                            : sunLevel >= 75 || waterLevel >= 75
                            ? '🌿'
                            : '🌱'}
                        </div>
                        {isPlantBlooming && (
                          <p className="mt-2 text-xs font-extrabold text-emerald-700">
                            🫧 Gelembung Oksigen (O₂) Terbentuk Optimal
                          </p>
                        )}
                      </div>

                      <div className="w-full bg-white/90 rounded-xl px-4 py-2 text-center text-xs font-semibold text-slate-600 border border-slate-200/80">
                        {isPlantBlooming
                          ? 'Fotosintesis berlangsung sempurna! Tanaman menghasilkan glukosa dan Oksigen.'
                          : 'Atur tingkat Cahaya, Air, dan Udara CO₂ hingga minimal 75% secara bertahap.'}
                      </div>
                    </div>

                    {/* Tombol Kontrol Proporsional (rounded-xl) */}
                    <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSunLevel((v) => Math.min(100, v + 30))}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 transition-all cursor-pointer"
                        >
                          <Icon icon="solar:sun-2-bold-duotone" className="text-base" />
                          <span>Tambah Cahaya</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWaterLevel((v) => Math.min(100, v + 30))}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 transition-all cursor-pointer"
                        >
                          <Icon
                            icon="solar:waterdrops-bold-duotone"
                            className="text-base"
                          />
                          <span>Siram Air</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAirCo2Level((v) => Math.min(100, v + 30))}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
                        >
                          <Icon icon="solar:wind-bold-duotone" className="text-base" />
                          <span>Beri Udara CO₂</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetExperiment}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/90 transition-all cursor-pointer"
                      >
                        <Icon icon="solar:restart-bold-duotone" className="text-base" />
                        <span>Ulangi</span>
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* =============================================================
                  KATALOG STASIUN EKSPERIMEN GALAKSI (CARD GRID 3 KOLOM ELEGAN)
                  Menggantikan tab browser kaku di atas dengan kartu katalog rapi
              ============================================================= */}
              <section aria-label="Katalog Stasiun Eksperimen Galaksi" className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Katalog Stasiun Eksperimen Galaksi
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pilih wahana simulasi sains untuk dijelajahi langkah demi langkah
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">
                    3 Stasiun Tersedia
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {STATION_CATALOG.map((st) => {
                    const isSelected = selectedStation === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleSelectStation(st.id)}
                        className={`group relative text-left rounded-2xl bg-white p-4 transition-all cursor-pointer border ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/15 shadow-[0_8px_24px_rgba(79,70,229,0.12)]'
                            : 'border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md'
                        }`}
                      >
                        {/* Top subtle galaxy gradient accent bar */}
                        <div
                          className={`h-1 w-full rounded-full bg-gradient-to-r ${st.iconBg} mb-3.5 opacity-85`}
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${st.iconBg} text-white shadow-sm`}
                          >
                            <Icon icon={st.icon} className="text-2xl" />
                          </div>
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider ${
                              isSelected ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                          >
                            {isSelected ? 'Stasiun Aktif' : st.code}
                          </span>
                        </div>

                        <h3 className="mt-3 text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {st.title}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 line-clamp-1">
                          {st.subtitle}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span className="truncate">{st.topic}</span>
                          <span className="text-amber-600 shrink-0 tabular-nums">
                            +{st.rewardStars} ⭐
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </main>

            {/* ===============================================================
                KOLOM KANAN (lg:col-span-4):
                1 KARTU INSTRUKSI MISI ELEGAN (BUKU CATATAN PENJELAJAH CILIK)
                Ikon Maskot/Kapten + Progress Bar Halus + Tombol Lanjut Misi Proporsional
            =============================================================== */}
            <aside
              aria-label="Buku Catatan Penjelajah Cilik"
              className="lg:col-span-4 lg:sticky lg:top-6"
            >
              <section className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.05)] overflow-hidden">
                {/* Header Gradien Galaksi pada Kartu Panduan */}
                <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 px-5 py-4 text-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/20 text-xl shadow-xs">
                      🧑‍🚀
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                        Buku Catatan Penjelajah Cilik
                      </div>
                      <h2 className="text-sm sm:text-base font-extrabold text-white">
                        Panduan Kapten Bintang 🌟
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSpeechAudio(questInfo.audioNarration)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                      isMascotSpeaking
                        ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300/40 animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100 border-white/15'
                    }`}
                  >
                    <Icon
                      icon={
                        isMascotSpeaking
                          ? 'solar:volume-loud-bold-duotone'
                          : 'solar:volume-small-bold-duotone'
                      }
                      className="text-sm"
                    />
                    <span>{isMascotSpeaking ? 'Suara Aktif 🎙️' : 'Audio Narasi'}</span>
                  </button>
                </div>

                {/* Isi Kartu Panduan */}
                <div className="p-5 space-y-4">
                  {/* Segmented Switcher: Panel Sains Adaptif (Mode Audio vs Mode Membaca) */}
                  <div className="rounded-2xl bg-slate-100/90 p-1 flex items-center gap-1 border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setAdaptiveMode('audio')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        adaptiveMode === 'audio'
                          ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/80'
                          : 'text-slate-600 hover:text-indigo-700'
                      }`}
                    >
                      <Icon
                        icon="solar:headphones-round-bold-duotone"
                        className="text-sm text-indigo-600"
                      />
                      <span>Mode Audio 🎧</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdaptiveMode('reading')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        adaptiveMode === 'reading'
                          ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/80'
                          : 'text-slate-600 hover:text-indigo-700'
                      }`}
                    >
                      <Icon
                        icon="solar:book-bookmark-bold-duotone"
                        className="text-sm text-sky-600"
                      />
                      <span>Mode Membaca 📖</span>
                    </button>
                  </div>

                  {/* Konten Adaptif Sesuai Mode */}
                  {adaptiveMode === 'audio' ? (
                    /* MODE AUDIO: Kotak Narasi Suara Kapten Bintang dengan Gaya Storytelling */
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-purple-50/40 p-4 border border-indigo-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🎙️</span>
                          <span className="text-xs font-extrabold text-indigo-950">
                            Pesan Suara Kapten Bintang
                          </span>
                        </div>
                        {isMascotSpeaking && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                            <span>●</span> Sedang Membaca...
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed italic">
                        "{questInfo.audioNarration}"
                      </p>

                      <button
                        type="button"
                        onClick={() => toggleSpeechAudio(questInfo.audioNarration)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                          isMascotSpeaking
                            ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-xs'
                        }`}
                      >
                        <Icon
                          icon={
                            isMascotSpeaking
                              ? 'solar:stop-circle-bold-duotone'
                              : 'solar:play-circle-bold-duotone'
                          }
                          className="text-base"
                        />
                        <span>
                          {isMascotSpeaking
                            ? 'Hentikan Suara Kapten ⏹️'
                            : 'Dengarkan Cerita Kapten 🔊'}
                        </span>
                      </button>
                    </div>
                  ) : (
                    /* MODE MEMBACA: Fakta Sains Rahasia Galaksi dalam Bentuk Bullet Points Ringkas & Emoji Menarik */
                    <div className="rounded-2xl bg-slate-50/90 p-4 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-200/70">
                        <Icon
                          icon="solar:stars-minimalistic-bold-duotone"
                          className="text-base text-amber-500"
                        />
                        <span className="text-xs font-extrabold text-slate-900">
                          Catatan Rahasia Sains Galaksi 🚀
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {questInfo.funFacts.map((fact, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed"
                          >
                            <span className="text-base shrink-0 select-none mt-0.5">
                              {fact.icon}
                            </span>
                            <div>
                              <strong className="font-extrabold text-slate-900">
                                {fact.title}:{' '}
                              </strong>
                              <span>{fact.desc}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Progress Bar Halus */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">
                        Progres Misi Eksperimen
                      </span>
                      <span className="font-extrabold text-indigo-600 tabular-nums">
                        Langkah {currentStep} dari 3 ({questProgressPercent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.max(12, questProgressPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* KARTU MISI AKTIF REAL-TIME (DYNAMIC STEP-BY-STEP MENGIKUTI STATE SIMULATOR) */}
                  <div
                    className={`rounded-2xl p-4 border transition-all ${
                      questInfo.active.dynamicIsAchieved
                        ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200/50'
                        : 'bg-amber-50/70 border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {questInfo.active.dynamicTitle}
                      </h3>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          questInfo.active.dynamicIsAchieved
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {questInfo.active.dynamicIsAchieved ? 'Misi Berhasil ✓' : 'Misi Aktif 🎯'}
                      </span>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                      {questInfo.active.dynamicInstruction}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2 text-xs">
                      <span className="font-extrabold text-slate-600 flex items-center gap-1">
                        <span>🎯</span>
                        <span>{questInfo.active.targetBadge}</span>
                      </span>

                      {!questInfo.active.dynamicIsAchieved && (
                        <button
                          type="button"
                          onClick={questInfo.active.quickHintAction}
                          className="inline-flex items-center gap-1 font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                        >
                          <Icon icon="solar:magic-stick-3-bold-duotone" />
                          <span>{questInfo.active.quickHintLabel}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Ringkasan 3 Langkah */}
                  <div className="space-y-1.5">
                    {questInfo.steps.map((s) => {
                      const done = completedSteps[s.step];
                      const active = currentStep === s.step;
                      return (
                        <div
                          key={s.step}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                            active
                              ? 'bg-indigo-50/80 text-indigo-950 font-bold'
                              : done
                              ? 'text-emerald-700 font-semibold'
                              : 'text-slate-400 font-medium'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span
                              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                                done
                                  ? 'bg-emerald-500 text-white'
                                  : active
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {done ? '✓' : s.step}
                            </span>
                            <span className="truncate">{s.shortLabel}</span>
                          </span>
                          <span className="text-[11px] tabular-nums shrink-0">
                            {s.subLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tombol Aksi Proporsional */}
                  {currentStep < 3 && (
                    <button
                      type="button"
                      disabled={!isCurrentStepDone}
                      onClick={handleNextStep}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                        isCurrentStepDone
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <span>
                        {isCurrentStepDone
                          ? `Lanjut ke Langkah ${currentStep + 1} ➡️`
                          : `Selesaikan Langkah ${currentStep} untuk Lanjut`}
                      </span>
                      <Icon icon="solar:arrow-right-linear" className="text-base" />
                    </button>
                  )}

                  {/* Reward & Tombol Kirim Hasil Penemuan */}
                  {(isAllStepsDone || showRewardPopup) && (
                    <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white p-4 border border-indigo-400/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                          <Icon
                            icon="solar:cup-star-bold-duotone"
                            className="text-base"
                          />
                          <span>Semua Misi Selesai! 🎉</span>
                        </span>
                        <span className="text-xs font-bold text-indigo-200 tabular-nums">
                          +100 ⭐ · +50 XP
                        </span>
                      </div>

                      <p className="text-xs text-indigo-100/90 leading-relaxed">
                        Hebat sekali Kadet Penjelajah 🚀! Seluruh eksperimen di stasiun ini berhasil kamu pecahkan dengan cerdas!
                      </p>

                      <button
                        type="button"
                        onClick={handleSubmitDiscoveryToCaptain}
                        disabled={hasSubmittedDiscovery}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          hasSubmittedDiscovery
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                        }`}
                      >
                        <Icon
                          icon={
                            hasSubmittedDiscovery
                              ? 'solar:check-circle-bold'
                              : 'solar:plain-bold-duotone'
                          }
                          className="text-base"
                        />
                        <span>
                          {hasSubmittedDiscovery
                            ? 'Laporan Terkirim ke Kapten! (+100 ⭐)'
                            : 'Kirim Hasil Penemuan ke Kapten 🚀'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
