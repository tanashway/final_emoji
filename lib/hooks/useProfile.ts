import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase/client';
import { toast } from "sonner";

interface Profile {
  user_id: string;
  credits: number;
  tier: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setError(error);
          toast.error('Error loading profile');
          return;
        }

        setProfile(data);
        setError(null);
      } catch (e) {
        console.error('Unexpected error:', e);
        setError(e as Error);
        toast.error('Unexpected error loading profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.id]);

  const refreshProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (e) {
      console.error('Error refreshing profile:', e);
      toast.error('Error refreshing profile');
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refreshProfile };
} 