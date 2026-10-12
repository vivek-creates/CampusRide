import React from 'react';

interface EmblemLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withContainer?: boolean;
  glow?: boolean;
  className?: string;
}

export const EmblemLogo: React.FC<EmblemLogoProps> = ({
  size = 'md',
  withContainer = true,
  glow = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-10 h-10', svg: 24, radius: 'rounded-xl' },
    md: { box: 'w-16 h-16', svg: 40, radius: 'rounded-2xl' },
    lg: { box: 'w-24 h-24', svg: 64, radius: 'rounded-3xl' },
    xl: { box: 'w-32 h-32', svg: 88, radius: 'rounded-3xl' },
  };

  const { box, svg, radius } = sizeMap[size];

  const svgContent = (
    <svg
      width={svg}
      height={svg}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transform transition-transform duration-300"
    >
      <defs>
        <linearGradient id="emblemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA63D" />
          <stop offset="45%" stopColor="#FF790F" />
          <stop offset="100%" stopColor="#FF5500" />
        </linearGradient>

        <linearGradient id="roadRibbonGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FF5500" />
          <stop offset="60%" stopColor="#FF851A" />
          <stop offset="100%" stopColor="#FFC27A" />
        </linearGradient>

        <filter id="orangeEmblemGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Stylized "C" Highway Loop */}
      <path
        d="M 72 20 C 40 18 18 36 18 56 C 18 76 40 88 70 84 C 77 83 82 79 82 79 C 75 81 64 81 55 77 C 38 72 30 62 30 52 C 30 40 42 29 60 28 C 72 27 80 32 80 32 C 80 32 78 20 72 20 Z"
        fill="url(#emblemGradient)"
        filter={glow ? 'url(#orangeEmblemGlow)' : undefined}
      />

      {/* Sweeping Dynamic Highway Perspective Band */}
      <path
        d="M 28 62 C 42 64 60 55 82 43 C 80 47 70 54 58 60 C 44 67 32 66 28 62 Z"
        fill="#0D0D0D"
        opacity="0.9"
      />

      {/* Road Lane Markings */}
      <path
        d="M 40 61 C 48 59 56 55 68 49"
        stroke="#FFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 6"
        opacity="0.9"
      />

      {/* Upper Speed Accent */}
      <path
        d="M 48 38 C 58 35 68 36 76 39"
        stroke="url(#roadRibbonGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );

  if (!withContainer) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{svgContent}</div>;
  }

  return (
    <div
      className={`relative ${box} ${radius} bg-[#141414]/90 border border-[#2A2A2A] shadow-2xl flex items-center justify-center backdrop-blur-md overflow-hidden ${
        glow ? 'shadow-[0_0_35px_rgba(255,106,0,0.3)]' : ''
      } ${className}`}
    >
      {/* Subtle orange inner top highlight */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#FF790F]/15 to-transparent pointer-events-none" />
      {svgContent}
    </div>
  );
};
