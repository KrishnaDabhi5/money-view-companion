
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Download, Key } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

export const PrivacySecuritySettings = () => {
  const { settings, updateSetting } = useSettings();

  const handleExportData = async () => {
    try {
      toast.info('Data export feature will be implemented soon');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <Card className="p-4 md:p-6 bg-white shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="biometric-auth">Biometric Authentication</Label>
            <p className="text-sm text-gray-600">Use fingerprint or face ID to unlock the app</p>
          </div>
          <Switch
            id="biometric-auth"
            checked={settings.biometrics_enabled}
            onCheckedChange={(checked) => updateSetting('biometrics_enabled', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="pin-enabled">PIN Protection</Label>
            <p className="text-sm text-gray-600">Require PIN to access sensitive information</p>
          </div>
          <Switch
            id="pin-enabled"
            checked={settings.pin_enabled}
            onCheckedChange={(checked) => updateSetting('pin_enabled', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-logout">Auto Logout</Label>
            <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
          </div>
          <Switch
            id="auto-logout"
            checked={settings.auto_logout}
            onCheckedChange={(checked) => updateSetting('auto_logout', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </div>
      </div>
    </Card>
  );
};
