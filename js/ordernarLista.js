document.addEventListener('DOMContentLoaded', async function() {

        var element = document.getElementById("categoriaOrdenar"); 
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
            showCats();
        });
});

function showCats(){

    var Cat = document.getElementById('categoriaOrdenar').value;
    var elemento = ( Cat == 'all') ? '' : document.getElementById('categoriaOrdenar').value;

    firebase.database().ref("categorias/"+elemento).once("value",(data)=>{
        let categorias = [];
        let tipo = 0;
        for (const key in data.val()) {
            if(key !== 'nombre' && key !== 'show' && key !== 'url' && key !== 'posicion'){
                if(Cat == 'compraRenta'){
                    if(!data.val()[key].hasOwnProperty('url')){
                        tipo = 1;
                        categorias['renta'] = [];
                        categorias['compra'] = [];
                        var objetoRenta = data.val()[key]['grupo'];
                        for (const key in objetoRenta) {
                            var objetoCat = objetoRenta[key];
                            guardarCategoria(categorias['renta'],objetoCat, key);
                        }
                    }
                    else{
                        var objetoCat = data.val()[key];
                        guardarCategoria(categorias['compra'],objetoCat, key)                    
                    }
                }
                else if(Cat == 'hogarservicio'){
                    if(!data.val()[key].hasOwnProperty('url')){
                        tipo = 2;
                        categorias['servicio'] = [];
                        categorias['hogar'] = [];
                        var objetoRenta = data.val()[key]['grupo'];
                        for (const key in objetoRenta) {
                            var objetoCat = objetoRenta[key];
                            guardarCategoria(categorias['servicio'],objetoCat, key);
                        }
                    }
                    else{
                        var objetoCat = data.val()[key];
                        guardarCategoria(categorias['hogar'],objetoCat, key)                    
                    }
                }
                    else{
                        var objetoCat = data.val()[key];
                        console.log(objetoCat);
                        guardarCategoria(categorias,objetoCat, key)
                    }
            }
        }

        switch (tipo) {
            case 0:
                OrdenarArraySingle(categorias,elemento);
                break;
            case 1:
                OrdenarArrayMulti(categorias,'renta','compra');
                break;
            case 2:
                OrdenarArrayMulti(categorias,'servicio','hogar');
                break;
        }

    });

}

function cambiarOrden(){

    var subCat = document.getElementById("imagenesCat");
    var Cat = document.getElementById('categoriaOrdenar').value;
    var contador = 1;
    for (let index = 0; index < subCat.childNodes.length; index++) {
       var key = subCat.childNodes[index].getAttribute('data-key');
       if ( Cat == 'all' )
       {
        firebase.database().ref("categorias/"+key).update({
            posicion: contador
         });
       }
       else{
        firebase.database().ref("categorias/"+Cat+'/'+key).update({
            posicion: contador
         });
       }
  
        contador++; 
        
    }
    Swal.fire({
        type: 'success',
        title: 'Muy bien',
        text: 'Orden cambiado',
        showConfirmButton: false,
        timer: 1500
      });
     
}

function cambiarOrdenMulti(){
    var subCat1 = document.getElementById("imagenesCat1");
    var subCat2 = document.getElementById("imagenesCat2");
    var Cat = document.getElementById('categoriaOrdenar').value;
    var grupo = '';
    if(Cat == 'compraRenta'){
        grupo = 'RENTA';
    }
    else{
        grupo = 'Servicio';
    }
    var contador = 1;
    for (let index = 0; index < subCat1.childNodes.length; index++) {
       var key = subCat1.childNodes[index].getAttribute('data-key');
       firebase.database().ref("categorias/"+Cat+'/'+grupo+'/grupo/'+key).update({
           posicion: contador
        });
        contador++;
        
    }
    var contador = 1;
    for (let index = 0; index < subCat2.childNodes.length; index++) {
       var key = subCat2.childNodes[index].getAttribute('data-key');
       firebase.database().ref("categorias/"+Cat+'/'+key).update({
           posicion: contador
        });
        contador++;
        
    }
    Swal.fire({
        type: 'success',
        title: 'Muy bien',
        text: 'Orden cambiado',
        showConfirmButton: false,
        timer: 1500
      });
     
}

