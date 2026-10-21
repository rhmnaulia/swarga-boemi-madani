# PLAN Fase 1: Website Swarga Boemi Madani Residence

Dokumen ini adalah brief untuk membangun website fase 1. Baca seluruhnya sebelum mulai coding. Kerjakan per milestone (M0 sampai M4), dan berhenti untuk konfirmasi di akhir tiap milestone.

---

## 1. Konteks

- **Client:** PT. Abyakta Sadawira Bangun Mandiri (PT ASBM), developer perumahan dan kontraktor. Berdiri Mei 2022, anggota REI (NPA 02-01085).
- **Proyek:** Swarga Boemi Madani Residence (SBM), Jl. Merbabu RT.04 RW.03, Desa Wero, Kec. Gombong, Kab. Kebumen, Jawa Tengah.
- **Tagline:** "Smart & Comfort Living"
- **Situasi:** sisa unit rumah kurang dari 10. Website harus tetap berguna setelah stok habis, jadi juga berfungsi sebagai profil developer dan sumber leads jasa konstruksi.
- **Tujuan bisnis:** leads masuk (chat WhatsApp dan form survei), tercatat dan bisa diukur.
- **Pengunjung:** hampir semuanya dari HP, datang dari Instagram, TikTok, Facebook, dan Google ("perumahan Gombong").
- **Model kerja:** proyek gratis dari agency 2 orang, serah terima putus. Setelah live, website dikelola admin client yang **non-teknis**. Semua keputusan teknis harus mengutamakan **maintenance mendekati nol**.

## 2. Prinsip

1. Mobile-first, ringan, cepat. Target Lighthouse mobile >= 90 untuk Performance, SEO, Accessibility.
2. Tidak ada server yang perlu dirawat. Jalan di Cloudflare Workers (serverless), konten dari EmDash langsung live tanpa rebuild.
3. Admin hanya mengedit hal yang memang sering berubah. Sisanya hardcode.
4. Semua akun (domain, hosting, CMS, Google) atas nama client.
5. Jangan menambah fitur di luar scope (lihat bagian 10).

## 3. Tech stack

