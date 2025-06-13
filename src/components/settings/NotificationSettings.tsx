
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare, Smartphone, Shield, Download } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export const NotificationSettings = () => {
  const { notifications, updateNotifications } = useSettings();

  const notificationItems = [
    {
      key: 'email' as const,
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail,
    },
    {
      key: 'push' as const,
      label: 'Push Notifications',
      description: 'Receive push notifications in your browser',
      icon: Bell,
    },
    {
      key: 'sms' as const,
      label: 'SMS Notifications',
      description: 'Receive important alerts via SMS',
      icon: Smartphone,
    },
    {
      key: 'marketing' as const,
      label: 'Marketing Communications',
      description: 'Receive updates about new features and promotions',
      icon: MessageSquare,
    },
    {
      key: 'security' as const,
      label: 'Security Alerts',
      description: 'Receive notifications about account security',
      icon: Shield,
    },
    {
      key: 'updates' as const,
      label: 'App Updates',
      description: 'Get notified about app updates and new features',
      icon: Download,
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Bell className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      
      <div className="space-y-6">
        {notificationItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-400" />
                <div>
                  <Label htmlFor={item.key} className="text-sm font-medium">
                    {item.label}
                  </Label>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <Switch
                id={item.key}
                checked={notifications[item.key]}
                onCheckedChange={(checked) =>
                  updateNotifications({ [item.key]: checked })
                }
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
