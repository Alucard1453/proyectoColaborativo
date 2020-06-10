
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

    //Solo permitira letras a los campos que tengan la clase letras
    $(".letras").keypress(function (key) {
        // window.console.log(key.charCode)
        if ((key.charCode < 97 || key.charCode > 122)//letras mayusculas
            && (key.charCode < 65 || key.charCode > 90) //letras minusculas
            && (key.charCode != 45) //retroceso
            && (key.charCode != 241) //ñ
             && (key.charCode != 209) //Ñ
             && (key.charCode != 32) //espacio
             && (key.charCode != 225) //á
             && (key.charCode != 233) //é
             && (key.charCode != 237) //í
             && (key.charCode != 243) //ó
             && (key.charCode != 250) //ú
             && (key.charCode != 193) //Á
             && (key.charCode != 201) //É
             && (key.charCode != 205) //Í
             && (key.charCode != 211) //Ó
             && (key.charCode != 218) //Ú

            )
            return false;
    });

    //No permitira espacios en blanco en la clase username
    $(".userName").keypress(function (key) {
        if (key.charCode == 32)
            return false;
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
