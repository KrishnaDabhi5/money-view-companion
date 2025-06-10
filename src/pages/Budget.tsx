
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit } from 'lucide-react';

interface BudgetItem {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
}

const Budget = () => {
  const [budgets, setBudgets] = useState<BudgetItem[]>([
    { id: '1', category: 'Food', budgetAmount: 8000, spentAmount: 2500 },
    { id: '2', category: 'Transportation', budgetAmount: 3000, spentAmount: 1200 },
    { id: '3', category: 'Entertainment', budgetAmount: 2000, spentAmount: 800 },
    { id: '4', category: 'Medical', budgetAmount: 1500, spentAmount: 0 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const categories = [
    'Food', 'Medical', 'Clothes', 'Electricity', 'Mobile Recharge', 
    'Health', 'Transportation', 'Entertainment', 'Education', 'Rent', 
    'Utilities', 'Shopping', 'Miscellaneous'
  ];

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const remainingBudget = totalBudget - totalSpent;

  const addBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    const newBudget: BudgetItem = {
      id: Date.now().toString(),
      category,
      budgetAmount: parseFloat(amount),
      spentAmount: 0,
    };

    setBudgets([...budgets, newBudget]);
    setCategory('');
    setAmount('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
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

      {/* Add Budget Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Budget Categories</h2>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Budget</h3>
          <form onSubmit={addBudget} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => !budgets.find(b => b.category === cat)).map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Budget Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Create Budget
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const progressPercentage = (budget.spentAmount / budget.budgetAmount) * 100;
          const isOverBudget = progressPercentage > 100;
          
          return (
            <Card key={budget.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                    ₹{budget.spentAmount.toLocaleString()} / ₹{budget.budgetAmount.toLocaleString()}
                  </span>
                </div>
                
                <Progress 
                  value={Math.min(progressPercentage, 100)} 
                  className={`h-2 ${isOverBudget ? 'bg-red-100' : 'bg-gray-200'}`}
                />
                
                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {isOverBudget 
                      ? `Over by ₹${(budget.spentAmount - budget.budgetAmount).toLocaleString()}`
                      : `₹${(budget.budgetAmount - budget.spentAmount).toLocaleString()} remaining`
                    }
                  </span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
