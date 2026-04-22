# Astro website template

An opinionated, batteries-included starter for building a marketing +
documentation website for a **product** or a **service**. Works out of the box
as a monolingual or multilingual site, ships with a blog, case studies,
docs, guides, developer section, API reference, and a set of reusable content
components.

No database, no server, no CMS backend. Content lives in Git as MDX + YAML.
A file-based CMS (AstroCMS) is bundled for non-developers who prefer a UI.

Built with **Astro 6**, **MDX**, **Tailwind CSS v4**, deployed on **Netlify**.
Released under the **MIT license**.

---

## Quick start

```bash
npm install
npm run dev         # http://localhost:4321
```

Build & preview:

```bash
npm run build       # static build + Netlify function emit
npm run preview     # preview the build
```

Bundled CMS (for content editors):

```bash
npm run astrocms    # http://localhost:4001/astrocms
```

---

## What you get out of the box

| Feature                          | Where it lives                                      |
| -------------------------------- | --------------------------------------------------- |
| Static site generation           | `astro.config.ts` (`output: 'static'`)              |
| Netlify adapter + image CDN      | `astro.config.ts` (just push to Netlify)            |
| Multilingual routing             | `website.config.ts` → `langs`, `defaultLang`        |
| Typed content collections (Zod)  | `src/content.config.ts`                             |
| MDX with components-in-markdown  | `src/content/**/*.mdx` + `src/components/index.ts`  |
| Tailwind CSS v4                  | `src/styles/global.css`                             |
| Automatic sitemap                | `@astrojs/sitemap` integration                      |
| `robots.txt` with AI preferences | `public/robots.txt`                                 |
| Social previews (Open Graph)     | `src/components/SocialPreview.astro`                |
| Canonical + hreflang tags        | `src/layouts/BaseLayout.astro`                      |
| JSON-LD breadcrumbs              | `src/components/Breadcrumb.astro`                   |
| `.md` mirrors of every page      | `src/integrations/enrich-md.ts`                     |
| `/llms.txt` index for AI crawlers| `src/pages/llms.txt.ts`                             |
| Mobile nav (cloned from desktop) | `src/components/TopNavShell.astro`                  |
| Table of contents + scroll spy   | `src/components/BlogSidebar.astro`                  |
| Bundled file-based CMS           | `astrocms.json` + `npm run astrocms`                |

---

## Configuring the site

Every site-wide value lives in **`website.config.ts`**. Edit this file first.

```ts
export default {
  site: 'https://example.com',     // canonical URL, used for sitemap & OG
  siteName: 'Acme',                // brand name (header, footer, breadcrumbs)
  langs: ['en', 'fr'],             // supported locales (first = default)
  defaultLang: 'en',
}
```

Don't forget:

- Update `public/robots.txt` with your real production URL.
- Replace `public/favicon.svg` and `src/assets/icons/logo.svg` with your brand.
- Tweak the theme colors in `src/styles/global.css` (`--color-primary`, gray
  scale, semantic tokens).

---

## How content works

### Collections

Each collection is **a folder** under `src/content/` plus a **schema** in
`src/content.config.ts`. Every content file must pass its schema; bad front
matter fails the build, never production.

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date().optional(),
      image: image().optional(),
      author: z.string().optional(),
      similarPosts: z.array(z.string()).optional(),
    }),
})
```

### Multilingual convention

Each content folder is named by its **slug**; each file inside is named by
**locale**:

```
src/content/blog/
  welcome/
    en.mdx
    fr.mdx
  choosing-content-collections/
    en.mdx
    fr.mdx
```

The slug becomes the URL (`/en/blog/welcome`). If you want a collection to
back a single URL like `/en` or `/en/pricing`, use the `pages` collection and
give the file the slug `index` (for the home) or any name (for sub-pages).

Helpers in `src/utils/i18n.ts` (`getSlugFromId`, `getLangFromId`,
`getLangFromUrl`, `getLangHref`, `getTranslations`) hide the plumbing.

### Where routes come from

| URL pattern                            | Route file                                        |
| -------------------------------------- | ------------------------------------------------- |
| `/`                                    | `src/pages/index.astro` (redirects)               |
| `/404`                                 | `src/pages/404.astro`                             |
| `/llms.txt`                            | `src/pages/llms.txt.ts`                           |
| `/<lang>` and `/<lang>/<static-page>`  | `src/pages/[lang]/[...slug].astro` + `pages/`     |
| `/<lang>/blog` / `/<lang>/blog/<slug>` | `src/pages/[lang]/blog/…`                         |
| `/<lang>/client-cases/…`               | `src/pages/[lang]/client-cases/…`                 |
| `/<lang>/docs/…` + `/<lang>/guides/…`  | `src/pages/[lang]/docs/…` + `guides/…`            |
| `/<lang>/developers/…`                 | `src/pages/[lang]/developers/[...slug].astro`     |
| `/<lang>/api/…`                        | `src/pages/[lang]/api/[...slug].astro`            |

Each route file does the same thing: read its collection, call
`getStaticPaths()` for every `<slug, lang>` combination, render the matching
layout.

### UI strings (translations)

Header labels, footer headings, CTAs, sidebar hints, anything shown in the
UI chrome, live in `src/content/translations/<lang>.yaml`. Access them with
`getTranslations(lang)`.

Adding a new string:

1. Add it to **every** `<lang>.yaml` file under the same path.
2. Use it from a layout / component via `t.yourNewKey`.

---

## Adding content

### A new blog post

Drop a file at `src/content/blog/<slug>/<lang>.mdx`:

```mdx
---
title: "My post"
summary: "One-line summary shown on the index card."
date: 2026-04-20
author: Your name
image: ./cover.jpg
---

