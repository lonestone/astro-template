---
name: post-alternative
description: This skill should be used when the user asks to create an "alternative to" blog post, a competitor comparison post, or invokes /post-alternative. Takes a competitor product name as argument.
version: 0.2.0
---

# Create an "Alternative to [Competitor]" blog post

Create a blog post positioned as "{Brand} as an alternative to [Competitor]" for the site. Targets bottom-of-funnel prospects searching for alternatives.

`{Brand}` refers to the product/company this site is about. Read `website.config.ts` (`siteName`) and the homepage at `src/content/pages/index/<lang>.mdx` for the actual name, positioning, and differentiators.

## Process

### 1. Research the competitor

Use WebSearch and WebFetch to learn about the competitor:
- What it is, category, core features, positioning
- Pricing model
- Pain points, limitations, common complaints (G2, Capterra, Reddit)
- Target audience and company size
- Strengths to acknowledge honestly

### 2. Research {Brand} features

Read these files to understand the product's positioning and features:
- `website.config.ts` — brand name
- `src/content/pages/index/<lang>.mdx` — homepage
- Any pricing, features, or "about" page under `src/content/pages/`
- Relevant entries in `src/content/docs/` and `src/content/guides/` for feature depth
- Existing case studies in `src/content/client-cases/` for real-world proof

Identify differentiators that matter most for this specific competitor. The angle must be unique to this competitor.

### 3. Take screenshots

Take screenshots of the competitor to include in the blog post. Use the screenshot skill script:

```bash
node .claude/skills/screenshot/scripts/screenshot.js <url> <output.png>
```

**Competitor screenshots:**
- Homepage of the competitor → save in the blog post folder: `src/content/blog/alternative-{competitor-slug}/competitor-homepage.png`
- Key product pages (pricing, features) if relevant → same folder
- Reference with relative path: `![Description](./competitor-homepage.png)`

**{Brand} screenshots (shared, do NOT duplicate):**
Shared brand screenshots are stored in `src/assets/screenshots/` and reused across all alternative posts. Suggested set (create if missing, from the running dev server):
- `homepage.png`
- `features.png`
- `pricing.png`

Reference them from MDX with: `![Description](../../../assets/screenshots/homepage.png)`

If a new brand screenshot is needed, add it to `src/assets/screenshots/` (not in the blog post folder).

### 4. Style reference

Before writing, read 2-3 existing blog posts in `src/content/blog/` to match the site's tone and style. Any existing comparison or "alternative" post is the best template.

### 5. Write the post

Create `en.mdx` (and `fr.mdx` if the site is multilingual — check `langs` in `website.config.ts`) in `src/content/blog/alternative-{competitor-slug}/`.

#### Frontmatter

Match the blog collection schema in `src/content.config.ts`. For this template:

```yaml
---
title: 'Best Alternative to {Competitor} for {Use Case}'
summary: 'One-sentence summary highlighting the key differentiator'
date: {today YYYY-MM-DD}
image: './competitor-homepage.png'
similarPosts:
  - 'some-existing-comparison-slug'
---
```

The `image` field is the blog post thumbnail. Use the competitor homepage screenshot as the thumbnail image.

If the schema uses different field names in a given project (e.g. `description` instead of `summary`, or `similar` instead of `similarPosts`), follow the project's schema.

#### Post structure

Target **2,500-3,500 words**. Follow this structure:

1. **Opening paragraph** — The pain point driving people away, position {Brand} as the solution
2. **Competitor homepage screenshot** — Insert `![Competitor name homepage](./competitor-homepage.png)` before the first H2
3. **Acknowledge the competitor** (1 paragraph) — Respectfully recognize strengths
4. **Why teams look for alternatives** (H2) — 3-5 pain points from real user complaints
5. **How {Brand} approaches things differently** (H2) — 3-5 differentiators as H3s, led by benefits. Include the shared brand screenshots:
   - `features.png` — in the first differentiator section
   - `homepage.png` — in the main visual section
   - `pricing.png` — in the pricing comparison section (step 7)
6. **Feature comparison** (H2) — Markdown table, 8-12 features, honest, dated
7. **Pricing comparison** (H2) — Insert `pricing.png` after the H2, then real prices, TCO, mention any free tier / open source if applicable
8. **Who should choose which?** (H2) — Recommendation by use case, OK to recommend competitor
9. **Making the switch** (H2) — Migration ease, import features if any
10. **Conclusion** (no CTA button — CTAs are typically inserted by the blog layout)

#### Writing principles

See `references/alternative-page-guide.md` for the complete methodology. Key rules:

- Never denigrate the competitor. Be respectful and factual.
- Be honest. If the competitor is better at something, say so.
- Lead with benefits, not features.
- Frame by use case, not by superiority.
- Date your claims (pricing and features change).
- Recommend the competitor when appropriate — builds trust.
- Mirror language from real user reviews.
- Never link to the competitor's website. Mention them by name only, no hyperlinks.

#### SEO

- Title: include "{Competitor} alternative" + benefit, under 60 chars
- H2s: target secondary keywords and questions
- Naturally include variations: "alternative", "competitor", "vs"

#### Other locales

If the site ships multiple `langs`, write each version as a native article, not a translation. Same structure and information, natural phrasing in that language.

### 6. Verify

- Valid frontmatter in every language file, matches `src/content.config.ts`
- `similarPosts` references exist as actual blog slugs
- Post reads well and follows all guidelines
