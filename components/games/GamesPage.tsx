import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Gamepad2, Clock, ArrowRight, Lock,
  BookOpen, TrendingUp, DollarSign, Scale, Mic, Flame, Briefcase, Users, BarChart3, Rocket,
} from 'lucide-react';
import { TerminologySprint } from './TerminologySprint';
import { MetricMatch } from './MetricMatch';
import { ValuationGuesstimate } from './ValuationGuesstimate';
import { FoundersDilemma } from './FoundersDilemma';
import { PitchTank } from './PitchTank';
import { BurnRateBlitz } from './BurnRateBlitz';
import { DealNegotiator } from './DealNegotiator';

interface GameDef {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  category: 'quick' | 'challenge';
  duration: string;
}

const GAMES: GameDef[] = [
  { id: 'terminology-sprint', title: 'Terminology Sprint', description: 'Match startup terms to definitions as fast as you can.', icon: BookOpen, color: '#c9a227', category: 'quick', duration: '1 min' },
  { id: 'metric-match', title: 'Metric Match', description: 'Identify the right startup metrics from their values.', icon: TrendingUp, color: '#22C55E', category: 'quick', duration: '1 min' },
  { id: 'market-analyzer', title: 'Market Analyzer', description: 'Size up TAM, SAM, and SOM for startup ideas.', icon: BarChart3, color: '#14B8A6', category: 'quick', duration: '2 min' },
  { id: 'valuation-guesstimate', title: 'Valuation Guesstimate', description: 'Guess startup valuations from their profiles.', icon: DollarSign, color: '#22C55E', category: 'challenge', duration: '5 min' },
  { id: 'founders-dilemma', title: "Founder's Dilemma", description: 'Make tough calls in realistic startup scenarios.', icon: Scale, color: '#c9a227', category: 'challenge', duration: '5 min' },
  { id: 'pitch-tank', title: 'Pitch Tank', description: 'Build a compelling pitch and get scored on completeness.', icon: Mic, color: '#FF6B6B', category: 'challenge', duration: '10 min' },
  { id: 'burn-rate-blitz', title: 'Burn Rate Blitz', description: 'Manage runway with tough financial decisions.', icon: Flame, color: '#FF9600', category: 'challenge', duration: '3 min' },
  { id: 'deal-negotiator', title: 'Deal Negotiator', description: 'Shark-Tank style — negotiate funding terms with VCs.', icon: Briefcase, color: '#3B82F6', category: 'challenge', duration: '8 min' },
  { id: 'team-builder', title: 'Team Builder', description: 'Hire and manage your founding team wisely.', icon: Users, color: '#8B5CF6', category: 'challenge', duration: '5 min' },
  { id: 'product-pivot', title: 'Product Pivot', description: 'Know when to pivot vs. persevere with your idea.', icon: Rocket, color: '#EC4899', category: 'challenge', duration: '5 min' },
];

const COMING_SOON = [
  { title: 'Talk to Users', description: 'User interview simulator' },
  { title: 'Cap Table Crunch', description: 'Equity dilution calculator' },
  { title: 'Investor Pitch', description: 'Practice your 60-second pitch' },
  { title: 'Growth Hacker', description: 'Choose the right growth channels' },
  { title: 'Legal Landmines', description: 'Navigate startup legal issues' },
  { title: 'Competitor Analysis', description: 'Find weaknesses in competitors' },
];

// Only these games are actually implemented and playable.
const GAME_COMPONENTS: Record<string, React.FC> = {
  'terminology-sprint': TerminologySprint,
  'metric-match': MetricMatch,
  'valuation-guesstimate': ValuationGuesstimate,
  'founders-dilemma': FoundersDilemma,
  'pitch-tank': PitchTank,
  'burn-rate-blitz': BurnRateBlitz,
  'deal-negotiator': DealNegotiator,
};

const isPlayable = (id: string) => Boolean(GAME_COMPONENTS[id]);

const GameCard: React.FC<{ game: GameDef; onClick: () => void }> = ({ game, onClick }) => {
  const Icon = game.icon;
  return (
    <button
      onClick={onClick}
      className="group relative bg-[#13131A] rounded-2xl border border-white/10 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-200 text-left overflow-hidden"
    >
      {/* Generated artwork banner */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0D0D12]">
        <img
          src={`/art/game-${game.id}.png`}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13131A] via-[#13131A]/10 to-transparent" />
        <div
          className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: game.color + '33' }}
        >
          <Icon className="w-5 h-5" style={{ color: game.color }} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-white group-hover:text-[#c9a227] transition-colors">{game.title}</h3>
        <p className="text-sm text-[#9CA3AF] mt-1 line-clamp-2">{game.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: game.color + '18', color: game.color }}
          >
            <Clock className="w-3 h-3" /> {game.duration}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-white/40 group-hover:text-white transition-colors">
            Play <ArrowRight className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-0 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  );
};

export const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId?: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameId]);

  // Render a specific playable game
  if (gameId && GAME_COMPONENTS[gameId]) {
    const GameComponent = GAME_COMPONENTS[gameId];
    return <GameComponent />;
  }

  // Unimplemented game id → coming soon
  if (gameId) {
    const game = GAMES.find(g => g.id === gameId);
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-20 lg:pt-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-[#13131A] rounded-2xl border border-white/10 p-8">
            <div className="w-20 h-20 rounded-2xl bg-[#c9a227]/15 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-[#c9a227]" />
            </div>
            <h1 className="mc-heading text-2xl text-white mb-3">{game?.title || 'This game'} is coming soon</h1>
            <p className="text-[#9CA3AF] mb-6">We're still building this one. Check back soon.</p>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-[#c9a227] text-black font-semibold rounded-xl hover:bg-[#d4af37] transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quickGames = GAMES.filter(g => g.category === 'quick' && isPlayable(g.id));
  const challenges = GAMES.filter(g => g.category === 'challenge' && isPlayable(g.id));
  const upcomingGames = GAMES.filter(g => !isPlayable(g.id));

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mc-heading text-3xl md:text-4xl text-white">Games</h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-white/50">
            Sharpen your founder instincts — quick drills to lock in the fundamentals,
            and deeper challenges that simulate the real decisions.
          </p>
        </div>

        {/* Quick Drills */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#c9a227]" />
            <h2 className="text-lg font-semibold text-white">Quick Drills</h2>
            <span className="text-xs text-white/30">· under 2 minutes</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickGames.map(game => (
              <GameCard key={game.id} game={game} onClick={() => navigate(`/games/${game.id}`)} />
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-[#F5C518]" />
            <h2 className="text-lg font-semibold text-white">Challenges</h2>
            <span className="text-xs text-white/30">· scenario simulations</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map(game => (
              <GameCard key={game.id} game={game} onClick={() => navigate(`/games/${game.id}`)} />
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-white/40" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">Coming Soon</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...upcomingGames.map(g => ({ title: g.title, description: g.description })), ...COMING_SOON].map(game => (
              <div key={game.title} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <h3 className="text-sm font-medium text-white/70">{game.title}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{game.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GamesPage;
