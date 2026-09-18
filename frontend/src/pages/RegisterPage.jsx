import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  Zap,
  Target,
  Layers,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackgroundMesh from '../components/animations/BackgroundMesh';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import api from '../services/api';

const SUBJECT_OPTIONS = [
  'Python Programming',
  'Data Structures & Algorithms',
  'Mathematics for Computing',
  'Database Systems & SQL',
  'Machine Learning Fundamentals',
  'Full Stack Web Development',
  'Cloud Computing & DevOps',
  'Cybersecurity & Network Defense',
];

const CAREER_OPTIONS = [
  'AI Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'Cloud Architect',
  'Cybersecurity Specialist',
  'Data Analyst',
];

const CONTENT_OPTIONS = [
  { id: 'Interactive & Practice', title: 'Interactive Coding & Practice', desc: 'Hands-on code challenges, live sandboxes, and active recall' },
  { id: 'Video Lectures', title: 'Video Lectures', desc: 'Visual structured lectures with code-along walkthroughs' },
  { id: 'Text & Documentation', title: 'Text & Deep Documentation', desc: 'In-depth architectural guides, articles, and cheat-sheets' },
  { id: 'Visual & Diagrams', title: 'Visual & Architecture Diagrams', desc: 'Flowcharts, system architecture mind-maps, and slides' },
  { id: 'Quizzes', title: 'Rapid-fire Quizzes & Tests', desc: 'Problem sets and timed diagnostic assessments' },
];

