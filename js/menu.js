document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var elemCollap = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elemCollap);

    var elemTabs = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elemTabs);

    let user = JSON.parse(localStorage.getItem('user_asistente'));

    if( user['tipo'] == 'general'){
        let menu = document.querySelectorAll('#slide-out > li');
        menu[1].remove();
        menu[2].remove();
        menu[3].remove();
        menu[4].remove();
        menu[6].remove();
        menu[7].remove();
        menu[8].remove();
        menu[9].remove();
        menu[10].remove();
        menu[12].remove();

    }


});

var objetoCat;
var cat;
var subCat;
var subCat2;

async function cargaData(modal){
    cat = undefined;
    subCat = undefined;
    subCat2 = undefined;
    if(modal == 1){
        var element = document.getElementById("categoria"); 
    }
    else{
        var element = document.getElementById("categoriaEdit"); 
    }

    await firebase.database().ref("categorias/").once("value",(data)=>{
        objetoCat = data.val();
        var node;
        console.log(element);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }       
        for (const key in objetoCat) {
            node = document.createElement("OPTION");
            node.innerHTML = objetoCat[key]['nombre'];
            node.setAttribute("value",key);
            element.add(node);
                
        }
        var select = document.querySelectorAll('select');
        var selectInst = M.FormSelect.init(select);
    });

}

function ocultar_bloques()
{
    var element = document.getElementById("categoriaOcultar"); 
    firebase.database().ref("categorias/").once("value",(data)=>{
        objetoCat = data.val();
        var node;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }       
        for (const key in objetoCat) {
            node = document.createElement("OPTION");
            node.innerHTML = objetoCat[key]['nombre'];
            node.setAttribute("value",key);
            element.add(node);
                
        }

        node = document.createElement("OPTION");
        node.innerHTML = 'Principal';
        node.setAttribute("value",'all');
        element.add(node);

        var select = document.querySelectorAll('select');
        var selectInst = M.FormSelect.init(select);

        showBloque();
    });

}

function guardarRepartidor(){
    var correo = document.getElementById('correoRepartidor').value;
    var pass = document.getElementById('passwordRepartidor').value;

    console.log(correo);
    console.log(pass);

    if(correo === "" || pass === ""){

        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Llene todos los campos',
          });
    }
    else{
        firebase.database().ref("proveedores/repartidor").set({
            correo: correo,
            password: pass,
            requisicionesAceptadas: 0
        });
        
        Swal.fire({
            type: 'success',
            title: 'Muy bien',
            text: 'Repartidor agregado',
            onClose: () => {
                var eleModal = document.querySelectorAll('.modal');
                var instance = M.Modal.getInstance(eleModal[1]);
                console.log(instance);
                instance.close();
              }
        });  

    }

}

function guardarProveedor(){
    var correo = document.getElementById('correoProveedorTer').value;
    var pass = document.getElementById('passwordProveedorTer').value;

    console.log(correo);
    console.log(pass);

    if(correo === "" || pass === ""){

        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Llene todos los campos',
          });
    }
    else{
        firebase.database().ref("proveedores/tercero").set({
            correo: correo,
            password: pass,
            requisicionesAceptadas: 0
        });
        
        Swal.fire({
            type: 'success',
            title: 'Muy bien',
            text: 'Proveedor tercero agregado',
            onClose: () => {
                var eleModal = document.querySelectorAll('.modal');
                var instance = M.Modal.getInstance(eleModal[1]);
                console.log(instance);
                instance.close();
              }
        });  

    }

}

function addCat(id){
    console.log(id);
    var element = document.getElementById(id);
    element.classList.remove("invisible");
    element.classList.add("visible");
}

