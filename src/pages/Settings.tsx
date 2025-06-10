
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Bell, Shield, Globe, Palette, HelpCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Notification Settings
    budgetAlerts: true,
    goalUpdates: true,
    dailySummary: false,
    weeklyReport: true,
    
    // Privacy & Security
    biometricAuth: true,
    pinEnabled: false,
    autoLogout: true,
    
    // Appearance
    darkMode: false,
    currency: 'INR',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your app preferences and account settings</p>
      </div>

      {/* Notifications */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when you're close to your budget limits</p>
            </div>
            <Switch
              id="budget-alerts"
              checked={settings.budgetAlerts}
              onCheckedChange={(checked) => updateSetting('budgetAlerts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="goal-updates">Goal Progress Updates</Label>
              <p className="text-sm text-gray-600">Receive updates on your savings goal progress</p>
            </div>
            <Switch
              id="goal-updates"
              checked={settings.goalUpdates}
              onCheckedChange={(checked) => updateSetting('goalUpdates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-summary">Daily Spending Summary</Label>
              <p className="text-sm text-gray-600">Daily recap of your expenses</p>
            </div>
            <Switch
              id="daily-summary"
              checked={settings.dailySummary}
              onCheckedChange={(checked) => updateSetting('dailySummary', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-report">Weekly Financial Report</Label>
              <p className="text-sm text-gray-600">Comprehensive weekly financial insights</p>
            </div>
            <Switch
              id="weekly-report"
              checked={settings.weeklyReport}
              onCheckedChange={(checked) => updateSetting('weeklyReport', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6 bg-white shadow-sm">
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
              checked={settings.biometricAuth}
              onCheckedChange={(checked) => updateSetting('biometricAuth', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pin-enabled">PIN Protection</Label>
              <p className="text-sm text-gray-600">Require PIN to access sensitive information</p>
            </div>
            <Switch
              id="pin-enabled"
              checked={settings.pinEnabled}
              onCheckedChange={(checked) => updateSetting('pinEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-logout">Auto Logout</Label>
              <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
            </div>
            <Switch
              id="auto-logout"
              checked={settings.autoLogout}
              onCheckedChange={(checked) => updateSetting('autoLogout', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Export Data
            </Button>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => updateSetting('dateFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* General */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">General</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">हिंदी</SelectItem>
                <SelectItem value="Spanish">Español</SelectItem>
                <SelectItem value="French">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Help & Support */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <HelpCircle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
        </div>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQs
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Contact Support
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Terms of Service
          </Button>
          <Button variant="outline" className="w-full justify-start">
            About FinTrack
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center space-x-2 mb-4">
          <Trash2 className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-red-700">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
