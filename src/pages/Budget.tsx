
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BudgetOverviewCards from '@/components/BudgetOverviewCards';
import BudgetForm from '@/components/BudgetForm';
import BudgetItemCard from '@/components/BudgetItemCard';

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
      <BudgetOverviewCards 
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        remainingBudget={remainingBudget}
      />

      {/* Add Budget Form */}
      <BudgetForm budgets={budgets} onBudgetAdded={fetchBudgets} />

      {/* Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.length > 0 ? (
          budgets.map((budget) => (
            <BudgetItemCard 
              key={budget.id} 
              budget={budget} 
              onBudgetUpdated={fetchBudgets}
            />
          ))
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
