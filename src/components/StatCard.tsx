
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className = '' }: StatCardProps) => {
  return (
    <Card className={`p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </p>
          )}
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
