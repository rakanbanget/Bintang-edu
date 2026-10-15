import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export type SidebarNavKey =
  | 'Beranda'
  | 'Misi Sains'
  | 'Lab Virtual'
  | 'Tantangan'
  | 'Peringkat';

export type StationId = 'water-cycle' | 'solar-system' | 'photosynthesis' | 'human-anatomy';
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
    id: 'human-anatomy',
    code: 'STASIUN 01',
    title: 'Anatomi & Panca Indra',
    subtitle: 'Mata, Telinga, Lidah & Saraf Kulit',
    topic: 'Reseptor Cahaya, Suara & Rasa',
    icon: 'solar:eye-bold-duotone',
    iconBg: 'from-rose-500 via-pink-600 to-amber-600',
    accentText: 'text-rose-600',
    rewardStars: 100,
    rewardXp: 60,
  },
  {
    id: 'photosynthesis',
    code: 'STASIUN 02',
    title: 'Kebun Tumbuhan & Ekosistem',
    subtitle: 'Fotosintesis & Rantai Makanan',
    topic: 'Klorofil, O₂, & Siklus Energi',
    icon: 'solar:leaf-bold-duotone',
    iconBg: 'from-emerald-500 via-teal-600 to-indigo-700',
    accentText: 'text-emerald-600',
    rewardStars: 100,
    rewardXp: 70,
  },
  {
    id: 'water-cycle',
    code: 'STASIUN 03',
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
    code: 'STASIUN 04',
    title: 'Gravitasi Planet',
    subtitle: 'Simulasi Orbit & Tarikan Galaksi',
    topic: 'Bumi, Mars & Raksasa Jupiter',
    icon: 'solar:planet-3-bold-duotone',
    iconBg: 'from-indigo-600 via-violet-600 to-purple-700',
    accentText: 'text-indigo-600',
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
  // STATE EKSPERIMEN 3: KEBUN AJAIB TUMBUHAN & EKOSISTEM (FOTOSINTESIS & RANTAI MAKANAN)
  // ============================================================================
  const [sunLevel, setSunLevel] = useState<number>(20);
  const [waterLevel, setWaterLevel] = useState<number>(20);
  const [airCo2Level, setAirCo2Level] = useState<number>(20);
  const [activePlantTab, setActivePlantTab] = useState<'photosynthesis' | 'food-chain'>('photosynthesis');
  const [selectedTrophicLevel, setSelectedTrophicLevel] = useState<number>(0);
  const [isEcosystemBalanced, setIsEcosystemBalanced] = useState<boolean>(true);

  // ============================================================================
  // STATE EKSPERIMEN 4: ANATOMI TUBUH & PANCA INDRA MANUSIA
  // ============================================================================
  const [activeSenseTab, setActiveSenseTab] = useState<'eye' | 'ear' | 'tongue' | 'skin'>('eye');
  // Eye experiment (Pupil reflex against light)
  const [eyeLightLevel, setEyeLightLevel] = useState<number>(30); // 10% to 100%
  // Ear experiment (Frequency resonance & eardrum vibration)
  const [soundFrequency, setSoundFrequency] = useState<'low' | 'mid' | 'high'>('mid');
  const [isEarVibrating, setIsEarVibrating] = useState<boolean>(false);
  // Tongue experiment (5 basic tastes on papillae zones)
  const [selectedTaste, setSelectedTaste] = useState<'sweet' | 'salty' | 'sour' | 'bitter' | 'umami'>('sweet');
  // Skin experiment (Sensory dermis receptors)
  const [selectedSkinStimulus, setSelectedSkinStimulus] = useState<'cold' | 'touch' | 'heat' | 'pressure'>('touch');

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
      setActivePlantTab('photosynthesis');
    } else if (station === 'human-anatomy') {
      setEyeLightLevel(30);
      setSoundFrequency('mid');
      setIsEarVibrating(false);
      setSelectedTaste('sweet');
      setSelectedSkinStimulus('touch');
      setActiveSenseTab('eye');
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

  useEffect(() => {
    if (selectedStation === 'human-anatomy') {
      if (currentStep === 1 && (eyeLightLevel >= 75 || eyeLightLevel <= 25) && !completedSteps[1]) {
        setCompletedSteps((prev) => ({ ...prev, 1: true }));
        showToast('Langkah 1 berhasil! Pupil mata merespons intensitas cahaya dengan adaptif.');
      }
      if (currentStep === 2 && isEarVibrating && !completedSteps[2]) {
        setCompletedSteps((prev) => ({ ...prev, 2: true }));
        showToast('Langkah 2 berhasil! Gendang telinga bergetar menangkap frekuensi gelombang bunyi.');
      }
      if (currentStep === 3 && (activeSenseTab === 'tongue' || activeSenseTab === 'skin') && !completedSteps[3]) {
        setCompletedSteps((prev) => ({ ...prev, 3: true }));
        setShowRewardPopup(true);
        showToast('Luar biasa! Seluruh panca indra dan reseptor saraf berhasil dieksplorasi!');
      }
    }
  }, [eyeLightLevel, isEarVibrating, activeSenseTab, currentStep, completedSteps, selectedStation]);

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
    } else if (selectedStation === 'photosynthesis') {
      setSunLevel(20);
      setWaterLevel(20);
      setAirCo2Level(20);
      setActivePlantTab('photosynthesis');
      showToast('Simulasi Fotosintesis & Ekosistem direset ke Langkah 1.');
    } else if (selectedStation === 'human-anatomy') {
      setEyeLightLevel(30);
      setSoundFrequency('mid');
      setIsEarVibrating(false);
      setSelectedTaste('sweet');
      setSelectedSkinStimulus('touch');
      setActiveSenseTab('eye');
      showToast('Laboratorium Anatomi & Sensorik direset ke Langkah 1.');
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
        stationCode: 'STASIUN EKSPERIMEN 03',
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
        stationCode: 'STASIUN EKSPERIMEN 04',
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

    if (selectedStation === 'human-anatomy') {
      let dynamicTitle = '';
      let dynamicInstruction = '';
      let dynamicIsAchieved = false;

      if (currentStep === 1) {
        if (eyeLightLevel >= 75 || eyeLightLevel <= 25) {
          dynamicTitle = 'Refleks Pupil Mata Teruji Sempurna! 👁️✨';
          dynamicInstruction = `Hebat Kadet Penjelajah 🚀! Pupil mata bereaksi terhadap cahaya (${eyeLightLevel}%): ${
            eyeLightLevel >= 75
              ? 'mengecil (miosis) melindungi retina dari silau berlebih'
              : 'melebar (midriasis) menangkap cahaya lebih banyak di ruang redup'
          }. Misi 1 tuntas!`;
          dynamicIsAchieved = true;
        } else {
          dynamicTitle = 'Misi 1: Uji Respon Pupil Mata terhadap Cahaya! 👁️';
          dynamicInstruction =
            'Kadet! Geser intensitas cahaya atau klik tombol [Senter Terang] (≥75%) atau [Ruang Redup] (≤25%) untuk melihat perubahan ukuran pupil mata!';
          dynamicIsAchieved = false;
        }
      } else if (currentStep === 2) {
        if (isEarVibrating) {
          dynamicTitle = 'Gendang Telinga Menangkap Gelombang Bunyi! 👂🎵';
          dynamicInstruction = `Luar biasa Kadet! Getaran frekuensi suara menggetarkan membran timpani dan diteruskan rumah siput (koklea) ke otak! Misi 2 tuntas!`;
          dynamicIsAchieved = true;
        } else {
          dynamicTitle = 'Misi 2: Getarkan Gendang Telinga dengan Frekuensi Bunyi! 👂';
          dynamicInstruction =
            'Buka tab [Telinga & Bunyi], lalu klik tombol [Bunyikan Garpu Tala] untuk mengamati gelombang suara dan getaran membran telinga!';
          dynamicIsAchieved = false;
        }
      } else {
        if (completedSteps[3]) {
          dynamicTitle = 'Reseptor Lidah & Saraf Kulit Sukses Dipetakan! 👅🖐️';
          dynamicInstruction =
            'Fantastis Kadet Penjelajah 🚀! Kamu telah memahami 5 zona rasa papila lidah dan cara reseptor sentuhan dermis mengirimkan impuls ke otak. Semua misi tuntas!';
          dynamicIsAchieved = true;
        } else {
          dynamicTitle = 'Misi 3: Eksplorasi Indra Pengecap Lidah & Reseptor Kulit! 👅🖐️';
          dynamicInstruction =
            'Pilih tab [Lidah & 5 Rasa] atau [Kulit & Reseptor], lalu uji salah satu rasa makanan atau jenis rangsangan kulit!';
          dynamicIsAchieved = false;
        }
      }

      const steps = [
        {
          step: 1 as QuestStep,
          shortLabel: 'Pupil Mata 👁️',
          subLabel: 'Refleks Cahaya',
          title: 'Langkah 1: Respon Pupil Mata',
          instruction:
            'Uji bagaimana pupil mata membesar di ruang gelap dan mengecil saat terkena cahaya terang.',
          successMsg:
            'Langkah 1 selesai! Refleks pupil mata bekerja melindungi retina dari silau! 👁️✨',
          targetBadge: 'Cahaya: ≥ 75% atau ≤ 25%',
          quickHintAction: () => setEyeLightLevel(90),
          quickHintLabel: 'Nyalakan Senter 90% 💡',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
        {
          step: 2 as QuestStep,
          shortLabel: 'Gendang Telinga 👂',
          subLabel: 'Resonansi Bunyi',
          title: 'Langkah 2: Getaran Bunyi di Telinga',
          instruction:
            'Bunyikan frekuensi suara untuk melihat gelombang bunyi menggetarkan gendang telinga dan rumah siput koklea.',
          successMsg:
            'Langkah 2 selesai! Gendang telinga dan tulang pendengaran beresonansi dengan gelombang bunyi! 👂🎵',
          targetBadge: 'Frekuensi: Aktifkan Bunyi',
          quickHintAction: () => {
            setActiveSenseTab('ear');
            setIsEarVibrating(true);
          },
          quickHintLabel: 'Bunyikan Frekuensi 🔊',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
        {
          step: 3 as QuestStep,
          shortLabel: 'Lidah & Kulit 👅',
          subLabel: 'Reseptor Sensorik',
          title: 'Langkah 3: Pengecap Lidah & Reseptor Saraf Kulit',
          instruction:
            'Uji persepsi 5 rasa pada papila lidah serta reseptor raba dan suhu pada lapisan dermis kulit.',
          successMsg:
            'Semua Misi Anatomi Tuntas! 🎉 Reseptor sensorik mengirim impuls listrik ke otak dengan sempurna!',
          targetBadge: 'Uji: Coba Rasa / Sentuhan',
          quickHintAction: () => {
            setActiveSenseTab('tongue');
            setSelectedTaste('sweet');
          },
          quickHintLabel: 'Cicipi Madu Manis 🍯',
          dynamicTitle,
          dynamicInstruction,
          dynamicIsAchieved,
        },
      ];

      return {
        stationCode: 'STASIUN EKSPERIMEN 01',
        stationTitle: 'Anatomi & Panca Indra Manusia · Laboratorium Sensorik',
        stationDesc:
          'Eksplorasi sensorik: pupil mata, resonansi gendang telinga, pengecap lidah, dan saraf kulit.',
        audioNarration:
          'Halo Kadet Penjelajah 🚀! Tubuh manusia adalah ciptaan paling luar biasa! Panca indra adalah jendela kita melihat dan merasakan indahnya alam semesta. Mata kita mengatur cahaya seperti kamera pintar. Telinga menangkap getaran suara udara. Lidah membedakan ribuan rasa lezat makanan, dan kulit merasakan sentuhan dan suhu hangat. Mari kita amati bagaimana sinyal saraf bekerja!',
        funFacts: [
          {
            icon: '👁️',
            title: 'Kamera Pintar Alami',
            desc: 'Pupil matamu bisa berubah ukuran dalam sepersekian detik berkat otot sfingter iris yang otomatis melindungi retina dari silau!',
          },
          {
            icon: '👂',
            title: 'Tulang Terkecil Tubuh',
            desc: 'Di dalam telingamu ada 3 tulang terkecil manusia: tulang martil, landasan, dan sanggurdi yang memperkuat getaran suara hingga 20 kali lipat!',
          },
          {
            icon: '👅',
            title: 'Ribuan Tunas Pengecap',
            desc: 'Lidah kita memiliki sekitar 10.000 kuncup pengecap yang berganti sel baru setiap 1-2 minggu agar kita selalu bisa merasakan lezatnya makanan!',
          },
          {
            icon: '🖐️',
            title: 'Jutaan Sensor Pelindung',
            desc: 'Kulit manusia memiliki jutaan sel reseptor yang mengirimkan sinyal rasa sakit, sentuhan lembut, dingin, dan panas ke otak secepat 100 meter per detik!',
          },
        ],
        steps,
        active: steps[currentStep - 1],
      };
    }

    // photosynthesis & food chain
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
      stationCode: 'STASIUN EKSPERIMEN 02',
      stationTitle: 'Kebun Tumbuhan & Ekosistem Hewan · Fotosintesis & Rantai Makanan',
      stationDesc: 'Bantu koki daun meramu fotosintesis dan amati aliran energi rantai makanan.',
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
                            selectedStation === 'human-anatomy'
                              ? 'solar:eye-bold-duotone'
                              : selectedStation === 'water-cycle'
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
                    {selectedStation === 'human-anatomy' && (
                      <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white">
                          <Icon
                            icon={
                              activeSenseTab === 'eye'
                                ? 'solar:eye-bold-duotone'
                                : activeSenseTab === 'ear'
                                ? 'solar:volume-loud-bold-duotone'
                                : activeSenseTab === 'tongue'
                                ? 'solar:cup-bold-duotone'
                                : 'solar:hand-shake-bold-duotone'
                            }
                            className="text-xl"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                            Sensorik Aktif
                          </div>
                          <div className="text-sm font-extrabold text-rose-300 leading-none mt-0.5">
                            {activeSenseTab === 'eye'
                              ? 'Pupil Mata 👁️'
                              : activeSenseTab === 'ear'
                              ? 'Getaran Telinga 👂'
                              : activeSenseTab === 'tongue'
                              ? 'Pengecap Lidah 👅'
                              : 'Reseptor Kulit 🖐️'}
                          </div>
                        </div>
                      </div>
                    )}

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
                            Status Tanaman & Ekosistem
                          </div>
                          <div className="text-sm font-extrabold text-emerald-300 leading-none mt-0.5">
                            {activePlantTab === 'food-chain'
                              ? 'Piramida Energi'
                              : isPlantBlooming
                              ? 'Mekar Optimal'
                              : 'Tahap Nutrisi'}
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
                    3C. ISI WORKBENCH STASIUN 2: KEBUN AJAIB & EKOSISTEM
                =========================================================== */}
                {selectedStation === 'photosynthesis' && (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Sub-tab Switcher: Fotosintesis vs Rantai Makanan & Siklus Energi */}
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/90">
                      <button
                        type="button"
                        onClick={() => setActivePlantTab('photosynthesis')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activePlantTab === 'photosynthesis'
                            ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-emerald-700'
                        }`}
                      >
                        <Icon icon="solar:leaf-bold-duotone" className="text-base text-emerald-600" />
                        <span>🌱 Dapur Fotosintesis Klorofil</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePlantTab('food-chain')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activePlantTab === 'food-chain'
                            ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-indigo-700'
                        }`}
                      >
                        <Icon icon="solar:graph-up-bold-duotone" className="text-base text-indigo-600" />
                        <span>🦅 Rantai Makanan & Siklus Energi</span>
                      </button>
                    </div>

                    {activePlantTab === 'photosynthesis' ? (
                      /* TAB 1: SIMULASI FOTOSINTESIS KLOROFIL DAUN */
                      <>
                        <div
                          className={`rounded-2xl p-5 border transition-colors duration-500 flex flex-col items-center justify-between min-h-[250px] relative overflow-hidden ${
                            sunLevel >= 75
                              ? 'bg-gradient-to-b from-sky-50 via-emerald-50/60 to-amber-50/70 border-emerald-200'
                              : 'bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50/40 border-slate-200'
                          }`}
                        >
                          <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700 z-10">
                            <span className="bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200/80">☀️ Cahaya Surya: {sunLevel}%</span>
                            <span className="bg-white/80 px-2.5 py-1 rounded-lg border border-sky-200/80">💧 Kelembapan Air: {waterLevel}%</span>
                            <span className="bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200/80">🌬️ Kadar CO₂: {airCo2Level}%</span>
                          </div>

                          <div className="my-4 text-center">
                            <div className="text-6xl transition-transform duration-500 hover:scale-110">
                              {isPlantBlooming
                                ? '🌻'
                                : sunLevel >= 75 || waterLevel >= 75
                                ? '🌿'
                                : '🌱'}
                            </div>
                            {isPlantBlooming && (
                              <p className="mt-2 text-xs font-extrabold text-emerald-700 animate-pulse">
                                🫧 Gelembung Oksigen (O₂) & Glukosa Murni Terbentuk!
                              </p>
                            )}
                          </div>

                          <div className="w-full bg-white/90 rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-slate-700 border border-slate-200/80">
                            {isPlantBlooming
                              ? '🎉 Fotosintesis sempurna: 6CO₂ + 6H₂O + Foton Surya ➔ C₆H₁₂O₆ (Glukosa) + 6O₂ (Oksigen)'
                              : 'Atur intensitas Cahaya Surya, Air, dan Udara CO₂ hingga minimal 75% untuk mengaktifkan klorofil.'}
                          </div>
                        </div>

                        {/* Kontrol Fotosintesis */}
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
                              <Icon icon="solar:waterdrops-bold-duotone" className="text-base" />
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
                      </>
                    ) : (
                      /* TAB 2: SIMULASI RANTAI MAKANAN & SIKLUS ENERGI EKOSISTEM */
                      <div className="space-y-4">
                        <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/20 shadow-md">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">☀️</span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-extrabold text-amber-300">
                                  Aliran Energi 10% (Hukum Lindeman)
                                </h4>
                                <p className="text-[11px] text-slate-300">
                                  Hanya 10% energi kimia yang berpindah ke tingkatan trofik berikutnya!
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsEcosystemBalanced((b) => !b)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                isEcosystemBalanced
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                              }`}
                            >
                              {isEcosystemBalanced ? '✓ Ekosistem Seimbang' : '⚠️ Gangguan Populasi'}
                            </button>
                          </div>

                          {/* Tingkatan Trofik Ekosistem Horizontal Flow */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                            {[
                              {
                                level: 0,
                                tag: 'Produsen 🌾',
                                name: 'Padi & Rumput',
                                energy: '10.000 kkal',
                                role: 'Fotosintesis Surya',
                                color: 'border-emerald-400/50 bg-emerald-950/40 text-emerald-200',
                              },
                              {
                                level: 1,
                                tag: 'Konsumen I 🦗',
                                name: 'Belalang Daun',
                                energy: '1.000 kkal',
                                role: 'Herbivora',
                                color: 'border-lime-400/50 bg-lime-950/40 text-lime-200',
                              },
                              {
                                level: 2,
                                tag: 'Konsumen II 🐸',
                                name: 'Katak Sawah',
                                energy: '100 kkal',
                                role: 'Karnivora Kecil',
                                color: 'border-amber-400/50 bg-amber-950/40 text-amber-200',
                              },
                              {
                                level: 3,
                                tag: 'Konsumen Puncak 🦅',
                                name: 'Burung Elang',
                                energy: '10 kkal',
                                role: 'Predator Puncak',
                                color: 'border-rose-400/50 bg-rose-950/40 text-rose-200',
                              },
                              {
                                level: 4,
                                tag: 'Pengurai 🍄',
                                name: 'Jamur & Bakteri',
                                energy: 'Humus Tanah',
                                role: 'Dekomposer',
                                color: 'border-purple-400/50 bg-purple-950/40 text-purple-200',
                              },
                            ].map((item) => {
                              const isSelected = selectedTrophicLevel === item.level;
                              return (
                                <button
                                  key={item.level}
                                  type="button"
                                  onClick={() => setSelectedTrophicLevel(item.level)}
                                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${item.color} ${
                                    isSelected
                                      ? 'ring-2 ring-amber-300 scale-102 shadow-lg'
                                      : 'hover:opacity-90'
                                  }`}
                                >
                                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                                    {item.tag}
                                  </div>
                                  <div className="font-extrabold text-xs sm:text-sm text-white mt-0.5 truncate">
                                    {item.name}
                                  </div>
                                  <div className="text-[11px] font-bold text-amber-300 mt-1">
                                    {item.energy}
                                  </div>
                                  <div className="text-[10px] text-slate-300 mt-0.5">
                                    {item.role}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Penjelasan Detail Tingkatan Trofik yang Dipilih */}
                        <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-2xs">
                          {selectedTrophicLevel === 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🌾</span>
                                <h5 className="font-extrabold text-sm text-slate-900">
                                  Tingkat Trofik 1: Produsen (Tumbuhan Hijau & Padi)
                                </h5>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Tumbuhan hijau menangkap energi matahari dan mengubahnya menjadi molekul glukosa berkadar 10.000 kkal. Tumbuhan adalah produsen utama yang menopang seluruh makhluk hidup di daratan.
                              </p>
                              <div className="bg-emerald-50 rounded-xl p-2.5 text-[11px] text-emerald-800 font-bold border border-emerald-200">
                                💡 Fakta Sains: Tanpa klorofil daun yang berfotosintesis, tidak akan ada oksigen dan makanan untuk herbivora maupun manusia!
                              </div>
                            </div>
                          )}
                          {selectedTrophicLevel === 1 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🦗</span>
                                <h5 className="font-extrabold text-sm text-slate-900">
                                  Tingkat Trofik 2: Konsumen I (Herbivora · Belalang)
                                </h5>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Belalang memakan dedaunan padi. Dari 10.000 kkal energi daun, hanya sekitar 1.000 kkal (10%) yang tersimpan dalam jaringan tubuh belalang. Sisanya 90% terbuang untuk bergerak, bernapas, dan energi panas tubuh.
                              </p>
                              <div className="bg-lime-50 rounded-xl p-2.5 text-[11px] text-lime-800 font-bold border border-lime-200">
                                💡 Fakta Sains: Hewan herbivora memiliki saluran pencernaan yang lebih panjang untuk mencerna dinding sel selulosa tumbuhan.
                              </div>
                            </div>
                          )}
                          {selectedTrophicLevel === 2 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🐸</span>
                                <h5 className="font-extrabold text-sm text-slate-900">
                                  Tingkat Trofik 3: Konsumen II (Karnivora · Katak Sawah)
                                </h5>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Katak menangkap belalang dengan lidah lengketnya. Katak hanya menerima 100 kkal energi. Katak berperan penting menjaga keseimbangan alam agar sawah tidak diserang hama belalang secara berlebihan.
                              </p>
                              <div className="bg-amber-50 rounded-xl p-2.5 text-[11px] text-amber-800 font-bold border border-amber-200">
                                💡 Fakta Sains: Jika petani menyemprot pestisida berlebihan dan katak mati, populasi belalang justru bisa kebal dan melonjak merusak panen!
                              </div>
                            </div>
                          )}
                          {selectedTrophicLevel === 3 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🦅</span>
                                <h5 className="font-extrabold text-sm text-slate-900">
                                  Tingkat Trofik 4: Konsumen Puncak (Predator Apex · Elang)
                                </h5>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Burung Elang berada di puncak piramida makanan dengan sisa energi sebesar 10 kkal. Karena energinya sedikit, populasi elang di suatu hutan atau sabana selalu berjumlah lebih sedikit dibanding jumlah mangsanya.
                              </p>
                              <div className="bg-rose-50 rounded-xl p-2.5 text-[11px] text-rose-800 font-bold border border-rose-200">
                                💡 Fakta Sains: Sebagai predator puncak, elang menjaga populasi ular, tikus, dan katak agar ekosistem tetap proporsional dan sehat.
                              </div>
                            </div>
                          )}
                          {selectedTrophicLevel === 4 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🍄</span>
                                <h5 className="font-extrabold text-sm text-slate-900">
                                  Tingkat Dekomposer: Pengurai (Jamur & Bakteri Tanah)
                                </h5>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Ketika makhluk hidup mati, jamur dan mikroba tanah menguraikan jasad organik menjadi zat hara mineral (nitrogen, fosfor, kalium). Zat ini kembali diserap oleh akar padi, menutup siklus materi secara sempurna!
                              </p>
                              <div className="bg-purple-50 rounded-xl p-2.5 text-[11px] text-purple-800 font-bold border border-purple-200">
                                💡 Fakta Sains: Tanpa dekomposer, bumi akan terkubur bangkai dan tanah akan tandus tanpa nutrisi untuk tumbuhnya pepohonan baru!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ===========================================================
                    3D. ISI WORKBENCH STASIUN 1: ANATOMI TUBUH & PANCA INDRA
                =========================================================== */}
                {selectedStation === 'human-anatomy' && (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Sub-tab 4 Panca Indra: Mata, Telinga, Lidah, Kulit */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/90">
                      <button
                        type="button"
                        onClick={() => setActiveSenseTab('eye')}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activeSenseTab === 'eye'
                            ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-rose-700'
                        }`}
                      >
                        <Icon icon="solar:eye-bold-duotone" className="text-base text-rose-500" />
                        <span>Mata & Pupil 👁️</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSenseTab('ear')}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activeSenseTab === 'ear'
                            ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-indigo-700'
                        }`}
                      >
                        <Icon icon="solar:volume-loud-bold-duotone" className="text-base text-indigo-500" />
                        <span>Telinga & Bunyi 👂</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSenseTab('tongue')}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activeSenseTab === 'tongue'
                            ? 'bg-white text-amber-700 shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-amber-700'
                        }`}
                      >
                        <Icon icon="solar:cup-bold-duotone" className="text-base text-amber-500" />
                        <span>Lidah & 5 Rasa 👅</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSenseTab('skin')}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activeSenseTab === 'skin'
                            ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-sky-700'
                        }`}
                      >
                        <Icon icon="solar:hand-shake-bold-duotone" className="text-base text-sky-500" />
                        <span>Kulit & Saraf 🖐️</span>
                      </button>
                    </div>

                    {/* SENSE 1: MATA & REFLEKS PUPIL TERHADAP CAHAYA */}
                    {activeSenseTab === 'eye' && (
                      <div className="space-y-4">
                        <div className="rounded-2xl p-5 border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden shadow-inner">
                          {/* Sinar Senter Visualizer */}
                          {eyeLightLevel >= 50 && (
                            <div
                              className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-300"
                              style={{
                                background: `radial-gradient(circle at 50% 50%, rgba(254, 240, 138, ${
                                  (eyeLightLevel / 100) * 0.45
                                }) 0%, transparent 70%)`,
                              }}
                            />
                          )}

                          {/* SVG Anatomi Mata Manusia Interaktif */}
                          <div className="relative z-10 flex flex-col items-center">
                            <svg
                              width="260"
                              height="160"
                              viewBox="0 0 260 160"
                              className="drop-shadow-lg"
                            >
                              <defs>
                                <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
                                  <stop offset="0%" stopColor="#38bdf8" />
                                  <stop offset="65%" stopColor="#0284c7" />
                                  <stop offset="100%" stopColor="#075985" />
                                </radialGradient>
                              </defs>
                              {/* Sclera Putih Mata */}
                              <ellipse
                                cx="130"
                                cy="80"
                                rx="115"
                                ry="62"
                                fill="#f8fafc"
                                stroke="#94a3b8"
                                strokeWidth="3"
                              />
                              {/* Pembuluh Darah Halus di Sclera */}
                              <path
                                d="M 25,80 Q 55,75 75,78 M 235,80 Q 205,75 185,78 M 35,92 Q 60,86 80,90"
                                stroke="#f87171"
                                strokeWidth="1"
                                fill="none"
                                opacity="0.6"
                              />
                              {/* Iris Berwarna */}
                              <circle
                                cx="130"
                                cy="80"
                                r="48"
                                fill="url(#irisGrad)"
                                stroke="#0369a1"
                                strokeWidth="2.5"
                              />
                              {/* Garis Radiasi Otot Iris */}
                              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                                (deg) => (
                                  <line
                                    key={deg}
                                    x1={130 + Math.cos((deg * Math.PI) / 180) * 22}
                                    y1={80 + Math.sin((deg * Math.PI) / 180) * 22}
                                    x2={130 + Math.cos((deg * Math.PI) / 180) * 45}
                                    y2={80 + Math.sin((deg * Math.PI) / 180) * 45}
                                    stroke="#bae6fd"
                                    strokeWidth="1.2"
                                    opacity="0.7"
                                  />
                                )
                              )}
                              {/* Pupil Hitam yang Membesar/Mengecil Adaptif */}
                              {(() => {
                                const pupilRadius = Math.round(
                                  38 - (eyeLightLevel / 100) * 24
                                );
                                return (
                                  <>
                                    <circle
                                      cx="130"
                                      cy="80"
                                      r={pupilRadius}
                                      fill="#09090b"
                                      className="transition-all duration-300 ease-out"
                                    />
                                    {/* Pantulan Cahaya di Kornea */}
                                    <circle
                                      cx={130 - pupilRadius / 2.8}
                                      cy={80 - pupilRadius / 2.8}
                                      r={Math.max(3, pupilRadius / 3.2)}
                                      fill="#ffffff"
                                      opacity="0.85"
                                    />
                                  </>
                                );
                              })()}
                            </svg>

                            <div className="mt-3 text-center">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300">
                                {eyeLightLevel >= 70
                                  ? 'Pupil Mengecil (Miosis) · Melindungi Retina dari Silau 💡'
                                  : eyeLightLevel <= 30
                                  ? 'Pupil Melebar (Midriasis) · Menangkap Cahaya Redup 🌙'
                                  : 'Respon Normal · Intensitas Sedang ⛅'}
                              </span>
                              <div className="text-[11px] text-slate-300 mt-0.5">
                                Diameter Pupil Relatif: {(8.0 - (eyeLightLevel / 100) * 5.5).toFixed(1)} mm · Otot Sfingter Iris Aktif
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Slider & Kontrol Cahaya Mata */}
                        <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>🌙 Gelap (10%)</span>
                            <span className="text-rose-600 font-extrabold">
                              Intensitas Cahaya Senter: {eyeLightLevel}%
                            </span>
                            <span>💡 Sangat Silau (100%)</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={eyeLightLevel}
                            onChange={(e) => setEyeLightLevel(parseInt(e.target.value, 10))}
                            className="w-full accent-rose-600 cursor-pointer"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEyeLightLevel(15)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                              >
                                🌙 Ruang Redup (15%)
                              </button>
                              <button
                                type="button"
                                onClick={() => setEyeLightLevel(50)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                              >
                                ⛅ Cahaya Sedang (50%)
                              </button>
                              <button
                                type="button"
                                onClick={() => setEyeLightLevel(90)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
                              >
                                💡 Senter Terang (90%)
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={handleResetExperiment}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SENSE 2: TELINGA, FREKUENSI & GETARAN GENDANG */}
                    {activeSenseTab === 'ear' && (
                      <div className="space-y-4">
                        <div className="rounded-2xl p-5 border border-indigo-200 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white min-h-[250px] flex flex-col items-center justify-between relative overflow-hidden shadow-inner">
                          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300">
                            <span>👂 Membran Timpani & Rumah Siput (Koklea)</span>
                            <span className="text-amber-300 font-extrabold">
                              Status: {isEarVibrating ? '⚡ Bergetar Aktif' : 'Tenang'}
                            </span>
                          </div>

                          {/* Animasi Gelombang Suara & Saluran Telinga */}
                          <div className="my-3 flex items-center justify-center gap-4 w-full max-w-md">
                            <div className="text-3xl animate-bounce">
                              {soundFrequency === 'low' ? '🔉' : soundFrequency === 'mid' ? '🔊' : '🔔'}
                            </div>

                            {/* SVG Gelombang Suara */}
                            <svg width="180" height="60" viewBox="0 0 180 60" className="overflow-visible">
                              <path
                                d={
                                  isEarVibrating
                                    ? soundFrequency === 'high'
                                      ? 'M 0,30 Q 15,10 30,30 T 60,30 T 90,30 T 120,30 T 150,30 T 180,30'
                                      : soundFrequency === 'mid'
                                      ? 'M 0,30 Q 25,12 50,30 T 100,30 T 150,30 T 180,30'
                                      : 'M 0,30 Q 45,5 90,30 T 180,30'
                                    : 'M 0,30 L 180,30'
                                }
                                fill="none"
                                stroke={isEarVibrating ? '#38bdf8' : '#64748b'}
                                strokeWidth="3"
                                className={isEarVibrating ? 'animate-pulse' : ''}
                              />
                            </svg>

                            <div className="flex flex-col items-center text-center">
                              <div className={`text-4xl transition-transform ${isEarVibrating ? 'scale-115 rotate-3' : ''}`}>
                                🐚
                              </div>
                              <span className="text-[10px] text-sky-300 mt-1 font-bold">Koklea (Siput)</span>
                            </div>
                          </div>

                          <div className="w-full bg-white/10 rounded-xl px-4 py-2 text-center text-xs text-indigo-100 border border-white/15">
                            {isEarVibrating
                              ? `Gelombang frekuensi ${soundFrequency.toUpperCase()} menggetarkan gendang telinga, martil, landasan, sanggurdi, lalu diubah koklea jadi sinyal listrik ke otak!`
                              : 'Klik tombol [Bunyikan Frekuensi] untuk mengirim gelombang suara ke saluran telinga.'}
                          </div>
                        </div>

                        {/* Kontrol Frekuensi Bunyi */}
                        <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSoundFrequency('low');
                                setIsEarVibrating(true);
                              }}
                              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                                soundFrequency === 'low' && isEarVibrating
                                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                              }`}
                            >
                              🔉 100 Hz (Bass Rendah)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSoundFrequency('mid');
                                setIsEarVibrating(true);
                              }}
                              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                                soundFrequency === 'mid' && isEarVibrating
                                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                              }`}
                            >
                              🔊 1.000 Hz (Vokal Manusia)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSoundFrequency('high');
                                setIsEarVibrating(true);
                              }}
                              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                                soundFrequency === 'high' && isEarVibrating
                                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                              }`}
                            >
                              🔔 8.000 Hz (Cicitan Tinggi)
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsEarVibrating((v) => !v)}
                            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
                          >
                            <Icon icon={isEarVibrating ? 'solar:stop-bold-duotone' : 'solar:play-bold-duotone'} className="text-base" />
                            <span>{isEarVibrating ? 'Hentikan Bunyi' : 'Bunyikan Garpu Tala'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SENSE 3: LIDAH & 5 ZONA RASA DASAR */}
                    {activeSenseTab === 'tongue' && (
                      <div className="space-y-4">
                        <div className="rounded-2xl p-5 border border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-rose-50/60 min-h-[260px] flex flex-col items-center justify-between relative shadow-inner">
                          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>👅 Peta Papila Sensorik Lidah</span>
                            <span className="text-rose-600 font-extrabold uppercase">
                              Rasa Terpilih: {selectedTaste.toUpperCase()}
                            </span>
                          </div>

                          {/* SVG Skematis Lidah dengan Zona Rasa */}
                          <div className="my-2 relative flex items-center justify-center">
                            <svg width="220" height="150" viewBox="0 0 220 150">
                              {/* Bentuk Dasar Lidah */}
                              <path
                                d="M 50,20 C 50,90 80,140 110,140 C 140,140 170,90 170,20 C 150,15 130,12 110,12 C 90,12 70,15 50,20 Z"
                                fill="#fda4af"
                                stroke="#f43f5e"
                                strokeWidth="3"
                              />
                              {/* Garis Tengah Lidah */}
                              <path d="M 110,25 L 110,115" stroke="#fb7185" strokeWidth="2" strokeDasharray="3,3" />

                              {/* Zona Pahit (Pangkal Belakang) */}
                              <path
                                d="M 60,30 C 80,22 140,22 160,30 C 150,45 70,45 60,30 Z"
                                fill={selectedTaste === 'bitter' ? '#854d0e' : '#fecdd3'}
                                opacity={selectedTaste === 'bitter' ? '0.9' : '0.4'}
                                className="transition-colors duration-300"
                              />
                              {/* Zona Asam (Samping Kiri & Kanan Belakang) */}
                              <path
                                d="M 55,42 C 68,48 70,75 58,85 C 52,70 52,55 55,42 Z"
                                fill={selectedTaste === 'sour' ? '#eab308' : '#fecdd3'}
                                opacity={selectedTaste === 'sour' ? '0.9' : '0.4'}
                                className="transition-colors duration-300"
                              />
                              <path
                                d="M 165,42 C 152,48 150,75 162,85 C 168,70 168,55 165,42 Z"
                                fill={selectedTaste === 'sour' ? '#eab308' : '#fecdd3'}
                                opacity={selectedTaste === 'sour' ? '0.9' : '0.4'}
                                className="transition-colors duration-300"
                              />

                              {/* Zona Asin (Samping Kiri & Kanan Depan) */}
                              <path
                                d="M 62,88 C 75,95 80,115 72,122 C 63,110 60,100 62,88 Z"
                                fill={selectedTaste === 'salty' ? '#0ea5e9' : '#fecdd3'}
                                opacity={selectedTaste === 'salty' ? '0.9' : '0.4'}
                                className="transition-colors duration-300"
                              />
                              <path
                                d="M 158,88 C 145,95 140,115 148,122 C 157,110 160,100 158,88 Z"
                                fill={selectedTaste === 'salty' ? '#0ea5e9' : '#fecdd3'}
                                opacity={selectedTaste === 'salty' ? '0.9' : '0.4'}
                                className="transition-colors duration-300"
                              />

                              {/* Zona Manis (Ujung Depan) */}
                              <path
                                d="M 80,122 C 95,138 125,138 140,122 C 125,115 95,115 80,122 Z"
                                fill={selectedTaste === 'sweet' ? '#f43f5e' : '#fecdd3'}
                                opacity={selectedTaste === 'sweet' ? '0.9' : '0.4'}
                                className="transition-colors duration-300"
                              />

                              {/* Zona Umami (Pusat Lidah) */}
                              <ellipse
                                cx="110"
                                cy="75"
                                rx="22"
                                ry="18"
                                fill={selectedTaste === 'umami' ? '#a855f7' : '#fecdd3'}
                                opacity={selectedTaste === 'umami' ? '0.9' : '0.4'}
                                className="transition-colors duration-300"
                              />
                            </svg>
                          </div>

                          <div className="w-full bg-white/90 rounded-xl px-4 py-2 text-center text-xs font-semibold text-slate-700 border border-slate-200">
                            {selectedTaste === 'sweet' && '🍯 Madu Manis direspons paling kuat di ujung lidah! Gula memberi energi instan.'}
                            {selectedTaste === 'salty' && '🧂 Garam Asin direspons di tepi depan lidah, penting untuk keseimbangan elektrolit tubuh.'}
                            {selectedTaste === 'sour' && '🍋 Lemon Asam direspons di tepi samping, memicu air liur untuk membantu mencerna makanan.'}
                            {selectedTaste === 'bitter' && '☕ Kopi Pahit direspons di pangkal lidah sebagai alarm alami mendeteksi zat beracun.'}
                            {selectedTaste === 'umami' && '🍄 Kuah Kaldu Gurih direspons di pusat lidah oleh asam amino glutamat pembentuk protein.'}
                          </div>
                        </div>

                        {/* Tombol Pemilihan Rasa */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            { id: 'sweet', label: '🍯 Madu (Manis)', color: 'hover:bg-rose-50 text-rose-700 border-rose-200' },
                            { id: 'salty', label: '🧂 Garam (Asin)', color: 'hover:bg-sky-50 text-sky-700 border-sky-200' },
                            { id: 'sour', label: '🍋 Lemon (Asam)', color: 'hover:bg-amber-50 text-amber-700 border-amber-200' },
                            { id: 'bitter', label: '☕ Kopi (Pahit)', color: 'hover:bg-stone-50 text-stone-700 border-stone-200' },
                            { id: 'umami', label: '🍄 Kaldu (Umami)', color: 'hover:bg-purple-50 text-purple-700 border-purple-200' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setSelectedTaste(t.id as any)}
                              className={`p-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                                selectedTaste === t.id
                                  ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                  : `bg-white ${t.color}`
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SENSE 4: KULIT, DERMIS & RESEPTOR SARAF */}
                    {activeSenseTab === 'skin' && (
                      <div className="space-y-4">
                        <div className="rounded-2xl p-5 border border-sky-200 bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 text-white min-h-[250px] flex flex-col items-center justify-between relative shadow-inner">
                          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300">
                            <span>🖐️ Penampang Lapisan Kulit: Epidermis ➔ Dermis ➔ Saraf</span>
                            <span className="text-sky-300 font-extrabold uppercase">
                              Stimulus: {selectedSkinStimulus}
                            </span>
                          </div>

                          {/* Visual Lapisan Kulit & Reseptor */}
                          <div className="w-full max-w-lg my-2 bg-white/10 rounded-2xl p-3 border border-white/15 space-y-2">
                            <div className="h-4 rounded-lg bg-amber-400/80 text-[10px] font-extrabold text-slate-900 px-2 flex items-center justify-between">
                              <span>Lapisan Epidermis (Pelindung Luar)</span>
                              <span>Pori-pori Keringat</span>
                            </div>

                            <div className="h-16 rounded-xl bg-rose-500/20 border border-rose-400/30 p-2 flex items-center justify-around relative">
                              <div
                                className={`p-2 rounded-xl border text-center transition-all ${
                                  selectedSkinStimulus === 'touch'
                                    ? 'bg-sky-400 text-slate-950 ring-2 ring-white scale-105 font-extrabold'
                                    : 'bg-white/15 text-white border-white/20'
                                }`}
                              >
                                <span className="text-xs">🪶 Meissner</span>
                                <div className="text-[9px] text-slate-300">Raba Halus</div>
                              </div>

                              <div
                                className={`p-2 rounded-xl border text-center transition-all ${
                                  selectedSkinStimulus === 'cold'
                                    ? 'bg-sky-400 text-slate-950 ring-2 ring-white scale-105 font-extrabold'
                                    : 'bg-white/15 text-white border-white/20'
                                }`}
                              >
                                <span className="text-xs">❄️ Krause</span>
                                <div className="text-[9px] text-slate-300">Sensor Dingin</div>
                              </div>

                              <div
                                className={`p-2 rounded-xl border text-center transition-all ${
                                  selectedSkinStimulus === 'heat'
                                    ? 'bg-sky-400 text-slate-950 ring-2 ring-white scale-105 font-extrabold'
                                    : 'bg-white/15 text-white border-white/20'
                                }`}
                              >
                                <span className="text-xs">☀️ Ruffini</span>
                                <div className="text-[9px] text-slate-300">Sensor Hangat</div>
                              </div>

                              <div
                                className={`p-2 rounded-xl border text-center transition-all ${
                                  selectedSkinStimulus === 'pressure'
                                    ? 'bg-sky-400 text-slate-950 ring-2 ring-white scale-105 font-extrabold'
                                    : 'bg-white/15 text-white border-white/20'
                                }`}
                              >
                                <span className="text-xs">🔨 Pacini</span>
                                <div className="text-[9px] text-slate-300">Tekanan Dalam</div>
                              </div>
                            </div>

                            <div className="h-5 rounded-lg bg-amber-600/40 text-[10px] text-amber-200 px-2 flex items-center justify-between font-bold">
                              <span>Lapisan Subkutan / Lemak Kulit</span>
                              <span>⚡ Serabut Saraf ke Otak</span>
                            </div>
                          </div>

                          <div className="w-full bg-white/10 rounded-xl px-4 py-2 text-center text-xs text-sky-100 border border-white/15">
                            {selectedSkinStimulus === 'touch' && '🪶 Korpuskel Meissner mendeteksi sentuhan bulu halus, lalu mengirim sinyal secepat 70 m/s ke otak!'}
                            {selectedSkinStimulus === 'cold' && '❄️ Korpuskel Krause mendeteksi suhu dingin es, merangsang pembuluh darah menyempit.'}
                            {selectedSkinStimulus === 'heat' && '☀️ Korpuskel Ruffini mendeteksi suhu hangat dan merangsang kelenjar keringat mendinginkan tubuh.'}
                            {selectedSkinStimulus === 'pressure' && '🔨 Korpuskel Pacini mendeteksi tekanan kuat atau getaran saat kamu menggenggam bola.'}
                          </div>
                        </div>

                        {/* Tombol Stimulus Kulit */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'touch', label: '🪶 Sentuhan Bulu' },
                            { id: 'cold', label: '❄️ Es Dingin' },
                            { id: 'heat', label: '☀️ Suhu Hangat' },
                            { id: 'pressure', label: '🔨 Tekanan Kuat' },
                          ].map((stim) => (
                            <button
                              key={stim.id}
                              type="button"
                              onClick={() => setSelectedSkinStimulus(stim.id as any)}
                              className={`p-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                                selectedSkinStimulus === stim.id
                                  ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
                              }`}
                            >
                              {stim.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* =============================================================
                  KATALOG STASIUN EKSPERIMEN GALAKSI (CARD GRID 4 KOLOM ELEGAN)
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
                    {STATION_CATALOG.length} Stasiun Tersedia
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
