# Analisis Perbandingan Implementasi Autentikasi
## Modul 5 (Laravel Sanctum) vs Modul 8 (Fiber JWT)

### 1. Pendahuluan

Dokumen ini membandingkan implementasi autentikasi pada dua framework yang digunakan
dalam Praktikum Pemrograman Web II: Laravel 13 dengan Sanctum (Modul 5) dan
Go Fiber v3 dengan JWT (Modul 8).

---

### 2. Perbandingan Jumlah Kode

| Aspek                     | Laravel Sanctum (Modul 5)         | Fiber JWT (Modul 8)              |
|---------------------------|-----------------------------------|----------------------------------|
| Model Pengguna            | Sudah tersedia (User.php bawaan)  | Dibuat manual (pengguna.go, ~13 baris) |
| Autentikasi Controller    | ~40 baris (AuthController.php)    | ~180 baris (auth_handler.go)     |
| Middleware                | Otomatis (`auth:sanctum`)         | Dibuat manual (~70 baris)        |
| Konfigurasi Token         | config/sanctum.php (bawaan)       | .env + config.go (~10 baris)     |
| Utilitas Token            | Tidak perlu (Sanctum tangani)     | token.go (~46 baris)             |
| Validasi                  | Form Request bawaan Laravel       | validasi.go (~65 baris)          |
| Rute                      | ~10 baris                         | ~15 baris                        |
| **Total Estimasi**        | **~50-70 baris kode kustom**      | **~400 baris kode kustom**       |

Laravel membutuhkan jauh lebih sedikit kode karena banyak komponen sudah disediakan
oleh framework (model User, middleware auth:sanctum, Form Request, dan mekanisme
token bawaan).

---

### 3. Perbandingan Kemudahan

| Aspek                          | Laravel Sanctum               | Fiber JWT                        |
|--------------------------------|-------------------------------|----------------------------------|
| Setup awal                     | `php artisan install:api`     | 3x `go get` + buat file manual  |
| Pembuatan model                | `php artisan make:model`      | Buat struct manual               |
| Validasi                       | Form Request otomatis         | Pustaka pihak ketiga + kustom    |
| Middleware autentikasi         | Satu baris konfigurasi        | Buat fungsi middleware manual    |
| Hashing kata sandi             | `Hash::make()` bawaan         | Import bcrypt manual             |
| Penerbitan token               | `createToken()` bawaan        | Fungsi JWT manual                |
| Pencabutan token               | `tokens()->delete()` bawaan   | Buat tabel daftar hitam manual   |
| Migrasi basis data             | `php artisan migrate`         | AutoMigrate GORM                 |

Laravel unggul dalam kemudahan karena menyediakan scaffolding dan abstraksi
yang mengurangi boilerplate. Fiber memerlukan lebih banyak pemahaman
teknis karena setiap komponen dibangun dari nol.

---

### 4. Perbandingan Fleksibilitas

| Aspek                          | Laravel Sanctum               | Fiber JWT                        |
|--------------------------------|-------------------------------|----------------------------------|
| Mekanisme token                | Opaque token tersimpan di DB  | JWT (stateless, self-contained)  |
| Kustomisasi klaim              | Terbatas pada abilities       | Bebas menambahkan klaim apa pun  |
| Sistem terdistribusi           | Perlu akses DB bersama        | Cukup berbagi secret key         |
| Pencabutan token               | Mudah (hapus dari DB)         | Perlu mekanisme tambahan         |
| Ukuran token                   | Kecil (hash 40 karakter)      | Besar (berisi payload + tanda tangan) |
| Verifikasi tanpa DB            | Tidak bisa                    | Bisa (cukup periksa tanda tangan)|
| Kontrol otorisasi              | Abilities + middleware        | Middleware peran kustom          |
| Performa verifikasi            | Perlu query DB setiap request | Cukup verifikasi kriptografis    |

JWT pada Fiber lebih fleksibel untuk:
- Arsitektur microservice (tidak perlu shared database)
- Klaim kustom (peran, data tambahan dalam token)
- Performa (tanpa query database untuk verifikasi)

Sanctum pada Laravel lebih fleksibel untuk:
- Pencabutan token segera (instant revocation)
- Keamanan (token tidak bisa dibaca klien)
- Pengelolaan sesi (multiple tokens per user)

---

### 5. Kesimpulan

| Kriteria         | Pemenang       | Alasan                                         |
|------------------|----------------|-------------------------------------------------|
| Jumlah kode      | Laravel        | Scaffolding dan abstraksi mengurangi boilerplate |
| Kemudahan         | Laravel        | Banyak fitur otomatis dan konvensi bawaan       |
| Fleksibilitas     | Fiber (JWT)    | Stateless, cocok untuk sistem terdistribusi     |
| Performa          | Fiber (JWT)    | Verifikasi tanpa akses basis data               |
| Keamanan revokasi | Laravel        | Pencabutan token langsung tanpa mekanisme tambahan |

Pilihan antara keduanya bergantung pada kebutuhan proyek:
- **Laravel Sanctum** cocok untuk aplikasi monolitik yang memerlukan kemudahan
  pengembangan dan pencabutan token segera.
- **Fiber JWT** cocok untuk API dalam arsitektur microservice yang memerlukan
  performa tinggi dan skalabilitas horizontal.

