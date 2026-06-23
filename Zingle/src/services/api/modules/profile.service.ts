import { supabase } from '@config/supabase';
import { IProfile } from '@types';

export const profileService = {
  async getProfileById(userId: string): Promise<IProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getProfileById:', error);
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<IProfile>): Promise<IProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('userId', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },

  async discoverProfiles(limit: number = 10): Promise<IProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error discovering profiles:', error);
      return [];
    }
  },
};
