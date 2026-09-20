@extends('layouts.app')

@section('judul', 'Data Mahasiswa')

@section('konten')
<h1 class="h3 mb-4">Data Mahasiswa</h1>

@if (session('sukses'))
    <div class="alert alert-success">{{ session('sukses') }}</div>
@endif

<div class="mb-3">
    <a href="{{ route('mahasiswa.top-ipk') }}" class="btn btn-primary btn-sm">Top 10 IPK Teknik Komputer</a>
</div>

<table class="table table-striped bg-white">
    <thead>
        <tr>
            <th>NIM</th>
            <th>Nama</th>
            <th>Program Studi</th>
            <th>Angkatan</th>
            <th>IPK</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($daftarMahasiswa as $mahasiswa)
            <tr>
                <td>{{ $mahasiswa->nim }}</td>
                <td>{{ $mahasiswa->nama }}</td>
                <td>{{ $mahasiswa->programStudi->nama }}</td>
                <td>{{ $mahasiswa->angkatan }}</td>
                <td>{{ $mahasiswa->ipk }}</td>
                <td>
                    <a href="{{ route('mahasiswa.detail', $mahasiswa->id) }}" class="btn btn-info btn-sm">Detail</a>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

{{ $daftarMahasiswa->links() }}
@endsection
