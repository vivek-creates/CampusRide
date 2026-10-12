import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AppTheme, AppLanguage, UserPreferences } from '../types';
import { StorageService } from '../services/storageService';
import { translate } from '../utils/translations';
import { formatStopName } from '../utils/collegeHelper';

interface AppContextType {
  theme: AppTheme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: AppTheme) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatStop: (stop: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    return StorageService.getPreferences();
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Track system preference change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute resolved theme
  const resolvedTheme: 'dark' | 'light' = useMemo(() => {
    if (preferences.theme === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return preferences.theme === 'light' ? 'light' : 'dark';
  }, [preferences.theme, systemIsDark]);

  // Apply class to html
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const setTheme = (theme: AppTheme) => {
    const updated = { ...preferences, theme };
    setPreferencesState(updated);
    StorageService.setPreferences(updated);
  };

  const setLanguage = (language: AppLanguage) => {
    const updated = { ...preferences, language };
    setPreferencesState(updated);
    StorageService.setPreferences(updated);
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferencesState(updated);
    StorageService.setPreferences(updated);
  };

  const t = (key: string, replacements?: Record<string, string | number>) => {
    return translate(preferences.language, key, replacements);
  };

  const formatStop = (stop: string) => {
    return formatStopName(stop, preferences.language === 'hi');
  };

  const value = useMemo(
    () => ({
      theme: preferences.theme,
      resolvedTheme,
      setTheme,
      language: preferences.language,
      setLanguage,
      preferences,
      updatePreferences,
      t,
      formatStop
    }),
    [preferences, resolvedTheme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
