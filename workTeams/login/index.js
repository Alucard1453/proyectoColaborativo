
$(document).ready(function (){
    validarsesion();

    $("#Ingresar").click(function(){
        band1=true; band2=true;
        if($("#usuario").val().length<1){
            $("#nouser").attr("class","text-danger visible");
            $("#usuario").attr("class","form-control is-invalid");
            band1=false;        
        }
        if($("#pass").val().length<1){
            $("#nocontra").attr("class","text-danger visible");         
            $("#pass").attr("class","form-control is-invalid");
            band2=false;      
        }
        if(band1 && band2){
            validarAccesoUsuario();
        }
    });

    $("#register-form").keyup(function(){
        $("#nouser").attr("class","invisible");
        $("#usuario").attr("class","form-control");         
        $("#nocontra").attr("class","invisible");         
        $("#pass").attr("class","form-control");  
        $("#invalid").attr("class","invisible");
    })
});

//Valida si hay una sesion iniciada para redireccionar
function validarsesion(){
    if(localStorage.getItem("Logueado")){
        logueado = localStorage.getItem("Logueado");
        if(logueado)
            location.href ="../proyectos/proyectos.html";
    }
}

function validarAccesoUsuario(){
    usuario=$("#usuario").val();
    contra=$("#pass").val();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            respuesta = parseInt(this.responseText,10); //1 Exitoso, 0 Datos Invalidos
            // respuesta = this.responseText;
            // console.log(respuesta);

            if(respuesta){
                localStorage.setItem("Logueado",true);
                location.href ="../proyectos/proyectos.html";
            }
            else{
                $("#invalid").attr("class","text-danger visible");
                $("#usuario").attr("class","form-control is-invalid");
                $("#pass").attr("class","form-control is-invalid");
            }
        }
    };
    xmlhttp.open("POST", "../logica.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("login=1&usuario="+usuario+"&contra="+contra);
}
