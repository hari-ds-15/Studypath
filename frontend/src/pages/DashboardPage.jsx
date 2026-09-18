import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  HelpCircle,
  Zap,
  BookOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  Layers,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  Play,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  Target,
  Award,
  Video,
  Code,
  RotateCcw,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import FreeCertificatesAndCoursesHub from '../components/common/FreeCertificatesAndCoursesHub';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SESSION_TYPES = ['Video', 'Practice', 'Quiz', 'Revision', 'Reading'];

const TYPE_STYLES = {
  Video: {
    badge: 'rose',
    icon: Video,
    border: 'border-l-4 border-l-rose-500 border-amber-200/80 bg-white/95',
    timeBg: 'bg-rose-500/10 text-rose-800 border-rose-500/20'
  },
  Practice: {
    badge: 'emerald',
    icon: Code,
    border: 'border-l-4 border-l-emerald-500 border-amber-200/80 bg-white/95',
    timeBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20'
  },
  Quiz: {
    badge: 'purple',
    icon: HelpCircle,
    border: 'border-l-4 border-l-purple-500 border-amber-200/80 bg-white/95',
    timeBg: 'bg-purple-500/10 text-purple-800 border-purple-500/20'
  },
  Revision: {
    badge: 'amber',
    icon: RotateCcw,
    border: 'border-l-4 border-l-amber-500 border-amber-200/80 bg-white/95',
    timeBg: 'bg-amber-500/10 text-amber-900 border-amber-500/20'
  },
  Reading: {
    badge: 'sky',
    icon: BookOpen,
    border: 'border-l-4 border-l-sky-500 border-amber-200/80 bg-white/95',
    timeBg: 'bg-sky-500/10 text-sky-800 border-sky-500/20'
  }
};

const DEFAULT_STUDY_HOURS = [
  { day: 'Mon', hours: 3.2, target: 3.0 },
  { day: 'Tue', hours: 2.8, target: 3.0 },
  { day: 'Wed', hours: 4.1, target: 3.0 },
  { day: 'Thu', hours: 2.5, target: 3.0 },
  { day: 'Fri', hours: 3.8, target: 3.0 },
  { day: 'Sat', hours: 4.5, target: 3.0 },
  { day: 'Sun', hours: 3.0, target: 3.0 }
];