function showSubCat(id,modal){
    if(modal == 1)
    {
        var valorCat = document.getElementById("categoria").value;
        var elementSubCat = document.getElementById("subcat1");
        var valorSubCat = document.getElementById("subcat1").value;
        var elementSubCat2 = document.getElementById("subcat2");
        var contSubCat = document.getElementById("contSubCat2");

    }
    else
    {
        var valorCat = document.getElementById("categoriaEdit").value;
        var elementSubCat = document.getElementById("subCatEdit");
        var valorSubCat = document.getElementById("subCatEdit").value;
        var elementSubCat2 = document.getElementById("subcat2Edit");
        var contSubCat = document.getElementById("EditSubCat2");

    }
    if(id == 1){
   
        while (elementSubCat.firstChild) {
            elementSubCat.removeChild(elementSubCat.firstChild);
        }
    
        var node;
    
        for (const key in objetoCat[valorCat]) {
            if(key !== 'nombre' && key !== 'url' && key !== 'show' && key !== 'posicion'){
                node = document.createElement("OPTION");
                node.innerHTML = objetoCat[valorCat][key]['nombre'];
                node.setAttribute("value",key);
                elementSubCat.add(node);
            }
        }

        if(modal == 1)
        {
            
            var contSubCat = document.getElementById("contSubCat");                   
            contSubCat.classList.remove("invisible");    
            contSubCat.classList.remove("visible");

        }

    }

    else{
    
        while (elementSubCat2.firstChild) {
            elementSubCat2.removeChild(elementSubCat2.firstChild);
        }
    
        var node;
    
    
        for (const key in objetoCat[valorCat][valorSubCat]) {
            
            if(key !== 'nombre' && key !== 'show' && key !== 'posicion'){
                if(key === "grupo"){
                    var objSubcat = objetoCat[valorCat][valorSubCat][key];
                    for (const key in objSubcat) {
                        node = document.createElement("OPTION");
                        node.innerHTML = objSubcat[key]['nombre'];
                        node.setAttribute("value",key);
                        elementSubCat2.add(node);
                    }
                }
            }
        }

    
        contSubCat.classList.remove("invisible");
    
        contSubCat.classList.remove("visible");

    }


    var select = document.querySelectorAll('select');
    var selectInst = M.FormSelect.init(select);

}

function showBloque(){
    var elemento = document.getElementById('categoriaOcultar').value;
    var bloque = document.getElementById('bloque');
    var node, objeto;

    console.log(objetoCat);

    while (bloque.firstChild) {
        bloque.removeChild(bloque.firstChild);
    }



    if ( elemento == 'all')
        objeto = objetoCat;

    else
        objeto = objetoCat[elemento];

    for (const key in objeto ) 
    {
        if( key != 'nombre' && key != 'posicion' && key != 'show' && key != 'url' )
        {

            if( key == 'RENTA' || key == 'Servicio')
            {
                for (const key_grupo in objeto[key]['grupo']) 
                {
                    node = document.createElement("OPTION");
                    node.innerHTML = objeto[key]['grupo'][key_grupo]['nombre'];
                    node.setAttribute("value",elemento+'/'+key+'/grupo/'+key_grupo);
                    bloque.add(node);
                }
            }
            else
            {
                node = document.createElement("OPTION");
                node.innerHTML = objeto[key]['nombre'];
                if(elemento == 'all')
                    node.setAttribute("value",key);
                else
                    node.setAttribute("value",elemento+'/'+key);
                bloque.add(node);
            }
         
        }
    }

    // if( objetoCat[elemento].hasOwnProperty('show')){
    //     selectOculat.value = 2;
    // }
    // else{
    //     selectOculat.value = 1;
    // }

    var select = document.querySelectorAll('select');
    var selectInst = M.FormSelect.init(select);

}

function guardarBloqueOculto(){
    var selectCat = document.getElementById('bloque').value;
    var selectOcultar = document.getElementById('ocultar').value;
    console.log(selectCat);
    var estado;
    if(selectOcultar == 1){
        estado = false;
    }
    else{
        estado = true;
    }

    firebase.database().ref("categorias/"+selectCat).update({
        show: estado
    });
    Swal.fire({
        type: 'success',
        title: 'Muy bien',
        text: 'Bloque cambiado',
        onClose: () => {
            var eleModal = document.querySelectorAll('.modal');
            var instance = M.Modal.getInstance(eleModal[2]);
            instance.close();
          }
    }); 

}

function switchServicio(el){
    var elemento = document.getElementById("servicio");
    if(el.checked){
        elemento.classList.remove("invisible");
        elemento.classList.add("visible");
    }
    else{
        elemento.classList.remove("visible");
        elemento.classList.add("invisible");
    }
}

function cerrar(id){

    var elemento = document.getElementById(id);
    elemento.classList.remove("visible");
    elemento.classList.add("invisible");
}

function updateCat()
{
    var cat = document.getElementById('categoriaEdit').value;
    var subCat = document.getElementById('subCatEdit').value;
    var subCat2 = document.getElementById('subcat2Edit').value;
    var servicio = document.getElementById('selectServicioEdit').value;

    if( subCat !== '' && servicio !== ''){
        let referencia = "categorias/"+cat+"/"+subCat;
        if(subCat2 !== '')
            referencia += "/grupo/"+subCat2;

        firebase.database().ref(referencia).update({
            tipo: servicio
        });
        Swal.fire({
            type: 'success',
            title: 'Muy bien',
            text: 'Bloque cambiado',
            onClose: () => {
                var eleModal = document.querySelectorAll('.modal');
                var instance = M.Modal.getInstance(eleModal[3]);
                instance.close();
              }
        }); 

    }
    else
    {
        Swal.fire(
            'Por favor',
            'Llene todos los campos',
            'warning'
        );  
    }



}