const RegisterPage = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Sign Up error:', err);
      setError(err?.message || 'Google Sign Up could not complete. You can create an account with email below.');
      setGoogleLoading(false);
    }
  };

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [branchMajor, setBranchMajor] = useState('Computer Science & Engineering');

  // Onboarding State
  const [strongSubjects, setStrongSubjects] = useState(['Python Programming', 'Mathematics for Computing']);
  const [weakSubjects, setWeakSubjects] = useState(['Data Structures & Algorithms']);
  const [averageStudyHours, setAverageStudyHours] = useState(3.5);
  const [learningSpeed, setLearningSpeed] = useState('Balanced');
  const [preferredContentType, setPreferredContentType] = useState('Interactive & Practice');
  const [careerInterests, setCareerInterests] = useState(['AI Engineer']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const toggleArrayItem = (list, setList, item) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const [emailSent, setEmailSent] = useState(false);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email format.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        education_level: educationLevel,
        branch_major: branchMajor,
      });

      if (res?.emailConfirmationRequired) {
        setEmailSent(true);
      } else {
        setCurrentStep(1);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err?.message || err?.response?.data?.detail || 'Registration failed. Email might already exist.'
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOnboarding = async () => {
    try {
      setLoading(true);
      await api.post('/student/onboarding', {
        strong_subjects: strongSubjects,
        weak_subjects: weakSubjects,
        average_study_hours: averageStudyHours,
        learning_speed: learningSpeed,
        preferred_content_type: preferredContentType,
        career_interests: careerInterests,
        current_courses: [],
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding save error:', err);
      setError('Failed to save learning preferences. Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#FAF7F0] overflow-hidden select-none transition-colors duration-500">
      <BackgroundMesh />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake ? [-8, 8, -6, 6, -3, 3, 0] : 0,
        }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-xl z-10 my-6"
      >
        <div className="rounded-[2.5rem] bg-white/95 backdrop-blur-2xl border border-amber-200/90 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.15),0_12px_24px_-6px_rgba(0,0,0,0.06)] p-3.5 sm:p-4">
          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] rounded-[2rem] p-6 sm:p-9 border border-amber-200/70 shadow-xs">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FACC15] text-stone-950 shadow-md shadow-amber-400/25 mb-3 border border-amber-300 font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-stone-950 tracking-tight flex items-center justify-center gap-2">
                {currentStep === 0 ? 'Create Student Account' : 'Calibrate Recommendation Engine'}
              </h1>
              <p className="text-xs text-stone-600 mt-1 font-medium">
                {currentStep === 0
                  ? 'Join StudyPath to unlock AI-personalized study methods & schedules'
                  : `Step ${currentStep} of 6: Calibrating your machine learning profile`}
              </p>

              {/* Step Progress Pills */}
              {currentStep > 0 && (
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                    <div
                      key={stepNum}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        stepNum === currentStep
                          ? 'w-8 bg-[#FACC15]'
                          : stepNum < currentStep
                          ? 'w-4 bg-emerald-500'
                          : 'w-4 bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-bold"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* STEP 0: Account Form or Verification Notice */}
            {currentStep === 0 && emailSent ? (
              <div className="space-y-4 p-6 bg-amber-50/80 rounded-2xl border border-amber-300 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                  ✉️
                </div>
                <h3 className="text-base font-black text-stone-950">Verify Your Email Address</h3>
                <p className="text-xs font-bold text-stone-700 leading-relaxed">
                  We've sent a confirmation link to <strong className="text-stone-950">{email}</strong>. Please check your inbox and click the verification link to activate your StudyPath account.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-stone-950 font-black text-xs tracking-tight shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setEmailSent(false)}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 underline"
                  >
                    Edit Email Address
                  </button>
                </div>
              </div>
            ) : currentStep === 0 ? (
              <div className="space-y-4">
                {/* One-Click Google Signup */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={googleLoading || loading}
                  className="w-full py-3 px-4 bg-white hover:bg-stone-50 border-2 border-amber-200 hover:border-amber-400 rounded-2xl font-black text-xs sm:text-sm text-stone-900 flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
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
                      <span>Sign Up with Google / Gmail</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-amber-200/90 w-full" />
                  <span className="bg-[#FAF6ED] px-3 text-[11px] font-bold text-stone-600 uppercase tracking-wider shrink-0">
                    or register with email
                  </span>
                  <div className="border-t border-amber-200/90 w-full" />
                </div>

                <form onSubmit={handleAccountSubmit} className="space-y-3.5">
                  <Input
                    id="name"
                    type="text"
                    label="Full Name"
                    placeholder="Alex Chen"
                    icon={User}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />

                <Input
                  id="reg-email"
                  type="email"
                  label="Email"
                  placeholder="alex.chen@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 pl-1">
                      Education Level
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm py-2.5 px-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="High School">High School</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 pl-1">
                      Branch / Major
                    </label>
                    <select
                      value={branchMajor}
                      onChange={(e) => setBranchMajor(e.target.value)}
                      className="w-full rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm py-2.5 px-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    id="reg-pass"
                    type="password"
                    label="Password"
                    placeholder="Min 6 characters"
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Input
                    id="confirm-pass"
                    type="password"
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    icon={Lock}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.012 }}
                  whileTap={{ scale: 0.988 }}
                  disabled={loading}
                  className="w-full mt-3 py-3.5 px-6 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-stone-950 font-extrabold text-sm tracking-tight shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="mt-4 pt-4 border-t border-stone-200/80 dark:border-stone-800 text-center text-xs text-stone-600 dark:text-stone-400">
                  Already registered?{' '}
                  <Link to="/login" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold transition-colors">
                    Sign in here
                  </Link>
                </div>
              </form>
            </div>
            ) : null}

            {/* STEP 1: Strong Subjects */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 mb-0.5">Select your strongest subjects</h3>
                  <p className="text-xs text-stone-600">Helps our recommendation engine match advanced elective tracks.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {SUBJECT_OPTIONS.map((subj) => {
                    const selected = strongSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleArrayItem(strongSubjects, setStrongSubjects, subj)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-amber-100 border-amber-500 text-stone-950 shadow-xs'
                            : 'bg-white border-stone-300 text-stone-800 hover:border-amber-400'
                        }`}
                      >
                        <span>{subj}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-300">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(0)} icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button size="md" onClick={() => setCurrentStep(2)} icon={ArrowRight}>
                    Next: Weak Areas
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Weak Subjects */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 mb-0.5">Select areas you want to improve</h3>
                  <p className="text-xs text-stone-600">StudyPath prioritizes remedial modules and schedules practice blocks for these.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {SUBJECT_OPTIONS.map((subj) => {
                    const selected = weakSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleArrayItem(weakSubjects, setWeakSubjects, subj)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-amber-100 border-amber-500 text-stone-950 shadow-xs'
                            : 'bg-white border-stone-300 text-stone-800 hover:border-amber-400'
                        }`}
                      >
                        <span>{subj}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-300">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(1)} icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button size="md" onClick={() => setCurrentStep(3)} icon={ArrowRight}>
                    Next: Study Hours
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Study Hours */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 mb-0.5">Target Daily Study Time</h3>
                  <p className="text-xs text-stone-600">How many hours per day do you plan to dedicate to self-study?</p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-stone-300 text-center space-y-4 shadow-xs">
                  <div className="text-4xl font-extrabold text-amber-800">
                    {averageStudyHours} <span className="text-sm font-bold text-stone-600">hrs / day</span>
                  </div>
                  <p className="text-xs text-stone-700">
                    Estimated Weekly Allocation: <span className="text-stone-950 font-extrabold">{Math.round(averageStudyHours * 6)} hours / week</span>
                  </p>

                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={averageStudyHours}
                    onChange={(e) => setAverageStudyHours(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-stone-200 rounded-lg cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-stone-600 font-bold">
                    <span>1.0 hr (Light)</span>
                    <span>3.5 hrs (Recommended)</span>
                    <span>8.0 hrs (Intensive)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-300">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(2)} icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button size="md" onClick={() => setCurrentStep(4)} icon={ArrowRight}>
                    Next: Learning Speed
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Learning Speed */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 mb-0.5">What is your natural learning pace?</h3>
                  <p className="text-xs text-stone-600">We calibrate session durations and spaced repetition intervals to your natural pace.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 'Slow & Thorough', title: 'Slow & Thorough', desc: 'Detailed step-by-step breakdowns, comprehensive note-taking, and frequent review intervals' },
                    { id: 'Balanced', title: 'Balanced & Steady', desc: 'Standard pace balancing conceptual explanations with active problem solving' },
                    { id: 'Fast Paced', title: 'Fast Paced & Accelerated', desc: 'Rapid syntax acquisition, condensed theoretical summaries, and maximum practice challenges' },
                  ].map((item) => {
                    const selected = learningSpeed === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLearningSpeed(item.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-amber-100 border-amber-500 text-stone-950 shadow-xs'
                            : 'bg-white border-stone-300 text-stone-800 hover:border-amber-400'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-950">{item.title}</div>
                          <div className="text-[11px] text-stone-600 mt-0.5">{item.desc}</div>
                        </div>
                        {selected && <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 ml-3" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-300">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(3)} icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button size="md" onClick={() => setCurrentStep(5)} icon={ArrowRight}>
                    Next: Content Style
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Content Type */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 mb-0.5">Preferred Learning Format</h3>
                  <p className="text-xs text-stone-600">Choose the format that helps you retain complex technical material best.</p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {CONTENT_OPTIONS.map((item) => {
                    const selected = preferredContentType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPreferredContentType(item.id)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-amber-100 border-amber-500 text-stone-950 shadow-xs'
                            : 'bg-white border-stone-300 text-stone-800 hover:border-amber-400'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-950">{item.title}</div>
                          <div className="text-[11px] text-stone-600 mt-0.5">{item.desc}</div>
                        </div>
                        {selected && <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-300">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(4)} icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button size="md" onClick={() => setCurrentStep(6)} icon={ArrowRight}>
                    Next: Career Goals
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Career Goals */}
            {currentStep === 6 && (
              <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 mb-0.5">Target Career Specialization</h3>
                  <p className="text-xs text-stone-600">Used by Collaborative & Electives engines to map required competencies.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CAREER_OPTIONS.map((career) => {
                    const selected = careerInterests.includes(career);
                    return (
                      <button
                        key={career}
                        type="button"
                        onClick={() => toggleArrayItem(careerInterests, setCareerInterests, career)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-amber-100 border-amber-500 text-stone-950 shadow-xs'
                            : 'bg-white border-stone-300 text-stone-800 hover:border-amber-400'
                        }`}
                      >
                        <span>{career}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-xs text-amber-950 font-bold flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>All parameters calibrated! Finishing will build your recommendation vectors and schedule.</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-300">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(5)} icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button
                    size="md"
                    variant="primary"
                    loading={loading}
                    onClick={handleFinishOnboarding}
                    icon={CheckCircle2}
                  >
                    Finish & Launch StudyPath
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
