import React from 'react';
import { motion } from 'framer-motion';
import { Home, RefreshCw, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type TabType = 'home' | 'updates' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { t } = useApp();

  const tabs = [
    { id: 'home' as TabType, label: t('navHome'), icon: Home },
    { id: 'updates' as TabType, label: t('navUpdates'), icon: RefreshCw },
    { id: 'profile' as TabType, label: t('navProfile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 app-nav backdrop-blur-xl safe-pb select-none shadow-lg">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-around relative">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs cursor-pointer group focus:outline-none"
              aria-label={tab.label}
            >
              {/* Sliding Pill Indicator behind active item */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-x-3 inset-y-1.5 bg-[#FF6A00]/15 rounded-2xl border border-[#FF6A00]/30 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35, duration: 0.35 }}
                />
              )}

              {/* Icon with smooth scale & orange glow */}
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : 1,
                  y: isActive ? -1 : 0
                }}
                transition={{ duration: 0.3 }}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-[#FF6A00]' : 'app-text-muted group-hover:app-text-primary'
                }`}
              >
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{
                  scale: isActive ? 1.05 : 1,
                  fontWeight: isActive ? 600 : 400
                }}
                transition={{ duration: 0.3 }}
                className={`text-[11px] mt-1 transition-colors duration-200 ${
                  isActive ? 'text-[#FF6A00]' : 'app-text-muted group-hover:app-text-primary'
                }`}
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
