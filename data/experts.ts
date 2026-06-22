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
  'Jeff Bezos': {
    role: 'Founder, Amazon',
    tagline: 'Customer obsession and long-term thinking, at scale.',
    bio: 'Long-term thinking, customer obsession, and disagree-and-commit at planetary scale. He turned an online bookstore into one of history’s most relentless operating machines.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg/330px-260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg',
    expertise: ['Customer obsession', 'Long-term thinking', 'Operations', 'Decision-making'],
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
  'Sara Blakely': {
    role: 'Founder, Spanx',
    tagline: 'Bootstrapped Spanx into a billion-dollar brand.',
    bio: 'Turned $5,000 in savings into Spanx — no outside funding, no MBA — and became the youngest self-made female billionaire. A masterclass in selling, resilience, and betting on yourself.',
    image: '/experts/sara-blakely.jpg',
    expertise: ['Bootstrapping', 'Sales', 'Resilience', 'Brand'],
  },
  'Jessica Livingston': {
    role: 'Co-founder, Y Combinator · Author, Founders at Work',
    tagline: 'Co-founded YC and chronicled how founders really start.',
    bio: 'Co-founded Y Combinator and, through Founders at Work, captured the messy early days of great companies. A sharp read on what separates founders who make it from those who don’t.',
    image: '/experts/jessica-livingston.jpg',
    expertise: ['Early-stage', 'Y Combinator', 'Founder stories', 'Female founders'],
  },
  'Daymond John': {
    role: 'Founder, FUBU · Shark, Shark Tank',
    tagline: 'The power of broke — brand, hustle, and the deal.',
    bio: 'Built FUBU from a Queens basement into a global brand on hustle and street smarts, then turned investor on Shark Tank. Relentless on branding, negotiation, and turning constraints into an edge.',
    image: '/experts/daymond-john.jpg',
    expertise: ['Branding', 'Hustle', 'Negotiation', 'Investing'],
  },
  'Codie Sanchez': {
    role: 'Founder, Contrarian Thinking',
    tagline: 'Build wealth by buying boring, profitable businesses.',
    bio: 'Ex-Wall Street investor who built a fortune buying unglamorous, cash-flowing “boring” businesses — and now teaches a generation to own assets instead of chasing hype.',
    image: '/experts/codie-sanchez.jpg',
    expertise: ['Acquisitions', 'Cash flow', 'Small business', 'Wealth'],
    links: [{ label: 'Contrarian Thinking', url: 'https://contrarianthinking.co/' }],
  },
  'Reshma Saujani': {
    role: 'Founder, Girls Who Code & Moms First',
    tagline: 'Teach bravery, not perfection.',
    bio: 'Founder of Girls Who Code and Moms First, and one of the most compelling voices on building movements. Her message — choose bravery over perfection — has reshaped how founders lead.',
    image: '/experts/reshma-saujani.jpg',
    expertise: ['Leadership', 'Bravery', 'Advocacy', 'Women in tech'],
  },
  'Kirsten Green': {
    role: 'Founder, Forerunner Ventures',
    tagline: 'The consumer-VC eye for what people will love next.',
    bio: 'Founder of Forerunner Ventures and one of the sharpest investors in consumer — early backer of Glossier, Warby Parker, and Bonobos. A clear lens on brand, commerce, and where culture is heading.',
    image: '/experts/kirsten-green.jpg',
    expertise: ['Venture capital', 'Consumer', 'Commerce', 'Investing'],
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
