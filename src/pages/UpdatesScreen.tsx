import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Route,
  MessageSquare,
  Bus,
  Send,
  CheckCircle2,
  X,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { INITIAL_ROUTES } from '../data/routesData';
import { RouteData, FeedbackRecord } from '../types';
import { useApp } from '../context/AppContext';

export const UpdatesScreen: React.FC = () => {
  const { t, formatStop } = useApp();
  const [currentView, setCurrentView] = useState<'landing' | 'routes' | 'feedback'>('landing');
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(() => StorageService.getFeedbacks());

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState<'problem' | 'bus_request' | 'allocation_issue' | 'suggestion'>('problem');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [feedbackRoute, setFeedbackRoute] = useState('Route 01');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Route detail modal
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [routeDirection, setRouteDirection] = useState<'to_college' | 'to_home'>('to_home');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackDesc.trim()) return;

    StorageService.addFeedback({
      category: feedbackCategory,
      title: feedbackTitle,
      description: feedbackDesc,
      routeNumber: feedbackRoute
    });

    setFeedbacks(StorageService.getFeedbacks());
    setFeedbackTitle('');
    setFeedbackDesc('');
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3500);
  };

  const operatingRoutes = INITIAL_ROUTES.filter(r => r.isOperatingToday);

  return (
    <div className="min-h-screen app-bg pb-28 px-4 pt-4 max-w-md mx-auto select-none overflow-x-hidden">
      {/* VIEW 1: Activity Landing Page (Two Cards) */}
      {currentView === 'landing' && (
        <motion.div
          key="landing-view"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Landing Header */}
          <div className="py-3 mb-3">
            <h1 className="text-xl font-bold app-text-primary tracking-tight">
              {t('activityTitle')}
            </h1>
            <p className="text-xs app-text-secondary mt-0.5">
              {t('activitySubtitle')}
            </p>
          </div>

          {/* Two Primary Cards Stacked Vertically */}
          <div className="space-y-4">
            {/* Card 1: Today's Bus Routes */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('routes')}
              className="app-card rounded-2xl p-5 shadow-lg border border-[#FF6A00]/25 hover:border-[#FF6A00] transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF6A00]/20 to-[#FF790F]/20 border border-[#FF9D2E]/30 text-[#FF9D2E] flex items-center justify-center shrink-0 group-hover:bg-[#FF6A00]/30 transition-colors">
                  <Route size={24} className="text-[#FF790F]" />
                </div>
                <div>
                  <h2 className="text-base font-bold app-text-primary group-hover:text-[#FF9D2E] transition-colors">
                    {t('todaysBusRoutes')}
                  </h2>
                  <p className="text-xs app-text-secondary mt-1 leading-snug">
                    {t('exploreRoutesDesc')}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full app-tag flex items-center justify-center shrink-0 ml-2 group-hover:border-[#FF6A00]/50 transition-colors">
                <ChevronRight size={18} className="app-text-muted group-hover:app-text-primary" />
              </div>
            </motion.div>

            {/* Card 2: Transport Feedback & Requests */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('feedback')}
              className="app-card rounded-2xl p-5 shadow-lg border border-[#FF6A00]/25 hover:border-[#FF6A00] transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF6A00]/20 to-[#FF790F]/20 border border-[#FF9D2E]/30 text-[#FF9D2E] flex items-center justify-center shrink-0 group-hover:bg-[#FF6A00]/30 transition-colors">
                  <MessageSquare size={24} className="text-[#FF790F]" />
                </div>
                <div>
                  <h2 className="text-base font-bold app-text-primary group-hover:text-[#FF9D2E] transition-colors">
                    {t('transportFeedback')}
                  </h2>
                  <p className="text-xs app-text-secondary mt-1 leading-snug">
                    {t('feedbackCardDesc')}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full app-tag flex items-center justify-center shrink-0 ml-2 group-hover:border-[#FF6A00]/50 transition-colors">
                <ChevronRight size={18} className="app-text-muted group-hover:app-text-primary" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* VIEW 2: Today's Bus Routes Detail View */}
      {currentView === 'routes' && (
        <motion.div
          key="routes-view"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Back Control and View Header */}
          <div className="py-2 mb-4">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl app-tag text-xs font-semibold app-text-secondary hover:app-text-primary hover:border-[#FF6A00]/40 transition-colors cursor-pointer mb-3"
            >
              <ArrowLeft size={15} />
              <span>{t('backToActivity')}</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/15 border border-[#FF9D2E]/20 text-[#FF9D2E] flex items-center justify-center shrink-0">
                <Route size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold app-text-primary">{t('todaysBusRoutes')}</h1>
                <p className="text-xs app-text-secondary mt-0.5 leading-snug">
                  {t('exploreRoutesDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Operating Bhopal Route List Directly (Highlights section removed) */}
          <div className="app-card rounded-2xl p-4 shadow-lg border border-[#FF6A00]/25">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-bold app-text-muted uppercase tracking-wider">
                {t('allOperatingRoutes', { count: operatingRoutes.length })}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#35D07F]/15 text-[#35D07F]">
                Active Today
              </span>
            </div>

            <div className="space-y-2">
              {operatingRoutes.map(route => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className="p-3 rounded-xl app-input hover:border-[#FF6A00]/50 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg app-tag group-hover:bg-[#FF6A00]/20 group-hover:text-[#FF790F] flex items-center justify-center transition-colors shrink-0">
                      <Bus size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold app-text-primary block group-hover:text-[#FF9D2E] transition-colors">
                        {route.routeNumber} • {route.busNumber}
                      </span>
                      <span className="text-[11px] app-text-muted truncate max-w-[190px] block">
                        {route.stops[0]} → {formatStop('COLLEGE')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#FF6A00] block">
                      {route.assignedStand}
                    </span>
                    <span className="text-[10px] app-text-muted">
                      {route.departureTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW 3: Transport Feedback & Requests Detail View */}
      {currentView === 'feedback' && (
        <motion.div
          key="feedback-view"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Back Control and View Header */}
          <div className="py-2 mb-4">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl app-tag text-xs font-semibold app-text-secondary hover:app-text-primary hover:border-[#FF6A00]/40 transition-colors cursor-pointer mb-3"
            >
              <ArrowLeft size={15} />
              <span>{t('backToActivity')}</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/15 border border-[#FF9D2E]/20 text-[#FF9D2E] flex items-center justify-center shrink-0">
                <MessageSquare size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold app-text-primary">{t('transportFeedback')}</h1>
                <p className="text-xs app-text-secondary mt-0.5 leading-snug">
                  {t('transportFeedbackSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Form Card */}
          <div className="app-card rounded-2xl p-5 shadow-lg border border-[#FF6A00]/25 mb-4">
            {/* Submission Confirmation Alert */}
            {feedbackSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-[#35D07F]/15 border border-[#35D07F]/40 text-[#35D07F] text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>{t('feedbackSubmittedMsg')}</span>
              </motion.div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              {/* Category Selection */}
              <div>
                <label className="block text-[11px] font-bold app-text-muted uppercase mb-1.5">
                  {t('requestCategory')}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'problem', label: t('categoryProblem') },
                    { id: 'bus_request', label: t('categoryBusRequest') },
                    { id: 'allocation_issue', label: t('categoryAllocation') },
                    { id: 'suggestion', label: t('categorySuggestion') }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFeedbackCategory(cat.id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-medium transition-colors cursor-pointer text-left truncate ${
                        feedbackCategory === cat.id
                          ? 'bg-[#FF6A00]/20 border-[#FF6A00] text-[#FF9D2E]'
                          : 'app-input hover:border-[#FF6A00]/40'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Route selector */}
              <div>
                <label className="block text-[11px] font-bold app-text-muted uppercase mb-1">
                  {t('relatedRoute')}
                </label>
                <select
                  value={feedbackRoute}
                  onChange={e => setFeedbackRoute(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl app-input text-xs outline-none focus:border-[#FF6A00]"
                >
                  {INITIAL_ROUTES.map(r => (
                    <option key={r.id} value={r.routeNumber} className="app-card">
                      {r.routeNumber} ({r.busNumber}) - {r.stops[0]} → {formatStop('COLLEGE')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold app-text-muted uppercase mb-1">
                  {t('formSubject')}
                </label>
                <input
                  type="text"
                  value={feedbackTitle}
                  onChange={e => setFeedbackTitle(e.target.value)}
                  placeholder={t('formSubjectPlaceholder')}
                  required
                  className="w-full h-10 px-3 rounded-xl app-input text-xs placeholder:app-text-muted outline-none focus:border-[#FF6A00]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold app-text-muted uppercase mb-1">
                  {t('formDetails')}
                </label>
                <textarea
                  value={feedbackDesc}
                  onChange={e => setFeedbackDesc(e.target.value)}
                  placeholder={t('formDetailsPlaceholder')}
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl app-input text-xs placeholder:app-text-muted outline-none focus:border-[#FF6A00] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#FF790F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,106,0,0.3)]"
              >
                <Send size={14} />
                <span>{t('submitFeedbackBtn')}</span>
              </button>
            </form>
          </div>

          {/* Previously Submitted Submissions */}
          <div className="app-card rounded-2xl p-5 shadow-lg border border-[#FF6A00]/25">
            <h2 className="text-xs font-bold app-text-muted uppercase tracking-wider mb-2.5">
              {t('yourSubmissions')}
            </h2>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {feedbacks.map(fb => (
                <div
                  key={fb.id}
                  className="p-3 rounded-xl app-input"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold app-text-primary">{fb.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        fb.status === 'Resolved'
                          ? 'bg-[#35D07F]/15 text-[#35D07F] border border-[#35D07F]/30'
                          : 'bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30'
                      }`}
                    >
                      {fb.status === 'Resolved' ? t('statusResolved') : t('statusUnderReview')}
                    </span>
                  </div>
                  <p className="text-[11px] app-text-secondary leading-relaxed">
                    {fb.description}
                  </p>
                  {fb.routeNumber && (
                    <span className="inline-block mt-1.5 text-[10px] font-mono text-[#FF790F]">
                      {fb.routeNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ROUTE SCHEDULE DETAILS MODAL */}
      <AnimatePresence>
        {selectedRoute && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoute(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative z-10 w-full max-w-lg app-card rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-5 app-divider border-b flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded app-tag text-[#FF9D2E]">
                      {selectedRoute.routeNumber}
                    </span>
                    <span className="text-xs text-[#35D07F] font-bold">
                      {selectedRoute.boardingStatus === 'Boarding' ? t('statusBoarding') : t('statusPreparing')}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold app-text-primary mt-1">
                    Bus {selectedRoute.busNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="w-8 h-8 rounded-full app-tag flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Bay Stand & Time Info Strip */}
              <div className="px-5 py-3 app-input app-divider border-b grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] app-text-muted font-bold uppercase block">
                    {t('assignedStand')}
                  </span>
                  <span className="text-base font-extrabold text-[#FF6A00]">
                    {selectedRoute.assignedStand}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] app-text-muted font-bold uppercase block">
                    {t('departure')}
                  </span>
                  <span className="text-base font-extrabold app-text-primary">
                    {selectedRoute.departureTime}
                  </span>
                </div>
              </div>

              {/* Direction Toggle */}
              <div className="px-5 py-3 app-divider border-b flex items-center justify-between">
                <span className="text-xs font-bold app-text-muted uppercase">
                  {t('routeScheduleDetails')}
                </span>
                <div className="flex items-center gap-1 app-input p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRouteDirection('to_home')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      routeDirection === 'to_home'
                        ? 'bg-[#FF6A00] text-white'
                        : 'app-text-muted hover:app-text-primary'
                    }`}
                  >
                    {t('directionCollegeToHome')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRouteDirection('to_college')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      routeDirection === 'to_college'
                        ? 'bg-[#FF6A00] text-white'
                        : 'app-text-muted hover:app-text-primary'
                    }`}
                  >
                    {t('directionHomeToCollege')}
                  </button>
                </div>
              </div>

              {/* Ordered Stops List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-2">
                <span className="text-[11px] font-bold app-text-muted uppercase tracking-wider block mb-2">
                  {t('completeStopSequence', { count: selectedRoute.stops.length })}
                </span>

                {(routeDirection === 'to_home'
                  ? [...selectedRoute.stops].reverse()
                  : selectedRoute.stops
                ).map((stop, idx, arr) => {
                  const isFirst = idx === 0;
                  const isLast = idx === arr.length - 1;

                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs py-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isFirst
                              ? 'bg-[#FF6A00] ring-4 ring-[#FF6A00]/25'
                              : isLast
                              ? 'bg-[#35D07F] ring-4 ring-[#35D07F]/25'
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <span
                        className={`truncate ${
                          isFirst || isLast ? 'font-bold app-text-primary' : 'app-text-secondary'
                        }`}
                      >
                        {idx + 1}. {formatStop(stop)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Close Button */}
              <div className="p-4 app-divider border-t">
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="w-full py-2.5 rounded-xl app-tag text-xs font-semibold app-text-primary hover:border-[#FF6A00] cursor-pointer"
                >
                  {t('closeRouteDetails')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
