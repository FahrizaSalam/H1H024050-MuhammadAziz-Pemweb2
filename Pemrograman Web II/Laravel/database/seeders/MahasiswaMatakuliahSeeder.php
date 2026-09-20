<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mahasiswa;
use App\Models\Matakuliah;

class MahasiswaMatakuliahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $matakuliahIds = Matakuliah::pluck('id')->toArray();
        $nilaiOptions = ['A', 'AB', 'B', 'BC', 'C', 'D', 'E'];

        $mahasiswas = Mahasiswa::all();

        foreach ($mahasiswas as $mahasiswa) {
            // Setiap mahasiswa mengambil 3-6 matakuliah secara acak
            $jumlahMk = rand(3, 6);
            $selectedMk = array_rand(array_flip($matakuliahIds), min($jumlahMk, count($matakuliahIds)));

            if (!is_array($selectedMk)) {
                $selectedMk = [$selectedMk];
            }

            foreach ($selectedMk as $mkId) {
                $mahasiswa->matakuliahs()->attach($mkId, [
                    'nilai' => $nilaiOptions[array_rand($nilaiOptions)],
                ]);
            }
        }
    }
}