function guardarCategoria(arrar, objCat, key){
    if(objCat['posicion'] == undefined)
    {
        arrar.push({key: key, url: objCat['url'], posicion: 0 });
    }
    else
    {
        arrar.push({key: key, url: objCat['url'], posicion: objCat['posicion'] });
    }
}

function OrdenarArraySingle(array, elemento)
{

    console.log(elemento);

    var imagenes = document.getElementById('imagenesCat');
    while (imagenes.firstChild) {
        imagenes.removeChild(imagenes.firstChild);
    }   

    document.getElementById('singleCat').classList.remove('invisible');
    document.getElementById('multCat').classList.add('invisible')
    
    categoriasOrdenada = array.sort((a, b) => {
        return a['posicion'] - b['posicion'];
    } );

    categoriasOrdenada.map((data)=>{
        var itemLista = document.createElement("li");
        itemLista.classList.add("collection-item");
        itemLista.classList.add("input-cat-ord");
        itemLista.setAttribute("data-key",data['key']);
    
        var itemImg = document.createElement("img");
        if(elemento != '')
            itemImg.classList.add("img-cat-ord");
        else            
            itemImg.classList.add("img-catPri-ord");

        itemImg.setAttribute("src",data['url']);
    
        itemLista.appendChild(itemImg);
        imagenes.appendChild(itemLista);
    });

    if(!Sortable.get(imagenes))
    {

        new Sortable(imagenes, {
            animation: 150,
            ghostClass: 'blue-background-class'
        });
    }

}

function OrdenarArrayMulti(array,cat1,cat2){

    document.getElementById('tab1').innerHTML = cat1;
    document.getElementById('tab2').innerHTML = cat2;

    var imagenes1 = document.getElementById('imagenesCat1');
    var imagenes2 = document.getElementById('imagenesCat2');

    while (imagenes1.firstChild) {
        imagenes1.removeChild(imagenes1.firstChild);
    } 
    while (imagenes2.firstChild) {
        imagenes2.removeChild(imagenes2.firstChild);
    } 

    document.getElementById('singleCat').classList.add('invisible');

    document.getElementById('multCat').classList.remove('invisible')
    
    categoriasOrdenadaCat1 = array[cat1].sort((a, b) => {
        return a['posicion'] - b['posicion'];
    } );

    categoriasOrdenadaCat2 = array[cat2].sort((a, b) => {
        return a['posicion'] - b['posicion'];
    } );

    categoriasOrdenadaCat1.map((data)=>{
        var itemLista = document.createElement("li");
        itemLista.classList.add("collection-item");
        itemLista.setAttribute("data-key",data['key']);
    
        var itemImg = document.createElement("img");
        itemImg.classList.add("img-cat-ord");
        itemImg.setAttribute("src",data['url']);
    
        itemLista.appendChild(itemImg);
        imagenes1.appendChild(itemLista);
    });

    if(!Sortable.get(imagenes1)){
        
            new Sortable(imagenes1, {
                animation: 150,
                ghostClass: 'blue-background-class'
            });

    }

    categoriasOrdenadaCat2.map((data)=>{
        var itemLista = document.createElement("li");
        itemLista.classList.add("collection-item");
        itemLista.setAttribute("data-key",data['key']);
    
        var itemImg = document.createElement("img");
        itemImg.classList.add("img-cat-ord");
        itemImg.setAttribute("src",data['url']);
    
        itemLista.appendChild(itemImg);
        imagenes2.appendChild(itemLista);
    });

    if(!Sortable.get(imagenes2)){

        new Sortable(imagenes2, {
            animation: 150,
            ghostClass: 'blue-background-class'
        });

    }



}

