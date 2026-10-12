import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Bus, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useApp();

  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: t('notif1Title'),
      time: '2 mins ago',
      desc: t('notif1Desc'),
      type: 'boarding',
      icon: Bus,
      color: 'text-[#35D07F] bg-[#35D07F]/15 border-[#35D07F]/30'
    },
    {
      id: 2,
      title: t('notif2Title'),
      time: '15 mins ago',
      desc: t('notif2Desc'),
      type: 'change',
      icon: AlertTriangle,
      color: 'text-[#FF9D2E] bg-[#FF9D2E]/15 border-[#FF9D2E]/30'
    },
    {
      id: 3,
      title: t('notif3Title'),
      time: '35 mins ago',
      desc: t('notif3Desc'),
      type: 'info',
      icon: Clock,
      color: 'text-[#FF790F] bg-[#FF790F]/15 border-[#FF790F]/30'
    },
    {
      id: 4,
      title: t('notif4Title'),
      time: '1 hour ago',
      desc: t('notif4Desc'),
      type: 'scout',
      icon: CheckCircle2,
      color: 'text-[#35D07F] bg-[#35D07F]/15 border-[#35D07F]/30'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg app-card rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 app-divider border-b">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF6A00]/15 text-[#FF790F] flex items-center justify-center">
                <Bell size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold app-text-primary">{t('notificationsTitle')}</h3>
                <p className="text-xs app-text-secondary">{t('notificationsSubtitle')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full app-tag flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 divide-y app-divider space-y-2">
            {notifications.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} className="pt-3 pb-2 first:pt-1 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${n.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold app-text-primary">{n.title}</h4>
                      <span className="text-[10px] app-text-muted font-mono">{n.time}</span>
                    </div>
                    <p className="text-xs app-text-secondary mt-0.5 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 app-divider border-t app-secondary">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl app-tag text-xs font-semibold app-text-primary hover:border-[#FF6A00] transition-colors cursor-pointer"
            >
              {t('closeNotifications')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
