'use client';

import { useEffect } from 'react';

/**
 * Runs the theme-initialisation logic on mount (client-side only).
 * Reads the persisted theme from localStorage and applies the correct
 * data-theme attribute to <html> before React paints, preventing a
 * flash of the wrong colour scheme.
 */
export function ThemeInitScript() {
  useEffect(() => {
    try {
      const t = localStorage.getItem('theme');
      if (t && t !== 'system') {
        document.documentElement.setAttribute('data-theme', t);
      } else {
        const d = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        document.documentElement.setAttribute('data-theme', d);
      }
    } catch {
      // Ignore — SSR or localStorage unavailable
    }
  }, []);

  return null;
}
