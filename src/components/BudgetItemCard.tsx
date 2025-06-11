
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BudgetItem {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
}

interface BudgetItemCardProps {
  budget: BudgetItem;
  onBudgetUpdated: () => void;
}

const BudgetItemCard = ({ budget, onBudgetUpdated }: BudgetItemCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editAmount, setEditAmount] = useState('');

  const progressPercentage = (budget.spentAmount / budget.budgetAmount) * 100;
  const isOverBudget = progressPercentage > 100;

  const editBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAmount) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          amount: parseFloat(editAmount)
        })
        .eq('id', budget.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget updated successfully"
      });

      setEditDialogOpen(false);
      setEditAmount('');
      onBudgetUpdated();
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = () => {
    setEditAmount(budget.budgetAmount.toString());
    setEditDialogOpen(true);
  };

  return (
    <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditDialogOpen(false);
            setEditAmount('');
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleEditClick}
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
};

export default BudgetItemCard;
