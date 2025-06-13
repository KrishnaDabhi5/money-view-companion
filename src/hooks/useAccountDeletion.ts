
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAccountDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const deleteAccount = async () => {
    if (!user) {
      toast.error('No user found');
      return;
    }

    setIsDeleting(true);

    try {
      // Delete user data in sequence
      console.log('Starting account deletion process...');
      
      // Delete expenses
      const { error: expensesError } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id);
      
      if (expensesError) throw new Error(`Failed to delete expenses: ${expensesError.message}`);

      // Delete income
      const { error: incomeError } = await supabase
        .from('income')
        .delete()
        .eq('user_id', user.id);
      
      if (incomeError) throw new Error(`Failed to delete income: ${incomeError.message}`);

      // Delete budgets
      const { error: budgetsError } = await supabase
        .from('budgets')
        .delete()
        .eq('user_id', user.id);
      
      if (budgetsError) throw new Error(`Failed to delete budgets: ${budgetsError.message}`);

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw new Error(`Failed to delete profile: ${profileError.message}`);

      // Delete user from auth (this should be last)
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) throw new Error(`Failed to delete user account: ${authError.message}`);

      toast.success('Account deleted successfully');
      
      // Sign out and redirect
      await signOut();
      navigate('/auth');
      
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting
  };
};
