import { describe, expect, it } from "vitest";
import { buildWaLink, WA_FALLBACK, waMessage } from "./wa";

const text = (url: string) => new URL(url).searchParams.get("text");

describe("buildWaLink", () => {
	it("uses the CMS number when it is valid", () => {
		expect(buildWaLink({ kind: "umum" }, "6281299998888")).toMatch(
			/^https:\/\/wa\.me\/6281299998888\?text=/,
		);
	});

	it.each([undefined, null, "", "08123", "+6281299998888"])("falls back for %s", (n) => {
		expect(buildWaLink({ kind: "umum" }, n)).toMatch(`https://wa.me/${WA_FALLBACK}?text=`);
	});

	it("encodes the house type message", () => {
		const url = buildWaLink({ kind: "tipe", nama: "Cordoba", luasBangunan: 45, luasTanah: 84 });
		expect(text(url)).toBe(
			"Halo, saya tertarik dengan rumah tipe Cordoba (45/84) di Swarga Boemi Madani. Boleh info harga dan sisa unit?",
		);
	});

	it("has the brief's messages for umum and konstruksi", () => {
		expect(text(buildWaLink({ kind: "umum" }))).toBe(
			"Halo, saya ingin info perumahan Swarga Boemi Madani.",
		);
		expect(text(buildWaLink({ kind: "konstruksi" }))).toBe(
			"Halo, saya ingin konsultasi jasa konstruksi.",
		);
	});
});

describe("waMessage: survei", () => {
	it("mentions the chosen interest", () => {
		expect(waMessage({ kind: "survei", minat: "Rumah tipe Cordoba" })).toBe(
			"Halo, saya baru mengisi form jadwal survei lokasi Swarga Boemi Madani untuk rumah tipe Cordoba.",
		);
	});

	it("leaves out a vague interest", () => {
		expect(waMessage({ kind: "survei", minat: "Lainnya" })).toBe(
			"Halo, saya baru mengisi form jadwal survei lokasi Swarga Boemi Madani.",
		);
		expect(waMessage({ kind: "survei" })).toBe(
			"Halo, saya baru mengisi form jadwal survei lokasi Swarga Boemi Madani.",
		);
	});
});
