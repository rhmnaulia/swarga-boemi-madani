import { describe, expect, it } from "vitest";
import { minatOptions, normalizeWa, parseLead, safePath } from "./lead";

const minat = minatOptions(["Granada", "Cordoba"]);
const form = {
	event: "form_survei",
	page: "/kontak",
	nama: "  Budi Santoso ",
	whatsapp: "0812-3456 7890",
	minat: "Rumah tipe Cordoba",
	hari: "Sabtu",
	catatan: "Sore saja",
	website: "",
};

describe("normalizeWa", () => {
	it.each([
		["081234567890", "6281234567890"],
		["+62 812 3456 7890", "6281234567890"],
		["6281234567890", "6281234567890"],
		["0812-3456-7890", "6281234567890"],
	])("%s -> %s", (raw, want) => expect(normalizeWa(raw)).toBe(want));

	it.each(["021345678", "0812", "08123456789012345", "abc", "", "+1 812 3456 7890"])(
		"rejects %s",
		(raw) => expect(normalizeWa(raw)).toBeNull(),
	);
});

describe("safePath", () => {
	it("keeps same-site paths", () =>
		expect(safePath("/tipe-rumah/cordoba")).toBe("/tipe-rumah/cordoba"));
	it.each(["//evil.com", "https://evil.com", "/\\evil.com", "kontak", 42])("drops %s", (p) =>
		expect(safePath(p)).toBe(""),
	);
});

describe("parseLead: form", () => {
	it("accepts a valid form and normalizes it", () => {
		const r = parseLead(form, minat);
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		expect(r.lead).toMatchObject({
			event: "form_survei",
			nama: "Budi Santoso",
			whatsapp: "6281234567890",
			house_type: "Cordoba",
			sumber: "langsung",
		});
	});

	it("treats a filled honeypot as spam", () => {
		expect(parseLead({ ...form, website: "http://spam" }, minat)).toEqual({
			ok: false,
			reason: "spam",
		});
	});

	it("lists every invalid field", () => {
		const r = parseLead(
			{ ...form, nama: "B", whatsapp: "123", minat: "Rumah tipe Palsu", hari: "Kapan-kapan" },
			minat,
		);
		expect(r).toEqual({
			ok: false,
			reason: "invalid",
			fields: ["nama", "whatsapp", "minat", "hari"],
		});
	});

	it("rejects a note over 500 characters", () => {
		const r = parseLead({ ...form, catatan: "x".repeat(501) }, minat);
		expect(r).toMatchObject({ ok: false, fields: ["catatan"] });
	});

	it("rejects unknown events", () => {
		expect(parseLead({ ...form, event: "hack" }, minat)).toMatchObject({ ok: false });
	});
});

describe("parseLead: wa_click", () => {
	it("needs no personal fields and derives the source", () => {
		const r = parseLead({
			event: "wa_click",
			page: "/tipe-rumah/cordoba",
			house_type: "Cordoba",
			referrer: "https://www.instagram.com/",
		});
		expect(r.ok && r.lead).toMatchObject({ house_type: "Cordoba", sumber: "instagram.com" });
	});

	it("prefers utm_source over the referrer", () => {
		const r = parseLead({
			event: "wa_click",
			utm_source: "tiktok",
			referrer: "https://google.com",
		});
		expect(r.ok && r.lead.sumber).toBe("tiktok");
	});

	it("caps field lengths", () => {
		const r = parseLead({ event: "wa_click", utm_campaign: "x".repeat(1000) });
		expect(r.ok && r.lead.utm_campaign.length).toBe(100);
	});
});
