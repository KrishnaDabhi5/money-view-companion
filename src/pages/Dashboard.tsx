
import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import ExpenseForm from '@/components/ExpenseForm';
import ChartCard from '@/components/ChartCard';
import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeDashboard } from '@/hooks/useRealtimeDashboard';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { metrics, loading: metricsLoading } = useRealtimeDashboard();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent transactions
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Set up real-time subscription for transactions list
  useEffect(() => {
    if (!user) return;

    const expensesChannel = supabase
      .channel('dashboard-transactions-expenses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Expenses changed, refreshing transactions...');
          fetchTransactions();
        }
      )
      .subscribe();

    const incomeChannel = supabase
      .channel('dashboard-transactions-income')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'income',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Income changed, refreshing transactions...');
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(incomeChannel);
    };
  }, [user]);

  const fetchTransactions = async () => {
    try {
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (expensesError) throw expensesError;

      // Fetch income
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (incomeError) throw incomeError;

      // Combine and format transactions
      const expenseTransactions = expensesData?.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description || '',
        date: expense.date,
        type: 'expense' as const
      })) || [];

      const incomeTransactions = incomeData?.map(income => ({
        id: income.id,
        amount: income.amount,
        category: income.source,
        description: income.description || '',
        date: income.date,
        type: 'income' as const
      })) || [];

      const allTransactions = [...expenseTransactions, ...incomeTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (transaction.type === 'expense') {
        const { error } = await supabase
          .from('expenses')
          .insert({
            user_id: user?.id,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            date: transaction.date
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('income')
          .insert({
            user_id: user?.id,
            amount: transaction.amount,
            source: transaction.category,
            description: transaction.description,
            date: transaction.date
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `${transaction.type === 'expense' ? 'Expense' : 'Income'} added successfully`
      });

      // Real-time subscription will handle the refresh automatically
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive"
      });
    }
  };

  if (loading || metricsLoading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`₹${metrics.balance.toLocaleString()}`}
          icon={<Wallet className="h-6 w-6 text-white" />}
          trend={{ value: `${metrics.savingsRate}%`, isPositive: metrics.balance >= 0 }}
        />
        <StatCard
          title="Monthly Income"
          value={`₹${metrics.totalIncome.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          trend={{ value: "From all sources", isPositive: true }}
        />
        <StatCard
          title="Monthly Expenses"
          value={`₹${metrics.totalExpenses.toLocaleString()}`}
          icon={<TrendingDown className="h-6 w-6 text-white" />}
        />
        <StatCard
          title="Savings Rate"
          value={`${metrics.savingsRate}%`}
          icon={<PieChart className="h-6 w-6 text-white" />}
          trend={{ value: "This month", isPositive: parseFloat(metrics.savingsRate) > 20 }}
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
            data={metrics.pieChartData}
            type="pie"
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
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
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No transactions yet. Add your first transaction above!</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
