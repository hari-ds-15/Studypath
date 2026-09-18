import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Sparkles,
  BookOpen,
  Check,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = ({ isCollapsed, onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recommendations?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 z-20 transition-all duration-200
        bg-[#FAF8F5]/90 dark:bg-[#141210]/90 backdrop-blur-xl 
        border-b border-stone-200/90 dark:border-stone-800/80 shadow-xs dark:shadow-none
        flex items-center justify-between px-4 sm:px-6
        ${isCollapsed ? 'md:left-[72px]' : 'md:left-[250px]'} left-0
      `}
    >
      {/* Left: Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search courses, skills, electives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2 rounded-xl bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-[#24201C] focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-500 dark:text-stone-400 font-mono border border-stone-200 dark:border-stone-700 pointer-events-none">
            <span>↵</span>
          </div>
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-[#1C1917] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-800 cursor-pointer shadow-xs"
          title={isDark ? "Switch to Normal/Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-[#1C1917] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-800 cursor-pointer shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#141210]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 shadow-2xl backdrop-blur-2xl py-3 z-50">
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-stone-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-500 dark:text-stone-400">
                    No notifications yet. You're all caught up!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 transition-colors flex items-start justify-between gap-3 ${
                        !n.is_read ? 'bg-amber-50/60 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0" onClick={() => markAsRead(n.id)}>
                        <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">{n.title}</p>
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-stone-400 dark:text-stone-500 mt-1 block">
                          {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="text-stone-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 px-4 border-t border-stone-100 dark:border-stone-800 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  View all notifications <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors border border-stone-200 dark:border-stone-800 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-stone-950 flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
            </div>
            <span className="hidden lg:block text-xs font-semibold text-stone-800 dark:text-stone-200 max-w-[90px] truncate">
              {user?.full_name || 'Student'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                <p className="text-xs font-bold text-stone-900 dark:text-white truncate">{user?.full_name}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50/60 dark:hover:bg-amber-500/10 transition-colors"
                >
                  <User className="w-4 h-4 text-amber-500" /> Academic Profile
                </Link>
                <Link
                  to="/study-method"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50/60 dark:hover:bg-amber-500/10 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" /> Study Method Engine
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50/60 dark:hover:bg-amber-500/10 transition-colors"
                >
                  <Settings className="w-4 h-4 text-stone-500" /> Settings & Preferences
                </Link>
              </div>

              <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
