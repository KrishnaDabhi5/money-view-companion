
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacySecuritySettings } from '@/components/settings/PrivacySecuritySettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { HelpSupportSettings } from '@/components/settings/HelpSupportSettings';
import { DangerZoneSettings } from '@/components/settings/DangerZoneSettings';

const Settings = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and app settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <NotificationSettings />
          <AppearanceSettings />
          <GeneralSettings />
        </div>
        
        <div className="space-y-6">
          <PrivacySecuritySettings />
          <HelpSupportSettings />
          <DangerZoneSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
