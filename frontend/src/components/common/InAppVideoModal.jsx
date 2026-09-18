import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Copy, Check, Sparkles, Video, Play, Volume2, ShieldCheck } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../../utils/youtube';

const InAppVideoModal = ({ isOpen, onClose, video }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !video) return null;

  const embedUrl = getYouTubeEmbedUrl(video.url, video.title);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(video.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl border border-amber-200 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-white to-yellow-500/10 border-b border-amber-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                    In-App Video Player
                  </span>
                  {video.channel && (
                    <span className="text-xs font-bold text-stone-700 truncate">
                      by {video.channel || video.author || 'Instructor'}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-black text-stone-950 truncate mt-0.5">
                  {video.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy Video URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>

              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Open in YouTube tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">YouTube Tab</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Iframe Viewport (16:9 Aspect Ratio) */}
          <div className="relative aspect-video w-full bg-stone-950 overflow-hidden">
            <iframe
              src={embedUrl}
              title={video.title || 'YouTube Video Player'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Footer Details & Tips */}
          <div className="p-4 bg-[#FAF7F0] border-t border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <p className="text-stone-700 font-semibold line-clamp-2">
              {video.description || 'Watch verified course material inside StudyPath without leaving your study session.'}
            </p>

            <span className="shrink-0 font-bold text-amber-900 flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Real Video Stream Active
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InAppVideoModal;
