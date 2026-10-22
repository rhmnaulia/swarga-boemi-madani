import type { APIRoute } from "astro";
import { NAV } from "../content/site";
import { getHouseTypes } from "../lib/cms";
import { siteOrigin } from "../lib/seo";

export const GET: APIRoute = async ({ url, cache }) => {
	const origin = siteOrigin(url);
	const houses = await getHouseTypes(cache);
	const paths = ["/", ...NAV.map((n) => n.href), ...houses.map((h) => `/tipe-rumah/${h.id}`)];

	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`),
		"</urlset>",
	].join("\n");

	return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