const DEFAULT_SUBJECT_MASTERY = [
  { subject: 'Python & AI', score: 94, fullMark: 100 },
  { subject: 'DSA', score: 78, fullMark: 100 },
  { subject: 'SQL / DB', score: 85, fullMark: 100 },
  { subject: 'Web Dev', score: 90, fullMark: 100 },
  { subject: 'Cloud & DevOps', score: 75, fullMark: 100 },
  { subject: 'System Design', score: 82, fullMark: 100 }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Hourly Session Edit / Create Modal State
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [sessionType, setSessionType] = useState('Practice');
  const [notes, setNotes] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // Academic Goals Modal State
  const [academicModalOpen, setAcademicModalOpen] = useState(false);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(20);
  const [averageStudyHours, setAverageStudyHours] = useState(3.5);
  const [learningSpeed, setLearningSpeed] = useState('Balanced');
  const [studyMethodStyle, setStudyMethodStyle] = useState('Video -> Practice -> Quiz -> Revision');
  const [academicSaving, setAcademicSaving] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, recsRes, planRes, profileRes] = await Promise.all([
        api.get('/analytics?timeframe=30d'),
        api.get('/recommendations/courses'),
        api.get('/study-plan'),
        api.get('/student/profile')
      ]);
      setAnalytics(analyticsRes.data);
      setRecommendations(recsRes.data);
      setWeeklyPlan(planRes.data);
      setProfile(profileRes.data);
      setWeeklyTargetHours(profileRes.data.weekly_target_hours || 20);
      setAverageStudyHours(profileRes.data.average_study_hours || 3.5);
      setLearningSpeed(profileRes.data.learning_speed || 'Balanced');
      setStudyMethodStyle(profileRes.data.study_method_style || 'Video -> Practice -> Quiz -> Revision');

      // Auto-set selected day to current day of week if in range
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = dayNames[new Date().getDay()];
      if (DAYS.includes(todayName)) {
        setSelectedDay(todayName);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleCompleted = async (sessionId) => {
    try {
      await api.post(`/study-plan/${sessionId}/toggle-complete`);
      const res = await api.get('/study-plan');
      setWeeklyPlan(res.data);
    } catch (err) {
      console.error('Error toggling session:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this hourly study session?')) return;
    try {
      await api.delete(`/study-plan/${sessionId}`);
      const res = await api.get('/study-plan');
      setWeeklyPlan(res.data);
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const handleOpenAdd = (defaultDay = selectedDay) => {
    setEditingSessionId(null);
    setTitle('');
    setSubjectName('Data Structures & Algorithms');
    setDayOfWeek(defaultDay);
    setStartTime('18:00');
    setEndTime('19:15');
    setSessionType('Practice');
    setNotes('');
    setModalError('');
    setSessionModalOpen(true);
  };

  const handleOpenEdit = (session) => {
    setEditingSessionId(session.id);
    setTitle(session.title);
    setSubjectName(session.subject_name);
    setDayOfWeek(session.day_of_week);
    setStartTime(session.start_time);
    setEndTime(session.end_time);
    setSessionType(session.session_type || 'Practice');
    setNotes(session.notes || '');
    setModalError('');
    setSessionModalOpen(true);
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!title.trim() || !subjectName.trim()) {
      setModalError('Please provide a session title and subject topic.');
      return;
    }
    if (startTime >= endTime) {
      setModalError('End time must be after start time.');
      return;
    }

    try {
      setModalLoading(true);
      const payload = {
        title: title.trim(),
        subject_name: subjectName.trim(),
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        session_type: sessionType,
        notes: notes.trim(),
      };

      if (editingSessionId) {
        await api.put(`/study-plan/${editingSessionId}`, payload);
      } else {
        await api.post('/study-plan', payload);
      }

      setSessionModalOpen(false);
      const res = await api.get('/study-plan');
      setWeeklyPlan(res.data);
    } catch (err) {
      setModalError(
        err.response?.data?.detail || 'Failed to save session. Check for time overlap.'
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveAcademicGoals = async (e) => {
    e.preventDefault();
    try {
      setAcademicSaving(true);
      await api.put('/student/profile', {
        weekly_target_hours: parseFloat(weeklyTargetHours),
        average_study_hours: parseFloat(averageStudyHours),
        learning_speed: learningSpeed,
        study_method_style: studyMethodStyle
      });
      // Re-fetch dashboard data
      const [analyticsRes, planRes, profileRes] = await Promise.all([
        api.get('/analytics?timeframe=30d'),
        api.post('/study-plan/generate'),
        api.get('/student/profile')
      ]);
      setAnalytics(analyticsRes.data);
      setWeeklyPlan(planRes.data);
      setProfile(profileRes.data);
      setAcademicModalOpen(false);
    } catch (err) {
      console.error('Failed to update academic goals:', err);
    } finally {
      setAcademicSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 dark:bg-slate-900/60 rounded-3xl border border-slate-300 dark:border-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-900/60 rounded-2xl border border-slate-300 dark:border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  const topRecs = recommendations.slice(0, 3);
  const currentDaySessions = weeklyPlan?.sessions_by_day?.[selectedDay] || [];

  // Compute actual first name from user full_name or email prefix
  const userFirstName = (() => {
    if (user?.full_name && !user.full_name.toLowerCase().includes('studypath student')) {
      return user.full_name.trim().split(/\s+/)[0];
    }
    if (user?.email) {
      const raw = user.email.split('@')[0].replace(/[._0-9-]+/g, ' ').trim();
      if (raw) {
        const first = raw.split(/\s+/)[0];
        return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
      }
    }
    return 'Student';
  })();

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 border border-amber-300 shadow-xl shadow-amber-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-950/10 border border-stone-950/15 text-stone-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            AI Academic & Study Optimization Engine Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
            Welcome back, {userFirstName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-stone-900 max-w-xl font-semibold">
            Weekly Target: <span className="font-extrabold text-stone-950">{profile?.weekly_target_hours || 20} hours</span> • Strategy: <span className="font-extrabold text-stone-950">{profile?.learning_speed || 'Balanced'} Pace</span>. You have{' '}
            <span className="font-extrabold text-stone-950 bg-white/70 px-2 py-0.5 rounded-lg">{weeklyPlan?.pending_sessions_count || 0} upcoming sessions</span> this week.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Button
            size="md"
            variant="primary"
            icon={Target}
            onClick={() => setAcademicModalOpen(true)}
          >
            Edit Academic Goals
          </Button>
          <Button
            size="md"
            variant="secondary"
            icon={Calendar}
            onClick={() => navigate('/study-plan')}
          >
            Full Planner
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <GlassCard className="p-4 sm:p-5" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Weekly Study</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={analytics?.total_study_hours || 18.5} decimals={1} suffix=" hrs" />
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Target: {profile?.weekly_target_hours || 20}h
              </span>
              <button
                type="button"
                onClick={() => setAcademicModalOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </GlassCard>

        {/* KPI 2 */}
        <GlassCard className="p-4 sm:p-5" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Quiz Average</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={analytics?.quiz_average_score || 82.5} decimals={1} suffix="%" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-purple-700 dark:text-purple-300 font-bold">
              <span>{analytics?.quizzes_taken_count || 5} tests evaluated</span>
            </div>
          </div>
        </GlassCard>

        {/* KPI 3 */}
        <GlassCard className="p-4 sm:p-5" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Efficiency</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={analytics?.learning_efficiency_score || 84.5} decimals={1} suffix="/100" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 font-bold">
              <span>+6.2% vs baseline</span>
            </div>
          </div>
        </GlassCard>

        {/* KPI 4 */}
        <GlassCard className="p-4 sm:p-5" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Course Progress</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={analytics?.course_completion_rate || 68.0} decimals={0} suffix="%" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
              <span>{analytics?.enrolled_courses_count || 3} Active Tracks</span>
            </div>
          </div>
        </GlassCard>

        {/* KPI 5 */}
        <GlassCard className="p-4 sm:p-5" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Free Courses & Certs</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30">
              <Award className="w-4 h-4 text-sky-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={12} decimals={0} suffix=" Domains" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-sky-700 dark:text-sky-300 font-bold">
              <span>Free Certs & YouTube Hub</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Study Hours Trend */}
        <GlassCard className="lg:col-span-2 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Weekly Study Hours vs Target</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Daily breakdown of completed study time vs planned target</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Last 7 Days</Badge>
              <button
                type="button"
                onClick={() => setAcademicModalOpen(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800"
              >
                Change Target ({profile?.weekly_target_hours || 20}h)
              </button>
            </div>
          </div>

          <div className="h-64 w-full pt-2 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.study_hours_trend && analytics.study_hours_trend.length > 0 ? analytics.study_hours_trend : DEFAULT_STUDY_HOURS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="hours" name="Actual Hours" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                <Area type="monotone" dataKey="target" name="Target Hours" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Right: Subject Radar */}
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Subject Mastery Radar</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Diagnostic strength & growth areas</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analytics?.subject_mastery && analytics.subject_mastery.length > 0 ? analytics.subject_mastery : DEFAULT_SUBJECT_MASTERY}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.25)" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis stroke="#94a3b8" fontSize={9} angle={30} domain={[0, 100]} />
                <Radar name="Mastery Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Hourly Study Schedule & Academic Goals Card */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Clock className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Hourly Study Plan & Academic Schedule
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
              Directly edit, reschedule, mark completed, or add custom sessions for each day of the week.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              icon={Target}
              onClick={() => setAcademicModalOpen(true)}
            >
              Academic Goals ({profile?.weekly_target_hours || 20}h/wk)
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={Plus}
              onClick={() => handleOpenAdd(selectedDay)}
            >
              Add Hourly Session
            </Button>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DAYS.map((day) => {
            const count = weeklyPlan?.sessions_by_day?.[day]?.length || 0;
            const completedCount = weeklyPlan?.sessions_by_day?.[day]?.filter(s => s.is_completed).length || 0;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{day}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {completedCount}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sessions for Selected Day */}
        <div className="space-y-3">
          {currentDaySessions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <Calendar className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No hourly study sessions scheduled for {selectedDay} yet.
              </p>
              <Button
                size="sm"
                variant="primary"
                icon={Plus}
                onClick={() => handleOpenAdd(selectedDay)}
              >
                Add Session for {selectedDay}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentDaySessions.map((session) => {
                const style = TYPE_STYLES[session.session_type] || TYPE_STYLES.Practice;
                const IconComponent = style.icon;

                return (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-2xl shadow-xs border transition-all flex flex-col justify-between space-y-3 ${style.border} ${
                      session.is_completed ? 'opacity-70 bg-slate-50 dark:bg-slate-900/50' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top bar: Time, Type, Complete Toggle */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black border ${style.timeBg}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{session.start_time} - {session.end_time}</span>
                        </span>

                        <Badge variant={style.badge} size="sm">
                          <IconComponent className="w-3 h-3 mr-1 inline" />
                          {session.session_type}
                        </Badge>
                      </div>

                      {/* Subject and Title */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {session.subject_name}
                        </span>
                        <h4 className={`text-sm font-extrabold text-slate-900 dark:text-white leading-snug mt-0.5 ${
                          session.is_completed ? 'line-through text-slate-500 dark:text-slate-400' : ''
                        }`}>
                          {session.title}
                        </h4>
                      </div>

                      {/* Notes / Instructions */}
                      {session.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                          {session.notes}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons: Toggle, Edit, Delete */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleCompleted(session.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
                          session.is_completed
                            ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        {session.is_completed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-slate-400" />
                            <span>Mark Complete</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(session)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Session"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(session.id)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Top AI Recommendations Highlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Top AI Recommendations <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Tailored based on your strong Python skills & target career in AI</p>
          </div>
          <Link
            to="/recommendations"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition-colors"
          >
            View all ({recommendations.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topRecs.map((course) => (
            <GlassCard key={course.course_id} className="p-4 flex flex-col justify-between" hover>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {course.category}
                  </span>
                  {(user?.onboarding_completed || profile?.onboarding_completed) ? (
                    <Badge variant="emerald" size="sm">
                      {course.match_score}% Match
                    </Badge>
                  ) : (
                    <Badge variant="amber" size="sm">
                      Core Subject
                    </Badge>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{course.course_name}</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-2">{course.explanation}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{course.estimated_duration}</span>
                <Button
                  size="sm"
                  variant="outline"
                  icon={Play}
                  onClick={() => navigate(`/learning/${course.course_id}`)}
                >
                  Start
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Universal Free Programming Courses, YouTube Channels & Free Certificates Hub */}
      <div className="space-y-4 pt-2">
        <FreeCertificatesAndCoursesHub />
      </div>

      {/* Session Edit / Add Modal */}
      <Modal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        title={editingSessionId ? 'Edit Hourly Study Session' : 'Add New Hourly Study Session'}
        subtitle="Customize your subject, start/end hours, session style, and study tasks."
      >
        <form onSubmit={handleSaveSession} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Session Title
            </label>
            <Input
              type="text"
              placeholder="e.g. Master Binary Search & Two-Pointer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject / Topic
              </label>
              <Input
                type="text"
                placeholder="e.g. Python, DSA, Machine Learning"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Time (HH:MM)
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Time (HH:MM)
              </label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Session Type & Style
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SESSION_TYPES.map((type) => {
                const isSel = sessionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSessionType(type)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      isSel
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Action Steps (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Solve 3 LeetCode medium questions and review time complexity."
              className="w-full px-3.5 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSessionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={modalLoading}
            >
              {modalLoading ? 'Saving...' : editingSessionId ? 'Update Session' : 'Create Session'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Academic Goals & Targets Edit Modal */}
      <Modal
        isOpen={academicModalOpen}
        onClose={() => setAcademicModalOpen(false)}
        title="Edit Academic Goals & Study Targets"
        subtitle="Adjust your weekly target hours and study speed. The engine will automatically rebalance your schedule."
      >
        <form onSubmit={handleSaveAcademicGoals} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Target Hours (hrs)
              </label>
              <Input
                type="number"
                min="2"
                max="80"
                step="0.5"
                value={weeklyTargetHours}
                onChange={(e) => setWeeklyTargetHours(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daily Study Target (hrs/day)
              </label>
              <Input
                type="number"
                min="0.5"
                max="16"
                step="0.5"
                value={averageStudyHours}
                onChange={(e) => setAverageStudyHours(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Learning Speed / Academic Pace
            </label>
            <select
              value={learningSpeed}
              onChange={(e) => setLearningSpeed(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Intensive">Intensive (Fast-track, high volume)</option>
              <option value="Balanced">Balanced (Optimal retention & practice)</option>
              <option value="Relaxed">Relaxed (Steady, flexible pace)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Study Method Flow
            </label>
            <select
              value={studyMethodStyle}
              onChange={(e) => setStudyMethodStyle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Video -> Practice -> Quiz -> Revision">Video ➔ Practice ➔ Quiz ➔ Revision (Recommended)</option>
              <option value="Theory First -> Project Based">Theory First ➔ Project Based</option>
              <option value="Quiz & Active Recall Driven">Quiz & Active Recall Driven</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAcademicModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={academicSaving}
            >
              {academicSaving ? 'Updating Schedule...' : 'Save & Rebalance Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;

