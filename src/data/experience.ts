/**
 * ============================================================
 *  EXPERIENCE, EDUCATION AND CERTIFICATIONS
 *
 *  LinkedIn has no public API for reading your own profile, and
 *  scraping it breaks their Terms of Service — the real risk is
 *  the account getting restricted. So this data is kept by hand.
 *  Update LinkedIn, update this file, push. That is the whole loop.
 *
 *  An empty array hides its section entirely, which is better than
 *  publishing placeholder text.
 *
 *  Dates: use 'MM/YYYY'. Use `to: 'Present'` for current roles.
 * ============================================================
 */

export type Role = {
  title: string;
  company: string;
  from: string;
  to: string;
  location?: string;
  /** What you did. Lead with outcome, not task description. */
  points: string[];
  stack?: string[];
};

export const experience: Role[] = [
  // Nothing renders while this is empty. Uncomment, replace with
  // your real roles, and push.
  //
  // {
  //   title: 'Backend Engineer',
  //   company: 'Company name',
  //   from: '01/2024',
  //   to: 'Present',
  //   location: 'Remote',
  //   points: [
  //     'One concrete thing you shipped, and what it changed.',
  //     'e.g. Cut p99 on the search endpoint from 800ms to 120ms by reworking queries and indexes.',
  //   ],
  //   stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
  // },
];

export type Study = {
  course: string;
  institution: string;
  from: string;
  to: string;
};

export const education: Study[] = [
  // {
  //   course: 'Systems Analysis and Development',
  //   institution: 'Institution name',
  //   from: '01/2022',
  //   to: 'Present',
  // },
];

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  url?: string;
};

export const certifications: Certification[] = [
  // { name: 'AWS Cloud Practitioner', issuer: 'AWS', year: '2025', url: 'https://...' },
];
