import config from "../website.config";

interface Env {
  ASSETS: Fetcher;
}

const { langs, defaultLang } = config;

/** Best supported language of an `Accept-Language` header, by quality value. */
function pickLang(header: string | null): string {
  const ranked = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.split("-")[0], q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q);
  const match = ranked.find(({ lang }) =>
    (langs as readonly string[]).includes(lang),
  );
  return match?.lang ?? defaultLang;
}

/**
 * Only `/` reaches this Worker (`run_worker_first` in `wrangler.jsonc`): it
 * redirects to the visitor's language, as `public/_redirects` does on Netlify.
 * Every other request is served straight from the static assets.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      url.pathname = `/${pickLang(request.headers.get("Accept-Language"))}`;
      return new Response(null, {
        status: 302,
        headers: { Location: url.toString(), Vary: "Accept-Language" },
      });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
