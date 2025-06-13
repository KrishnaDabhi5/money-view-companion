
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { toast } from 'sonner';

export interface NotificationPreferences {
  budget_alerts: boolean;
  goal_updates: boolean;
  daily_summary: boolean;
  weekly_report: boolean;
  insight_notifications: boolean;
}

export interface AppSettings {
  preferred_language: string;
  preferred_currency: string;
  preferred_date_format: string;
  preferred_theme: string;
  biometrics_enabled: boolean;
  pin_enabled: boolean;
  auto_logout: boolean;
  notification_preferences: NotificationPreferences;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: (key: keyof AppSettings, value: any) => Promise<void>;
  loading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
  applyTheme: (theme: string) => void;
}

const defaultSettings: AppSettings = {
  preferred_language: 'English',
  preferred_currency: 'INR',
  preferred_date_format: 'DD/MM/YYYY',
  preferred_theme: 'light',
  biometrics_enabled: false,
  pin_enabled: false,
  auto_logout: true,
  notification_preferences: {
    budget_alerts: true,
    goal_updates: true,
    daily_summary: false,
    weekly_report: true,
    insight_notifications: true,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, updateProfile, loading } = useRealtimeProfile();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from profile when available
  useEffect(() => {
    if (profile) {
      setSettings({
        preferred_language: profile.preferred_language || defaultSettings.preferred_language,
        preferred_currency: profile.preferred_currency || defaultSettings.preferred_currency,
        preferred_date_format: profile.preferred_date_format || defaultSettings.preferred_date_format,
        preferred_theme: profile.preferred_theme || defaultSettings.preferred_theme,
        biometrics_enabled: profile.biometrics_enabled || defaultSettings.biometrics_enabled,
        pin_enabled: profile.pin_enabled || defaultSettings.pin_enabled,
        auto_logout: profile.auto_logout !== undefined ? profile.auto_logout : defaultSettings.auto_logout,
        notification_preferences: profile.notification_preferences || defaultSettings.notification_preferences,
      });

      // Apply theme immediately when loaded
      applyTheme(profile.preferred_theme || defaultSettings.preferred_theme);
    }
  }, [profile]);

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      // Update local state immediately for instant UI feedback
      setSettings(prev => ({ ...prev, [key]: value }));

      // Apply theme immediately if it's a theme change
      if (key === 'preferred_theme') {
        applyTheme(value);
      }

      // Update in database
      const { error } = await updateProfile({ [key]: value });
      
      if (error) {
        // Revert local state on error
        setSettings(prev => ({ ...prev, [key]: settings[key] }));
        toast.error(`Failed to update ${key}: ${error}`);
      } else {
        toast.success('Setting updated successfully!');
      }
    } catch (err) {
      // Revert local state on error
      setSettings(prev => ({ ...prev, [key]: settings[key] }));
      toast.error('Failed to update setting');
    }
  };

  const formatCurrency = (amount: number): string => {
    const currencySymbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };

    const symbol = currencySymbols[settings.preferred_currency] || '₹';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (settings.preferred_date_format) {
      case 'MM/DD/YYYY':
        return dateObj.toLocaleDateString('en-US');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      case 'DD/MM/YYYY':
      default:
        return dateObj.toLocaleDateString('en-GB');
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      loading,
      formatCurrency,
      formatDate,
      applyTheme,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
