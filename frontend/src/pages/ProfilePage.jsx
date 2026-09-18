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
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';

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

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [branchMajor, setBranchMajor] = useState('');
  const [learningSpeed, setLearningSpeed] = useState('');
  const [preferredContentType, setPreferredContentType] = useState('');
  const [averageStudyHours, setAverageStudyHours] = useState(3.5);
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [careerInterests, setCareerInterests] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/profile');
        setProfile(res.data);
        setFullName(user?.full_name || '');
        setEducationLevel(res.data.education_level || 'Undergraduate');
        setBranchMajor(res.data.branch_major || 'Computer Science & Engineering');
        setLearningSpeed(res.data.learning_speed || 'Balanced');
        setPreferredContentType(res.data.preferred_content_type || 'Interactive & Practice');
        setAverageStudyHours(res.data.average_study_hours || 3.5);
        setStrongSubjects(res.data.strong_subjects || []);
        setWeakSubjects(res.data.weak_subjects || []);
        setCareerInterests(res.data.career_interests || []);
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

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
        learning_speed: learningSpeed,
        preferred_content_type: preferredContentType,
        average_study_hours: averageStudyHours,
        strong_subjects: strongSubjects,
        weak_subjects: weakSubjects,
        career_interests: careerInterests,
      });

      setProfile(res.data);
      updateUserProfile({ full_name: fullName.trim() });
      setSuccessMsg('Academic profile & recommendation vectors updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 animate-pulse">
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
          Manage your personal information, cognitive parameters, and academic subject alignments
        </p>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 font-medium shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5 font-medium shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Core Credentials & Major */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Personal & Academic Information
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
                  value={user?.email || ''}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-500 text-sm cursor-not-allowed"
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
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
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
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
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

        {/* Cognitive & Learning Parameters */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Cognitive & Recommendation Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Learning Speed
              </label>
              <select
                value={learningSpeed}
                onChange={(e) => setLearningSpeed(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
              >
                <option value="Slow & Thorough">Slow & Thorough</option>
                <option value="Balanced">Balanced</option>
                <option value="Fast Paced">Fast Paced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Content Format
              </label>
              <select
                value={preferredContentType}
                onChange={(e) => setPreferredContentType(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500"
              >
                <option value="Interactive & Practice">Interactive & Practice</option>
                <option value="Video Lectures">Video Lectures</option>
                <option value="Text & Documentation">Text & Documentation</option>
                <option value="Visual & Diagrams">Visual & Diagrams</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold uppercase text-slate-700 dark:text-slate-300">Daily Study Hours</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{averageStudyHours} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={averageStudyHours}
                onChange={(e) => setAverageStudyHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer mt-2"
              />
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
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
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
              <Zap className="w-4 h-4" /> Targeted Priority Subjects
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {SUBJECT_OPTIONS.map((s) => {
                const checked = weakSubjects.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArrayItem(weakSubjects, setWeakSubjects, s)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
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

        {/* Career Interests */}
        <GlassCard className="p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" /> Career Interests & Specialization Tracks
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CAREER_OPTIONS.map((career) => {
              const checked = careerInterests.includes(career);
              return (
                <button
                  key={career}
                  type="button"
                  onClick={() => toggleArrayItem(careerInterests, setCareerInterests, career)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    checked
                      ? 'bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 text-indigo-950 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{career}</span>
                  {checked && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Submit */}
        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
