import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmblemLogo } from './EmblemLogo';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CinematicSplashProps {
  onComplete: () => void;
  showGetStartedButton?: boolean;
}

export const CinematicSplash: React.FC<CinematicSplashProps> = ({
  onComplete,
  showGetStartedButton = true
}) => {
  const { t } = useApp();
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Check prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }

    // Sequence timer: 3.2 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 60);

    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 1800);

    const autoFinishTimer = setTimeout(() => {
      if (!showGetStartedButton) {
        onComplete();
      }
    }, 3400);

    return () => {
      clearInterval(interval);
      clearTimeout(skipTimer);
      clearTimeout(autoFinishTimer);
    };
  }, [onComplete, showGetStartedButton]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 bg-[#080808] flex flex-col justify-between items-center overflow-hidden px-6 py-10 select-none"
    >
      {/* 1 & 2: Ambient Orange Glow in Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.65, scale: 1.1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute top-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-b from-[#FF6A00]/25 via-[#FF790F]/10 to-transparent blur-[85px] pointer-events-none"
      />

      {/* Atmospheric Horizon Light */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="absolute bottom-1/4 inset-x-0 h-44 bg-gradient-to-t from-[#FF6A00]/20 via-[#FF9D2E]/5 to-transparent blur-2xl pointer-events-none"
      />

      {/* Subtle Campus Silhouette Graphic in Background */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ delay: 0.6, duration: 1.4 }}
        className="absolute bottom-28 inset-x-0 flex justify-center pointer-events-none overflow-hidden"
      >
        <svg
          viewBox="0 0 1000 240"
          className="w-full max-w-2xl h-auto text-[#181818] fill-current opacity-60"
        >
          {/* Distant campus library, clock tower, hall roofs */}
          <rect x="0" y="200" width="1000" height="40" fill="#121212" />
          <path d="M 680 80 L 720 80 L 720 200 L 680 200 Z" />
          <polygon points="700,50 675,80 725,80" />
          {/* Clock tower face glow */}
          <circle cx="700" cy="110" r="10" fill="#FF9D2E" fillOpacity="0.7" />
          <rect x="620" y="140" width="60" height="60" />
          <rect x="720" y="130" width="80" height="70" />
          <polygon points="650,115 620,140 680,140" />
          <rect x="250" y="140" width="140" height="60" />
          <polygon points="320,120 240,140 400,140" />
          <rect x="420" y="160" width="100" height="40" />
        </svg>
      </motion.div>

      {/* Center Branding Block */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-sm mt-8">
        {/* 3: Animated Route Emblem */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-5"
        >
          <EmblemLogo size="lg" glow={true} />
        </motion.div>

        {/* 4: Wordmark Reveal ("or" in white, "Bus" in orange) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
          className="flex items-center tracking-tight"
        >
          <span className="text-4xl font-extrabold text-white tracking-tight">or</span>
          <span className="text-4xl font-extrabold text-[#FF6A00] ml-0.5 tracking-tight">Bus</span>
        </motion.div>

        {/* 5: Tagline Reveal */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="text-base text-white/90 font-medium tracking-wide mt-2.5 text-center"
        >
          Know your bus. Know your bay.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="text-sm text-[#A6A6A6] mt-0.5"
        >
          Reach home easier.
        </motion.p>
      </div>

      {/* 6 & 7: Cinematic Route Line & Bus with Light Trails */}
      <div className="w-full max-w-md h-36 relative mb-4 z-10 flex flex-col justify-end">
        <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="routeTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6A00" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF790F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFA63D" stopOpacity="1" />
            </linearGradient>

            <filter id="trailGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glowing Curved Route Path */}
          <motion.path
            d="M 10 95 C 110 95, 170 65, 260 55 C 330 45, 370 70, 395 75"
            fill="none"
            stroke="url(#routeTrailGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#trailGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 1.6, ease: 'easeInOut' }}
          />

          {/* Secondary Light Reflection Trail */}
          <motion.path
            d="M 10 99 C 110 99, 170 69, 260 59 C 330 49, 370 74, 395 79"
            fill="none"
            stroke="#FF6A00"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.1, duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Animated Bus Silhouette Moving Along Route */}
          <motion.g
            initial={{ x: 30, y: 70, opacity: 0, scale: 0.85 }}
            animate={{ x: 250, y: 35, opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 1.8, ease: 'easeInOut' }}
          >
            {/* Bus Rear Glow */}
            <circle cx="2" cy="12" r="10" fill="#FF4D4D" opacity="0.6" filter="blur(4px)" />
            {/* Bus Body Silhouette */}
            <rect x="0" y="0" width="34" height="20" rx="4" fill="#1C1C1E" stroke="#FF790F" strokeWidth="1.2" />
            {/* Bus Windows */}
            <rect x="4" y="3" width="7" height="6" rx="1.5" fill="#FF9D2E" fillOpacity="0.75" />
            <rect x="13" y="3" width="7" height="6" rx="1.5" fill="#FF9D2E" fillOpacity="0.75" />
            <rect x="22" y="3" width="8" height="6" rx="1.5" fill="#FF9D2E" fillOpacity="0.75" />
            {/* Headlights Stream */}
            <polygon points="34,14 62,6 62,26" fill="url(#routeTrailGrad)" opacity="0.45" />
            {/* Bus Wheels */}
            <circle cx="8" cy="20" r="3" fill="#0D0D0D" stroke="#555" strokeWidth="1" />
            <circle cx="26" cy="20" r="3" fill="#0D0D0D" stroke="#555" strokeWidth="1" />
            {/* Route Number Badge on Bus */}
            <text x="5" y="15" fill="#FFF" fontSize="5" fontWeight="bold">MP05</text>
          </motion.g>
        </svg>
      </div>

      {/* 8: Bottom Loading Indicator & Action */}
      <div className="w-full max-w-xs flex flex-col items-center z-20 pb-4">
        {/* Slim Orange Loading Indicator */}
        <div className="w-full h-1 bg-[#222222] rounded-full overflow-hidden mb-5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6A00] to-[#FF9D2E] rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Get Started or Instant Skip Button */}
        <AnimatePresence>
          {showGetStartedButton ? (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: canSkip ? 1 : 0.7, y: 0 }}
              whileTap={{ scale: 0.96 }}
              onClick={onComplete}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF790F] text-white font-bold text-base shadow-[0_0_25px_rgba(255,106,0,0.4)] flex items-center justify-center gap-2 transition-all hover:brightness-110 active:brightness-95 cursor-pointer"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: canSkip ? 0.7 : 0 }}
              onClick={onComplete}
              className="text-xs text-[#A6A6A6] hover:text-white py-2 px-4 transition-colors cursor-pointer"
            >
              {t('skipIntro')}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
