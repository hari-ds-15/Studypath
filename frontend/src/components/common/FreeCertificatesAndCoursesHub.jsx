import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Play,
  BookOpen,
  Award,
  Globe,
  Code2,
  CheckCircle2,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import { PROGRAMMING_TOPICS } from '../../data/freeCoursesAndCertsData';
import { YouTubeIcon } from './FreeResourcesGrid';
import GlassCard from './GlassCard';
import Badge from './Badge';
import InAppVideoModal from './InAppVideoModal';

const CATEGORIES = [
  'All',
  'Programming Languages',
  'Computer Science',
  'AI & Data Science',
  'Web Development',
  'Cloud & DevOps',
  'Cybersecurity'
];

export const ResourceLinkCard = ({ item, type = 'youtube', onPlayInApp }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCert = type === 'cert';
  const isVideo = type === 'youtube' || (item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be')));

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
      isCert
        ? 'bg-gradient-to-br from-amber-500/10 via-slate-50 to-amber-500/5 dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900 border-amber-500/30 hover:border-amber-500 shadow-xs'
        : isVideo
        ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-white/10 hover:border-red-500/50 hover:shadow-red-500/10 shadow-xs'
        : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-indigo-500/10 shadow-xs'
    }`}>
      <div className="space-y-2">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${
              isCert
                ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/40'
                : isVideo
                ? 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30'
                : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
            }`}>
              {isCert ? <Award className="w-3 h-3 text-amber-500" /> : isVideo ? <YouTubeIcon className="w-3 h-3 text-red-500" /> : <Globe className="w-3 h-3 text-indigo-500" />}
              <span>{item.badge || (isCert ? 'Free Certificate' : isVideo ? 'YouTube Course' : 'Web Resource')}</span>
            </span>

            {(item.provider || item.channel) && (
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                by {item.provider || item.channel}
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
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <Check className="w-3 h-3" /> Copied
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
          {item.title}
        </h4>

        {/* Description */}
        {item.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
            {item.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
        {isVideo ? (
          <>
            <button
              type="button"
              onClick={() => onPlayInApp && onPlayInApp(item)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch in StudyPath</span>
            </button>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Open in YouTube tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isCert
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            <span>{isCert ? 'Access Free Certification' : 'Open Official Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

const FreeCertificatesAndCoursesHub = ({ initialSearch = '', defaultCategory = 'All' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'youtube', 'websites', 'certificates'
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);

  const filteredTopics = useMemo(() => {
    return PROGRAMMING_TOPICS.filter((topic) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        topic.name.toLowerCase().includes(q) ||
        topic.tags.some((t) => t.includes(q)) ||
        topic.youtube_channels.some((y) => y.title.toLowerCase().includes(q) || y.channel.toLowerCase().includes(q)) ||
        topic.free_websites.some((w) => w.title.toLowerCase().includes(q) || w.provider.toLowerCase().includes(q)) ||
        topic.free_certificates.some((c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'All' || topic.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 select-none">
      {/* Search and Category Filter Toolbar */}
      <GlassCard className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              placeholder="Search any course (e.g. Python, Java, React, C++, DSA, Machine Learning, AWS, Cyber)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0a0f1d] border-2 border-indigo-500/30 focus:border-indigo-600 dark:focus:border-indigo-400 text-xs sm:text-sm text-slate-900 dark:text-white font-semibold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-xs"
            />
          </div>

          {/* Quick Clear or Count */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1 shrink-0"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Type Filter Tabs */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Resources' },
              { id: 'youtube', label: 'YouTube Channels & Playlists' },
              { id: 'websites', label: 'Documentation & Labs' },
              { id: 'certificates', label: 'Free Certificates' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredTopics.length}</strong> topics
          </span>
        </div>
      </GlassCard>

      {/* Programming Topics Grid */}
      <div className="space-y-6">
        {filteredTopics.map((topic) => {
          const showYouTube = activeTab === 'all' || activeTab === 'youtube';
          const showWebsites = activeTab === 'all' || activeTab === 'websites';
          const showCerts = activeTab === 'all' || activeTab === 'certificates';

          return (
            <GlassCard key={topic.id} className="p-5 sm:p-6 space-y-5">
              {/* Topic Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${topic.iconColor} flex items-center justify-center text-white shadow-md font-black text-sm`}>
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {topic.name}
                      </h3>
                      <Badge variant="indigo" size="sm">
                        {topic.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {topic.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {topic.youtube_channels.length} YouTube • {topic.free_certificates.length} Free Certs
                  </span>
                </div>
              </div>

              {/* SECTION 1: YouTube Channels & Full Video Playlists */}
              {showYouTube && topic.youtube_channels.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-red-600 dark:text-red-400">
                    <YouTubeIcon className="w-4 h-4" />
                    <span>Free Video Playlists & Structured Full Courses</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {topic.youtube_channels.map((item, idx) => (
                      <ResourceLinkCard
                        key={idx}
                        item={item}
                        type="youtube"
                        onPlayInApp={(v) => setModalVideo(v)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 2: Official Documentation & Interactive Sandbox Portals */}
              {showWebsites && topic.free_websites.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-4 h-4" />
                    <span>Official Documentation, Guides & Practice Portals</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {topic.free_websites.map((item, idx) => (
                      <ResourceLinkCard
                        key={idx}
                        item={item}
                        type="website"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: 100% Free Verified Certificates */}
              {showCerts && topic.free_certificates.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-400">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Free Verified Certification Links & Portals</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {topic.free_certificates.map((item, idx) => (
                      <ResourceLinkCard
                        key={idx}
                        item={item}
                        type="cert"
                      />
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* In-App YouTube Video Modal */}
      <InAppVideoModal
        isOpen={Boolean(modalVideo)}
        onClose={() => setModalVideo(null)}
        video={modalVideo}
      />
    </div>
  );
};

export default FreeCertificatesAndCoursesHub;
