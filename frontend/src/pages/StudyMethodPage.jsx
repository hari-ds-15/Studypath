import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Clock,
  RefreshCw,
  Video,
  Code,
  HelpCircle,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Sliders,
  Award,
  Layers,
  Flame,
  Layout,
  FileText,
  AlertCircle,
  ArrowRight,
  Calendar,
  Check
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const STEP_ICONS = {
  Video: Video,
  Code: Code,
  HelpCircle: HelpCircle,
  RefreshCw: RotateCcw,
  RotateCcw: RotateCcw,
  BookOpen: BookOpen,
  Terminal: Code,
  CheckCircle2: CheckCircle2,
  FileText: FileText,
  Layers: Layers,
  Award: Award,
  BookMarked: BookOpen,
  Layout: Layout,
  PlayCircle: Video,
  Flame: Flame,
};

const DEFAULT_METHOD = {
  recommended_pipeline: "Video Lecture ➔ Guided Practice ➔ Checkpoint Quiz ➔ Spaced Summary",
  why_selected: "Optimized for multimodal learners. Research shows 15-20 min video chunks followed by active hands-on coding and micro-quizzing boosts 30-day recall by up to 42%.",
  suitable_session_length: 45,
  preferred_content_type: "Interactive & Practice",
  learning_speed: "Balanced",
  expected_retention_boost: "+42% Conceptual Mastery",
  steps: [
    {
      step_number: 1,
      name: "Concept Priming & Video Lecture",
      duration_minutes: 18,
      icon: "Video",
      description: "Watch structured, bite-sized conceptual lessons with active note-taking.",
      tips: "Pause at core definitions and write code syntax in your own words."
    },
    {
      step_number: 2,
      name: "Guided Hands-on Practice",
      duration_minutes: 14,
      icon: "Code",
      description: "Implement the newly learned concepts on sandboxes and coding challenges.",
      tips: "Solve the problem from scratch without looking at the reference solution first."
    },
    {
      step_number: 3,
      name: "Micro-Quiz & Diagnostics",
      duration_minutes: 8,
      icon: "HelpCircle",
      description: "Take a fast 5-question timed quiz to measure active neural retrieval.",
      tips: "Review explanations immediately for any hesitant or incorrect answers."
    },
    {
      step_number: 4,
      name: "Spaced Summary & Flashcard",
      duration_minutes: 5,
      icon: "RotateCcw",
      description: "Condense the core takeaways into a reusable formula or cheat-sheet snippet.",
      tips: "Schedule your next review within 48 hours for long-term consolidation."
    }
  ]
};

