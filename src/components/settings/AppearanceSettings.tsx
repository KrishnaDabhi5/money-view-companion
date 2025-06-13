
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export const AppearanceSettings = () => {
  const { theme, setTheme } = useSettings();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Palette className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Appearance</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Theme</Label>
          <p className="text-sm text-gray-600 mb-3">Choose your preferred app theme</p>
          <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${
                  isSelected ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  isSelected ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
