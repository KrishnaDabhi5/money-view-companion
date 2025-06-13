
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, DollarSign, Calendar } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export const GeneralSettings = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    dateFormat,
    setDateFormat,
  } = useSettings();

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  const currencyOptions = [
    { value: 'INR', label: '₹ Indian Rupee (INR)' },
    { value: 'USD', label: '$ US Dollar (USD)' },
    { value: 'EUR', label: '€ Euro (EUR)' },
    { value: 'GBP', label: '£ British Pound (GBP)' },
    { value: 'JPY', label: '¥ Japanese Yen (JPY)' },
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">General</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Globe className="h-4 w-4 text-gray-400" />
            <Label className="text-sm font-medium">Language</Label>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <Label className="text-sm font-medium">Currency</Label>
          </div>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Label className="text-sm font-medium">Date Format</Label>
          </div>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              {dateFormatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
