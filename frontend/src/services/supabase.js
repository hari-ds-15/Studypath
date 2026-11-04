import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://twastrwbhuybxecaonmi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_g4xiH4sTyfKJPL55wb4eng_hPrVAKID';

/**
 * Check whether a valid, custom Supabase project is configured
 */
export const isSupabaseConfigured = () => {
  if (!import.meta.env.VITE_SUPABASE_URL && supabaseUrl.includes('twastrwbhuybxecaonmi')) {
    return false;
  }
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('twastrwbhuybxecaonmi'));
};

let reachabilityCache = null;
let lastCheckTime = 0;

/**
 * Check whether Supabase is reachable via network
 */
export const isSupabaseReachable = async () => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const now = Date.now();
  if (reachabilityCache !== null && now - lastCheckTime < 30000) {
    return reachabilityCache;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    reachabilityCache = true;
    lastCheckTime = now;
    return true;
  } catch {
    reachabilityCache = false;
    lastCheckTime = now;
    return false;
  }
};

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
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_UNCONFIGURED');
  }

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
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_UNCONFIGURED');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
};

/**
 * Sign in with Google / Gmail via Supabase OAuth (with pre-flight reachability guard)
 */
export const signInWithGoogle = async () => {
  const reachable = await isSupabaseReachable();
  if (!reachable) {
    throw new Error('SUPABASE_UNREACHABLE');
  }

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
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Supabase signOut error:', error);
  } catch {
    // Ignore offline errors on sign out
  }
};

/**
 * Get active session
 */
export const getActiveSession = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  } catch {
    return null;
  }
};

export default supabase;
