// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Syntax themes derived from the site's own design tokens, so code inside an
 * article looks like the code in the panels on the home page. Deliberately
 * restrained: keyword, identifier, string, comment. A full syntax rainbow
 * would fight the palette.
 *
 * @typedef {object} Palette
 * @property {string} fg       base foreground
 * @property {string} keyword  keywords, storage, literals
 * @property {string} string   string literals
 * @property {string} name     function, class and type names
 * @property {string} comment  comments
 * @property {string} punct    punctuation and braces
 */

/**
 * @param {Palette} c
 * @returns {import('shiki').ThemeRegistrationRaw['settings']}
 */
const scopes = (c) => [
  {
    scope: ['comment', 'punctuation.definition.comment'],
    settings: { foreground: c.comment, fontStyle: 'italic' },
  },
  {
    scope: ['keyword', 'keyword.control', 'storage', 'storage.type', 'storage.modifier'],
    settings: { foreground: c.keyword },
  },
  {
    scope: ['constant.numeric', 'constant.language', 'constant.character'],
    settings: { foreground: c.keyword },
  },
  {
    scope: ['string', 'string.quoted', 'punctuation.definition.string'],
    settings: { foreground: c.string },
  },
  {
    scope: [
      'entity.name.function',
      'support.function',
      'meta.function-call',
      'entity.name.class',
      'entity.name.type',
      'support.type',
      'support.class',
    ],
    settings: { foreground: c.name },
  },
  {
    scope: ['variable', 'variable.other', 'meta.definition.variable'],
    settings: { foreground: c.fg },
  },
  { scope: ['punctuation', 'meta.brace'], settings: { foreground: c.punct } },
];

/** @type {import('shiki').ThemeRegistrationRaw} */
const draftingLight = {
  name: 'drafting-light',
  type: 'light',
  colors: { 'editor.background': '#00000000', 'editor.foreground': '#46535a' },
  settings: scopes({
    fg: '#46535a',
    keyword: '#1740c9',
    string: '#67767c',
    name: '#0f1618',
    comment: '#8b979c',
    punct: '#67767c',
  }),
};

/** @type {import('shiki').ThemeRegistrationRaw} */
const draftingDark = {
  name: 'drafting-dark',
  type: 'dark',
  colors: { 'editor.background': '#00000000', 'editor.foreground': '#9aa7ac' },
  settings: scopes({
    fg: '#9aa7ac',
    keyword: '#7d97ff',
    string: '#7d8b90',
    name: '#e6ecea',
    comment: '#6c797e',
    punct: '#7d8b90',
  }),
};

export default defineConfig({
  site: 'https://gustavo-oliveira7.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: draftingLight, dark: draftingDark },
      wrap: false,
    },
  },
});
