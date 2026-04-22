# Working rules

Astro 6 + MDX + Tailwind v4 site. Content lives in Git (MDX/YAML), no backend. This file captures the non-obvious conventions — things a fresh read of the code won't make obvious.

## i18n

- `lang` is **not** stored in frontmatter. It is derived from the filename (`en.mdx` / `fr.mdx`) via the content entry ID (e.g. `my-slug/en`). Use `getSlugFromId(entry.id)` and `getLangFromId(entry.id)` from `src/utils/i18n.ts`.
- Routing pages under `src/pages/[lang]/` use a single `[lang]` param and loop over both locales in `getStaticPaths()`, filtering entries by ID suffix (`entry.id.endsWith('/${lang}')`).
- URL paths are identical across languages (no locale-specific slugs). Internal links must include the lang prefix (`/en/...`, `/fr/...`).
- Never hardcode `'en'` / `'fr'`. Import `langs`/`defaultLang` from `website.config.ts` (or from `src/utils/i18n.ts`).
- UI strings live in `src/content/translations/<lang>.yaml`. Access via `await getTranslations(lang)`. Any new key must be added to **every** `<lang>.yaml` file under the same path.
- All user-facing text in `.astro` components must come from translations. No hardcoded strings, no inline EN/FR ternaries.

## MDX discipline

MDX files are **pure content**: frontmatter, markdown, and component calls with simple props. Reinforced rules:

- No `import` statements (every component in `src/components/` is auto-discovered).
- No `export const` or script blocks.
- No raw HTML tags (`<div>`, `<section>`, `<h2>`, `<p>`, `<img>`, etc.). Use markdown syntax or components.
- No `class`, `style`, or `<style>` — styling belongs in components.
- No JSON arrays or JS logic. Write data as repeated component calls in the markup.
- Images: use markdown syntax `![alt](./image.jpg)` with files co-located in the content folder. Astro handles the import.
- Callouts: `<Callout type="info|warning|tip">`.
- Buttons / CTA links: use `<Button>` with the `label` prop (not children).

When a page needs a new visual treatment, build a component in `src/components/` with a clean prop surface, then call it from MDX. Prefer props over Fragment slots for simple strings; reserve slots for rich/nested content.

## Components

- Keep content specific to a page out of reusable components in `src/components/`. Page-specific copy belongs in MDX files (or in `src/pages/` Astro components).
- Accessibility: interactive elements need `tabindex`, `aria-label`, and both `onclick` + `onkeydown` handlers when appropriate.
- Event handlers: name with a `handle` prefix (`handleClick`, `handleKeyDown`).

## Writing style (EN and FR content)

- Never use em dashes (`—`). Reformulate.
- Prefer positive formulations over negative ones. E.g. "rester indépendant" rather than "ne pas dépendre", "dès le premier sprint" rather than "pas à la fin".
- Avoid label-colon patterns like "Objectif :", "Result:", "Avantage :". Integrate the information into the sentence.
- EN files in English, FR files in French. Code identifiers (GraphQL fields, entity names, type names) stay in English in both locales.
- Docs and guides are written for non-technical readers. Keep developer/technical content in the `developers/` collection.

## Maintenance reflexes

- Renaming or deleting a page: add a redirect. One-to-one redirects go in `src/redirects.ts`; wildcard or browser-language redirects go in `public/_redirects` (Netlify syntax).
- When you remove an import, check whether the source file is still referenced anywhere. If not, delete it (and follow its own imports).
- Markdown styles target the `.md` class (added automatically by `src/utils/rehype-md-class.ts`). Don't restyle markdown elements globally — component markup must stay unaffected.
- The dev server is assumed to be already running; don't start a fresh `npm run dev` unless asked.
- `astrocms.json` drives the bundled CMS UI. Keep `contentDir`, `contentConfig`, `assetsDir`, `componentsDir` in sync if those paths move.
