import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
	...handler,
	async fetch(request, env, ctx) {
		const response = await handler.fetch!(request, env, ctx);
		const workersDev = new URL(request.url).hostname.endsWith(".workers.dev");
		if (!workersDev && response.status < 500) return response;

		const out = new Response(response.body, response);
		if (response.status >= 500) {
			out.headers.set("Cloudflare-CDN-Cache-Control", "no-store");
			out.headers.delete("Cache-Tag");
		}
		if (workersDev) out.headers.set("X-Robots-Tag", "noindex, nofollow");
		return out;
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler<Env>;
