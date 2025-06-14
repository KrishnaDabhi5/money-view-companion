
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

const AMOUNT_MAX = 10000000;
const CATEGORY_MAXLEN = 50;
const DESCRIPTION_MAXLEN = 500;

const isValidDate = (dateString: string) => {
  // Accept ISO date only
  const parsed = Date.parse(dateString);
  if (Number.isNaN(parsed)) return false;
  // No more than 10 years in the past/future
  const now = new Date();
  const d = new Date(dateString);
  const years = Math.abs(now.getFullYear() - d.getFullYear());
  return years <= 10;
};

const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    setError(null);
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const numericAmount = parseFloat(amount);

    if (!amount || Number.isNaN(numericAmount)) {
      setError('Amount is required and must be a number.');
      return false;
    }
    if (numericAmount < 0) {
      setError('Amount must be at least 0.');
      return false;
    }
    if (numericAmount > AMOUNT_MAX) {
      setError(`Amount cannot exceed ₹${AMOUNT_MAX.toLocaleString()}.`);
      return false;
    }
    if (!trimmedCategory) {
      setError('Category is required.');
      return false;
    }
    if (trimmedCategory.length > CATEGORY_MAXLEN) {
      setError(`Category cannot be more than ${CATEGORY_MAXLEN} characters.`);
      return false;
    }
    if (trimmedDescription.length > DESCRIPTION_MAXLEN) {
      setError(`Description cannot be more than ${DESCRIPTION_MAXLEN} characters.`);
      return false;
    }
    // Validate date format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    if (!isValidDate(today)) {
      setError('Date is invalid.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      amount: parseFloat(amount),
      category: category.trim().slice(0, CATEGORY_MAXLEN),
      description: description.trim().slice(0, DESCRIPTION_MAXLEN),
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
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" spellCheck={false}>
        {error && (
          <div className="text-red-600 font-medium text-sm py-1">
            {error}
          </div>
        )}

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
              inputMode="decimal"
              min={0}
              max={AMOUNT_MAX}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(val) => setCategory(val.trim().slice(0, CATEGORY_MAXLEN))}>
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
            maxLength={DESCRIPTION_MAXLEN}
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