| Bagian           | Pilihan                                                                    | Catatan                                                        |
| ---------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Framework        | Astro + TypeScript                                                         | Server rendering (SSR), adapter `@astrojs/cloudflare`          |
| CMS              | EmDash (https://emdashcms.com, docs: https://docs.emdashcms.com)           | Admin di `/_emdash/admin`, login passkey                       |
| Styling          | Tailwind CSS                                                               |                                                                |
| Font             | Plus Jakarta Sans                                                          | Self-host atau via Astro fonts                                 |
| Hosting          | Cloudflare Workers                                                         | Akun Cloudflare atas nama client                               |
| Database         | Cloudflare D1 (binding `DB`)                                               |                                                                |
| Media            | Cloudflare R2 (binding `MEDIA`)                                            |                                                                |
| Gambar           | Cloudflare Images binding (`IMAGES`, `imageService: "cloudflare-binding"`) | Free plan 5.000 transformasi unik/bulan, cukup untuk situs ini |
| Pencatatan leads | Astro API route -> Google Apps Script -> Google Sheet                      | Client bisa buka Sheet sendiri                                 |
| Analytics        | GA4 + Google Search Console                                                |                                                                |

Mulai dari `npm create emdash@latest`, lalu ikuti https://docs.emdashcms.com/deployment/cloudflare/.

### Catatan penting EmDash

- **EmDash masih baru** (README GitHub masih menyebut "beta preview"). Kunci versi di `package.json` (tanpa `^`), jangan upgrade otomatis.
- **Passkey terikat ke origin.** Passkey yang dibuat saat setup hanya berlaku di domain tempat setup dilakukan. Set `EMDASH_SITE_URL` ke domain final **sebelum** setup admin produksi. Selama domain belum diputuskan, pakai `workers.dev` hanya untuk development, dan siapkan ulang akun admin setelah domain final terpasang. Aktifkan juga fallback magic link (lihat https://docs.emdashcms.com/guides/authentication/) supaya admin tidak terkunci kalau ganti HP.
- **Domain harus dikelola Cloudflare** di akun yang sama dengan Worker (custom domain via `wrangler.jsonc`).
- **Backup `EMDASH_ENCRYPTION_KEY`** dan simpan di password manager client. Tanpa ini plugin secrets tidak bisa didekripsi.
- **Jangan pakai plugin marketplace/sandboxed** di fase 1, supaya tidak butuh binding `LOADER` (Dynamic Workers) dan tidak menambah maintenance.
- Cek kuota free tier Workers, D1, R2, dan Images saat setup, catat di README.

## 4. Struktur halaman

| Route                | Isi                                                                                                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | Hero (foto/render + tagline + headline "Hunian modern dengan pemandangan yang indah"), badge "Gratis SHM, BPHTB, AJB, balik nama & notaris", status sisa unit, grid 8 keunggulan (ikon), kartu 4 tipe rumah, cuplikan jasa konstruksi, testimoni, CTA WhatsApp |
| `/tipe-rumah`        | Daftar 4 tipe dengan status ketersediaan                                                                                                                                                                                                                       |
| `/tipe-rumah/[slug]` | Galeri, denah, tabel spesifikasi, fitur/bonus, status & sisa unit, harga (atau "Hubungi kami"), CTA WA dengan pesan berisi nama tipe                                                                                                                           |
| `/lokasi-fasilitas`  | Embed Google Maps, patokan sekitar (Masjid At Tauhid, SMK Yapek Gombong, Jl. Yos Sudarso), fasilitas, foto lingkungan, gambar masterplan statis                                                                                                                |
| `/jasa-konstruksi`   | Layanan, kota yang dilayani, portofolio proyek (dari CMS), alur kerja sama, CTA konsultasi WA                                                                                                                                                                  |
| `/progres`           | Update progres pembangunan dan proses QC (dari CMS)                                                                                                                                                                                                            |
| `/tentang`           | Profil PT ASBM, pendiri, nilai "CARE", legalitas, keanggotaan REI                                                                                                                                                                                              |
| `/kontak`            | WA, email, alamat, peta, semua sosmed, form "Jadwalkan Survei Lokasi"                                                                                                                                                                                          |

Komponen global: header dengan nav, footer (kontak, sosmed, NIB, REI, credit agency kecil), **tombol WhatsApp melayang di semua halaman**.

### Data tipe rumah (seed awal)

| Slug       | Cluster    | LB/LT  | Lantai      | Kamar                | Listrik | Fitur                               |
| ---------- | ---------- | ------ | ----------- | -------------------- | ------- | ----------------------------------- |
| granada    | Granada    | 36/84  | 1           | 2 KT, 1 KM           | 1300 W  | Hampir habis                        |
| cordoba    | Cordoba    | 45/84  | 1           | 2 KT, 1 KM           | 1300 W  | Smart lock door                     |
| andalusia  | Andalusia  | 60/84  | 2           | 3 KT, 2 KM, balkon   | 2200 W  | Smart lock, AC 3/4 PK               |
| alexandria | Alexandria | 80/136 | 2 + rooftop | 4+1 KT, 4 KM, balkon | 2200 W  | Smart lock, AC 3/4 PK, water heater |

Harga dan sisa unit per tipe: **belum ada** (pakai placeholder, lihat bagian 11).

### 8 keunggulan (hardcode)

One gate system, Keamanan 24 jam, Jalan utama 9 m, Smart lock door, Masjid, Taman & playground, Town Management Office, Anggota REI.

### Nilai jual untuk copy

- Gratis biaya surat: SHM, BPHTB, AJB, balik nama, notaris
- QC terdokumentasi: persetujuan material, pengecekan adukan, inspeksi bersama pembeli sebelum serah terima ("Dicek bersama sebelum serah terima")
- Material jelas: cat Jotun, genteng Sokka, pintu depan jati, keramik motif granit
- Developer resmi: anggota REI, legalitas lengkap, akad di notaris

### Legalitas yang ditampilkan di `/tentang`

- NIB 1406220004905
- Anggota REI, NPA 02-01085
- Akta Pendirian No. 100 (27 Mei 2022), Notaris Maya Dianasari, S.H.
- Proyek: IPPT, Site Plan, PBG keempat cluster (November 2022), UKL-UPL (2022), Rekomendasi PLN, Rekomendasi PDAM

**Jangan tampilkan NPWP.**

## 5. Content model (EmDash)

Definisikan semua collection di `seed/seed.json` (lihat https://docs.emdashcms.com/concepts/collections/ dan halaman Seed File Format), supaya bisa direproduksi dan masuk git. Slug collection tidak bisa diubah setelah dibuat, jadi pakai slug di bawah apa adanya.

> Catatan implementasi (M0): EmDash mewajibkan slug snake_case dan mencadangkan `status`. Lihat README bagian "Content model" untuk pemetaan nama.

Prinsip: field sesedikit mungkin, label dan deskripsi field dalam Bahasa Indonesia yang mudah dipahami admin awam. Matikan collection bawaan yang tidak dipakai (mis. posts, comments) agar admin tidak bingung.

Tipe field yang tersedia di EmDash: `string`, `text`, `slug`, `url`, `number`, `integer`, `boolean`, `datetime`, `select`, `multiSelect`, `portableText`, `json`, `repeater`, `blocks`, `image`, `file`, `reference`.

Untuk `siteSettings`: cek dulu apakah EmDash punya fitur site settings bawaan. Jika tidak, buat collection `pengaturan` berisi tepat satu entri.

**`siteSettings` / `pengaturan`** (satu entri)

- `whatsapp` (string, format `628...`), `email`, `alamat`, `googleMapsUrl`
- `sosmed`: instagram, tiktok, facebook, youtube (url)
- `bannerPromo` (string, opsional): teks promo musiman di atas header
- `totalSisaUnit` (number, opsional): ditampilkan di beranda jika diisi

**`houseType`**

- `nama`, `slug`, `urutan` (number)
- `luasBangunan`, `luasTanah`, `lantai` (string), `kamarTidur`, `kamarMandi`, `listrik`
- `fitur` (repeater string)
- `status` (select: `tersedia` | `sisa-sedikit` | `habis`)
- `sisaUnit` (number, opsional)
- `harga` (number, opsional) dan `labelHarga` (string, opsional, mis. "Mulai Rp 350 jt"). Jika kosong, tampilkan "Hubungi kami untuk harga".
- `fotoUtama` (image), `galeri` (repeater image), `denah` (image)
- `spesifikasi` (repeater `{ item, keterangan }`)

**`constructionProject`**

- `judul`, `kota`, `jenisProyek`, `tahun`, `deskripsi` (text pendek), `foto` (repeater image), `tampilkan` (boolean)

**`progressUpdate`**

- `tanggal` (datetime), `judul`, `caption`, `foto` (repeater image)

**`testimonial`**

- `nama`, `keterangan` (mis. "Pembeli Cluster Granada"), `kutipan`, `foto` (opsional), `videoUrl` (opsional)
- `izinTertulis` (boolean, required): query di frontend **hanya** menampilkan entri dengan `izinTertulis = true`

Fasilitas, keunggulan, legalitas, dan teks halaman `/tentang` di-hardcode di `src/content/` (jarang berubah).

Query konten pakai `getEmDashCollection()` / `getEmDashEntry()`. Tambahkan cache (KV `CACHE` via `kvCache`, atau header cache) supaya halaman tetap cepat.

### Role admin

- Akun Administrator: agency (selama pengerjaan), lalu diserahkan ke pemilik
- Akun Editor: admin harian client

## 6. WhatsApp & pencatatan leads

### Link WhatsApp

- Format: `https://wa.me/628112052225?text=<encoded>`
- Pesan otomatis sesuai konteks halaman, contoh:
  - Tipe rumah: "Halo, saya tertarik dengan rumah tipe Cordoba (45/84) di Swarga Boemi Madani. Boleh info harga dan sisa unit?"
  - Jasa konstruksi: "Halo, saya ingin konsultasi jasa konstruksi."
  - Umum: "Halo, saya ingin info perumahan Swarga Boemi Madani."
- Buat satu helper `buildWaLink(context)` dan satu komponen `WaButton` yang dipakai di semua tempat.

### Pencatatan klik WA

Setiap klik tombol WA:

1. Kirim event GA4 `wa_click` dengan parameter `page`, `house_type`.
2. Kirim `navigator.sendBeacon` ke `/api/lead` (Astro API route) dengan: `timestamp`, `event` (`wa_click`), `page`, `house_type`, `utm_source`, `utm_medium`, `utm_campaign`, `referrer`.

UTM ditangkap saat landing pertama dan disimpan di `sessionStorage` (bungkus try/catch).

### Form "Jadwalkan Survei Lokasi"

- Field: nama, nomor WA, minat (pilihan: 4 tipe rumah / jasa konstruksi / lainnya), preferensi hari survei, catatan (opsional)
- Honeypot field untuk anti-spam
- Kalimat persetujuan singkat bahwa data dipakai untuk menghubungi calon pembeli (UU PDP)
- Submit: POST ke `/api/lead`, lalu tampilkan halaman terima kasih dengan tombol lanjut chat WA
- Validasi input di server (panjang, format nomor WA Indonesia)

### Apps Script

Simpan kode di `scripts/apps-script/Code.gs` beserta `scripts/apps-script/README.md` berisi langkah deploy (Bahasa Indonesia, langkah demi langkah).

- Sheet `Leads`: semua event dan form, satu baris per entri
- Sheet `Ringkasan`: rumus jumlah klik WA dan form per bulan, per sumber, per tipe rumah
- `/api/lead` meneruskan data ke Apps Script dari server. URL Apps Script dan shared secret disimpan sebagai Worker secret (`LEADS_WEBHOOK_URL`, `LEADS_SECRET`), tidak terekspos ke browser. Apps Script menolak request tanpa secret yang benar.

## 7. SEO

- `metadata` per halaman (title, description, OG image) dalam Bahasa Indonesia
- `sitemap.xml` dan `robots.txt`
- JSON-LD: `HomeAndConstructionBusiness` untuk PT ASBM (alamat, telepon, geo, sameAs sosmed), `Residence`/`Product` sederhana di halaman tipe rumah
- Kata kunci target: "perumahan Gombong", "rumah dijual Gombong", "perumahan Kebumen", "jasa bangun rumah Kebumen", "kontraktor Gombong"
- `lang="id"`, alt text deskriptif di semua gambar

## 8. Desain

- Warna brand: **hijau** (logo, alam) sebagai primer, **oranye** (atap logo) untuk tombol/CTA. Ambil hex pasti dari file logo; sampai ada, pakai token placeholder di konfigurasi Tailwind (`brand-green`, `brand-orange`) agar mudah diganti.
- Utamakan foto asli (unit jadi, progres, serah terima) di atas render.
- Nada bahasa: hangat, kekeluargaan, religius secukupnya.
- Copy siap pakai: "Smart & Comfort Living", "Hunian modern dengan pemandangan yang indah", "Hunian asri & strategis di Gombong", "Gratis SHM, BPHTB, AJB, balik nama & notaris", "Dicek bersama sebelum serah terima".
- CTA: "Chat Marketing via WhatsApp", "Jadwalkan Survei Lokasi", "Lihat Denah & Spesifikasi", "Cek Sisa Unit".

## 9. Struktur repo (usulan)

```
/
  PLAN.md
  README.md                 # cara develop, deploy, env, secrets, backup key
  astro.config.mjs
  wrangler.jsonc            # binding DB, MEDIA, IMAGES, (CACHE), cron
  seed/seed.json            # content model EmDash + seed 4 tipe rumah
  docs/
    panduan-admin.md        # panduan admin non-teknis (Bahasa Indonesia)
    backlog.md
  scripts/apps-script/
    Code.gs
    README.md
  src/
    pages/                  # routes + pages/api/lead.ts
    layouts/
    components/
    content/                # konten hardcode (fasilitas, legalitas, teks tentang)
    lib/                    # query EmDash, buildWaLink, tracking
    worker.ts
  public/
```

## 10. Di luar scope fase 1 (jangan dikerjakan)

- Masterplan interaktif per kavling
- Kalkulator KPR
- Blog / artikel
- Login pembeli, dashboard, atau backend sendiri
- Multi-bahasa
- Chatbot

Kalau ada ide fitur tambahan, catat di `docs/backlog.md`, jangan dikerjakan.

## 11. Data yang belum ada (pakai placeholder)

Tandai semua placeholder dengan komentar `// TODO(data):` agar mudah dicari.

| Data                                            | Perlakuan sementara                                                                                                                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Harga per tipe                                  | Kosong, tampilkan "Hubungi kami untuk harga"                                                                                                                                                        |
| Sisa unit per tipe                              | Granada `sisa-sedikit`, lainnya `tersedia`, tanpa angka                                                                                                                                             |
| Status ruko                                     | Tidak ditampilkan                                                                                                                                                                                   |
| Jasa konstruksi (kota, portofolio, tipe client) | Halaman tetap dibuat dengan copy umum + 1 sampai 2 entri dummy (`tampilkan: false`)                                                                                                                 |
| Hex warna brand                                 | Placeholder token                                                                                                                                                                                   |
| Domain final                                    | Belum diputuskan: brand developer (PT ASBM) atau `swargaboemimadani`. Jangan hardcode domain, pakai `EMDASH_SITE_URL` / `SITE_URL`. **Blocker untuk setup admin produksi** (passkey terikat origin) |
| Foto resolusi penuh                             | Pakai placeholder dengan rasio yang benar                                                                                                                                                           |
| Izin testimoni                                  | Testimoni dummy dengan `izinTertulis: false` (tidak tampil)                                                                                                                                         |

## 12. Milestone

### M0. Setup

- `npm create emdash@latest` dengan target Cloudflare, Tailwind, lint/format
- `wrangler.jsonc`: D1, R2, Images, cron trigger (untuk scheduled publishing)
- Content model di `seed/seed.json` (bagian 5), seed 4 tipe rumah, matikan collection bawaan yang tidak dipakai
- Deploy ke `workers.dev` untuk development
- README: cara develop, deploy, daftar env/secrets, catatan backup `EMDASH_ENCRYPTION_KEY`
- **Selesai jika:** situs ter-deploy, edit tipe rumah di admin langsung terlihat di situs tanpa rebuild

### M1. Halaman & komponen

- Layout, header, footer, tombol WA melayang
- Semua halaman di bagian 4 dengan konten dari CMS + placeholder
- **Selesai jika:** semua halaman tampil rapi di lebar 360px sampai desktop

### M2. Leads & tracking

- `buildWaLink`, `WaButton`, pencatatan klik, penangkapan UTM
- Form survei + halaman terima kasih
- `/api/lead`, Apps Script + README deploy
- GA4
- **Selesai jika:** klik WA dan submit form muncul di Google Sheet dan GA4 (realtime)

### M3. SEO, performa, QA

- Metadata, sitemap, robots, JSON-LD
- Optimasi gambar (Images binding, ukuran responsif), cache query, Lighthouse mobile >= 90
- Cek semua link WA (nomor dan pesan benar), form, tampilan di Android low-end
- **Selesai jika:** semua kriteria di bagian 13 terpenuhi

### M4. Go-live & serah terima

- Pasang custom domain (setelah diputuskan dan dipindah ke Cloudflare client), set `EMDASH_SITE_URL`, setup ulang admin di domain final
- Buat akun Editor untuk admin client, Administrator untuk pemilik
- `docs/panduan-admin.md`: cara login (passkey + magic link), ubah status/harga/sisa unit, tambah progres, tambah portofolio konstruksi, tambah testimoni (dengan izin), membaca Sheet leads. Bahasa sederhana, langkah bernomor, siapkan tempat untuk screenshot.
- Checklist transfer akun ke client (Cloudflare, Google, GitHub repo)
- **Selesai jika:** admin client bisa mengubah status unit sendiri dari HP tanpa bantuan

## 13. Kriteria selesai fase 1

- [ ] Semua halaman live di domain client
- [ ] Lighthouse mobile >= 90 (Performance, SEO, Accessibility) di beranda dan halaman tipe rumah
- [ ] Setiap tombol WA membuka chat ke 0811-2052-225 dengan pesan sesuai halaman
- [ ] Klik WA dan form survei tercatat di Google Sheet
- [ ] Admin bisa mengubah status unit, harga, progres, dan portofolio dari admin EmDash, dan perubahan langsung live
- [ ] NPWP tidak tampil di mana pun
- [ ] Testimoni hanya tampil jika `izinTertulis: true`
- [ ] Semua akun atas nama client, `EMDASH_ENCRYPTION_KEY` tersimpan di tempat client
- [ ] Panduan admin selesai

## 14. Tugas non-coding (dikerjakan agency/client, bukan Claude Code)

- Putuskan domain, beli atas nama client, dan kelola DNS-nya di Cloudflare (akun client)
- Klaim dan verifikasi Google Business Profile "Swarga Boemi Madani Residence"
- Setup WhatsApp Business di 0811-2052-225 (katalog 4 tipe, auto-reply, label leads)
- Ubah Facebook profil pribadi menjadi Page
- Email berdomain (opsional)
- Kumpulkan data [MENYUSUL], terutama jasa konstruksi, harga, sisa unit, PIC admin
- Izin tertulis dari pembeli untuk foto/testimoni
- Sesi foto baru dan video drone (opsional)
- Kesepakatan dengan client: izin portofolio, testimoni owner, credit di footer, akses data leads 2 sampai 3 bulan
