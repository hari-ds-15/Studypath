import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Sparkles,
  HelpCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const QuizPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { question_id: selected_index }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
        setTimeLeftSeconds(res.data.time_limit_minutes * 60);
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (loading || isSubmitted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isSubmitted, timeLeftSeconds]);

  const handleSelectOption = (questionId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || isSubmitted || !quiz) return;

    try {
      setSubmitting(true);
      const answersPayload = quiz.questions.map((q) => ({
        question_id: q.id,
        selected_option_index: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
      }));

      const totalTimeSpent = quiz.time_limit_minutes * 60 - timeLeftSeconds;

      const res = await api.post(`/quizzes/${quiz.id}/submit`, {
        answers: answersPayload,
        time_spent_seconds: Math.max(10, totalTimeSpent),
      });

      setResult(res.data);
      setIsSubmitted(true);

      // Trigger Confetti if passed!
      if (res.data.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeftSeconds(quiz?.time_limit_minutes ? quiz.time_limit_minutes * 60 : 600);
  };

  if (loading || !quiz) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 animate-pulse">
        Preparing quiz questions...
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQ = questions[currentQuestionIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">Diagnostic Quiz</Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">{quiz.course_title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {quiz.title}
          </h1>
        </div>

        {/* Live Countdown Timer */}
        {!isSubmitted && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-lg">
            <Clock className={`w-5 h-5 ${timeLeftSeconds < 120 ? 'text-rose-500 animate-bounce' : 'text-indigo-500 dark:text-indigo-400'}`} />
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        )}
      </div>

      {/* RESULT VIEW AFTER SUBMISSION */}
      {isSubmitted && result ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Result Score Banner */}
          <GlassCard className="p-8 text-center relative overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-slate-900/90 dark:via-indigo-950/40 dark:to-slate-900/90 border border-indigo-200 dark:border-indigo-500/30">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
              <Award className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Quiz Evaluation Complete</h2>
            <div className="mt-2 text-4xl font-black text-emerald-500 dark:text-emerald-400">
              {result.score_percentage}%
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
              {result.feedback_message}
            </p>

            {/* Dynamic AI Profile Adaptation Alert */}
            <div className="mt-5 p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-900 dark:text-indigo-200 max-w-lg mx-auto flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>
                Learning efficiency updated to <span className="font-bold text-indigo-950 dark:text-white">{result.new_efficiency_score}%</span>. Recommendations recalculated!
              </span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="md"
                icon={RotateCcw}
                onClick={handleRetry}
              >
                Retry Assessment
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                onClick={() => navigate('/recommendations')}
              >
                View Updated Recommendations
              </Button>
            </div>
          </GlassCard>

          {/* Detailed Question Review Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Detailed Solutions & Explanations</h3>
            <div className="space-y-4">
              {result.review?.map((rev, idx) => (
                <GlassCard
                  key={rev.id}
                  className={`p-5 space-y-3 border ${
                    rev.is_correct ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Question {idx + 1} of {result.total_questions}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.question_text}</h4>
                    </div>
                    {rev.is_correct ? (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+20 pts)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  {/* Options Review */}
                  <div className="space-y-2 pt-2">
                    {rev.options?.map((opt, optIdx) => {
                      const isChosen = rev.selected_option_index === optIdx;
                      const isCorrectAnswer = rev.correct_option_index === optIdx;

                      let optStyle = 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-400';
                      if (isCorrectAnswer) {
                        optStyle = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-semibold';
                      } else if (isChosen && !isCorrectAnswer) {
                        optStyle = 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-200';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt}</span>
                          {isCorrectAnswer && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Correct Answer</span>
                          )}
                          {isChosen && !isCorrectAnswer && (
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Your Answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-300 block">💡 Detailed Explanation:</span>
                    <p>{rev.explanation}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        /* LIVE QUESTION VIEW */
        <div className="space-y-5">
          {/* Question Palette Progress */}
          <GlassCard className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {questions.map((q, qIdx) => {
                const isCurrent = currentQuestionIdx === qIdx;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(qIdx)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm'
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">
              Answered: <span className="text-indigo-600 dark:text-indigo-300">{answeredCount}</span> / {questions.length}
            </div>
          </GlassCard>

          {/* Current Question Card */}
          {currentQ && (
            <GlassCard className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
                  <Badge variant="slate" size="sm">{currentQ.subject_tag || 'Core'}</Badge>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question_text}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options?.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 text-indigo-950 dark:text-white shadow-md shadow-indigo-600/10'
                          : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:border-white/20 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <span>{option}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  disabled={currentQuestionIdx === 0}
                  icon={ArrowLeft}
                  onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>

                {currentQuestionIdx < questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    onClick={() =>
                      setCurrentQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))
                    }
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="md"
                    loading={submitting}
                    icon={CheckCircle2}
                    onClick={handleSubmitQuiz}
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPlayerPage;
