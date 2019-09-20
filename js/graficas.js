var tipoGrafica = getParameterByName('grafica');
var proveedoresCali = [];
document.addEventListener('DOMContentLoaded',  async function() {
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    await firebase.database().ref("proveedores/").on("value",(data)=>{
        var reqGen = 0;
        var reqDen = 0;
        var conceptos = [];
        var proveedoresMes = [];
        var proveedores = [];
        var concepto;
        var agregado = false;
        var proveedor = data.val();
        for (const key in proveedor){
            agregado = false;
            reqGen += proveedor[key]['requisicionesAceptadas'];
            if(proveedor[key]['subCategoria'] != key && key!== 'tercero'&& key!== 'repartidor'){
                proveedores.push({
                    fecha: proveedor[key]['fechaRegistro']
                });
                proveedoresCali.push({nombre: proveedor[key]['nombre'],key:key});
                conceptos.map((data)=>{
                    if(data.nombre == proveedor[key]['subCategoria']){
                        data.requisiciones += proveedor[key]['requisicionesAceptadas'];
                        agregado = true;
                    }
                });
                if(!agregado){
                    conceptos.push({
                        nombre: proveedor[key]['subCategoria'],
                        requisiciones: proveedor[key]['requisicionesAceptadas']
                    });
                }
                if(conceptos.length == 0){
                    conceptos.push({
                        nombre: proveedor[key]['subCategoria'],
                        requisiciones: proveedor[key]['requisicionesAceptadas']
                    });   

                }
            }
            else{
                reqDen += proveedor[key]['requisicionesAceptadas'];
            }

        }

        proveedores.map((data)=>{
            var fecha = new Date(data.fecha).getMonth();
            var guardado = false;
            proveedoresMes.map((mes)=>{
                if(mes.mes == meses[fecha]){
                    mes.cantidad += 1;
                    guardado = true;
                }
            });
            if(proveedoresMes.length == 0 || !guardado){
                proveedoresMes.push({
                    mes: meses[fecha],
                    cantidad : 1
                });
            }
        });

        switch (tipoGrafica) {

            case 'requisicion':
                drawGraf(reqGen,reqDen);

                break;

            case 'concepto':
                drawGrafConcept(conceptos);

                break;

            case 'cumplimiento':
                drawGrafCumplimiento(reqGen,reqDen);

                break;

            case 'proveedor':
                drawGrafproveedor(proveedoresMes,"proveedor")

                break;
                
            case 'calificacion':
                drawCalificacion()
                break;
        }
        


    });

        var anuncios = [];

        await firebase.database().ref("anuncios/").on("value",(data)=>{
            var anuncio = data.val();
            for (const key in anuncio){
                var fecha = new Date(anuncio[key]['fechaRegistro']).getMonth();
                var guardado = false;
                anuncios.map((data)=>{
                    if(data.mes == meses[fecha]){
                        data.cantidad += 1;
                        guardado = true;
                    }
                });
                if(anuncios.length == 0 || !guardado){
                    anuncios.push({
                        mes: meses[fecha],
                        cantidad : 1
                });
                }

            }

            console.log(anuncios);

            if(tipoGrafica == 'anuncios'){
                drawGrafproveedor(anuncios,"anuncios")
            }

        });

        
        

});

function drawCalificacion(){
    firebase.database().ref("pedidos-finalizados/").on("value",(data)=>{
        var objPedidos = data.val();
        var allProveedores = [];
        for (const key in objPedidos) {
            var objPedido = objPedidos[key];
            for (const child in objPedido) {
                if(objPedido[child].hasOwnProperty('calificacion')){
                    allProveedores.push({id: key,calificacion: objPedido[child]['calificacion']});
                }
            }
        }

        for (let index = 0; index < allProveedores.length; index++) {
            let contador = 1;
            for (let j = 1; j < allProveedores.length; j++) {
                if(allProveedores[index]['id'] == allProveedores[j]['id']){
                    contador++;
                    allProveedores[index]['calificacion'] += allProveedores[j]['calificacion'];
                    allProveedores[index]['numeroCali'] = contador;
                    allProveedores.splice(j,j);
                }
                
            }
            
        }

        allProveedores.map((data)=>{
            data['calificacion'] = data['calificacion'] / data['numeroCali'];
            delete data['numeroCali'];

        });

        var ordenArray = [];
        ordenArray = allProveedores.sort((a, b) => {
            return a['calificacion'] - b['calificacion'];
        } );

        ordenArray.map((data)=>{
            proveedoresCali.map((proveedor)=>{
                if(proveedor['key'] == data['id']){
                    data['nombre'] = proveedor['nombre']
                }
            });
        });

        let mejores = [];
        let peores = [];

        mejores = ordenArray.slice(0,5);
        if(peores.length >5) peores = ordenArray.slice((ordenArray.length - 5),ordenArray.length);
        console.log(mejores);
        console.log(peores);

        var labelsMejores = [];
        var valoresMejores = [];

        mejores.map((data)=>{
            labelsMejores.push(data['nombre']);
            valoresMejores.push(data['calificacion']);
        });

        var labelsPeores = [];
        var valoresPeores = [];

        peores.map((data)=>{
            labelsPeores.push(data['nombre']);
            valoresPeores.push(data['calificacion']);
        });

        var ctx = document.getElementById('goodCalificacion').getContext('2d');
        var ctx2 = document.getElementById('badCalificacion').getContext('2d');

        var fila = document.getElementById('calificacionFila');
        fila.classList.remove('invisible');

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelsMejores,
                datasets: [{
                    label: 'Mejores proveedores calificados',
                    data: valoresMejores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
    
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
    
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        var myChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: labelsPeores,
                datasets: [{
                    label: 'Peores proveedores calificados',
                    data: valoresPeores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
    
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
    
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


    });

}

function drawGraf(reqGen,reqDen){

    var fila = document.getElementById('requisicion');
    fila.classList.remove('invisible');

    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Aceptadas','Denegadas'],
            datasets: [{
                label: 'Número de requisiones generedas',
                data: [reqGen,reqDen],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(167, 45, 67, 0.5)'

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(167, 45, 67, 1)'

                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
}

function drawGrafCumplimiento(reqGen,reqDen){

    var fila = document.getElementById('cumplimientoFila');
    fila.classList.remove('invisible');

    var reqAce = reqGen - reqDen;
    var porcentaje = (reqAce * 100) / reqGen;
    var ctx = document.getElementById('cumplimiento');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Cumplmiento'],
            datasets: [{
                label: 'Porcentaje de cumplmiento',
                data: [porcentaje],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function drawGrafConcept(data){

    var fila = document.getElementById('conceptoFila');
    fila.classList.remove('invisible');

    var labels = [];
    var valores = [];
    data.map((data)=>{
        labels.push(data.nombre);
        valores.push(data.requisiciones);
    }); 
    var ctx = document.getElementById('concepto');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de requisiones generedas',
                data: valores,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
}

function drawGrafproveedor(data,id){

    var idFila = (id == "proveedor") ? "proveedorFila" : "anunciosFila"
    var fila = document.getElementById(idFila);
    fila.classList.remove('invisible');

    var labels = [];
    var valores = [];
    data.map((data)=>{
        labels.push(data.mes);
        valores.push(data.cantidad);
    }); 
    var ctx = document.getElementById(id);

    var msg = ( id == "anuncios") ? "anuncios" : "proveedores";

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de '+ msg +' generedos por mes',
                data: valores,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
