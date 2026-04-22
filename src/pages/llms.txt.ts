import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { getLangFromId, getSlugFromId } from '../utils/i18n'
import config from '../../website.config'

const siteUrl = import.meta.env.SITE?.replace(/\/$/, '') || ''

/**
 * Serves /llms.txt, a plain-text index optimized for LLM crawlers.
 * Lists every content page under the default language with short descriptions
 * and points them to markdown equivalents (see enrich-md integration).
 */
export const GET: APIRoute = async () => {
  const [docs, guides, developers, api, blog, clientCases] =
    await Promise.all([
      getCollection('docs'),
      getCollection('guides'),
      getCollection('developers'),
      getCollection('api'),
      getCollection('blog'),
      getCollection('client-cases'),
    ])

  const defaultLang = config.defaultLang
  const inDefault = <T extends { id: string }>(entries: T[]) =>
    entries.filter((e) => getLangFromId(e.id) === defaultLang)

  const byOrder = (
    a: { data: { order?: number } },
    b: { data: { order?: number } }
  ) => (a.data.order ?? 999) - (b.data.order ?? 999)

  const lines: string[] = [
    `# ${config.siteName}`,
    '',
    `A markdown version of every page is available by replacing \`.html\` with \`.md\` in the URL (e.g. ${siteUrl}/${defaultLang}/docs/getting-started.md).`,
    '',
    '## About',
    '',
    `- [Homepage](${siteUrl}/${defaultLang})`,
    `- [Features](${siteUrl}/${defaultLang}/features)`,
    `- [Pricing](${siteUrl}/${defaultLang}/pricing)`,
    `- [Contact](${siteUrl}/${defaultLang}/contact)`,
    `- [Blog](${siteUrl}/${defaultLang}/blog)`,
    `- [Case Studies](${siteUrl}/${defaultLang}/client-cases)`,
  ]

  function addSection(
    title: string,
    entries: {
      id: string
      data: { title: string; description?: string; summary?: string }
    }[],
    prefix: string
  ) {
    if (!entries.length) return
    lines.push('', `## ${title}`, '')
    for (const entry of entries) {
      const slug = getSlugFromId(entry.id)
      const desc =
        entry.data.description || (entry.data as { summary?: string }).summary
      const suffix = desc ? `: ${desc}` : ''
      lines.push(
        `- [${entry.data.title}](${siteUrl}/${defaultLang}/${prefix}/${slug})${suffix}`
      )
    }
  }

  addSection('Documentation', inDefault(docs).sort(byOrder), 'docs')
  addSection('Guides', inDefault(guides).sort(byOrder), 'guides')
  addSection('Developers', inDefault(developers).sort(byOrder), 'developers')
  addSection(
    'API Reference',
    inDefault(api).sort((a, b) => a.data.title.localeCompare(b.data.title)),
    'api'
  )
  addSection(
    'Blog',
    inDefault(blog).sort(
      (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0)
    ),
    'blog'
  )
  addSection('Case Studies', inDefault(clientCases), 'client-cases')

  lines.push('')

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
