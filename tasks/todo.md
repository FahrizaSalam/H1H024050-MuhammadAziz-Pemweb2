# Modul 9: Integrasi Backend dan Frontend - Checklist Tugas

- [x] 1. Analisis instruksi Modul 9 (09-integrasi.docx.pdf) -> verify: Persyaratan langkah 1-12, tugas 1-4, pertanyaan pembahasan 1-4 dipetakan.
- [x] 2. Konfigurasi CORS pada backend Laravel -> verify: `Pemrograman Web II/Laravel/config/cors.php` terbit dan disesuaikan.
- [x] 3. Konfigurasi CORS pada backend Fiber -> verify: `Pemrograman Web II/Fiber/latihan-fiber-api/cmd/api/main.go` menambahkan middleware CORS fiber v3.
- [x] 4. Inisialisasi project frontend React Vite (`frontend-pemweb2`) -> verify: `npm install axios react-router-dom` terpasang.
- [x] 5. Konfigurasi environment `.env` pada frontend -> verify: `VITE_API_LARAVEL` dan `VITE_API_FIBER` terpasang.
- [x] 6. Klien HTTP Axios dengan Interceptor Request & Response -> verify: `src/api/klien.js` menyisipkan token dan menangani error 401.
- [x] 7. Lapisan Abstraksi Backend Switcher (Tugas 3) -> verify: satu pengaturan memudahkan switch Laravel & Fiber, normalisasi data response & request.
- [x] 8. Layanan API (LayananAuth & LayananMahasiswa) -> verify: fungsi CRUD mahasiswa dan auth terhubung ke lapisan abstraksi.
- [x] 9. Komponen Rute Terlindungi & Router Aplikasi -> verify: proteksi rute halaman `/mahasiswa` dan redirect login.
- [x] 10. Halaman Login -> verify: input email & password/kata_sandi, error handling, penyimpanan token ke sessionStorage.
- [x] 11. Halaman Daftar Mahasiswa dengan Debounce & Pagination -> verify: pencarian debounced 400ms, pagination sesuai backend aktif.
- [x] 12. Tombol Hapus dengan Dialog Konfirmasi & Update Daftar (Tugas 2) -> verify: konfirmasi dialog muncul, data dihapus, daftar diperbarui otomatis.
- [x] 13. Halaman Formulir Tambah Mahasiswa dengan Penanganan Galat Validasi Server (Tugas 1) -> verify: validasi server 422 diparsing dan ditampilkan pada form.
- [x] 14. Build dan Verifikasi Frontend -> verify: `npm run build` sukses 100%.
- [x] 15. Tabel Perbandingan Respons Backend & Usulan Kontrak Tunggal (Tugas 4) dan Jawaban Pembahasan (F.1 - F.4) -> verify: Dokumentasi `LAPORAN_MODUL_9.md` lengkap.
