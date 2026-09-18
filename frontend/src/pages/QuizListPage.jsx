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
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const QuizListPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzesAndHistory = async () => {
      try {
        setLoading(true);
        const [quizRes, histRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/quizzes/history/list')
        ]);
        setQuizzes(quizRes.data);
        setHistory(histRes.data);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzesAndHistory();
  }, []);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          Knowledge Diagnostic Quizzes <HelpCircle className="w-6 h-6 text-purple-500 dark:text-purple-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Complete timed module assessments. Your results dynamically recalibrate your recommendation engine.
        </p>
      </div>

      {/* Available Quizzes Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Available Diagnostic Quizzes</h2>
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
                      {quiz.total_questions} Questions
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                      {quiz.time_limit_minutes} min
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{quiz.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{quiz.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pass: <span className="text-indigo-600 dark:text-indigo-300 font-bold">{quiz.passing_score}%</span>
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Play}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    Start Quiz
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
            No quiz attempts recorded yet. Start a quiz above to calibrate your learning profile!
          </GlassCard>
        ) : (
          <div className="space-y-2.5">
            {history.map((att) => (
              <GlassCard key={att.id} className="p-4 flex items-center justify-between gap-4" hover>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{att.quiz_title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {att.correct_count} / {att.total_questions} Correct • {Math.round(att.time_spent_seconds / 60)}m spent • Completed on {new Date(att.completed_at).toLocaleDateString()}
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
