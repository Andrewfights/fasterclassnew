import { Video } from '../types';

/**
 * Curated "founder advice" topics for the premium catalogue.
 * Hand-picked (not auto-generated from raw tags) to match the design brief:
 * "organize by topics only", "premium", "Finding a Cofounder / Your Pitch / Go to Market".
 * Each topic matches videos whose tags intersect `tags`.
 */
export interface FounderTopic {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  accent: string; // hex accent color
  cover: string;  // cover image URL
}

export const FOUNDER_TOPICS: FounderTopic[] = [
  {
    id: 'finding-your-idea',
    title: 'Finding Your Idea',
    blurb: 'Spot real problems worth solving and pressure-test them before you build.',
    tags: ['ideas', 'validation', 'discovery', 'thinking'],
    accent: '#FACC15',
    cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200',
  },
  {
    id: 'talking-to-users',
    title: 'Talking to Users',
    blurb: 'Validate demand the hard way — by getting out and listening to customers.',
    tags: ['validation', 'users', 'customers', 'pmf', 'discovery'],
    accent: '#22D3EE',
    cover: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200',
  },
  {
    id: 'building-your-mvp',
    title: 'Building Your MVP',
    blurb: 'Ship the smallest thing that proves the point. Plan, build, launch, learn.',
    tags: ['mvp', 'product', 'programming', 'design', 'ui'],
    accent: '#34D399',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200',
  },
  {
    id: 'finding-a-cofounder',
    title: 'Finding a Cofounder',
    blurb: 'Pick the right partner, split equity fairly, and build a team that lasts.',
    tags: ['team', 'founders', 'networking', 'hiring', 'leadership'],
    accent: '#F472B6',
    cover: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200',
  },
  {
    id: 'your-pitch',
    title: 'Your Pitch & Fundraising',
    blurb: 'Tell a story investors believe — from first deck to a closed round.',
    tags: ['pitch', 'fundraising', 'vc', 'equity', 'bootstrapping'],
    accent: '#A78BFA',
    cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200',
  },
  {
    id: 'go-to-market',
    title: 'Go to Market',
    blurb: 'Find your first customers and a repeatable way to reach the next thousand.',
    tags: ['marketing', 'sales', 'branding', 'social-media', 'content'],
    accent: '#FB923C',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200',
  },
  {
    id: 'growth-and-scaling',
    title: 'Growth & Scaling',
    blurb: 'Turn early traction into durable growth without breaking what works.',
    tags: ['growth', 'scaling', 'users', 'customers', 'execution'],
    accent: '#60A5FA',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200',
  },
  {
    id: 'hiring-and-team',
    title: 'Hiring & Team',
    blurb: 'Hire your first team, set culture early, and lead through the chaos.',
    tags: ['hiring', 'team', 'management', 'leadership'],
    accent: '#2DD4BF',
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200',
  },
  {
    id: 'founder-mindset',
    title: 'Founder Mindset',
    blurb: 'Resilience, focus, and the timeless wisdom that keeps founders in the game.',
    tags: ['mindset', 'motivation', 'philosophy', 'purpose', 'inspiration', 'hustle'],
    accent: '#F59E0B',
    cover: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200',
  },
  {
    id: 'ai-and-tech',
    title: 'AI & Tech',
    blurb: 'Build with the latest — AI, infrastructure, and the tools shaping startups.',
    tags: ['ai', 'llm', 'openai', 'tech', 'programming'],
    accent: '#818CF8',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200',
  },
];

/** Does a video belong to a topic? (tag intersection) */
export const videoMatchesTopic = (video: Video, topic: FounderTopic): boolean =>
  video.tags.some(t => topic.tags.includes(t));

/** All videos for a topic (excludes vertical shorts by default). */
export const getTopicVideos = (topic: FounderTopic, videos: Video[]): Video[] =>
  videos.filter(v => !v.isVertical && videoMatchesTopic(v, topic));

export const getTopicById = (id: string): FounderTopic | undefined =>
  FOUNDER_TOPICS.find(t => t.id === id);
