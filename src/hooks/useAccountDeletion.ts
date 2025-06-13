
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAccountDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();

  const deleteAccount = async () => {
    if (!user) {
      toast.error('No user found');
      return;
    }

    setIsDeleting(true);
    try {
      // Delete user data from all tables
      const deletePromises = [
        supabase.from('expenses').delete().eq('user_id', user.id),
        supabase.from('income').delete().eq('user_id', user.id),
        supabase.from('budgets').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id),
      ];

      await Promise.all(deletePromises);

      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        throw error;
      }

      toast.success('Account deleted successfully');
      
      // Sign out the user
      await supabase.auth.signOut();
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  return {
    isDeleting,
    showConfirmation,
    setShowConfirmation,
    deleteAccount,
  };
};
