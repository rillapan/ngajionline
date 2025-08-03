



$(document).ready(function(){
    showListAsmaulHusna()
    let screenWidth = $(window).width();
    if (screenWidth <= 513){
        $('.col-back').removeClass('col-5').addClass('col-4')

    }
})



$('.input-asmaul-husna').on('input', function(){
    //console.log($('.input-asmaul-husna').val());
    if ($('.input-asmaul-husna').val() === ''){
        showListAsmaulHusna()
    }else{
        let input = $('.input-asmaul-husna').val().toLowerCase().split(/-| /)
        //console.log(input);
        showSelected(input)
    }
})



const showSelected = input => {

    let list = ''
    $.ajax({
        url :'asmaul-husna.json',
        success : response =>{
            //console.log(response);
            response.forEach(a => {
                //console.log(a.latin.split(' ')[0]);
                if (input.some(i => a.latin.toLowerCase().split(' ').includes(i))) {
                    //console.log(a.latin);
                    list+= showAsmaulHusna(a)

                }
            })
            $('.isi-asmaul-husna').html(list)

        }
    })

}





const showListAsmaulHusna = () => {
    let list_asmaul_husna = ''
    $.ajax({  
        url : 'asmaul-husna.json',
        success : response => {
            response.forEach(a => {
                list_asmaul_husna += showAsmaulHusna(a)          
            });
    
            $('.isi-asmaul-husna').html(list_asmaul_husna)
        }
    
    })
}







const showAsmaulHusna = a =>{
    return `<div class="col-md-5  bg-white shadow ms-1 me-1 mb-4   pt-3 ps-2 pe-2">
                <div class="row text-center">
                    <p class="font-arab fw-bold fs-2 ">${a.arab}</p>
                    <p class="fw-bold text-latin-asmaul-husna">${a.latin}</p>
                    <p class="fst-italic">${a.arti}</p>
                </div>
                                
            </div>`
}