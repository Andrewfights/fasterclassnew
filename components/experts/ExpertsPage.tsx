import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Play, PlayCircle, ExternalLink } from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration } from '../../constants';
import { filterValidVideos } from '../../services/videoValidationService';
import { getExperts, getExpertBySlug } from '../../data/experts';
import { viewsLabel } from '../../data/metrics';
import { ExpertAvatar } from './ExpertAvatar';

export const ExpertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { expertId } = useParams<{ expertId?: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [expertId]);

  // Long-form videos only (mirrors the topics catalogue)
  const videos = useMemo(
    () => filterValidVideos(INITIAL_VIDEOS).filter(v => !v.isVertical),
    []
  );

  const experts = useMemo(() => getExperts(videos), [videos]);
  const activeExpert = expertId ? getExpertBySlug(expertId, videos) : undefined;

  // ---- Detail view (MasterClass-style hero) ----
  if (expertId) {
    if (!activeExpert) {
      return (
        <div className="min-h-screen bg-[#0D0D12] pt-20 lg:pt-12 px-4 sm:px-6 lg:px-8">
          <p className="text-white/70">Expert not found.</p>
          <Link to="/experts" className="text-[#c9a227] hover:underline">Back to all experts</Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0D0D12]">
        {/* Hero */}
        <div className="relative pt-14 lg:pt-0 overflow-hidden">
          {/* Ambient blurred backdrop */}
          <ExpertAvatar
            name={activeExpert.name}
            image={activeExpert.image}
            className="absolute inset-0 opacity-30 blur-2xl scale-125"
            objectClass="object-center"
            initialsClass="text-[160px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12] via-[#0D0D12]/80 to-[#0D0D12]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-transparent" />

          <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 lg:pt-12 pb-8">
            <Link
              to="/experts"
              className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> All Experts
            </Link>

            <div className="flex items-end gap-5">
              {/* Portrait card */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-white/15 shadow-2xl shrink-0">
                <ExpertAvatar name={activeExpert.name} image={activeExpert.image} initialsClass="text-4xl sm:text-5xl" />
              </div>
              <div className="min-w-0 pb-1">
                <p className="mc-label text-[#c9a227] mb-1.5">Teaches Founders</p>
                <h1 className="mc-heading text-3xl md:text-5xl text-white leading-tight">{activeExpert.name}</h1>
                <p className="mt-1 text-sm md:text-base text-white/60">{activeExpert.role}</p>
                {activeExpert.tagline && (
                  <p className="mt-1.5 text-sm md:text-base italic text-white/45 max-w-xl">{activeExpert.tagline}</p>
                )}
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm md:text-base text-white/75 leading-relaxed">
              {activeExpert.bio}
            </p>

            {activeExpert.expertise && activeExpert.expertise.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {activeExpert.expertise.map(topic => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                <PlayCircle className="w-4 h-4" />
                {activeExpert.videos.length} curated {activeExpert.videos.length === 1 ? 'video' : 'videos'}
              </div>
              {activeExpert.links?.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#c9a227] hover:text-[#e0b94a] transition-colors"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-lg font-semibold text-white mb-4">Curated Talks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {activeExpert.videos.map(video => (
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
                <p className="text-xs text-[#6B7280] mt-0.5">{viewsLabel(video.id)}</p>
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
        <div className="mb-8">
          <h1 className="mc-heading text-3xl md:text-4xl text-white">Learn from the Best</h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-white/50">
            The biggest names in startups — every page is just their founder advice,
            curated from across the internet.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {experts.map(expert => (
            <button
              key={expert.slug}
              onClick={() => navigate(`/experts/${expert.slug}`)}
              className="group text-left"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300">
                <ExpertAvatar
                  name={expert.name}
                  image={expert.image}
                  className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                  initialsClass="text-5xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#c9a227] mb-1">
                    {expert.videos.length} {expert.videos.length === 1 ? 'talk' : 'talks'}
                  </p>
                  <h2 className="text-lg font-bold text-white leading-tight">{expert.name}</h2>
                  <p className="text-xs text-white/60 line-clamp-1">{expert.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertsPage;
