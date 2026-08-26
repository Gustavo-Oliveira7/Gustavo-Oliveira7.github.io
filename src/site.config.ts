/**
 * ============================================================
 *  SITE CONFIGURATION
 *  The one file to edit for personal details, links and copy.
 *  Everything else reads from here.
 * ============================================================
 */

export const site = {
  name: 'Gustavo Oliveira',
  role: 'Backend Engineer',

  /** Used in <title>, meta description and social previews. */
  description:
    'Backend engineer working in Java and Go — APIs, data models and services that hold up under load.',

  /**
   * The home page headline. It states the thesis the writing argues:
   * the same contract, expressed two very different ways.
   */
  statement: 'Same contract, two different bets.',

  /** The line that sits directly under the Java/Go panels. */
  annotation: 'Java raises. Go returns. Most of what I write lives in that gap.',

  /** Opening paragraph, below the headline. */
  intro:
    'I build backend services in both languages — APIs, data models, and the unglamorous work of keeping a system correct once traffic stops being polite. What I publish here is the reasoning behind those decisions, not the tutorials.',

  location: 'Brazil',
  lang: 'en',
} as const;

export const links = {
  github: 'https://github.com/Gustavo-Oliveira7',
  /** CHECK THIS: open your LinkedIn and copy the URL from the address bar. */
  linkedin: 'https://www.linkedin.com/in/gustavo-oliveira7/',
  email: 'gustavo.h.oliveira7531@gmail.com',
} as const;

/** GitHub account the project list is pulled from. */
export const githubUser = 'Gustavo-Oliveira7';

/**
 * Featured repositories, in the order they should appear.
 * Names must match the repository name on GitHub exactly.
 * Stars, language and dates come from the API — this only decides
 * WHICH repositories lead, and lets you override the blurb.
 */
export const featuredProjects: Array<{
  repo: string;
  /** Overrides the GitHub description. Omit to use the repo's own. */
  blurb?: string;
}> = [
  {
    repo: 'chess-plataform',
    blurb:
      'A chess engine in Java. Most of the work is domain modelling: encoding move legality, board state and check detection without letting the rules leak into the UI.',
  },
  {
    repo: 'guERP',
    blurb:
      'A small ERP in Java covering registration, inventory and relational persistence — an exercise in keeping a growing schema honest.',
  },
  {
    repo: 'sudokuGame',
    blurb:
      'Sudoku generator and solver in Java, built on backtracking with constraint checks that prune the search early.',
  },
];

/**
 * Repositories that should never appear on the site.
 * Forks and archived repositories are already excluded automatically.
 */
export const hiddenProjects: string[] = [
  'Gustavo-Oliveira7.github.io',
  'testandoClaude',
  'aprendendo-git',
  'trybe-exercicios',
  'dio-lab-open-source',
  'dioCI-T',
  'dioCIeT',
  'dioAWSChallenge',
  'qa-test-project-dio',
  'html-css',
  'newHTML-CSS',
  'myPortfolio',
];

/** Rendered as a spec table on the home page. */
export const toolkit: Array<{ field: string; values: string[] }> = [
  { field: 'Languages', values: ['Java', 'Go', 'TypeScript', 'Python', 'SQL'] },
  { field: 'Backend', values: ['Spring Boot', 'JPA / Hibernate', 'REST', 'net/http', 'JUnit'] },
  { field: 'Data', values: ['PostgreSQL', 'MySQL', 'Redis'] },
  { field: 'Infrastructure', values: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'AWS'] },
];

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
] as const;
