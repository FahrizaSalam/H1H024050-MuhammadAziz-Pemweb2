@extends('layouts.app')
@section('judul', 'Detail Matakuliah')
@section('konten')
<h1 class="h3 mb-4">Detail Matakuliah</h1>
<div class="card">
    <div class="card-body">
        <table class="table table-borderless mb-0">
            <tr>
                <th width="150">Kode</th>
                <td>{{ $matakuliah['kode'] }}</td>
            </tr>
            <tr>
                <th>Nama</th>
                <td>{{ $matakuliah['nama'] }}</td>
            </tr>
            <tr>
                <th>SKS</th>
                <td><x-badge-sks :sks="$matakuliah['sks']" /></td>
            </tr>
        </table>
    </div>
</div>
<a href="{{ route('matakuliah.index') }}" class="btn btn-secondary mt-3">Kembali</a>
@endsection
