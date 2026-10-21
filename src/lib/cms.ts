import { getEmDashCollection, getEmDashEntry } from "emdash";
import type { CacheHint } from "emdash";

/** `Astro.cache`; pass it so publishing in the admin invalidates cached pages. */
type RouteCache = { enabled: boolean; set(hint: CacheHint): void } | undefined;

function remember(cache: RouteCache, hint: CacheHint | undefined) {
	if (cache?.enabled && hint) cache.set(hint);
}

export const WA_FALLBACK = "628112052225";

export async function getPengaturan(cache?: RouteCache) {
	const { entries, cacheHint } = await getEmDashCollection("pengaturan", { limit: 1 });
	remember(cache, cacheHint);
	return entries[0]?.data ?? null;
}

export async function getHouseTypes(cache?: RouteCache) {
	const { entries, cacheHint } = await getEmDashCollection("house_type", {
		orderBy: { urutan: "asc" },
	});
	remember(cache, cacheHint);
	return entries;
}

export async function getHouseType(slug: string, cache?: RouteCache) {
	const { entry, cacheHint } = await getEmDashEntry("house_type", slug);
	remember(cache, cacheHint);
	return entry ?? null;
}

export async function getProjects(cache?: RouteCache) {
	const { entries, cacheHint } = await getEmDashCollection("construction_project");
	remember(cache, cacheHint);
	return entries.filter((e) => e.data.tampilkan === true);
}

export async function getProgress(cache?: RouteCache) {
	const { entries, cacheHint } = await getEmDashCollection("progress_update", {
		orderBy: { tanggal: "desc" },
		limit: 30,
	});
	remember(cache, cacheHint);
	return entries;
}

/** Only testimonials with written permission (izin tertulis) may ever be shown. */
export async function getTestimonials(cache?: RouteCache) {
	const { entries, cacheHint } = await getEmDashCollection("testimonial");
	remember(cache, cacheHint);
	return entries.filter((e) => e.data.izin_tertulis === true);
}
