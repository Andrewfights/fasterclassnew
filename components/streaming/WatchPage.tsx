import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Clock, User, RotateCcw, AlertTriangle, SkipForward, ListVideo, Play, X } from 'lucide-react';
import { INITIAL_VIDEOS, INITIAL_PLAYLISTS, formatDuration, COURSES, getYoutubeId } from '../../constants';
import { getCourseVideoIds } from '../../types';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePiP } from '../../contexts/PiPContext';
import { useTheme } from '../../contexts/ThemeContext';
import { VideoCard } from './VideoCard';
import { reportVideoError, filterValidVideos } from '../../services/videoValidationService';

export const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isVideoSaved, toggleSaveVideo, updateVideoProgress, getVideoProgress, markVideoCompleted, getPlaylist } = useLibrary();
  const { enablePiP, disablePiP } = usePiP();
  const { preferences, setAutoplayNext } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [watchFromStart, setWatchFromStart] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [errorRetryCount, setErrorRetryCount] = useState(0);
  const currentTimeRef = useRef<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerStateRef = useRef<number>(-1);
  const [upNext, setUpNext] = useState<typeof video>(null);
  const [countdown, setCountdown] = useState(5);
  const handleEndedRef = useRef<() => void>(() => {});
  const durationRef = useRef(0);
  const advanceFiredRef = useRef(false); // one-shot guard for end / early-advance
  const videoRef = useRef<typeof video>(null);
  const enablePiPRef = useRef(enablePiP);

  const video = INITIAL_VIDEOS.find(v => v.id === videoId);

  // Keep refs in sync
  videoRef.current = video;
  enablePiPRef.current = enablePiP;
  const saved = videoId ? isVideoSaved(videoId) : false;
  const progress = videoId ? getVideoProgress(videoId) : undefined;

  // Entering the full watch page: always kill the mini-player so only ONE YouTube
  // player is ever active (fixes double-audio / double-play with PiP).
  useEffect(() => {
    disablePiP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Get resume time from URL query param or saved progress
  const urlResumeTime = searchParams.get('t');
  const savedResumeTime = progress?.timestamp || 0;
  const resumeTime = watchFromStart ? 0 : (urlResumeTime ? parseInt(urlResumeTime) : savedResumeTime);
  const hasProgress = savedResumeTime > 10; // Only show restart if more than 10 seconds watched

  // Find related videos (same tags or from same course) - filtered for valid videos
  const relatedVideos = video
    ? filterValidVideos(INITIAL_VIDEOS.filter(v =>
        v.id !== video.id &&
        v.tags.some(tag => video.tags.includes(tag))
      )).slice(0, 6)
    : [];

  // Handle video error - report and offer to skip
  const handleVideoError = useCallback(() => {
    if (video && !videoError) {
      setVideoError(true);
      reportVideoError(video.id, video.embedUrl);
      console.warn(`Video failed to load: ${video.id} - ${video.title}`);
    }
  }, [video, videoError]);

  // Skip to next available video
  const handleSkipToNext = useCallback(() => {
    if (relatedVideos.length > 0) {
      navigate(`/watch/${relatedVideos[0].id}`);
    } else {
      navigate('/topics');
    }
  }, [relatedVideos, navigate]);

  // Reset error state when video changes
  useEffect(() => {
    setVideoError(false);
    setErrorRetryCount(0);
  }, [videoId]);

  // Find which course this video belongs to
  const course = video
    ? COURSES.find(c => c.videoIds.includes(video.id))
    : undefined;

  useEffect(() => {
    // Mark video as started when page loads
    if (videoId && resumeTime > 0) {
      updateVideoProgress(videoId, resumeTime, false);
    } else if (videoId) {
      updateVideoProgress(videoId, 1, false);
    }
  }, [videoId]);

  // Track current time for potential PiP
  useEffect(() => {
    currentTimeRef.current = resumeTime;
  }, [resumeTime]);

  // Listen for YouTube player updates via postMessage (time + player state)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        const info = data?.info;
        if (info && typeof info.duration === 'number' && info.duration > 0) {
          durationRef.current = info.duration;
        }
        // Current time — keep a ref for PiP handoff and bump state only when the
        // whole second changes (drives chapter highlighting without 60fps renders).
        if (info && typeof info.currentTime === 'number') {
          const secs = Math.floor(info.currentTime);
          if (secs !== currentTimeRef.current) {
            currentTimeRef.current = secs;
            setCurrentTime(secs);
          }
          // Early-advance ~5s before the end so YouTube's end-screen / Subscribe
          // cards never get a chance to render. Fires once per video.
          const dur = durationRef.current;
          if (dur > 30 && secs >= dur - 5 && !advanceFiredRef.current) {
            advanceFiredRef.current = true;
            handleEndedRef.current?.();
          }
        }
        // Player state — 0 (ENDED) is the fallback trigger if early-advance didn't fire.
        const state =
          info && typeof info.playerState === 'number'
            ? info.playerState
            : data?.event === 'onStateChange' && typeof info === 'number'
            ? info
            : undefined;
        if (typeof state === 'number') {
          const prev = playerStateRef.current;
          playerStateRef.current = state;
          if (state === 0 && prev !== 0 && !advanceFiredRef.current) {
            advanceFiredRef.current = true;
            handleEndedRef.current?.();
          }
        }
      } catch {
        // Not a JSON message, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send a command to the YouTube iframe (enablejsapi=1).
  const postToPlayer = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
    );
  }, []);

  // Jump to a chapter timestamp and keep playing.
  const seekTo = useCallback(
    (seconds: number) => {
      postToPlayer('seekTo', [seconds, true]);
      postToPlayer('playVideo');
      currentTimeRef.current = Math.floor(seconds);
      setCurrentTime(Math.floor(seconds));
    },
    [postToPlayer]
  );

  // The chapter currently playing = last chapter whose start <= currentTime.
  const activeChapterIndex = useMemo(() => {
    const chapters = video?.chapters;
    if (!chapters || chapters.length === 0) return -1;
    let idx = 0;
    for (let i = 0; i < chapters.length; i++) {
      if (currentTime >= chapters[i].start) idx = i;
    }
    return idx;
  }, [video, currentTime]);

  // ---- Binge context: where did we come from, and what plays next? ----
  const courseParam = searchParams.get('course');
  const playlistParam = searchParams.get('playlist');
  const queueParam = searchParams.get('queue');

  // The ordered list of video IDs we're bingeing through, from the URL context.
  const contextIds = useMemo<string[]>(() => {
    if (queueParam) return queueParam.split(',').filter(Boolean);
    if (courseParam) {
      const c = COURSES.find(c => c.id === courseParam);
      return c ? getCourseVideoIds(c) : [];
    }
    if (playlistParam) {
      const initial = INITIAL_PLAYLISTS.find(p => p.id === playlistParam);
      if (initial) return initial.videoIds;
      const userPl = getPlaylist(playlistParam);
      return userPl ? userPl.videoIds : [];
    }
    return [];
  }, [queueParam, courseParam, playlistParam, getPlaylist]);

  // Preserve the binge context when navigating to the next video.
  const contextQuery = courseParam
    ? `?course=${courseParam}`
    : playlistParam
    ? `?playlist=${playlistParam}`
    : queueParam
    ? `?queue=${queueParam}`
    : '';

  // Next video: the following item in the binge context, else the top related video.
  const nextVideo = useMemo(() => {
    if (contextIds.length && videoId) {
      const i = contextIds.indexOf(videoId);
      if (i >= 0 && i < contextIds.length - 1) {
        return INITIAL_VIDEOS.find(v => v.id === contextIds[i + 1]);
      }
      return undefined; // reached the end of the course/playlist/queue
    }
    return relatedVideos[0];
  }, [contextIds, videoId, relatedVideos]);

  const goToNext = useCallback(() => {
    if (nextVideo) navigate(`/watch/${nextVideo.id}${contextQuery}`);
  }, [nextVideo, contextQuery, navigate]);

  // Keep the ended-handler ref pointing at the latest closure (the postMessage
  // listener is mounted once, so it reads `next`/prefs through this ref).
  handleEndedRef.current = () => {
    if (videoId) markVideoCompleted(videoId);
    if (preferences.autoplayNext && nextVideo) {
      setCountdown(5);
      setUpNext(nextVideo);
    }
  };

  // Up-Next countdown → auto-advance, preserving binge context.
  useEffect(() => {
    if (!upNext) return;
    if (countdown <= 0) {
      navigate(`/watch/${upNext.id}${contextQuery}`);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [upNext, countdown, contextQuery, navigate]);

  // Clear any pending Up-Next card and reset end-of-video guards when the video changes.
  useEffect(() => {
    setUpNext(null);
    durationRef.current = 0;
    advanceFiredRef.current = false;
  }, [videoId]);


  // Handle watch from start
  const handleWatchFromStart = useCallback(() => {
    setWatchFromStart(true);
    if (videoId) {
      updateVideoProgress(videoId, 0, false);
    }
  }, [videoId, updateVideoProgress]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Auto-enable PiP when navigating away from the watch page (continue in mini player).
  // The full-page iframe is unmounting here, so only the PiP player remains — no double play.
  useEffect(() => {
    return () => {
      const currentVideo = videoRef.current;
      if (currentVideo) {
        enablePiPRef.current({
          videoId: currentVideo.id,
          embedUrl: currentVideo.embedUrl,
          title: currentVideo.title,
          expert: currentVideo.expert,
          thumbnail: currentVideo.thumbnail,
          duration: currentVideo.duration,
          startTime: currentTimeRef.current || 0,
          isLive: false,
        });
      }
    };
    // Run cleanup only on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Session not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (videoId) {
      markVideoCompleted(videoId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Video Player Section */}
      <div className="pt-14 lg:pt-0 bg-black relative">
        {/* Video Player */}
        <div className="relative w-full max-w-6xl mx-auto aspect-video bg-black lg:mt-6 lg:rounded-2xl lg:overflow-hidden lg:border lg:border-white/10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {videoError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A24]">
              <div className="text-center px-6">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Video Unavailable</h3>
                <p className="text-[#9CA3AF] mb-6 max-w-md">
                  This video cannot be played. It may have been removed or embedding is disabled.
                </p>
                <div className="flex items-center justify-center gap-3">
                  {relatedVideos.length > 0 && (
                    <button
                      onClick={handleSkipToNext}
                      className="flex items-center gap-2 px-6 py-3 bg-[#c9a227] text-black font-semibold rounded-xl hover:bg-[#d4af37] transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                      Watch Next
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/topics')}
                    className="px-6 py-3 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
                  >
                    Browse Videos
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              key={`${videoId}-${watchFromStart}-${errorRetryCount}`}
              src={`${video.embedUrl}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&start=${resumeTime}&enablejsapi=1&origin=${window.location.origin}`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handleVideoError}
            />
          )}

          {/* Up-Next card — shown when the video ends and autoplay-next is on */}
          {upNext && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm px-6">
              <div className="w-full max-w-md text-center">
                <p className="text-xs uppercase tracking-wider text-[#c9a227] mb-3">
                  Up next in {countdown}s
                </p>
                <div className="flex items-center gap-4 bg-[#13131A] border border-white/10 rounded-xl p-3 text-left">
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-[#1E1E2E] flex-shrink-0">
                    <img src={upNext.thumbnail} alt={upNext.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white text-sm font-semibold line-clamp-2">{upNext.title}</h4>
                    <p className="text-[#6B7280] text-xs mt-1">{upNext.expert}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/watch/${upNext.id}${contextQuery}`)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a227] text-black font-semibold rounded-xl hover:bg-[#d4af37] transition-colors"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Play now
                  </button>
                  <button
                    onClick={() => setUpNext(null)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2E2E3E] text-white font-medium rounded-xl hover:bg-[#3E3E4E] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {video.title}
              </h1>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                {contextIds.length > 0 && nextVideo && (
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-[#c9a227] text-black hover:bg-[#d4af37] transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    Next
                  </button>
                )}
                <button
                  onClick={() => setAutoplayNext(!preferences.autoplayNext)}
                  role="switch"
                  aria-checked={preferences.autoplayNext}
                  title="Autoplay next video"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-[#1E1E2E] text-white hover:bg-[#2E2E3E] transition-colors"
                >
                  <span
                    className={`relative inline-block w-9 h-5 rounded-full transition-colors ${
                      preferences.autoplayNext ? 'bg-[#c9a227]' : 'bg-[#4B4B5A]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        preferences.autoplayNext ? 'translate-x-4' : ''
                      }`}
                    />
                  </span>
                  Autoplay
                </button>
                {hasProgress && !watchFromStart && (
                  <button
                    onClick={handleWatchFromStart}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-[#1E1E2E] text-white hover:bg-[#2E2E3E] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Watch from Start
                  </button>
                )}
                <button
                  onClick={() => toggleSaveVideo(video.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    saved
                      ? 'bg-[#c9a227] text-white'
                      : 'bg-[#1E1E2E] text-white hover:bg-[#2E2E3E]'
                  }`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {saved ? 'Saved' : 'Save'}
                </button>
                {!progress?.completed && (
                  <button
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-[#1E1E2E] text-white hover:bg-[#2E2E3E] transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Crushed
                  </button>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{video.expert}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(video.duration)}</span>
              </div>
              {progress?.completed && (
                <div className="flex items-center gap-2 text-[#c9a227]">
                  <Check className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {video.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#1E1E2E] text-[#9CA3AF] rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Course Link */}
            {course && (
              <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-4 mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: course.color }}
                  >
                    {course.iconEmoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#6B7280] text-sm">Part of</p>
                    <h3 className="text-white font-semibold">{course.title}</h3>
                  </div>
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="px-4 py-2 bg-[#1E1E2E] text-white rounded-xl font-medium hover:bg-[#2E2E3E] transition-colors"
                  >
                    View Playbook
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Chapters + Related Videos */}
          <div className="lg:w-80">
            {video.chapters && video.chapters.length > 0 && (
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                  <ListVideo className="w-5 h-5" /> Chapters
                </h3>
                <div className="space-y-1">
                  {video.chapters.map((chapter, i) => {
                    const isActive = i === activeChapterIndex;
                    return (
                      <button
                        key={`${chapter.start}-${chapter.title}`}
                        onClick={() => seekTo(chapter.start)}
                        className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#c9a227]/15 border border-[#c9a227]/40'
                            : 'hover:bg-[#1E1E2E] border border-transparent'
                        }`}
                      >
                        <span
                          className={`text-xs font-mono tabular-nums shrink-0 ${
                            isActive ? 'text-[#c9a227]' : 'text-[#6B7280]'
                          }`}
                        >
                          {formatDuration(chapter.start)}
                        </span>
                        <span
                          className={`text-sm line-clamp-2 ${
                            isActive ? 'text-white font-medium' : 'text-[#9CA3AF]'
                          }`}
                        >
                          {chapter.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <h3 className="text-lg font-semibold text-white mb-4">Next Moves</h3>
            <div className="space-y-4">
              {relatedVideos.map(v => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/watch/${v.id}`)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-[#1E1E2E] flex-shrink-0">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-white">
                      {formatDuration(v.duration)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#c9a227] transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-[#6B7280] text-xs mt-1">{v.expert}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
