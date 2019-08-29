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
            if(proveedor[key]['subCategoria'] != key){
                    proveedores.push({
                        fecha: proveedor[key]['fechaRegistro']
                    });
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

        console.log(reqDen);
        console.log(reqGen);

        drawGraf(reqGen,reqDen);
        drawGrafConcept(conceptos);
        drawGrafCumplimiento(reqGen,reqDen);
        drawGrafproveedor(proveedoresMes,"proveedor")


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
            drawGrafproveedor(anuncios,"anuncios")

        });

        
        

});

function drawGraf(reqGen,reqDen){
    var ctx = document.getElementById('myChart');

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

function drawGrafCumplimiento(reqGen,reqDen){
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
