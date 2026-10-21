# Pencatatan leads ke Google Sheet

Setiap klik tombol WhatsApp dan setiap form "Jadwalkan Survei Lokasi" di website dicatat otomatis ke
Google Sheet milik PT ASBM. Panduan ini dipakai sekali saat pemasangan, dan lagi kalau kode di `Code.gs`
berubah.

Yang dibutuhkan:

- Akun Google milik perusahaan (bukan akun pribadi developer), supaya Sheet tetap milik client.
- Developer yang memegang akses Cloudflare, untuk langkah 6.

## A. Buat Sheet dan pasang kode

1. Login ke akun Google perusahaan, buka https://sheets.new, lalu beri nama Sheet, misalnya
   **Leads Website SBM**.
2. Klik menu **Ekstensi > Apps Script**. Tab baru terbuka.
3. Hapus semua isi editor, lalu salin seluruh isi file `Code.gs` dan tempel ke editor. Klik ikon simpan.
4. Klik ikon roda gigi **Setelan project** di kiri. Di bagian **Properti skrip**, klik **Tambahkan properti
   skrip**:
   - Properti: `LEADS_SECRET`
   - Nilai: kode rahasia dari developer (developer membuatnya dengan `openssl rand -hex 32`)

   Klik **Simpan properti skrip**.

5. Kembali ke **Editor** (ikon `< >`). Di daftar fungsi di atas editor pilih **setup**, lalu klik **Jalankan**.
   - Google meminta izin. Klik **Tinjau izin**, pilih akun perusahaan.
   - Jika muncul "Google belum memverifikasi aplikasi ini", klik **Lanjutan**, lalu **Buka … (tidak aman)**.
     Ini wajar karena skrip ini buatan sendiri, bukan aplikasi publik.
   - Klik **Izinkan**.

   Di Sheet sekarang ada tab **Leads** dan **Ringkasan**.

## B. Terbitkan sebagai web app

6. Di Apps Script klik **Terapkan > Deployment baru**.
   - Klik ikon roda gigi di samping "Pilih jenis", pilih **Aplikasi web**.
   - Deskripsi: `leads website`
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
   - Klik **Terapkan**, lalu salin **URL aplikasi web** (berakhiran `/exec`).

   "Siapa saja" diperlukan karena website yang mengirim data, bukan orang yang login. Data tetap aman:
   skrip menolak setiap kiriman tanpa kode rahasia dari langkah 4.

7. Buka URL tadi di browser. Harus muncul tulisan `{"ok":true,"service":"leads"}`.
8. Kirim URL dan kode rahasia ke developer lewat password manager (bukan chat biasa). Developer menjalankan:

   ```bash
   pnpm wrangler secret put LEADS_WEBHOOK_URL   # tempel URL /exec
   pnpm wrangler secret put LEADS_SECRET        # tempel kode rahasia yang sama dengan langkah 4
   ```

## C. Uji

9. Buka website, klik salah satu tombol WhatsApp. Dalam beberapa detik muncul baris baru di tab **Leads**
   dengan Jenis **Klik WhatsApp**.
10. Isi form di halaman **Kontak** dengan data uji, lalu kirim. Muncul baris **Form survei**, dan kolom
    WhatsApp berisi tautan yang bisa langsung diklik untuk membuka chat.
11. Hapus baris uji di tab **Leads**. Jangan hapus baris judul (baris 1).

## Membaca Sheet

- **Leads**: satu baris per klik atau form, terbaru di bawah. Kolom **Sumber** berisi asal pengunjung:
  isi `utm_source` dari link iklan, atau nama situs asal (misalnya `instagram.com`), atau `langsung`.
- **Ringkasan**: jumlah klik WhatsApp dan form per bulan, per sumber, dan per tipe rumah. Terhitung otomatis.
- Boleh menambah kolom di **kanan** kolom Referrer (misalnya "Sudah dihubungi"). Jangan mengubah urutan atau
  nama kolom yang sudah ada, dan jangan mengganti nama tab **Leads**.

## Kalau kode `Code.gs` berubah

1. Tempel kode baru di editor Apps Script, simpan.
2. **Terapkan > Kelola deployment**, klik ikon pensil, pada **Versi** pilih **Versi baru**, klik **Terapkan**.

Jangan pilih "Deployment baru": itu membuat URL baru, dan website tetap mengirim ke URL lama.

## Kalau leads tidak masuk

- Buka URL `/exec` di browser (langkah 7). Kalau tidak muncul `"ok":true`, ulangi langkah 6.
- Pastikan properti `LEADS_SECRET` di Apps Script sama persis dengan secret di Cloudflare.
- Developer bisa melihat pesan error dengan `pnpm wrangler tail` sambil mengirim form uji.
