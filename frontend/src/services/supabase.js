import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://twastrwbhuybxecaonmi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_g4xiH4sTyfKJPL55wb4eng_hPrVAKID';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Publishable key is missing. Please check frontend/.env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Sign up a new user with Email + Password + Metadata (Full Name)
 */
export const signUpWithEmail = async (email, password, fullName, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: fullName,
        ...metadata,
      },
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Sign in existing user with Email + Password
 */
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
};

/**
 * Sign in with Google / Gmail via Supabase OAuth
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Sign out the current user session
 */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Supabase signOut error:', error);
};

/**
 * Get active session
 */
export const getActiveSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export default supabase;
