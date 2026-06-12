import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const STORAGE_KEY = 'fasterclass_newsletter';

interface NewsletterSignupProps {
  /** Visual density: 'section' for the full landing band, 'inline' for compact use. */
  variant?: 'section' | 'inline';
}

/**
 * Newsletter capture (design brief slides 10 & 19: "sign up for both the site and the
 * newsletter"). No backend yet — the email is stored locally and confirmed; this is the
 * UI + capture point a real ESP/backend would plug into.
 */
export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ variant = 'section' }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    try {
      const existing: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!existing.includes(value)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, value]));
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([value]));
    }
    setSubscribed(true);
  };

  const form = subscribed ? (
    <div className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-medium">
      <Check className="w-5 h-5" />
      You're in. Watch your inbox for the next drop.
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@startup.com"
        className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#c9a227] transition-colors"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c9a227] text-black font-bold rounded-xl hover:bg-[#d4af37] transition-colors"
      >
        Subscribe <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );

  if (variant === 'inline') {
    return <div>{form}</div>;
  }

  return (
    <section className="py-20 px-6 md:px-8 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-black">
      <div className="max-w-2xl mx-auto text-center">
        <span className="mc-label text-[#c9a227]">The Drop</span>
        <h2 className="mc-heading text-3xl md:text-4xl text-white mt-2">Signal in your inbox</h2>
        <p className="text-[#a3a3a3] mt-3 max-w-lg mx-auto">
          One curated founder lesson a week — the best of what we find, distilled.
          No noise, no spam, unsubscribe anytime.
        </p>
        {form}
      </div>
    </section>
  );
};

export default NewsletterSignup;
