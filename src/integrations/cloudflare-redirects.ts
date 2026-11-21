import type { AstroIntegration } from "astro";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { redirects } from "../redirects";

/**
 * Rewrites `dist/_redirects` for Cloudflare, which reads it before serving any
 * asset: the exact redirects of `src/redirects.ts` become real 301s (instead of
 * the meta refresh page Astro generates), followed by the rules of
 * `public/_redirects`.
 *
 * Cloudflare has no conditions (`Language=`, `Country=`) nor forced rules
 * (`302!`), so those lines are left out. The root language redirect they
 * implement on Netlify is done by the Worker (`worker/index.ts`).
 */
export default function cloudflareRedirects(): AstroIntegration {
  return {
    name: "cloudflare-redirects",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const file = fileURLToPath(new URL("_redirects", dir));

        const exact = Object.entries(redirects).map(([from, to]) => {
          const destination = typeof to === "string" ? to : to.destination;
          return `${encodeURI(from)} ${encodeURI(destination)} 301`;
        });

        const copied = existsSync(file)
          ? readFileSync(file, "utf-8").split("\n")
          : [];
        const kept: string[] = [];
        for (const line of copied) {
          const rule = line.trim();
          if (!rule || rule.startsWith("#")) continue;
          const [from, , status = "", ...rest] = rule.split(/\s+/);
          if (from === "/") continue;
          if (status.endsWith("!") || rest.length > 0) {
            logger.warn(`Left out, Cloudflare can't express it: ${rule}`);
            continue;
          }
          kept.push(rule);
        }

        writeFileSync(file, `${[...exact, ...kept].join("\n")}\n`);
      },
    },
  };
}
