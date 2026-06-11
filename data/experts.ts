import { Video } from '../types';

/**
 * Curated expert profiles for the MasterClass-style hero pages (design brief slide 14:
 * "hero pages for the people with the most advice on the site for founders").
 *
 * Only people in this map appear in the Experts catalogue — keeping it to the
 * "biggest names & faces", not raw channel handles. Each is matched to the videos
 * whose `expert` field equals the key.
 *
 * `image` is a real portrait headshot (verified Wikimedia Commons). When omitted,
 * the UI renders a clean initials avatar (never a stretched video thumbnail).
 */
export interface ExpertProfile {
  role: string;
  bio: string;
  image?: string;
}

export const EXPERT_PROFILES: Record<string, ExpertProfile> = {
  'Paul Graham': {
    role: 'Co-founder, Y Combinator',
    bio: 'Co-founded Y Combinator and shaped how a generation of founders thinks about startups, essays, and building things people want.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Paulgraham_240x320.jpg',
  },
  'Sam Altman': {
    role: 'Former President, Y Combinator · CEO, OpenAI',
    bio: 'A clear-eyed voice on ambition, focus, and building enduring companies — from leading YC to running OpenAI.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Meeting_with_Masayoshi_Son_and_Sam_Altman_%28February_3%2C_2025%29_%283x4_cropped_on_Altman%29.jpg',
  },
  'Naval Ravikant': {
    role: 'Founder, AngelList',
    bio: 'Investor and philosopher on wealth, leverage, and the long game of building — and one of the clearest thinkers in tech.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Naval_Ravikant_%28cropped%29.jpg',
  },
  'Peter Thiel': {
    role: 'Co-founder, PayPal & Palantir',
    bio: 'Contrarian thinker on monopolies, competition, and going from zero to one.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Peter_Thiel_by_Gage_Skidmore.jpg/500px-Peter_Thiel_by_Gage_Skidmore.jpg',
  },
  'Michael Seibel': {
    role: 'Co-founder, Twitch · Partner, Y Combinator',
    bio: 'Plain-spoken guidance on MVPs, talking to users, and getting your first real traction.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/TechCrunch_Disrupt_San_Francisco_2019_-_Day_1_%2848834157928%29.jpg/500px-TechCrunch_Disrupt_San_Francisco_2019_-_Day_1_%2848834157928%29.jpg',
  },
  'Kevin Hale': {
    role: 'Co-founder, Wufoo · Partner, Y Combinator',
    bio: 'Master of pitching, product design, and the mechanics of how startups actually grow.',
  },
  'Gustaf Alstromer': {
    role: 'Growth, Airbnb · Partner, Y Combinator',
    bio: 'Teaches the science of acquisition, retention, and real, durable growth.',
  },
  'Dalton Caldwell': {
    role: 'Managing Director, Y Combinator',
    bio: 'Sharp advice on finding ideas, avoiding tar pits, and staying ruthlessly focused.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Dalton_Caldwell_%2843627374955_cropped%29.jpg/330px-Dalton_Caldwell_%2843627374955_cropped%29.jpg',
  },
  'Reid Hoffman': {
    role: 'Co-founder, LinkedIn',
    bio: 'The blitzscaling playbook for networks, marketplaces, and scaling faster than feels comfortable.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/2022_Reid_Hoffman_%28cropped%29.jpg/500px-2022_Reid_Hoffman_%28cropped%29.jpg',
  },
  'Mark Cuban': {
    role: 'Entrepreneur & Investor',
    bio: 'Blunt, practical lessons on sales, hustle, and owning your outcomes.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/P20260518JB-0644_%283x4_cropped_on_Cuban%29.jpg/500px-P20260518JB-0644_%283x4_cropped_on_Cuban%29.jpg',
  },
  'Alex Hormozi': {
    role: 'Founder, Acquisition.com',
    bio: 'Built and sold multiple companies. Obsessive frameworks for offers, sales, and scaling profit.',
  },
  'Gary Vaynerchuk': {
    role: 'Chairman, VaynerX',
    bio: 'Built a media empire from a family wine shop. Relentless on attention, brand, and doing the work.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Gary_Vaynerchuk_public_domain.jpg/500px-Gary_Vaynerchuk_public_domain.jpg',
  },
  'Jeff Bezos': {
    role: 'Founder, Amazon',
    bio: 'Long-term thinking, customer obsession, and disagree-and-commit at planetary scale.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg/330px-260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg',
  },
  'Elon Musk': {
    role: 'Founder, Tesla & SpaceX',
    bio: 'First-principles thinking and absurd ambition applied to the hardest problems.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/330px-Elon_Musk_-_54820081119_%28cropped%29.jpg',
  },
  'Simon Sinek': {
    role: 'Author, Start With Why',
    bio: 'Why the greatest leaders and companies start with purpose — and how to find yours.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Simon_Sinek_speaks_to_I_MIG_Marines_%282%29_%28cropped%29.jpg/330px-Simon_Sinek_speaks_to_I_MIG_Marines_%282%29_%28cropped%29.jpg',
  },
  'Pieter Levels': {
    role: 'Indie Founder, Nomad List',
    bio: 'Living proof you can build solo and ship fast — dozens of profitable products, no team required.',
  },
  'Marty Cagan': {
    role: 'Author, Inspired · SVPG',
    bio: 'The definitive voice on modern product management and continuous discovery.',
  },
  'Andrej Karpathy': {
    role: 'Founding member, OpenAI · ex-Tesla AI',
    bio: 'Deep, remarkably accessible thinking on AI and what it means for builders.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Andrej_Karpathy%2C_OpenAI.png/330px-Andrej_Karpathy%2C_OpenAI.png',
  },
  'Steve Jobs': {
    role: 'Co-founder, Apple',
    bio: 'Taste, focus, and the relentless pursuit of insanely great products.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Steve_Jobs_Headshot_2010_%28cropped_4%29.jpg/330px-Steve_Jobs_Headshot_2010_%28cropped_4%29.jpg',
  },
};

export interface Expert {
  name: string;
  slug: string;
  role: string;
  bio: string;
  image: string | null;
  videos: Video[];
}

export const slugify = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Build the curated expert list from videos, sorted by how much they teach. */
export const getExperts = (videos: Video[]): Expert[] => {
  const byExpert = new Map<string, Video[]>();
  for (const v of videos) {
    if (!v.expert) continue;
    const arr = byExpert.get(v.expert) ?? [];
    arr.push(v);
    byExpert.set(v.expert, arr);
  }

  const experts: Expert[] = [];
  for (const [name, profile] of Object.entries(EXPERT_PROFILES)) {
    const vids = byExpert.get(name) ?? [];
    if (vids.length === 0) continue;
    experts.push({
      name,
      slug: slugify(name),
      role: profile.role,
      bio: profile.bio,
      image: profile.image ?? null,
      videos: vids,
    });
  }
  return experts.sort((a, b) => b.videos.length - a.videos.length);
};

export const getExpertBySlug = (slug: string, videos: Video[]): Expert | undefined =>
  getExperts(videos).find(e => e.slug === slug);
