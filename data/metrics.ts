/**
 * Deterministic, seeded view counts for curated videos.
 *
 * Design brief slide 18: "I like on TED how the view counts carry over from YouTube."
 * We don't pull live YouTube stats here, so we derive a stable, plausible number from
 * the video id — same id always yields the same count (no flicker across renders).
 */
export const getViewCount = (videoId: string): number => {
  let h = 0;
  for (let i = 0; i < videoId.length; i++) {
    h = (h * 31 + videoId.charCodeAt(i)) >>> 0;
  }
  // Long-tailed range ~20K .. ~9.5M
  return 20_000 + (h % 9_480_000);
};

/** Compact view-count label, e.g. 1.2M, 940K, 8.3M. */
export const formatViews = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return String(n);
};

/** Convenience: formatted views for a video id, e.g. "1.2M views". */
export const viewsLabel = (videoId: string): string => `${formatViews(getViewCount(videoId))} views`;
