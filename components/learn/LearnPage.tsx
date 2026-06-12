import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, PenTool, ArrowRight, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { GLOSSARY_TERMS } from '../../constants';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { FILL_BLANK_EXERCISES } from '../../data/fillblank';
import { useGamification } from '../../contexts/GamificationContext';

export const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useGamification();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = useMemo(() => {
    const flashcardsMastered = Object.values(progress.flashcardProgress || {})
      .filter(f => f.masteryLevel >= 4).length;
    const quizzesCompleted = progress.quizAttempts
      .filter(a => a.passed)
      .map(a => a.quizId)
      .filter((id, i, arr) => arr.indexOf(id) === i).length;
    const fillBlankCompleted = progress.learnedTerms?.length || 0;

    return {
      flashcards: { completed: flashcardsMastered, total: GLOSSARY_TERMS.length },
      quizzes: { completed: quizzesCompleted, total: INITIAL_QUIZZES.length },
      fillBlank: { completed: Math.min(fillBlankCompleted, FILL_BLANK_EXERCISES.length), total: FILL_BLANK_EXERCISES.length },
    };
  }, [progress]);

  // Recommend a sensible next exercise based on what's been done
  const recommendations = useMemo(() => {
    const recs: Array<{ title: string; description: string; path: string; priority: number }> = [];

    if (Object.keys(progress.flashcardProgress || {}).length === 0) {
      recs.push({ title: 'Start with Flashcards', description: 'Master the core startup terminology first', path: '/learn/flashcards', priority: 0 });
    } else {
      const needReview = Object.values(progress.flashcardProgress || {}).filter(p => p.masteryLevel < 3 && p.lastReviewed).length;
      if (needReview > 0) {
        recs.push({ title: `Review ${needReview} Flashcards`, description: "Cards you've seen but haven't mastered yet", path: '/learn/flashcards', priority: 1 });
      }
    }

    const passedQuizIds = new Set(progress.quizAttempts.filter(a => a.passed).map(a => a.quizId));
    const unpassed = INITIAL_QUIZZES.filter(q => !passedQuizIds.has(q.id));
    if (unpassed.length > 0) {
      const q = unpassed[0];
      recs.push({ title: q.title, description: `${q.questions.length} questions to test your knowledge`, path: `/learn/quiz/${q.id}`, priority: 2 });
    }

    if ((progress.learnedTerms?.length || 0) < FILL_BLANK_EXERCISES.length) {
      recs.push({ title: 'Fill-in-the-Blank Challenge', description: 'Complete sentences about startup concepts', path: '/learn/fill-blank', priority: 3 });
    }

    return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [progress]);

  // In-progress items (only shown when there's real progress)
  const continueLearning = useMemo(() => {
    const items: Array<{ type: string; title: string; description: string; path: string; progressPercent: number }> = [];
    const passedQuizIds = new Set(progress.quizAttempts.filter(a => a.passed).map(a => a.quizId));
    const attemptedQuizIds = new Set(progress.quizAttempts.map(a => a.quizId));

    attemptedQuizIds.forEach(quizId => {
      if (!passedQuizIds.has(quizId)) {
        const quiz = INITIAL_QUIZZES.find(q => q.id === quizId);
        if (quiz) {
          const bestScore = Math.max(...progress.quizAttempts.filter(a => a.quizId === quizId).map(a => a.score));
          items.push({ type: 'quiz', title: quiz.title, description: `Best score: ${bestScore}% — keep going`, path: `/learn/quiz/${quiz.id}`, progressPercent: bestScore });
        }
      }
    });

    const inProgressCards = Object.values(progress.flashcardProgress || {}).filter(p => p.masteryLevel > 0 && p.masteryLevel < 4).length;
    if (inProgressCards > 0) {
      items.push({ type: 'flashcards', title: 'Flashcards in Progress', description: `${inProgressCards} cards to review`, path: '/learn/flashcards', progressPercent: Math.round((stats.flashcards.completed / stats.flashcards.total) * 100) });
    }

    return items.slice(0, 3);
  }, [progress, stats]);

  const exerciseTypes = [
    { id: 'flashcards', title: 'Flashcards', description: 'Master startup terminology with spaced repetition.', icon: BookOpen, color: '#c9a227', unit: 'cards', stats: stats.flashcards, path: '/learn/flashcards' },
    { id: 'quizzes', title: 'Quizzes', description: 'Test your knowledge with focused course quizzes.', icon: HelpCircle, color: '#22C55E', unit: 'quizzes', stats: stats.quizzes, path: '/learn/quizzes' },
    { id: 'fillblank', title: 'Fill-in-the-Blank', description: 'Lock in key concepts by completing real sentences.', icon: PenTool, color: '#3B82F6', unit: 'exercises', stats: stats.fillBlank, path: '/learn/fill-blank' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mc-heading text-3xl md:text-4xl text-white">Learn</h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-white/50">
            Short, focused drills to lock in what you pick up from the experts — terminology,
            concepts, and the numbers that matter.
          </p>
        </div>

        {/* Exercise cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {exerciseTypes.map(ex => {
            const Icon = ex.icon;
            const pct = ex.stats.total > 0 ? Math.round((ex.stats.completed / ex.stats.total) * 100) : 0;
            const started = ex.stats.completed > 0;
            return (
              <button
                key={ex.id}
                onClick={() => navigate(ex.path)}
                className="group bg-[#13131A] rounded-2xl border border-white/10 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-200 p-6 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: ex.color + '22' }}>
                    <Icon className="w-6 h-6" style={{ color: ex.color }} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/30 -translate-x-1 group-hover:translate-x-0 group-hover:text-white transition-all" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-[#c9a227] transition-colors">{ex.title}</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">{ex.description}</p>
                {started ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6B7280]">{ex.stats.completed} / {ex.stats.total} done</span>
                      <span style={{ color: ex.color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#2E2E3E] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: ex.color }} />
                    </div>
                  </div>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: ex.color + '18', color: ex.color }}>
                    {ex.stats.total} {ex.unit}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue learning (only with real progress) */}
        {continueLearning.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-[#3B82F6]" />
              <h2 className="text-lg font-semibold text-white">Continue Learning</h2>
            </div>
            <div className="space-y-3">
              {continueLearning.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 p-4 bg-[#13131A] rounded-xl border border-white/10 hover:border-[#3B82F6]/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center flex-shrink-0">
                    {item.type === 'quiz' ? <HelpCircle className="w-5 h-5 text-[#3B82F6]" /> : <BookOpen className="w-5 h-5 text-[#3B82F6]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-[#3B82F6] transition-colors truncate">{item.title}</h3>
                    <p className="text-xs text-[#9CA3AF]">{item.description}</p>
                  </div>
                  <span className="text-sm font-medium text-[#3B82F6] flex-shrink-0">{item.progressPercent}%</span>
                  <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recommended */}
        {recommendations.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#c9a227]" />
              <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(rec.path)}
                  className="p-5 bg-[#13131A] rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-all text-left group"
                >
                  <h3 className="font-medium text-white group-hover:text-[#c9a227] transition-colors mb-1">{rec.title}</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">{rec.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Tips */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#c9a227]/15 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-[#c9a227]" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">How to get the most out of it</h3>
              <ul className="text-sm text-[#9CA3AF] space-y-1 list-disc list-inside marker:text-[#c9a227]/50">
                <li>Start with flashcards to master the terminology</li>
                <li>Take a quiz after finishing a playbook session</li>
                <li>Use fill-in-the-blank to lock in the key concepts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
