# Laporan Praktikum Pemrograman Web II
## Modul 9: Integrasi Backend dan Frontend

**Nama Mahasiswa:** Muhammad Aziz  
**NIM:** H1H024050  
**Program Studi:** S1 Teknik Komputer  
**Mata Kuliah:** Praktikum Pemrograman Web II  
**Tahun Akademik:** 2026/2027  

---

## 1. Ringkasan Pelaksanaan Langkah Praktikum

Pada modul ini, integrasi backend dan frontend dibangun dengan mengintegrasikan dua backend berbeda yang telah dibuat pada modul-modul sebelumnya:
1. **Backend Laravel 13 (PHP)** pada port `8000` (Modul 5)
2. **Backend Fiber v3 (Go)** pada port `3000` (Modul 8)
3. **Frontend React (Vite)** pada port `5173`

### 1.1 Konfigurasi CORS pada Backend Laravel (Langkah 1)
Berkas konfigurasi CORS diterbitkan pada berkas `config/cors.php` dengan pengaturan:
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```
Setelah konfigurasi disimpan, cache konfigurasi dibersihkan menggunakan:
```bash
php artisan config:clear
```

### 1.2 Konfigurasi CORS pada Backend Fiber (Langkah 2)
Pada `cmd/api/main.go`, middleware CORS dari Fiber v3 diimpor dan didaftarkan sebelum middleware autentikasi dan routing:
```go
import "github.com/gofiber/fiber/v3/middleware/cors"

