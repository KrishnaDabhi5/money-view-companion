
import { useSettings } from '@/contexts/SettingsContext';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacySecuritySettings } from '@/components/settings/PrivacySecuritySettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { HelpSupportSettings } from '@/components/settings/HelpSupportSettings';
import { DangerZoneSettings } from '@/components/settings/DangerZoneSettings';

const Settings = () => {
  const { loading } = useSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your app preferences and account settings</p>
      </div>

      <NotificationSettings />
      <PrivacySecuritySettings />
      <AppearanceSettings />
      <GeneralSettings />
      <HelpSupportSettings />
      <DangerZoneSettings />
    </div>
  );
};

export default Settings;
