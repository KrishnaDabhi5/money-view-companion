
import { Card } from '@/components/ui/card';

interface BudgetOverviewCardsProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

const BudgetOverviewCards = ({ totalBudget, totalSpent, remainingBudget }: BudgetOverviewCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
        <p className="text-3xl font-bold">₹{totalBudget.toLocaleString()}</p>
      </Card>
      <Card className="p-6 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
        <p className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</p>
      </Card>
      <Card className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <h3 className="text-lg font-semibold mb-2">Remaining</h3>
        <p className="text-3xl font-bold">₹{remainingBudget.toLocaleString()}</p>
      </Card>
    </div>
  );
};

export default BudgetOverviewCards;
