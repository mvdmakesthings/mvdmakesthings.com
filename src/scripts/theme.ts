// Theme state lives on <html data-theme>. The inline script in Base.astro sets it
// before first paint; this module handles changes after that.

export type Theme = 'light' | 'dark';

const KEY = 'theme';

function stored(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme, persist = true): void {
  document.documentElement.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // Private mode or blocked storage: the choice lasts for this page only.
    }
  }
  document.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: theme }));
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

// Follow the system until the visitor picks a side.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (!stored()) setTheme(event.matches ? 'dark' : 'light', false);
});
