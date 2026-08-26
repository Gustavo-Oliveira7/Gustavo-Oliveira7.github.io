import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../site.config';
import type { APIContext } from 'astro';

/** RSS feed, so readers can follow along without a social network in between. */
export async function GET(context: APIContext) {
  const pieces = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => +b.data.date - +a.data.date,
  );

  return rss({
    title: `${site.name} — Writing`,
    description: site.description,
    site: context.site!,
    trailingSlash: false,
    items: pieces.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.date,
      categories: p.data.tags,
      link: `/writing/${p.id}`,
    })),
    customData: `<language>en</language>`,
  });
}
