import type { IconName } from "../components/icons";

export const KEUNGGULAN: { icon: IconName; title: string; text: string }[] = [
	{ icon: "gate", title: "One gate system", text: "Satu pintu masuk, lingkungan lebih tertib." },
	{ icon: "shield", title: "Keamanan 24 jam", text: "Petugas berjaga siang dan malam." },
	{ icon: "road", title: "Jalan utama 9 m", text: "Lega untuk dua mobil berpapasan." },
	{ icon: "lock", title: "Smart lock door", text: "Pintu depan tanpa kunci konvensional." },
	{ icon: "mosque", title: "Masjid", text: "Ibadah berjamaah di dalam kawasan." },
	{ icon: "tree", title: "Taman & playground", text: "Ruang main anak dan tempat bersantai." },
	{
		icon: "building",
		title: "Town Management Office",
		text: "Kantor pengelola untuk urusan warga.",
	},
	{ icon: "badge", title: "Anggota REI", text: "Developer resmi, NPA 02-01085." },
];

export const BEBAS_BIAYA = "Gratis SHM, BPHTB, AJB, balik nama & notaris";

export const MATERIAL = [
	{ part: "Cat", brand: "Jotun" },
	{ part: "Genteng", brand: "Sokka" },
	{ part: "Pintu depan", brand: "Kayu jati" },
	{ part: "Lantai", brand: "Keramik motif granit" },
];

export const QC_STEPS = [
	{
		title: "Persetujuan material",
		text: "Material dicek dan disetujui sebelum dipakai di lapangan.",
	},
	{
		title: "Pengecekan adukan",
		text: "Takaran adukan semen dan beton diperiksa selama pengerjaan.",
	},
	{
		title: "Inspeksi bersama pembeli",
		text: "Rumah dicek bersama sebelum serah terima kunci.",
	},
];
