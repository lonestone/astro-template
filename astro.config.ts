import type { RehypePlugins } from 'astro'
import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import netlify from '@astrojs/netlify'
import sitemap from '@astrojs/sitemap'
import { redirects } from './src/redirects'
import rehypeMdClass from './src/utils/rehype-md-class'
import enrichMd from './src/integrations/enrich-md'
import config from './website.config'

const { site, langs, defaultLang } = config
const multilang = langs.length > 1

// The same rehype list feeds two APIs with subtly different types:
// `markdown.processor = unified({...})` for plain `.md` and the `mdx()`
// integration for `.mdx` (mdx@5 reads neither the deprecated top-level fields
// nor `processor`, only its own options). Astro's RehypePlugins allows bare
// `string` specifiers that mdx's `PluggableList` rejects, so drop that member
// to get one type assignable to both.
type Plugins<T extends unknown[]> = Exclude<T[number], string | [string, unknown]>[]

const rehypePlugins: Plugins<RehypePlugins> = [rehypeMdClass]

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
    // Astro 6 replaced the deprecated top-level `rehypePlugins` field with
    // `markdown.processor = unified({...})`, which drives plain `.md` files.
    // See the `rehypePlugins` const above.
    processor: unified({ rehypePlugins }),
  },
  integrations: [
    // mdx@5 does not read `markdown.processor`, only its own options, so mirror
    // the same list here for `.mdx` files.
    mdx({ rehypePlugins }),
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
