$(document).ready(function(){
    showListSurat()
    let screenWidth = $(window).width();
    if (screenWidth <= 513){
        $('.col-back').removeClass('col-5').addClass('col-4')
    }
})

$('.btn-cari-ayat').on('click', function(){
    let nama_surat = $('.input-surat').val().trim()
    if (nama_surat) {
        searchSurat(nama_surat)
    }
    $('.input-surat').val('')
})

// Allow search on Enter key press
$('.input-surat').on('keypress', function(e) {
    if (e.which === 13) {
        let nama_surat = $(this).val().trim()
        if (nama_surat) {
            searchSurat(nama_surat)
            $(this).val('')
        }
    }
})

// New improved search function
function searchSurat(searchTerm) {
    $.ajax({
        url: 'https://equran.id/api/surat',
        success: function(data) {
            // Normalize search term: lowercase, remove hyphens, whitespace, etc.
            const normalizedSearch = searchTerm.toLowerCase()
                .replace(/-/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            
            // Find matching surat with flexible matching
            let foundSurat = data.find(surat => {
                // Normalize surat name for comparison
                const normalizedSurat = surat.nama_latin.toLowerCase()
                    .replace(/-/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                
                // Check for:
                // 1. Exact match (case insensitive, hyphen insensitive)
                // 2. Partial match (user typed beginning of name)
                // 3. Contains match (user typed part of name)
                return normalizedSurat === normalizedSearch ||
                       normalizedSurat.startsWith(normalizedSearch) ||
                       normalizedSurat.includes(normalizedSearch)
            })
            
            if (foundSurat) {
                // If found, show the surat
                showSuratBesertaIsi(foundSurat.nama_latin.toLowerCase())
            } else {
                // If not found, show error message
                $('.container-surat').html(`
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-exclamation-circle fs-1 text-danger"></i>
                        <h4 class="mt-3">Surat tidak ditemukan</h4>
                        <p class="text-muted">Coba dengan nama lain atau lebih lengkap</p>
                    </div>
                `)
            }
        },
        error: function(error) {
            console.error(error)
            $('.container-surat').html(`
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
                    <h4 class="mt-3">Gagal memuat data</h4>
                    <p class="text-muted">Silakan coba lagi nanti</p>
                </div>
            `)
        }
    })
}

// [Rest of your existing code remains unchanged...]
function showListSurat(){
    let cover_surat = '';
    $.ajax({
        url : 'https://equran.id/api/surat',
        success: data =>{
            data.forEach(s => {
                cover_surat+= daftarSurat(s);
            });
            $('.container-surat').html(cover_surat)
            $('.nama-surat').on('click', function(){
                let surat = $(this).data('surat').toLowerCase()
                showSuratBesertaIsi(surat)
            })
        }
    })
}

function showSuratBesertaIsi(nama_surat){
    $.ajax({
        url: 'https://equran.id/api/surat',
        success: function(data) {
            let i = data.findIndex((surat) => surat.nama_latin.toLowerCase() === nama_surat)
            let surat = i+1;
            $.ajax({
                url: 'https://equran.id/api/surat/'+surat,
                success: function (data_surat){
                    let isi_ayat = `<div class="container body-quran">
                        <div class="row mb-5 shadow-sm">
                        <div class="col p-3 text-center">
                                <h5>${data_surat.nama_latin} • ${data_surat.nama}</h5>
                                <h6>${data_surat.tempat_turun} • ${data_surat.jumlah_ayat} Ayat </h6>
                            </div>
                        </div>`;
                    
                    data_surat.ayat.forEach(s => {
                        isi_ayat+=showAyat(s);
                    });

                    $('.container-surat').html(isi_ayat)
                    $('.btn-tafsir-ayat').on('click',function(){
                        let ayat = $(this).data('ayat')-1;
                        let isi_surat = $(this).data('isi')
                        $.ajax({
                            url:'https://equran.id/api/tafsir/'+surat,
                            success: function(data_tafsir){
                                $('.modal-content').html(showModal(data_tafsir, ayat, isi_surat))
                            }
                        })
                    })
                },
                error: e => console.log(e.status)
            })
        },
        error: function(error) {
            console.error(error);
        }
    });
}

const showAyat = s => {
    return `<div class="row mx-0 px-2 px-md-3 py-3 shadow-sm ayat-container mb-3 mb-md-4">
                <!-- Kolom Nomor Ayat & Tafsir -->
                <div class="col-2 col-sm-1 position-relative px-1 px-sm-2">
                    <div class="dropdown d-flex justify-content-center">
                        <button class="btn btn-link p-0 border-0 bg-transparent text-decoration-none" 
                                data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="ayat-number-badge">
                                ${s.nomor}
                                <span class="dropdown-indicator">...</span>
                            </div>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a class="dropdown-item btn-tafsir-ayat d-flex align-items-center" 
                                   data-bs-toggle="modal" data-bs-target="#staticBackdrop" 
                                   data-ayat="${s.nomor}" data-isi="${s.ar}">
                                    <i class="bi bi-journals me-2"></i>Tafsir
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <!-- Kolom Konten Ayat -->
                <div class="col-10 col-sm-11 ps-2 ps-sm-3 pe-0">
                    <div class="row text-end arabic-container mb-2 mb-md-3">
                        <p class="arabic-text mb-0">${s.ar}</p>
                    </div>
                    <div class="row text-start mt-2">
                        <p class="translation-text mb-0"><i>${s.tr}</i></p>
                    </div>
                    <div class="row text-start mt-2">
                        <p class="indonesian-text mb-0">${s.idn}</p>
                    </div>
                </div>
            </div>`;
}

function showModal(s, ayat, isi_surat){
    return `<div class="modal-header border-0 pb-0">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Tafsir Q.S ${s.nomor}:${ayat+1}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-3 p-md-4">
                <div class="row text-end mb-3">
                    <p class="arabic-text-modal mb-0">${isi_surat}</p>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p class="fw-bold mb-2">Tafsir</p>
                        <p class="tafsir-content">${s.tafsir[ayat].tafsir}</p>  
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0 pt-0">
                <button type="button" class="btn btn-sm btn-outline-primary" data-bs-dismiss="modal">Tutup</button>
            </div>`
}

const daftarSurat = s => {
    return `<div class="col-md-3 nama-surat mb-5 ms-1 me-1 pe-2 ps-4 pt-3 pb-3 shadow-sm" data-surat="${s.nama_latin}">
            <div class="row d-flex justify-content-between">
                <div class="col-1 bg-secondary text-center pe-4 text-white"> ${s.nomor} </div>
                <div class="col-6 fw-bold text-end arabic-text-medium">${s.nama}</div>
            </div>
            <div class="row text-end">
                <p>${s.nama_latin}</p>
                <em>${s.arti} (${s.jumlah_ayat} ayat)</em>
            </div>
        </div>`
}
const arabicTextCSS = `
/* Gaya Dasar Ayat */
.nama-surat .arabic-text-medium {
    font-family: 'Amiri', 'Traditional Arabic', serif;
    font-size: 1.5rem; /* Ukuran untuk mobile/tablet */
    color: #083D1E;
}

.nama-surat p {
    font-size: 1.1rem; /* Ukuran nama Latin untuk mobile/tablet */
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: #333;
}

.nama-surat em {
    font-size: 0.9rem; /* Ukuran arti untuk mobile/tablet */
    color: #555;
}
.ayat-container {
    background-color: white;
    border-radius: 10px;
    transition: all 0.3s ease;
    margin-left: 0;
    margin-right: 0;
}

.modal-content {
    border-radius: 12px;
    border: 1px solid rgba(10, 94, 42, 0.2);
}

arabic-text-modal {
    font-family: 'Amiri', 'Traditional Arabic', serif;
    font-size: 1.8rem;
    line-height: 2.5;
    text-align: right;
    color: #083D1E;
    word-wrap: break-word;
}

.tafsir-content {
    font-size: 0.95rem;
    line-height: 1.8;
    text-align: justify;
}

/* Nomor Ayat Responsif */
.ayat-number-badge {
    background-color: #0A5E2A;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
}

.dropdown-indicator {
    font-size: 0.6rem;
    line-height: 0;
    margin-top: -4px;
    color: rgba(255,255,255,0.8);
}

/* Teks Arab Responsif */
.arabic-text {
    font-family: 'Amiri', 'Traditional Arabic', serif;
    font-size: 1.8rem;
    line-height: 2.5;
    text-align: right;
    color: #083D1E;
    word-wrap: break-word;
}

.arabic-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

/* Dropdown Menu Responsif */
.dropdown-menu {
    border: 1px solid #0A5E2A;
    min-width: 120px;
    font-size: 0.9rem;
}

.dropdown-item {
    padding: 0.5rem 1rem;
    color: #0A5E2A;
    transition: all 0.2s;
}

/* Gaya untuk Teks Terjemahan */
.translation-text {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
}

.indonesian-text {
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
}

/* Efek Interaktif */
.ayat-number-badge:hover {
    background-color: #083D1E;
    transform: scale(1.05);
}

.dropdown-item:hover {
    background-color: #0A5E2A;
    color: white !important;
}

.btn-link:focus {
    box-shadow: none !important;
}

/* Responsif untuk Mobile */
@media (max-width: 575.98px) {
      .modal-dialog {
        max-width: 100%;
        margin: 0.5rem;
    }
    
    .modal-body {
        padding: 1rem;
    }
    
    .arabic-text-modal {
        font-size: 1.6rem;
        line-height: 2.2;
    }
    
    .tafsir-content {
        font-size: 0.9rem;
        line-height: 1.7;
    }
    
    .modal-title {
        font-size: 1.1rem;
    }
    .arabic-text {
        font-size: 1.6rem;
        line-height: 2.2;
    }
    
    .ayat-number-badge {
        width: 32px;
        height: 32px;
        font-size: 0.9rem;
    }
    
    .dropdown-menu {
        font-size: 0.85rem;
        min-width: 110px;
    }
    
    .translation-text, 
    .indonesian-text {
        font-size: 0.9rem;
    }
    
    .ayat-container {
        padding: 0.75rem;
    }
}

/* Responsif untuk Tablet */
@media (min-width: 576px) and (max-width: 991.98px) {
     .modal-dialog {
        max-width: 90%;
    }
    
    .arabic-text-modal {
        font-size: 1.7rem;
    }
}

/* Responsif Desktop */
@media (min-width: 992px) {
        .nama-surat .arabic-text-medium {
        font-size: 2rem; /* Perbesar nama Arab */
    }
    
    .nama-surat p {
        font-size: 1.4rem; /* Perbesar nama Latin */
    }
    
    .nama-surat em {
        font-size: 1.1rem; /* Perbesar arti */
    }
    .modal-dialog {
        max-width: 800px;
    }
    
    .arabic-text-modal {
        font-size: 2rem;
        line-height: 3;
    }
    
    .tafsir-content {
        font-size: 1rem;
    }
    .arabic-text {
        font-size: 1.7rem;
        line-height: 2.3;
    }
    
    .ayat-number-badge {
        width: 34px;
        height: 34px;
    }
}

.modal-body {
    max-height: 70vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

/* Responsif untuk Desktop */
@media (min-width: 992px) {
    .arabic-text {
        font-size: 2rem;
        line-height: 3;
    }
    
    .ayat-number-badge {
        width: 38px;
        height: 38px;
        font-size: 1.1rem;
    }
    
    .dropdown-menu {
        min-width: 140px;
        font-size: 1rem;
    }
}



/* Memastikan dropdown tidak terpotong di mobile */
@media (max-width: 400px) {
    .dropdown-menu {
        transform: translateX(-20%) !important;
    }
}

/* Perbaikan untuk teks panjang */
.arabic-text {
    white-space: pre-wrap;
    word-break: break-word;
}

/* Memastikan container tidak overflow */
.row {
    --bs-gutter-x: 1.5rem;
    margin-left: calc(var(--bs-gutter-x) * -0.5);
    margin-right: calc(var(--bs-gutter-x) * -0.5);
}
`;



// Inject the CSS
$('head').append(`<style>${arabicTextCSS}</style>`);