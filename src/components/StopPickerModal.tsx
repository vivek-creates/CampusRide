import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Search, X, MapPin, Building, Check } from 'lucide-react';
import { getAllUniqueStops } from '../data/routesData';
import { normalizeString } from '../utils/searchHelper';
import { useApp } from '../context/AppContext';
import { isCollegeStop, COLLEGE_DISPLAY_EN } from '../utils/collegeHelper';

interface StopPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (stop: string) => void;
  title: string;
  currentValue: string;
  isOrigin?: boolean;
}

export const StopPickerModal: React.FC<StopPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title,
  currentValue,
  isOrigin = false
}) => {
  const { t, formatStop } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Guard flag to prevent duplicate close calls and freeze viewport during exit animation
  const isClosingRef = useRef(false);

  // Track visual viewport on mobile devices when virtual keyboard opens/closes
  const [viewportState, setViewportState] = useState<{ height: number; offsetTop: number } | null>(null);

  // Scroll position and body styles references for robust scroll locking
  const scrollYRef = useRef(0);
  const originalBodyStylesRef = useRef<{
    overflow: string;
    position: string;
    top: string;
    width: string;
  } | null>(null);

  const lockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    scrollYRef.current = window.scrollY;
    originalBodyStylesRef.current = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width
    };
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';
  };

  const unlockBodyScroll = () => {
    if (typeof document === 'undefined' || !originalBodyStylesRef.current) return;
    const { overflow, position, top, width } = originalBodyStylesRef.current;
    document.body.style.overflow = overflow;
    document.body.style.position = position;
    document.body.style.top = top;
    document.body.style.width = width;
    const restoreY = scrollYRef.current;
    originalBodyStylesRef.current = null;
    window.scrollTo(0, restoreY);
  };

  // Lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      lockBodyScroll();
    }
  }, [isOpen]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      unlockBodyScroll();
    };
  }, []);

  // Mobile visual viewport listener for keyboard appearance
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const updateViewport = () => {
      // Freeze viewport measurements during closing transition to prevent layout jumps as keyboard dismisses
      if (isClosingRef.current) return;
      if (window.visualViewport) {
        setViewportState({
          height: window.visualViewport.height,
          offsetTop: window.visualViewport.offsetTop
        });
      }
    };

    updateViewport();
    window.visualViewport?.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('scroll', updateViewport);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('scroll', updateViewport);
    };
  }, [isOpen]);

  // Smooth focus on input without forcing browser window jump/scroll
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      const timer = setTimeout(() => {
        if (!isClosingRef.current) {
          inputRef.current?.focus({ preventScroll: true });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const allStops = useMemo(() => {
    return getAllUniqueStops();
  }, []);

  const filteredStops = useMemo(() => {
    if (!searchQuery.trim()) {
      return allStops;
    }
    const norm = normalizeString(searchQuery);
    return allStops.filter(stop => {
      const formatted = formatStop(stop);
      return normalizeString(stop).includes(norm) || normalizeString(formatted).includes(norm);
    });
  }, [allStops, searchQuery, formatStop]);

  const showOrientalCollegeOption = useMemo(() => {
    if (!searchQuery.trim()) return true;
    const norm = normalizeString(searchQuery);
    return (
      'oriental college'.includes(norm) ||
      'college'.includes(norm) ||
      t('orientalCollege').toLowerCase().includes(norm)
    );
  }, [searchQuery, t]);

  const isCurrentCollege = isCollegeStop(currentValue);

  // Smooth stop selection handler
  const handleSelectStop = (stop: string) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // 1. Immediately apply the selected stop
    onSelect(stop);

    // 2. Immediately dismiss the keyboard
    inputRef.current?.blur();

    // 3. Close the modal
    onClose();
  };

  // Close handler for close button, backdrop tap, and escape
  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    inputRef.current?.blur();
    onClose();
  };

  // Complete exit transition: unlock body scroll and reset search state cleanly
  const handleExitComplete = () => {
    unlockBodyScroll();
    setSearchQuery('');
    isClosingRef.current = false;
  };

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const modalVariants: Variants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 24
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 16,
      transition: { duration: 0.18, ease: 'easeIn' }
    }
  };

  const backdropVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <div
          className="fixed inset-x-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none"
          style={{
            top: viewportState ? `${viewportState.offsetTop}px` : 0,
            height: viewportState ? `${viewportState.height}px` : '100dvh',
            bottom: viewportState ? 'auto' : 0
          }}
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal / Bottom-Sheet Card */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-lg app-card rounded-t-3xl sm:rounded-3xl h-[82dvh] max-h-full sm:h-[580px] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header - Fixed & Stationary */}
            <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-3 app-divider border-b">
              <div>
                <h3 className="text-base font-bold app-text-primary">{title}</h3>
                <p className="text-xs app-text-secondary mt-0.5">
                  {t('chooseBhopalStops')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full app-tag flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar - Fixed & Stationary */}
            <div className="shrink-0 px-5 py-3 app-divider border-b">
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3.5 app-text-muted pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (filteredStops.length > 0) {
                        handleSelectStop(filteredStops[0]);
                      } else if (showOrientalCollegeOption) {
                        handleSelectStop(COLLEGE_DISPLAY_EN);
                      } else {
                        inputRef.current?.blur();
                      }
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      handleClose();
                    }
                  }}
                  placeholder={t('searchStopPlaceholder')}
                  enterKeyHint="done"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full h-11 pl-10 pr-10 rounded-xl app-input text-sm placeholder:app-text-muted focus:border-[#FF6A00] outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className="absolute right-3 app-text-muted hover:app-text-primary p-1 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Stop List - Flexible & Independently Scrollable */}
            <div
              className="flex-1 min-h-0 overflow-y-auto px-4 py-2 divide-y app-divider overscroll-contain"
              style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))' }}
            >
              {/* Quick Option: Oriental College */}
              {showOrientalCollegeOption && (
                <button
                  type="button"
                  onClick={() => handleSelectStop(COLLEGE_DISPLAY_EN)}
                  className={`w-full py-3 px-3 my-1 rounded-xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer active:brightness-95 ${
                    isCurrentCollege
                      ? 'bg-[#FF6A00]/15 text-[#FF9D2E] border border-[#FF6A00]/40'
                      : 'hover:bg-[#FF6A00]/5 active:bg-[#FF6A00]/10 app-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FF6A00]/20 text-[#FF790F] flex items-center justify-center shrink-0">
                      <Building size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-sm block">
                        {formatStop('COLLEGE')}
                      </span>
                      <span className="block text-[11px] app-text-secondary">
                        {t('orientalCollegeCampusDesc')}
                      </span>
                    </div>
                  </div>
                  {isCurrentCollege && <Check size={16} className="text-[#FF790F]" />}
                </button>
              )}

              {filteredStops.map(stop => {
                if (stop === 'COLLEGE') return null; // Represented by Oriental College above
                const isSelected = currentValue.toUpperCase() === stop.toUpperCase();

                return (
                  <button
                    key={stop}
                    type="button"
                    onClick={() => handleSelectStop(stop)}
                    className={`w-full py-3 px-3 rounded-xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer active:brightness-95 ${
                      isSelected
                        ? 'bg-[#FF6A00]/15 text-[#FF9D2E] border border-[#FF6A00]/40'
                        : 'hover:bg-[#FF6A00]/5 active:bg-[#FF6A00]/10 app-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg app-tag flex items-center justify-center shrink-0">
                        <MapPin size={14} className={isSelected ? 'text-[#FF790F]' : ''} />
                      </div>
                      <span className="text-sm font-medium">{stop}</span>
                    </div>
                    {isSelected && <Check size={16} className="text-[#FF790F]" />}
                  </button>
                );
              })}

              {/* Empty State */}
              {filteredStops.length === 0 && !showOrientalCollegeOption && (
                <div className="py-12 text-center app-text-muted">
                  <p className="text-sm">{t('noStopFound', { query: searchQuery })}</p>
                  <p className="text-xs mt-1">
                    {t('checkSpelling')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
