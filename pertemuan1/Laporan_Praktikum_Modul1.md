# Laporan Praktikum Modul 1
## Penyiapan Lingkungan Pengembangan Web Modern
### Praktikum Pemrograman Web II — Teknik Komputer UNSOED

**Nama:** Muhammad Aziz Ihza Fahriza Salam  
**NIM:** H1H024050  
**Program Studi:** Teknik Komputer  

---

## A. Tugas Praktikum

### Tugas 1: Endpoint GET /api/mahasiswa (Fiber)

Telah ditambahkan endpoint `GET /api/mahasiswa` pada proyek Fiber yang mengembalikan JSON berisi NIM, nama, dan program studi.

**Kode yang ditambahkan pada `main.go`:**

```go
app.Get("/api/mahasiswa", func(c fiber.Ctx) error {
    return c.JSON(fiber.Map{
        "nim":           "H1H024050",
        "nama":          "Muhammad Aziz Ihza Fahriza Salam",
        "program_studi": "Teknik Komputer",
    })
})
```

**Hasil pengujian endpoint:**

```json
{
    "nim": "H1H024050",
    "nama": "Muhammad Aziz Ihza Fahriza Salam",
    "program_studi": "Teknik Komputer"
}
```

### Tugas 2: Ubah Halaman Depan Laravel

Halaman depan Laravel (`welcome.blade.php`) telah diubah agar menampilkan nama dan NIM. Perubahan dilakukan pada bagian heading dan paragraf utama:

```html
<h1 class="mb-1 font-medium text-lg">Praktikum Pemrograman Web II</h1>
<p class="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
    Nama: Muhammad Aziz Ihza Fahriza Salam<br />
    NIM: H1H024050<br />
    Program Studi: Teknik Komputer
</p>
```

### Tugas 3: Repositori GitHub

Repositori telah dibuat pada GitHub sesuai konvensi penamaan, dan kedua proyek (Laravel dan Fiber) telah diunggah.

### Tugas 4: Tabel Perbandingan Laravel dan Fiber

| Aspek | Laravel | Fiber |
|-------|---------|-------|
| **Bahasa Pemrograman** | PHP 8.4 | Go 1.23+ |
| **Proses Instalasi** | Membutuhkan PHP runtime, Composer sebagai manajer paket, dan Node.js untuk build tool frontend. Proses instalasi lebih banyak langkah karena banyak dependensi. | Hanya membutuhkan Go toolchain. Instalasi lebih ringkas karena Go menghasilkan binary tunggal tanpa memerlukan runtime tambahan. |
| **Ukuran Proyek** | Proyek baru memiliki ukuran yang relatif besar karena folder `vendor` berisi banyak paket dependensi PHP. | Proyek baru memiliki ukuran lebih kecil. Dependensi dikelola melalui `go.mod` dan disimpan di cache global Go, bukan di dalam folder proyek. |
| **Fitur Bawaan** | Sangat kaya fitur bawaan: ORM (Eloquent), sistem migrasi, autentikasi, antrian pekerjaan, penjadwalan tugas, templating (Blade), dan banyak lagi. Cocok untuk aplikasi bisnis kompleks. | Minimalis dan ringan. Hanya menyediakan routing dan middleware dasar. Library tambahan harus dipasang terpisah sesuai kebutuhan. Cocok untuk layanan dengan latensi rendah. |
| **Waktu Startup Server** | Server development (`php artisan serve`) membutuhkan beberapa detik untuk startup. | Server Fiber startup sangat cepat (kurang dari 1 detik) karena Go mengompilasi ke binary native. |
| **Kinerja (Performance)** | Cukup baik untuk kebanyakan aplikasi web, namun lebih lambat dibanding Go karena PHP bersifat interpreted. | Sangat tinggi. Fiber dibangun di atas FastHTTP yang merupakan HTTP engine tercepat di Go. Cocok untuk layanan yang menuntut throughput tinggi dan latensi rendah. |

---

## B. Pertanyaan Pembahasan

### 1. Mengapa folder `vendor` pada Laravel dan berkas binary Go tidak diikutsertakan dalam repositori Git?

Folder `vendor` pada Laravel dan berkas binary Go tidak diikutsertakan dalam repositori Git karena beberapa alasan:

- **Ukuran yang besar:** Folder `vendor` pada Laravel berisi seluruh dependensi PHP yang diunduh melalui Composer. Ukurannya bisa mencapai puluhan hingga ratusan megabyte. Demikian pula, berkas binary Go hasil kompilasi berukuran cukup besar. Menyimpan file-file ini di repositori akan membuat ukuran repositori membengkak dan memperlambat proses clone.

- **Dapat dihasilkan ulang (reproducible):** Folder `vendor` dapat dibuat ulang kapan saja dengan menjalankan perintah `composer install`, yang akan membaca berkas `composer.json` dan `composer.lock` untuk mengunduh dependensi yang tepat. Berkas binary Go juga dapat dihasilkan ulang dengan perintah `go build`. Oleh karena itu, tidak perlu menyimpannya di Git.

