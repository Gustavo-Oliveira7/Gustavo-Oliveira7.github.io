import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../site.config';
import type { APIContext } from 'astro';

/** Feed RSS dos artigos — permite que leitores acompanhem sem depender de rede social. */
export async function GET(context: APIContext) {
  const artigos = (await getCollection('artigos', ({ data }) => !data.rascunho)).sort(
    (a, b) => +b.data.data - +a.data.data,
  );

  return rss({
    title: `${site.nome} — Artigos`,
    description: site.descricao,
    site: context.site!,
    trailingSlash: false,
    items: artigos.map((a) => ({
      title: a.data.titulo,
      description: a.data.resumo,
      pubDate: a.data.data,
      categories: a.data.tags,
      link: `/artigos/${a.id}`,
    })),
    customData: `<language>pt-br</language>`,
  });
}