Markdown body here. Drop images in the same folder and reference them
with `./name.jpg`.
```

Optional front matter fields: `update: 2026-05-01`, `similarPosts: [other-slug]`.

### A new doc / guide / developer page

Same shape, different folder (`docs/`, `guides/`, `developers/`). Add an
`order` field to control sidebar position:

```mdx
---
title: "Configuration"
description: "How to configure the thing."
order: 2
---
```

### A new API entity

```
src/content/api/<entity>/<lang>.mdx
```

Front matter:

```yaml
---
title: 'User'
description: 'Represents an end user.'
entity: 'user'          # shown as <code> in the page header
category: 'core'        # must match an api-categories slug
---
```

### A new API category (sidebar group)

```
src/content/api-categories/<slug>/<lang>.mdx
```

Only front matter is needed (`title`, `order`). The body is ignored.

### A new static page

1. Create `src/content/pages/<slug>/<lang>.mdx`.
2. That's it. The URL `/<lang>/<slug>` resolves automatically.

Slug `index` becomes the home page (`/<lang>`).

### A new language

1. Add it to `website.config.ts`:
   ```ts
   langs: ['en', 'fr', 'de'],
   ```
2. Duplicate `src/content/translations/en.yaml` to `de.yaml` and translate.
3. For each collection item that should exist in the new language, add a
   `<slug>/de.mdx` file.

---

## Components available inside MDX

`src/components/index.ts` auto-discovers every `.astro` file in `src/components/`
and exposes it to MDX without imports. So this works anywhere in a `.mdx`
file:

```mdx
<Hero
  title="Great teams ship great products"
  subtitle="A modern starter for marketing sites."
  buttonText="Get started"
  buttonHref="/en/contact"
  smallText="Free template."
/>

<Callout type="tip" title="Did you know?">
  Any component from `src/components/` can be used here without imports.
</Callout>
```

### Keep MDX for content, components for style and behavior

A strong recommendation when using this template:

- **Don't add `import` statements inside MDX files.** Every component is auto-imported; reach for it by name.
- **Don't put styling (CSS, `class`, `style` attributes, `<style>` blocks) inside MDX files.** Styling lives inside the components.
- **Don't put behavior (scripts, event handlers, client logic) inside MDX files.** Behavior lives inside the components.

MDX files should be **pure content**: headings, paragraphs, and `<ComponentName>` calls with simple props. If a page needs a new visual treatment, create (or extend) a component in `src/components/` and reference it from the MDX file.

This discipline pays off in three concrete ways:

1. **Fewer bugs.** Mixing styling and content inside MDX is where escape-sequence issues, broken imports, and stale CSS creep in. Content files stay simple; engineering bugs stay in the components.
2. **Better AI collaboration.** When a page is a stable sequence of component calls, an LLM can edit copy, reorder sections, or translate content without accidentally breaking layout or logic. Imports and inline styles are the first thing to confuse a model.
3. **Works with a CMS like AstroCMS.** AstroCMS lets non-developers edit MDX files through a web UI. It understands front matter and component tags with simple props; it does **not** understand arbitrary TypeScript imports, inline styles, or custom `<script>` blocks. Keeping MDX declarative means your editors can work safely without touching the codebase.

When you want a reusable page pattern (a new hero layout, a pricing grid, a testimonial block), build it as a component with a clean prop surface, then use it across every language file the same way.

Every component in `src/components/` is a small, self-contained `.astro` file. Open it, tweak it, rename it. Nothing is buried in a framework.

---

## Styling

Tailwind CSS v4, configured via the `@theme` block in
**`src/styles/global.css`**. Brand and semantic tokens live there:

```css
@theme {
  --color-primary: hsla(221, 83%, 53%, 1);
  --color-primary-light: hsla(221, 83%, 63%, 1);
  --color-gray-50…900: …
  --color-bg-main:  …
  --color-text-main: …
  --color-border: …
  --color-callout-info / -warning / -tip: …
}
```

Prose coming from MDX gets an `.md` class automatically (via the rehype
plugin in `src/utils/rehype-md-class.ts`). CSS targets `.md` so markdown
typography never bleeds into component markup.

Want a different font? The default is the system stack: no network request,
native feel everywhere. To use a webfont:

1. `@import 'https://fonts.googleapis.com/css2?family=Inter…'` at the top of
   `global.css` (or, better, self-host via `@fontsource/inter`).
2. Change `--font-sans` in the `@theme` block.

---

## Icons

This template intentionally ships **without an icon package**. Wherever an
icon is needed in a page, **use an emoji**:

```mdx
<FeatureItem icon="🚀" title="Fast">
  Everything ships pre-rendered.
