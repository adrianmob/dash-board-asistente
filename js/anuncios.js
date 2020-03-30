let array_anuncios = [];
check();

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

    let element = document.getElementById('ciudad');

    firebase.database().ref("ciudades/").once("value", (data) => {
        let ciudades = data.val();
        let node;
        for (const key in ciudades) {
            node = document.createElement("OPTION");
            node.innerHTML = ciudades[key]['nombre'];
            node.setAttribute("value", key);
            element.add(node);
        }
        var select = document.querySelectorAll('select');
        var selectInst = M.FormSelect.init(select);

        update_anuncios();

    });

  
});

function update_anuncios()
{
    let ciudad = document.getElementById('ciudad').value;

    firebase.database().ref("anuncios/").orderByChild('ciudad').equalTo(ciudad).on("value",(data)=>{
        
        array_anuncios = [];
        
        let anuncios = data.val();
        let $anuncios = document.getElementById('carousel');

        while ($anuncios.children.length > 1) {
            $anuncios.removeChild($anuncios.lastChild);
        }  

        for (const key in anuncios) {

            array_anuncios.push({key:key});

            node = document.createElement("A");
            node.setAttribute("class","carousel-item");
            node.innerHTML = `<img src="${ anuncios[key]['foto'] }">`;
            $anuncios.appendChild(node);
        }

        if ( data.val() )
        {
            $('.carousel').carousel({
                fullWidth: true,
                indicators: true,
                noWrap: true
            }); 
        }

    });
}

function fotos(logo){
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

    var imagen = document.getElementById("imgLogo");
    imagen = imagen.getAttribute("src");

    var fecha = Date.now();
    var tipoCheck = document.getElementById('switcPromo').checked;
    var tipo = (tipoCheck) ? "promocion" : "anuncio";
    let ciudad = document.getElementById('ciudad').value;

    var body = {
        telefono:  document.getElementById("telefono").value,
        fechaInicio: document.getElementById("fechaIni").value,
        fechaFin: document.getElementById("fechaFin").value,
        fechaRegistro: fecha,
        foto: imagen,
        ciudad,
        tipo: tipo
    };

    body.fechaFin = convFecha(body.fechaFin);
    body.fechaInicio = convFecha(body.fechaInicio);

    firebase.database().ref("anuncios/").push(body);
           
    Swal.fire({
        type: 'success',
        title: 'Muy bien',
        text: 'Anuncio Agregado',
        showConfirmButton: false,
        timer: 1500
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

function eliminar()
{
    var instance = M.Carousel.getInstance($('#carousel'));

    Swal.fire({
        title: '¿Estas seguro?',
        text: "Se eliminara el anuncio",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminalo!'
      }).then((result) => {
          if (result.value) {
          
            firebase.database().ref('anuncios/' + array_anuncios[instance.center]['key']).remove();

            Swal.fire({
                type: 'success',
                title: 'Eliminado',
                text: 'El anuncio ha sido eliminado.'
            });

        }
      });
}