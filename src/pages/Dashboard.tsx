
import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import ExpenseForm from '@/components/ExpenseForm';
import ChartCard from '@/components/ChartCard';
import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 2500, category: 'Food', description: 'Groceries', date: '2024-06-10', type: 'expense' },
    { id: '2', amount: 50000, category: 'Salary', description: 'Monthly salary', date: '2024-06-01', type: 'income' },
    { id: '3', amount: 1200, category: 'Transportation', description: 'Uber rides', date: '2024-06-09', type: 'expense' },
    { id: '4', amount: 800, category: 'Entertainment', description: 'Movie tickets', date: '2024-06-08', type: 'expense' },
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

  // Prepare chart data
  const expensesByCategory = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`₹${balance.toLocaleString()}`}
          icon={<Wallet className="h-6 w-6 text-white" />}
          trend={{ value: `${savingsRate}%`, isPositive: balance >= 0 }}
        />
        <StatCard
          title="Monthly Income"
          value={`₹${totalIncome.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          trend={{ value: "From salary", isPositive: true }}
        />
        <StatCard
          title="Monthly Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          icon={<TrendingDown className="h-6 w-6 text-white" />}
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon={<PieChart className="h-6 w-6 text-white" />}
          trend={{ value: "This month", isPositive: parseFloat(savingsRate) > 20 }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Transaction Form */}
        <div className="lg:col-span-1">
          <ExpenseForm onSubmit={addTransaction} />
        </div>

        {/* Spending Breakdown Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Spending Breakdown"
            data={pieChartData}
            type="pie"
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.category}</p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
