import React from 'react';
import { BintangEduMascot } from './BintangEduLogo.tsx';

/**
 * 1. KARAKTER UTAMA 3D: ASTRONAUT ANAK & BINTANG EDU BERSINAR
 *    Persis seperti referensi "Chasing Yesterday's Dreams":
 *    - Astronaut cilik 3D melayang meraih Bintang Kuning Bintang Edu yang memancarkan sinar
 *    - Dilengkapi animasi `animate-bounce` dan `animate-pulse`
 */
export const AstronautAndStarMascot3D: React.FC<{
  onStarClick?: () => void;
}> = ({ onStarClick }) => (
  <div className="relative w-full max-w-[390px] h-[390px] sm:h-[430px] mx-auto select-none">
    {/* Pendaran Sinar Cahaya Bintang di Kanan Atas Astronaut (animate-pulse) */}
    <div
      onClick={onStarClick}
      title="Klik Bintang Impian untuk Bonus Bintang!"
      className="group absolute -top-4 right-2 sm:right-4 z-30 cursor-pointer"
    >
      {/* Sinar Cahaya Memancar (Rays) */}
      <svg
        viewBox="0 0 220 220"
        className="w-44 h-44 sm:w-52 sm:h-52 animate-pulse"
        fill="none"
      >
        <defs>
          <radialGradient id="starBurstGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#FACC15" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="110" r="95" fill="url(#starBurstGlow)" />
        {/* Berkas Sinar Diagonal */}
        <line
          x1="110"
          y1="10"
          x2="110"
          y2="210"
          stroke="#FEF9C3"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.45"
        />
        <line
          x1="10"
          y1="110"
          x2="210"
          y2="110"
          stroke="#FEF9C3"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.45"
        />
        <line
          x1="38"
          y1="38"
          x2="182"
          y2="182"
          stroke="#FEF08A"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <line
          x1="182"
          y1="38"
          x2="38"
          y2="182"
          stroke="#FEF08A"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      {/* Karakter Bintang 3D Kuning Cerah yang Mengambang (animate-bounce) */}
      <div
        className="absolute inset-0 flex items-center justify-center animate-bounce"
        style={{ animationDuration: '2.8s' }}
      >
        <svg
          viewBox="0 0 140 140"
          className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-[0_10px_25px_rgba(250,204,21,0.75)] transition-transform group-hover:scale-110"
        >
          <defs>
            <linearGradient id="star3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Bentuk Bintang 3D Bulat Empuk */}
          <path
            d="M70 12 C75 12, 82 28, 87 38 C97 40, 118 43, 121 48 C124 53, 108 68, 101 76 C103 87, 109 108, 104 112 C99 116, 81 105, 70 99 C59 105, 41 116, 36 112 C31 108, 37 87, 39 76 C32 68, 16 53, 19 48 C22 43, 43 40, 53 38 C58 28, 65 12, 70 12 Z"
            fill="url(#star3DGrad)"
          />
          {/* Highlight 3D Atas */}
          <path
            d="M70 18 C73 18, 79 31, 83 39 C91 41, 108 43, 110 47 C100 54, 52 58, 30 47 C32 43, 49 41, 57 39 C61 31, 67 18, 70 18 Z"
            fill="#FEF9C3"
            opacity="0.6"
          />
          {/* Wajah Imut Bintang */}
          <ellipse cx="57" cy="64" rx="4" ry="5.5" fill="#451A03" />
          <circle cx="55.5" cy="62" r="1.5" fill="#FFFFFF" />
          <ellipse cx="83" cy="64" rx="4" ry="5.5" fill="#451A03" />
          <circle cx="81.5" cy="62" r="1.5" fill="#FFFFFF" />
          {/* Pipi Merona */}
          <ellipse cx="49" cy="70" rx="4.5" ry="2.5" fill="#F97316" opacity="0.55" />
          <ellipse cx="91" cy="70" rx="4.5" ry="2.5" fill="#F97316" opacity="0.55" />
          {/* Mulut Kecil */}
          <circle cx="70" cy="70" r="3" fill="#B45309" />
          {/* Toga Kecil Bintang Edu di Atas Kepala Bintang */}
          <g transform="translate(38, 2) rotate(-12 32 15) scale(0.58)">
            <polygon
              points="55,6 92,19 55,32 18,19"
              fill="#1D4ED8"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            <path d="M30 21 L24 38" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
            <circle cx="23.5" cy="40" r="4.5" fill="#FACC15" />
          </g>
        </svg>
      </div>
    </div>

    {/* Karakter Astronaut Cilik 3D Mengambang (animate-bounce halus) */}
    <div
      className="relative z-20 pt-10 animate-bounce"
      style={{ animationDuration: '3.6s' }}
    >
      <svg
        viewBox="0 0 340 370"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_22px_35px_rgba(15,23,42,0.75)]"
        aria-label="Astronaut Cilik 3D Bintang Edu"
      >
        <defs>
          <linearGradient id="suitBody3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
          <linearGradient id="helmetRim3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="faceSkin3D" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFEDD5" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
          <linearGradient id="chestPack3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Ransel Jetpack Antariksa di Belakang */}
        <rect
          x="105"
          y="148"
          width="115"
          height="100"
          rx="26"
          fill="#64748B"
        />
        <rect
          x="112"
          y="154"
          width="105"
          height="90"
          rx="22"
          fill="#94A3B8"
        />

        {/* Lengan Kanan Astronaut (Meraih ke Atas ke Arah Bintang Kuning) */}
        <g transform="rotate(-38 225 165)">
          <rect
            x="200"
            y="85"
            width="42"
            height="105"
            rx="21"
            fill="url(#suitBody3D)"
          />
          <rect x="201" y="115" width="40" height="8" rx="3" fill="#06B6D4" />
          <rect x="201" y="148" width="40" height="10" rx="4" fill="#3B82F6" />
          <circle cx="221" cy="82" r="20" fill="#E2E8F0" />
          <circle cx="206" cy="86" r="8" fill="#CBD5E1" />
        </g>

        {/* Lengan Kiri Astronaut (Melambai Ceria) */}
        <g transform="rotate(34 115 178)">
          <rect
            x="78"
            y="165"
            width="42"
            height="92"
            rx="21"
            fill="url(#suitBody3D)"
          />
          <rect x="79" y="218" width="40" height="8" rx="3" fill="#06B6D4" />
          <rect x="79" y="190" width="40" height="10" rx="4" fill="#3B82F6" />
          <circle cx="99" cy="256" r="19" fill="#E2E8F0" />
          <circle cx="114" cy="250" r="7.5" fill="#CBD5E1" />
        </g>

        {/* Kaki Kiri Astronaut */}
        <g transform="rotate(10 142 265)">
          <rect
            x="120"
            y="240"
            width="44"
            height="86"
            rx="22"
            fill="url(#suitBody3D)"
          />
          <rect x="121" y="292" width="42" height="10" rx="4" fill="#3B82F6" />
          <ellipse cx="142" cy="326" rx="25" ry="18" fill="#E2E8F0" />
          <ellipse cx="142" cy="332" rx="23" ry="10" fill="#64748B" />
        </g>

        {/* Kaki Kanan Astronaut (Melayang Ditekuk) */}
        <g transform="rotate(-18 196 260)">
          <rect
            x="172"
            y="232"
            width="44"
            height="82"
            rx="22"
            fill="url(#suitBody3D)"
          />
          <rect x="173" y="282" width="42" height="10" rx="4" fill="#3B82F6" />
          <ellipse cx="195" cy="314" rx="25" ry="18" fill="#E2E8F0" />
          <ellipse cx="195" cy="320" rx="23" ry="10" fill="#64748B" />
        </g>

        {/* Badan Utama Baju Astronaut 3D */}
        <rect
          x="114"
          y="152"
          width="104"
          height="108"
          rx="44"
          fill="url(#suitBody3D)"
        />

        {/* Sabuk Biru Muda & Emblem Tengah */}
        <rect x="116" y="220" width="100" height="14" rx="7" fill="#38BDF8" />
        <circle cx="168" cy="227" r="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
        <text
          x="164"
          y="231"
          fill="#0284C7"
          fontSize="11"
          fontWeight="bold"
        >
          K
        </text>

        {/* Panel Bintang di Dada Astronaut (Bintang Edu Badge) */}
        <rect
          x="140"
          y="174"
          width="54"
          height="40"
          rx="12"
          fill="url(#chestPack3D)"
          stroke="#38BDF8"
          strokeWidth="2.5"
        />
        <path
          d="M167 181 L171 189 L180 190 L173 196 L175 205 L167 200 L159 205 L161 196 L154 190 L163 189 Z"
          fill="#FACC15"
        />

        {/* Kantong Robot Hijau Kecil di Pinggang Kiri */}
        <rect
          x="118"
          y="204"
          width="26"
          height="26"
          rx="8"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth="2"
        />
        <circle cx="131" cy="215" r="8" fill="#34D399" />
        <circle cx="128" cy="214" r="1.5" fill="#064E3B" />
        <circle cx="134" cy="214" r="1.5" fill="#064E3B" />

        {/* HELM ASTRONAUT 3D BESAR */}
        <g transform="rotate(-6 164 105)">
          <line
            x1="76"
            y1="95"
            x2="92"
            y2="132"
            stroke="#E2E8F0"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <ellipse
            cx="88"
            cy="132"
            rx="14"
            ry="20"
            fill="#F472B6"
            stroke="#E2E8F0"
            strokeWidth="5"
          />
          <ellipse
            cx="240"
            cy="126"
            rx="12"
            ry="18"
            fill="#60A5FA"
            stroke="#E2E8F0"
            strokeWidth="4"
          />

          <circle cx="164" cy="105" r="74" fill="url(#helmetRim3D)" />
          <circle cx="164" cy="102" r="69" fill="#FFFFFF" />

          <circle cx="122" cy="52" r="5" fill="#38BDF8" />
          <circle cx="204" cy="52" r="5" fill="#60A5FA" />

          <rect
            x="104"
            y="60"
            width="120"
            height="88"
            rx="44"
            fill="#1E1B4B"
          />
          <rect
            x="108"
            y="64"
            width="112"
            height="82"
            rx="40"
            fill="url(#faceSkin3D)"
          />

          <path
            d="M108 95 C112 64, 150 58, 185 64 C205 68, 218 80, 220 96 C210 82, 196 78, 184 86 C176 74, 160 74, 152 86 C140 75, 122 80, 108 95 Z"
            fill="#B45309"
          />

          <ellipse cx="142" cy="104" rx="7.5" ry="9.5" fill="#1E1B4B" />
          <circle cx="139.5" cy="100.5" r="3" fill="#FFFFFF" />
          <circle cx="144.5" cy="106.5" r="1.5" fill="#FFFFFF" />

          <ellipse cx="188" cy="104" rx="7.5" ry="9.5" fill="#1E1B4B" />
          <circle cx="185.5" cy="100.5" r="3" fill="#FFFFFF" />
          <circle cx="190.5" cy="106.5" r="1.5" fill="#FFFFFF" />

          <path
            d="M132 90 Q142 85 150 90"
            stroke="#78350F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M178 90 Q188 85 196 90"
            stroke="#78350F"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <ellipse cx="126" cy="115" rx="8" ry="4.5" fill="#FB7185" opacity="0.45" />
          <ellipse cx="202" cy="115" rx="8" ry="4.5" fill="#FB7185" opacity="0.45" />
          <path
            d="M148 117 Q165 123 182 117 C183 131, 174 138, 165 138 C156 138, 147 131, 148 117 Z"
            fill="#991B1B"
          />
          <path
            d="M150 118 Q165 122 180 118 L179 123 Q165 126 151 123 Z"
            fill="#FFFFFF"
          />
          <path
            d="M154 130 Q165 125 176 130 C173 136, 157 136, 154 130 Z"
            fill="#FB7185"
          />

          <path
            d="M116 78 C128 66, 155 64, 175 68"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>
      </svg>
    </div>

    {/* Kubus Rubik 3D Melayang di Dekat Kaki Astronaut */}
    <div
      className="absolute bottom-6 left-14 sm:left-20 z-30 animate-bounce"
      style={{ animationDuration: '2.9s', animationDelay: '0.4s' }}
    >
      <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-xl">
        <polygon points="40,8 70,24 40,40 10,24" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2" />
        <polygon points="10,24 40,40 40,72 10,56" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" />
        <polygon points="40,40 70,24 70,56 40,72" fill="#EC4899" stroke="#1E1B4B" strokeWidth="2" />
        <line x1="25" y1="16" x2="55" y2="32" stroke="#1E1B4B" strokeWidth="1.8" />
        <line x1="55" y1="16" x2="25" y2="32" stroke="#1E1B4B" strokeWidth="1.8" />
        <line x1="25" y1="32" x2="25" y2="64" stroke="#1E1B4B" strokeWidth="1.8" />
        <line x1="55" y1="32" x2="55" y2="64" stroke="#1E1B4B" strokeWidth="1.8" />
        <line x1="10" y1="40" x2="40" y2="56" stroke="#1E1B4B" strokeWidth="1.8" />
        <line x1="40" y1="56" x2="70" y2="40" stroke="#1E1B4B" strokeWidth="1.8" />
      </svg>
    </div>
  </div>
);

