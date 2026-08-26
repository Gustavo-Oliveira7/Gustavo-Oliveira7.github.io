/** Reading time estimate at 200 words per minute. */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** GitHub's own language colours, for the ones that show up in these repos. */
const languageColours: Record<string, string> = {
  Java: '#b07219',
  Go: '#00ADD8',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  SQL: '#e38c00',
  Rust: '#dea584',
  Kotlin: '#A97BFF',
};

export function languageColour(name: string | null): string {
  if (!name) return 'var(--rule-2)';
  return languageColours[name] ?? 'var(--rule-2)';
}

/** Date -> '10 August 2026' */
export function longDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Date -> '10 Aug 2026' */
export function shortDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
