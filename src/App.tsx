import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserSession } from './types';
import { StorageService } from './services/storageService';
import { CinematicSplash } from './components/CinematicSplash';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './pages/HomeScreen';
import { UpdatesScreen } from './pages/UpdatesScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { AppProvider } from './context/AppContext';

const AppContent: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(() => {
    return StorageService.getSession();
  });

  // Track if cinematic splash should be displayed
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return StorageService.shouldShowIntro();
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLoginSuccess = (email: string) => {
    const currentSession = StorageService.getSession();
    if (currentSession) {
      setSession(currentSession);
    } else {
      const newSession: UserSession = {
        email,
        username: email.split('@')[0],
        isAuthenticated: true,
        loginTime: Date.now(),
        isDemoUser: true
      };
      StorageService.setSession(newSession);
      setSession(newSession);
    }
  };

  const handleLogout = () => {
    StorageService.clearSession();
    setSession(null);
    setActiveTab('home');
  };

  const handleReplaySplash = () => {
    setShowSplash(true);
  };

  // 1. Cinematic Splash View (for first 2 openings or user replay)
  if (showSplash) {
    return (
      <CinematicSplash
        onComplete={handleSplashComplete}
        showGetStartedButton={true}
      />
    );
  }

  // 2. Unauthenticated View -> Login Screen
  if (!session || !session.isAuthenticated) {
    return (
      <motion.div
        key="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </motion.div>
    );
  }

  // 3. Authenticated View -> Main App Shell with Fixed Bottom Nav
  return (
    <div className="min-h-screen app-bg flex flex-col justify-between selection:bg-[#FF6A00] selection:text-white transition-colors duration-200">
      <main className="flex-1 w-full max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <HomeScreen session={session} />
            </motion.div>
          )}

          {activeTab === 'updates' && (
            <motion.div
              key="tab-updates"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <UpdatesScreen />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileScreen
                session={session}
                onLogout={handleLogout}
                onReplaySplash={handleReplaySplash}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Navigation (3 items) */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