/**
 * 2. ROKET 3D MERAH-PUTIH MELUNCUR DI ATAS "CHILDHOOD DREAM"
 */
export const Rocket3D: React.FC = () => (
  <div
    className="relative inline-block select-none animate-bounce"
    style={{ animationDuration: '2.6s' }}
  >
    <svg
      viewBox="0 0 180 150"
      fill="none"
      className="w-28 h-24 sm:w-36 sm:h-30 drop-shadow-[0_15px_25px_rgba(15,23,42,0.7)]"
      aria-label="Roket Antariksa 3D"
    >
      <defs>
        <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="rocketRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
      </defs>

      <g transform="rotate(42 95 72)">
        <path
          d="M72 115 C75 138, 95 148, 95 148 C95 148, 115 138, 118 115 Z"
          fill="#FACC15"
          className="animate-pulse"
        />
        <path
          d="M80 115 C82 130, 95 138, 95 138 C95 138, 108 130, 110 115 Z"
          fill="#FEF08A"
        />

        <path
          d="M62 78 C42 86, 38 106, 46 116 C56 110, 64 105, 68 102 Z"
          fill="url(#rocketRedGrad)"
        />
        <path
          d="M128 78 C148 86, 152 106, 144 116 C134 110, 126 105, 122 102 Z"
          fill="url(#rocketRedGrad)"
        />

        <path
          d="M95 10 C122 32, 130 72, 120 108 L70 108 C60 72, 68 32, 95 10 Z"
          fill="url(#rocketBodyGrad)"
        />

        <path
          d="M95 10 C108 21, 116 34, 120 46 L70 46 C74 34, 82 21, 95 10 Z"
          fill="url(#rocketRedGrad)"
        />

        <circle cx="95" cy="68" r="16" fill="#E2E8F0" />
        <circle cx="95" cy="68" r="12.5" fill="#0EA5E9" />
        <circle cx="91" cy="64" r="4" fill="#BAE6FD" />

        <rect x="91" y="90" width="8" height="22" rx="4" fill="url(#rocketRedGrad)" />
        <rect x="75" y="108" width="40" height="8" rx="4" fill="#475569" />
      </g>
    </svg>
  </div>
);

