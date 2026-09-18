import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Play,
  PlayCircle,
  BookOpen,
  Globe,
  Code2,
  Terminal,
  Sparkles,
  Video
} from 'lucide-react';
import Badge from './Badge';
import InAppVideoModal from './InAppVideoModal';

export const YouTubeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TYPE_CONFIG = {
  youtube: {
    label: 'YouTube Channel / Video',
    badgeVariant: 'rose',
    icon: Play,
    actionText: 'Watch in StudyPath',
    borderHover: 'hover:border-red-500/50 hover:shadow-red-500/10'
  },
  docs: {
    label: 'Official Documentation',
    badgeVariant: 'indigo',
    icon: BookOpen,
    actionText: 'Open Official Docs',
    borderHover: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10'
  },
  website: {
    label: 'Web Resource',
    badgeVariant: 'purple',
    icon: Globe,
    actionText: 'Visit Web Portal',
    borderHover: 'hover:border-purple-500/50 hover:shadow-purple-500/10'
  },
  practice: {
    label: 'Practice & Coding Labs',
    badgeVariant: 'emerald',
    icon: Code2,
    actionText: 'Launch Practice Lab',
    borderHover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10'
  },
  course: {
    label: 'Free Online Course',
    badgeVariant: 'amber',
    icon: Sparkles,
    actionText: 'Watch in StudyPath',
    borderHover: 'hover:border-amber-500/50 hover:shadow-amber-500/10'
  }
};

export const FreeResourceCard = ({ resource, compact = false, onPlayInApp }) => {
  const [copied, setCopied] = useState(false);
  const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.website;
  const Icon = cfg.icon;
  const isVideo = resource.type === 'youtube' || resource.type === 'course' || (resource.url && (resource.url.includes('youtube.com') || resource.url.includes('youtu.be')));

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(resource.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = (e) => {
    if (isVideo && onPlayInApp) {
      e.preventDefault();
      onPlayInApp(resource);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 ${isVideo ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white truncate">{resource.title}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {resource.author || resource.provider || cfg.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          {isVideo && onPlayInApp ? (
            <button
              type="button"
              onClick={handleAction}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Watch</span>
            </button>
          ) : (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-xs transition-colors cursor-pointer"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-3 transition-all duration-300 hover:shadow-lg ${cfg.borderHover}`}
    >
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isVideo
                  ? 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30'
                  : resource.type === 'docs'
                  ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                  : resource.type === 'practice'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{resource.badge || cfg.label}</span>
            </span>

            {(resource.author || resource.provider) && (
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                by {resource.author || resource.provider}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
            title="Copy URL"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-1">
                <Check className="w-3 h-3" /> Copied
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {resource.title}
        </h4>

        {/* Description */}
        {resource.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
        {isVideo ? (
          <>
            <button
              type="button"
              onClick={handleAction}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch in StudyPath</span>
            </button>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Open directly in YouTube tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span>{cfg.actionText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

const FreeResourcesGrid = ({ resources = [], title = 'Curated Free Channels & Learning Portals', description, onPlayVideo }) => {
  const [filterType, setFilterType] = useState('all');
  const [selectedModalVideo, setSelectedModalVideo] = useState(null);

  if (!resources || resources.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-center text-xs text-slate-500 dark:text-slate-400">
        Free video channels and documentation links are loading...
      </div>
    );
  }

  const filtered = resources.filter((r) => {
    if (filterType === 'all') return true;
    if (filterType === 'video') return r.type === 'youtube' || r.type === 'course';
    if (filterType === 'docs') return r.type === 'docs' || r.type === 'website';
    if (filterType === 'practice') return r.type === 'practice';
    return true;
  });

  const handlePlay = (videoItem) => {
    if (onPlayVideo) {
      onPlayVideo(videoItem);
    } else {
      setSelectedModalVideo(videoItem);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{title}</span>
          </h3>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-white/5 text-xs shrink-0">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'video', label: 'YouTube / Video' },
            { id: 'docs', label: 'Official Docs' },
            { id: 'practice', label: 'Practice Labs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((resource, idx) => (
          <FreeResourceCard
            key={idx}
            resource={resource}
            onPlayInApp={handlePlay}
          />
        ))}
      </div>

      {/* Embedded In-App Video Modal */}
      <InAppVideoModal
        isOpen={Boolean(selectedModalVideo)}
        onClose={() => setSelectedModalVideo(null)}
        video={selectedModalVideo}
      />
    </div>
  );
};

export default FreeResourcesGrid;
