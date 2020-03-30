
window.onload = function(){
    var element = document.getElementsByClassName("inputElement");
    for (let index = 0; index < element.length; index++) {
       element.item(index).addEventListener("focus",(element)=>{
           var elementSpan = element.target.nextElementSibling;
           elementSpan.style.top = '-6px';
       });

       element.item(index).addEventListener("blur",(element)=>{
           if (element.target.value == ""){
               var elementSpan = element.target.nextElementSibling;
               console.log(elementSpan);
                elementSpan.style.top = '16px';

           }
    });
        
    }
};
function entrar(){
    var correo = document.getElementsByName("email")[0].value;
    var pass = document.getElementsByName("password")[0].value;

    if(correo === "" || pass === ""){

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Llene todos los campos',
          });
    }
    else{
        firebase.database().ref("users_dash/").once("value",(data)=>{
            let user = data.val();
            for (const key in user) {
                if( user[key]['correo'] == correo)
                {
                    if( user[key]['password'] == pass)
                    {
                        localStorage.setItem('user_asistente',JSON.stringify({tipo:key,correo:correo}));
                        check();
                        return false;
                    }
                    else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'La contraseña no es correcta'
                          });
                          document.getElementById("pass").value = "";
                          return false;
                    }

                }
                
            }

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario no existe'
              });
              document.getElementById("pass").value = "";
              document.getElementById("email").value = "";

        });
    }
}