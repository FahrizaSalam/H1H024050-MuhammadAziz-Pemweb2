<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matakuliah;

class MatakuliahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $daftar = [
            ['kode' => 'MK001', 'nama' => 'Pemrograman Web I', 'sks' => 3, 'semester' => 3],
            ['kode' => 'MK002', 'nama' => 'Basis Data', 'sks' => 3, 'semester' => 3],
            ['kode' => 'MK003', 'nama' => 'Algoritma dan Struktur Data', 'sks' => 4, 'semester' => 2],
            ['kode' => 'MK004', 'nama' => 'Jaringan Komputer', 'sks' => 3, 'semester' => 4],
            ['kode' => 'MK005', 'nama' => 'Sistem Operasi', 'sks' => 3, 'semester' => 4],
            ['kode' => 'MK006', 'nama' => 'Pemrograman Web II', 'sks' => 3, 'semester' => 5],
            ['kode' => 'MK007', 'nama' => 'Kecerdasan Buatan', 'sks' => 3, 'semester' => 5],
            ['kode' => 'MK008', 'nama' => 'Matematika Diskrit', 'sks' => 3, 'semester' => 2],
        ];

        foreach ($daftar as $item) {
            Matakuliah::create($item);
        }
    }
}
