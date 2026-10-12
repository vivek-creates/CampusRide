import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchResult } from '../types';
import { StorageService } from '../services/storageService';
import { Check, X, CheckCircle, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BusCardProps {
  searchResult: SearchResult;
  onVerified?: () => void;
}

export const BusCard: React.FC<BusCardProps> = ({ searchResult, onVerified }) => {
  const { t, formatStop } = useApp();
  const { route, source, destination, stops, matchedStopIndex } = searchResult;

  // Check if user already verified this bus in storage
  const [hasAnswered, setHasAnswered] = useState<boolean>(() => {
    return StorageService.hasVerifiedBus(route.busNumber);
  });
  const [feedbackGiven, setFeedbackGiven] = useState<'YES' | 'NO' | null>(null);
  const [showStopsList, setShowStopsList] = useState(false);

  const handleVerification = (answer: 'YES' | 'NO') => {
    StorageService.addVerification({
      busNumber: route.busNumber,
      routeNumber: route.routeNumber,
      assignedStand: route.assignedStand,
      userAnswer: answer
    });
    setHasAnswered(true);
    setFeedbackGiven(answer);
    if (onVerified) onVerified();
  };

  const getStatusBadge = () => {
    switch (route.boardingStatus) {
      case 'Boarding':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#35D07F]/15 border border-[#35D07F]/30 text-[#35D07F] tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] animate-pulse" />
            {t('statusBoarding')}
          </span>
        );
      case 'Preparing':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFB020]/15 border border-[#FFB020]/30 text-[#FFB020] tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB020]" />
            {t('statusPreparing')}
          </span>
        );
      case 'Departed':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-500/20 border border-gray-400/30 app-text-muted tracking-wide">
            {t('statusDeparted')}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 text-[#FF4D4D] tracking-wide">
            {t('statusCancelled')}
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full app-card rounded-2xl p-5 shadow-lg relative overflow-hidden select-none hover:border-[#FF6A00]/40 transition-colors"
    >
      {/* Subtle top orange sheen */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF6A00]/60 to-transparent" />

      {/* Top Header: "YOUR BUS" and Boarding Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold app-text-muted uppercase tracking-wider">
            {t('yourBus')}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded app-tag font-mono font-bold">
            {route.routeNumber}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Bus Number (e.g. Bus MP 0504) */}
      <h3 className="text-2xl font-extrabold app-text-primary tracking-tight mb-1">
        Bus {route.busNumber}
      </h3>

      {/* Journey String */}
      <div className="text-sm font-medium app-text-secondary flex items-center gap-1.5 mb-3">
        <span>{formatStop(source)}</span>
        <span className="text-[#FF790F] font-bold">→</span>
        <span className="app-text-primary font-semibold">{formatStop(destination)}</span>
      </div>

      {/* Route Progression Accordion Toggle */}
      <button
        type="button"
        onClick={() => setShowStopsList(!showStopsList)}
        className="w-full py-2 px-3 mb-4 rounded-xl app-input flex items-center justify-between text-xs app-text-secondary hover:app-text-primary transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5 font-medium">
          <MapPin size={13} className="text-[#FF790F]" />
          {t('stopsCount', { count: stops.length, index: matchedStopIndex + 1 })}
        </span>
        {showStopsList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expandable Stops Preview */}
      <AnimatePresence>
        {showStopsList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4 app-input p-3 rounded-xl"
          >
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {stops.map((stop, idx) => {
                const isSelected = idx === matchedStopIndex;
                const isFirst = idx === 0;
                const isLast = idx === stops.length - 1;

                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isSelected
                            ? 'bg-[#FF6A00] ring-4 ring-[#FF6A00]/30'
                            : isFirst || isLast
                            ? 'bg-[#FF790F]'
                            : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <span
                      className={`truncate ${
                        isSelected
                          ? 'text-[#FF9D2E] font-bold'
                          : isFirst || isLast
                          ? 'app-text-primary font-semibold'
                          : 'app-text-muted'
                      }`}
                    >
                      {formatStop(stop)} {isSelected && ` ${t('yourStop')}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider Line */}
      <div className="app-divider border-t my-4" />

      {/* ASSIGNED STAND & DEPARTURE Grid */}
      <div className="grid grid-cols-2 gap-4 pb-1">
        <div>
          <span className="block text-[11px] font-semibold app-text-muted uppercase tracking-wider mb-1">
            {t('assignedStand')}
          </span>
          <span className="text-xl font-extrabold text-[#FF6A00] tracking-tight">
            {route.assignedStand}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-[11px] font-semibold app-text-muted uppercase tracking-wider mb-1">
            {t('departure')}
          </span>
          <span className="text-xl font-extrabold app-text-primary tracking-tight">
            {route.departureTime}
          </span>
        </div>
      </div>

      {/* Verification Prompt & YES/NO Buttons */}
      <div className="mt-4 pt-3 app-divider border-t">
        {!hasAnswered ? (
          <div>
            <p className="text-xs font-semibold app-text-secondary mb-3">
              {t('isBusAtStand', { stand: route.assignedStand })}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleVerification('YES')}
                className="py-2.5 px-4 rounded-xl bg-[#35D07F]/15 border border-[#35D07F]/40 text-[#35D07F] font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all hover:bg-[#35D07F]/25 cursor-pointer shadow-sm"
              >
                <Check size={14} />
                <span>{t('btnYes')}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleVerification('NO')}
                className="py-2.5 px-4 rounded-xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 text-[#FF4D4D] font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all hover:bg-[#FF4D4D]/25 cursor-pointer shadow-sm"
              >
                <X size={14} />
                <span>{t('btnNo')}</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 py-1.5 px-3 rounded-xl app-tag text-[#35D07F] text-xs font-medium"
          >
            <CheckCircle size={15} className="shrink-0" />
            <span>{t('responseRecorded', { stand: route.assignedStand })}</span>
            {feedbackGiven && (
              <span className="ml-auto text-[10px] app-text-muted">
                {t('youVoted', { answer: feedbackGiven })}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
