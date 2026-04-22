import type { AstroUserConfig } from 'astro'

type Redirects = NonNullable<AstroUserConfig['redirects']>

/**
 * Static redirects compiled into the build (each becomes a 301 HTML page).
 * For wildcard patterns use public/_redirects instead.
 *
 * Example:
 *   '/old-path': '/en/new-path',
 *   '/fr/ancien-chemin': '/fr/nouveau-chemin',
 */
export const redirects: Redirects = {
  '/sitemap.xml': '/sitemap-index.xml',
}
