import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Play,
  Info,
  RefreshCw,
  Clock,
  Layers,
  Star,
  CheckCircle2,
  BookOpen,
  ArrowUpDown,
  Tag,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import FreeResourcesGrid, { YouTubeIcon } from '../components/common/FreeResourcesGrid';

const CATEGORIES = ['All', 'Core CS', 'AI & ML', 'Data Science', 'Web Development', 'Cloud & DevOps', 'Cybersecurity'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = [
  { label: 'All Durations', value: 'All' },
  { label: 'Short (< 4 weeks)', value: 'short' },
  { label: 'Medium (4-7 weeks)', value: 'medium' },
  { label: 'Long (8+ weeks)', value: 'long' }
];

const parseDurationWeeks = (durationStr) => {
  if (!durationStr) return 0;
  const match = durationStr.match(/(\d+)\s*week/i);
  if (match) return parseInt(match[1], 10);
  const hrsMatch = durationStr.match(/(\d+)\s*hr/i);
  if (hrsMatch) return Math.max(1, Math.round(parseInt(hrsMatch[1], 10) / 4));
  return 0;
};

const RecommendationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [recommendations, setRecommendations] = useState([]);
  const [isCalibrated, setIsCalibrated] = useState(Boolean(user?.onboarding_completed));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Detail Modal State
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const [recsRes, profileRes] = await Promise.allSettled([
        api.get('/recommendations/courses'),
        api.get('/student/profile')
      ]);

      if (recsRes.status === 'fulfilled') {
        setRecommendations(recsRes.value.data);
      }
      if (profileRes.status === 'fulfilled') {
        const p = profileRes.value.data;
        const hasCustomData = p?.onboarding_completed || (p?.strong_subjects && p.strong_subjects.length > 0 && p?.career_interests && p.career_interests.length > 0);
        setIsCalibrated(Boolean(hasCustomData));
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await api.post('/recommendations/refresh');
      await fetchRecommendations();
    } catch (err) {
      console.error('Error refreshing recommendations:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleSave = async (courseId, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/courses/${courseId}/save`);
      setRecommendations((prev) =>
        prev.map((c) => (c.course_id === courseId ? { ...c, is_saved: res.data.saved } : c))
      );
    } catch (err) {
      console.error('Error saving course:', err);
    }
  };

  const handleOpenDetail = async (courseId) => {
    try {
      setDetailLoading(true);
      setDetailModalOpen(true);
      const res = await api.get(`/courses/${courseId}`);
      setSelectedCourseDetail(res.data);
    } catch (err) {
      console.error('Error loading course details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedDuration('All');
    setSortBy('match');
    setShowSavedOnly(false);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedDuration !== 'All' ||
    showSavedOnly;

  const filteredCourses = recommendations
    .filter((course) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.course_name.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.difficulty.toLowerCase().includes(q) ||
        (course.tags && course.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      
      let matchesDuration = true;
      if (selectedDuration !== 'All') {
        const weeks = parseDurationWeeks(course.estimated_duration);
        if (selectedDuration === 'short') matchesDuration = weeks < 4;
        else if (selectedDuration === 'medium') matchesDuration = weeks >= 4 && weeks <= 7;
        else if (selectedDuration === 'long') matchesDuration = weeks >= 8;
      }

      const matchesSaved = !showSavedOnly || course.is_saved;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesSaved;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.match_score - a.match_score;
      if (sortBy === 'duration_asc') return parseDurationWeeks(a.estimated_duration) - parseDurationWeeks(b.estimated_duration);
      if (sortBy === 'duration_desc') return parseDurationWeeks(b.estimated_duration) - parseDurationWeeks(a.estimated_duration);
      if (sortBy === 'name') return a.course_name.localeCompare(b.course_name);
      return 0;
    });

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Course Recommendations <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Personalized using Content-Based TF-IDF, Collaborative SVD, and KNN profile similarity
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={RefreshCw}
          loading={refreshing}
          onClick={handleRefresh}
          className={refreshing ? 'animate-spin' : ''}
        >
          Refresh Recommendations
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-4 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic, keyword, or language (e.g. Python, SQL, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100/90 dark:bg-[#0a0f1d] border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-[#0d1428] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-xl bg-slate-100/90 dark:bg-[#0a0f1d] border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#0d1428] font-bold transition-all cursor-pointer"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'Level: All Levels' : `Level: ${d}`}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Filter Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full rounded-xl bg-slate-100/90 dark:bg-[#0a0f1d] border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#0d1428] font-bold transition-all cursor-pointer"
            >
              {DURATIONS.map((dur) => (
                <option key={dur.value} value={dur.value}>
                  {dur.value === 'All' ? 'Duration: All' : dur.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl bg-slate-100/90 dark:bg-[#0a0f1d] border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#0d1428] font-bold transition-all cursor-pointer"
            >
              <option value="match">Sort: Highest Match %</option>
              <option value="duration_asc">Sort: Duration (Short to Long)</option>
              <option value="duration_desc">Sort: Duration (Long to Short)</option>
              <option value="name">Sort: Course Title (A-Z)</option>
            </select>
          </div>

          {/* Saved Filter Button */}
          <div className="lg:col-span-2">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                showSavedOnly
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-[#162038] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{showSavedOnly ? 'Saved Only (Active)' : 'Saved Only'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills & Active Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-100 dark:bg-[#162038] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1f2d4e] border border-slate-200 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-auto"
            >
              Clear All Filters ({filteredCourses.length} results)
            </button>
          )}
        </div>
      </GlassCard>

      {/* Calibration Banner for New / Uncalibrated Users */}
      {!isCalibrated && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-stone-950">
                Welcome to StudyPath! Standard Core Courses Active
              </h4>
              <p className="text-xs text-stone-700 font-semibold">
                Complete your profile diagnostic in Profile or Study Method to activate personalized AI Match percentages.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/profile')}
            className="font-bold shrink-0 bg-stone-950 text-amber-300 hover:bg-stone-900 border-none shadow-sm"
          >
            Update Profile for Match %
          </Button>
        </div>
      )}

      {/* Course Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-900/60 border border-slate-300 dark:border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            No courses match your active filter criteria
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
            Active filters: {selectedDifficulty !== 'All' ? `[Level: ${selectedDifficulty}] ` : ''}
            {selectedDuration !== 'All' ? `[Duration: ${selectedDuration}] ` : ''}
            {selectedCategory !== 'All' ? `[Category: ${selectedCategory}] ` : ''}
            {searchQuery ? `[Search: "${searchQuery}"] ` : ''}
          </p>
          <Button
            size="md"
            variant="primary"
            onClick={handleResetFilters}
          >
            Reset Filters & View All ({recommendations.length}) Courses
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <GlassCard
              key={course.course_id}
              className="flex flex-col justify-between overflow-hidden group"
              hover
            >
              {/* Image & Header */}
              <div className="relative h-40 w-full overflow-hidden bg-amber-100">
                <img
                  src={course.image_url}
                  alt={course.course_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />

                {/* Match Score Badge / Core Subject Badge */}
                <div className="absolute top-3 left-3">
                  {isCalibrated ? (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-stone-950 font-black text-xs shadow-md flex items-center gap-1 border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      {course.match_score}% Match
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-stone-900 font-bold text-xs shadow-md flex items-center gap-1 border border-amber-300 backdrop-blur-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Core Subject
                    </span>
                  )}
                </div>

                {/* Save Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(course.course_id, e)}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                    course.is_saved
                      ? 'bg-amber-500 text-stone-950 shadow-lg font-bold'
                      : 'bg-stone-900/60 text-amber-200 hover:text-white hover:bg-stone-900'
                  }`}
                  title={course.is_saved ? 'Remove Bookmark' : 'Save Course'}
                >
                  {course.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>

                {/* Category & Difficulty Tag */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Badge variant="indigo" size="sm">
                    {course.category}
                  </Badge>
                  <Badge variant="slate" size="sm">
                    {course.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {course.course_name}
                  </h3>

                  {/* Recommendation Reason Box */}
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-500/20 text-[11px] text-indigo-700 dark:text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{course.explanation}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>

                  {/* Free Resources Quick Preview Pills */}
                  {course.free_resources?.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <YouTubeIcon className="w-3 h-3 text-red-500" /> Free Links:
                      </span>
                      {course.free_resources.slice(0, 2).map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all hover:scale-105 cursor-pointer ${
                            res.type === 'youtube'
                              ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-900/40'
                              : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                          }`}
                          title={`Direct open: ${res.title}`}
                        >
                          <span className="truncate max-w-[120px]">{res.author || res.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                      {course.free_resources.length > 2 && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          +{course.free_resources.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta details */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.estimated_duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {course.learning_format}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Info}
                      onClick={() => handleOpenDetail(course.course_id)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Play}
                      onClick={() => navigate(`/learning/${course.course_id}`)}
                    >
                      Start Learning
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="max-w-3xl"
        title={selectedCourseDetail?.title || 'Course Details'}
      >
        {detailLoading || !selectedCourseDetail ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
            Loading course curriculum...
          </div>
        ) : (
          <div className="space-y-5">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="indigo">{selectedCourseDetail.category}</Badge>
              <Badge variant="purple">{selectedCourseDetail.difficulty}</Badge>
              <Badge variant="slate">{selectedCourseDetail.estimated_duration}</Badge>
              <Badge variant="emerald">{selectedCourseDetail.learning_format}</Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedCourseDetail.description}
            </p>

            {/* Curated Free Video Channels & Web Resources */}
            {selectedCourseDetail.free_resources?.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <FreeResourcesGrid
                  resources={selectedCourseDetail.free_resources}
                  title="Curated Free YouTube Channels & Web Links"
                  description="Directly open official documentation, playlists, and interactive practice platforms in a new tab."
                />
              </div>
            )}

            {/* Prerequisites */}
            {selectedCourseDetail.prerequisites?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Prerequisites</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCourseDetail.prerequisites.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Syllabus Modules */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Curriculum Syllabus</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedCourseDetail.syllabus?.map((mod) => (
                  <div key={mod.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-1.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{mod.title}</p>
                    <div className="space-y-1 pl-2">
                      {mod.lessons?.map((les) => (
                        <div key={les.id} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                          <span>• {les.title}</span>
                          <span className="text-[10px] text-slate-400">{les.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setDetailModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Play}
                onClick={() => {
                  setDetailModalOpen(false);
                  navigate(`/learning/${selectedCourseDetail.id}`);
                }}
              >
                Launch Course Learning
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecommendationsPage;
