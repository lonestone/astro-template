import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Blog: dated articles with optional image, author and cross-links.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Optional SEO `<title>` / headline split: `title` stays the document
      // title and JSON-LD headline, `h1` overrides the visible on-page H1.
      h1: z.string().optional(),
      summary: z.string(),
      date: z.coerce.date().optional(),
      update: z.coerce.date().optional(),
      image: image().optional(),
      author: z.string().optional(),
      similarPosts: z.array(z.string()).optional(),
      // Key takeaways rendered as a highlighted box at the top of the article.
      takeaways: z.array(z.string()).default([]),
      // Drafts are excluded from the blog index and from the generated pages.
      draft: z.boolean().default(false),
      // Opt a single post out of the auto-inserted mid-article CTA.
      hideInlineCta: z.boolean().default(false),
    }),
})

// Case studies: customer / project stories with optional logo + sector metadata.
const clientCases = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/client-cases',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      sector: z.string().optional(),
      teamSize: z.string().optional(),
      logo: image().optional(),
    }),
})

// Product documentation, structured in a sidebar via the `order` field.
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
})

// How-to guides. Sit alongside docs in the sidebar.
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
})

// Developer docs: separate /developers section with its own top nav.
const developers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/developers' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
})

// API reference categories: group API entities in the sidebar.
const apiCategories = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/api-categories',
  }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
  }),
})

// API entities: individual entity pages shown under their category in the sidebar.
const api = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/api' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    entity: z.string().optional(),
    category: z.string().optional(),
  }),
})

// UI strings shared across layouts (header, footer, sidebars, CTAs).
const translations = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/translations' }),
})

// Top-level static pages (home, features, pricing, legal, 404, etc.).
// Each slug becomes `/<lang>/<slug>`; the slug `index` becomes `/<lang>`.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = {
  blog,
  'client-cases': clientCases,
  docs,
  guides,
  developers,
  'api-categories': apiCategories,
  api,
  translations,
  pages,
}
