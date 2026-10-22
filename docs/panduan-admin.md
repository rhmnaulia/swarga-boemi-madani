# Panduan Admin Website Swarga Boemi Madani

Panduan ini untuk admin yang mengubah isi website: status unit, harga, foto, progres pembangunan,
portofolio, dan testimoni. Semua bisa dilakukan dari HP.

Alamat admin: **`https://<alamat-website>/_emdash/admin`**
(sementara: `https://swarga-boemi-madani.rahmanauliax.workers.dev/_emdash/admin`)

Tampilan admin mengikuti bahasa HP. Kalau masih berbahasa Inggris, buka **Pengaturan > Bahasa** dan pilih
**Bahasa Indonesia**.

## Yang perlu diingat

1. Setiap perubahan **tersimpan otomatis** (muncul tanda centang), tetapi **belum tampil** di website.
2. Supaya tampil, tekan tombol biru **Publikasikan** di bagian atas. Setelah itu perubahan langsung tampil.
   Kalau belum terlihat, muat ulang halaman website. Pengecualian: **Pengaturan Situs** langsung tampil
   tanpa tombol Publikasikan (lihat bagian 8).
3. Tombol **Lihat Situs** di bagian atas membuka website untuk mengecek hasilnya.
4. Yang terhapus masuk ke **Tempat Sampah** dan masih bisa dikembalikan.
5. Jangan mengubah menu di bagian **Admin** (Tipe Konten, Pengaya, Impor). Menu itu mengatur struktur
   website dan hanya untuk developer.

---

## 1. Masuk ke admin

Admin memakai **kunci sandi (passkey)**: sidik jari, Face ID, atau PIN layar HP. Tidak ada kata sandi.

1. Buka alamat admin di browser HP.
2. Tekan **Masuk dengan Passkey**, lalu ikuti petunjuk HP (sidik jari / Face ID / PIN).
3. Halaman **Dasbor** terbuka.

[Screenshot: halaman masuk]

### Tambahkan kunci sandi cadangan (penting)

Kalau HP hilang atau ganti HP, kunci sandi lama ikut hilang. Daftarkan kunci sandi kedua di perangkat lain,
misalnya laptop atau HP kedua.

1. Di perangkat kedua (misalnya laptop), buka alamat admin dan tekan **Masuk dengan Passkey**.
2. Pilih opsi memakai HP / perangkat lain. Muncul kode QR: pindai dengan kamera HP yang sudah terdaftar,
   lalu konfirmasi di HP.
3. Setelah masuk di perangkat kedua, buka **Pengaturan > Keamanan**.
4. Tekan **Tambahkan Kunci Sandi** dan ikuti petunjuk perangkat. Kunci sandi kini tersimpan di perangkat kedua.

Satu akun bisa punya sampai 10 kunci sandi.

> Tombol **Masuk dengan tautan email** di halaman masuk baru berfungsi setelah domain resmi siap. Sampai
> saat itu, kunci sandi cadangan adalah satu-satunya jalan masuk kalau HP hilang.

[Screenshot: Pengaturan > Keamanan]

---

## 2. Mengundang admin atau pengguna baru

Hanya pengguna dengan peran **Admin** yang bisa mengundang.

1. Buka menu **Pengguna**, tekan **Undang Pengguna**.
2. Isi **Alamat surel** orang yang diundang.
3. Pilih **Peran**:
   - **Penyunting**: bisa mengubah semua konten. Cocok untuk admin harian.
   - **Admin**: akses penuh, termasuk mengundang pengguna dan pengaturan. Cukup 1 sampai 2 orang.
   - **Penulis**: hanya konten buatannya sendiri. Jarang dibutuhkan.
4. Tekan **Kirimkan Undangan**.
5. Website belum bisa mengirim email, jadi muncul **link undangan**. Salin link itu dan kirim langsung ke
   orangnya lewat WhatsApp pribadi.
6. Orang yang diundang membuka link itu **di HP-nya sendiri** dan membuat kunci sandi.

