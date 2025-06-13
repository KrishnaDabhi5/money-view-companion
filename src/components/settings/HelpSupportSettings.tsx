
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle, FileText, Mail, Phone, ExternalLink } from 'lucide-react';

export const HelpSupportSettings = () => {
  const supportItems = [
    {
      icon: FileText,
      title: 'Help Center',
      description: 'Browse our comprehensive help articles',
      action: 'Browse Articles',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll get back to you',
      action: 'Send Email',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call our support hotline',
      action: 'Call Now',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <HelpCircle className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Help & Support</h3>
      </div>
      
      <div className="space-y-4">
        {supportItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {item.action}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">App Version</p>
          <p className="text-sm font-medium">1.0.0</p>
        </div>
      </div>
    </Card>
  );
};
