
function check(){

    let user = JSON.parse(localStorage.getItem('user_asistente'));
    var direccion = window.location.pathname;
    debugger;

    if (user) {

        if( direccion == "/dash-asistente/login.html" )


        Swal.fire({

                icon: 'success',
                title: `Bienvenido ${user.correo}`,
                timer: 1500,
                showConfirmButton: false,
                onClose: () => {

                    window.location = "/dash-asistente/";
                }
        });


        

    } else {

        if ( direccion != "/dash-asistente/login.html" ) {

            window.location = "/dash-asistente/login.html";




        }

    }
}

function salir() {

    Swal.fire({
        title: '¿Quieres cerrar sesión?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
            localStorage.removeItem('user_asistente');
            check();
        }
      });
    

    
}