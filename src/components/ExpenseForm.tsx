
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (expense: {
    amount: number;
    category: string;
    description: string;
    date: string;
    type: 'expense' | 'income';
  }) => void;
}

const categories = [
  'Food', 'Medical', 'Clothes', 'Electricity', 'Mobile Recharge', 
  'Health', 'Transportation', 'Entertainment', 'Education', 'Rent', 
  'Utilities', 'Shopping', 'Miscellaneous'
];

const incomeCategories = [
  'Salary', 'Freelance', 'Rental Income', 'Investment Returns', 'Gifts', 'Other'
];

const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString().split('T')[0],
      type
    });

    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Plus className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: 'expense' | 'income') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {(type === 'expense' ? categories : incomeCategories).map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </Button>
      </form>
    </Card>
  );
};

export default ExpenseForm;
