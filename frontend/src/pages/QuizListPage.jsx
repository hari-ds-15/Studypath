import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Clock,
  Award,
  Play,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  BookOpen,
  Zap,
  Code,
  Layers,
  Check
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SUPPORTED_LANGUAGES, DIFFICULTY_LEVELS } from '../services/dynamicQuizEngine';

const formatDateSafe = (dateString) => {
  if (!dateString) return 'Recent';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Recent';
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const QuizListPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Dynamic Generator State
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [customTopic, setCustomTopic] = useState('');

  const fetchQuizzesAndHistory = async () => {
    try {
      setLoading(true);
      const [quizRes, histRes, profileRes] = await Promise.allSettled([
        api.get('/quizzes'),
        api.get('/quizzes/history/list'),
        api.get('/student/profile')
      ]);

      if (quizRes.status === 'fulfilled') {
        setQuizzes(quizRes.value.data);
      }
      if (histRes.status === 'fulfilled') {
        setHistory(histRes.value.data);
      }
      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        const p = profileRes.value.data;
        if (p.selected_language && SUPPORTED_LANGUAGES.includes(p.selected_language)) {
          setSelectedLanguage(p.selected_language);
        }
        if (p.skill_level && DIFFICULTY_LEVELS.includes(p.skill_level)) {
          setSelectedLevel(p.skill_level);
        }
      }
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzesAndHistory();
  }, []);

  const handleLaunchDynamicQuiz = async () => {
    try {
      setGenerating(true);
      const res = await api.post('/quizzes/generate-dynamic', {
        language: selectedLanguage,
        level: selectedLevel,
        topic: customTopic.trim() || undefined,
        num_questions: 5
      });
      const generatedQuiz = res.data;
      navigate(`/quiz/${generatedQuiz.id}`);
    } catch (err) {
      console.error('Error generating dynamic quiz:', err);
      navigate(`/quiz/1`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          Knowledge Testing <Sparkles className="w-6 h-6 text-purple-500 dark:text-purple-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Dynamic AI-generated assessments tailored to your programming language and skill level. Your results dynamically recalibrate your recommendations and study schedule.
        </p>
      </div>

      {/* Dynamic Assessment Generator Banner */}
      <GlassCard className="p-6 space-y-4 border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/80 dark:border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Launch Custom AI Assessment
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200">
                  GEMINI ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Generates fresh, non-repeating questions specifically for your chosen language and difficulty level.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Language Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Programming Language / Track
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Difficulty Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DIFFICULTY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl} Level
                </option>
              ))}
            </select>
          </div>

          {/* Optional Topic Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Specific Topic (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Concurrency, Memory, Trees, Joins..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <Button
            size="md"
            variant="primary"
            icon={Sparkles}
            loading={generating}
            onClick={handleLaunchDynamicQuiz}
            className="font-bold shadow-md shadow-indigo-600/30"
          >
            {generating ? 'Generating Questions with Gemini...' : `Start Dynamic ${selectedLanguage} Test`}
          </Button>
        </div>
      </GlassCard>

      {/* Available Diagnostic Quizzes Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Recommended Testing Modules</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quizzes.map((quiz) => (
              <GlassCard key={quiz.id} className="p-5 flex flex-col justify-between space-y-4" hover>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple" size="sm">
                      {quiz.total_questions || 5} Questions
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                      {quiz.time_limit_minutes || 10} min
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{quiz.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{quiz.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Passing: <span className="text-indigo-600 dark:text-indigo-300 font-bold">{quiz.passing_score || 70}%</span>
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Play}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    Start Test
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Attempt History Section */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Recent Assessment Attempts</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({history.length} attempts logged)</span>
        </h2>

        {history.length === 0 ? (
          <GlassCard className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No quiz attempts recorded yet. Start a test above to calibrate your learning profile!
          </GlassCard>
        ) : (
          <div className="space-y-2.5">
            {history.map((att) => (
              <GlassCard key={att.id} className="p-4 flex items-center justify-between gap-4" hover>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{att.quiz_title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {att.correct_count} / {att.total_questions} Correct • {Math.round((att.time_spent_seconds || 180) / 60)}m spent • Completed on {formatDateSafe(att.completed_at || att.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-black ${
                      att.score_percentage >= 70 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                    }`}
                  >
                    {att.score_percentage}%
                  </span>
                  <Badge variant={att.score_percentage >= 70 ? 'emerald' : 'rose'} size="sm">
                    {att.score_percentage >= 70 ? 'Passed' : 'Needs Review'}
                  </Badge>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListPage;
