var anuncios = [];
document.addEventListener('DOMContentLoaded', async function() {
    await firebase.database().ref("historialAnunciate/").on("value",(data)=>{
        var fila = document.getElementById("fila");
        while(fila.firstChild){
            fila.removeChild(fila.firstChild);
        }
        for (const key in data.val()) {

            var contenedor = document.createElement("DIV");
            contenedor.classList.add("col");
            contenedor.classList.add("s12");
            contenedor.classList.add("m6");

            var card = document.createElement("DIV");
            card.classList.add("card");
            card.classList.add("z-depth-3");

            var cardCont = document.createElement("DIV");
            cardCont.classList.add("card-content");

            var titulo = document.createElement("SPAN");
            titulo.classList.add("card-title");
            titulo.innerHTML = data.val()[key]['apellidoPat'] + " " + data.val()[key]['apellidoMat'] + " " + data.val()[key]['nombre'];

            var info = document.createElement("DIV");
            info.classList.add("info");

            var correo = document.createElement("DIV");
            correo.classList.add("infoText");

            var correoIcono = document.createElement("I");
            correoIcono.classList.add("material-icons");
            correoIcono.classList.add("blue-text");
            correoIcono.classList.add("text-darken-2");
            correoIcono.classList.add("icono");
            correoIcono.innerHTML = "alternate_email";

            var correoText = document.createElement("SPAN");
            correoText.innerHTML = data.val()[key]['correo'];
            
            correo.appendChild(correoIcono);
            correo.appendChild(correoText);

            var telefono = document.createElement("DIV");
            telefono.classList.add("infoText");

            var telIcono = document.createElement("I");
            telIcono.classList.add("material-icons");
            telIcono.classList.add("blue-text");
            telIcono.classList.add("text-darken-2");
            telIcono.classList.add("icono");
            telIcono.innerHTML = "phone";

            var telText = document.createElement("SPAN");
            telText.innerHTML = data.val()[key]['telefono'];

            telefono.appendChild(telIcono);
            telefono.appendChild(telText);

            var fecha = document.createElement("DIV");
            fecha.classList.add("infoText");

            var fechaIcono = document.createElement("I");
            fechaIcono.classList.add("material-icons");
            fechaIcono.classList.add("blue-text");
            fechaIcono.classList.add("text-darken-2");
            fechaIcono.classList.add("icono");
            fechaIcono.innerHTML = "access_time";

            var fechaText = document.createElement("SPAN");
            fechaText.innerHTML = fechaChange(data.val()[key]['fecha']);

            fecha.appendChild(fechaIcono);
            fecha.appendChild(fechaText);

            info.appendChild(correo);
            info.appendChild(telefono);
            info.appendChild(fecha);

            cardCont.appendChild(titulo)
            cardCont.appendChild(info);

            card.appendChild(cardCont);

            contenedor.appendChild(card);

            fila.appendChild(contenedor);


            anuncios.push(data.val()[key]);

        }
    });

});

function fechaChange(fecha){
    var fechaHora = "";
    var fechaMil = new Date(fecha);
    return fechaHora = fechaMil.getDate() + "/" + (fechaMil.getMonth()+1) + "/" + fechaMil.getFullYear() +" " + fechaMil.getHours()+":"+fechaMil.getMinutes();
}

