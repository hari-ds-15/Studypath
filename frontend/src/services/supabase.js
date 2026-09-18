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
 * Dispatch real SMS OTP via Supabase Phone Auth + Twilio Verify
 * @param {string} phone - E.164 formatted phone number (e.g. +14155552671)
 */
export const sendPhoneOtp = async (phone) => {
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: cleanPhone,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Verify SMS OTP token sent via Twilio Verify
 * @param {string} phone - E.164 formatted phone number
 * @param {string} token - 6-digit verification code
 */
export const verifyPhoneOtp = async (phone, token) => {
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  const cleanToken = token.trim().replace(/\s+/g, '');
  const { data, error } = await supabase.auth.verifyOtp({
    phone: cleanPhone,
    token: cleanToken,
    type: 'sms',
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
