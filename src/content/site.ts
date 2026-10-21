// Facts that rarely change. Edit here, not in the CMS.

export const PROJECT_NAME = "Swarga Boemi Madani Residence";
export const SHORT_NAME = "Swarga Boemi Madani";
export const COMPANY = "PT. Abyakta Sadawira Bangun Mandiri";
export const COMPANY_SHORT = "PT ASBM";
export const TAGLINE = "Smart & Comfort Living";

export const ADDRESS = {
	street: "Jl. Merbabu RT.04 RW.03",
	village: "Desa Wero",
	district: "Kec. Gombong",
	regency: "Kab. Kebumen",
	province: "Jawa Tengah",
};
export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.village}, ${ADDRESS.district}, ${ADDRESS.regency}, ${ADDRESS.province}`;

export const WA_DISPLAY = "0811-2052-225";

// TODO(data): agency name and link for the footer credit (needs client agreement).
export const AGENCY_CREDIT: { name: string; url?: string } | null = null;

export const NAV = [
	{ href: "/tipe-rumah", label: "Tipe Rumah" },
	{ href: "/lokasi-fasilitas", label: "Lokasi & Fasilitas" },
	{ href: "/jasa-konstruksi", label: "Jasa Konstruksi" },
	{ href: "/progres", label: "Progres" },
	{ href: "/tentang", label: "Tentang Kami" },
	{ href: "/kontak", label: "Kontak" },
];
