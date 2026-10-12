import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ShieldCheck,
  MessageSquare,
  Route,
  ChevronRight,
  X,
  CheckCircle2,
  Bus,
  Send
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { INITIAL_ROUTES } from '../data/routesData';
import { RouteData, VerificationRecord, FeedbackRecord } from '../types';
import { NotificationModal } from '../components/NotificationModal';
import { useApp } from '../context/AppContext';

export const UpdatesScreen: React.FC = () => {
  const { t, formatStop } = useApp();
  const [activeSection, setActiveSection] = useState<'routes' | 'activity' | 'feedback' | null>('routes');
  const [verifications] = useState<VerificationRecord[]>(() => StorageService.getVerifications());
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

  // Notification modal
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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

  // Realistic Bhopal Oriental College route summary cards
  const routeHighlights = [
    { destination: 'Bairagarh / Lal Ghati (Route 01)', busCount: '2 buses', key: 'r1' },
    { destination: 'Mandideep / 11 Mile (Route 13)', busCount: '4 buses', key: 'r13' },
    { destination: 'Minal / Nizamuddin (Route 18)', busCount: '2 buses', key: 'r18' },
    { destination: 'Ayodhya Nagar / Narela (Route 20)', busCount: '2 buses', key: 'r20' }
  ];

  return (
    <div className="min-h-screen app-bg pb-28 px-4 pt-4 max-w-md mx-auto select-none overflow-x-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between py-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight app-text-primary">{t('updatesTitle')}</h1>
          <p className="text-xs app-text-secondary mt-0.5">{t('updatesSubtitle')}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsNotificationOpen(true)}
          className="w-10 h-10 rounded-xl app-card flex items-center justify-center hover:border-[#FF6A00] transition-colors cursor-pointer"
          aria-label={t('notificationsTitle')}
        >
          <Bell size={18} className="text-[#FF9D2E]" />
        </button>
      </header>

      {/* 3 PRIMARY FEATURE MODULE CARDS */}
      <div className="space-y-3.5">
        {/* CARD 1: Bus Verification Activity */}
        <div
          onClick={() => setActiveSection(activeSection === 'activity' ? null : 'activity')}
          className={`app-card rounded-2xl p-4 transition-all cursor-pointer ${
            activeSection === 'activity'
              ? 'border-[#FF6A00] shadow-[0_0_20px_rgba(255,106,0,0.15)]'
              : 'hover:border-[#FF6A00]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FF6A00]/15 border border-[#FF9D2E]/20 text-[#FF9D2E] flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold app-text-primary">{t('busVerificationActivity')}</h3>
                <p className="text-xs app-text-secondary mt-0.5 leading-snug">
                  {t('busVerificationSubtitle')}
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className={`app-text-muted transition-transform duration-200 shrink-0 ${
                activeSection === 'activity' ? 'rotate-90 text-[#FF6A00]' : ''
              }`}
            />
          </div>

          {/* Expanded Content: Verification Activity */}
          <AnimatePresence>
            {activeSection === 'activity' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 app-divider border-t overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold app-text-muted uppercase tracking-wider">
                    {t('recentVerifiedReports')}
                  </span>
                  <span className="text-xs text-[#35D07F] font-semibold">
                    {t('localRecords', { count: verifications.length })}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {verifications.slice(0, 10).map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-xl app-input flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            v.userAnswer === 'YES'
                              ? 'bg-[#35D07F]/15 text-[#35D07F] border border-[#35D07F]/30'
                              : 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30'
                          }`}
                        >
                          {v.userAnswer}
                        </div>
                        <div>
                          <span className="text-xs font-bold app-text-primary block">
                            {v.busNumber} • {v.routeNumber}
                          </span>
                          <span className="text-[11px] app-text-secondary">
                            {t('assigned')} {v.assignedStand}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] app-text-muted font-mono">
                        {v.timeString}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CARD 2: Transport Feedback & Requests */}
        <div
          onClick={() => setActiveSection(activeSection === 'feedback' ? null : 'feedback')}
          className={`app-card rounded-2xl p-4 transition-all cursor-pointer ${
            activeSection === 'feedback'
              ? 'border-[#FF6A00] shadow-[0_0_20px_rgba(255,106,0,0.15)]'
              : 'hover:border-[#FF6A00]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FF6A00]/15 border border-[#FF9D2E]/20 text-[#FF9D2E] flex items-center justify-center shrink-0">
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold app-text-primary">{t('transportFeedback')}</h3>
                <p className="text-xs app-text-secondary mt-0.5 leading-snug">
                  {t('transportFeedbackSubtitle')}
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className={`app-text-muted transition-transform duration-200 shrink-0 ${
                activeSection === 'feedback' ? 'rotate-90 text-[#FF6A00]' : ''
              }`}
            />
          </div>

          {/* Expanded Content: Feedback Form and Submissions */}
          <AnimatePresence>
            {activeSection === 'feedback' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="mt-4 pt-4 app-divider border-t overflow-hidden"
              >
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

                {/* Previously Submitted Submissions */}
                <div className="mt-5 pt-4 app-divider border-t">
                  <h4 className="text-xs font-bold app-text-muted uppercase tracking-wider mb-2.5">
                    {t('yourSubmissions')}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
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
          </AnimatePresence>
        </div>

        {/* CARD 3: Today's Bus Routes */}
        <div
          className="app-card border border-[#FF6A00] rounded-2xl p-4 shadow-[0_0_20px_rgba(255,106,0,0.12)]"
        >
          <div
            onClick={() => setActiveSection(activeSection === 'routes' ? null : 'routes')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FF6A00]/15 border border-[#FF9D2E]/20 text-[#FF9D2E] flex items-center justify-center shrink-0">
                <Route size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold app-text-primary">{t('todaysBusRoutes')}</h3>
                <p className="text-xs app-text-secondary mt-0.5 leading-snug">
                  {t('todaysRoutesSubtitle')}
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className={`text-[#FF6A00] transition-transform duration-200 shrink-0 ${
                activeSection === 'routes' ? 'rotate-90' : ''
              }`}
            />
          </div>

          {/* Today's Operating Routes Summary */}
          <AnimatePresence>
            {activeSection === 'routes' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-3 app-divider border-t overflow-hidden"
              >
                <div className="mb-3">
                  <span className="text-xs font-semibold text-[#FF9D2E] block">
                    {t('routeSummaryTitle')}
                  </span>
                </div>

                {/* Oriental College Bhopal Route Summaries */}
                <div className="space-y-3 mb-4">
                  {routeHighlights.map(item => (
                    <div key={item.key} className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold app-text-primary">{item.destination}</h4>
                        <span className="text-xs app-text-muted">{t('scheduledBuses')}</span>
                      </div>
                      <span className="text-base font-bold text-[#FF6A00]">{item.busCount}</span>
                    </div>
                  ))}

                  <p className="text-[11px] app-text-muted italic">{t('illustrativeNote')}</p>
                </div>

                {/* Complete List of Today's Operating College Routes */}
                <div className="app-divider border-t pt-3">
                  <h4 className="text-xs font-bold app-text-muted uppercase tracking-wider mb-2.5">
                    {t('allOperatingRoutes', { count: operatingRoutes.length })}
                  </h4>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {operatingRoutes.map(route => (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRoute(route)}
                        className="p-3 rounded-xl app-input hover:border-[#FF6A00]/50 transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg app-tag group-hover:bg-[#FF6A00]/20 group-hover:text-[#FF790F] flex items-center justify-center transition-colors">
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

                        <div className="text-right">
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
          </AnimatePresence>
        </div>
      </div>

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

      {/* NOTIFICATION MODAL */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};
