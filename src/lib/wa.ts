import { SHORT_NAME } from "../content/site";

export const WA_FALLBACK = "628112052225";

export type WaContext =
	| { kind: "umum" }
	| { kind: "konstruksi" }
	| { kind: "tipe"; nama: string; luasBangunan: number; luasTanah: number }
	| { kind: "survei"; nama: string };

export function waMessage(ctx: WaContext): string {
	switch (ctx.kind) {
		case "tipe":
			return `Halo, saya tertarik dengan rumah tipe ${ctx.nama} (${ctx.luasBangunan}/${ctx.luasTanah}) di ${SHORT_NAME}. Boleh info harga dan sisa unit?`;
		case "konstruksi":
			return "Halo, saya ingin konsultasi jasa konstruksi.";
		case "survei":
			return `Halo, saya ${ctx.nama}. Saya baru mengisi form jadwal survei lokasi ${SHORT_NAME}.`;
		default:
			return `Halo, saya ingin info perumahan ${SHORT_NAME}.`;
	}
}

/** `number` is the CMS value (pengaturan.whatsapp); falls back to the marketing number. */
export function buildWaLink(ctx: WaContext, number?: string | null): string {
	const to = number && /^628\d{7,12}$/.test(number) ? number : WA_FALLBACK;
	return `https://wa.me/${to}?text=${encodeURIComponent(waMessage(ctx))}`;
}
