/**
 * Site-wide configuration.
 *
 * Single source of truth for anything that varies per deployment: site URL,
 * supported languages, brand name. Referenced by astro.config.ts, layouts,
 * footer, breadcrumbs and llms.txt.
 */
export default {
  // Canonical production URL. Used for sitemap, canonical tags, social previews.
  site: 'https://example.com',

  // Brand name shown in the header logo, footer, breadcrumbs, meta tags.
  siteName: 'Astro Template',

  // Supported UI languages. The first entry is the default.
  // Content collections expect files named `<slug>/<lang>.mdx`.
  langs: ['en', 'fr'],
  defaultLang: 'en',
} as const