/**
 * 3. PLANET BERCINCIN MERAH MUDA TERSENYUM DI POJOK KIRI ATAS
 */
export const PinkRingedPlanet3D: React.FC = () => (
  <div className="select-none animate-pulse" style={{ animationDuration: '3.2s' }}>
    <svg
      viewBox="0 0 160 110"
      className="w-28 h-20 sm:w-36 sm:h-24 drop-shadow-[0_10px_20px_rgba(236,72,153,0.35)]"
    >
      <defs>
        <linearGradient id="pinkPlanetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="55%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#831843" />
        </linearGradient>
        <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>

      <g transform="translate(80, 55) rotate(14)">
        <ellipse
          cx="0"
          cy="0"
          rx="66"
          ry="16"
          stroke="url(#goldRingGrad)"
          strokeWidth="8"
          fill="none"
          opacity="0.7"
        />
        <circle cx="0" cy="0" r="34" fill="url(#pinkPlanetGrad)" />
        <circle cx="-11" cy="-3" r="3" fill="#500724" />
        <circle cx="11" cy="-3" r="3" fill="#500724" />
        <ellipse cx="-17" cy="2" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
        <ellipse cx="17" cy="2" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
        <path
          d="M-5 3 Q0 8 5 3"
          stroke="#500724"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M-66 0 A66 16 0 0 0 66 0"
          stroke="url(#goldRingGrad)"
          strokeWidth="8"
          fill="none"
        />
      </g>
    </svg>
  </div>
);

