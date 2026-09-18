import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Bookmark,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { YouTubeIcon } from '../components/common/FreeResourcesGrid';

const MyLearningPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled'); // enrolled, saved

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allCoursesRes, savedRes] = await Promise.all([
          api.get('/courses'),
          api.get('/courses/saved/list')
        ]);
        const enrolled = allCoursesRes.data.filter((c) => c.is_enrolled || c.progress > 0);
        setCourses(enrolled.length > 0 ? enrolled : allCoursesRes.data.slice(0, 3));
        setSavedCourses(savedRes.data);
      } catch (err) {
        console.error('Failed to load my learning:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            My Learning Pathways <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Track your ongoing courses, bookmarks, and skill mastery milestones
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#11192e] border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'enrolled'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Enrolled Tracks ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Bookmarks ({savedCourses.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'enrolled' ? (
        courses.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No active enrollments yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Explore your personalized recommendations and start your first learning track.
            </p>
            <Button
              size="sm"
              variant="primary"
              icon={Sparkles}
              onClick={() => navigate('/recommendations')}
            >
              Browse Recommended Courses
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <GlassCard key={course.id} className="p-5 flex flex-col justify-between space-y-4" hover>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo" size="sm">{course.category}</Badge>
                    <Badge variant="slate" size="sm">{course.difficulty}</Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>

                  {/* Free Resources Quick Preview */}
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
                          <span className="truncate max-w-[110px]">{res.author || res.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                      <span className="text-indigo-600 dark:text-indigo-300 font-bold">{course.progress || 35}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                        style={{ width: `${course.progress || 35}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full"
                    icon={Play}
                    onClick={() => navigate(`/learning/${course.id}`)}
                  >
                    Resume Learning
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )
      ) : savedCourses.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No saved courses</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You haven't bookmarked any courses yet. Bookmark courses from the recommendations page to access them quickly.
          </p>
          <Button
            size="sm"
            variant="primary"
            icon={Sparkles}
            onClick={() => navigate('/recommendations')}
          >
            Explore Recommendations
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCourses.map((course) => (
            <GlassCard key={course.id} className="p-5 flex flex-col justify-between space-y-4" hover>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo" size="sm">{course.category}</Badge>
                  <Badge variant="slate" size="sm">{course.difficulty}</Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>

                {/* Free Resources Quick Preview */}
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
                        <span className="truncate max-w-[110px]">{res.author || res.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{course.estimated_duration}</span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={Play}
                  onClick={() => navigate(`/learning/${course.id}`)}
                >
                  Start Course
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearningPage;
