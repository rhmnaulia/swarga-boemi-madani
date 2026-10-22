import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getHouseTypes } from "../../lib/cms";
import { minatOptions, parseLead, safePath, type Lead } from "../../lib/lead";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const type = request.headers.get("content-type") ?? "";
	const isBeacon = type.startsWith("text/plain") || type.startsWith("application/json");

	let input: Record<string, unknown>;
	try {
		input = isBeacon ? await request.json() : Object.fromEntries(await request.formData());
	} catch {
		return new Response(null, { status: 400 });
	}
	if (!input || typeof input !== "object") return new Response(null, { status: 400 });

	if (isBeacon) {
		const result = parseLead(input);
		if (result.ok) locals.cfContext.waitUntil(forward(result.lead));
		return new Response(null, { status: 204 });
	}

	const houses = await getHouseTypes();
	const result = parseLead(input, minatOptions(houses.map((h) => h.data.nama)));
	if (!result.ok && result.reason === "spam") return redirect("/terima-kasih", 303);

	if (result.ok && (await forward(result.lead))) {
		return redirect(`/terima-kasih?minat=${encodeURIComponent(result.lead.minat)}`, 303);
	}

	const back = new URL(safePath(input.page) || "/kontak", request.url);
	back.searchParams.set("gagal", "1");
	if (typeof input.minat === "string") back.searchParams.set("minat", input.minat);
	return redirect(`${back.pathname}${back.search}#survei`, 303);
};

async function forward(lead: Lead): Promise<boolean> {
	const url = env.LEADS_WEBHOOK_URL;
	const secret = env.LEADS_SECRET;
	if (!url || !secret) {
		console.warn("[lead] LEADS_WEBHOOK_URL / LEADS_SECRET not set, lead not stored:", lead);
		return import.meta.env.DEV;
	}
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ secret, ...lead }),
			signal: AbortSignal.timeout(10_000),
		});
		const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
		if (body?.ok) return true;
		console.error("[lead] Apps Script refused the lead:", res.status, body?.error);
	} catch (err) {
		console.error("[lead] could not reach Apps Script:", err);
	}
	return false;
}
