import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, kvCache, r2 } from "@emdash-cms/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare({ imageService: "cloudflare-binding" }),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto", coalesce: true }),
			storage: r2({ binding: "MEDIA" }),
			objectCache: kvCache({ binding: "CACHE" }),
			// Same HTML for every visitor, so pages can sit in the edge cache. Editors get an
			// "Edit" pill that reloads the page uncached with the toolbar.
			toolbar: "client",
		}),
	],
	// Public pages are cached at Cloudflare's edge. Publishing in the admin (and the cron that
	// publishes scheduled entries) purges the affected pages by tag, so edits still show at once.
	// maxAge only bounds pages that hold no CMS content.
	cache: { provider: cacheCloudflare() },
	routeRules: Object.fromEntries(
		[
			"/",
			"/tipe-rumah",
			"/tipe-rumah/[slug]",
			"/lokasi-fasilitas",
			"/jasa-konstruksi",
			"/progres",
			"/tentang",
			"/kontak",
			"/sitemap.xml",
		].map((route) => [route, { maxAge: 300, swr: 3600 }]),
	),
	vite: {
		plugins: [tailwindcss()],
	},
	// Fetch internal pages as their links scroll into view, so the tap that follows feels instant.
	// Astro skips this on Save-Data and 2G connections.
	prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
	devToolbar: { enabled: false },
});
