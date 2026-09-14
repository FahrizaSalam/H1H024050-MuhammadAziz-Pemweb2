@props(['sks'])

@php
    $warna = $sks < 3 ? 'danger' : 'success';
@endphp

<span class="badge bg-{{ $warna }}">{{ $sks }} SKS</span>