</FeatureItem>
```

If you need a custom SVG (e.g. a partner or client logo), drop it into
`src/assets/icons/references/<name>.svg` and reference it via the `Icon`
component or the `ClientLogos` component.

---

## Deployment

### Netlify (default)

Push to a Git repo connected to Netlify. The bundled adapter handles:

- Static output in `dist/`
- `_redirects` (copied from `public/`)
- `_headers` (generated by the `enrich-md` integration; advertises `.md`
  alternates and sets the correct content type)
- Automatic sitemap at `/sitemap-index.xml`

Build command: `npm run build`. Publish directory: `dist`.

### Another host

Swap the adapter in `astro.config.ts`:

```ts
// import vercel from '@astrojs/vercel'
// import cloudflare from '@astrojs/cloudflare'
adapter: vercel(),
```

The root-URL redirect (browser-language detection) lives in
`public/_redirects`, which is Netlify-specific syntax. For other hosts,
replicate the same behavior in their routing DSL, or switch to
`prefixDefaultLocale: false` in `astro.config.ts` to have the default lang
served from `/`.

---

## The `enrich-md` integration

At the end of every build, `src/integrations/enrich-md.ts`:

1. Reads every generated `.html` file in `dist/`.
2. Extracts `<title>`, `<meta name="description">` and the `<main>` body.
3. Converts the body to Markdown using Turndown.
4. Writes the Markdown next to the HTML (so `/en/docs/getting-started.html`
   gets a sibling `/en/docs/getting-started.md`).
5. Emits a Netlify `_headers` file with a
   `Link: <…>; rel="alternate"; type="text/markdown"` for every page, plus a
   `Content-Type: text/markdown` rule for `*.md`.

The `/llms.txt` route (`src/pages/llms.txt.ts`) emits a plain-text index
tailored for LLM crawlers, following the emerging `llms.txt` convention.

---

## Redirects

Two places to declare redirects:

- **`src/redirects.ts`**: one-to-one redirects compiled by Astro into
  static HTML redirect pages. Good for clean, declarative entries.
- **`public/_redirects`**: Netlify-native syntax. Required for wildcards
  (`/old/*  /new/:splat`) and the browser-language root redirect.

---

## The AstroCMS (optional)

Run `npm run astrocms` to get a web UI at `http://localhost:4001/astrocms`
that reads the same MDX files. It can commit/push changes via Git so
non-technical editors never touch the codebase. Configuration lives in
**`astrocms.json`**. See the [AstroCMS
repository](https://github.com/lonestone/astrocms) for deployment options
(Docker, GitHub PAT, environment variables).

---

## Removing what you don't need

Every collection is optional. To drop one, do three things:

1. Delete the corresponding folder in `src/content/`.
2. Delete the corresponding route files under `src/pages/[lang]/…`.
3. Remove the collection declaration from `src/content.config.ts`.

You may also want to:

- Remove the header/footer links that reference the dropped section
  (`src/components/TopNav.astro`, `src/components/Footer.astro`).
- Remove matching keys from the translation files.

Example: this starter ships with blog, case studies, docs, guides, developer
docs, and API reference. A pure marketing site for a service might keep only
`pages/` and `blog/`.

---

## Going monolingual

1. Set `langs: ['en']` in `website.config.ts`.
2. Remove the second translation file (`src/content/translations/fr.yaml`).
3. Delete every `fr.mdx` across content folders (or leave them; they will
   not be exposed).
4. The sitemap integration auto-adapts (`hreflang` tags only appear when
   `langs.length > 1`, see `astro.config.ts`).
5. Optionally, set `prefixDefaultLocale: false` to serve your site from `/`
   instead of `/en`.

---

## Cursor compatibility

The project is configured for Claude Code (`CLAUDE.md`, `.claude/skills/`). To use Cursor with the same instructions:

```bash
./setup-cursor-compat.sh
```

The script creates two symlinks (gitignored):

- `AGENTS.md → CLAUDE.md` — Cursor reads `AGENTS.md` as project instructions
- `.cursor/skills/ → .claude/skills/` — Cursor reads skills from the same skills folder

Both tools then share a single source of configuration.

---

## License

MIT. See [LICENSE](./LICENSE). Use it for personal or commercial projects.
