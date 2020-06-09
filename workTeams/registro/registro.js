
$(document).ready(function (){
    validarsesion();

    $("#register-form").keyup(function(){
        $("#nouser").attr("class","invisible");
        $("#usuario").attr("class","form-control");
        if($("#contra").val().length>0){
            if($("#contra").val().length>0 && $("#contra").val().length<6){
                $("#nocontra").attr("class","text-danger visible");
                $("#contra").attr("class","form-control is-invalid");
            }else{
                $("#nocontra").attr("class","invisible");
                $("#contra").attr("class","form-control");
            }
        }
        if($("#nombre").val().length>0 && $("#paterno").val().length>0 && $("#materno").val().length>0 && $("#usuario").val().length>0 && $("#contra").val().length>=6){
            $("#Ingresar").removeAttr("disabled");
        }else{
            $("#Ingresar").attr("disabled","true");
        }
    });

    $("#Ingresar").click(function(){
        validarAccesoUsuario();
    });
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
    nombre=$("#nombre").val();
    paterno=$("#paterno").val();
    materno=$("#materno").val();
    usuario=$("#usuario").val();
    contra=$("#contra").val();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            respuesta = parseInt(this.responseText,10); //1 Exitoso 0 Usuario ya existe
            // respuesta = this.responseText;
            // console.log(respuesta);

            if(respuesta){
                localStorage.setItem("Logueado",true);
                location.href ="../proyectos/proyectos.html";
            }
            else{
                $("#nouser").attr("class","text-danger visible");
                $("#usuario").attr("class","form-control is-invalid");
            }
        }
    };
    xmlhttp.open("POST", "../logica.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("registroUser=1&nombre="+nombre+"&paterno="+paterno+"&materno="+materno+"&usuario="+usuario+"&contra="+contra);
}
