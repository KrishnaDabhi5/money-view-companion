
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const HelpSupportSettings = () => {
  return (
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
  );
};
