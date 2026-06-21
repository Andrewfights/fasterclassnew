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
    cover: '/art/topic-finding-your-idea.png',
  },
  {
    id: 'talking-to-users',
    title: 'Talking to Users',
    blurb: 'Validate demand the hard way — by getting out and listening to customers.',
    tags: ['validation', 'users', 'customers', 'pmf', 'discovery'],
    accent: '#22D3EE',
    cover: '/art/topic-talking-to-users.png',
  },
  {
    id: 'building-your-mvp',
    title: 'Building Your MVP',
    blurb: 'Ship the smallest thing that proves the point. Plan, build, launch, learn.',
    tags: ['mvp', 'product', 'programming', 'design', 'ui'],
    accent: '#34D399',
    cover: '/art/topic-building-your-mvp.png',
  },
  {
    id: 'inside-yc',
    title: 'Inside Y Combinator',
    blurb: 'The essential Startup School playbook — straight from YC partners and founders.',
    tags: ['y-combinator', 'startup'],
    accent: '#FF6B35',
    cover: '/art/topic-inside-yc.png',
  },
  {
    id: 'finding-a-cofounder',
    title: 'Finding a Cofounder',
    blurb: 'Pick the right partner, split equity fairly, and build a team that lasts.',
    tags: ['team', 'founders', 'networking', 'hiring', 'leadership'],
    accent: '#F472B6',
    cover: '/art/topic-finding-a-cofounder.png',
  },
  {
    id: 'your-pitch',
    title: 'Your Pitch & Fundraising',
    blurb: 'Tell a story investors believe — from first deck to a closed round.',
    tags: ['pitch', 'fundraising', 'vc', 'equity', 'bootstrapping'],
    accent: '#A78BFA',
    cover: '/art/topic-your-pitch.png',
  },
  {
    id: 'go-to-market',
    title: 'Go to Market',
    blurb: 'Find your first customers and a repeatable way to reach the next thousand.',
    tags: ['marketing', 'sales', 'branding', 'social-media', 'content'],
    accent: '#FB923C',
    cover: '/art/topic-go-to-market.png',
  },
  {
    id: 'growth-and-scaling',
    title: 'Growth & Scaling',
    blurb: 'Turn early traction into durable growth without breaking what works.',
    tags: ['growth', 'scaling', 'users', 'customers', 'execution'],
    accent: '#60A5FA',
    cover: '/art/topic-growth-and-scaling.png',
  },
  {
    id: 'hiring-and-team',
    title: 'Hiring & Team',
    blurb: 'Hire your first team, set culture early, and lead through the chaos.',
    tags: ['hiring', 'team', 'management', 'leadership'],
    accent: '#2DD4BF',
    cover: '/art/topic-hiring-and-team.png',
  },
  {
    id: 'founder-mindset',
    title: 'Founder Mindset',
    blurb: 'Resilience, focus, and the timeless wisdom that keeps founders in the game.',
    tags: ['mindset', 'motivation', 'philosophy', 'purpose', 'inspiration', 'hustle', 'entrepreneur'],
    accent: '#F59E0B',
    cover: '/art/topic-founder-mindset.png',
  },
  {
    id: 'ai-and-tech',
    title: 'AI & Tech',
    blurb: 'Build with the latest — AI, infrastructure, and the tools shaping startups.',
    tags: ['ai', 'llm', 'openai', 'tech', 'programming'],
    accent: '#818CF8',
    cover: '/art/topic-ai-and-tech.png',
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
