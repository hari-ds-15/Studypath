import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  HelpCircle,
  Zap,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid
} from 'recharts';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import AnimatedCounter from '../components/animations/AnimatedCounter';

const TIMEFRAMES = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: 'all', label: 'All Time' },
];

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (tf) => {
    try {
      setLoading(true);
      const res = await api.get(`/analytics?timeframe=${tf}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Academic Performance Analytics <BarChart3 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time telemetry measuring study consistency, concept retention, and subject mastery
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === tf.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Study Hours</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <AnimatedCounter value={analytics?.total_study_hours || 0} decimals={1} suffix=" hrs" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Target: {analytics?.target_study_hours || 0} hrs for this window
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Quiz Average Score</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <AnimatedCounter value={analytics?.quiz_average_score || 0} decimals={1} suffix="%" />
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-300 mt-1">
            {analytics?.quizzes_taken_count || 0} Assessments Completed
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Learning Efficiency</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <AnimatedCounter value={analytics?.learning_efficiency_score || 0} decimals={1} suffix="/100" />
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> High Retention Band
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Curriculum Completion</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <AnimatedCounter value={analytics?.course_completion_rate || 0} decimals={0} suffix="%" />
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-300 mt-1 font-medium">
            {analytics?.completed_courses_count || 1} of {analytics?.enrolled_courses_count || 3} Tracks Finished
          </p>
        </GlassCard>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Study Hours Timeline */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Study Hours Over Time</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Actual daily study hours logged vs target allocation</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.study_hours_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
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
                <Area type="monotone" dataKey="hours" name="Actual Hours" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#anHours)" />
                <Area type="monotone" dataKey="target" name="Target Target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 2: Quiz Score Progression Line Chart */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Quiz Score Progression</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chronological assessment scores</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.quiz_score_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score %"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#a855f7' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 3: Subject Mastery Radar */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Subject Competency Radar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Diagnostic balance across core areas</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analytics?.subject_mastery || []}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis stroke="#64748b" fontSize={9} angle={30} domain={[0, 100]} />
                <Radar name="Mastery %" dataKey="score" stroke="#818cf8" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Diagnostic Breakdown: Strong vs Weak Areas */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Cognitive Diagnostic Breakdown</h3>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Validated Strong Subjects
              </span>
              <div className="flex flex-wrap gap-2">
                {analytics?.strong_subjects?.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4" /> Targeted Priority Growth Areas
              </span>
              <div className="flex flex-wrap gap-2">
                {analytics?.weak_subjects?.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 mt-2">
              <span className="font-bold text-indigo-950 dark:text-white block mb-0.5">Algorithm Insight:</span>
              Our Hybrid engine assigns a +6% prioritization weight to course tracks covering your identified priority growth areas.
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;