function eliminarCat()
{
    Swal.fire({
        title: '¿Estas seguro?',
        text: "Se eliminara todo el bloque!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminalo!'
      }).then((result) => {
          if (result.value) {
            var cat = document.getElementById('categoriaEdit').value;
            var subCat = document.getElementById('subCatEdit').value;
            var subCat2 = document.getElementById('subcat2Edit').value;

            let referencia = "categorias/"+cat;
            if(subCat !== '')
            referencia += "/"+subCat;

            if(subCat2 !== '')
                referencia += "/grupo/"+subCat2;
          
            firebase.database().ref(referencia).remove();

            Swal.fire({
                type: 'success',
                title: 'Eliminado',
                text: 'El bloque ha sido eliminado.',
                onClose: () => {
                    var eleModal = document.querySelectorAll('.modal');
                    var instance = M.Modal.getInstance(eleModal[3]);
                    instance.close();
                  }
            });
        }
      });
}

function guardarCat(id){
    switch (id) {
        case 1:
            console.log(objetoCat);
            var url = document.getElementById('imgCat').getAttribute("src");
            if(url == "assets/imgs/no-image.png") url = "";
            var categoria = {
                nombre: document.getElementById('nombre').value,
                imagen: url,
                show: true,
                posicion: 0
            };

            if(validarCampos(categoria)){
                
                cat = {
                    nombre: categoria.nombre,
                    nombreCorto: nameShort(categoria.nombre),
                    imagen: url,
                    show: true,
                    posicion: 0
                };
                M.toast({
                    html: 'Se agrego la categoria, para poder guardar es necesario agregar una subcategoria',
                    classes: 'rounded'
                });
                addCat('subCatAdd1');
            }
            else{
                Swal.fire(
                    'Por favor',
                    'Llene todos los campos',
                    'warning'
                );
            }
            
            break;
        case 2:
        
            var subcategoria = {
                nombre: document.getElementById('subcategoria').value,
                show: true,
                posicion: 0
            };

            var swich = document.getElementById('switCheck').checked;

            var url = document.getElementById('imgSubCat').getAttribute("src");
            if(url == "assets/imgs/no-image.png") url = "";

            subcategoria['url'] = url;

            if(swich){
                subcategoria['tipo'] = document.getElementById('selectServicio').value;
                if(validarCampos(subcategoria)){
                    if(cat){
                        var subCatObj = {
                            nombre: cat.nombre,
                            url: cat.imagen,
                            show: true,
                            posicion: 0
                        };
                        subCatObj[nameShort(subcategoria.nombre)] = {
                            nombre: subcategoria.nombre,
                            tipo: subcategoria.tipo,
                            url: subcategoria.url,
                            show: true,
                            posicion: 0
                        };

                        firebase.database().ref("categorias/"+cat.nombreCorto).set(subCatObj); 
                        Swal.fire({
                            type: 'success',
                            title: 'Muy bien',
                            text: 'Categoria agregada',
                            onClose: () => {
                                var eleModal = document.querySelectorAll('.modal');
                                var instance = M.Modal.getInstance(eleModal[0]);
                                console.log(instance);
                                instance.close();

                              }
                        });    
                    }
                    else{
                        var nomCategoria = document.getElementById("categoria").value;
                        var categoria = {};
                        
                        categoria[nameShort(subcategoria.nombre)] = subcategoria;

                         firebase.database().ref("categorias/"+nomCategoria).update(categoria); 
                         Swal.fire({
                            type: 'success',
                            title: 'Muy bien',
                            text: 'Categoria agregada',
                            onClose: () => {
                                var eleModal = document.querySelectorAll('.modal');
                                var instance = M.Modal.getInstance(eleModal[0]);
                                console.log(instance);
                                instance.close();

                              }
                        });  
                    }
                }
                else{
                    Swal.fire(
                        'Por favor',
                        'Llene todos los campos',
                        'warning'
                    );
                }
            }
            else{
                if(validarCampos(subcategoria)){
                    M.toast({
                        html: 'Se agrego la categoria, para poder guardar es necesario agregar una subcategoria',
                        classes: 'rounded'
                    });
                    subCat = {
                        nombre: subcategoria.nombre,
                        nombreCorto: nameShort(subcategoria.nombre),
                        imagen: subcategoria.url,
                        show: true,
                        posicion: 0
                    };
                    console.log(subCat);
                    addCat('subCatAdd2');
                }
                else{
                    Swal.fire(
                        'Por favor',
                        'Llene todos los campos',
                        'warning'
                    );
                }
            }

            break;
        
        case 3:
            var url = document.getElementById('imgSubCat2').getAttribute("src");
            if(url == "assets/imgs/no-image.png") url = "";
            subCat2 = {
                nombre: document.getElementById('subcategoria2').value,
                tipo: document.getElementById('selectServicio2').value,
                imagen: url,
                show: true,
                posicion: 0
            };
        
            if(validarCampos(subCat2)){
                if(cat && subCat){

                    var categoriaFinal = {
                        nombre: cat.nombre,
                        url: cat.imagen,
                        show: true,
                        posicion: 0
                    };
     
                    categoriaFinal[subCat.nombreCorto] = {
                        nombre: subCat.nombre,
                        url: subCat.imagen,
                        show: true,
                        posicion: 0
                    };
     
                    categoriaFinal[subCat.nombreCorto]['grupo'] = new Object();
     
                    categoriaFinal[subCat.nombreCorto]['grupo'][nameShort(subCat2.nombre)] = {
                     nombre: subCat2.nombre,
                     tipo: subCat2.tipo,
                     url: subCat2.imagen,
                     show: true,
                     posicion: 0
                    }
                    
                
                    firebase.database().ref("categorias/"+cat.nombreCorto).set(categoriaFinal); 
                    Swal.fire({
                        type: 'success',
                        title: 'Muy bien',
                        text: 'Categoria agregada',
                        onClose: () => {
                            var eleModal = document.querySelectorAll('.modal');
                            var instance = M.Modal.getInstance(eleModal[0]);
                            console.log(instance);
                            instance.close();

                          }
                    }); 
                }
                else{
                    subCat2 = {}
                    subCat2[nameShort(document.getElementById('subcategoria2').value)] ={
                        nombre : document.getElementById('subcategoria2').value,
                        tipo: document.getElementById('selectServicio2').value,
                        url: url,
                        show: true,
                        posicion: 0
                    };

                    var nomCategoria = document.getElementById("categoria").value;

                    if(subCat){
                        var categoriaFinal = {};
                        categoriaFinal[subCat['nombreCorto']] = {
                            nombre: subCat['nombre'],
                            url: subCat['imagen'],
                            show: true,
                            posicion: 0

                        }
                        categoriaFinal[subCat['nombreCorto']]['grupo'] = {};
                        categoriaFinal[subCat['nombreCorto']]['grupo'] = subCat2;

                        firebase.database().ref("categorias/"+nomCategoria).update(categoriaFinal); 
                         Swal.fire({
                            type: 'success',
                            title: 'Muy bien',
                            text: 'Categoria agregada',
                            onClose: () => {
                                var eleModal = document.querySelectorAll('.modal');
                                var instance = M.Modal.getInstance(eleModal[0]);
                                console.log(instance);
                                instance.close();

                              }
                        });  
                    }
                    else{
                        var nomSubategoria = document.getElementById("subcat1").value;
                        firebase.database().ref("categorias/"+nomCategoria+"/"+nomSubategoria+"/tipo").remove(); 
                        firebase.database().ref("categorias/"+nomCategoria+"/"+nomSubategoria+"/grupo/").update(subCat2); 
                        Swal.fire({
                            type: 'success',
                            title: 'Muy bien',
                            text: 'Categoria agregada',
                            onClose: () => {
                                var eleModal = document.querySelectorAll('.modal');
                                var instance = M.Modal.getInstance(eleModal[0]);
                                console.log(instance);
                                instance.close();

                              }
                        }); 
                    }

                } 

            }
            else{
                Swal.fire(
                    'Por favor',
                    'Llene todos los campos',
                    'warning'
                );
            }

            break;

        default:
            break;
    }
}

function validarCampos(objeto){
    var completo = true;
    for (const key in objeto) {
        if( objeto[key] === "" || objeto[key] === undefined){
            completo = false;
            break;
        }
    }

    return completo;

}

function foto(id){
    switch (id) {
        case 1:
        
            var foto = document.getElementById("InputImgCat");
            var img = document.getElementById("imgCat");

            break;

        case 2:

            var foto = document.getElementById("InputImgSubCat");
            var img = document.getElementById("imgSubCat");
        
            break;


        case 3:

            var foto = document.getElementById("InputImgSubCat2");
            var img = document.getElementById("imgSubCat2");
    
            break;
        
    }

    if(foto.files.length > 0){
        var reader = new FileReader();
        reader.onload = function (e){
            img.setAttribute("src",e.target.result);
        };
        reader.readAsDataURL(foto.files[0]);
    }
}

function nameShort(nombre){
    nombre = nombre.toLowerCase();
    var re = /[ |]/gi;
    return nombre.replace(re,"");
}
