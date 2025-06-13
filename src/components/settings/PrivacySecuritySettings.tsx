
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Fingerprint, Lock, Timer, Eye, Download } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export const PrivacySecuritySettings = () => {
  const {
    biometricsEnabled,
    setBiometricsEnabled,
    pinEnabled,
    setPinEnabled,
    autoLogout,
    setAutoLogout,
  } = useSettings();

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Privacy & Security</h3>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Fingerprint className="h-5 w-5 text-gray-400" />
            <div>
              <Label htmlFor="biometrics" className="text-sm font-medium">
                Biometric Authentication
              </Label>
              <p className="text-sm text-gray-600">Use fingerprint or face recognition to unlock</p>
            </div>
          </div>
          <Switch
            id="biometrics"
            checked={biometricsEnabled}
            onCheckedChange={setBiometricsEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-gray-400" />
            <div>
              <Label htmlFor="pin" className="text-sm font-medium">
                PIN Protection
              </Label>
              <p className="text-sm text-gray-600">Require PIN to access the app</p>
            </div>
          </div>
          <Switch
            id="pin"
            checked={pinEnabled}
            onCheckedChange={setPinEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Timer className="h-5 w-5 text-gray-400" />
            <div>
              <Label htmlFor="auto-logout" className="text-sm font-medium">
                Auto Logout
              </Label>
              <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
            </div>
          </div>
          <Switch
            id="auto-logout"
            checked={autoLogout}
            onCheckedChange={setAutoLogout}
          />
        </div>

        <div className="border-t pt-6">
          <h4 className="text-sm font-medium mb-4">Data & Privacy</h4>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download My Data
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