Link undangan hanya berlaku sebentar dan hanya sekali pakai. Kalau kedaluwarsa, buat undangan baru.

[Screenshot: dialog Undang Pengguna]

---

## 3. Mengubah status, sisa unit, dan harga tipe rumah

1. Buka menu **Tipe Rumah**, pilih tipe yang akan diubah (misalnya **Cordoba**).
2. Ubah kolom yang perlu:
   - **Status ketersediaan**: `tersedia`, `sisa-sedikit`, atau `habis`. Label di website ikut berubah.
     Kalau `habis`, tombol WhatsApp di halaman tipe itu berubah menjadi "Tanya unit serupa".
   - **Sisa unit**: jumlah unit tersisa. Kosongkan kalau tidak ingin angka ditampilkan.
   - **Harga dalam Rupiah**: angka saja tanpa titik, misalnya `350000000`.
   - **Teks harga**: kalau ingin tulisan bebas, misalnya `Mulai Rp 350 jt`. Teks ini dipakai lebih dulu
     daripada angka harga. Kalau dua-duanya kosong, website menampilkan "Hubungi kami untuk harga".
3. Tunggu tanda centang (tersimpan), lalu tekan **Publikasikan**.

[Screenshot: halaman edit tipe rumah dengan tombol Publikasikan]

Kolom lain di halaman yang sama: **Urutan tampil** (1 = paling atas), luas, kamar, listrik, **Fitur & bonus**,
dan **Spesifikasi bangunan**. Untuk menambah baris, tekan **Tambahkan Item**.

---

## 4. Mengganti foto dan denah tipe rumah

1. Buka **Tipe Rumah**, pilih tipenya.
2. **Foto utama**: tekan **Pilih gambar**, lalu unggah foto dari HP atau pilih dari Media.
   Foto ini tampil di kartu tipe rumah dan saat link dibagikan ke WhatsApp.
3. **Galeri foto**: tekan **Tambahkan Item** untuk setiap foto tambahan.
4. **Gambar denah**: tekan **Pilih gambar** dan unggah gambar denahnya.
5. Tekan **Publikasikan**.

Tips foto:

- Foto langsung dari kamera HP tidak masalah. Website mengecilkan ukurannya sendiri.
- Pakai foto **mendatar (landscape)**, diambil siang hari.
- Utamakan foto asli (unit jadi, serah terima) daripada gambar render.
- Kalau ada kolom deskripsi atau teks alternatif, isi singkat, misalnya "Tampak depan rumah tipe Cordoba".

---

## 5. Menambah update progres pembangunan

1. Buka **Progres Pembangunan**, tekan **Tambahkan Baru**.
2. Isi **Judul**, misalnya "Pengecoran Cluster Andalusia".
3. Isi **Tanggal** kegiatan.
4. Isi **Keterangan singkat** (1 sampai 2 kalimat).
5. Di **Foto**, tekan **Tambahkan Item Pertama**, lalu pilih foto. Ulangi untuk foto berikutnya.
6. Tekan **Simpan**, lalu **Publikasikan**.

Update terbaru tampil paling atas di halaman Progres.

[Screenshot: form Update Progres baru]

---

## 6. Menambah portofolio jasa konstruksi

1. Buka **Portofolio Konstruksi**, tekan **Tambahkan Baru**.
2. Isi **Nama proyek**, **Kota**, **Jenis proyek**, **Tahun**, dan **Deskripsi singkat**.
3. Tambahkan **Foto**.
4. Centang **Tampilkan di situs**. Tanpa centang ini, proyek tidak muncul di website.
5. Tekan **Simpan**, lalu **Publikasikan**.

Hanya masukkan proyek yang pemiliknya sudah mengizinkan fotonya ditampilkan.

Ada 2 contoh proyek bawaan yang tidak tampil. Ubah dengan data asli, atau pindahkan ke Tempat Sampah.

---

## 7. Menambah testimoni

