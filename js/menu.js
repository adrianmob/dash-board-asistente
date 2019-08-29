document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
    
        var eleModal = document.querySelectorAll('.modal');
        var instanceModal = M.Modal.init(eleModal);

        console.log(eleModal);

        console.log(elems);

});

function numeros(){
    var reparto = document.getElementById("reparto");
    var tercero = document.getElementById("tercero");

    var body = {
        reparto : reparto.value,
        tercero: tercero.value
    };

    firebase.database().ref("telefonos/").set(body);   


}
