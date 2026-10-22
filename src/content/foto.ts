import manifest from "./foto.json";

export type FotoKey = keyof typeof manifest;

export const FOTO = manifest;

export const FOTO_ALT: Record<FotoKey, string> = {
	"brosur-granada": "Brosur Cluster Granada tipe 36/84: render, denah, dan spesifikasi",
	"brosur-cordoba": "Brosur Cluster Cordoba tipe 45/84: render, denah, dan spesifikasi",
	"brosur-andalusia": "Brosur Andalusia tipe 60/84, 2 lantai: render, denah, dan spesifikasi",
	"brosur-alexandria":
		"Brosur Alexandria tipe 80/136, 2 lantai dan rooftop: render, denah, dan spesifikasi",
	"brosur-masterplan": "Brosur masterplan, peta lokasi, dan fasilitas Swarga Boemi Madani",
	"brosur-book-now": "Brosur hunian nyaman untuk keluarga tercinta, dengan kontak marketing",
	"poster-pemandangan": "Poster hunian modern dengan pemandangan yang indah",
	"fasad-3-tipe": "Ilustrasi fasad tiga tipe rumah",
	"goody-bag": "Penyerahan goody bag saat serah terima",
	"rei-balaikota": "Kegiatan REI di Balai Kota Semarang",
	"rei-diklat-pajak": "Diklat dan sosialisasi pajak REI",
	"presentasi-2": "Presentasi perumahan ke instansi dan sekolah",
	"presentasi-3": "Presentasi perumahan ke instansi dan sekolah",
	"presentasi-4": "Presentasi perumahan ke instansi dan sekolah",
	"presentasi-5": "Presentasi perumahan ke instansi dan sekolah",
	"granada-unit": "Unit rumah tipe Granada yang sudah jadi",
	"granada-render": "Ilustrasi deretan rumah tipe Granada",
	"granada-denah": "Denah rumah tipe Granada 36/84",
	"cordoba-render": "Ilustrasi deretan rumah tipe Cordoba",
	"cordoba-denah": "Denah rumah tipe Cordoba 45/84",
	"andalusia-render": "Ilustrasi deretan rumah tipe Andalusia, 2 lantai",
	"andalusia-denah": "Denah rumah tipe Andalusia 60/84, lantai 1 dan 2",
	"alexandria-render": "Ilustrasi rumah tipe Alexandria, 2 lantai dengan rooftop",
	"alexandria-denah": "Denah rumah tipe Alexandria 80/136, lantai 1, lantai 2, dan rooftop",
	"alexandria-jalan": "Ilustrasi jalan di Cluster Alexandria 80/136",
	"kawasan-udara": "Ilustrasi kawasan Swarga Boemi Madani dari udara",
	"qc-inspeksi": "Pembeli dan tim QC memeriksa rumah sebelum serah terima",
	"progres-pondasi": "Pekerjaan pondasi",
	"progres-2-lantai": "Pembangunan unit 2 lantai",
	"progres-paving": "Pemasangan paving jalan",
	"akad-serah-terima": "Kolase proses akad dan serah terima unit",
	"akad-jual-beli": "Kolase akad jual beli dan penyerahan goody bag",
	tmo: "Kolase ruang Town Management Office",
	"rei-academy": "Tim PT ASBM di seminar REI Academy",
	"rei-pertemuan": "Pertemuan anggota REI",
	"presentasi-1": "Presentasi perumahan ke instansi dan sekolah",
	"presentasi-6": "Presentasi perumahan ke instansi dan sekolah",
	"logo-asbm": "Logo PT. Abyakta Sadawira Bangun Mandiri",
};

export const BROSUR_TIPE: Record<string, FotoKey> = {
	granada: "brosur-granada",
	cordoba: "brosur-cordoba",
	andalusia: "brosur-andalusia",
	alexandria: "brosur-alexandria",
};

export const BROSUR: FotoKey[] = [
	"brosur-masterplan",
	"brosur-granada",
	"brosur-cordoba",
	"brosur-andalusia",
	"brosur-alexandria",
	"poster-pemandangan",
	"brosur-book-now",
];

export const FOTO_TIPE: Record<string, { foto: FotoKey; galeri: FotoKey[]; denah: FotoKey }> = {
	granada: { foto: "granada-unit", galeri: ["granada-render"], denah: "granada-denah" },
	cordoba: { foto: "cordoba-render", galeri: [], denah: "cordoba-denah" },
	andalusia: { foto: "andalusia-render", galeri: [], denah: "andalusia-denah" },
	alexandria: {
		foto: "alexandria-render",
		galeri: ["alexandria-jalan"],
		denah: "alexandria-denah",
	},
};