/**
 * 4. DINOSAURUS HIJAU IMUT DI KIRI BAWAH
 */
export const DinoBuddy3D: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    title="Halo! Aku Sahabat Dino Sains!"
    className="cursor-pointer select-none animate-bounce transition-transform hover:scale-110"
    style={{ animationDuration: '2.7s' }}
  >
    <svg
      viewBox="0 0 130 140"
      className="w-24 h-26 sm:w-28 sm:h-30 drop-shadow-[0_12px_20px_rgba(15,23,42,0.75)]"
    >
      <defs>
        <linearGradient id="dinoSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="65%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      <circle cx="72" cy="36" r="6" fill="#F43F5E" />
      <circle cx="80" cy="52" r="6.5" fill="#F43F5E" />
      <circle cx="83" cy="70" r="6.5" fill="#F43F5E" />
      <circle cx="86" cy="88" r="6" fill="#F43F5E" />

      <path
        d="M72 95 C95 102, 112 90, 118 76 C116 105, 96 118, 65 114 Z"
        fill="url(#dinoSkinGrad)"
      />

      <path
        d="M22 44 C22 22, 68 20, 74 48 C78 68, 84 96, 74 114 L38 114 C32 98, 36 74, 34 64 C22 64, 22 54, 22 44 Z"
        fill="url(#dinoSkinGrad)"
      />

      <path
        d="M36 66 C48 66, 56 82, 54 112 L38 112 C34 98, 35 78, 36 66 Z"
        fill="#FACC15"
      />

      <polygon points="24,48 28,54 32,48" fill="#FFFFFF" />
      <polygon points="32,48 36,54 40,48" fill="#FFFFFF" />
      <path
        d="M50 38 L56 42 L50 46"
        stroke="#064E3B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <ellipse cx="60" cy="48" rx="4" ry="2.5" fill="#F43F5E" opacity="0.5" />

      <ellipse cx="32" cy="76" rx="8" ry="5" fill="#34D399" />
      <rect x="38" y="110" width="14" height="14" rx="6" fill="#059669" />
      <rect x="58" y="110" width="14" height="14" rx="6" fill="#10B981" />
    </svg>
  </div>
);

