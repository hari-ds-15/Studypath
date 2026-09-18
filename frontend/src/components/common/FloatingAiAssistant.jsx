import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  X,
  Send,
  RotateCcw,
  User,
  Copy,
  Check
} from 'lucide-react';
import api from '../../services/api';
import ChatMessageContent from './ChatMessageContent';

const FloatingAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'initial',
      sender: 'bot',
      text: '👋 Need instant help with a concept, code bug, study plan, or resources? Ask me anything!',
      timestamp: 'Now',
      suggested_followups: [
        'Top Python learning resources',
        'Explain Dijkstra algorithm',
        'Create a study plan'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [previousInteractionId, setPreviousInteractionId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const copyMessageText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
      console.error('Floating chat error:', err);
      const errMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "I'm experiencing a brief network hiccup. Please try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-stone-950 font-bold text-xs shadow-2xl shadow-amber-500/30 border border-amber-300 group transition-all cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-stone-950 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#FACC15]" />
          </div>
          <span className="tracking-tight hidden sm:inline font-bold">Ask AI Tutor</span>
          <Sparkles className="w-3.5 h-3.5 text-stone-850 group-hover:rotate-12 transition-transform" />
        </motion.button>
      )}

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[92vw] sm:w-[420px] h-[560px] rounded-3xl bg-white dark:bg-[#141210] border border-stone-200/90 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-stone-50/90 dark:bg-[#1C1917]/90 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-stone-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                    StudyPath AI Tutor
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[9px] font-bold border border-amber-200 dark:border-amber-500/30">Gemini AI</span>
                  </h3>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">Always-ready study & coding companion</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMessages([{ id: 'reset', sender: 'bot', text: '🔄 Conversation reset. How can I help you?', timestamp: 'Now' }])}
                  className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Reset session"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const isCopied = copiedIndex === idx;

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[92%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl select-text cursor-text text-xs leading-relaxed shadow-xs w-full ${
                        isUser
                          ? 'bg-amber-400 text-stone-950 font-semibold rounded-tr-none'
                          : 'bg-stone-50 dark:bg-[#1C1917] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-tl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>
                      ) : (
                        <ChatMessageContent text={msg.text} />
                      )}

                      <div className={`text-[10px] mt-2 flex items-center justify-between opacity-80 pt-1 select-none ${isUser ? 'text-stone-800 font-medium' : 'text-stone-500 dark:text-stone-400'}`}>
                        <span>{msg.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => copyMessageText(msg.text, idx)}
                          className="hover:opacity-100 flex items-center gap-1 transition-opacity ml-3 cursor-pointer"
                          title="Copy message text"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Follow-up suggestion pills */}
                    {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 select-none">
                        {msg.suggested_followups.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSendMessage(sug)}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all text-left flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>{sug}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-2 max-w-[85%] mr-auto items-center text-xs text-stone-500 dark:text-stone-400 p-3 rounded-2xl bg-stone-50 dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 select-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 ml-1">Gemini AI synthesizing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="p-3 bg-stone-50/90 dark:bg-[#1C1917]/90 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 shrink-0 select-none"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI anything (links & code copy supported)..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-[#141210] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 shadow-inner select-text"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  inputMessage.trim() && !loading
                    ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingAiAssistant;