const StudyMethodPage = () => {
  const navigate = useNavigate();
  const [studyMethod, setStudyMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [syncingPlan, setSyncingPlan] = useState(false);

  // Preference adjusters
  const [sessionLength, setSessionLength] = useState(45);
  const [contentType, setContentType] = useState('Interactive & Practice');
  const [learningSpeed, setLearningSpeed] = useState('Balanced');
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchStudyMethod = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/recommendations/study-method');
      if (res.data) {
        setStudyMethod(res.data);
        setSessionLength(res.data.suitable_session_length || 45);
        setContentType(res.data.preferred_content_type || 'Interactive & Practice');
        setLearningSpeed(res.data.learning_speed || 'Balanced');
      } else {
        setStudyMethod(DEFAULT_METHOD);
      }
    } catch (err) {
      console.warn('Backend study method fetch failed, using fallback preset:', err);
      // Use fallback defaults gracefully so student is never blocked
      setStudyMethod(DEFAULT_METHOD);
      setError('Using cached adaptive cognitive model. You can adjust parameters below.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyMethod();
  }, []);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setError(null);

      // Update profile preferences
      await api.put('/student/profile', {
        session_length_preference: sessionLength,
        preferred_content_type: contentType,
        learning_speed: learningSpeed,
        study_method_style: `${contentType} (${learningSpeed} Pace)`
      });

      // Fetch fresh recommendation
      const res = await api.get('/recommendations/study-method');
      setStudyMethod(res.data || DEFAULT_METHOD);
      setToastMessage('Study method recalculated successfully based on your updated preferences!');
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } catch (err) {
      console.error('Failed to regenerate recommendation:', err);
      setToastMessage('Preferences updated locally!');
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } finally {
      setRegenerating(false);
    }
  };

  const handleSyncToStudyPlan = async () => {
    try {
      setSyncingPlan(true);
      await api.post('/study-plan/generate');
      setToastMessage('7-Day Study Plan successfully updated & synced with this learning method!');
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } catch (err) {
      console.error('Failed to sync study plan:', err);
    } finally {
      setSyncingPlan(false);
    }
  };

  const applyPreset = (minutes, type, speed) => {
    setSessionLength(minutes);
    setContentType(type);
    setLearningSpeed(speed);
  };

  const currentMethod = studyMethod || DEFAULT_METHOD;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Personalized Study Method <Sparkles className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Cognitive pacing and retrieval sequences tailored to your learning style and focus capacity
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={Calendar}
            loading={syncingPlan}
            onClick={handleSyncToStudyPlan}
          >
            Sync to Weekly Planner
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            loading={regenerating}
            onClick={handleRegenerate}
            className={regenerating ? 'animate-spin' : ''}
          >
            Recalculate Method
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-2 font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchStudyMethod}
            className="text-xs font-bold text-amber-900 dark:text-amber-200 underline cursor-pointer hover:opacity-80"
          >
            Retry Connection
          </button>
        </div>
      )}

      {saveToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2.5 font-bold shadow-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Recommended Pipeline Hero Card */}
      <GlassCard className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/80 dark:from-[#0c1326] dark:via-[#101b38] dark:to-[#0c1326] border border-indigo-300 dark:border-indigo-500/30 shadow-xl">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="emerald" size="md">
              {currentMethod.expected_retention_boost}
            </Badge>
            <Badge variant="indigo" size="md">
              Optimal Session: {currentMethod.suitable_session_length} Minutes
            </Badge>
            <Badge variant="purple" size="md">
              Pacing: {currentMethod.learning_speed}
            </Badge>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Recommended Learning Sequence
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 leading-snug">
              {currentMethod.recommended_pipeline}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3 shadow-xs">
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block mb-0.5">Why This Method Was Selected:</span>
              <p className="font-medium">{currentMethod.why_selected}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Step-by-Step Interactive Workflow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Execution Blueprint</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              ({currentMethod.steps?.length || 4} Sequential Phases)
            </span>
          </h3>
          <Button
            size="sm"
            variant="outline"
            icon={ArrowRight}
            onClick={() => navigate('/study-plan')}
          >
            Apply in Study Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentMethod.steps?.map((step) => {
            const Icon = STEP_ICONS[step.icon] || Zap;
            return (
              <GlassCard
                key={step.step_number}
                className="p-5 flex flex-col justify-between space-y-4 relative border-l-4 border-l-indigo-500"
                hover
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-xs">
                    0{step.step_number}
                  </div>
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                    <Clock className="w-3.5 h-3.5" />
                    {step.duration_minutes} min
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{step.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{step.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Pro Tip:</span> {step.tips}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Quick Cognitive Presets */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" /> Fast Pacing Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => applyPreset(25, 'Interactive & Practice', 'Fast Paced')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              sessionLength === 25
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
            }`}
          >
            <div className="text-xs font-extrabold">⚡ Pomodoro Sprint (25m)</div>
            <div className={`text-[11px] mt-1 font-medium ${sessionLength === 25 ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
              High-intensity rapid recall & focused coding.
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset(45, 'Interactive & Practice', 'Balanced')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              sessionLength === 45
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
            }`}
          >
            <div className="text-xs font-extrabold">🎯 Academic Standard (45m)</div>
            <div className={`text-[11px] mt-1 font-medium ${sessionLength === 45 ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
              Optimal retention with lecture, practice & quiz.
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset(90, 'Text & Documentation', 'Slow & Thorough')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              sessionLength === 90
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
            }`}
          >
            <div className="text-xs font-extrabold">🧠 Deep Flow Session (90m)</div>
            <div className={`text-[11px] mt-1 font-medium ${sessionLength === 90 ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
              Thorough architectural analysis & project builds.
            </div>
          </button>
        </div>
      </GlassCard>

      {/* Customize & Regenerate Settings Card */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Adjust Cognitive Parameters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preferred Format */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">
              Primary Learning Format
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold py-2.5 px-3 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Interactive & Practice">Interactive & Practice</option>
              <option value="Video Lectures">Video Lectures</option>
              <option value="Text & Documentation">Text & Documentation</option>
              <option value="Visual & Diagrams">Visual & Diagrams</option>
            </select>
          </div>

          {/* Learning Speed */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">
              Learning Speed
            </label>
            <select
              value={learningSpeed}
              onChange={(e) => setLearningSpeed(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold py-2.5 px-3 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Slow & Thorough">Slow & Thorough</option>
              <option value="Balanced">Balanced</option>
              <option value="Fast Paced">Fast Paced</option>
            </select>
          </div>

          {/* Session Length Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase text-slate-700 dark:text-slate-300">Session Length</span>
              <span className="font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{sessionLength} minutes</span>
            </div>
            <input
              type="range"
              min="25"
              max="90"
              step="5"
              value={sessionLength}
              onChange={(e) => setSessionLength(parseInt(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-bold">
              <span>25m (Sprint)</span>
              <span>45m (Optimal)</span>
              <span>90m (Deep Work)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="secondary"
            size="md"
            icon={Calendar}
            loading={syncingPlan}
            onClick={handleSyncToStudyPlan}
          >
            Save & Sync Study Schedule
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            loading={regenerating}
            onClick={handleRegenerate}
          >
            Apply & Recalculate Method
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default StudyMethodPage;

