import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  MapPin,
  ChevronDown,
  Bus,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { UserSession, SearchResult } from '../types';
import { StorageService } from '../services/storageService';
import { findBusesForJourney } from '../utils/searchHelper';
import { BusCard } from '../components/BusCard';
import { BusChangeNotice } from '../components/BusChangeNotice';
import { StopPickerModal } from '../components/StopPickerModal';
import { NotificationModal } from '../components/NotificationModal';
import { useApp } from '../context/AppContext';
import { COLLEGE_DISPLAY_EN } from '../utils/collegeHelper';

interface HomeScreenProps {
  session: UserSession;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ session }) => {
  const { t, formatStop } = useApp();
  const source = COLLEGE_DISPLAY_EN;
  const [destination, setDestination] = useState<string>(() => {
    const recents = StorageService.getRecentSearches();
    return recents[0] || 'Bairagarh Bus Stand';
  });
  const [recentDestinations, setRecentDestinations] = useState<string[]>(() => {
    return StorageService.getRecentSearches();
  });

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Modals state
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const performSearch = (dest: string = destination) => {
    if (!dest.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Save destination stop to recents
    StorageService.addRecentSearch(dest);
    setRecentDestinations(StorageService.getRecentSearches());

    // Brief realistic loading animation (400ms)
    setTimeout(() => {
      const results = findBusesForJourney(source, dest);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);
  };

  const handleSelectRecent = (recent: string) => {
    setDestination(recent);
    performSearch(recent);
  };

  // Determine greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetingGoodMorning');
    if (hour < 17) return t('greetingGoodAfternoon');
    return t('greetingGoodEvening');
  };

  const displayName = session.username
    ? session.username.charAt(0).toUpperCase() + session.username.slice(1)
    : t('student');

  return (
    <div className="min-h-screen app-bg pb-28 px-4 pt-4 max-w-md mx-auto select-none overflow-x-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2.5">
          {/* Orange rounded square with white bus icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6A00] to-[#FF790F] flex items-center justify-center shadow-[0_0_15px_rgba(255,106,0,0.4)]">
            <Bus size={19} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight app-text-primary block leading-tight">
              or<span className="text-[#FF6A00]">Bus</span>
            </span>
            <span className="text-[10px] app-text-muted font-medium block">
              {t('orientalCollege')}, Bhopal
            </span>
          </div>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setIsNotificationOpen(true)}
          className="relative w-10 h-10 rounded-xl app-card flex items-center justify-center hover:border-[#FF6A00] transition-colors cursor-pointer"
          aria-label={t('notificationsTitle')}
        >
          <Bell size={18} className="app-text-primary" />
          {/* Unread badge dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF6A00] ring-2 ring-[var(--card-surface)]" />
        </button>
      </header>

      {/* GREETING */}
      <div className="mt-4 mb-5">
        <h1 className="text-xl font-bold app-text-primary flex items-center gap-1.5">
          <span>{getGreeting()} {displayName}</span>
          <span className="text-xl">👋</span>
        </h1>
        <p className="text-xs app-text-secondary mt-0.5">
          {t('greetingSubtitle')}
        </p>
      </div>

      {/* SEARCH CARD CONTAINER */}
      <div className="app-card rounded-2xl p-4 shadow-xl">
        {/* FROM Section (Fixed to Oriental College) */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="text-[#FF6A00]">
              <MapPin size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-bold app-text-muted tracking-wider uppercase">
                {t('labelFrom')}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold app-text-primary truncate block max-w-[240px]">
                  {formatStop(source)}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF6A00]/15 text-[#FF6A00] tracking-wide">
                  Central Campus
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider between FROM and TO */}
        <div className="app-divider border-t my-2" />

        {/* TO Picker Row (Searchable list of available stops) */}
        <div
          onClick={() => setIsDestModalOpen(true)}
          className="flex items-center justify-between py-2 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="text-[#FF790F]">
              <MapPin size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-bold app-text-muted tracking-wider uppercase">
                {t('labelTo')}
              </span>
              <span className="text-sm font-semibold app-text-primary group-hover:text-[#FF9D2E] transition-colors truncate block max-w-[240px]">
                {formatStop(destination)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChevronDown size={17} className="app-text-muted group-hover:app-text-primary" />
          </div>
        </div>

        {/* SEARCH BUS Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => performSearch()}
          className="w-full h-12 mt-3 rounded-xl bg-[#FF6A00] hover:bg-[#FF790F] text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(255,106,0,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:brightness-95"
        >
          {isSearching ? (
            <>
              <Loader2 size={18} className="animate-spin text-white" />
              <span>{t('findingBuses')}</span>
            </>
          ) : (
            <span>{t('searchBusBtn')}</span>
          )}
        </motion.button>
      </div>

      {/* BEFORE SEARCH: Show Recent Destinations below Search Bus button */}
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold app-text-muted uppercase tracking-wider">
            <Clock size={13} />
            <span>{t('recentDestinations')}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentDestinations.map(dest => (
              <button
                key={dest}
                type="button"
                onClick={() => handleSelectRecent(dest)}
                className="py-2 px-3.5 rounded-xl app-tag text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin size={12} className="text-[#FF790F]" />
                <span>{formatStop(dest)}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* LOADING STATE */}
      {isSearching && (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-400/20 border-t-[#FF6A00] animate-spin mb-3" />
          <span className="text-xs app-text-secondary font-medium tracking-wide">
            {t('scanningRoutes')}
          </span>
        </div>
      )}

      {/* SEARCH RESULTS SECTION */}
      {!isSearching && hasSearched && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold app-text-muted uppercase tracking-wider">
              {searchResults.length} {searchResults.length === 1 ? t('busServingRoute') : t('busesServingRoute')}
            </span>
            <button
              onClick={() => setHasSearched(false)}
              className="text-xs text-[#FF790F] hover:underline cursor-pointer"
            >
              {t('clearSearch')}
            </button>
          </div>

          {/* Bus Cards */}
          {searchResults.map(result => (
            <React.Fragment key={result.route.id}>
              <BusCard searchResult={result} />

              {/* YESTERDAY VS TODAY NOTICE */}
              {result.hasBusChanged && result.yesterdayBus && result.todayBus && (
                <BusChangeNotice
                  yesterdayBus={result.yesterdayBus}
                  todayBus={result.todayBus}
                  destination={destination}
                />
              )}
            </React.Fragment>
          ))}

          {/* Empty State */}
          {searchResults.length === 0 && (
            <div className="app-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF4D4D]/15 text-[#FF4D4D] mx-auto flex items-center justify-center mb-3">
                <AlertCircle size={22} />
              </div>
              <h4 className="text-base font-bold app-text-primary">
                {t('noBusesFound')}
              </h4>
              <p className="text-xs app-text-secondary mt-1 max-w-xs mx-auto leading-relaxed">
                {t('noBusesDesc')}
              </p>
              <button
                onClick={() => setIsDestModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl app-tag text-xs font-semibold app-text-primary transition-colors cursor-pointer"
              >
                {t('browseStops')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* DESTINATION MODAL */}
      <StopPickerModal
        isOpen={isDestModalOpen}
        onClose={() => setIsDestModalOpen(false)}
        onSelect={val => {
          setDestination(val);
          performSearch(val);
        }}
        title={t('selectDestTitle')}
        currentValue={destination}
        isOrigin={false}
      />

      {/* NOTIFICATION MODAL */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};
