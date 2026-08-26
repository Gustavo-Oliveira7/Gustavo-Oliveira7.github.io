import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Writing collection.
 * To publish: add a .md file to src/content/writing/ and push.
 * The filename becomes the URL — caching-in-go.md -> /writing/caching-in-go
 */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences. Used in listings and link previews. */
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    /** true keeps the file in the repo but off the published site */
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
