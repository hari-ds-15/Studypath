import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  BookOpen,
  FileText,
  Clock,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  Code,
  Video,
  Globe,
  Maximize2
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import FreeResourcesGrid, { YouTubeIcon } from '../components/common/FreeResourcesGrid';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import InAppVideoModal from '../components/common/InAppVideoModal';

const CourseLearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('resources'); // overview, resources, code, transcript
  const [completedLessons, setCompletedLessons] = useState({});
  const [progress, setProgress] = useState(0);
  const [quizzes, setQuizzes] = useState([]);

  // Active Video State for real embedded player
  const [activeVideo, setActiveVideo] = useState(null);
  const [theaterModalVideo, setTheaterModalVideo] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseRes, quizzesRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/quizzes')
        ]);
        const courseData = courseRes.data;
        setCourse(courseData);
        setProgress(courseData.progress || 0);

        // Filter quizzes related to this course
        const matchedQuizzes = quizzesRes.data.filter((q) => q.course_id === parseInt(id));
        setQuizzes(matchedQuizzes.length > 0 ? matchedQuizzes : quizzesRes.data.slice(0, 1));

        // Set default active video from course free resources or curated video
        const firstVideoResource = courseData.free_resources?.find(
          (r) => r.type === 'youtube' || r.type === 'course' || (r.url && r.url.includes('youtube.com'))
        );
        if (firstVideoResource) {
          setActiveVideo({
            title: firstVideoResource.title,
            url: firstVideoResource.url,
            author: firstVideoResource.author || firstVideoResource.provider || 'Featured Instructor',
            description: firstVideoResource.description
          });
        } else {
          setActiveVideo({
            title: `${courseData.title} - Foundation Lecture`,
            url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            author: 'StudyPath Verified',
            description: courseData.description
          });
        }

        // Auto enroll if not already
        if (!courseData.is_enrolled) {
          await api.post(`/courses/${id}/enroll`);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleLessonToggle = async (modIdx, lesIdx) => {
    const key = `${modIdx}-${lesIdx}`;
    const newCompleted = { ...completedLessons, [key]: !completedLessons[key] };
    setCompletedLessons(newCompleted);

    // Calculate updated progress
    let totalLessons = 0;
    course?.syllabus?.forEach((m) => {
      totalLessons += m.lessons?.length || 1;
    });
    const completedCount = Object.values(newCompleted).filter(Boolean).length;
    const newProg = Math.min(100, Math.round((completedCount / Math.max(1, totalLessons)) * 100));
    setProgress(newProg);

    try {
      await api.put(`/courses/${id}/progress`, {
        progress: newProg,
        current_module_index: modIdx,
        current_lesson_index: lesIdx,
        completed: newProg >= 100
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleSelectVideoResource = (resource) => {
    setActiveVideo({
      title: resource.title,
      url: resource.url,
      author: resource.author || resource.provider || 'Instructor',
      description: resource.description
    });
    // Scroll smoothly to the player
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/recommendations')}>
          Back to Recommendations
        </Button>
      </div>
    );
  }

  const currentModule = course.syllabus?.[activeModuleIndex] || {
    title: 'Module 1: Core Fundamentals',
    lessons: [{ title: 'Lecture 1.1: Foundations', duration: '25 min' }]
  };
  const currentLesson = currentModule.lessons?.[activeLessonIndex] || {
    title: currentModule.title || 'Course Lecture',
    duration: '25 min',
    content: course.description
  };
  const currentQuiz = quizzes[0];

  const embedUrl = getYouTubeEmbedUrl(activeVideo?.url || 'https://www.youtube.com/watch?v=rfscVS0vtbw', activeVideo?.title || course.title);

  return (
    <div className="space-y-6 pb-12">
      {/* Course Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/recommendations')}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">{course.category}</Badge>
              <Badge variant="slate" size="sm">{course.difficulty}</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Course Progress Bar */}
        <div className="w-full sm:w-64 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Course Mastery</span>
            <span className="text-indigo-600 dark:text-indigo-300 font-bold">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: REAL Embedded YouTube Player */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="overflow-hidden">
            
            {/* Player Top Status Bar */}
            <div className="p-3 bg-amber-100/70 border-b border-amber-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px]">
                  <Play className="w-3 h-3 fill-current" />
                  Streaming in App
                </span>
                <span className="font-bold text-stone-900 truncate">
                  {activeVideo?.title || currentLesson.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setTheaterModalVideo(activeVideo)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-50 text-stone-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Theater Modal</span>
                </button>
              </div>
            </div>

            {/* Real Working YouTube Iframe Player */}
            <div className="relative aspect-video w-full bg-stone-950">
              <iframe
                src={embedUrl}
                title={activeVideo?.title || currentLesson.title || 'Course Lecture Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Lesson Navigation & Completion Bar */}
            <div className="p-4 bg-amber-50/50 flex items-center justify-between gap-3 border-t border-amber-200/50">
              <button
                onClick={() => handleLessonToggle(activeModuleIndex, activeLessonIndex)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  completedLessons[`${activeModuleIndex}-${activeLessonIndex}`]
                    ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/40 font-bold'
                    : 'bg-white text-stone-800 border-stone-300 hover:text-amber-800 shadow-sm'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${completedLessons[`${activeModuleIndex}-${activeLessonIndex}`] ? 'text-emerald-600 fill-emerald-100' : 'text-stone-400'}`} />
                <span>
                  {completedLessons[`${activeModuleIndex}-${activeLessonIndex}`]
                    ? 'Lesson Completed'
                    : 'Mark as Completed'}
                </span>
              </button>

              {/* Direct Quiz Trigger */}
              {currentQuiz && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={HelpCircle}
                  onClick={() => navigate(`/quiz/${currentQuiz.id}`)}
                >
                  Take Module Quiz
                </Button>
              )}
            </div>
          </GlassCard>

          {/* Interactive Lesson Tabs */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
              {[
                { id: 'resources', label: 'Free Channels & Websites', icon: YouTubeIcon },
                { id: 'overview', label: 'Lesson Notes', icon: FileText },
                { id: 'code', label: 'Interactive Sandbox', icon: Code },
                { id: 'transcript', label: 'Summary & Key Concepts', icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.id === 'resources' && course.free_resources?.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/20 dark:bg-white/10 text-white font-bold ml-0.5">
                        {course.free_resources.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-yellow-500/10 border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-red-600 text-white shadow-md">
                        <YouTubeIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-950 text-xs">
                          Verified Course Video Playlists & Resources
                        </p>
                        <p className="text-[11px] text-stone-600 font-medium">
                          Click "Watch in StudyPath" on any video to stream it directly in the player above.
                        </p>
                      </div>
                    </div>
                  </div>

                  <FreeResourcesGrid
                    resources={course.free_resources || []}
                    title="Course Video Playlists & Web Portals"
                    description={`Direct links to verified external material for ${course.title}`}
                    onPlayVideo={handleSelectVideoResource}
                  />
                </div>
              )}

              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{currentLesson.title}</h4>
                  <p>{currentLesson.content || course.description}</p>
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-stone-900">
                    <span className="font-bold text-stone-950 block mb-1">💡 Study Recommendation Tip:</span>
                    For maximum retention, stream the curated video lectures in the "Free Channels & Websites" tab and test yourself on the Module Quiz.
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-stone-950 font-mono text-xs text-emerald-400 border border-stone-800 overflow-x-auto">
                    <p className="text-stone-500"># StudyPath Sandbox - {currentLesson.title}</p>
                    <p>def solve_problem(dataset):</p>
                    <p className="pl-4"># Apply algorithmic pattern learned in video</p>
                    <p className="pl-4">result = [x * 2 for x in dataset if x &gt; 0]</p>
                    <p className="pl-4">return result</p>
                    <p className="text-amber-400 mt-2">print(solve_problem([1, -2, 3, 4])) # Output: [2, 6, 8]</p>
                  </div>
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900 dark:text-white">Core Learning Objectives:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                    <li>Mastering fundamental data invariants and complexity bounds.</li>
                    <li>Understanding edge cases and memory layout trade-offs.</li>
                    <li>Applying structured testing and debugging methodologies.</li>
                  </ul>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Course Syllabus Tree & Quiz Shortcut */}
        <div className="space-y-4">
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Curriculum Outline</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {course.syllabus?.length || 0} Modules
              </span>
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {course.syllabus?.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  className={`p-3 rounded-2xl border transition-all ${
                    activeModuleIndex === mIdx
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-500/40'
                      : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {mod.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {mod.lessons?.length || 1} lessons
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                    {mod.lessons?.map((lesson, lIdx) => {
                      const isSelected = activeModuleIndex === mIdx && activeLessonIndex === lIdx;
                      const isDone = completedLessons[`${mIdx}-${lIdx}`];

                      return (
                        <button
                          key={lIdx}
                          onClick={() => {
                            setActiveModuleIndex(mIdx);
                            setActiveLessonIndex(lIdx);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isDone ? (
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'} shrink-0`} />
                            ) : (
                              <Play className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'} shrink-0`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quiz Launch Card */}
            {currentQuiz && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/80 dark:to-purple-950/80 border border-indigo-200 dark:border-indigo-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  <HelpCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>Module Diagnostic Quiz</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Passing this quiz updates your adaptive learning profile and refreshes future course recommendations.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  icon={Play}
                  onClick={() => navigate(`/quiz/${currentQuiz.id}`)}
                >
                  Start Timed Quiz ({currentQuiz.time_limit_minutes}m)
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Theater In-App Video Modal */}
      <InAppVideoModal
        isOpen={Boolean(theaterModalVideo)}
        onClose={() => setTheaterModalVideo(null)}
        video={theaterModalVideo}
      />
    </div>
  );
};

export default CourseLearningPage;
