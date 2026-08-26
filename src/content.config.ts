import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Colecao de artigos.
 * Para publicar um artigo novo: crie um arquivo .md em src/content/artigos/
 * O nome do arquivo vira a URL. Ex: cache-em-go.md -> /artigos/cache-em-go
 */
const artigos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
  schema: z.object({
    titulo: z.string(),
    /** 1-2 frases. Aparece na listagem e no compartilhamento. */
    resumo: z.string(),
    data: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    /** true = nao aparece no site publicado (util para escrever aos poucos) */
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { artigos };
