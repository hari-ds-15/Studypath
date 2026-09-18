import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Sparkles,
  RefreshCw,
  AlertCircle,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Video,
  Code,
  Target,
  Award,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Settings
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
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

const StudyPlanPage = () => {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'courses_hub'
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Session Modal Form State
  const [modalOpen, setModalOpen] = useState(false);
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

  const fetchPlanAndProfile = async () => {
    try {
      setLoading(true);
      const [planRes, profileRes] = await Promise.all([
        api.get('/study-plan'),
        api.get('/student/profile')
      ]);
      setWeeklyPlan(planRes.data);
      setProfile(profileRes.data);
      setWeeklyTargetHours(profileRes.data.weekly_target_hours || 20);
      setAverageStudyHours(profileRes.data.average_study_hours || 3.5);
      setLearningSpeed(profileRes.data.learning_speed || 'Balanced');
      setStudyMethodStyle(profileRes.data.study_method_style || 'Video -> Practice -> Quiz -> Revision');
    } catch (err) {
      console.error('Failed to load study plan and profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanAndProfile();
  }, []);

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      const res = await api.post('/study-plan/generate');
      setWeeklyPlan(res.data);
    } catch (err) {
      console.error('Error auto-generating plan:', err);
    } finally {
      setGenerating(false);
    }
  };

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
    setModalOpen(true);
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
    setModalOpen(true);
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

      setModalOpen(false);
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
      // Refresh plan with updated target hours
      await handleGeneratePlan();
      setAcademicModalOpen(false);
    } catch (err) {
      console.error('Failed to update academic goals:', err);
    } finally {
      setAcademicSaving(false);
    }
  };

  if (loading && !weeklyPlan) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold animate-pulse">
        Initializing Study Schedule & Academic Planner...
      </div>
    );
  }

  const currentDaySessions = weeklyPlan?.sessions_by_day?.[selectedDay] || [];

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              Personalized Study & Academic Plan <CalendarIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
            Weekly spaced repetition schedule balanced around target exam topics, weak subjects, and daily focus hours
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="md"
            icon={Target}
            onClick={() => setAcademicModalOpen(true)}
            className="border-2 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold"
          >
            Edit Academic Goals
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={Sparkles}
            loading={generating}
            onClick={handleGeneratePlan}
            className="font-bold"
          >
            Auto-Generate AI Plan
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => handleOpenAdd(selectedDay)}
            className="font-extrabold shadow-lg shadow-indigo-600/30"
          >
            Add Hourly Session
          </Button>
        </div>
      </div>

      {/* Main View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>7-Day Hourly Study Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('courses_hub')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'courses_hub'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Free Courses, YouTube Channels & Certifications Hub</span>
        </button>
      </div>

      {activeTab === 'courses_hub' ? (
        /* Universal Programming Courses & Free Certificates Directory */
        <FreeCertificatesAndCoursesHub />
      ) : (
        /* Hourly Schedule & Academic Plan View */
        <div className="space-y-6">
          {/* Academic Goals Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 border border-amber-300 shadow-xl shadow-amber-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-stone-950 text-amber-300 font-black text-xs uppercase tracking-wider">
                  Academic Roadmap
                </span>
                <span className="text-xs text-stone-900 font-extrabold">
                  {profile?.branch_major || 'Computer Science'} • {profile?.education_level || 'Undergraduate'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-950">
                Weekly Target: {weeklyTargetHours} Hours • Pace: {learningSpeed}
              </h3>
              <p className="text-xs text-stone-800 max-w-xl font-bold">
                Method: <span className="font-extrabold text-stone-950">{studyMethodStyle}</span>
              </p>
            </div>

            <Button
              size="sm"
              variant="secondary"
              icon={Edit2}
              onClick={() => setAcademicModalOpen(true)}
              className="font-bold shadow-md shrink-0 bg-stone-950 text-amber-300 hover:bg-stone-900 border-none"
            >
              Change Target Hours & Roadmap
            </Button>
          </div>

          {/* KPI Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <GlassCard className="p-4 border-2 border-indigo-500/20 shadow-sm">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Total Planned</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {weeklyPlan?.total_weekly_hours || 0} <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">/ {weeklyTargetHours} hrs</span>
              </p>
            </GlassCard>

            <GlassCard className="p-4 border-2 border-emerald-500/20 shadow-sm">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Completed Sessions</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {weeklyPlan?.completed_sessions_count || 0} <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sessions</span>
              </p>
            </GlassCard>

            <GlassCard className="p-4 border-2 border-amber-500/20 shadow-sm">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Pending Blocks</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {weeklyPlan?.pending_sessions_count || 0} <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sessions</span>
              </p>
            </GlassCard>

            <GlassCard className="p-4 border-2 border-purple-500/20 shadow-sm">
              <span className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">Adherence Rate</span>
              <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {weeklyPlan?.completion_rate_percentage || 0}%
              </p>
            </GlassCard>
          </div>

          {/* 7-Day Tab Navigator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {DAYS.map((day) => {
              const count = weeklyPlan?.sessions_by_day?.[day]?.length || 0;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{day}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Hourly Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedDay} Hourly Schedule</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg">
                  {currentDaySessions.length} Study Blocks
                </span>
              </h3>
              <Button
                size="sm"
                variant="primary"
                icon={Plus}
                onClick={() => handleOpenAdd(selectedDay)}
                className="font-bold shadow-xs"
              >
                Add Block for {selectedDay}
              </Button>
            </div>

            {currentDaySessions.length === 0 ? (
              <GlassCard className="p-10 text-center space-y-3 border-2 border-dashed border-slate-300 dark:border-white/10">
                <CalendarIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">No study sessions scheduled for {selectedDay}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-medium">
                  Add a custom hourly study block or click Auto-Generate AI Plan to populate this day with smart revision slots.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  icon={Plus}
                  onClick={() => handleOpenAdd(selectedDay)}
                >
                  Add Session for {selectedDay}
                </Button>
              </GlassCard>
            ) : (
              <div className="space-y-3.5">
                {currentDaySessions.map((session) => {
                  const style = TYPE_STYLES[session.session_type] || TYPE_STYLES.Practice;
                  const TypeIcon = style.icon;

                  return (
                    <div
                      key={session.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md ${style.border} ${
                        session.is_completed ? 'opacity-80 bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      {/* Left: Complete Checkbox & Details */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <button
                          onClick={() => handleToggleCompleted(session.id)}
                          className="p-1 text-slate-400 hover:text-emerald-500 transition-colors shrink-0 mt-0.5 sm:mt-0 cursor-pointer"
                          title={session.is_completed ? 'Mark incomplete' : 'Mark completed'}
                        >
                          {session.is_completed ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-7 h-7 text-slate-400 dark:text-slate-500 hover:text-emerald-500" />
                          )}
                        </button>

                        <div className="min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`text-sm sm:text-base font-extrabold truncate ${
                                session.is_completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {session.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black bg-${style.badge}-500/15 text-${style.badge}-700 dark:text-${style.badge}-300 border border-${style.badge}-500/30`}>
                              <TypeIcon className="w-3 h-3" />
                              <span>{session.session_type}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-mono font-bold ${style.timeBg}`}>
                              <Clock className="w-3.5 h-3.5" />
                              {session.start_time} – {session.end_time} ({session.duration_minutes}m)
                            </span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                              📚 {session.subject_name}
                            </span>
                          </div>

                          {session.notes && (
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic pt-0.5">
                              💡 {session.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Direct Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(session)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                          title="Edit hourly session"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(session.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit / Add Session Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-xl"
        title={editingSessionId ? 'Edit Study Session' : 'Schedule New Study Session'}
      >
        <form onSubmit={handleSaveSession} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <Input
            id="title"
            label="Session Title / Goal"
            placeholder="e.g. Graph Traversal & Dijkstra Implementation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="subject"
              label="Subject / Topic Area"
              placeholder="e.g. Data Structures & Algorithms"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Day of Week
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-bold text-sm py-2 px-3 focus:outline-none focus:border-indigo-500"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              id="start-time"
              type="time"
              label="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <Input
              id="end-time"
              type="time"
              label="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Session Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-bold text-sm py-2 px-3 focus:outline-none focus:border-indigo-500"
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Focus Notes & Learning Objectives
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Solve 3 medium problems on tree traversals; take notes on recursion stack."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-medium text-xs p-3 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={modalLoading}
              className="font-extrabold shadow-md"
            >
              {editingSessionId ? 'Update Session Block' : 'Create Study Block'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Academic Goals & Target Hours Modal */}
      <Modal
        isOpen={academicModalOpen}
        onClose={() => setAcademicModalOpen(false)}
        maxWidth="max-w-xl"
        title="Edit Academic Goals & Target Hours"
      >
        <form onSubmit={handleSaveAcademicGoals} className="space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
            💡 Changing your weekly target hours automatically adjusts your recommended daily timetable slots and learning pacing.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Weekly Target Study Hours
              </label>
              <input
                type="number"
                min="5"
                max="60"
                step="1"
                value={weeklyTargetHours}
                onChange={(e) => setWeeklyTargetHours(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-bold text-sm py-2 px-3 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Study Hours Target
              </label>
              <input
                type="number"
                min="1"
                max="12"
                step="0.5"
                value={averageStudyHours}
                onChange={(e) => setAverageStudyHours(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-bold text-sm py-2 px-3 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Learning Pace
              </label>
              <select
                value={learningSpeed}
                onChange={(e) => setLearningSpeed(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-bold text-sm py-2 px-3 focus:outline-none focus:border-indigo-500"
              >
                <option value="Self-Paced">Self-Paced (Relaxed)</option>
                <option value="Balanced">Balanced (Standard)</option>
                <option value="Intensive">Intensive (Accelerated)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Recommended Study Style
              </label>
              <select
                value={studyMethodStyle}
                onChange={(e) => setStudyMethodStyle(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-bold text-sm py-2 px-3 focus:outline-none focus:border-indigo-500"
              >
                <option value="Video -> Practice -> Quiz -> Revision">Video → Practice → Quiz → Revision</option>
                <option value="Structured Reading -> Worked Examples -> Self-Quiz">Structured Reading → Worked Examples → Self-Quiz</option>
                <option value="Practice-First -> Diagnostic Gap Filling">Practice-First → Diagnostic Gap Filling</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setAcademicModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={academicSaving}
              className="font-extrabold shadow-md"
            >
              Save & Recalculate Roadmap
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudyPlanPage;
