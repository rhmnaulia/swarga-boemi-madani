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
			toolbar: "client",
		}),
	],
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
	prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
	devToolbar: { enabled: false },
});