/**
 * 5. CUPCAKE ANTARIKSA 3D DI SAMPING JUDUL "DREAM"
 */
export const SpaceCupcake3D: React.FC = () => (
  <div
    className="inline-flex items-center justify-center select-none animate-bounce"
    style={{ animationDuration: '2.4s' }}
  >
    <svg viewBox="0 0 70 80" className="w-11 h-12 sm:w-14 sm:h-16 drop-shadow-lg">
      <polygon points="16,44 54,44 48,72 22,72" fill="#EC4899" />
      <line x1="26" y1="44" x2="29" y2="72" stroke="#BE185D" strokeWidth="2.5" />
      <line x1="35" y1="44" x2="35" y2="72" stroke="#BE185D" strokeWidth="2.5" />
      <line x1="44" y1="44" x2="41" y2="72" stroke="#BE185D" strokeWidth="2.5" />
      <path
        d="M12 45 C10 32, 22 24, 35 24 C48 24, 60 32, 58 45 C52 50, 44 48, 35 49 C26 48, 18 50, 12 45 Z"
        fill="#F8FAFC"
      />
      <circle cx="35" cy="18" r="9" fill="#EF4444" />
      <circle cx="32" cy="15" r="2.5" fill="#FCA5A5" />
    </svg>
  </div>
);

