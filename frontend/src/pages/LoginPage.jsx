import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar as CalendarIcon,
  Search,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackgroundMesh from '../components/animations/BackgroundMesh';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import api from '../services/api';

const LoginPage = () => {
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI Status
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-Time Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-Time Dynamic 7-Day Calendar Strip
  const getRealTimeWeekDays = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ...
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek);

    const days = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const isToday = d.toDateString() === now.toDateString();
      days.push({
        day: dayLabels[i],
        date: d.getDate(),
        isToday,
      });
    }
    return days;
  };

  const weekDays = getRealTimeWeekDays();
  const monthName = currentTime.toLocaleString('default', { month: 'long' });
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  // 1. Google / Gmail One-Click Sign In
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Sign In error:', err);
      const msg = err?.message || 'Google OAuth is pending setup in Supabase. You can use Email Login or 1-Click Instant Access below!';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setGoogleLoading(false);
    }
  };

  // 2. Instant 1-Click Guest / Demo Login
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError('');
    try {
      await loginAsGuest('Harinadh Reddy', 'harinadh@studypath.student');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Instant access failed. Please try Email Login.');
    } finally {
      setGuestLoading(false);
    }
  };

  // 2. Email Login Submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      const msg = err?.message || err?.response?.data?.detail || 'Invalid email or password. Please try again.';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  // Demo autofill helper
  const handleAutofillDemo = () => {
    setEmail('alex.chen@studypath.edu');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans selection:bg-amber-400 selection:text-stone-900">
      {/* Background Animated Ambient Mesh */}
      <BackgroundMesh />

      {/* Main Luxury Floating Split Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-white/95 rounded-[2.5rem] border border-amber-200/90 shadow-[0_20px_70px_-15px_rgba(245,158,11,0.15),0_0_0_1px_rgba(245,158,11,0.1)] backdrop-blur-xl relative z-10 overflow-hidden p-3 sm:p-5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: SIGN IN FORM (GOOGLE OAUTH & EMAIL LOGIN)    */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between border border-amber-200/70 shadow-xs">
            
            {/* Top Bar: Brand Pill + Security Status */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-amber-200/80 shadow-xs">
                  <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-stone-950 font-bold text-xs">
                    ⚡
                  </div>
                  <span className="text-xs font-black text-stone-900 tracking-tight">StudyPath • AI</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase Active</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 mb-5">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                  Welcome to StudyPath
                </h1>
                <p className="text-xs sm:text-sm font-bold text-stone-700">
                  Adaptive AI Learning, Verified Certificates & Personalized Roadmaps.
                </p>
              </div>

              {/* ========================================================= */}
              {/* GOOGLE / GMAIL ONE-CLICK SIGN IN                          */}
              {/* ========================================================= */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-3 px-4 bg-white hover:bg-stone-50 border-2 border-amber-200 hover:border-amber-400 rounded-2xl font-black text-xs sm:text-sm text-stone-900 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                {googleLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google / Gmail</span>
                  </>
                )}
              </button>

              {/* Elegant Divider */}
              <div className="relative flex items-center justify-center my-4.5">
                <div className="border-t border-amber-200/90 w-full" />
                <span className="bg-[#FAF6ED] px-3 text-[11px] font-bold text-stone-600 uppercase tracking-wider shrink-0">
                  or sign in with email
                </span>
                <div className="border-t border-amber-200/90 w-full" />
              </div>

              {/* Error & Success Banners */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-start gap-2 mb-4 shadow-xs"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-start gap-2 mb-4 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ========================================================= */}
              {/* EMAIL + PASSWORD AUTH FORM                                */}
              {/* ========================================================= */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {/* Quick Demo Autofill Pill */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-stone-900">Email Address</span>
                  <button
                    type="button"
                    onClick={handleAutofillDemo}
                    className="text-[11px] font-black text-amber-800 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300/80 px-2 py-0.5 rounded-full border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-800 fill-current" />
                    Quick Demo Autofill
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-2 border-amber-200/80 text-stone-950 font-bold text-sm placeholder:text-stone-400 placeholder:font-normal focus:outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 shadow-xs transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-900">Password</span>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] font-black text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-700">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-white rounded-2xl border-2 border-amber-200/80 text-stone-950 font-bold text-sm placeholder:text-stone-400 placeholder:font-normal focus:outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 shadow-xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-700 hover:text-stone-950 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs font-bold text-stone-800 cursor-pointer">
                    Keep me signed in on this device
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || isSuccess}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm text-stone-950 flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    isSuccess
                      ? 'bg-emerald-400 shadow-emerald-400/20'
                      : 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 shadow-amber-400/25 active:scale-[0.99]'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Supabase Session...</span>
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Welcome Back! Redirecting...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Instant Demo Access Button */}
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={guestLoading || isSuccess}
                  className="w-full py-2.5 px-4 bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 rounded-2xl font-black text-xs text-amber-950 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-xs"
                >
                  {guestLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-800 fill-current" />
                  )}
                  <span>1-Click Instant Student Login ➔</span>
                </button>
              </form>
            </div>

            {/* Bottom Footer: Signup Link */}
            <div className="pt-5 mt-4 border-t border-amber-200/60 text-center">
              <p className="text-xs font-bold text-stone-700">
                Don't have an account yet?{' '}
                <Link
                  to="/register"
                  className="font-black text-amber-800 hover:text-amber-950 underline underline-offset-2"
                >
                  Create Student Account
                </Link>
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: LIVE INTERACTIVE VISUAL SHOWCASE             */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-gradient-to-br from-amber-400/20 via-amber-300/10 to-yellow-400/20 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between border border-amber-200/80 relative overflow-hidden">
            
            {/* Background Image / Ambient Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Student studying with laptop"
                className="w-full h-full object-cover opacity-25 filter saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-amber-900/10" />
            </div>

            {/* TOP WIDGET: LIVE REAL-TIME CLOCK & TIMEFLOW */}
            <div className="relative z-10 space-y-3">
              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-stone-950 font-black shadow-xs">
                    <Clock className="w-5 h-5 text-stone-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                        Live Study Session
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <div className="text-base sm:text-lg font-black text-stone-950 tracking-tight">
                      {formattedTime}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-stone-600 block">{monthName}</span>
                  <span className="text-xs font-black text-amber-900">Real-Time Clock</span>
                </div>
              </div>

              {/* DYNAMIC 7-DAY REAL-TIME CALENDAR FLOW */}
              <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-md">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-black text-stone-950 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                    Weekly Study Flow
                  </span>
                  <span className="text-[11px] font-bold text-stone-600">Today Highlighted</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {weekDays.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-center transition-all ${
                        item.isToday
                          ? 'bg-gradient-to-b from-amber-400 to-yellow-400 text-stone-950 font-black shadow-md border border-amber-300 scale-105 striped-glass-pattern'
                          : 'bg-amber-50/70 border border-amber-100/80 text-stone-800'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase">{item.day}</div>
                      <div className="text-xs sm:text-sm font-black mt-0.5">{item.date}</div>
                      {item.isToday && (
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-950 mx-auto mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM WIDGET: ACTING STUDENT IN LAPTOP SEARCHING COURSES */}
            <div className="relative z-10 mt-4">
              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-stone-950 text-amber-300 flex items-center justify-center font-bold text-xs">
                      🎓
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-950">
                        Live AI Course Matcher
                      </h4>
                      <p className="text-[10px] font-bold text-stone-600">
                        Active Student Searching Verified Courses
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Live Match
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <Search className="w-3.5 h-3.5 text-amber-700" />
                    <span>Full-Stack AI & Data Science</span>
                  </div>
                  <span className="text-[11px] font-black text-amber-900">18 Certified Courses</span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 px-1 pt-0.5">
                  <span>Stanford • MIT • YouTube Direct</span>
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" />
                    100% Free Resources
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
      >
        <div className="space-y-4">
          <p className="text-xs font-bold text-stone-700">
            Enter your email address. We will send you instructions to securely reset your password.
          </p>

          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="yourname@gmail.com"
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-amber-200 text-stone-950 font-bold text-sm focus:outline-none focus:border-amber-500"
          />

          {forgotMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
              {forgotMessage}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={forgotLoading}
              onClick={async () => {
                if (!forgotEmail) return;
                setForgotLoading(true);
                try {
                  const res = await api.post('/auth/forgot-password', { email: forgotEmail });
                  setForgotMessage(res.data.message || 'Reset link dispatched.');
                } catch {
                  setForgotMessage('Reset instructions have been sent to your email.');
                } finally {
                  setForgotLoading(false);
                }
              }}
            >
              Send Reset Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
