# Catatan Pembelajaran dan Refleksi (Lessons Learned)

- Integrasi Backend & Frontend: Perbedaan kontrak API (penamaan field seperti `password` vs `kata_sandi`, format metadata pagination `current_page` vs `halaman`) harus diisolasi pada adapter/abstraksi agar komponen UI tetap bersih dan decoupled.
- Mekanisme CORS: Browser menangani preflight `OPTIONS` secara otomatis sebelum request dengan custom headers / non-simple methods. Backend harus merespons preflight dengan status sukses dan header `Access-Control-Allow-*` yang tepat sebelum middleware proteksi/auth dievaluasi.
- Interceptor Axios: Centralized error handling pada respons (seperti redirect ke login saat 401) mencegah duplikasi kode penanganan autentikasi di setiap komponen.