/**
 * 6. PLANET BIRU BERCINCIN BESAR DI SISI KANAN
 */
export const BlueRingedPlanet3D: React.FC = () => (
  <div className="relative select-none pointer-events-none">
    <svg
      viewBox="0 0 280 220"
      className="w-56 h-44 sm:w-72 sm:h-56 drop-shadow-[0_20px_40px_rgba(8,145,178,0.4)]"
    >
      <defs>
        <radialGradient id="deepBluePlanet" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </radialGradient>
        <linearGradient id="cyanOrbitRing" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g transform="translate(140, 110) rotate(-18)">
        <ellipse
          cx="0"
          cy="0"
          rx="125"
          ry="30"
          stroke="url(#cyanOrbitRing)"
          strokeWidth="12"
          fill="none"
        />

        <circle cx="0" cy="0" r="68" fill="url(#deepBluePlanet)" />

        <ellipse cx="-24" cy="-18" rx="14" ry="9" fill="#1E3A8A" opacity="0.6" />
        <circle cx="26" cy="14" r="11" fill="#1E3A8A" opacity="0.55" />
        <circle cx="-12" cy="28" r="7" fill="#1E3A8A" opacity="0.5" />

        <path
          d="M-125 0 A125 30 0 0 0 125 0"
          stroke="url(#cyanOrbitRing)"
          strokeWidth="13"
          fill="none"
          className="animate-pulse"
        />
      </g>
    </svg>
  </div>
);

/**
 * 7. WIDGET GAMEPAD INTERAKTIF 3D DI KANAN BAWAH (Persis Referensi Visual)
 */
export interface InteractiveGamepad3DProps {
  screenMode: number;
  onPressButton: () => void;
}

