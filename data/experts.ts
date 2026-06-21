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
export interface ExpertLink {
  label: string;
  url: string;
}

export interface ExpertProfile {
  role: string;
  bio: string;
  image?: string;
  /** Short hook shown under the name on the hero page. */
  tagline?: string;
  /** 3–5 topics this person is known for — rendered as chips. */
  expertise?: string[];
  /** Optional outbound links (personal site, X, talk source). */
  links?: ExpertLink[];
}

export const EXPERT_PROFILES: Record<string, ExpertProfile> = {
  'Paul Graham': {
    role: 'Co-founder, Y Combinator',
    tagline: 'The essayist who taught a generation to make something people want.',
    bio: 'Co-founded Y Combinator and shaped how a generation of founders thinks about startups, essays, and building things people want. His writing is the closest thing the startup world has to a canon.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Paulgraham_240x320.jpg',
    expertise: ['Startup ideas', 'Essays', 'Early-stage', 'Y Combinator'],
    links: [{ label: 'Essays', url: 'https://www.paulgraham.com/articles.html' }],
  },
  'Sam Altman': {
    role: 'Former President, Y Combinator · CEO, OpenAI',
    tagline: 'On ambition, focus, and building companies that endure.',
    bio: 'A clear-eyed voice on ambition, focus, and building enduring companies — from leading Y Combinator through its biggest years to running OpenAI at the frontier of the AI era.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Meeting_with_Masayoshi_Son_and_Sam_Altman_%28February_3%2C_2025%29_%283x4_cropped_on_Altman%29.jpg',
    expertise: ['Ambition', 'Focus', 'Scaling', 'AI'],
    links: [{ label: 'Blog', url: 'https://blog.samaltman.com/' }],
  },
  'Naval Ravikant': {
    role: 'Founder, AngelList',
    tagline: 'Wealth, leverage, and the long game of building.',
    bio: 'Investor and philosopher on wealth, leverage, and the long game of building — and one of the clearest thinkers in tech on how to get rich without getting lucky.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Naval_Ravikant_%28cropped%29.jpg',
    expertise: ['Wealth', 'Leverage', 'Angel investing', 'Mental models'],
    links: [{ label: 'X', url: 'https://x.com/naval' }],
  },
  'Peter Thiel': {
    role: 'Co-founder, PayPal & Palantir',
    tagline: 'Competition is for losers — build a monopoly.',
    bio: 'Contrarian thinker on monopolies, competition, and going from zero to one. He argues the best companies escape competition entirely by creating something genuinely new.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Peter_Thiel_by_Gage_Skidmore.jpg/500px-Peter_Thiel_by_Gage_Skidmore.jpg',
    expertise: ['Monopolies', 'Zero to one', 'Contrarian thinking', 'Tech strategy'],
  },
  'Michael Seibel': {
    role: 'Co-founder, Twitch · Partner, Y Combinator',
    tagline: 'Build something, talk to users, get traction.',
    bio: 'Plain-spoken guidance on MVPs, talking to users, and getting your first real traction. He has advised thousands of YC founders on the unglamorous work that actually moves the needle.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/TechCrunch_Disrupt_San_Francisco_2019_-_Day_1_%2848834157928%29.jpg/500px-TechCrunch_Disrupt_San_Francisco_2019_-_Day_1_%2848834157928%29.jpg',
    expertise: ['MVPs', 'Talking to users', 'Early traction', 'Pitching'],
  },
  'Kevin Hale': {
    role: 'Co-founder, Wufoo · Partner, Y Combinator',
    image: '/experts/kevin-hale.jpg',
    tagline: 'The mechanics of pitching and products people love.',
    bio: 'Master of pitching, product design, and the mechanics of how startups actually grow. He built Wufoo into a beloved, capital-efficient product and now teaches founders how to do the same.',
    expertise: ['Pitching', 'Product design', 'Conversion', 'Fundraising'],
  },
  'Gustaf Alstromer': {
    role: 'Growth, Airbnb · Partner, Y Combinator',
    tagline: 'The science of acquisition, retention, and durable growth.',
    bio: 'Teaches the science of acquisition, retention, and real, durable growth. He led growth at Airbnb and now helps founders separate growth that compounds from vanity metrics that fade.',
    image: '/experts/gustaf-alstromer.jpg',
    expertise: ['Growth', 'Acquisition', 'Retention', 'Experimentation'],
  },
  'Dalton Caldwell': {
    role: 'Managing Director, Y Combinator',
    tagline: 'Find real ideas. Avoid tar pits. Stay focused.',
    bio: 'Sharp advice on finding ideas, avoiding tar pits, and staying ruthlessly focused. His talks on why founders fail are required watching for anyone choosing what to build.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Dalton_Caldwell_%2843627374955_cropped%29.jpg/330px-Dalton_Caldwell_%2843627374955_cropped%29.jpg',
    expertise: ['Startup ideas', 'Tar pit ideas', 'Focus', 'Y Combinator'],
  },
  'Reid Hoffman': {
    role: 'Co-founder, LinkedIn',
    tagline: 'Blitzscaling — grow faster than feels comfortable.',
    bio: 'The blitzscaling playbook for networks, marketplaces, and scaling faster than feels comfortable. He built LinkedIn and backed a generation of category-defining companies as an investor.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/2022_Reid_Hoffman_%28cropped%29.jpg/500px-2022_Reid_Hoffman_%28cropped%29.jpg',
    expertise: ['Blitzscaling', 'Networks', 'Marketplaces', 'Investing'],
  },
  'Mark Cuban': {
    role: 'Entrepreneur & Investor',
    tagline: 'Sell, hustle, and own your outcomes.',
    bio: 'Blunt, practical lessons on sales, hustle, and owning your outcomes. From selling software door-to-door to owning an NBA team, he is relentless about doing the work nobody else will.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/P20260518JB-0644_%283x4_cropped_on_Cuban%29.jpg/500px-P20260518JB-0644_%283x4_cropped_on_Cuban%29.jpg',
    expertise: ['Sales', 'Hustle', 'Negotiation', 'Investing'],
  },
  'Alex Hormozi': {
    role: 'Founder, Acquisition.com',
    tagline: 'Make offers so good people feel stupid saying no.',
    bio: 'Built and sold multiple companies and now invests through Acquisition.com. Obsessive, no-fluff frameworks for crafting offers, closing sales, and scaling profit predictably.',
    image: '/experts/alex-hormozi.png',
    expertise: ['Offers', 'Sales', 'Scaling profit', 'Acquisitions'],
    links: [{ label: 'Acquisition.com', url: 'https://www.acquisition.com/' }],
  },
  'Gary Vaynerchuk': {
    role: 'Chairman, VaynerX',
    tagline: 'Attention is the asset. Do the work.',
    bio: 'Built a media empire from a family wine shop. Relentless on attention, brand, and doing the unsexy work daily — and one of the loudest advocates for meeting customers where they already are.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Gary_Vaynerchuk_public_domain.jpg/500px-Gary_Vaynerchuk_public_domain.jpg',
    expertise: ['Attention', 'Brand', 'Social media', 'Marketing'],
  },
  'Jeff Bezos': {
    role: 'Founder, Amazon',
    tagline: 'Customer obsession and long-term thinking, at scale.',
    bio: 'Long-term thinking, customer obsession, and disagree-and-commit at planetary scale. He turned an online bookstore into one of history’s most relentless operating machines.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg/330px-260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg',
    expertise: ['Customer obsession', 'Long-term thinking', 'Operations', 'Decision-making'],
  },
  'Elon Musk': {
    role: 'Founder, Tesla & SpaceX',
    tagline: 'First principles, applied to the hardest problems.',
    bio: 'First-principles thinking and absurd ambition applied to the hardest problems in transport, energy, and space — reasoning up from physics rather than down from analogy.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/330px-Elon_Musk_-_54820081119_%28cropped%29.jpg',
    expertise: ['First principles', 'Hard tech', 'Manufacturing', 'Ambition'],
  },
  'Simon Sinek': {
    role: 'Author, Start With Why',
    tagline: 'Great companies start with why.',
    bio: 'Why the greatest leaders and companies start with purpose — and how to find yours. His framing of vision and trust has reshaped how founders think about leadership and culture.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Simon_Sinek_speaks_to_I_MIG_Marines_%282%29_%28cropped%29.jpg/330px-Simon_Sinek_speaks_to_I_MIG_Marines_%282%29_%28cropped%29.jpg',
    expertise: ['Purpose', 'Leadership', 'Vision', 'Culture'],
  },
  'Pieter Levels': {
    role: 'Indie Founder, Nomad List',
    tagline: 'Build solo, ship fast, stay profitable.',
    bio: 'Living proof you can build solo and ship fast — dozens of profitable products, no team, no funding. The patron saint of indie hackers who ship in public and let revenue, not investors, decide.',
    image: '/experts/pieter-levels.jpg',
    expertise: ['Indie hacking', 'Shipping fast', 'Bootstrapping', 'Build in public'],
    links: [{ label: 'levels.io', url: 'https://levels.io/' }],
  },
  'Marty Cagan': {
    role: 'Author, Inspired · SVPG',
    image: '/experts/marty-cagan.jpg',
    tagline: 'How the best product teams actually work.',
    bio: 'The definitive voice on modern product management and continuous discovery. Through SVPG and his books Inspired and Empowered, he defined how strong product teams discover and deliver value.',
    expertise: ['Product management', 'Discovery', 'Product teams', 'Roadmaps'],
    links: [{ label: 'SVPG', url: 'https://www.svpg.com/' }],
  },
  'Andrej Karpathy': {
    role: 'Founding member, OpenAI · ex-Tesla AI',
    tagline: 'Making deep learning legible to builders.',
    bio: 'Deep, remarkably accessible thinking on AI and what it means for builders. A founding member of OpenAI and former head of AI at Tesla, he is famous for teaching neural nets from first principles.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Andrej_Karpathy%2C_OpenAI.png/330px-Andrej_Karpathy%2C_OpenAI.png',
    expertise: ['AI', 'Deep learning', 'LLMs', 'Building with AI'],
    links: [{ label: 'YouTube', url: 'https://www.youtube.com/@AndrejKarpathy' }],
  },
  'Steve Jobs': {
    role: 'Co-founder, Apple',
    tagline: 'Taste, focus, and insanely great products.',
    bio: 'Taste, focus, and the relentless pursuit of insanely great products. His belief that design is how it works — not just how it looks — still defines how the best founders build.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Steve_Jobs_Headshot_2010_%28cropped_4%29.jpg/330px-Steve_Jobs_Headshot_2010_%28cropped_4%29.jpg',
    expertise: ['Product taste', 'Focus', 'Design', 'Storytelling'],
  },
};

export interface Expert {
  name: string;
  slug: string;
  role: string;
  bio: string;
  image: string | null;
  tagline?: string;
  expertise?: string[];
  links?: ExpertLink[];
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
      tagline: profile.tagline,
      expertise: profile.expertise,
      links: profile.links,
      videos: vids,
    });
  }
  return experts.sort((a, b) => b.videos.length - a.videos.length);
};

export const getExpertBySlug = (slug: string, videos: Video[]): Expert | undefined =>
  getExperts(videos).find(e => e.slug === slug);
