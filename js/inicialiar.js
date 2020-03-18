var categorias = {};
var tipo;
document.addEventListener('DOMContentLoaded', async function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var eleModal = document.querySelectorAll('.modal');
    var instanceModal = M.Modal.init(eleModal, {
        onCloseStart: (element) => {
            //Ciudades input
            if (document.getElementById('nombreCiudad'))
                document.getElementById('nombreCiudad').value = "";
            //reseteo de los inputs Categoria Add
            document.getElementById('categoria').value = "";
            document.getElementById('nombre').value = "";
            document.getElementById('InputImgCat').value = "";
            document.getElementById('InputImgText').value = "";
            document.getElementById('imgCat').setAttribute("src", "assets/imgs/no-image.png");
            //reseteo de los inputs SUBCATEGORIA1 SELECT
            document.getElementById('subcat1').value = "";
            //reseteo de los inputs SUBCATEGORIA1 ADD
            document.getElementById('subcategoria').value = "";
            document.getElementById('switCheck').value = "";
            document.getElementById('InputImgSubCat').value = "";
            document.getElementById('imgSubCat').setAttribute("src", "assets/imgs/no-image.png");
            document.getElementById('selectServicio').value = "";
            //reseteo de los inputs SUBCATEGORIA2 SELECT
            document.getElementById('subcat2').value = "";
            document.getElementById('switCheck').checked = false;
            document.getElementById('selectServicio').value = "";
            //reseteo de los inputs SUBCATEGORIA2 ADD
            document.getElementById('subcategoria2').value = "";
            document.getElementById('InputImgSubCat2').value = "";
            document.getElementById('imgSubCat2').setAttribute("src", "assets/imgs/no-image.png");
            document.getElementById('selectServicio2').value = "";
            //Editar bloques
            document.getElementById('categoriaEdit').value = "";
            document.getElementById('subCatEdit').value = "";
            document.getElementById('subcat2Edit').value = "";
            document.getElementById('EditSubCat2').classList.add("invisible");

            //Ocultar informacion
            document.getElementById('catAdd').classList.add("invisible");
            document.getElementById('contSubCat').classList.add("invisible");
            document.getElementById('subCatAdd1').classList.add("invisible");
            document.getElementById('servicio').classList.add("invisible");
            document.getElementById('contSubCat2').classList.add("invisible");
            document.getElementById('subCatAdd2').classList.add("invisible");

        }
    });

    let element = document.getElementById('select3');

    if (element) {
        await firebase.database().ref("categorias/").once("value", (data) => {
            var index = 0;
            for (const categoria in data.val()) {
                index++;
                for (const subcategoria in data.val()[categoria]) {
                    if (subcategoria !== 'nombre' && subcategoria !== 'url' && subcategoria !== 'show') {
                        if (data.val()[categoria][subcategoria].hasOwnProperty("grupo")) {
                            var grupos = [];
                            for (const subcategoria2 in data.val()[categoria][subcategoria]["grupo"]) {
                                if (data.val()[categoria][subcategoria]['grupo'][subcategoria2].hasOwnProperty("grupo")) {
                                    var subGrupos = [];
                                    for (const subcategoria3 in data.val()[categoria][subcategoria]["grupo"][subcategoria2]['grupo']) {
                                        subGrupos.push({
                                            ...data.val()[categoria][subcategoria]['grupo'][subcategoria2]['grupo'][subcategoria3],
                                            valor: subcategoria3
                                        });
                                    }

                                    grupos.push({
                                        ...subGrupos,
                                        nombre: subcategoria2
                                    });

                                } else {
                                    grupos.push({
                                        ...data.val()[categoria][subcategoria]['grupo'][subcategoria2],
                                        valor: subcategoria2
                                    });
                                }

                            }
                            if (categorias[index] === undefined) {
                                categorias[index] = new Array({
                                    nombre: subcategoria,
                                    grupo: grupos
                                });
                                categorias[index]['categoria'] = categoria;

                            } else {
                                categorias[index].push({
                                    nombre: subcategoria,
                                    grupo: grupos
                                });

                            }
                        } else {
                            if (categorias[index] === undefined) {
                                categorias[index] = new Array({
                                    ...data.val()[categoria][subcategoria],
                                    valor: subcategoria
                                });
                                categorias[index]['categoria'] = categoria;
                                if (categoria == 'emergencia') {

                                    categorias[index].push({
                                        nombre: "Panico",
                                        valor: 'panico'
                                    });
                                }


                            } else {
                                categorias[index].push({
                                    ...data.val()[categoria][subcategoria],
                                    valor: subcategoria
                                });

                            }
                        }
                    } else {
                        if (subcategoria == 'nombre') {
                            categorias[index]['nombre'] = data.val()[categoria][subcategoria];
                        }

                    }

                }
            }
        });

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
        });
    } 



    var select2 = document.getElementById("select2");

    addCatSelect();

    addSelect(1, select2);

    var select = document.querySelectorAll('select');
    var selectInst = M.FormSelect.init(select);

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
            weekdaysShort: [
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

function registrar() {
    //   var inputs = document.getElementsByTagName("input");
    //   console.log(inputs);
    //   var data = [];
    //   for (var index = 0; index < inputs.length; index++) {
    //           data.push(inputs[index].value);

    //   }
    //   console.log(data);

    var fecha = Date.now();


    var body = {
        nombre: document.getElementById("nombrePro").value,
        correo: document.getElementById("correo").value,
        password: document.getElementById("pass1").value,
        contacto: document.getElementById("telefono").value,
        telNegocio: document.getElementById("telNeg").value,
        domicilio: document.getElementById("domicilio").value,
        cp: document.getElementById("cp").value,
        fechaInicio: document.getElementById("fechaIni").value,
        fechaFin: document.getElementById("fechaFin").value,
        subCategoria: document.getElementById("select2").value,
        fechaRegistro: fecha,
        requisicionesAceptadas: 0,
        ciudad: document.getElementById("select3").value

    };

    body.fechaFin = convFecha(body.fechaFin);
    body.fechaInicio = convFecha(body.fechaInicio);

    if (tipo == 2) {
        body['urlFacebook'] = document.getElementById('Facebook').value;
        firebase.auth().createUserWithEmailAndPassword(body.correo, body.password).then((user) => {
            firebase.database().ref("proveedores/" + user.user.uid).set(body);
            var imagen = document.getElementById("imgLogo");
            imagen = imagen.getAttribute("src");
            firebase.storage().ref("proveedores/" + user.user.uid).putString(imagen, 'data_url', {
                contentType: 'image/jpg'
            }).then(function (valor) {
                valor.ref.getDownloadURL().then(function (downloadURL) {
                    firebase.database().ref("proveedores/" + user.user.uid).update({
                        url: downloadURL
                    });
                    Swal.fire(
                        'Muy bien',
                        'Proveedor agregado',
                        'success'
                    );
                }).catch((error) => {
                    console.log(error);
                });
            });
        });
    } else {
        firebase.auth().createUserWithEmailAndPassword(body.correo, body.password).then((user) => {
            firebase.database().ref("proveedores/" + user.user.uid).set(body);
            Swal.fire(
                'Muy bien',
                'Proveedor agregado',
                'success'
            );
        }).catch((error) => {
            console.log(error);
        });
    }



}

function convFecha(fecha) {
    var arrFecha = fecha.split(" ");
    arrFecha[1] = arrFecha[1].replace(",", "");
    return arrFecha[0] + " " + arrFecha[1] + " " + arrFecha[2];

}



function select() {
    var selVal = document.getElementById("select").value;
    var select2 = document.getElementById("select2");

    while (select2.firstChild) {
        select2.removeChild(select2.firstChild);
    }

    addSelect(selVal, select2);

    var select = document.querySelectorAll('select');
    var selectInst = M.FormSelect.init(select);

}

function subCatSelect() {
    var selVal = document.getElementById("select2");
    tipo = selVal.options[selVal.selectedIndex].getAttribute('tipo');
    var imgCont = document.getElementsByClassName("imgLogoCont");
    if (tipo == 2) {
        imgCont[0].classList.remove("invisible");
    } else {
        imgCont[0].classList.add("invisible");

    }

}

function addCatSelect() {
    var node;
    var element = document.getElementById("select");
    for (const key in categorias) {
        node = document.createElement("OPTION");
        node.innerHTML = categorias[key]['categoria'];
        node.setAttribute("value", key);
        element.add(node);

    }
}

function addSelect(id, element) {
    var node, nodechild;
    for (const key in categorias[id]) {
        if (key !== "categoria" && key !== 'nombre') {
            if (categorias[id][key].hasOwnProperty("grupo")) {
                node = document.createElement("OPTGROUP");
                node.setAttribute("label", categorias[id][key]['nombre']);
                for (var index = 0; index < categorias[id][key]['grupo'].length; index++) {
                    if (categorias[id][key]['grupo'][index].hasOwnProperty("grupo")) {
                        node = document.createElement("OPTGROUP");
                        node.setAttribute("label", categorias[id][key]['grupo'][index]['nombre']);
                        for (var indice = 0; indice < categorias[id][key]['grupo'][index]['grupo'].length; indice++) {
                            nodechild = document.createElement("OPTION");
                            nodechild.innerHTML = categorias[id][key]['grupo'][index]['grupo'][indice]["nombre"];
                            nodechild.setAttribute("value", categorias[id][key]['grupo'][index]['grupo'][indice]["valor"]);
                            nodechild.setAttribute("tipo", categorias[id][key]['grupo'][index]['grupo'][indice]['tipo']);

                            node.appendChild(nodechild);
                        }
                    } else {

                        nodechild = document.createElement("OPTION");
                        nodechild.innerHTML = categorias[id][key]['grupo'][index]["nombre"];
                        nodechild.setAttribute("value", categorias[id][key]['grupo'][index]["valor"]);
                        nodechild.setAttribute("tipo", categorias[id][key]['grupo'][index]['tipo']);
                        node.appendChild(nodechild);
                    }
                    element.add(node);
                }
            } else {
                node = document.createElement("OPTION");
                node.innerHTML = categorias[id][key]['nombre'];
                node.setAttribute("value", categorias[id][key]['valor']);
                node.setAttribute("tipo", categorias[id][key]['tipo']);
                element.add(node);
            }
        }
    }
}

function fotoLogo(logo) {
    var foto = document.getElementById("logo");
    console.log(foto.files);
    if (foto.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.getElementById("imgLogo");
            img.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(foto.files[0]);
    }
}