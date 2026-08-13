import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import mdx, { type MdxOptions } from '@astrojs/mdx'
import netlify from '@astrojs/netlify'
import sitemap from '@astrojs/sitemap'
import expressiveCode from 'astro-expressive-code'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeMermaid from 'rehype-mermaid'
import { redirects } from './src/redirects'
import rehypeMdClass from './src/utils/rehype-md-class'
import { getExternalLinkRel } from './src/utils/external-links'
import enrichMd from './src/integrations/enrich-md'
import config from './website.config'

const { site, langs, defaultLang } = config
const multilang = langs.length > 1

// Drives `.md` files. `pre-mermaid` leaves a `<pre class="mermaid">` rendered
// client-side by `src/scripts/mermaid.ts`, so no Playwright is needed at build
// time. It runs before `rehypeMdClass` so the diagram `<pre>` also gets `.md`,
// and before Expressive Code, which then finds no `<code>` left to highlight.
const processor = unified({
  rehypePlugins: [
    [rehypeMermaid, { strategy: 'pre-mermaid' }],
    rehypeMdClass,
    [rehypeExternalLinks, { target: '_blank', rel: getExternalLinkRel }],
  ],
  gfm: true,
})

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
  markdown: { processor },
  integrations: [
    // Renders every code block, from the options in ec.config.mjs.
    expressiveCode(),
    // mdx@5 reads only its own options, so the pipeline is repeated here for
    // `.mdx` files. Reading it back off the processor is what matters: `unified()`
    // copies the arrays it receives and integrations append to those copies
    // during `astro:config:setup`, which is how Expressive Code lands on MDX
    // pages. `gfm` is explicit for the same reason, a custom processor hides the
    // default Astro would otherwise pass on (dropping remark-gfm breaks tables).
    mdx({
      remarkPlugins: processor.options.remarkPlugins as MdxOptions['remarkPlugins'],
      rehypePlugins: processor.options.rehypePlugins as MdxOptions['rehypePlugins'],
      gfm: true,
    }),
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