export const InteractiveGamepad3D: React.FC<InteractiveGamepad3DProps> = ({
  screenMode,
  onPressButton,
}) => {
  const screenExpressions = [
    { label: 'HAPPY', leftEye: '>', rightEye: '<', subText: 'PRESS BUTTON!' },
    { label: 'STAR', leftEye: '★', rightEye: '★', subText: '+25 BINTANG!' },
    { label: 'ROCKET', leftEye: '^', rightEye: '^', subText: 'SUPER SAINS!' },
    { label: 'WINK', leftEye: '>', rightEye: 'o', subText: 'BINTANG EDU!' },
  ];

  const currentExpr =
    screenExpressions[screenMode % screenExpressions.length];

  return (
    <div
      onClick={onPressButton}
      title="Klik konsol 3D untuk bermain & kumpulkan Bintang!"
      className="group relative cursor-pointer select-none animate-bounce transition-transform hover:scale-105"
      style={{ animationDuration: '3.1s' }}
    >
      <svg
        viewBox="0 0 260 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-52 h-56 sm:w-64 sm:h-68 drop-shadow-[0_24px_35px_rgba(15,23,42,0.85)]"
        aria-label="Widget Gamepad 3D Interaktif"
      >
        <defs>
          <linearGradient id="consoleTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="55%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="consoleSideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id="screenGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="55%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <ellipse
          cx="130"
          cy="225"
          rx="85"
          ry="24"
          fill="#38BDF8"
          opacity="0.25"
          className="animate-pulse"
        />

        <g transform="translate(132, 130) rotate(28) translate(-95, -115)">
          <rect
            x="14"
            y="18"
            width="168"
            height="212"
            rx="30"
            fill="url(#consoleSideGrad)"
          />

          <rect
            x="0"
            y="0"
            width="166"
            height="208"
            rx="28"
            fill="url(#consoleTopGrad)"
            stroke="#BAE6FD"
            strokeWidth="2.5"
          />

          <rect
            x="18"
            y="18"
            width="130"
            height="94"
            rx="18"
            fill="#0284C7"
          />

          <rect
            x="24"
            y="24"
            width="118"
            height="82"
            rx="14"
            fill="url(#screenGoldGrad)"
          />

          <polygon
            points="32,24 68,24 38,106 24,106 24,42"
            fill="#FEF9C3"
            opacity="0.35"
          />

          {currentExpr.label === 'HAPPY' ? (
            <g>
              <path
                d="M44 50 L64 62 L44 74"
                stroke="#312E81"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M122 50 L102 62 L122 74"
                stroke="#312E81"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse cx="42" cy="84" rx="8" ry="4" fill="#F43F5E" opacity="0.55" />
              <ellipse cx="124" cy="84" rx="8" ry="4" fill="#F43F5E" opacity="0.55" />
            </g>
          ) : (
            <g>
              <text
                x="83"
                y="68"
                textAnchor="middle"
                fill="#312E81"
                fontSize="28"
                fontWeight="bold"
              >
                {currentExpr.leftEye} {currentExpr.rightEye}
              </text>
              <text
                x="83"
                y="94"
                textAnchor="middle"
                fill="#1E1B4B"
                fontSize="11"
                fontWeight="bold"
              >
                {currentExpr.subText}
              </text>
            </g>
          )}

          <g transform="translate(26, 130)">
            <rect x="20" y="4" width="20" height="56" rx="6" fill="#059669" />
            <rect x="2" y="22" width="56" height="20" rx="6" fill="#059669" />
            <rect x="18" y="0" width="20" height="56" rx="6" fill="#6EE7B7" />
            <rect x="0" y="18" width="56" height="20" rx="6" fill="#6EE7B7" />
          </g>

          <g transform="translate(100, 134)">
            <circle cx="34" cy="16" r="12" fill="#059669" />
            <circle cx="32" cy="12" r="12" fill="#6EE7B7" />
            <circle cx="12" cy="42" r="12" fill="#059669" />
            <circle cx="10" cy="38" r="12" fill="#6EE7B7" />
          </g>

          <line
            x1="158"
            y1="150"
            x2="165"
            y2="155"
            stroke="#1E1B4B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="158"
            y1="160"
            x2="165"
            y2="165"
            stroke="#1E1B4B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="158"
            y1="170"
            x2="165"
            y2="175"
            stroke="#1E1B4B"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className="mt-1 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-950/80 border border-cyan-400/40 px-3 py-1 font-heading text-[11px] font-bold text-cyan-200 shadow-md backdrop-blur-md group-hover:border-yellow-300 group-hover:text-yellow-300">
          🎮 Klik Gamepad: {currentExpr.subText}
        </span>
      </div>
    </div>
  );
};

/**
 * 8. EMPAT IKON 3D BULAT UNTUK MODUL SAINS BINTANG EDU DI BAGIAN BAWAH
 */
export const IconPopulerSains3D: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 drop-shadow-md"
  >
    <circle cx="60" cy="62" r="48" fill="#FB923C" opacity="0.2" />
    <circle cx="60" cy="60" r="42" fill="#FB923C" />
    <path
      d="M60 14 L73 39 L101 43 L80 62 L85 90 L60 76 L35 90 L40 62 L19 43 L47 39 Z"
      fill="#FACC15"
      stroke="#FEF08A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <polygon points="54,45 71,55 54,65" fill="#1E3A8A" />
  </svg>
);

