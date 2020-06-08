$(document).ready(function (){
    validarsesion();

    //Funcion para inicializar boton de menu izquierdo
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

//Valida si hay una sesion iniciada
function validarsesion(){
    // if(!localStorage.getItem("Logueado")){
    //     location.href ="../login/login.html";
    // }
}
