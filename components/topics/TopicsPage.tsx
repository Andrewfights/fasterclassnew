import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration } from '../../constants';
import { filterValidVideos } from '../../services/videoValidationService';
import { FOUNDER_TOPICS, getTopicById, getTopicVideos } from '../../data/topics';
import { viewsLabel } from '../../data/metrics';

export const TopicsPage: React.FC = () => {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId?: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topicId]);

  const validVideos = useMemo(() => filterValidVideos(INITIAL_VIDEOS), []);

  // Video count per topic (for the catalogue cards)
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of FOUNDER_TOPICS) map[t.id] = getTopicVideos(t, validVideos).length;
    return map;
  }, [validVideos]);

  const activeTopic = topicId ? getTopicById(topicId) : undefined;

  // ---- Detail view ----
  if (topicId) {
    if (!activeTopic) {
      return (
        <div className="min-h-screen bg-[#0D0D12] pt-14 lg:pt-0 px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-white/70">Topic not found.</p>
          <Link to="/topics" className="text-[#c9a227] hover:underline">Back to all topics</Link>
        </div>
      );
    }

    const topicVideos = getTopicVideos(activeTopic, validVideos);

    return (
      <div className="min-h-screen bg-[#0D0D12]">
        {/* Topic hero */}
        <div className="relative pt-14 lg:pt-0">
          <div className="relative h-56 md:h-72 overflow-hidden">
            <img src={activeTopic.cover} alt={activeTopic.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/70 to-transparent" />
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: `linear-gradient(120deg, ${activeTopic.accent}55, transparent 60%)` }}
            />
            <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
              <Link
                to="/topics"
                className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-3 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> All Topics
              </Link>
              <h1 className="mc-heading text-3xl md:text-4xl text-white">{activeTopic.title}</h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-white/60">{activeTopic.blurb}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
                {topicVideos.length} curated {topicVideos.length === 1 ? 'video' : 'videos'}
              </p>
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {topicVideos.map(video => (
              <button
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                className="group text-left"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-[#1A1A24]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#c9a227] transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {video.expert} · {viewsLabel(video.id)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- Catalogue (list) view ----
  return (
    <div className="min-h-screen bg-[#0D0D12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mc-heading text-3xl md:text-4xl text-white">Browse by Topic</h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-white/50">
            Signal, not noise — the best founder advice on the internet, curated into the
            paths that matter at every stage.
          </p>
        </div>

        {/* Premium topic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FOUNDER_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => navigate(`/topics/${topic.id}`)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left border border-white/10 transition-all duration-300 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
            >
              {/* Cover */}
              <img
                src={topic.cover}
                alt={topic.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
              />
              {/* Base gradient for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              {/* Accent wash on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(140deg, ${topic.accent}40, transparent 55%)` }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ backgroundColor: topic.accent + '22', color: topic.accent }}
                  >
                    {counts[topic.id]} videos
                  </span>
                  <ChevronRight className="w-5 h-5 text-white/0 -translate-x-2 group-hover:text-white group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <h2 className="mt-3 text-xl font-bold text-white">{topic.title}</h2>
                {/* Blurb: always visible on touch screens; hover-reveal on desktop (roll-over feel from the brief) */}
                <p className="text-sm text-white/70 mt-1.5 overflow-hidden transition-all duration-300 lg:max-h-0 lg:opacity-0 lg:mt-0 lg:group-hover:max-h-24 lg:group-hover:opacity-100 lg:group-hover:mt-1.5">
                  {topic.blurb}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
