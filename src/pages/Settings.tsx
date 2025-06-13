
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Bell, Shield, Globe, Palette, HelpCircle, Trash2, Download, Key, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useSettings, type NotificationPreferences } from '@/contexts/SettingsContext';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, updateSetting, loading, formatCurrency } = useSettings();
  const { deleteAccount, isDeleting } = useAccountDeletion();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNotificationChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const updatedPreferences = {
      ...settings.notification_preferences,
      [key]: value
    };
    await updateSetting('notification_preferences', updatedPreferences);
  };

  const handleExportData = async () => {
    try {
      // This would typically call an API endpoint to generate and download user data
      toast.info('Data export feature will be implemented soon');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmPassword) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }
    
    // In a real implementation, you'd verify the password here
    setShowConfirmPassword(false);
    setConfirmPassword('');
    await deleteAccount();
  };

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

      {/* Notifications */}
      <Card className="p-4 md:p-6 bg-white shadow-sm">
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
              checked={settings.notification_preferences.budget_alerts}
              onCheckedChange={(checked) => handleNotificationChange('budget_alerts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="goal-updates">Goal Progress Updates</Label>
              <p className="text-sm text-gray-600">Receive updates on your savings goal progress</p>
            </div>
            <Switch
              id="goal-updates"
              checked={settings.notification_preferences.goal_updates}
              onCheckedChange={(checked) => handleNotificationChange('goal_updates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-summary">Daily Spending Summary</Label>
              <p className="text-sm text-gray-600">Daily recap of your expenses</p>
            </div>
            <Switch
              id="daily-summary"
              checked={settings.notification_preferences.daily_summary}
              onCheckedChange={(checked) => handleNotificationChange('daily_summary', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-report">Weekly Financial Report</Label>
              <p className="text-sm text-gray-600">Comprehensive weekly financial insights</p>
            </div>
            <Switch
              id="weekly-report"
              checked={settings.notification_preferences.weekly_report}
              onCheckedChange={(checked) => handleNotificationChange('weekly_report', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="insight-notifications">AI Insight Notifications</Label>
              <p className="text-sm text-gray-600">Get notified about spending insights and recommendations</p>
            </div>
            <Switch
              id="insight-notifications"
              checked={settings.notification_preferences.insight_notifications}
              onCheckedChange={(checked) => handleNotificationChange('insight_notifications', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
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

      {/* Appearance */}
      <Card className="p-4 md:p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode">Theme</Label>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
            <Select 
              value={settings.preferred_theme} 
              onValueChange={(value) => updateSetting('preferred_theme', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={settings.preferred_currency} 
                onValueChange={(value) => updateSetting('preferred_currency', value)}
              >
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
              <p className="text-xs text-gray-500 mt-1">
                Current format: {formatCurrency(1000)}
              </p>
            </div>
            
            <div>
              <Label htmlFor="date-format">Date Format</Label>
              <Select 
                value={settings.preferred_date_format} 
                onValueChange={(value) => updateSetting('preferred_date_format', value)}
              >
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
      <Card className="p-4 md:p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">General</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select 
              value={settings.preferred_language} 
              onValueChange={(value) => updateSetting('preferred_language', value)}
            >
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
      <Card className="p-4 md:p-6 bg-white shadow-sm">
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
      <Card className="p-4 md:p-6 bg-red-50 border-red-200">
        <div className="flex items-center space-x-2 mb-4">
          <Trash2 className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-red-700">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={isDeleting}>
                {isDeleting ? 'Deleting Account...' : 'Delete Account'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All your expense and income records</li>
                    <li>Budget settings and goals</li>
                    <li>Profile information</li>
                    <li>App preferences and settings</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-3 my-4">
                <Label htmlFor="confirm-password">Enter your password to confirm:</Label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={!confirmPassword || isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
