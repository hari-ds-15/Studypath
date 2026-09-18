import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Zap,
  BookOpen,
  Code,
  Calendar,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ChatMessageContent from '../components/common/ChatMessageContent';

const DEFAULT_STARTERS = [
  {
    id: 'sug-1',
    category: 'DSA & Coding',
    title: 'QuickSort vs MergeSort in Python',
    prompt: 'Explain QuickSort vs MergeSort with Python code and time complexity'
  },
  {
    id: 'sug-2',
    category: 'Databases & SQL',
    title: 'ACID Properties & SQL Aggregation',
    prompt: 'Explain ACID properties with real-world examples and SQL query'
  },
  {
    id: 'sug-3',
    category: 'Machine Learning',
    title: 'Bias-Variance Tradeoff Intuitively',
    prompt: 'Explain the Bias-Variance tradeoff and how to fix overfitting'
  },
  {
    id: 'sug-4',
    category: 'Study Routine',
    title: '45-Min Active Recall Protocol',
    prompt: 'Create a 45-minute Pomodoro study block for high retention'
  }
];

const AiTutorPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_STARTERS);
  const [previousInteractionId, setPreviousInteractionId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message and prompt suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/chat/suggestions');
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Flatten if suggestions are grouped by category
          const normalized = [];
          res.data.forEach((item, catIdx) => {
            if (item.prompts && Array.isArray(item.prompts)) {
              item.prompts.forEach((p, pIdx) => {
                normalized.push({
                  id: `sug-${catIdx}-${pIdx}`,
                  category: item.category || 'Study Query',
                  title: typeof p === 'string' ? p.split('with')[0].trim() : 'Study Practice',
                  prompt: typeof p === 'string' ? p : String(p)
                });
              });
            } else if (item.prompt || item.title) {
              normalized.push({
                id: item.id || `sug-${catIdx}`,
                category: item.category || 'AI Topic',
                title: item.title || item.prompt,
                prompt: item.prompt || item.title
              });
            }
          });
          if (normalized.length > 0) {
            setSuggestions(normalized);
          }
        }
      } catch (err) {
        console.warn('Using default starter suggestions:', err);
      }
    };

    fetchSuggestions();

    // Set greeting
    const firstName = user?.full_name?.split(' ')[0] || (user?.email ? user.email.split('@')[0] : 'Student');
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `👋 Hello **${firstName}**! I am your **StudyPath AI Tutor & Academic Mentor**, powered by **Google Gemini AI**.\n\nI can help you:\n* 🧠 **Master algorithms & data structures** (QuickSort, Binary Search, Trees, Graphs)\n* 💻 **Write & debug clean code** in Python, SQL, JavaScript, or C++\n* 📅 **Build customized spaced-repetition study timetables** for exams\n* 📝 **Generate interactive diagnostic quiz questions**\n\nWhat subject or topic would you like to master today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: [
          'Explain QuickSort vs MergeSort with Python code',
          'How do database indexes speed up SQL queries?',
          'Create a 45-minute study plan for machine learning'
        ]
      }
    ]);
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend = inputMessage) => {
    let rawText = '';
    if (typeof textToSend === 'string') {
      rawText = textToSend;
    } else if (textToSend && typeof textToSend === 'object') {
      rawText = textToSend.prompt || textToSend.title || '';
    } else {
      rawText = inputMessage || '';
    }

    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        message: trimmed,
        previous_interaction_id: previousInteractionId
      });

      const responseText = res.data?.response || res.data?.reply || res.data?.message || 'I processed your request. How else can I help?';
      let followups = [];
      if (Array.isArray(res.data?.suggested_followups)) {
        followups = res.data.suggested_followups.map(f => typeof f === 'string' ? f : (f?.prompt || f?.title || String(f)));
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: followups
      };

      if (res.data?.interaction_id && !res.data.interaction_id.startsWith('local_')) {
        setPreviousInteractionId(res.data.interaction_id);
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "⚠️ I encountered a brief network delay. Please try sending your question again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: ['Explain QuickSort vs MergeSort with Python code', 'Create a 45-minute study plan']
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setPreviousInteractionId(null);
    const firstName = user?.full_name?.split(' ')[0] || (user?.email ? user.email.split('@')[0] : 'Student');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `🔄 Session refreshed! What new topic or problem shall we tackle, **${firstName}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: [
          'Explain QuickSort vs MergeSort with Python code',
          'How does Binary Search work in O(log N) time?',
          'Create a 45-minute study plan for machine learning'
        ]
      }
    ]);
  };

  const copyToClipboard = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
      {/* Top Header Card */}
      <GlassCard className="px-5 py-4 mb-4 flex items-center justify-between shrink-0 shadow-sm select-none">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-bold">
            <Bot className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                StudyPath AI Tutor
              </h1>
              <Badge variant="amber" size="sm">Gemini AI</Badge>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time Active Recall, Coding & Academic Mentor</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleClearChat}
            title="Reset conversation context"
          >
            Clear Session
          </Button>
        </div>
      </GlassCard>

      {/* Chat Messages Body */}
      <GlassCard className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 flex flex-col mb-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const isCopied = copiedIndex === idx;

          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm select-none ${
                  isUser
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-stone-950 border border-amber-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2 max-w-[85%] sm:max-w-[90%]">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm shadow-xs select-text cursor-text ${
                    isUser
                      ? 'bg-amber-400 text-stone-950 font-medium rounded-tr-none shadow-amber-500/10'
                      : 'bg-stone-50 dark:bg-[#1C1917] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>
                  ) : (
                    <ChatMessageContent text={msg.text} />
                  )}

                  <div className={`text-[10px] mt-2 flex items-center justify-between opacity-80 pt-1 select-none ${isUser ? 'text-stone-800' : 'text-stone-500 dark:text-stone-400'}`}>
                    <span>{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="hover:opacity-100 flex items-center gap-1 transition-opacity ml-3 cursor-pointer"
                      title="Copy message text"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Followup suggestions for bot messages */}
                {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                    {msg.suggested_followups.map((sug, sIdx) => {
                      const label = typeof sug === 'string' ? sug : (sug?.prompt || sug?.title || 'Explore topic');
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleSendMessage(label)}
                          className="text-[11px] font-medium px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all text-left flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-md mr-auto select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shrink-0 text-stone-950 shadow-sm font-bold">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-stone-50 dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="ml-1 font-medium text-amber-700 dark:text-amber-400">Gemini AI synthesizing response...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </GlassCard>

      {/* Dynamic Suggested Starter Cards if few messages */}
      {messages.length <= 2 && suggestions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 select-none">
          {suggestions.slice(0, 2).map((sug, idx) => {
            const promptText = sug.prompt || sug.title || '';
            const displayTitle = sug.title || sug.prompt || 'Topic';
            return (
              <button
                key={sug.id || `starter-${idx}`}
                type="button"
                onClick={() => handleSendMessage(promptText)}
                className="p-3 rounded-2xl bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-400/50 text-left transition-all group flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">{sug.category || 'Topic'}</span>
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">{displayTitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative shrink-0 select-none">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask StudyPath AI anything (code, algorithms, study plan)..."
          disabled={loading}
          className="w-full pl-4 pr-14 py-3.5 rounded-2xl bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-amber-400 shadow-lg select-text"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            inputMessage.trim() && !loading
              ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-md shadow-amber-400/20'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AiTutorPage;