app.Use(cors.New(cors.Config{
    AllowOrigins: []string{"http://localhost:5173"},
    AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Api-Key"},
}))
```
*Catatan:* Header `X-Api-Key` ditambahkan pada `AllowHeaders` agar permintaan preflight browser (`OPTIONS`) tidak terhalang oleh pemeriksaan middleware `KunciApi`.

### 1.3 Inisialisasi Proyek Frontend & Pustaka Dependensi (Langkah 3 & 4)
Proyek React dibangun menggunakan Vite:
```bash
npm create vite@latest frontend-pemweb2 -- --template react
npm install
npm install axios react-router-dom
```
Variabel lingkungan dikonfigurasi pada `.env`:
```env
VITE_API_LARAVEL=http://127.0.0.1:8000/api
VITE_API_FIBER=http://localhost:3000/api
VITE_DEFAULT_BACKEND=laravel
```

### 1.4 Klien HTTP Axios dan Interceptor (Langkah 5)
Berkas `src/api/klien.js` mengimplementasikan instance Axios dengan:
- **Request Interceptor:** Otomatis menyisipkan header `Authorization: Bearer <token>` dari `sessionStorage` pada setiap permintaan, serta menyisipkan header `X-Api-Key` jika backend aktif adalah Fiber.
- **Response Interceptor:** Menangani status `401 Unauthorized` secara terpusat dengan menghapus token dari `sessionStorage` dan mengalihkan pengguna ke halaman login (`/login`).

---

## 2. Penyelesaian Tugas Praktikum

### 2.1 Tugas 1: Formulir Tambah Mahasiswa dengan Penanganan Galat Validasi Server
- **Implementasi:** Berkas `src/halaman/TambahMahasiswa.jsx` menyediakan antarmuka form interaktif untuk menginput data mahasiswa (`nim`, `nama`, `email`, `program_studi_id`, `angkatan`, `ipk`, `aktif`).
- **Penanganan Galat Validasi:**
  - Ketika server merespons dengan status HTTP `422 Unprocessable Entity`, fungsi `normalisasiGalatValidasi()` pada adaptor akan mengekstrak pesan galat baik format Laravel (`data.errors`) maupun format Fiber (`data.galat`).
  - Pesan galat ditampilkan pada dua tingkat:
    1. **Pesan Galat Global / Alert Utama:** Muncul di bagian atas formulir memberitahukan ringkasan kegagalan validasi.
    2. **Pesan Galat Spesifik Kolom (Field-level Error):** Ditampilkan tepat di bawah kotak input yang bermasalah dengan penandaan warna merah pada border input dan teks keterangan error (contoh: *"NIM tersebut sudah terdaftar"*, *"Format email tidak valid"*, *"Tahun angkatan tidak wajar"*).

### 2.2 Tugas 2: Tombol Hapus dengan Dialog Konfirmasi dan Pembaruan Otomatis
- **Implementasi:** Pada tabel `src/halaman/DaftarMahasiswa.jsx`, ditambahkan kolom **Aksi** yang memuat tombol **Hapus** pada setiap baris data mahasiswa.
- **Dialog Konfirmasi:**
  - Saat tombol diklik, peramban menampilkan dialog konfirmasi eksplisit yang menyertakan informasi nama dan NIM mahasiswa yang hendak dihapus (`window.confirm`).
- **Pembaruan Otomatis:**
  - Tombol menampilkan status `Menghapus...` selama proses asynchronous berlangsung.
  - Setelah respons sukses diterima dari server (`DELETE /mahasiswa/{id}`), daftar mahasiswa otomatis dimuat ulang (`muatData(halaman, cari)`) tanpa me-reload peramban secara keseluruhan, disertai banner pesan sukses berwarna hijau.

### 2.3 Tugas 3: Lapisan Abstraksi Sederhana untuk Peralihan Backend Laravel dan Fiber
- **Implementasi:** Berkas `src/api/konfigurasi.js` dan `src/api/abstraksiAdapter.js` membentuk arsitektur *Adapter Pattern* yang menjembatani disparitas kontrak antara kedua backend:
  1. **Peralihan Satu Pengaturan (Single Setting Switch):** Pengguna atau pengembang dapat beralih backend melalui satu konfigurasi atau secara langsung melalui elemen dropdown pemilih backend di `Navbar.jsx`.
  2. **Adaptasi Payload Login:**
     - Laravel: mengirim `{ email, password }`
     - Fiber: mengirim `{ email, kata_sandi }`
  3. **Adaptasi Parameter Paginasi:**
     - Laravel: mengirim query param `page`
     - Fiber: mengirim query param `halaman`
  4. **Normalisasi Metadata Paginasi:**
     - Laravel: `{ meta: { current_page, last_page, per_page, total } }`
     - Fiber: `{ meta: { halaman, total_halaman, per_halaman, total } }`
     - Keduanya dinormalisasi menjadi: `{ current_page, last_page, per_page, total }` sehingga komponen `DaftarMahasiswa.jsx` tidak perlu diubah-ubah.

---

### 2.4 Tugas 4: Tabel Perbandingan Struktur Respons dan Usulan Kontrak API Tunggal

#### A. Tabel Perbandingan Struktur Respons Backend Laravel vs Fiber

| Endpoint / Operasi | Backend Laravel 13 (Modul 5) | Backend Fiber v3 (Modul 8) | Analisis Perbedaan |
| :--- | :--- | :--- | :--- |
| **Login (`POST /auth/login`)** | <pre>{<br>  "sukses": true,<br>  "pesan": "Login berhasil",<br>  "data": {<br>    "pengguna": {<br>      "id": 1,<br>      "nama": "Admin",<br>      "email": "admin@mail.com",<br>      "peran": "admin"<br>    },<br>    "token": "1\|abc..."<br>  }<br>}</pre> | <pre>{<br>  "sukses": true,<br>  "pesan": "Login berhasil",<br>  "data": {<br>    "pengguna": {<br>      "ID": 1,<br>      "nama": "Admin",<br>      "email": "admin@mail.com",<br>      "peran": "admin"<br>    },<br>    "token": "eyJhbGci...",<br>    "tipe": "Bearer"<br>  }<br>}</pre> | - Input login: Laravel memakai `password`, Fiber memakai `kata_sandi`.<br>- Objek pengguna: Laravel memakai properti lowercase (`id`), Fiber memakai PascalCase bawaan GORM (`ID`, `CreatedAt`).<br>- Fiber menyertakan atribut `"tipe": "Bearer"`. |
| **Daftar Mahasiswa (`GET /mahasiswa`)** | <pre>{<br>  "data": [<br>    {<br>      "id": 1,<br>      "nim": "H1H024050",<br>      "nama": "Aziz",<br>      "angkatan": 2024,<br>      "ipk": 3.85,<br>      "program_studi": { "id": 1, "nama": "..." }<br>    }<br>  ],<br>  "meta": {<br>    "current_page": 1,<br>    "last_page": 5,<br>    "per_page": 10,<br>    "total": 50<br>  }<br>}</pre> | <pre>{<br>  "sukses": true,<br>  "data": [<br>    {<br>      "id": 1,<br>      "nim": "H1H024050",<br>      "nama": "Aziz",<br>      "angkatan": 2024,<br>      "ipk": 3.85,<br>      "program_studi_id": 1,<br>      "program_studi": { "id": 1, "nama": "..." }<br>    }<br>  ],<br>  "meta": {<br>    "halaman": 1,<br>    "total_halaman": 5,<br>    "per_halaman": 10,<br>    "total": 50<br>  }<br>}</pre> | - Parameter kueri: Laravel memakai `page`, Fiber memakai `halaman`.<br>- Format meta: Laravel memakai standar Laravel Paginate (`current_page`, `last_page`), sedangkan Fiber memakai istilah bahasa Indonesia (`halaman`, `total_halaman`).<br>- Laravel tidak menyertakan root attribute `"sukses": true` pada JsonResource collection. |
| **Tambah Mahasiswa (`POST /mahasiswa`) Sukses (201)** | <pre>{<br>  "sukses": true,<br>  "pesan": "Data mahasiswa berhasil dibuat",<br>  "data": { "id": 51, "nim": "...", ... }<br>}</pre> | <pre>{<br>  "sukses": true,<br>  "pesan": "Data mahasiswa berhasil dibuat",<br>  "data": { "id": 51, "nim": "...", ... }<br>}</pre> | Struktur respons sukses pada saat create sudah setara. |
| **Galat Validasi (`POST /mahasiswa`) (422)** | <pre>{<br>  "message": "The given data was invalid.",<br>  "errors": {<br>    "nim": ["NIM tersebut sudah terdaftar"],<br>    "email": ["Format email tidak valid"]<br>  }<br>}</pre> | <pre>{<br>  "sukses": false,<br>  "pesan": "Data yang dikirim tidak valid",<br>  "galat": {<br>    "nim": "nim wajib diisi",<br>    "email": "format email tidak valid"<br>  }<br>}</pre> | - Laravel menggunakan kunci `message` dan kamus array `errors: { field: [string] }`.<br>- Fiber menggunakan kunci `sukses`, `pesan`, dan kamus nilai tunggal `galat: { field: string }`. |
| **Hapus Mahasiswa (`DELETE /mahasiswa/{id}`) (200)** | <pre>{<br>  "sukses": true,<br>  "pesan": "Data mahasiswa berhasil dihapus"<br>}</pre> | <pre>{<br>  "sukses": true,<br>  "pesan": "Data mahasiswa berhasil dihapus"<br>}</pre> | Struktur respons penghapusan identik pada kedua framework. |

---

#### B. Usulan Kontrak API Tunggal (Unified RESTful API Contract Specification)

Berdasarkan perbandingan di atas, perbedaan penamaan properti memaksa klien frontend membuat wrapper tambahan. Untuk menyatukan arsitektur sistem, diusulkan **Kontrak API Tunggal Standar (JSend-Extended Envelope)** dengan konvensi *camelCase* atau *snake_case* yang konsisten di semua lingkungan:

##### 1. Standar Format Respons Sukses
```json
{
  "sukses": true,
  "pesan": "Operasi berhasil dijalankan",
  "data": {},
  "meta": null
}
```
Untuk data berbentuk koleksi/paginasi:
```json
{
  "sukses": true,
  "pesan": "Daftar data berhasil diambil",
  "data": [
    {
      "id": 1,
      "nim": "H1H024050",
      "nama": "Muhammad Aziz",
      "email": "aziz@unsoed.ac.id",
      "angkatan": 2024,
      "ipk": 3.85,
      "aktif": true,
      "program_studi_id": 1,
      "program_studi": {
        "id": 1,
        "kode": "TK",
        "nama": "Teknik Komputer"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 4,
    "per_page": 10,
    "total": 35
  }
}
```

##### 2. Standar Format Respons Galat Validasi (HTTP 422)
```json
{
  "sukses": false,
  "pesan": "Data yang dikirim tidak memenuhi syarat validasi",
  "galat": {
    "nim": ["NIM tersebut sudah terdaftar"],
    "email": ["Format email tidak valid"]
  }
}
```

##### 3. Standar Permintaan Autentikasi (`POST /auth/login`)
- Payload request disepakati menggunakan:
```json
{
  "email": "admin@unsoed.ac.id",
  "kata_sandi": "rahasia123"
}
```
- Respons login menyertakan objek standar:
```json
{
  "sukses": true,
  "pesan": "Login berhasil",
  "data": {
    "token": "token_string_here",
    "tipe": "Bearer",
    "pengguna": {
      "id": 1,
      "nama": "Muhammad Aziz",
      "email": "admin@unsoed.ac.id",
      "peran": "admin"
    }
  }
}
```

---

## 3. Jawaban Pertanyaan Pembahasan (Bagian F)

### 1. Mengapa galat CORS tidak dapat diselesaikan dari sisi frontend?
**Jawaban:**  
Kebijakan *Same-Origin Policy* (SOP) adalah mekanisme keamanan yang diterapkan secara internal oleh mesin peramban web (browser engine), bukan oleh kode JavaScript frontend. 
- Ketika kode frontend di domain `http://localhost:5173` mengirimkan permintaan AJAX/Fetch ke domain `http://localhost:8000`, browser secara otomatis mengecek apakah server tujuan mengizinkan origin pemanggil melalui header HTTP respons seperti `Access-Control-Allow-Origin`.
- Jika server tujuan tidak menyertakan header izin tersebut pada responsnya, peramban akan memblokir respons agar tidak dapat dibaca oleh JavaScript klien demi mencegah serangan *Cross-Site Script Inclusion* atau pencurian data antar-situs.
- Karena aturan ini dieksekusi di level peramban atas dasar header yang dikembalikan oleh server, JavaScript di sisi frontend tidak memiliki wewenang atau hak akses untuk memanipulasi header respons server maupun mematikan mekanisme keamanan bawaan peramban tersebut. Satu-satunya solusi yang benar dan permanen adalah mengonfigurasi backend agar menyertakan header CORS yang sesuai.

### 2. Jelaskan kelebihan dan kekurangan penyimpanan token pada `sessionStorage` dibandingkan cookie `HttpOnly`.
**Jawaban:**

| Parameter | `sessionStorage` | Cookie `HttpOnly` |
| :--- | :--- | :--- |
| **Ketahanan terhadap Serangan XSS (Cross-Site Scripting)** | **Rentan.** Kode JavaScript apa pun (termasuk skrip berbahaya hasil injeksi XSS) dapat membaca isi `sessionStorage` melalui `sessionStorage.getItem('token')`. | **Aman.** Cookie dengan flag `HttpOnly` diblokir total dari akses JavaScript melalui `document.cookie`, sehingga penyerang XSS tidak dapat langsung mencuri token. |
| **Ketahanan terhadap Serangan CSRF (Cross-Site Request Forgery)** | **Aman.** Browser tidak akan mengirimkan isi `sessionStorage` secara otomatis ke domain lain. Token harus disuntikkan secara eksplisit via header `Authorization` oleh kode aplikasi. | **Rentan jika tanpa proteksi.** Browser secara otomatis melampirkan cookie pada setiap permintaan lintas situs (cross-origin request), sehingga mewajibkan penerapan token anti-CSRF atau atribut `SameSite=Strict/Lax`. |
| **Masa Hidup (Lifecycle) & Lingkup Sesi** | Terbatas pada satu tab peramban saat ini. Menutup tab akan menghapus data seketika. Membuka tab baru memerlukan login ulang. | Mengikuti atribut `Expires`/`Max-Age`. Berlaku di semua tab dan jendela peramban pada domain yang sama. |
| **Kemudahan Integrasi API** | **Sangat fleksibel.** Mudah diintegrasikan dengan arsitektur REST API/Microservice yang terpisah domain atau port, tanpa kerumitan konfigurasi domain cookie CORS. | Memerlukan konfigurasi CORS `Access-Control-Allow-Credentials: true` dan origin eksplisit (tidak boleh wildcard `*`). |

### 3. Apa fungsi interceptor pada Axios dan masalah apa yang dicegah olehnya?
**Jawaban:**  
Interceptor pada Axios bertindak sebagai *middleware* klien HTTP yang secara otomatis mencegat permintaan (*request*) sebelum dikirimkan ke jaringan, atau mencegat respons (*response*) sebelum diserahkan ke blok fungsi `then/catch` komponen pemanggil.

**Masalah yang dicegah:**
1. **Pencegahan Duplikasi Kode (DRY Violation):** Tanpa request interceptor, setiap pemanggilan endpoint (`axios.get`, `axios.post`) harus menuliskan header `Authorization: Bearer ${token}` berulang kali di puluhan komponen. Interceptor menyisipkan token secara terpusat pada satu titik konfigurasi.
2. **Pencegahan Status Sesi Zombie (Handling 401 Unauthorized Terpusat):** Jika token kedaluwarsa atau dicabut saat pengguna sedang berinteraksi, server akan merespons status HTTP 401. Tanpa response interceptor, pengembang harus menyematkan blok `if (status === 401)` di setiap komponen. Response interceptor menangani kondisi 401 dengan langsung membersihkan `sessionStorage` dan mengalihkan pengguna ke halaman login (`/login`), mencegah aplikasi berada dalam kondisi tidak sinkron.
3. **Penyatuan Format Penanganan Galat Jaringan:** Mengonversi galat koneksi (server mati, timeout) menjadi pesan standar yang seragam untuk semua panggilan API.

### 4. Mengapa penanganan status memuat (*loading state*) dan galat (*error state*) penting bagi pengalaman pengguna (*user experience*)?
**Jawaban:**  
Aplikasi berbasis web bersifat *asynchronous* dan bergantung pada latensi jaringan serta waktu pemrosesan server:
1. **Kepastian Respons Sistem (Feedback Visibility):** Berdasarkan prinsip *Heuristic Evaluation* Nielsen Norman Group (*Visibility of system status*), sistem harus selalu memberi tahu pengguna tentang apa yang sedang terjadi. Indikator pemuatan (seperti teks `Memuat data...`, spinner, atau tombol berstatus `Menyimpan...`) memberi tahu pengguna bahwa permintaannya sedang diproses, sehingga mencegah kebingungan atau tindakan berulang (seperti mengklik tombol submit berulang kali yang dapat menyebabkan *double-submit*).
2. **Pencegahan Kebingungan Layar Kosong (Blank Screen Prevention):** Tanpa status memuat atau status data kosong, pengguna mungkin mengira aplikasi mengalami *freeze* atau rusak saat sedang menunggu balasan dari backend.
3. **Pemberitahuan Galat yang Bersahabat dan Terarah:** Ketika terjadi kegagalan (misalnya NIM duplikat atau server padam), menampilkan pesan galat yang jelas dan spesifik (bukan sekadar diam atau mencetak pesan di `console.log`) membantu pengguna memahami apa penyebab kegagalan dan tindakan perbaikan apa yang harus mereka ambil (misalnya mengganti email yang valid atau memeriksa koneksi jaringan).

---

## 4. Kesimpulan

Integrasi backend Laravel 13, backend Fiber v3, dan frontend React berhasil diwujudkan dengan memenuhi seluruh target pembelajaran:
1. Mekanisme CORS berhasil diterapkan pada kedua backend sehingga frontend React pada port 5173 dapat berkomunikasi secara aman tanpa blokir peramban.
2. Lapisan abstraksi berhasil dibangun sehingga aplikasi frontend dapat berpindah antara backend Laravel dan Fiber dengan mudah tanpa mengubah logika antarmuka pengguna.
3. Fitur CRUD Mahasiswa (Daftar dengan debounce dan paginasi, Tambah dengan validasi server 422, serta Hapus dengan dialog konfirmasi) bekerja secara responsif dan memenuhi standar kualitas kode serta panduan praktikum.
