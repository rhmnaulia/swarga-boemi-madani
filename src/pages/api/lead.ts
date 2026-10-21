import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getHouseTypes } from "../../lib/cms";
import { minatOptions, parseLead, safePath, type Lead } from "../../lib/lead";

/**
 * Two callers:
 * - WhatsApp click beacon (JSON body, sent as text/plain by `navigator.sendBeacon`): answered
 *   with 204 at once, forwarded in the background.
 * - Survey form (plain HTML form post, works without JS): forwarded before answering, so a
 *   lead is never reported as sent when it was not. 303 to the thank-you page or back to the form.
 */
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
	// Bots get the same answer as people, so the honeypot is not revealed.
	if (!result.ok && result.reason === "spam") return redirect("/terima-kasih", 303);

	if (result.ok && (await forward(result.lead))) {
		return redirect(`/terima-kasih?minat=${encodeURIComponent(result.lead.minat)}`, 303);
	}

	const back = new URL(safePath(input.page) || "/kontak", request.url);
	back.searchParams.set("gagal", "1");
	if (typeof input.minat === "string") back.searchParams.set("minat", input.minat);
	return redirect(`${back.pathname}${back.search}#survei`, 303);
};

/** Sends one lead to the Apps Script web app. True only when the Sheet confirms the row. */
async function forward(lead: Lead): Promise<boolean> {
	const url = env.LEADS_WEBHOOK_URL;
	const secret = env.LEADS_SECRET;
	if (!url || !secret) {
		console.warn("[lead] LEADS_WEBHOOK_URL / LEADS_SECRET not set, lead not stored:", lead);
		// Lets the form be tried locally; in production a missing secret must show as a failure.
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
