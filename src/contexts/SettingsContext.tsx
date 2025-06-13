
import React, { createContext, useContext, useState, useEffect } from 'react';

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  security: boolean;
  updates: boolean;
}

interface SettingsContextType {
  notifications: NotificationPreferences;
  updateNotifications: (notifications: Partial<NotificationPreferences>) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => void;
  pinEnabled: boolean;
  setPinEnabled: (enabled: boolean) => void;
  autoLogout: boolean;
  setAutoLogout: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    security: true,
    updates: true,
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);

  const updateNotifications = (newNotifications: Partial<NotificationPreferences>) => {
    setNotifications(prev => ({ ...prev, ...newNotifications }));
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('fintrack-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.dateFormat) setDateFormat(parsed.dateFormat);
        if (parsed.biometricsEnabled !== undefined) setBiometricsEnabled(parsed.biometricsEnabled);
        if (parsed.pinEnabled !== undefined) setPinEnabled(parsed.pinEnabled);
        if (parsed.autoLogout !== undefined) setAutoLogout(parsed.autoLogout);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      notifications,
      theme,
      language,
      currency,
      dateFormat,
      biometricsEnabled,
      pinEnabled,
      autoLogout,
    };
    localStorage.setItem('fintrack-settings', JSON.stringify(settings));
  }, [notifications, theme, language, currency, dateFormat, biometricsEnabled, pinEnabled, autoLogout]);

  const value: SettingsContextType = {
    notifications,
    updateNotifications,
    theme,
    setTheme,
    language,
    setLanguage,
    currency,
    setCurrency,
    dateFormat,
    setDateFormat,
    biometricsEnabled,
    setBiometricsEnabled,
    pinEnabled,
    setPinEnabled,
    autoLogout,
    setAutoLogout,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
