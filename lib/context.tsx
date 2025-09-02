'use client';

import { AppData } from '@/lib/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AppContextType {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  saveData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultAppData: AppData = {
  studyLogs: [],
  weeklyHours: {},
  certifications: [],
  jobApplications: [],
  weeklyNotes: {},
  settings: {
    defaultWeeklyHours: 15,
    theme: 'light'
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [appData, setAppData] = useState<AppData>(defaultAppData);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('devops-career-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setAppData(data);
        setThemeState(data.settings?.theme || 'light');
      } catch (error) {
        console.error('Error loading app data:', error);
      }
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    const updatedData = {
      ...appData,
      settings: { ...appData.settings, theme: newTheme }
    };
    setAppData(updatedData);
    localStorage.setItem('devops-career-data', JSON.stringify(updatedData));
  };

  const saveData = () => {
    localStorage.setItem('devops-career-data', JSON.stringify(appData));
  };

  useEffect(() => {
    // Save data whenever appData changes
    saveData();
  }, [appData]);

  return (
    <AppContext.Provider value={{ appData, setAppData, theme, setTheme, saveData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
