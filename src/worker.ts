import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
	...handler,
	async fetch(request, env, ctx) {
		const response = await handler.fetch!(request, env, ctx);
		const workersDev = new URL(request.url).hostname.endsWith(".workers.dev");
		if (!workersDev && response.status < 500) return response;

		// Headers can be read-only (redirects, assets): copy before setting.
		const out = new Response(response.body, response);
		// A server error (e.g. while the database migrates) must never sit in the edge cache.
		if (response.status >= 500) {
			out.headers.set("Cloudflare-CDN-Cache-Control", "no-store");
			out.headers.delete("Cache-Tag");
		}
		// The workers.dev address is for testing only: keep it out of search results so it never
		// competes with the real domain.
		if (workersDev) out.headers.set("X-Robots-Tag", "noindex, nofollow");
		return out;
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler<Env>;
