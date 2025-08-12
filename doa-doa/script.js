$(document).ready(function(){
    showAllDoa()
    let screenWidth = $(window).width();
    if (screenWidth <= 513){
        $('.col-back').removeClass('col-5').addClass('col-4')
    }
})

const showAllDoa = d => {
    let doa = ``
    $.ajax({
        url: 'doa.json',
        success: response => {
            response.forEach(d => {
                doa += listDoa(d)
            });
            $('.content-doa').html(doa)
        }
    })
}

const listDoa = d => {
    const imageUrl = d.image || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
    
    return `
    <div class="doa-card">
        <div class="doa-content-wrapper">
            <img src="${imageUrl}" alt="${d.doa}" class="doa-image">
            <div class="doa-title">${d.id}. ${d.doa}</div>
            <div class="doa-arabic">${d.ayat}</div>
            <div class="doa-latin">${d.latin}</div>
            <div class="doa-translation">${d.artinya}</div>
        </div>
    </div>`
}