import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ChatMessageContent from '../components/common/ChatMessageContent';

const AiTutorPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [previousInteractionId, setPreviousInteractionId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message and prompt suggestions
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await api.get('/chat/suggestions');
        setSuggestions(res.data);
      } catch (err) {
        console.error('Failed to load chat suggestions:', err);
      }
    };

    fetchInitialData();

    // Default welcome message
    const firstName = user?.full_name?.split(' ')[0] || 'Student';
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `👋 Hello **${firstName}**! I am your **StudyPath AI Tutor & Academic Advisor**, powered by **Google Gemini AI**.\n\nI can help you:\n* 🧠 **Break down complex algorithms & code** (Python, DSA, SQL, ML)\n* 📅 **Build customized spaced-repetition study schedules**\n* 🎯 **Target your priority growth areas** and weak subjects\n* 📝 **Generate interactive diagnostic quiz questions**\n* 🔗 **Share top industry-standard tutorials & documentation links**\n\nWhat would you like to master today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: [
          'Top learning resources for Python & DSA',
          'Explain the time complexity of QuickSort vs MergeSort',
          'Create a 45-minute active recall session for my weak topics'
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
    const trimmed = textToSend.trim();
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

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: res.data.suggested_followups || []
      };

      if (res.data.interaction_id && !res.data.interaction_id.startsWith('local_')) {
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
        suggested_followups: ['Try asking again', 'Give me a study tip']
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
    const firstName = user?.full_name?.split(' ')[0] || 'Student';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `🔄 Memory refreshed! What new topic or problem shall we tackle, **${firstName}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: [
          'Top learning resources for Python & DSA',
          'Explain Dijkstra with Python code',
          'Generate a personalized 7-day revision schedule'
        ]
      }
    ]);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto">
      {/* Top Header Card */}
      <GlassCard className="px-5 py-4 mb-4 flex items-center justify-between shrink-0 shadow-md select-none">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                StudyPath AI Tutor
              </h1>
              <Badge variant="indigo" size="sm">Gemini AI</Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
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
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md select-none ${
                  isUser
                    ? 'bg-indigo-600'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2 max-w-[85%] sm:max-w-[90%]">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm shadow-sm select-text cursor-text ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>
                  ) : (
                    <ChatMessageContent text={msg.text} />
                  )}

                  <div className={`text-[10px] mt-2 flex items-center justify-between opacity-80 pt-1 select-none ${isUser ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    <span>{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="hover:opacity-100 flex items-center gap-1 transition-opacity ml-3 cursor-pointer"
                      title="Copy message text"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Followup suggestions for bot messages */}
                {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                    {msg.suggested_followups.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] font-medium px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all text-left flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 text-white shadow-md">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="ml-1 font-medium text-indigo-600 dark:text-indigo-400">Gemini AI synthesizing response...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </GlassCard>

      {/* Dynamic Suggested Starter Cards if few messages */}
      {messages.length <= 2 && suggestions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 select-none">
          {suggestions.slice(0, 2).map((sug) => (
            <button
              key={sug.id}
              type="button"
              onClick={() => handleSendMessage(sug.prompt)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/40 text-left transition-all group flex items-center justify-between shadow-sm cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">{sug.category}</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{sug.title}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
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
          placeholder="Ask StudyPath AI anything (links & code copy supported)..."
          disabled={loading}
          className="w-full pl-4 pr-14 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 shadow-lg select-text"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            inputMessage.trim() && !loading
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AiTutorPage;
