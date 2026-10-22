import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "SBM_Foto_Website");
const out = path.join(root, "public/foto");
const WIDTHS = [480, 960, 1440];

const BROSUR = "03_Pamflet_Brosur";
const PROGRES = "04_Unit_dan_Progres";
const AKAD = "05_Akad_Serah_Terima_QC";
const KEGIATAN = "06_Kegiatan_Kredibilitas";

const PHOTOS = {
	"brosur-granada": [`${BROSUR}/brosur_IG_granada_36.png`],
	"brosur-cordoba": [`${BROSUR}/brosur_IG_cordoba_45.png`],
	"brosur-andalusia": [`${BROSUR}/brosur_IG_andalusia_60.png`],
	"brosur-alexandria": [`${BROSUR}/brosur_IG_alexandria_80.png`],
	"brosur-masterplan": [`${BROSUR}/brosur_IG_masterplan_fasilitas.png`],
	"brosur-book-now": [`${BROSUR}/brosur_hunian_nyaman_book_now.jpg`],
	"poster-pemandangan": [`${BROSUR}/poster_hunian_modern_pemandangan_indah.jpg`],
	"granada-render": [`${BROSUR}/brosur_IG_granada_36.png`, [290, 300, 1123, 840, 1123, 1585]],
	"granada-denah": [`${BROSUR}/brosur_IG_granada_36.png`, [20, 950, 360, 1580, 1123, 1585]],
	"cordoba-render": [`${BROSUR}/brosur_IG_cordoba_45.png`, [190, 255, 740, 805, 1091, 1541]],
	"cordoba-denah": [`${BROSUR}/brosur_IG_cordoba_45.png`, [15, 885, 345, 1510, 1091, 1541]],
	"andalusia-render": [`${BROSUR}/brosur_IG_andalusia_60.png`, [235, 300, 670, 640, 1084, 1521]],
	"andalusia-denah": [`${BROSUR}/brosur_IG_andalusia_60.png`, [20, 880, 650, 1495, 1084, 1521]],
	"alexandria-render": [`${BROSUR}/brosur_IG_alexandria_80.png`, [215, 340, 785, 800, 1126, 1588]],
	"alexandria-denah": [`${BROSUR}/brosur_IG_alexandria_80.png`, [20, 890, 735, 1320, 1126, 1588]],
	"alexandria-jalan": ["02_Render/render_jalan_cluster_alexandria.jpg"],
	"kawasan-udara": ["02_Render/render_udara_kawasan.jpg"],
	"fasad-3-tipe": ["02_Render/render_kolase_fasad_3_tipe.jpg"],
	"granada-unit": [`${PROGRES}/foto_unit_granada_sudah_jadi.jpg`],
	"progres-pondasi": [`${PROGRES}/pekerjaan_pondasi.jpg`],
	"progres-2-lantai": [`${PROGRES}/progres_unit_2_lantai.jpg`],
	"progres-paving": [`${PROGRES}/pemasangan_paving.jpg`],
	"qc-inspeksi": [`${AKAD}/inspeksi_QC_serah_terima.jpg`, [0, 0, 720, 1090, 720, 1280]],
	"akad-serah-terima": [`${AKAD}/kolase_akad_dan_serah_terima.jpg`],
	"akad-jual-beli": [`${AKAD}/kolase_akad_jual_beli.jpg`],
	"goody-bag": [`${AKAD}/penyerahan_goody_bag.jpg`],
	tmo: [`${AKAD}/kolase_town_management_office.jpg`],
	"rei-academy": [`${KEGIATAN}/REI_academy_seminar.jpg`],
	"rei-pertemuan": [`${KEGIATAN}/REI_pertemuan.jpg`],
	"rei-balaikota": [`${KEGIATAN}/REI_balaikota_semarang.jpg`],
	"rei-diklat-pajak": [`${KEGIATAN}/REI_diklat_pajak.jpg`],
	"presentasi-1": [`${KEGIATAN}/presentasi_instansi_1.jpg`],
	"presentasi-2": [`${KEGIATAN}/presentasi_instansi_2.jpg`],
	"presentasi-3": [`${KEGIATAN}/presentasi_instansi_3.jpg`],
	"presentasi-4": [`${KEGIATAN}/presentasi_instansi_4.jpg`],
	"presentasi-5": [`${KEGIATAN}/presentasi_instansi_5.jpg`],
	"presentasi-6": [`${KEGIATAN}/presentasi_instansi_6.jpg`],
	"logo-asbm": ["01_Logo/logo_PT_ASBM.jpg"],
};

const load = async (file, crop) => {
	const input = sharp(path.join(src, file)).rotate();
	if (!crop) return input;
	const { width, height } = await input.metadata();
	const [x0, y0, x1, y1, rw, rh] = crop;
	const sx = width / rw;
	const sy = height / rh;
	return input.extract({
		left: Math.round(x0 * sx),
		top: Math.round(y0 * sy),
		width: Math.round((x1 - x0) * sx),
		height: Math.round((y1 - y0) * sy),
	});
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const manifest = {};
for (const [key, [file, crop]] of Object.entries(PHOTOS)) {
	const { data, info } = await (await load(file, crop)).toBuffer({ resolveWithObject: true });
	const max = Math.min(info.width, WIDTHS.at(-1));
	const widths = [...WIDTHS.filter((w) => w < max), max];
	for (const w of widths) {
		await sharp(data).resize({ width: w }).webp({ quality: 80 }).toFile(`${out}/${key}-${w}.webp`);
	}
	manifest[key] = { width: max, height: Math.round((info.height * max) / info.width), widths };
}
fs.writeFileSync(
	path.join(root, "src/content/foto.json"),
	`${JSON.stringify(manifest, null, "\t")}\n`,
);

await sharp(path.join(src, "01_Logo/logo_SBM_transparan.png"))
	.trim()
	.png({ compressionLevel: 9 })
	.toFile(path.join(root, "public/logo-sbm.png"));

const monogram = await sharp(path.join(src, "01_Logo/logo_SBM_transparan.png"))
	.extract({ left: 8, top: 14, width: 199, height: 150 })
	.toBuffer();
const icon = (size, pad) =>
	sharp(monogram)
		.resize({ width: size - pad * 2, height: size - pad * 2, fit: "contain", background: "#fff0" })
		.extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#ffffff" })
		.flatten({ background: "#ffffff" })
		.png();
await icon(180, 18).toFile(path.join(root, "public/apple-touch-icon.png"));
await icon(96, 6).toFile(path.join(root, "public/favicon-96.png"));
const png = await icon(32, 1).toBuffer();
const head = Buffer.alloc(22);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6);
head.writeUInt8(32, 7);
head.writeUInt16LE(1, 10);
head.writeUInt16LE(32, 12);
head.writeUInt32LE(png.length, 14);
head.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(root, "public/favicon.ico"), Buffer.concat([head, png]));

console.log(`${Object.keys(manifest).length} photos -> public/foto/, logo and icons -> public/`);
