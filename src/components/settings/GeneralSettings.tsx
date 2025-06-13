
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export const GeneralSettings = () => {
  const { settings, updateSetting } = useSettings();

  return (
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
  );
};
