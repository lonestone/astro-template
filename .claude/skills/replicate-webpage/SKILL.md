---
name: replicate-webpage
description: Replicate a web page, with its content and design
argument-hint: "[url]"
---

Replicate the target webpage with pixel-perfect Tailwind CSS:

1. Use Playwright MCP to navigate to the URL and capture accessibility tree
2. Use Web Inspector MCP to extract computed styles for all visible sections
3. Take a high-resolution screenshot as visual reference
4. Generate Astro + Tailwind CSS matching exact extracted values
5. Render at localhost, screenshot the result, compare with original
6. Iterate on differences until matching

## Instructions

- Check on different screen sizes: xs, sm, md, lg
- Inspect to find exact styles (font-weight, font-size, colors, etc)
- Inspect to find exact sources for medias (videos, images)
