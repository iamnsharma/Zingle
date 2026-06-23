import { supabase } from '@config/supabase';
import { AuthResponse, IUser } from '@types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.session) throw new Error('No session created');

      const user: IUser = {
        id: data.user!.id,
        email: data.user!.email || '',
        displayName: data.user!.user_metadata?.displayName || '',
        createdAt: data.user!.created_at || new Date().toISOString(),
        updatedAt: data.user!.updated_at || new Date().toISOString(),
      };

      return {
        user,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      throw error;
    }
  },

  async signup(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { displayName },
        },
      });

      if (error) throw error;

      if (!data.user) throw new Error('User creation failed');

      const user: IUser = {
        id: data.user.id,
        email: data.user.email || '',
        displayName: displayName || '',
        createdAt: data.user.created_at || new Date().toISOString(),
        updatedAt: data.user.updated_at || new Date().toISOString(),
      };

      return {
        user,
        token: data.session?.access_token || '',
        refreshToken: data.session?.refresh_token,
      };
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<IUser | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email || '',
      displayName: data.user.user_metadata?.displayName || '',
      createdAt: data.user.created_at || new Date().toISOString(),
      updatedAt: data.user.updated_at || new Date().toISOString(),
    };
  },
};
