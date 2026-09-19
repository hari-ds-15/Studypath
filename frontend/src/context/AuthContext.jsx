import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import supabase, {
  signUpWithEmail as sbSignUpWithEmail,
  signInWithEmail as sbSignInWithEmail,
  signInWithGoogle as sbSignInWithGoogle,
  signOutUser as sbSignOutUser,
  getActiveSession as sbGetActiveSession
} from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('studypath_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('studypath_token') || null);
  const [supabaseSession, setSupabaseSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Smart helper to extract user's real name from Google metadata or email
  const extractRealName = (sbUser, fallback = null) => {
    if (!sbUser) return fallback || 'Student';
    const meta = sbUser.user_metadata || {};
    if (meta.full_name && meta.full_name.trim() && !meta.full_name.toLowerCase().includes('studypath student')) {
      return meta.full_name.trim();
    }
    if (meta.name && meta.name.trim() && !meta.name.toLowerCase().includes('studypath student')) {
      return meta.name.trim();
    }
    if (meta.given_name && meta.given_name.trim()) {
      return `${meta.given_name} ${meta.family_name || ''}`.trim();
    }
    if (fallback && fallback.trim() && !fallback.toLowerCase().includes('studypath student')) {
      return fallback.trim();
    }
    if (sbUser.email) {
      const raw = sbUser.email.split('@')[0].replace(/[._0-9-]+/g, ' ').trim();
      if (raw) {
        return raw.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }
    return 'Student';
  };

  // Sync Supabase user with backend database for study plan / analytics / profile consistency
  const syncWithBackend = async (supabaseUser, fallbackName = null) => {
    const email = supabaseUser?.email || (supabaseUser?.phone ? `phone_${supabaseUser.phone.replace('+', '')}@studypath.student` : '');
    const fullName = extractRealName(supabaseUser, fallbackName);

    try {
      const res = await api.post('/auth/supabase-sync', {
        supabase_id: supabaseUser?.id,
        email: email || null,
        phone: supabaseUser?.phone || null,
        full_name: fullName,
      });

      const { access_token, user_id, onboarding_completed } = res.data;
      const userData = {
        id: user_id || supabaseUser?.id || 'sb_user',
        supabase_id: supabaseUser?.id,
        email: email || res.data.email,
        full_name: fullName || res.data.full_name,
        phone: supabaseUser?.phone || null,
        onboarding_completed: onboarding_completed ?? true,
      };

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('studypath_token', access_token);
      localStorage.setItem('studypath_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.warn('Backend sync failed, using client Supabase session fallback:', err);
      // Fallback to client-only session if backend is restarting
      const userData = {
        id: supabaseUser?.id || 'sb_user',
        email: email,
        phone: supabaseUser?.phone || '',
        full_name: fullName,
        onboarding_completed: true,
      };
      const tokenString = supabaseUser?.id || 'sb_token_active';
      setToken(tokenString);
      setUser(userData);
      localStorage.setItem('studypath_token', tokenString);
      localStorage.setItem('studypath_user', JSON.stringify(userData));
      return userData;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check active Supabase session
        const session = await sbGetActiveSession();
        if (session && session.user) {
          setSupabaseSession(session);
          await syncWithBackend(session.user);
        } else {
          // 2. Check local storage fallback
          const savedToken = localStorage.getItem('studypath_token');
          if (savedToken) {
            try {
              const res = await api.get('/auth/me');
              setUser(res.data);
              localStorage.setItem('studypath_user', JSON.stringify(res.data));
            } catch {
              // Token might be expired
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase Auth state changes (including OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseSession(session);
      if (event === 'SIGNED_IN' && session?.user) {
        await syncWithBackend(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        localStorage.removeItem('studypath_token');
        localStorage.removeItem('studypath_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * 1. Login with Email + Password via Supabase Auth
   */
  const loginWithEmail = async (email, password) => {
    try {
      const data = await sbSignInWithEmail(email, password);
      if (data && data.session && data.user) {
        setSupabaseSession(data.session);
        const syncedUser = await syncWithBackend(data.user);
        return syncedUser;
      }
    } catch (sbErr) {
      console.warn('Supabase sign-in fallback to local/backend auth:', sbErr?.message || sbErr);
    }

    // Fallback: Local / API instant login
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user_id, full_name, onboarding_completed } = res.data;
    const userData = {
      id: user_id || 1,
      email: email.trim().toLowerCase(),
      full_name: full_name || extractRealName(null, email.split('@')[0]),
      onboarding_completed: onboarding_completed ?? true
    };
    setToken(access_token || 'sb_active_session');
    setUser(userData);
    localStorage.setItem('studypath_token', access_token || 'sb_active_session');
    localStorage.setItem('studypath_user', JSON.stringify(userData));
    return userData;
  };

  /**
   * 2. Sign In with Google / Gmail via Supabase OAuth
   */
  const loginWithGoogle = async () => {
    return await sbSignInWithGoogle();
  };

  /**
   * 3. Signup with Email + Password via Supabase Auth
   */
  const registerWithEmail = async (formData) => {
    const { email, password, full_name, ...otherFields } = formData;
    try {
      const data = await sbSignUpWithEmail(email, password, full_name, otherFields);
      if (data && data.session && data.user) {
        setSupabaseSession(data.session);
        const syncedUser = await syncWithBackend(data.user, full_name);
        return { user: syncedUser, session: data.session, emailConfirmationRequired: false };
      }
    } catch (sbErr) {
      console.warn('Supabase signup fallback to local/backend registration:', sbErr?.message || sbErr);
    }

    // Fallback local registration
    const res = await api.post('/auth/register', formData);
    const { access_token, user_id, full_name: registeredName } = res.data;
    const userData = {
      id: user_id || 1,
      email: email.trim().toLowerCase(),
      full_name: registeredName || full_name || extractRealName(null, email.split('@')[0]),
      onboarding_completed: true
    };
    setToken(access_token || 'sb_active_session');
    setUser(userData);
    localStorage.setItem('studypath_token', access_token || 'sb_active_session');
    localStorage.setItem('studypath_user', JSON.stringify(userData));
    return { user: userData, session: null, emailConfirmationRequired: false };
  };

  /**
   * 4. 1-Click Instant Demo / Guest Login
   */
  const loginAsGuest = async (customName = "Alex Chen", customEmail = "alex.chen@studypath.edu") => {
    const guestUser = {
      id: "guest_student_01",
      email: customEmail,
      full_name: customName,
      onboarding_completed: true,
    };
    const tokenString = "demo_token_active";
    setToken(tokenString);
    setUser(guestUser);
    localStorage.setItem('studypath_token', tokenString);
    localStorage.setItem('studypath_user', JSON.stringify(guestUser));
    return guestUser;
  };

  /**
   * 5. Logout User
   */
  const logout = async () => {
    try {
      await sbSignOutUser();
    } catch (err) {
      console.warn('Supabase logout error:', err);
    }
    setToken(null);
    setUser(null);
    setSupabaseSession(null);
    localStorage.removeItem('studypath_token');
    localStorage.removeItem('studypath_user');
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('studypath_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        supabaseSession,
        login: loginWithEmail,
        loginWithEmail,
        loginWithGoogle,
        loginAsGuest,
        register: registerWithEmail,
        registerWithEmail,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
