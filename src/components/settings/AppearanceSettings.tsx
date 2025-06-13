
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export const AppearanceSettings = () => {
  const { settings, updateSetting, formatCurrency } = useSettings();

  return (
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
  );
};