export const IconKuisGamifikasi3D: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 drop-shadow-md"
  >
    <circle cx="60" cy="62" r="48" fill="#38BDF8" opacity="0.22" />
    <circle cx="60" cy="60" r="42" fill="#0EA5E9" />
    <polygon points="28,74 60,58 92,74 60,90" fill="#E0F2FE" />
    <polygon points="28,74 60,90 60,102 28,86" fill="#7DD3FC" />
    <polygon points="92,74 60,90 60,102 92,86" fill="#0284C7" />
    <ellipse cx="45" cy="75" rx="6" ry="3.5" fill="#FACC15" />
    <line
      x1="64"
      y1="72"
      x2="72"
      y2="38"
      stroke="#1E3A8A"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    <circle cx="74" cy="30" r="15" fill="#FACC15" />
    <circle cx="69" cy="25" r="4.5" fill="#FEF08A" />
  </svg>
);

export const IconAIGenerator3D: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 drop-shadow-md"
  >
    <circle cx="60" cy="62" r="48" fill="#34D399" opacity="0.22" />
    <circle cx="60" cy="60" r="42" fill="#10B981" />
    <polygon
      points="26,84 68,68 96,86 52,102"
      fill="#FFFFFF"
      stroke="#A7F3D0"
      strokeWidth="1.5"
    />
    <circle
      cx="64"
      cy="85"
      r="7"
      stroke="#059669"
      strokeWidth="2"
      fill="none"
    />
    <g transform="rotate(-22 52 52)">
      <rect x="39" y="18" width="22" height="45" rx="4" fill="#F97316" />
      <rect x="39" y="12" width="22" height="9" rx="4" fill="#FACC15" />
      <polygon points="39,63 61,63 50,82" fill="#FDE68A" />
      <polygon points="46,75 54,75 50,82" fill="#1E3A8A" />
    </g>
  </svg>
);

export const IconMultiSensori3D: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 drop-shadow-md"
  >
    <circle cx="60" cy="62" r="48" fill="#A855F7" opacity="0.22" />
    <circle cx="60" cy="60" r="42" fill="#9333EA" />
    <g transform="rotate(-10 46 46)">
      <rect x="22" y="20" width="44" height="44" rx="12" fill="#FACC15" />
      <path
        d="M44 30 L48 38 L57 39 L50 45 L52 54 L44 49 L36 54 L38 45 L31 39 L40 38 Z"
        fill="#FFFFFF"
      />
    </g>
    <g transform="rotate(12 82 64)">
      <rect x="65" y="45" width="29" height="29" rx="8" fill="#10B981" />
      <polygon points="76,54 86,60 76,66" fill="#FFFFFF" />
    </g>
    <g transform="rotate(-8 56 86)">
      <rect x="42" y="69" width="27" height="27" rx="8" fill="#38BDF8" />
      <circle cx="56" cy="82" r="5.5" fill="#FFFFFF" />
    </g>
  </svg>
);

export const AppBannerMascotTablet: React.FC = () => (
  <div className="relative flex items-center justify-center w-56 h-44 sm:w-64 sm:h-48 select-none">
    <div className="absolute -left-2 top-4 h-6 w-6 rounded-full border-2 border-sky-200" />
    <div className="absolute left-6 bottom-2 h-3 w-3 rounded-full bg-yellow-300" />

    <div className="relative z-10 -mr-6 mb-2 w-36 h-36 sm:w-40 sm:h-40 transform -rotate-3">
      <BintangEduMascot className="w-full h-full" withBadge={false} />
    </div>

    <svg
      viewBox="0 0 120 95"
      className="relative z-20 w-28 h-24 sm:w-32 sm:h-28 drop-shadow-lg mt-10"
    >
      <ellipse cx="60" cy="86" rx="50" ry="5.5" fill="#DBEAFE" />
      <polygon
        points="18,16 106,12 96,80 8,84"
        fill="#0EA5E9"
        stroke="#0284C7"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon points="23,22 100,18 91,75 14,79" fill="#E0F2FE" />
      <polygon points="45,48 82,46 88,83 38,85" fill="#2563EB" />
    </svg>
  </div>
);
