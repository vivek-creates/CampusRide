import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Bell,
  Moon,
  HelpCircle,
  Bug,
  Info,
  LogOut,
  ChevronRight,
  Check,
  X,
  Play
} from 'lucide-react';
import { UserSession, StudentScoreData, AppTheme } from '../types';
import { StorageService } from '../services/storageService';
import { useApp } from '../context/AppContext';

interface ProfileScreenProps {
  session: UserSession;
  onLogout: () => void;
  onReplaySplash: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  session,
  onLogout,
  onReplaySplash
}) => {
  const { theme, setTheme, preferences, updatePreferences, t } = useApp();
  const [scoreData] = useState<StudentScoreData>(() => StorageService.getStudentScore());
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Active Modals
  const [activeModal, setActiveModal] = useState<'notifications' | 'theme' | 'help' | 'about' | 'report_bug' | null>(null);

  // Report Bug Form State
  const [bugCategory, setBugCategory] = useState<'ui' | 'search' | 'route' | 'other'>('ui');
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugError, setBugError] = useState<string | null>(null);
  const [bugSubmitted, setBugSubmitted] = useState(false);

  // Animated percentage count-up
  useEffect(() => {
    const target = scoreData.accuracyRate;
    let current = 0;
    const duration = 1200; // ms
    const stepTime = 25;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedPercent(target);
        clearInterval(timer);
      } else {
        setAnimatedPercent(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [scoreData.accuracyRate]);

  // Radius & circumference for circular progress ring
  const ringRadius = 38;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (circumference * scoreData.accuracyRate) / 100;

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDescription.trim()) {
      setBugError(t('bugDescriptionRequired'));
      return;
    }

    setBugError(null);
    StorageService.addFeedback({
      category: 'problem',
      title: bugTitle.trim() || `Bug: ${bugCategory.toUpperCase()}`,
      description: `[Bug Report - ${bugCategory}] ${bugDescription.trim()}`
    });

    setBugSubmitted(true);
    setTimeout(() => {
      setBugSubmitted(false);
      setBugTitle('');
      setBugDescription('');
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen app-bg pb-28 px-4 pt-4 max-w-md mx-auto select-none overflow-x-hidden">
      {/* Header */}
      <header className="py-3 mb-2">
        <h1 className="text-2xl font-bold tracking-tight app-text-primary">{t('myProfile')}</h1>
      </header>

      {/* User Header Profile Info */}
      <div className="flex flex-col items-center justify-center my-4 text-center">
        {/* User Avatar with Orange Outline */}
        <div className="w-20 h-20 rounded-full border-2 border-[#FF6A00] p-1 mb-3 flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.25)]">
          <div className="w-full h-full rounded-full app-tag flex items-center justify-center text-[#FF9D2E]">
            <User size={34} />
          </div>
        </div>

        <h2 className="text-lg font-bold app-text-primary tracking-tight">
          {session.username}
        </h2>
        <p className="text-xs app-text-muted mt-0.5 font-mono">
          {session.email}
        </p>
        <span className="mt-1 text-xs font-semibold text-[#FF790F]">
          {t('studentRole')} • {t('orientalCollegeBadge')}
        </span>
      </div>

      {/* =========================================================================
          TEMPORARILY HIDDEN: YOUR SCORE CARD
          (Preserved for easy restoration per requirements)
      ========================================================================= */}
      {/*
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full app-card border border-[#FF6A00]/70 rounded-2xl p-5 shadow-[0_0_25px_rgba(255,106,0,0.18)] relative overflow-hidden my-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-[#FF790F] uppercase tracking-wider block">
              {t('yourScore')}
            </span>
            <div className="text-3xl font-extrabold app-text-primary mt-0.5 tracking-tight">
              {scoreData.hasHistory ? `${animatedPercent}%` : '0%'}
            </div>
            <span className="text-xs app-text-secondary block mt-0.5">
              {t('verificationAccuracy')}
            </span>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={ringRadius}
                stroke="currentColor"
                className="text-gray-500/20"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="40"
                cy="40"
                r={ringRadius}
                stroke="#FF6A00"
                strokeWidth="6"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-[#FF9D2E]">
              <Check size={26} strokeWidth={3} />
            </div>
          </div>
        </div>

        <div className="app-divider border-t my-3" />

        {scoreData.hasHistory ? (
          <div className="grid grid-cols-3 text-center py-1">
            <div>
              <span className="block text-[10px] font-bold app-text-muted uppercase tracking-wider mb-1">
                {t('correct')}
              </span>
              <span className="text-lg font-bold text-[#35D07F]">
                {scoreData.correctCount}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold app-text-muted uppercase tracking-wider mb-1">
                {t('incorrect')}
              </span>
              <span className="text-lg font-bold text-[#FF4D4D]">
                {scoreData.incorrectCount}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold app-text-muted uppercase tracking-wider mb-1">
                {t('rating')}
              </span>
              <span className="text-lg font-bold text-[#FF9D2E]">
                {scoreData.ratingLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center">
            <p className="text-xs app-text-secondary">
              {t('scoreEmptyState')}
            </p>
          </div>
        )}

        <p className="text-[11px] app-text-muted mt-3">
          {t('scoreHelpText')}
        </p>
      </motion.div>
      */}

      {/* SETTINGS MENU LIST */}
      <div className="space-y-2 mt-5">
        {/* Notification Settings */}
        <button
          type="button"
          onClick={() => setActiveModal('notifications')}
          className="w-full p-4 rounded-2xl app-card hover:border-[#FF6A00]/40 flex items-center justify-between transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl app-tag text-[#FF9D2E] flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <span className="text-sm font-semibold app-text-primary block">
                {t('notificationSettings')}
              </span>
              <span className="text-xs app-text-muted">
                {t('notificationDesc')}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="app-text-muted" />
        </button>

        {/* Theme */}
        <button
          type="button"
          onClick={() => setActiveModal('theme')}
          className="w-full p-4 rounded-2xl app-card hover:border-[#FF6A00]/40 flex items-center justify-between transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl app-tag text-[#FF9D2E] flex items-center justify-center">
              <Moon size={18} />
            </div>
            <div>
              <span className="text-sm font-semibold app-text-primary block">
                {t('theme')}
              </span>
              <span className="text-xs app-text-muted capitalize">
                {theme === 'dark' ? t('themeDark') : theme === 'light' ? t('themeLight') : t('themeSystem')}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="app-text-muted" />
        </button>

        {/* Help & Support */}
        <button
          type="button"
          onClick={() => setActiveModal('help')}
          className="w-full p-4 rounded-2xl app-card hover:border-[#FF6A00]/40 flex items-center justify-between transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl app-tag text-[#FF9D2E] flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <div>
              <span className="text-sm font-semibold app-text-primary block">
                {t('helpSupport')}
              </span>
              <span className="text-xs app-text-muted">
                {t('helpDesc')}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="app-text-muted" />
        </button>

        {/* Report Bugs */}
        <button
          type="button"
          onClick={() => {
            setActiveModal('report_bug');
            setBugError(null);
            setBugSubmitted(false);
          }}
          className="w-full p-4 rounded-2xl app-card hover:border-[#FF6A00]/40 flex items-center justify-between transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl app-tag text-[#FF9D2E] flex items-center justify-center">
              <Bug size={18} />
            </div>
            <div>
              <span className="text-sm font-semibold app-text-primary block">
                {t('reportBugs')}
              </span>
              <span className="text-xs app-text-muted">
                {t('reportBugsDesc')}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="app-text-muted" />
        </button>

        {/* About orBus */}
        <button
          type="button"
          onClick={() => setActiveModal('about')}
          className="w-full p-4 rounded-2xl app-card hover:border-[#FF6A00]/40 flex items-center justify-between transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl app-tag text-[#FF9D2E] flex items-center justify-center">
              <Info size={18} />
            </div>
            <div>
              <span className="text-sm font-semibold app-text-primary block">
                {t('aboutApp')}
              </span>
              <span className="text-xs app-text-muted">
                {t('aboutDesc')}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="app-text-muted" />
        </button>

        {/* Replay Cinematic Intro Option */}
        <button
          type="button"
          onClick={onReplaySplash}
          className="w-full p-4 rounded-2xl app-card hover:border-[#FF6A00]/50 flex items-center justify-between transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF6A00]/15 text-[#FF790F] flex items-center justify-center">
              <Play size={18} />
            </div>
            <div>
              <span className="text-sm font-semibold app-text-primary block">
                {t('replaySplash')}
              </span>
              <span className="text-xs app-text-muted">
                {t('replayDesc')}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="app-text-muted" />
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full p-4 mt-3 rounded-2xl bg-transparent border border-[#FF4D4D]/40 hover:bg-[#FF4D4D]/10 text-[#FF4D4D] flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>{t('logout')}</span>
        </button>
      </div>

      {/* MODALS */}

      {/* 1. Theme Modal */}
      <AnimatePresence>
        {activeModal === 'theme' && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="app-card rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold app-text-primary">{t('selectTheme')}</h3>
                <button onClick={() => setActiveModal(null)} className="app-text-muted hover:app-text-primary">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2.5">
                {[
                  { id: 'dark' as AppTheme, label: t('themeDark') },
                  { id: 'light' as AppTheme, label: t('themeLight') },
                  { id: 'system' as AppTheme, label: t('themeSystem') }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTheme(item.id);
                      setActiveModal(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-sm font-semibold transition-colors cursor-pointer ${
                      theme === item.id
                        ? 'bg-[#FF6A00]/15 border-[#FF6A00] text-[#FF9D2E]'
                        : 'app-input hover:border-[#FF6A00]/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    {theme === item.id && <Check size={18} className="text-[#FF790F]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Notifications Modal */}
      <AnimatePresence>
        {activeModal === 'notifications' && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="app-card rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold app-text-primary">{t('notificationPreferences')}</h3>
                <button onClick={() => setActiveModal(null)} className="app-text-muted hover:app-text-primary">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold app-text-primary block">{t('departureAlerts')}</span>
                    <span className="text-xs app-text-muted">{t('departureAlertsDesc')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.departureAlerts}
                    onChange={e => updatePreferences({ departureAlerts: e.target.checked })}
                    className="w-5 h-5 accent-[#FF6A00]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold app-text-primary block">{t('standChangeAlerts')}</span>
                    <span className="text-xs app-text-muted">{t('standChangeAlertsDesc')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.standChangeAlerts}
                    onChange={e => updatePreferences({ standChangeAlerts: e.target.checked })}
                    className="w-5 h-5 accent-[#FF6A00]"
                  />
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full mt-6 py-2.5 rounded-xl bg-[#FF6A00] text-xs font-bold uppercase tracking-wider text-white"
              >
                {t('savePreferences')}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Help & Support */}
      <AnimatePresence>
        {activeModal === 'help' && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="app-card rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold app-text-primary">{t('helpSupport')}</h3>
                <button onClick={() => setActiveModal(null)} className="app-text-muted hover:app-text-primary">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3 text-xs app-text-secondary">
                <div className="p-3 app-input rounded-xl">
                  <span className="font-bold app-text-primary block mb-1">{t('campusHotlineTitle')}</span>
                  <p className="text-[#FF9D2E] font-mono text-sm">+91 755 2400 100</p>
                  <span className="text-[10px] app-text-muted">{t('campusHotlineDesc')}</span>
                </div>
                <div className="p-3 app-input rounded-xl">
                  <span className="font-bold app-text-primary block mb-1">{t('howVerificationWorks')}</span>
                  <p className="leading-relaxed">
                    {t('howVerificationDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Report Bugs Modal */}
      <AnimatePresence>
        {activeModal === 'report_bug' && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm select-none">
            <div className="app-card rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6A00]/15 text-[#FF790F] flex items-center justify-center">
                    <Bug size={17} />
                  </div>
                  <h3 className="text-base font-bold app-text-primary">{t('reportBugTitle')}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setBugError(null);
                  }}
                  className="app-text-muted hover:app-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              {bugSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#35D07F]/15 text-[#35D07F] flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <p className="text-xs font-semibold text-[#35D07F]">
                    {t('bugSubmittedSuccess')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBugSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold app-text-muted uppercase mb-1">
                      {t('bugCategory')}
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'ui', label: t('bugCategoryUI') },
                        { id: 'search', label: t('bugCategorySearch') },
                        { id: 'route', label: t('bugCategoryRoute') },
                        { id: 'other', label: t('bugCategoryOther') }
                      ].map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setBugCategory(cat.id as any)}
                          className={`py-2 px-2.5 rounded-xl border text-[11px] font-medium transition-colors cursor-pointer text-left truncate ${
                            bugCategory === cat.id
                              ? 'bg-[#FF6A00]/20 border-[#FF6A00] text-[#FF9D2E]'
                              : 'app-input hover:border-[#FF6A00]/40'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold app-text-muted uppercase mb-1">
                      {t('bugSubject')}
                    </label>
                    <input
                      type="text"
                      value={bugTitle}
                      onChange={e => setBugTitle(e.target.value)}
                      placeholder={t('bugSubjectPlaceholder')}
                      className="w-full h-10 px-3 rounded-xl app-input text-xs placeholder:app-text-muted outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold app-text-muted uppercase mb-1">
                      {t('bugDescription')} *
                    </label>
                    <textarea
                      value={bugDescription}
                      onChange={e => {
                        setBugDescription(e.target.value);
                        if (bugError) setBugError(null);
                      }}
                      placeholder={t('bugDescriptionPlaceholder')}
                      rows={3}
                      className={`w-full p-3 rounded-xl app-input text-xs placeholder:app-text-muted outline-none resize-none ${
                        bugError ? 'border-[#FF4D4D]' : 'focus:border-[#FF6A00]'
                      }`}
                    />
                    {bugError && (
                      <p className="text-[11px] text-[#FF4D4D] mt-1 font-medium">
                        {bugError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#FF790F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,106,0,0.3)]"
                  >
                    <span>{t('submitBugReport')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. About orBus */}
      <AnimatePresence>
        {activeModal === 'about' && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="app-card rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold app-text-primary">{t('aboutApp')}</h3>
                <button onClick={() => setActiveModal(null)} className="app-text-muted hover:app-text-primary">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3 text-xs app-text-secondary">
                <p>
                  {t('aboutDescription')}
                </p>
                <div className="app-input p-3 rounded-xl font-mono text-[11px] space-y-1">
                  <div>{t('version')}: 1.0.0 (PWA)</div>
                  <div>{t('offlineMode')}</div>
                  <div>{t('cacheStrategy')}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
