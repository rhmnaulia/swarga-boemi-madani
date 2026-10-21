/**
 * Penerima leads website Swarga Boemi Madani.
 * Website mengirim setiap klik WhatsApp dan form survei ke sini, lalu dicatat di sheet "Leads".
 * Cara pasang: lihat README.md di folder yang sama.
 */

var COLUMNS = [
	["Waktu", "timestamp"],
	["Jenis", "event"],
	["Halaman", "page"],
	["Tipe rumah", "house_type"],
	["Nama", "nama"],
	["WhatsApp", "whatsapp"],
	["Minat", "minat"],
	["Hari survei", "hari"],
	["Catatan", "catatan"],
	["Sumber", "sumber"],
	["utm_source", "utm_source"],
	["utm_medium", "utm_medium"],
	["utm_campaign", "utm_campaign"],
	["Referrer", "referrer"],
];

var EVENT_LABELS = { wa_click: "Klik WhatsApp", form_survei: "Form survei" };

/** Dipanggil oleh website. Menolak request tanpa secret yang benar. */
function doPost(e) {
	var data;
	try {
		data = JSON.parse(e.postData.contents);
	} catch (err) {
		return reply({ ok: false, error: "bad_json" });
	}

	var secret = PropertiesService.getScriptProperties().getProperty("LEADS_SECRET");
	if (!secret || data.secret !== secret) return reply({ ok: false, error: "unauthorized" });
	if (!EVENT_LABELS[data.event]) return reply({ ok: false, error: "bad_event" });

	var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
	if (!sheet) return reply({ ok: false, error: "no_leads_sheet" });

	var row = COLUMNS.map(function (col) {
		var key = col[1];
		if (key === "timestamp") {
			var t = new Date(data.timestamp);
			return isNaN(t.getTime()) ? new Date() : t;
		}
		if (key === "event") return EVENT_LABELS[data.event];
		if (key === "whatsapp") return waLink(data.whatsapp);
		return cell(data[key]);
	});

	var lock = LockService.getScriptLock();
	lock.waitLock(10000);
	try {
		sheet.appendRow(row);
	} finally {
		lock.releaseLock();
	}
	return reply({ ok: true });
}

/** Buka URL web app di browser untuk memastikan sudah aktif. */
function doGet() {
	return reply({ ok: true, service: "leads" });
}

/**
 * Jalankan sekali dari editor (pilih "setup" lalu Run).
 * Membuat sheet "Leads" dan "Ringkasan". Aman dijalankan ulang: data leads tidak dihapus.
 */
function setup() {
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	ss.setSpreadsheetTimeZone("Asia/Jakarta");

	var leads = ss.getSheetByName("Leads") || ss.insertSheet("Leads", 0);
	var headers = COLUMNS.map(function (col) {
		return col[0];
	});
	leads.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
	leads.setFrozenRows(1);
	leads.getRange("A2:A").setNumberFormat("dd/mm/yyyy hh:mm");

	var sum = ss.getSheetByName("Ringkasan") || ss.insertSheet("Ringkasan", 1);
	sum.clear();
	var empty = '"Belum ada data"';
	var blocks = [
		[
			"A1",
			"Per bulan",
			"select year(A), month(A)+1, count(A) where A is not null group by year(A), month(A)+1 pivot B order by year(A) desc, month(A)+1 desc label year(A) 'Tahun', month(A)+1 'Bulan'",
		],
		[
			"F1",
			"Per sumber",
			"select J, count(A) where A is not null group by J pivot B label J 'Sumber'",
		],
		[
			"J1",
			"Per tipe rumah",
			"select D, count(A) where A is not null and D <> '' group by D pivot B label D 'Tipe rumah'",
		],
	];
	blocks.forEach(function (b) {
		var title = sum.getRange(b[0]);
		title.setValue(b[1]).setFontWeight("bold");
		title.offset(1, 0).setFormula('=IFERROR(QUERY(Leads!A:N, "' + b[2] + '", 1), ' + empty + ")");
	});
	sum.setFrozenRows(2);
}

function reply(obj) {
	return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
		ContentService.MimeType.JSON,
	);
}

/** Teks apa adanya. Awalan =, +, -, @ dinetralkan supaya tidak dibaca sebagai rumus. */
function cell(value) {
	var s = value == null ? "" : String(value).slice(0, 500);
	return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** Nomor 628… jadi tautan yang bisa langsung diklik admin, ditampilkan sebagai 08…. */
function waLink(value) {
	var n = value == null ? "" : String(value);
	if (!/^628\d{7,12}$/.test(n)) return "";
	return '=HYPERLINK("https://wa.me/' + n + '", "0' + n.slice(2) + '")';
}