- **Perbedaan antar platform:** Berkas binary Go bersifat spesifik terhadap sistem operasi dan arsitektur prosesor (misalnya `Windows/amd64` berbeda dengan `Linux/arm64`). Menyimpan binary di repositori tidak berguna karena hanya berfungsi pada satu platform tertentu.

- **Praktik terbaik (best practice):** Konvensi dalam pengembangan perangkat lunak adalah hanya menyimpan kode sumber dan berkas konfigurasi di repositori, bukan hasil build atau dependensi pihak ketiga. Berkas `.gitignore` digunakan untuk mengecualikan file-file tersebut.

### 2. Apa fungsi berkas `composer.json` dan `go.mod`, serta apa persamaan keduanya?

**`composer.json`** adalah berkas konfigurasi utama untuk Composer, manajer paket PHP. Berkas ini berfungsi untuk:
- Mendefinisikan metadata proyek (nama, deskripsi, lisensi)
- Mendaftarkan dependensi yang dibutuhkan proyek beserta batasan versinya
- Mengatur autoloading kelas PHP
- Mendefinisikan skrip yang dapat dijalankan melalui Composer

**`go.mod`** adalah berkas konfigurasi modul Go. Berkas ini berfungsi untuk:
- Mendefinisikan nama modul (module path)
- Menentukan versi minimum Go yang digunakan
- Mendaftarkan dependensi yang dibutuhkan beserta versinya
- Mengelola dependensi secara deklaratif

**Persamaan keduanya:**
1. Keduanya berfungsi sebagai **deklarasi dependensi** — mendaftarkan pustaka pihak ketiga yang dibutuhkan proyek agar dapat berjalan.
2. Keduanya memungkinkan **reproduksi lingkungan yang konsisten** — siapa saja yang mengunduh proyek dapat memasang dependensi yang sama persis dengan menjalankan satu perintah (`composer install` atau `go mod download`).
3. Keduanya memiliki **berkas pengunci (lock file)**: `composer.lock` untuk Laravel dan `go.sum` untuk Go, yang mencatat versi pasti dan hash integritas setiap dependensi untuk menjamin konsistensi antar mesin pengembang.
4. Keduanya merupakan berkas teks biasa yang **harus diikutsertakan dalam repositori Git** agar kolaborator lain dapat membangun proyek dengan dependensi yang sama.

### 3. Jelaskan perbedaan port 8000 pada Laravel dan port 3000 pada Fiber dalam konteks praktikum ini.

Dalam konteks praktikum ini, **port 8000** dan **port 3000** adalah nomor port TCP yang digunakan oleh masing-masing server pengembangan untuk menerima koneksi HTTP.

**Port 8000 (Laravel):**
- Merupakan port default yang digunakan oleh perintah `php artisan serve`, yaitu server pengembangan bawaan PHP.
- Ketika server berjalan, aplikasi Laravel dapat diakses melalui `http://127.0.0.1:8000`.
- Port ini dipilih secara konvensi oleh Laravel sebagai port default untuk development server.

**Port 3000 (Fiber):**
- Merupakan port yang secara eksplisit ditentukan dalam kode program melalui `app.Listen(":3000")`.
- Ketika server berjalan, aplikasi Fiber dapat diakses melalui `http://localhost:3000`.
- Port ini dipilih secara manual oleh pengembang dan dapat diubah ke nomor port lain sesuai kebutuhan.

**Perbedaan penting:**
- Secara teknis, **tidak ada perbedaan fungsional** antara kedua port tersebut. Keduanya sama-sama merupakan port TCP yang berfungsi sebagai titik masuk (entry point) untuk menerima permintaan HTTP.
- Pemilihan nomor port yang **berbeda** memungkinkan kedua server berjalan **secara bersamaan** pada mesin yang sama tanpa terjadi konflik. Jika keduanya menggunakan port yang sama, salah satu server akan gagal karena port sudah terpakai (*port already in use*).
- Port 8000 dan 3000 termasuk dalam rentang **port non-privileged** (di atas 1024), sehingga tidak memerlukan hak akses administrator untuk digunakan.
- Dalam lingkungan produksi, kedua aplikasi biasanya akan dijalankan pada port standar HTTP (80) atau HTTPS (443) melalui reverse proxy seperti Nginx atau Caddy.

---

## C. Kesimpulan

Melalui modul praktikum ini, telah berhasil dilakukan:
1. Verifikasi instalasi PHP, Composer, dan Go toolchain.
2. Pembuatan proyek Laravel 13 dan proyek Fiber v3.
3. Penambahan endpoint RESTful API pada Fiber (`/api/info` dan `/api/mahasiswa`).
4. Modifikasi halaman depan Laravel untuk menampilkan identitas mahasiswa.
5. Pengelolaan kode menggunakan Git dan GitHub.

Dari perbandingan kedua framework, dapat disimpulkan bahwa konsep RESTful API bersifat universal dan tidak terikat pada satu bahasa pemrograman. Laravel unggul dalam kelengkapan fitur bawaan untuk pengembangan aplikasi bisnis, sementara Fiber unggul dalam kinerja dan kesederhanaan untuk layanan yang membutuhkan latensi rendah.
