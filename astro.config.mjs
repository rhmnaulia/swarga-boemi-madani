import cloudflare from "@astrojs/cloudflare";
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
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	// Fetch internal pages as their links scroll into view, so the tap that follows feels instant.
	// Astro skips this on Save-Data and 2G connections.
	prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
	devToolbar: { enabled: false },
});
