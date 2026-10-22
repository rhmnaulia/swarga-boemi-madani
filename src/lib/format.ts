export const HARGA_FALLBACK = "Hubungi kami untuk harga";

const rupiah = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
});

export function hargaLabel(h: { harga?: number | null; label_harga?: string | null }): string {
	if (h.label_harga?.trim()) return h.label_harga.trim();
	if (typeof h.harga === "number" && h.harga > 0) return rupiah.format(h.harga);
	return HARGA_FALLBACK;
}

const tanggal = new Intl.DateTimeFormat("id-ID", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "Asia/Jakarta",
});

export function formatTanggal(value: string | Date): string {
	const d = value instanceof Date ? value : new Date(value);
	return Number.isNaN(d.getTime()) ? "" : tanggal.format(d);
}

export function lantaiLabel(lantai: string): string {
	return lantai.trim().replace(/^(\d+)/, "$1 lantai");
}
