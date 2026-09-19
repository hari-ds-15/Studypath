import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Clock,
  Zap,
  CheckCircle2,
  Save,
  Briefcase,
  AlertCircle,
  Code,
  Compass,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { SUPPORTED_LANGUAGES, DIFFICULTY_LEVELS } from '../services/dynamicQuizEngine';

const SUBJECT_OPTIONS = [
  'Python Programming',
  'Java Programming',
  'C / C++ Systems',
  'Rust & Go Engineering',
  'JavaScript & TypeScript',
  'Data Structures & Algorithms',
  'Database Systems & SQL',
  'Machine Learning Fundamentals',
  'Full Stack Web Development',
  'Cloud Computing & DevOps',
  'Cybersecurity & Network Defense',
];

const CAREER_STREAM_OPTIONS = [
  'AI Engineer',
  'Data Science',
  'Full Stack Developer',
  'Backend Systems (Java/C++/Go/Rust)',
  'Cloud & DevOps',
  'Cybersecurity'
];

const DURATION_OPTIONS = [
  'Short (< 4 weeks)',
  'Medium (4-7 weeks)',
  'Long (8+ weeks)'
];

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [branchMajor, setBranchMajor] = useState('Computer Science & Engineering');
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [careerStream, setCareerStream] = useState('AI Engineer');
  const [preferredDuration, setPreferredDuration] = useState('Medium (4-7 weeks)');
  const [learningSpeed, setLearningSpeed] = useState('Balanced');
  const [preferredContentType, setPreferredContentType] = useState('Interactive & Practice');
  const [averageStudyHours, setAverageStudyHours] = useState(3.0);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(21.0);
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [careerInterests, setCareerInterests] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/profile');
        const p = res.data;
        setProfile(p);
        setFullName(user?.full_name || p.full_name || '');
        setEducationLevel(p.education_level || 'Undergraduate');
        setBranchMajor(p.branch_major || 'Computer Science & Engineering');
        setSelectedLanguage(p.selected_language || 'Python');
        setSkillLevel(p.skill_level || 'Beginner');
        setCareerStream(p.career_stream || 'AI Engineer');
        setPreferredDuration(p.preferred_duration || 'Medium (4-7 weeks)');
        setLearningSpeed(p.learning_speed || 'Balanced');
        setPreferredContentType(p.preferred_content_type || 'Interactive & Practice');
        
        const daily = p.daily_study_hours || p.average_study_hours || 3.0;
        setAverageStudyHours(daily);
        setWeeklyTargetHours(p.weekly_target_hours || Math.round(daily * 7 * 10) / 10);
        
        setStrongSubjects(p.strong_subjects || []);
        setWeakSubjects(p.weak_subjects || []);
        setCareerInterests(p.career_interests || [p.career_stream || 'AI Engineer']);
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleDailyHoursChange = (val) => {
    const daily = parseFloat(val) || 0;
    setAverageStudyHours(daily);
    setWeeklyTargetHours(Math.round(daily * 7 * 10) / 10);
  };

  const handleWeeklyHoursChange = (val) => {
    const weekly = parseFloat(val) || 0;
    setWeeklyTargetHours(weekly);
    setAverageStudyHours(Math.round((weekly / 7) * 10) / 10);
  };

  const toggleArrayItem = (list, setList, item) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setSaving(true);
      const res = await api.put('/student/profile', {
        full_name: fullName.trim(),
        education_level: educationLevel,
        branch_major: branchMajor,
        selected_language: selectedLanguage,
        skill_level: skillLevel,
        career_stream: careerStream,
        preferred_duration: preferredDuration,
        learning_speed: learningSpeed,
        preferred_content_type: preferredContentType,
        daily_study_hours: averageStudyHours,
        average_study_hours: averageStudyHours,
        weekly_target_hours: weeklyTargetHours,
        strong_subjects: strongSubjects,
        weak_subjects: weakSubjects,
        career_interests: careerInterests,
      });

      setProfile(res.data);
      if (fullName.trim()) {
        updateUserProfile({ full_name: fullName.trim() });
      }
      setSuccessMsg('Academic profile, recommendation engine, and study plan updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 animate-pulse font-medium">
        Loading student profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          Student Academic Profile <User className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your programming language track, skill level, career stream, and weekly study schedule parameters.
        </p>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 font-bold shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5 font-bold shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Core Credentials & Major */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" /> Personal & Academic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="full-name"
              label="Full Name"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Registered Email (Read Only)
              </label>
              <div className="relative rounded-xl">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  disabled
                  value={user?.email || 'student@studypath.edu'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-500 text-sm cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="High School">High School</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Branch / Major
              </label>
              <select
                value={branchMajor}
                onChange={(e) => setBranchMajor(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Technical Specialization & Language Selection */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-500" /> Technical Language & Career Alignment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Programming Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 font-bold"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Current Skill Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 font-bold"
              >
                {DIFFICULTY_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Career Specialization Stream
              </label>
              <select
                value={careerStream}
                onChange={(e) => setCareerStream(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 font-bold"
              >
                {CAREER_STREAM_OPTIONS.map((stream) => (
                  <option key={stream} value={stream}>
                    {stream}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Course Duration
              </label>
              <select
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {DURATION_OPTIONS.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Learning Speed & Pace
              </label>
              <select
                value={learningSpeed}
                onChange={(e) => setLearningSpeed(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Slow & Thorough">Slow & Thorough</option>
                <option value="Balanced">Balanced</option>
                <option value="Fast Paced">Fast Paced</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Study Hours Synchronization */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Study Hours & Time Commitment (Mathematically Linked)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold uppercase text-slate-700 dark:text-slate-300">Daily Study Target</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">{averageStudyHours} hrs / day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={averageStudyHours}
                onChange={(e) => handleDailyHoursChange(e.target.value)}
                className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer mt-2"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Auto-calculates weekly target: {Math.round(averageStudyHours * 7 * 10) / 10} hrs</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold uppercase text-slate-700 dark:text-slate-300">Weekly Target Commitment</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">{weeklyTargetHours} hrs / week</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="70"
                step="0.5"
                value={weeklyTargetHours}
                onChange={(e) => handleWeeklyHoursChange(e.target.value)}
                className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer mt-2"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Daily average: {Math.round((weeklyTargetHours / 7) * 10) / 10} hrs / day</p>
            </div>
          </div>
        </GlassCard>

        {/* Subject Strength / Weakness Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Strong */}
          <GlassCard className="p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strong Subjects
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {SUBJECT_OPTIONS.map((s) => {
                const checked = strongSubjects.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArrayItem(strongSubjects, setStrongSubjects, s)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      checked
                        ? 'bg-emerald-50 dark:bg-emerald-600/20 border-emerald-500 text-emerald-950 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{s}</span>
                    {checked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Weak */}
          <GlassCard className="p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Targeted Priority / Growth Subjects
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {SUBJECT_OPTIONS.map((s) => {
                const checked = weakSubjects.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArrayItem(weakSubjects, setWeakSubjects, s)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      checked
                        ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-purple-950 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{s}</span>
                    {checked && <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
            className="shadow-md shadow-indigo-600/30 font-bold"
          >
            Save Profile & Sync All Recommendations
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
