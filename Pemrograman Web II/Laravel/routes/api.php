<?php

use App\Http\Controllers\Api\MahasiswaController;
use App\Http\Controllers\Api\MatakuliahController;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use App\Http\Resources\MahasiswaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/status', function () {
    return response()->json([
        'sukses' => true,
        'pesan' => 'API Pemweb II aktif',
        'waktu' => now()->toIso8601String(),
    ]);
});

Route::apiResource('mahasiswa', MahasiswaController::class);
Route::apiResource('matakuliah', MatakuliahController::class);

Route::get('/program-studi/{id}/mahasiswa', function (Request $request, $id) {
    $programStudi = ProgramStudi::findOrFail($id);
    $perHalaman = min($request->integer('per_halaman', 10), 100);
    $mahasiswa = $programStudi->mahasiswa()->paginate($perHalaman);
    return MahasiswaResource::collection($mahasiswa);
});
