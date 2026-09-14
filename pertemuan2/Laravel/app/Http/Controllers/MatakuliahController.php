<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MatakuliahController extends Controller
{
    private function dataMatakuliah()
    {
        return [
            ['kode' => 'MK001', 'nama' => 'Pemrograman Web', 'sks' => 3],
            ['kode' => 'MK002', 'nama' => 'Basis Data', 'sks' => 3],
            ['kode' => 'MK003', 'nama' => 'Algoritma dan Struktur Data', 'sks' => 4],
            ['kode' => 'MK004', 'nama' => 'Jaringan Komputer', 'sks' => 2],
            ['kode' => 'MK005', 'nama' => 'Sistem Operasi', 'sks' => 2],
        ];
    }

    public function index(Request $request)
    {
        $daftarMatakuliah = $this->dataMatakuliah();

        // Fitur pencarian menggunakan query string
        $cari = $request->query('cari', '');
        if ($cari !== '') {
            $daftarMatakuliah = array_filter($daftarMatakuliah, function ($mk) use ($cari) {
                return stripos($mk['kode'], $cari) !== false
                    || stripos($mk['nama'], $cari) !== false;
            });
            $daftarMatakuliah = array_values($daftarMatakuliah);
        }

        return view('matakuliah.index', [
            'daftarMatakuliah' => $daftarMatakuliah,
            'cari' => $cari,
        ]);
    }

    public function show(string $kode)
    {
        $daftarMatakuliah = $this->dataMatakuliah();

        $matakuliah = null;
        foreach ($daftarMatakuliah as $mk) {
            if ($mk['kode'] === $kode) {
                $matakuliah = $mk;
                break;
            }
        }

        if (!$matakuliah) {
            abort(404, 'Matakuliah tidak ditemukan');
        }

        return view('matakuliah.show', ['matakuliah' => $matakuliah]);
    }
}
