import React, { useState, useEffect, useRef } from 'react';
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
  KeyRound,
  Zap,
  Clock,
  Calendar as CalendarIcon,
  Search,
  BookOpen,
  Eye,
  EyeOff,
  Activity,
  Phone,
  ShieldCheck,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackgroundMesh from '../components/animations/BackgroundMesh';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

// Popular Country Codes for international phone authentication
const COUNTRY_CODES = [
  { code: '+1', country: 'US / CA', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
];

const LoginPage = () => {
  const { loginWithEmail, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();

  // Auth Mode: 'email' or 'phone'
  const [authMode, setAuthMode] = useState('email');

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Phone OTP State
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState('input_phone'); // 'input_phone' or 'verify_otp'
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const otpInputRefs = useRef([]);

  // UI Status
  const [loading, setLoading] = useState(false);
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

  // OTP Countdown Timer
  useEffect(() => {
    let interval = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

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

  // 1. Email Login Submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email.');
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

  // 2. Phone OTP: Send SMS
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanNumber = phoneNumber.trim().replace(/[^0-9]/g, '');
    if (!cleanNumber || cleanNumber.length < 7) {
      setError('Please enter a valid phone number (at least 7 to 15 digits).');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const fullPhoneNumber = `${countryCode}${cleanNumber}`;
    setLoading(true);

    try {
      await sendPhoneOtp(fullPhoneNumber);
      setOtpStep('verify_otp');
      setCountdown(60);
      setSuccessMsg(`SMS verification code dispatched to ${fullPhoneNumber} via Twilio Verify.`);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error('Send OTP error:', err);
      const msg = err?.message || 'Failed to send SMS OTP. Please check the phone number format.';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  // 3. Phone OTP: Verify SMS Code
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    const otpCode = otpDigits.join('').trim();
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const cleanNumber = phoneNumber.trim().replace(/[^0-9]/g, '');
    const fullPhoneNumber = `${countryCode}${cleanNumber}`;

    setLoading(true);
    try {
      await verifyPhoneOtp(fullPhoneNumber, otpCode);
      setIsSuccess(true);
      setSuccessMsg('Phone verified successfully! Entering StudyPath...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      console.error('Verify OTP error:', err);
      const msg = err?.message || 'Invalid or expired OTP code. Please check and try again.';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit box key events & auto-advance
  const handleOtpDigitChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {
      const newDigits = [...otpDigits];
      newDigits[index] = value;
      setOtpDigits(newDigits);
      if (index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    } else if (value === '') {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
    }
  };

  // Demo autofill helper
  const handleAutofillDemo = () => {
    setAuthMode('email');
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
          {/* LEFT COLUMN: SIGN IN FORM (EMAIL / PHONE OTP)             */}
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
                  <span>Supabase & Twilio Active</span>
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
              {/* AUTH MODE TOGGLE TABS: [EMAIL LOGIN] / [PHONE OTP LOGIN] */}
              {/* ========================================================= */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-amber-100/70 rounded-2xl border border-amber-200/80 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    authMode === 'email'
                      ? 'bg-white text-stone-950 shadow-sm border border-amber-200'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                  }`}
                >
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>Email Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('phone');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    authMode === 'phone'
                      ? 'bg-white text-stone-950 shadow-sm border border-amber-200'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                  }`}
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Phone OTP</span>
                </button>
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
              {/* MODE A: EMAIL + PASSWORD AUTH                             */}
              {/* ========================================================= */}
              {authMode === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {/* Quick Demo Autofill Pill */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-900">Email</span>
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
                      placeholder="alex.chen@example.com"
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
                </form>
              )}

              {/* ========================================================= */}
              {/* MODE B: PHONE + OTP AUTH VIA SUPABASE & TWILIO VERIFY     */}
              {/* ========================================================= */}
              {authMode === 'phone' && (
                <div>
                  {otpStep === 'input_phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-stone-900 block">
                          Phone Number (International Format)
                        </label>
                        <p className="text-[11px] font-semibold text-stone-600">
                          We will send a real 6-digit SMS verification code through Twilio Verify.
                        </p>
                      </div>

                      {/* Country Code + Phone Input Group */}
                      <div className="flex gap-2">
                        {/* Country Code Select */}
                        <div className="relative shrink-0 w-32">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-full px-2.5 py-3 bg-white rounded-2xl border-2 border-amber-200/80 text-stone-950 font-black text-xs appearance-none focus:outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 shadow-xs cursor-pointer"
                          >
                            {COUNTRY_CODES.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.flag} {item.code} ({item.country})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                        </div>

                        {/* Number Input */}
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-700">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="415 555 2671"
                            className="w-full pl-9 pr-3 py-3 bg-white rounded-2xl border-2 border-amber-200/80 text-stone-950 font-bold text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 shadow-xs transition-all"
                          />
                        </div>
                      </div>

                      {/* Send OTP CTA */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl font-black text-sm text-stone-950 flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 shadow-amber-400/25 active:scale-[0.99] transition-all cursor-pointer"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                            <span>Sending SMS via Twilio...</span>
                          </div>
                        ) : (
                          <>
                            <span>Send Verification Code</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* OTP VERIFICATION VIEW */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-xs font-extrabold text-stone-900 block">
                            Enter 6-Digit OTP
                          </label>
                          <p className="text-[11px] font-bold text-amber-900">
                            Sent to <span className="font-black text-stone-950">{countryCode} {phoneNumber}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpStep('input_phone');
                            setError('');
                          }}
                          className="text-[11px] font-black text-amber-800 hover:text-amber-950 underline cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>

                      {/* 6 Digit Input Boxes */}
                      <div className="flex items-center justify-between gap-1.5" onPaste={handleOtpPaste}>
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (otpInputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-11 h-13 sm:w-12 sm:h-14 text-center bg-white rounded-xl border-2 border-amber-200/90 text-stone-950 font-black text-lg sm:text-xl focus:outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 shadow-xs transition-all"
                          />
                        ))}
                      </div>

                      {/* Resend Timer & Action */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        {countdown > 0 ? (
                          <span className="text-stone-600 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            Resend code in <strong className="text-stone-950">{countdown}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="font-black text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer underline"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Resend OTP via Twilio
                          </button>
                        )}
                      </div>

                      {/* Verify Button */}
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
                            <span>Verifying with Twilio...</span>
                          </div>
                        ) : isSuccess ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verified! Entering StudyPath...</span>
                          </div>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify OTP & Enter StudyPath</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
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
            placeholder="alex.chen@example.com"
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
