import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BudgetItem {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
}

const Budget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const categories = [
    'Food', 'Medical', 'Clothes', 'Electricity', 'Mobile Recharge', 
    'Health', 'Transportation', 'Entertainment', 'Education', 'Rent', 
    'Utilities', 'Shopping', 'Miscellaneous'
  ];

  // Fetch budgets and expenses from database
  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      // Fetch budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id);

      if (budgetsError) throw budgetsError;

      // Fetch expenses to calculate spent amounts
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('user_id', user?.id);

      if (expensesError) throw expensesError;

      // Calculate spent amounts by category
      const spentByCategory = expensesData?.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>) || {};

      // Combine budgets with spent amounts
      const budgetItems: BudgetItem[] = budgetsData?.map(budget => ({
        id: budget.id,
        category: budget.category,
        budgetAmount: budget.amount,
        spentAmount: spentByCategory[budget.category] || 0
      })) || [];

      setBudgets(budgetItems);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: "Error",
        description: "Failed to load budgets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
      fetchBudgets(); // Refresh the list
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive"
      });
    }
  };

  const editBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget || !editAmount) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          amount: parseFloat(editAmount)
        })
        .eq('id', editingBudget.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget updated successfully"
      });

      setEditDialogOpen(false);
      setEditingBudget(null);
      setEditAmount('');
      fetchBudgets(); // Refresh the list
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (budget: BudgetItem) => {
    setEditingBudget(budget);
    setEditAmount(budget.budgetAmount.toString());
    setEditDialogOpen(true);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const remainingBudget = totalBudget - totalSpent;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const progressPercentage = (budget.spentAmount / budget.budgetAmount) * 100;
            const isOverBudget = progressPercentage > 100;
            
            return (
              <Card key={budget.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                  <Dialog open={editDialogOpen && editingBudget?.id === budget.id} onOpenChange={(open) => {
                    if (!open) {
                      setEditDialogOpen(false);
                      setEditingBudget(null);
                      setEditAmount('');
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditClick(budget)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Budget - {budget.category}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={editBudget} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-amount">Budget Amount (₹)</Label>
                          <Input
                            id="edit-amount"
                            type="number"
                            placeholder="0.00"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setEditDialogOpen(false);
                              setEditingBudget(null);
                              setEditAmount('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            Update Budget
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
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
          })
        ) : (
          <div className="lg:col-span-2">
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No budgets created yet</p>
              <p className="text-sm text-gray-400">Click "Add Budget" to create your first budget</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
