
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { useSettings, type NotificationPreferences } from '@/contexts/SettingsContext';

export const NotificationSettings = () => {
  const { settings, updateSetting } = useSettings();

  const handleNotificationChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const updatedPreferences = {
      ...settings.notification_preferences,
      [key]: value
    };
    await updateSetting('notification_preferences', updatedPreferences);
  };

  return (
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
  );
};
