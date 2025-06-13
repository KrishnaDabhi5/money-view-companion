
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  current_monthly_goal: number;
  created_at: string;
  updated_at: string;
  preferred_language?: string;
  preferred_currency?: string;
  preferred_date_format?: string;
  preferred_theme?: string;
  biometrics_enabled?: boolean;
  pin_enabled?: boolean;
  auto_logout?: boolean;
  notification_preferences?: any;
}

export const useRealtimeProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { error: 'No user or profile found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to update profile' 
      };
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchProfile();

    // Set up real-time subscription for profile changes
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile changed:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            setProfile(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [user]);

  return { 
    profile, 
    loading, 
    error, 
    updateProfile, 
    refetch: fetchProfile 
  };
};
