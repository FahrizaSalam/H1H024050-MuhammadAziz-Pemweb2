@extends('layouts.app')

@section('judul', 'Top 10 IPK - Teknik Komputer')

@section('konten')
<div class="mb-3">
    <a href="{{ route('mahasiswa.data') }}" class="btn btn-secondary btn-sm">&larr; Kembali ke Data Mahasiswa</a>
</div>

<h1 class="h3 mb-4">Top 10 Mahasiswa IPK Tertinggi — Teknik Komputer</h1>

<table class="table table-striped bg-white">
    <thead>
        <tr>
            <th>Peringkat</th>
            <th>NIM</th>
            <th>Nama</th>
            <th>Angkatan</th>
            <th>IPK</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($topMahasiswa as $index => $mahasiswa)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $mahasiswa->nim }}</td>
                <td>{{ $mahasiswa->nama }}</td>
                <td>{{ $mahasiswa->angkatan }}</td>
                <td><strong>{{ $mahasiswa->ipk }}</strong></td>
            </tr>
        @endforeach
    </tbody>
</table>

@if ($topMahasiswa->isEmpty())
    <div class="alert alert-info">Belum ada data mahasiswa Teknik Komputer.</div>
@endif
@endsection
