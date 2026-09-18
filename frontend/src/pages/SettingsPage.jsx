import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Shield,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const SettingsPage = () => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Notification toggles
  const [studyReminders, setStudyReminders] = useState(true);
  const [quizAlerts, setQuizAlerts] = useState(true);
  const [recomUpdates, setRecomUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Reset modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleResetProfile = async () => {
    try {
      setResetLoading(true);
      await api.post('/student/reset-profile');
      setResetModalOpen(false);
      setToastMessage('Learning preferences reset! Launching onboarding wizard...');
      setTimeout(() => {
        navigate('/register');
      }, 1500);
    } catch (err) {
      console.error('Error resetting preferences:', err);
    } finally {
      setResetLoading(false);
    }
  };

  const handleSaveNotificationPrefs = () => {
    setToastMessage('Notification preferences updated!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          Settings & Preferences <SettingsIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure application theme, telemetry alerts, notification channels, and privacy
        </p>
      </div>

      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 font-medium shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Theme Settings */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          Theme & Display
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Dark Mode Interface</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Deep indigo glassmorphic contrast designed for extended study focus</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isDark ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </GlassCard>

      {/* Notification Preferences */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          Notification Preferences
        </h3>

        <div className="space-y-3 divide-y divide-slate-200 dark:divide-white/5">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Scheduled Study Reminders</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive alerts before your scheduled study session blocks</p>
            </div>
            <input
              type="checkbox"
              checked={studyReminders}
              onChange={(e) => {
                setStudyReminders(e.target.checked);
                handleSaveNotificationPrefs();
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Quiz Diagnostic Alerts</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Get notified when a new course evaluation quiz is unlocked</p>
            </div>
            <input
              type="checkbox"
              checked={quizAlerts}
              onChange={(e) => {
                setQuizAlerts(e.target.checked);
                handleSaveNotificationPrefs();
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Recommendation Recalculations</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Alerts when updated quiz scores generate higher match courses</p>
            </div>
            <input
              type="checkbox"
              checked={recomUpdates}
              onChange={(e) => {
                setRecomUpdates(e.target.checked);
                handleSaveNotificationPrefs();
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Weekly Performance Summary</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Sunday digest summarizing hours logged and learning efficiency</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => {
                setWeeklyDigest(e.target.checked);
                handleSaveNotificationPrefs();
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>
      </GlassCard>

      {/* Account & Profile Reset */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          Account Actions & Calibration
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20">
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Reset Learning Preferences</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Clear diagnostic weights and re-launch the 6-step onboarding wizard</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => setResetModalOpen(true)}
          >
            Reset Preferences
          </Button>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="danger"
            size="md"
            icon={LogOut}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign Out of Account
          </Button>
        </div>
      </GlassCard>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Learning Preferences?"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              This action will reset your strong/weak subject parameters and learning speed so you can re-calibrate your recommendation vectors.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
            <Button variant="secondary" size="md" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={resetLoading}
              icon={RotateCcw}
              onClick={handleResetProfile}
            >
              Confirm & Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
