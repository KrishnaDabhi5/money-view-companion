
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  spendingTrend: Array<{
    date: string;
    amount: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  keyMetrics: {
    averageDailySpend: number;
    highestExpense: { amount: number; category: string };
    mostFrequent: { category: string; count: number };
    budgetUtilization: number;
  };
}

export const useRealtimeAnalytics = (timeframe: string = 'monthly') => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate: string;
      let endDate = now.toISOString().split('T')[0];

      switch (timeframe) {
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          break;
        default: // monthly
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      }

      // Fetch expenses with date filtering
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

      // Fetch income with date filtering
      const { data: incomeData } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

      // Fetch budgets
      const { data: budgetsData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      // Process monthly data
      const monthlyData = processMonthlyData(expensesData || [], incomeData || [], timeframe);
      
      // Process spending trend
      const spendingTrend = processSpendingTrend(expensesData || [], timeframe);
      
      // Process category data
      const categoryData = processCategoryData(expensesData || []);
      
      // Calculate key metrics
      const keyMetrics = calculateKeyMetrics(expensesData || [], budgetsData || []);

      setAnalyticsData({
        monthlyData,
        spendingTrend,
        categoryData,
        keyMetrics
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    fetchAnalyticsData();

    // Subscribe to real-time changes
    const expensesChannel = supabase
      .channel('expenses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Expenses changed, refreshing analytics...');
          fetchAnalyticsData();
        }
      )
      .subscribe();

    const incomeChannel = supabase
      .channel('income-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'income',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Income changed, refreshing analytics...');
          fetchAnalyticsData();
        }
      )
      .subscribe();

    const budgetsChannel = supabase
      .channel('budgets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Budgets changed, refreshing analytics...');
          fetchAnalyticsData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(incomeChannel);
      supabase.removeChannel(budgetsChannel);
    };
  }, [user, timeframe]);

  return { analyticsData, loading, refetch: fetchAnalyticsData };
};

// Helper functions for data processing
const processMonthlyData = (expenses: any[], income: any[], timeframe: string) => {
  const groupBy = timeframe === 'weekly' ? 'week' : timeframe === 'yearly' ? 'year' : 'month';
  
  // Group expenses and income by time period
  const expenseGroups: Record<string, number> = {};
  const incomeGroups: Record<string, number> = {};

  expenses.forEach(expense => {
    const key = formatDateKey(expense.date, groupBy);
    expenseGroups[key] = (expenseGroups[key] || 0) + expense.amount;
  });

  income.forEach(inc => {
    const key = formatDateKey(inc.date, groupBy);
    incomeGroups[key] = (incomeGroups[key] || 0) + inc.amount;
  });

  // Combine and format
  const allKeys = [...new Set([...Object.keys(expenseGroups), ...Object.keys(incomeGroups)])].sort();
  
  return allKeys.map(key => ({
    month: key,
    income: incomeGroups[key] || 0,
    expenses: expenseGroups[key] || 0,
    savings: (incomeGroups[key] || 0) - (expenseGroups[key] || 0)
  }));
};

const processSpendingTrend = (expenses: any[], timeframe: string) => {
  const groupBy = timeframe === 'weekly' ? 'day' : timeframe === 'yearly' ? 'month' : 'week';
  
  const groups: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const key = formatDateKey(expense.date, groupBy);
    groups[key] = (groups[key] || 0) + expense.amount;
  });

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }));
};

const processCategoryData = (expenses: any[]) => {
  const categoryTotals: Record<string, number> = {};
  
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0
  }));
};

const calculateKeyMetrics = (expenses: any[], budgets: any[]) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const dayCount = Math.max(1, new Set(expenses.map(exp => exp.date)).size);
  
  // Find highest expense
  const highestExpense = expenses.reduce((max, exp) => 
    exp.amount > max.amount ? exp : max, 
    { amount: 0, category: 'None' }
  );

  // Find most frequent category
  const categoryCount: Record<string, number> = {};
  expenses.forEach(exp => {
    categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
  });
  
  const mostFrequentEntry = Object.entries(categoryCount).reduce((max, [cat, count]) => 
    count > max.count ? { category: cat, count } : max,
    { category: 'None', count: 0 }
  );

  // Calculate budget utilization
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

  return {
    averageDailySpend: Math.round(totalExpenses / dayCount),
    highestExpense,
    mostFrequent: mostFrequentEntry,
    budgetUtilization
  };
};

const formatDateKey = (date: string, groupBy: string): string => {
  const d = new Date(date);
  
  switch (groupBy) {
    case 'day':
      return d.toISOString().split('T')[0];
    case 'week':
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      return `Week ${weekStart.toISOString().split('T')[0]}`;
    case 'month':
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    case 'year':
      return d.getFullYear().toString();
    default:
      return date;
  }
};
