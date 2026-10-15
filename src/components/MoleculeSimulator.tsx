import React, { useEffect, useRef } from 'react';

interface MoleculeSimulatorProps {
  temperature: number;
  isHeating: boolean;
  isCooling: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 300;
const PARTICLE_COUNT = 14;
const PARTICLE_RADIUS = 9;

export const MoleculeSimulator: React.FC<MoleculeSimulatorProps> = ({ temperature, isHeating, isCooling }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    const particlesCopy: Particle[] = [];
    const cols = 4;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      particlesCopy.push({
        x: 80 + col * 45,
        y: CONTAINER_HEIGHT - 60 - row * 35,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: PARTICLE_RADIUS,
      });
    }
    particlesRef.current = particlesCopy;
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas with subtle dynamic background glow based on temperature
      ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT + 40);

      // Background gradient inside beaker
      const bgGradient = ctx.createLinearGradient(0, 50, 0, CONTAINER_HEIGHT);
      if (temperature >= 100) {
        bgGradient.addColorStop(0, 'rgba(255, 107, 53, 0.25)');
        bgGradient.addColorStop(1, 'rgba(255, 165, 0, 0.4)');
      } else if (temperature <= 0) {
        bgGradient.addColorStop(0, 'rgba(100, 200, 255, 0.15)');
        bgGradient.addColorStop(1, 'rgba(50, 150, 255, 0.25)');
      } else {
        bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.15)');
        bgGradient.addColorStop(1, 'rgba(30, 144, 255, 0.2)');
      }

      // Draw Beaker Glass Outline
      ctx.strokeStyle = 'rgba(225, 228, 240, 0.7)';
      ctx.lineWidth = 4;
      ctx.fillStyle = bgGradient;
      ctx.beginPath();
      ctx.moveTo(30, 40);
      ctx.lineTo(30, CONTAINER_HEIGHT - 20);
      ctx.lineTo(270, CONTAINER_HEIGHT - 20);
      ctx.lineTo(270, 40);
      ctx.stroke();
      ctx.fill();

      // Draw Water Level
      const waterHeightRatio = Math.min(1, Math.max(0.3, temperature / 100));
      const waterTopY = CONTAINER_HEIGHT - 20 - waterHeightRatio * (CONTAINER_HEIGHT - 70);
      
      ctx.fillStyle = temperature >= 100 
        ? 'rgba(255, 140, 0, 0.35)' 
        : temperature <= 0 
        ? 'rgba(135, 206, 250, 0.45)' 
        : 'rgba(30, 144, 255, 0.35)';
      
      ctx.beginPath();
      ctx.rect(32, waterTopY, 236, CONTAINER_HEIGHT - 22 - waterTopY);
      ctx.fill();

      // Draw Heating/Cooling Elements at the Bottom
      if (isHeating || temperature >= 80) {
        // Vibrant flames
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(150, CONTAINER_HEIGHT + 10, 16, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#FFA500';
        const flicker = Math.sin(Date.now() * 0.02) * 5;
        ctx.beginPath();
        ctx.arc(150, CONTAINER_HEIGHT + 2 + flicker, 10, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(150, CONTAINER_HEIGHT - 2, 5, Math.PI, 0);
        ctx.fill();
      } else if (isCooling || temperature <= 0) {
        // Ice crystals
        ctx.fillStyle = 'rgba(0, 191, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(120, CONTAINER_HEIGHT + 10, 10, 0, Math.PI * 2);
        ctx.arc(180, CONTAINER_HEIGHT + 10, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and Draw Particles
      const particles = particlesRef.current;

      particles.forEach((p) => {
        if (temperature <= 0) {
          // Solid: rigid, slight crystal tremor
          p.vx = 0;
          p.vy = 0;
          p.x += (Math.random() - 0.5) * 0.4;
          p.y += (Math.random() - 0.5) * 0.4;
        } else if (temperature >= 100) {
          // Boiling & Evaporation: Extreme thermal vibration & upward jet stream out of beaker!
          p.vx += (Math.random() - 0.5) * 2.5;
          p.vy -= 0.6; // strong upward pull

          p.x += p.vx;
          p.y += p.vy;

          // Wall bounce
          if (p.x - p.radius < 35 || p.x + p.radius > 265) p.vx *= -0.9;

          // If particle jets way above beaker top (y < 20), reset it to bottom to simulate continuous evaporation cycle!
          if (p.y < 10) {
            p.y = CONTAINER_HEIGHT - 30;
            p.x = 60 + Math.random() * 180;
            p.vy = -Math.random() * 4 - 3;
            p.vx = (Math.random() - 0.5) * 4;
          }
        } else {
          // Liquid state: dynamic motion proportional to temperature
          const speed = (temperature / 100) * 3.5;
          p.vx += (Math.random() - 0.5) * 0.5 * speed;
          p.vy += (Math.random() - 0.5) * 0.5 * speed;

          p.vx *= 0.92;
          p.vy *= 0.92;

          p.x += p.vx;
          p.y += p.vy;

          // Beaker boundary constraints
          if (p.x - p.radius < 35) { p.x = 35 + p.radius; p.vx *= -0.8; }
          if (p.x + p.radius > 265) { p.x = 265 - p.radius; p.vx *= -0.8; }
          if (p.y - p.radius < waterTopY) { p.y = waterTopY + p.radius; p.vy *= -0.8; }
          if (p.y + p.radius > CONTAINER_HEIGHT - 22) { p.y = CONTAINER_HEIGHT - 22 - p.radius; p.vy *= -0.8; }
        }

        // Draw particle (Water Molecule Ball with 3D gradient)
        let alpha = 1;
        if (temperature >= 100 && p.y < 80) {
          alpha = Math.max(0, p.y / 80);
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        const gradient = ctx.createRadialGradient(p.x - 3, p.y - 3, 0, p.x, p.y, p.radius);
        if (temperature >= 100) {
          gradient.addColorStop(0, 'rgba(255, 240, 150, 0.95)');
          gradient.addColorStop(1, 'rgba(255, 120, 0, 0.85)');
        } else {
          gradient.addColorStop(0, 'rgba(135, 206, 250, 0.95)');
          gradient.addColorStop(1, 'rgba(25, 118, 210, 0.85)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(p.x - 2.5, p.y - 2.5, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Bubbles & Massive Steam Jets at 100°C
      if (temperature >= 100) {
        // Bubbles rising from bottom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 4; i++) {
          const bx = 60 + (i * 60) + Math.sin(Date.now() * 0.01 + i) * 15;
          const by = CONTAINER_HEIGHT - 30 - ((Date.now() * 0.1 + i * 40) % (CONTAINER_HEIGHT - 70));
          ctx.beginPath();
          ctx.arc(bx, by, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Massive vapor clouds above beaker top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 6; i++) {
          const vx = 70 + i * 30 + Math.sin(Date.now() * 0.005 + i) * 20;
          const vy = 20 - ((Date.now() * 0.05 + i * 25) % 40);
          const vr = 12 + Math.sin(Date.now() * 0.01 + i) * 4;
          ctx.beginPath();
          ctx.arc(vx, vy, vr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Celebration badge banner on canvas
        ctx.save();
        ctx.fillStyle = '#FFFBEB';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(15, 8, 270, 30, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#B45309';
        ctx.font = 'bold 9.5px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔥 TITIK DIDIH TERCAPAI! UAP AIR TERBENTUK! +100 Bintang', CONTAINER_WIDTH / 2, 27);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [temperature, isHeating, isCooling]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={CONTAINER_WIDTH}
        height={CONTAINER_HEIGHT + 35}
        className="rounded-3xl border-2 border-slate-200/90 bg-gradient-to-b from-slate-50 via-slate-100 to-sky-50 shadow-[0_12px_32px_rgba(14,165,233,0.15)]"
      />
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wider ${temperature <= 0 ? 'bg-blue-50 text-blue-600 border border-blue-200' : temperature >= 100 ? 'bg-orange-50 text-orange-600 border border-orange-200 animate-pulse' : 'bg-sky-50 text-sky-600 border border-sky-200'}`}>
          {temperature <= 0 ? '❄️ Wujud Padat (Es)' : temperature >= 100 ? '🔥 Wujud Gas (Uap Air)' : '💧 Wujud Cair (Air)'}
        </span>
      </div>
    </div>
  );
};
