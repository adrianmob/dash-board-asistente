
var objetoCat;
var cat;
var subCat;
var subCat2;

async function cargaData(){
    cat = undefined;
    subCat = undefined;
    subCat2 = undefined;
    await firebase.database().ref("categorias/").once("value",(data)=>{
        objetoCat = data.val();
        var node;
        var element = document.getElementById("categoria"); 
        console.log(element);       
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

function numeros(){
    var reparto = document.getElementById("reparto");
    var tercero = document.getElementById("tercero");

    var body = {
        reparto : reparto.value,
        tercero: tercero.value
    };

    firebase.database().ref("telefonos/").set(body);   


}

function addCat(id){
    console.log(id);
    var element = document.getElementById(id);
    element.classList.remove("invisible");
    element.classList.add("visible");
}

function showSubCat(id){
    var valorCat = document.getElementById("categoria").value;
    if(id == 1){
        var elementSubCat = document.getElementById("subcat1");
    
        while (elementSubCat.firstChild) {
            elementSubCat.removeChild(elementSubCat.firstChild);
        }
    
        var node;
    
    
        for (const key in objetoCat[valorCat]) {
            if(key !== 'nombre'){
                node = document.createElement("OPTION");
                node.innerHTML = objetoCat[valorCat][key]['nombre'];
                node.setAttribute("value",key);
                elementSubCat.add(node);
            }
        }
    
        var contSubCat = document.getElementById("contSubCat");
    
        contSubCat.classList.remove("invisible");
    
        contSubCat.classList.remove("visible");

    }

    else{
        var valorSubCat = document.getElementById("subcat1").value;
        var elementSubCat = document.getElementById("subcat2");
    
        while (elementSubCat.firstChild) {
            elementSubCat.removeChild(elementSubCat.firstChild);
        }
    
        var node;
    
    
        for (const key in objetoCat[valorCat][valorSubCat]) {
            
            if(key !== 'nombre'){
                if(key === "grupo"){
                    var objSubcat = objetoCat[valorCat][valorSubCat][key];
                    for (const key in objSubcat) {
                        node = document.createElement("OPTION");
                        node.innerHTML = objSubcat[key]['nombre'];
                        node.setAttribute("value",key);
                        elementSubCat.add(node);
                    }
                }
            }
        }
    
        var contSubCat = document.getElementById("contSubCat2");
    
        contSubCat.classList.remove("invisible");
    
        contSubCat.classList.remove("visible");

    }


    var select = document.querySelectorAll('select');
    var selectInst = M.FormSelect.init(select);

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

function guardarCat(id){
    switch (id) {
        case 1:
            console.log(objetoCat);
            var url = document.getElementById('imgCat').getAttribute("src");
            if(url == "assets/imgs/no-image.png") url = "";
            var categoria = {
                nombre: document.getElementById('nombre').value,
                imagen: url
            };

            if(validarCampos(categoria)){
                cat = {
                    nombre: categoria.nombre,
                    nombreCorto: nameShort(categoria.nombre),
                    imagen: url
                };
                M.toast({
                    html: 'Se agrego la categoria, para poder guardar es necesario agregar una subcategoria',
                    classes: 'rounded'
                });
                addCat('subCatAdd1');
                firebase.database().ref("categorias/"+nombre).set({
                    nombre: categoria.nombre,
                    url: categoria.imagen
                }); 
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
            };

            var swich = document.getElementById('switCheck').checked;

            if(swich){
                subcategoria['tipo'] = document.getElementById('selectServicio').value;
                if(validarCampos(subcategoria)){
                    if(cat){
                        var subCatObj = {
                            nombre: cat.nombre,
                            url: cat.imagen
                        };
                        subCatObj[nameShort(subcategoria.nombre)] = {
                            nombre: subcategoria.nombre,
                            tipo: subcategoria.tipo
                        };

                        firebase.database().ref("categorias/"+cat.nombre).set(subCatObj); 
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

                         firebase.database().ref("categorias/"+nomCategoria).set(categoria); 
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
            subCat2 = {
                nombre: document.getElementById('subcategoria2').value,
                tipo: document.getElementById('selectServicio2').value,
            };
        
            if(validarCampos(subCat2)){
                if(cat && subCat){

                    var categoriaFinal = {
                        nombre: cat.nombre,
                        url: cat.imagen
                    };
     
                    categoriaFinal[subCat.nombreCorto] = {
                        nombre: subCat.nombre,
                    };
     
                    categoriaFinal[subCat.nombreCorto]['grupo'] = new Object();
     
                    categoriaFinal[subCat.nombreCorto]['grupo'][nameShort(subCat2.nombre)] = {
                     nombre: subCat2.nombre,
                     tipo: subCat2.tipo
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
                        tipo: document.getElementById('selectServicio2').value
                    };

                    var nomCategoria = document.getElementById("categoria").value;

                    if(subCat){
                        var categoriaFinal = {};
                        categoriaFinal[subCat['nombreCorto']] = {
                            nombre: subCat['nombre']
                        }
                        categoriaFinal[subCat['nombreCorto']]['grupo'] = {};
                        categoriaFinal[subCat['nombreCorto']]['grupo'] = subCat2;

                        firebase.database().ref("categorias/"+nomCategoria).set(categoriaFinal); 
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
                        firebase.database().ref("categorias/"+nomCategoria+"/"+nomSubategoria+"/grupo/").set(subCat2); 
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

function foto(logo){
    var foto = document.getElementById("InputImgCat");
    console.log(foto.files);
    if(foto.files.length > 0){
        var reader = new FileReader();
        reader.onload = function (e){
            var img = document.getElementById("imgCat");
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
