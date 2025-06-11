
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BudgetItem {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
}

interface BudgetFormProps {
  budgets: BudgetItem[];
  onBudgetAdded: () => void;
}

const BudgetForm = ({ budgets, onBudgetAdded }: BudgetFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const categories = [
    'Food', 'Medical', 'Clothes', 'Electricity', 'Mobile Recharge', 
    'Health', 'Transportation', 'Entertainment', 'Education', 'Rent', 
    'Utilities', 'Shopping', 'Miscellaneous'
  ];

  const addBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .insert({
          user_id: user?.id,
          category,
          amount: parseFloat(amount)
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget created successfully"
      });

      setCategory('');
      setAmount('');
      setShowForm(false);
      onBudgetAdded();
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive"
      });
    }
  };

  return (
    <>
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
    </>
  );
};

export default BudgetForm;
