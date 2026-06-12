/**
 * Newsletter capture (design brief slides 10 & 19). Stored locally for now; this is the
 * single point a real ESP/backend (Beehiiv, Resend, Supabase table) plugs into later.
 */
const STORAGE_KEY = 'fasterclass_newsletter';

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const newsletterService = {
  subscribe(email: string): boolean {
    const value = email.trim();
    if (!isValidEmail(value)) return false;
    try {
      const existing: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!existing.includes(value)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, value]));
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([value]));
    }
    return true;
  },

  getSubscribers(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },
};
