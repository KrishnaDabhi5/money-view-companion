
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: string;
  pieChartData: Array<{ name: string; value: number }>;
  monthlyGoal: number;
  goalProgress: number;
}

export const useRealtimeDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardMetrics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Fetch current month expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('date', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`);

      // Fetch current month income
      const { data: incomeData } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('date', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`);

      // Fetch user profile for monthly goal
      const { data: profileData } = await supabase
        .from('profiles')
        .select('current_monthly_goal')
        .eq('id', user.id)
        .single();

      const totalIncome = incomeData?.reduce((sum, inc) => sum + inc.amount, 0) || 0;
      const totalExpenses = expensesData?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
      const balance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';
      const monthlyGoal = profileData?.current_monthly_goal || 0;
      const goalProgress = monthlyGoal > 0 ? Math.min((balance / monthlyGoal) * 100, 100) : 0;

      // Process pie chart data
      const expensesByCategory = expensesData?.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>) || {};

      const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value,
      }));

      setMetrics({
        totalIncome,
        totalExpenses,
        balance,
        savingsRate,
        pieChartData,
        monthlyGoal,
        goalProgress
      });
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchDashboardMetrics();

    // Set up real-time subscriptions
    const expensesChannel = supabase
      .channel('dashboard-expenses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Expenses changed, refreshing dashboard...');
          fetchDashboardMetrics();
        }
      )
      .subscribe();

    const incomeChannel = supabase
      .channel('dashboard-income')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'income',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Income changed, refreshing dashboard...');
          fetchDashboardMetrics();
        }
      )
      .subscribe();

    const profileChannel = supabase
      .channel('dashboard-profile')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        () => {
          console.log('Profile changed, refreshing dashboard...');
          fetchDashboardMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(incomeChannel);
      supabase.removeChannel(profileChannel);
    };
  }, [user]);

  return { metrics, loading, refetch: fetchDashboardMetrics };
};
