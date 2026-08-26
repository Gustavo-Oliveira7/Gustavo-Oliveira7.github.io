import { githubUser, hiddenProjects } from '../site.config';

/**
 * GitHub integration.
 *
 * Runs at BUILD time, so the generated HTML already contains the data:
 * fast to load and indexable. A scheduled GitHub Actions run rebuilds the
 * site periodically, which keeps it current without any manual step. The
 * /work page additionally refreshes counts in the browser.
 *
 * If the API is unavailable (rate limit, network), the build does NOT fail:
 * these functions return empty data and the pages fall back gracefully.
 */

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  archived: boolean;
};

export type Profile = {
  name: string | null;
  login: string;
  avatar: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  url: string;
};

const API = 'https://api.github.com';

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': `${githubUser}-site`,
  };
  // CI injects GITHUB_TOKEN, which lifts the rate limit from 60 to 5000/hour.
  // Locally it is absent and the anonymous limit is plenty.
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { headers: headers() });
    if (!res.ok) {
      console.warn(`[github] ${path} returned ${res.status} — falling back`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[github] request to ${path} failed — falling back`, err);
    return fallback;
  }
}

export async function fetchProfile(): Promise<Profile | null> {
  const d = await get<any>(`/users/${githubUser}`, null);
  if (!d) return null;
  return {
    name: d.name,
    login: d.login,
    avatar: d.avatar_url,
    bio: d.bio,
    publicRepos: d.public_repos,
    followers: d.followers,
    url: d.html_url,
  };
}

/**
 * Public repositories, newest activity first.
 * Forks, archived repositories and anything in `hiddenProjects` are dropped.
 */
export async function fetchRepos(): Promise<Repo[]> {
  const raw = await get<any[]>(
    `/users/${githubUser}/repos?per_page=100&sort=updated&type=owner`,
    [],
  );

  const hidden = new Set(hiddenProjects.map((n) => n.toLowerCase()));

  return raw
    .filter((r) => !r.fork && !r.archived && !r.private)
    .filter((r) => !hidden.has(String(r.name).toLowerCase()))
    .map(
      (r): Repo => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        topics: r.topics ?? [],
        updatedAt: r.pushed_at ?? r.updated_at,
        archived: r.archived ?? false,
      }),
    )
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

/**
 * Groups repositories by language, largest group first.
 * Language is the honest way to organise this list — it is real information
 * about the code, unlike an arbitrary ranking.
 */
export function groupByLanguage(repos: Repo[]): Array<{ language: string; repos: Repo[] }> {
  const groups = new Map<string, Repo[]>();
  for (const r of repos) {
    const key = r.language ?? 'Other';
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }
  return [...groups.entries()]
    .map(([language, list]) => ({ language, repos: list }))
    .sort((a, b) => b.repos.length - a.repos.length);
}

/** '2026-08-20T10:00:00Z' -> '20 Aug 2026' */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
