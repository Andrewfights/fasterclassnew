import { Video } from '../types';

/**
 * Curated expert profiles for the MasterClass-style hero pages (design brief slide 14:
 * "hero pages for the people with the most advice on the site for founders").
 *
 * Only people in this map appear in the Experts catalogue — keeping it to the
 * "biggest names & faces", not raw channel handles. Each is matched to the videos
 * whose `expert` field equals the key, so pages always reflect real curated content.
 *
 * `image` is an optional portrait; when omitted we fall back to the expert's first
 * video thumbnail so every page has art without hardcoding fragile external URLs.
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
    image: 'https://img.youtube.com/vi/ii1jcLg-eIQ/hqdefault.jpg',
  },
  'Sam Altman': {
    role: 'Former President, Y Combinator · CEO, OpenAI',
    bio: 'A clear-eyed voice on ambition, focus, and building enduring companies — from leading YC to running OpenAI.',
    image: 'https://img.youtube.com/vi/0lJKucu6HJc/hqdefault.jpg',
  },
  'Naval Ravikant': {
    role: 'Founder, AngelList',
    bio: 'Investor and philosopher on wealth, leverage, and the long game of building — and one of the clearest thinkers in tech.',
    image: 'https://img.youtube.com/vi/HiYo14wylQw/hqdefault.jpg',
  },
  'Peter Thiel': {
    role: 'Co-founder, PayPal & Palantir',
    bio: 'Contrarian thinker on monopolies, competition, and going from zero to one.',
    image: 'https://img.youtube.com/vi/rFV7wdEX-Mo/hqdefault.jpg',
  },
  'Michael Seibel': {
    role: 'Co-founder, Twitch · Partner, Y Combinator',
    bio: 'Plain-spoken guidance on MVPs, talking to users, and getting your first real traction.',
    image: 'https://img.youtube.com/vi/C27RVio2rOs/hqdefault.jpg',
  },
  'Kevin Hale': {
    role: 'Co-founder, Wufoo · Partner, Y Combinator',
    bio: 'Master of pitching, product design, and the mechanics of how startups actually grow.',
    image: 'https://img.youtube.com/vi/DOtCl5PU8F0/hqdefault.jpg',
  },
  'Gustaf Alstromer': {
    role: 'Growth, Airbnb · Partner, Y Combinator',
    bio: 'Teaches the science of acquisition, retention, and real, durable growth.',
    image: 'https://img.youtube.com/vi/URiIsrdplbo/hqdefault.jpg',
  },
  'Dalton Caldwell': {
    role: 'Managing Director, Y Combinator',
    bio: 'Sharp advice on finding ideas, avoiding tar pits, and staying ruthlessly focused.',
    image: 'https://img.youtube.com/vi/8pNxKX1SUGE/hqdefault.jpg',
  },
  'Reid Hoffman': {
    role: 'Co-founder, LinkedIn',
    bio: 'The blitzscaling playbook for networks, marketplaces, and scaling faster than feels comfortable.',
  },
  'Mark Cuban': {
    role: 'Entrepreneur & Investor',
    bio: 'Blunt, practical lessons on sales, hustle, and owning your outcomes.',
  },
  'Alex Hormozi': {
    role: 'Founder, Acquisition.com',
    bio: 'Built and sold multiple companies. Obsessive frameworks for offers, sales, and scaling profit.',
  },
  'Gary Vaynerchuk': {
    role: 'Chairman, VaynerX',
    bio: 'Built a media empire from a family wine shop. Relentless on attention, brand, and doing the work.',
  },
  'Jeff Bezos': {
    role: 'Founder, Amazon',
    bio: 'Long-term thinking, customer obsession, and disagree-and-commit at planetary scale.',
  },
  'Elon Musk': {
    role: 'Founder, Tesla & SpaceX',
    bio: 'First-principles thinking and absurd ambition applied to the hardest problems.',
  },
  'Simon Sinek': {
    role: 'Author, Start With Why',
    bio: 'Why the greatest leaders and companies start with purpose — and how to find yours.',
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
  },
  'Steve Jobs': {
    role: 'Co-founder, Apple',
    bio: 'Taste, focus, and the relentless pursuit of insanely great products.',
  },
  'Y Combinator': {
    role: 'Startup Accelerator',
    bio: 'The accelerator that funded Airbnb, Stripe, and thousands more — and wrote the canon of early-stage advice.',
    image: 'https://img.youtube.com/vi/CBYhVcO4WgI/hqdefault.jpg',
  },
};

export interface Expert {
  name: string;
  slug: string;
  role: string;
  bio: string;
  image: string;
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
      image: profile.image ?? vids[0].thumbnail,
      videos: vids,
    });
  }
  return experts.sort((a, b) => b.videos.length - a.videos.length);
};

export const getExpertBySlug = (slug: string, videos: Video[]): Expert | undefined =>
  getExperts(videos).find(e => e.slug === slug);
