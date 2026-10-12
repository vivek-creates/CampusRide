import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BusChangeNoticeProps {
  yesterdayBus: string;
  todayBus: string;
  destination: string;
}

export const BusChangeNotice: React.FC<BusChangeNoticeProps> = ({
  yesterdayBus,
  todayBus,
  destination
}) => {
  const { t, formatStop } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full app-card border border-[#FF6A00]/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,106,0,0.15)] my-4 select-none"
    >
      {/* Header with cycling icon and orange label */}
      <div className="flex items-center gap-2 mb-2">
        <RefreshCw size={16} className="text-[#FF790F] animate-spin-slow" />
        <span className="text-xs font-bold text-[#FF790F] tracking-wider uppercase">
          {t('busChangeNotice')}
        </span>
      </div>

      <h4 className="text-base font-bold app-text-primary mb-4">
        {t('busChangedToday')}
      </h4>

      {/* Yesterday vs Today side-by-side comparison */}
      <div className="flex items-center justify-between gap-3 my-2">
        {/* Yesterday Box */}
        <div className="flex-1 app-input rounded-xl p-3 text-center">
          <span className="block text-[10px] font-semibold app-text-muted tracking-wider uppercase mb-1">
            {t('yesterday')}
          </span>
          <span className="text-lg font-bold app-text-primary tracking-wide">
            {yesterdayBus}
          </span>
        </div>

        {/* Transition Arrow */}
        <div className="text-[#FF790F] shrink-0">
          <ArrowRight size={20} />
        </div>

        {/* Today Box */}
        <div className="flex-1 app-input border border-[#FF790F]/40 rounded-xl p-3 text-center shadow-[0_0_12px_rgba(255,106,0,0.12)]">
          <span className="block text-[10px] font-semibold text-[#FF9D2E] tracking-wider uppercase mb-1">
            {t('today')}
          </span>
          <span className="text-lg font-bold text-[#FF790F] tracking-wide">
            {todayBus}
          </span>
        </div>
      </div>

      <p className="text-xs app-text-secondary mt-3">
        {t('busChangeDesc', { destination: formatStop(destination) })}
      </p>
    </motion.div>
  );
};