Testimoni **wajib** punya izin tertulis dari pembeli (misalnya pesan WhatsApp "Saya setuju testimoni saya
ditampilkan di website"). Simpan bukti izinnya.

1. Buka **Testimoni**, tekan **Tambahkan Baru**.
2. Isi **Nama pembeli**, **Keterangan** (misalnya "Pembeli Cluster Granada"), dan **Isi testimoni**.
3. Foto pembeli dan link video boleh dikosongkan.
4. Centang **Sudah ada izin tertulis dari pembeli** hanya kalau izinnya memang sudah ada. Tanpa centang ini,
   testimoni tidak tampil.
5. Tekan **Simpan**, lalu **Publikasikan**.

Ada 1 contoh testimoni bawaan yang tidak tampil. Ubah dengan data asli atau pindahkan ke Tempat Sampah.

---

## 8. Pengaturan situs: nomor WA, promo, alamat, media sosial

1. Buka **Pengaturan Situs**, pilih satu-satunya entri di dalamnya.
2. Kolom yang bisa diubah:
   - **Nomor WhatsApp marketing**: format `628…`, tanpa `+` dan tanpa spasi, misalnya `628112052225`.
     Semua tombol WhatsApp di website memakai nomor ini.
   - **Teks promo di atas menu**: misalnya "Promo DP 0% sampai akhir bulan". Kosongkan kalau tidak ada promo.
   - **Total sisa unit untuk beranda**: angka yang tampil di beranda. Kosongkan untuk menyembunyikan.
   - **Email**, **Alamat lengkap**, **Link Google Maps**.
   - **Link Instagram / TikTok / Facebook / YouTube**: link lengkap ke profil, diawali `https://`.
3. Jangan mengubah **Nama entri**.
4. Tunggu sampai muncul **Disimpan**. Di sini tidak ada tombol Publikasikan: perubahan langsung tampil di
   website begitu tersimpan, jadi ketik dengan teliti.
5. **Jangan tekan "Batalkan publikasi"** (ikon di bagian atas). Tombol itu langsung bekerja tanpa konfirmasi
   dan menyembunyikan seluruh pengaturan: email, media sosial, dan promo hilang dari website. Kalau tidak
   sengaja tertekan, tekan **Publikasikan sekarang** di bagian atas, lalu **Publikasikan sekarang** lagi di
   kotak konfirmasi.

Logo website diunggah di **Pengaturan > Umum**.

---

## 9. Membaca data leads (klik WhatsApp dan form survei)

Data calon pembeli tidak ada di admin website, tetapi di Google Sheet **Leads Website SBM**.

- Tab **Leads**: satu baris per klik WhatsApp atau form survei. Kolom WhatsApp bisa langsung diklik untuk
  membuka chat.
- Tab **Ringkasan**: jumlah per bulan, per sumber (Instagram, TikTok, Google, langsung), dan per tipe rumah.

Penjelasan lengkap: [scripts/apps-script/README.md](../scripts/apps-script/README.md), bagian
"Membaca Sheet".

---

## 10. Kalau ada masalah

| Masalah                           | Yang dicoba                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Perubahan tidak muncul di website | Pastikan sudah menekan **Publikasikan**. Muat ulang halaman website.                                |
| Terhapus tidak sengaja            | Buka menu kontennya, pilih tab **Tempat Sampah**, kembalikan.                                       |
| Salah mengubah isi                | Di halaman edit, buka panel **Pengaturan** (ikon slider), lihat **Revisi**, pilih versi sebelumnya. |
| HP hilang / tidak bisa masuk      | Masuk dari perangkat dengan kunci sandi cadangan, atau minta Admin lain mengundang ulang.           |
| Foto gagal diunggah               | Coba foto lain atau koneksi lain. Batas ukuran 50 MB per berkas.                                    |
| Website tidak bisa dibuka         | Hubungi developer.                                                                                  |

Cadangan data: **Pengaturan > Cadangan** untuk mengunduh cadangan seluruh isi website. Lakukan sebulan sekali.
