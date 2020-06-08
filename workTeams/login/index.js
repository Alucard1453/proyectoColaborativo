
$(document).ready(function (){
    validarsesion();
});

//Valida si hay una sesion iniciada para redireccionar
function validarsesion(){
    // if(localStorage.getItem("Logueado")){
    //     var logueado = localStorage.getItem("Logueado");
    //     if(logueado)
    //         location.href ="./schedule.html";
    // }
}

//Funcion para deshabilitar el scroll en el login
$('html, body').css({
    'overflow': 'hidden',
    'height': '100%'
});


//Funciones usuario
function escribeuser() {
    var div = document.getElementById("nouser");
    div.style.display = "none";
    div = document.getElementById("invalidinfo");
    div.style.display = "none";
}

function escribepass() {
    let div = document.getElementById("nopass");
    div.style.display = "none";
    div = document.getElementById("invalidinfo");
    div.style.display = "none";
}

function validarFormularioU(user,pass){
    if(user==""){
        let div = document.getElementById("nouser");
        div.style.display = "block";
    }

    if(pass==""){
        let div = document.getElementById("nopass");
        div.style.display = "block";
    }

    if(user!="" && pass!="")
        return true;
    else
        return false;
}

//Secciones de ingreso primero usuario y despues trabajador
function ingresarUsuario(user,pass) {
    if(validarFormularioU(user,pass)){
        validarAccesoUsuario(user,pass);
    }
}

function validarAccesoUsuario(user,pass){
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         // var respuesta = parseInt(this.responseText,10);
    //         var respuesta = this.responseText;
    //         // console.log(respuesta);
    //         // if(respuesta)
    //         //     console.log("si");
    //         // else
    //         //     console.log("no");

    //         if(respuesta){
    //             localStorage.setItem("Usuario",user);
    //             localStorage.setItem("Logueado",true);
    //             location.href ="./schedule.html";
    //         }
    //         else{
    //             var div = document.getElementById("invalidinfo");
    //             div.style.display = "block";
    //         }
    //     }
    // };
    // xmlhttp.open("GET", "logica.php?Usuario="+user+"&Password="+pass, true);
    // xmlhttp.send();
}
