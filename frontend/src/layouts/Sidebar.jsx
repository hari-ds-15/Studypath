import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  Layers,
  HelpCircle,
  BarChart3,
  User,
  Settings,
  BookOpen,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Study Tutor', to: '/ai-tutor', icon: Sparkles, badge: 'GEMINI' },
  { name: 'My Learning', to: '/my-learning', icon: BookOpen },
  { name: 'Course Recommendations', to: '/recommendations', icon: Compass, badge: 'AI' },
  { name: 'Study Plan', to: '/study-plan', icon: Calendar },
  { name: 'Electives', to: '/electives', icon: Layers },
  { name: 'Quizzes', to: '/quizzes', icon: HelpCircle },
  { name: 'Analytics', to: '/analytics', icon: BarChart3 },
  { name: 'Profile', to: '/profile', icon: User },
  { name: 'Settings', to: '/settings', icon: Settings },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#FAF8F5] dark:bg-[#141210] border-r border-stone-200/90 dark:border-stone-800/80 text-stone-700 dark:text-stone-300 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200/90 dark:border-stone-800/80">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 shrink-0 border border-amber-300/40 font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-1.5">
                StudyPath <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[9px] font-bold border border-amber-200/80 dark:border-amber-500/30">PRO</span>
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Recommendation Engine</span>
            </motion.div>
          )}
        </NavLink>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/80 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 group relative
                ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/80'
                }
              `}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {(!isCollapsed || isMobileOpen) && (
                <span className="truncate flex-1">{item.name}</span>
              )}
              {item.badge && (!isCollapsed || isMobileOpen) && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-stone-200/90 dark:border-stone-800/80">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-[#1C1917] border border-stone-200/90 dark:border-stone-800/80 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{user?.full_name || 'Student'}</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">{user?.email || 'student@studypath.edu'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 250 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:block fixed top-0 left-0 bottom-0 z-30 shrink-0"
      >
        {navContent}
      </motion.aside>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-72 h-full z-10"
          >
            {navContent}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
