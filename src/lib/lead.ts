export const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu", "Fleksibel"];

export function minatOptions(tipe: string[]): string[] {
	return [...tipe.map((t) => `Rumah tipe ${t}`), "Jasa konstruksi", "Lainnya"];
}

export type LeadEvent = "wa_click" | "form_survei";

export interface Lead {
	timestamp: string;
	event: LeadEvent;
	page: string;
	house_type: string;
	nama: string;
	whatsapp: string;
	minat: string;
	hari: string;
	catatan: string;
	sumber: string;
	utm_source: string;
	utm_medium: string;
	utm_campaign: string;
	referrer: string;
}

export type ParseResult =
	| { ok: true; lead: Lead }
	| { ok: false; reason: "spam" }
	| { ok: false; reason: "invalid"; fields: string[] };

export function normalizeWa(raw: string): string | null {
	const m = /^(?:\+?62|0)(8\d{7,12})$/.exec(raw.replace(/[\s\-.()]/g, ""));
	return m ? `62${m[1]}` : null;
}

export function safePath(raw: unknown): string {
	const s = text(raw, 200);
	return s.startsWith("/") && !s.startsWith("//") && !s.includes("\\") ? s : "";
}

function text(raw: unknown, max: number): string {
	if (typeof raw !== "string") return "";
	return raw
		.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
		.trim()
		.slice(0, max);
}

function hostOf(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}

export function parseLead(
	input: Record<string, unknown>,
	minat: string[] = [],
	now = new Date(),
): ParseResult {
	if (text(input.website, 200)) return { ok: false, reason: "spam" };

	const event = input.event;
	if (event !== "wa_click" && event !== "form_survei") {
		return { ok: false, reason: "invalid", fields: ["event"] };
	}

	const referrer = text(input.referrer, 300);
	const utm_source = text(input.utm_source, 100);
	const lead: Lead = {
		timestamp: now.toISOString(),
		event,
		page: safePath(input.page),
		house_type: text(input.house_type, 40),
		nama: "",
		whatsapp: "",
		minat: "",
		hari: "",
		catatan: "",
		sumber: utm_source || hostOf(referrer) || "langsung",
		utm_source,
		utm_medium: text(input.utm_medium, 100),
		utm_campaign: text(input.utm_campaign, 100),
		referrer,
	};
	if (event === "wa_click") return { ok: true, lead };

	const fields: string[] = [];
	const rawNama = typeof input.nama === "string" ? input.nama.trim() : "";
	if (rawNama.length < 2 || rawNama.length > 80) fields.push("nama");
	const whatsapp = normalizeWa(typeof input.whatsapp === "string" ? input.whatsapp : "");
	if (!whatsapp) fields.push("whatsapp");
	const pilihan = text(input.minat, 100);
	if (!minat.includes(pilihan)) fields.push("minat");
	const hari = text(input.hari, 20);
	if (!HARI.includes(hari)) fields.push("hari");
	const rawCatatan = typeof input.catatan === "string" ? input.catatan.trim() : "";
	if (rawCatatan.length > 500) fields.push("catatan");
	if (fields.length > 0) return { ok: false, reason: "invalid", fields };

	lead.nama = text(rawNama, 80);
	lead.whatsapp = whatsapp!;
	lead.minat = pilihan;
	lead.hari = hari;
	lead.catatan = text(rawCatatan, 500);
	if (pilihan.startsWith("Rumah tipe ")) lead.house_type = pilihan.slice("Rumah tipe ".length);
	return { ok: true, lead };
}
