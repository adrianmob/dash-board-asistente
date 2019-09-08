document.addEventListener('DOMContentLoaded', function() {
    var datapicker = document.querySelectorAll('.datepicker');
    var datainstances = M.Datepicker.init(datapicker, {
        yearRange: 2,
        showMonthAfterYear: true,
        i18n: {
            cancel: "Cancelar",
            months: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre'
            ],
            monthsShort: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic'
            ],
            weekdays: [
                'Domingo',
                'Lunes',
                'Martes',
                'Miercoles',
                'Jueves',
                'Viernes',
                'Sabado'
            ],
            weekdaysShort:[
                'Dom',
                'Lun',
                'Mar',
                'Mir',
                'Jue',
                'Vie',
                'Sab'
            ],
            weekdaysAbbrev: [
                'D',
                'L',
                'M',
                'M',
                'J',
                'V',
                'S'
            ]
        }
    });
});

function foto(logo){
    var foto = document.getElementById("anuncio");
    console.log(foto.files);
    if(foto.files.length > 0){
        var reader = new FileReader();
        reader.onload = function (e){
            var img = document.getElementById("imgLogo");
            img.setAttribute("src",e.target.result);
        };
        reader.readAsDataURL(foto.files[0]);
    }
}

function registrar(){

    var fecha = Date.now();
    debugger;
    var tipoCheck = document.getElementById('switcPromo').checked;
    var tipo = (tipoCheck) ? "promocion" : "anuncio";
    console.log(tipo);

    var body = {
        telefono:  document.getElementById("telefono").value,
        fechaInicio: document.getElementById("fechaIni").value,
        fechaFin: document.getElementById("fechaFin").value,
        fechaRegistro: fecha,
        foto: "",
        tipo: tipo
    };

    body.fechaFin = convFecha(body.fechaFin);
    body.fechaInicio = convFecha(body.fechaInicio);

    firebase.database().ref("anuncios/").push(body).then((data)=>{
        var imagen = document.getElementById("imgLogo");
        imagen = imagen.getAttribute("src");
        console.log(imagen);
        firebase.storage().ref("anuncios/"+data.key).putString(imagen, 'data_url', { contentType: 'image/jpg' }).then(function(valor) {
            valor.ref.getDownloadURL().then(function(downloadURL) {
                firebase.database().ref("anuncios/"+data.key).update({
                    foto: downloadURL
                });
                Swal.fire({
                    type: 'success',
                    title: 'Muy bien',
                    text: 'Anuncio Agregado',
                    showConfirmButton: false,
                    timer: 1500
                  });
            });
        });
    });
}

function convFecha(fecha){
    var arrFecha = fecha.split(" ");
    arrFecha[1] = arrFecha[1].replace(",","");
    meses = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
    ];
    let mes;
    meses.map( (mesElement,indice) =>{
        
        if(mesElement == arrFecha[0]){
            mes = indice + 1;
        }
    });
    return mes+" "+ arrFecha[1] + " " + arrFecha[2];

}