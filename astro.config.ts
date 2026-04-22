import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import netlify from '@astrojs/netlify'
import sitemap from '@astrojs/sitemap'
import { redirects } from './src/redirects'
import rehypeMdClass from './src/utils/rehype-md-class'
import enrichMd from './src/integrations/enrich-md'
import config from './website.config'

const { site, langs, defaultLang } = config
const multilang = langs.length > 1

export default defineConfig({
  site,
  adapter: netlify({
    // Netlify's on-demand image service only exists on their production
    // runtime, so `npm run dev` would get broken image URLs. Enable it only
    // when building for production.
    imageCDN: process.env.NODE_ENV === 'production',
    edgeMiddleware: false,
  }),
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  redirects,
  markdown: {
    rehypePlugins: [rehypeMdClass],
  },
  integrations: [
    mdx(),
    sitemap(
      multilang
        ? {
            // Multilingual: the root URL redirects to the default lang, so
            // skip it in the sitemap to avoid duplicate hreflang entries.
            filter: (page) => page !== `${site}/`,
            i18n: {
              defaultLocale: defaultLang,
              locales: Object.fromEntries(langs.map((l) => [l, l])),
            },
          }
        : {}
    ),
    enrichMd(),
  ],
  i18n: {
    defaultLocale: defaultLang,
    locales: [...langs],
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
