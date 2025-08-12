$(document).ready(function(){
    showListSurat()
    adjustLayoutForMobile()
})

function adjustLayoutForMobile() {
    let screenWidth = $(window).width();
    if (screenWidth <= 513){
        $('.col-back').removeClass('col-5').addClass('col-4')
    }
}

function showListSurat(){
    let cover_surat = '';
    $.ajax({
        url: 'https://equran.id/api/surat',
        success: data => {
            data.forEach(s => {
                if (s.nomor >= 78) { // Juz Amma starts from Surah 78 (An-Naba')
                    cover_surat += daftarSurat(s);
                }
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
                url: `https://equran.id/api/surat/${surat}`,
                success: function(data_surat){
                    let isi_ayat = `
                    <div class="container body-quran">
                        <div class="row mb-5 shadow-sm">
                            <div class="col p-3 text-center">
                                <h3 class="surah-title">${data_surat.nama_latin} • ${data_surat.nama}</h3>
                                <h5 class="surah-info">${data_surat.tempat_turun} • ${data_surat.jumlah_ayat} Ayat</h5>
                            </div>
                        </div>`;
                    
                    data_surat.ayat.forEach(s => {
                        isi_ayat += showAyat(s);
                    });

                    $('.container-surat').html(isi_ayat)
                    setupTafsirButtons(surat);
                },
                error: e => console.log(e.status)
            })
        },
        error: function(error) {
            console.error(error);
        }
    });
}

function setupTafsirButtons(surat) {
    $('.btn-tafsir-ayat').on('click', function(){
        let ayat = $(this).data('ayat')-1;
        let isi_surat = $(this).data('isi')
        $.ajax({
            url: `https://equran.id/api/tafsir/${surat}`,
            success: function(data_tafsir){
                $('.modal-content').html(showModal(data_tafsir, ayat, isi_surat))
            }
        })
    })
}

const daftarSurat = s => {
    return `
    <div class="col-md-4 col-lg-3 mb-4">
        <div class="nama-surat card-hover" data-surat="${s.nama_latin}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-gold">${s.nomor}</span>
                    <h4 class="arabic-text-medium mb-0">${s.nama}</h4>
                </div>
                <div class="text-end">
                    <h5 class="surah-latin">${s.nama_latin}</h5>
                    <p class="surah-translation"><em>${s.arti}</em></p>
                    <span class="badge bg-secondary">${s.jumlah_ayat} ayat</span>
                </div>
            </div>
        </div>
    </div>`
}

const showAyat = s => {
    return `
    <div class="ayat-container">
        <div class="row g-0">
            <div class="col-2 col-md-1">
                <div class="dropdown ayat-number-wrapper">
                    <button class="btn ayat-btn-plain" type="button" data-bs-toggle="dropdown">
                        <div class="circle-ayat-number">${s.nomor}</div>
                        <div class="tafsir-label">Tafsir</div>
                    </button>
                    <ul class="dropdown-menu ayat-dropdown-menu">
                        <li><a class="dropdown-item btn-tafsir-ayat" data-bs-toggle="modal" data-bs-target="#staticBackdrop" 
                               data-ayat="${s.nomor}" data-isi="${s.ar}">
                            <i class="bi bi-journals"></i> Lihat Tafsir
                        </a></li>
                    </ul>
                </div>
            </div>
            <div class="col-10 col-md-11">
                <div class="arabic-text-large mb-3">${s.ar}</div>
                <div class="translation-text"><i>${s.tr}</i></div>
                <div class="indonesian-text mt-2">${s.idn}</div>
            </div>
        </div>
    </div>`
}

function showModal(s, ayat, isi_surat) {
    return `
    <div class="modal-header">
        <h5 class="modal-title">Tafsir Q.S ${s.nomor}:${ayat+1}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body">
        <div class="arabic-text-large text-end mb-4">${isi_surat}</div>
        <div class="tafsir-content">
            <h6>Tafsir:</h6>
            <p>${s.tafsir[ayat].tafsir}</p>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
    </div>`
}

// Add CSS for Juz Amma page
const juzAmmaCSS = `
.arabic-text-large {
    font-family: 'Amiri', serif !important;
    font-size: 2.5rem !important;
    line-height: 1.8 !important;
    text-align: right;
    color: #083D1E !important;
    margin: 15px 0 !important;
}

.arabic-text-medium {
    font-family: 'Amiri', serif !important;
    font-size: 1.8rem !important;
    line-height: 1.5 !important;
    text-align: right;
    color: #083D1E !important;
}

.nama-surat {
    background: white !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    padding: 15px !important;
    transition: all 0.3s ease !important;
    border-top: 4px solid #B78D41 !important;
    height: 100% !important;
}

.nama-surat:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
}

.bg-gold {
    background-color: #B78D41 !important;
}

.ayat-container {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.surah-title {
    color: #0A5E2A;
    font-weight: 600;
}

.surah-info {
    color: #6c757d;
}

@media (max-width: 768px) {
    .arabic-text-large {
        font-size: 2rem !important;
    }
    .arabic-text-medium {
        font-size: 1.5rem !important;
    }
}
`;

// Inject the CSS
$('head').append(`<style>${juzAmmaCSS}</style>`);