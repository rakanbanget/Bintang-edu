import React from 'react';

interface BintangEduMascotProps {
  className?: string;
  withBadge?: boolean;
}

/**
 * Logo Resmi Bintang Edu:
 * Maskot bintang kuning cerah bertoga akademik biru tua,
 * membawa buku sains biru terbuka dengan 3 sinar prestasi.
 */
export const BintangEduMascot: React.FC<BintangEduMascotProps> = ({
  className = 'w-11 h-11',
  withBadge = true,
}) => {
  const svgContent = (
    <svg
      viewBox="0 0 140 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-label="Logo Bintang Edu"
    >
      {/* Tiga Sinar Prestasi di Kanan Atas */}
      <rect
        x="94"
        y="12"
        width="8"
        height="22"
        rx="4"
        transform="rotate(25 94 12)"
        fill="#F59E0B"
      />
      <rect
        x="109"
        y="24"
        width="8"
        height="20"
        rx="4"
        transform="rotate(48 109 24)"
        fill="#22C55E"
      />
      <rect
        x="118"
        y="42"
        width="8"
        height="18"
        rx="4"
        transform="rotate(68 118 42)"
        fill="#38BDF8"
      />

      {/* Bintang Kuning Cerah */}
      <path
        d="M66 20 C69 14, 76 14, 79 20 L89 39 C91 42, 94 44, 98 44 L117 47 C124 48, 126 55, 121 60 L106 74 C104 77, 103 80, 103 84 L107 104 C108 110, 102 114, 96 111 L77 101 C74 99, 70 99, 67 101 L48 111 C42 114, 36 110, 37 104 L41 84 C41 80, 40 77, 38 74 L23 60 C18 55, 20 48, 27 47 L46 44 C50 44, 53 42, 55 39 L66 20 Z"
        fill="#FACC15"
      />

      {/* Mata Ramah */}
      <ellipse cx="56" cy="64" rx="5" ry="7" fill="#0B3B8C" />
      <circle cx="54.2" cy="61.2" r="2" fill="#FFFFFF" />

      <ellipse cx="86" cy="62" rx="5" ry="7" fill="#0B3B8C" />
      <circle cx="84.2" cy="59.2" r="2" fill="#FFFFFF" />

      {/* Senyum Ceria */}
      <path
        d="M62 71 C67 72, 75 71, 80 70 C81 79, 77 85, 71 85 C65 85, 61 79, 62 71 Z"
        fill="#0B3B8C"
      />
      <path
        d="M65 79 C68 76, 74 76, 77 79 C76 83, 73 85, 71 85 C68 85, 66 83, 65 79 Z"
        fill="#F97316"
      />

      {/* Toga Akademik Biru Tua */}
      <g transform="rotate(-17 55 24)">
        <path
          d="M37 25 L73 25 L70 36 C62 40, 48 40, 40 36 L37 25 Z"
          fill="#0A327A"
        />
        <polygon
          points="55,10 86,21 55,32 24,21"
          fill="#1D4ED8"
          stroke="#3B82F6"
          strokeWidth="1"
        />
        <path
          d="M32 23 L27 39"
          stroke="#0A327A"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="26.5" cy="41" r="4" fill="#1D4ED8" />
      </g>

      {/* Buku Sains Biru Terbuka */}
      <path
        d="M14 76 C32 76, 52 84, 68 99 L68 127 C52 114, 32 106, 16 104 C13 103, 11 100, 11 97 L11 79 C11 77, 12 76, 14 76 Z"
        fill="#2563EB"
      />
      <path
        d="M126 76 C108 76, 88 84, 72 99 L72 127 C88 114, 108 106, 124 104 C127 103, 129 100, 129 97 L129 79 C129 77, 128 76, 126 76 Z"
        fill="#38BDF8"
      />
    </svg>
  );

  if (!withBadge) {
    return <div className={`relative select-none ${className}`}>{svgContent}</div>;
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl border border-yellow-300/60 bg-indigo-950/80 p-1.5 shadow-[0_0_20px_rgba(250,204,21,0.25)] backdrop-blur-md ${className}`}
    >
      {svgContent}
    </div>
  );
};
