@extends('layouts.app')

@section('judul', 'Detail Mahasiswa - ' . $mahasiswa->nama)

@section('konten')
<div class="mb-3">
    <a href="{{ route('mahasiswa.data') }}" class="btn btn-secondary btn-sm">&larr; Kembali ke Data Mahasiswa</a>
</div>

<div class="card mb-4">
    <div class="card-header">
        <h1 class="h4 mb-0">Detail Mahasiswa</h1>
    </div>
    <div class="card-body">
        <table class="table table-bordered mb-0">
            <tr>
                <th style="width: 200px;">NIM</th>
                <td>{{ $mahasiswa->nim }}</td>
            </tr>
            <tr>
                <th>Nama</th>
                <td>{{ $mahasiswa->nama }}</td>
            </tr>
            <tr>
                <th>Program Studi</th>
                <td>{{ $mahasiswa->programStudi->nama }}</td>
            </tr>
            <tr>
                <th>Angkatan</th>
                <td>{{ $mahasiswa->angkatan }}</td>
            </tr>
            <tr>
                <th>IPK</th>
                <td>{{ $mahasiswa->ipk }}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>
                    @if ($mahasiswa->aktif)
                        <span class="badge bg-success">Aktif</span>
                    @else
                        <span class="badge bg-secondary">Tidak Aktif</span>
                    @endif
                </td>
            </tr>
        </table>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <h2 class="h5 mb-0">Daftar Matakuliah yang Diambil</h2>
    </div>
    <div class="card-body">
        @if ($mahasiswa->matakuliahs->count() > 0)
            <table class="table table-striped mb-0">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Kode</th>
                        <th>Nama Matakuliah</th>
                        <th>SKS</th>
                        <th>Semester</th>
                        <th>Nilai</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($mahasiswa->matakuliahs as $index => $matakuliah)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $matakuliah->kode }}</td>
                            <td>{{ $matakuliah->nama }}</td>
                            <td>{{ $matakuliah->sks }}</td>
                            <td>{{ $matakuliah->semester }}</td>
                            <td><span class="badge bg-primary">{{ $matakuliah->pivot->nilai ?? '-' }}</span></td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="text-muted mb-0">Belum ada matakuliah yang diambil.</p>
        @endif
    </div>
</div>
@endsection
