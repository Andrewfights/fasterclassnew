import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Play,
  ChevronRight,
  BookOpen,
  Smartphone,
  Rocket,
} from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { gamificationService } from '../../services/gamificationService';
import { INITIAL_VIDEOS, COURSES, formatDuration } from '../../constants';
import { filterValidVideos } from '../../services/videoValidationService';
import { FOUNDER_TOPICS } from '../../data/topics';
import { getExperts } from '../../data/experts';
import { HeroCarouselItem } from '../../types';
import { HeroCarousel } from '../vod/HeroCarousel';

// New dashboard components
import { FounderHQ } from '../dashboard/FounderHQ';
import { ContinueJourney } from '../dashboard/ContinueJourney';
import { CreateCompanyModal } from '../modals/CreateCompanyModal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    progress,
    founderJourney,
    gameSessions,
    hasCompany,
    createCompany,
  } = useGamification();
  const { continueWatching } = useLibrary();
  const stats = gamificationService.getStats();

  // Modal state
  const [showCreateCompany, setShowCreateCompany] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Show create company modal for first-time users after a brief delay
    if (!hasCompany) {
      const timer = setTimeout(() => setShowCreateCompany(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompany]);

  // Get all valid videos
  const validVideos = useMemo(() => filterValidVideos(INITIAL_VIDEOS), []);

  // Get continue watching video
  const continueVideo = useMemo(() => {
    if (continueWatching.length === 0) return null;
    const historyItem = continueWatching[0];
    const video = validVideos.find(v => v.id === historyItem.videoId);
    if (!video) return null;
    const progressPercent = Math.round((historyItem.timestamp / video.duration) * 100);
    return { video, progress: progressPercent, timestamp: historyItem.timestamp };
  }, [continueWatching, validVideos]);

  // Get recommended videos (based on tags from watched videos)
  const recommendedVideos = useMemo(() => {
    const watchedIds = new Set(continueWatching.map(h => h.videoId));
    return validVideos
      .filter(v => !watchedIds.has(v.id) && !v.isVertical)
      .slice(0, 10);
  }, [continueWatching, validVideos]);

  // Get shorts videos for the shorts section
  const shortsVideos = useMemo(() => {
    return validVideos
      .filter(v => v.isVertical === true)
      .slice(0, 12);
  }, [validVideos]);

  // Top experts (most curated talks) for the home rail
  const topExperts = useMemo(
    () => getExperts(validVideos.filter(v => !v.isVertical)).slice(0, 10),
    [validVideos]
  );

  // Get time-based greeting (hustle style)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Rise and grind';
    if (hour < 17) return "Let's build";
    return 'Time to build';
  }, []);

  // Hero carousel items - mix of courses and videos
  const heroCarouselItems: HeroCarouselItem[] = useMemo(() => {
    const longFormVideos = validVideos.filter(v => !v.isVertical && v.duration > 300);
    return [
      { type: 'course', item: COURSES[0] },
      ...(longFormVideos[0] ? [{ type: 'video' as const, item: longFormVideos[0] }] : []),
      { type: 'course', item: COURSES[1] },
      ...(longFormVideos[4] ? [{ type: 'video' as const, item: longFormVideos[4] }] : []),
      { type: 'course', item: COURSES[2] },
      ...(longFormVideos[8] ? [{ type: 'video' as const, item: longFormVideos[8] }] : []),
    ].filter(Boolean);
  }, [validVideos]);

  // Handle company creation
  const handleCreateCompany = (name: string, description: string, industry: 'saas' | 'consumer' | 'marketplace' | 'fintech' | 'healthtech' | 'other') => {
    createCompany(name, description, industry);
    setShowCreateCompany(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Create Company Modal */}
      <CreateCompanyModal
        isOpen={showCreateCompany}
        onClose={() => setShowCreateCompany(false)}
        onCreateCompany={handleCreateCompany}
      />

      {/* Hero Carousel - with top padding for mobile nav */}
      <div className="pt-14 lg:pt-0">
        <HeroCarousel items={heroCarouselItems} autoPlayInterval={8000} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Founder HQ - Show if company exists */}
        {founderJourney && (
          <div className="mb-8">
            <FounderHQ
              journey={founderJourney}
              streak={stats.currentStreak}
              onViewDetails={() => navigate('/profile')}
            />
          </div>
        )}

        {/* Welcome Header (for users without company) - clean & minimal */}
        {!founderJourney && (
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="mc-heading text-2xl md:text-3xl text-white">
                  {greeting}, Founder
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  Signal, not noise — curated advice from the founders who've done it.
                </p>
              </div>

              {/* Start Journey Button */}
              <button
                onClick={() => setShowCreateCompany(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c9a227] to-[#d4af37] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity shrink-0"
              >
                <Rocket className="w-5 h-5" />
                Start Your Journey
              </button>
            </div>
          </div>
        )}

        {/* Continue Journey / Continue Watching */}
        {(continueWatching.length > 0 || Object.keys(gameSessions).length > 0) && (
          <div className="mb-10">
            <ContinueJourney
              watchHistory={continueWatching}
              gameSessions={gameSessions}
              videos={validVideos}
              inProgressModules={Object.entries(progress.modulesInProgress || {}).map(([id, mod]) => ({
                moduleId: id,
                title: mod.moduleId,
                progress: mod.percentComplete,
                courseTitle: 'Course',
              }))}
            />
          </div>
        )}

        {/* Continue Learning hero card (when something is in progress) */}
        {continueVideo && (
          <div className="mb-10">
            <button
              onClick={() => navigate(`/watch/${continueVideo.video.id}?t=${continueVideo.timestamp}`)}
              className="w-full max-w-3xl bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden hover:border-[#c9a227]/50 transition-all group"
            >
              <div className="relative aspect-video">
                <img
                  src={continueVideo.video.thumbnail}
                  alt={continueVideo.video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="mc-label text-[#c9a227] mb-1">Pick Up Where You Left Off</p>
                  <h3 className="font-display text-xl font-bold text-white mb-1">{continueVideo.video.title}</h3>
                  <p className="text-sm text-white/70">{continueVideo.video.expert}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div className="h-full bg-[#c9a227]" style={{ width: `${continueVideo.progress}%` }} />
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Browse by Topic */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Browse by Topic</h2>
            <Link
              to="/topics"
              className="text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              All Topics <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {FOUNDER_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => navigate(`/topics/${topic.id}`)}
                className="group relative flex-shrink-0 w-52 aspect-[4/3] rounded-2xl overflow-hidden text-left border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <img
                  src={topic.cover}
                  alt={topic.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(140deg, ${topic.accent}40, transparent 55%)` }}
                />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-base font-bold text-white">{topic.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Learn from the Best - Experts */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Learn from the Best</h2>
            <Link
              to="/experts"
              className="text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              All Experts <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {topExperts.map(expert => (
              <button
                key={expert.slug}
                onClick={() => navigate(`/experts/${expert.slug}`)}
                className="group flex-shrink-0 w-36 text-left"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 border border-white/10 group-hover:border-white/30 transition-all duration-300">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#c9a227] transition-colors">
                  {expert.name}
                </h3>
                <p className="text-xs text-[#6B7280] line-clamp-1">{expert.role}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Recommended Videos */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Curated For Your Hustle</h2>
            <Link
              to="/vod"
              className="text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              Explore More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {recommendedVideos.map(video => (
              <button
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                className="flex-shrink-0 w-36 sm:w-44 md:w-48 group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-2 group-hover:text-[#c9a227] transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{video.expert}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Shorts Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#FF0000]" />
              Quick Hits
            </h2>
            <Link
              to="/vod"
              className="text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              View All Shorts <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {shortsVideos.map(video => (
              <button
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                className="flex-shrink-0 w-28 sm:w-32 group"
              >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-2 bg-[#1E1E2E]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute top-2 left-2 p-1.5 bg-[#FF0000]/90 rounded-full">
                    <Smartphone className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xs font-medium text-white line-clamp-2 group-hover:text-[#c9a227] transition-colors">
                  {video.title}
                </h3>
                <p className="text-[10px] text-[#6B7280] mt-0.5">{video.expert}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
