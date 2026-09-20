<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Mahasiswa;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ProgramStudiSeeder::class);
        Mahasiswa::factory()->count(30)->create();
        $this->call(MatakuliahSeeder::class);
        $this->call(MahasiswaMatakuliahSeeder::class);
    }
}
