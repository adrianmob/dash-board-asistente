var comentarios = [];
document.addEventListener('DOMContentLoaded', async function() {
    await firebase.database().ref("comentarios/").on("value",(data)=>{
        var fila = document.getElementById("fila");
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
            var nombre = (data.val()[key]['apellidoPat']) ? data.val()[key]['apellidoPat'] : "";
            nombre += (data.val()[key]['apellidoMat']) ? data.val()[key]['apellidoMat'] : "";
            nombre += data.val()[key]['nombre'];
            titulo.innerHTML = nombre;

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

            var comentario = document.createElement("DIV");
            comentario.classList.add("infoText");

            var comIcono = document.createElement("I");
            comIcono.classList.add("material-icons");
            comIcono.classList.add("blue-text");
            comIcono.classList.add("text-darken-2");
            comIcono.classList.add("icono");
            comIcono.innerHTML = "comment";

            var comText = document.createElement("SPAN");
            comText.innerHTML = data.val()[key]['comentario'];

            comentario.appendChild(comIcono);
            comentario.appendChild(comText);

            info.appendChild(correo);
            info.appendChild(telefono);
            info.appendChild(comentario);

            cardCont.appendChild(titulo)
            cardCont.appendChild(info);

            card.appendChild(cardCont);

            contenedor.appendChild(card);

            fila.appendChild(contenedor);


            comentarios.push(data.val()[key]);

        }
    });

});