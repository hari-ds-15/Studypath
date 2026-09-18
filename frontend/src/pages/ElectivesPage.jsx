import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Sparkles,
  Search,
  Bookmark,
  BookmarkCheck,
  Play,
  Info,
  CheckCircle2,
  Briefcase,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import FreeResourcesGrid, { YouTubeIcon } from '../components/common/FreeResourcesGrid';

const ElectivesPage = () => {
  const navigate = useNavigate();
  const [electives, setElectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedElective, setSelectedElective] = useState(null);

  const fetchElectives = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recommendations/electives');
      setElectives(res.data);
    } catch (err) {
      console.error('Failed to load electives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectives();
  }, []);

  const handleToggleSave = async (courseId, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/courses/${courseId}/save`);
      setElectives((prev) =>
        prev.map((el) => (el.course_id === courseId ? { ...el, is_saved: res.data.saved } : el))
      );
    } catch (err) {
      console.error('Error saving elective:', err);
    }
  };

  const filteredElectives = electives.filter((el) => {
    const matchesSearch =
      el.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.career_relevance.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || el.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Elective Recommendations <Layers className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Specialized tracks mapped directly to industry career demands and prerequisite fulfillment
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search electives by track (AI, Big Data, Cloud, Cybersecurity)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100/90 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-[#0d1428] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'AI & ML', 'Data Science', 'Cloud & DevOps', 'Cybersecurity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-[#162038] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-[#1f2d4e] border border-slate-200 dark:border-slate-700/80 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Electives Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredElectives.map((el) => (
            <GlassCard key={el.course_id} className="p-6 flex flex-col justify-between space-y-5" hover>
              <div className="space-y-4">
                {/* Header with Match & Save */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" size="sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {el.match_score}% Match
                      </Badge>
                      <Badge variant="indigo" size="sm">{el.category}</Badge>
                      <Badge variant="slate" size="sm">{el.difficulty}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">{el.course_name}</h3>
                  </div>

                  <button
                    onClick={(e) => handleToggleSave(el.course_id, e)}
                    className={`p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                      el.is_saved
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-100 dark:bg-[#162038] border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-[#1f2d4e]'
                    }`}
                    title={el.is_saved ? 'Remove Bookmark' : 'Save Elective'}
                  >
                    {el.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Why Recommended Reason */}
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{el.why_recommended}</span>
                </div>

                {/* Career Relevance & Prerequisites */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0f1d]/80 border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Target Career Role
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{el.career_relevance}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0f1d]/80 border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Key Prerequisites
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {el.prerequisites?.join(', ') || 'Foundations'}
                    </p>
                  </div>
                </div>

                {/* Free Resources Quick Preview */}
                {el.free_resources?.length > 0 && (
                  <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <YouTubeIcon className="w-3 h-3 text-red-500" /> Free Links:
                    </span>
                    {el.free_resources.slice(0, 2).map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all hover:scale-105 cursor-pointer ${
                          res.type === 'youtube'
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-900/40'
                            : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                        }`}
                        title={`Direct open: ${res.title}`}
                      >
                        <span className="truncate max-w-[120px]">{res.author || res.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                    {el.free_resources.length > 2 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        +{el.free_resources.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Info}
                  onClick={() => {
                    setSelectedElective(el);
                    setDetailModalOpen(true);
                  }}
                >
                  Syllabus & Free Links
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={() => navigate(`/learning/${el.course_id}`)}
                >
                  Enroll Elective
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Elective Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="max-w-3xl"
        title={selectedElective?.course_name || 'Elective Syllabus Overview'}
      >
        {selectedElective && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="emerald">{selectedElective.match_score}% Match</Badge>
              <Badge variant="indigo">{selectedElective.category}</Badge>
              <Badge variant="slate">{selectedElective.difficulty}</Badge>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedElective.why_recommended}</p>

            {/* Curated Free Resources in Modal */}
            {selectedElective.free_resources?.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <FreeResourcesGrid
                  resources={selectedElective.free_resources}
                  title="Curated Free YouTube Channels & Web Links"
                  description="Directly open official documentation, playlists, and interactive practice platforms in a new tab."
                />
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Core Syllabus Modules:</h4>
              <div className="space-y-2">
                {selectedElective.syllabus_preview?.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0f1d]/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="md" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Play}
                onClick={() => {
                  setDetailModalOpen(false);
                  navigate(`/learning/${selectedElective.course_id}`);
                }}
              >
                Enroll Now
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ElectivesPage;
