
$(document).ready(function (){
    validarsesion();
    cargarHistorias();
    $("#agregar").click(function(){
        let band = true;
        if($("#inputNombreT").val().length<1){
            $("#vNombreT").attr("class","text-danger visible");
            $("#inputNombreT").attr("class","form-control is-invalid");
            band = false;    
        }
        if($("#inputNumT").val().length<1){
            $("#vNumT").attr("class","text-danger visible");
            $("#inputNumT").attr("class","form-control is-invalid");
            band = false;    
        }
        if($("#inputDesc").val().length<1){
            $("#vDescT").attr("class","text-danger visible");
            $("#inputDesc").attr("class","form-control is-invalid");
            band = false;    
        }
        if($("#inputPond").val().length<1){
            $("#vPondT").attr("class","text-danger visible");
            $("#inputPond").attr("class","form-control is-invalid");
            band = false;    
        }

        if(band){
            agregarHistoria();
        }
    });

    $("#formulario").keyup(function(){
        $("#vNombreT").attr("class","invisible");
        $("#inputNombreT").attr("class","form-control");
        $("#vNumT").attr("class","invisible");         
        $("#inputNumT").attr("class","form-control");
        $("#vDescT").attr("class","invisible");         
        $("#inputDesc").attr("class","form-control");
        $("#vPondT").attr("class","invisible");         
        $("#inputPond").attr("class","form-control");  
    })

    //Funcion para inicializar boton de menu izquierdo
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

//Valida si hay una sesion iniciada para redireccionar
function validarsesion(){
    if(!localStorage.getItem("Logueado")){
        location.href ="../login/";
    }
}

//Confirma y agrega la historia ingresada
function agregarHistoria(){
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "container p-3 my-3");

    let titulo = document.createElement("p");
    titulo.innerHTML = "¿Desea agregar la actividad "+document.getElementById("inputNombreT").value+"?";
    contenedor.appendChild(titulo);

    //Inicio de la Alerta
    alertify.confirm("Confirmación de Tarea", contenedor, function(){
        let idProyecto = localStorage.getItem("proyectoSeleccionado");
        let nombreT = document.getElementById("inputNombreT").value;
        let numT = document.getElementById("inputNumT").value;
        let descT = document.getElementById("inputDesc").value;
        let pondT = document.getElementById("inputPond").value;
        $.ajax({
            method: "post",
            url: "../logica.php",
            data: {"idProyectoAH": idProyecto, "nombreT": nombreT, "numT": numT, "descT": descT, "pondT":pondT}
        }).done(function(respuesta){
            console.log(respuesta);
            if(respuesta){
                cargarHistorias();
                document.getElementById("inputNombreT").value="";
                document.getElementById("inputNumT").value="";
                document.getElementById("inputDesc").value="";
                document.getElementById("inputPond").value="";
                alertify.success('Se agrego la Tarea');
            }else{
                alertify.error("Error al guardar tarea");
            }
        });
    },function(){
        alertify.error('No se agrego la Tarea');
    }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
}

function cargarHistorias(){
    eliminarHistorias();
    let idProyectoCH = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        method: "post",
        url: "../logica.php",
        data: {"idProyectoCH": idProyectoCH}
    }).done(function(respuesta){
        let array = JSON.parse(respuesta);
        let cantP = 0;
        console.log(array.length); 
        for(i=0;i<array.length;i++){
            cantP += parseInt(array[i]['puntos']);
            $("#historias").append(`
                <div class="card border-primary mb-3" style="width: 45%; float: left; margin-left:10px;">
                    <div class="card-header bg-primary text-white">${array[i].nombreT}</div>
                    <div class="card-body text-secondary">
                    <h5 class="card-title">N° Historia: ${array[i].numT} | Puntos: ${array[i].puntos}</h5>
                    <p class="card-text">${array[i].descripcion}</p>
                    </div>
                </div>
            `);
        }
        cargarAvisos(array.length, cantP);
    });
}

function eliminarHistorias(){
    let element = document.getElementById("historias");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    let element2 = document.getElementById("espacioDetalles");
    while (element2.firstChild) {
        element2.removeChild(element2.firstChild);
    }
}

function cargarAvisos(cantidad, cantP){
    let idProyectoCA = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        method: "post",
        url: "../logica.php",
        data: {"idProyectoCA": idProyectoCA}
    }).done(function(respuesta){
        let array = JSON.parse(respuesta);
        console.log(array);
        //Convertir fecha inicial
        let aFecha1 = (array[0]['fechaInicio']).split("/");
        let fechaInicio = new Date(aFecha1[2]+"/"+aFecha1[1]+"/"+aFecha1[0]);
        console.log(fechaInicio);
        //Convertir fecha final
        let aFecha2 = (array[0]['fechaFin']).split("/");
        let fechaFin = new Date(aFecha2[2]+"/"+aFecha2[1]+"/"+aFecha2[0]);
        console.log(fechaFin);
        //Numero de Release
        let numRelease = array[0]['numRelease'];
        console.log(numRelease);
        //Diferencia
        let dias = fechaFin - fechaInicio;
        let diff = dias/(1000 * 60 * 60 * 24);
        console.log(diff, cantP);
        $("#espacioDetalles").append(`
            <br>
            <div class="card border-success mb-3" t style="width: 93.5%; float: left; margin-left:10px;">
                <div class="card-header bg-success border-success text-white">Información Release</div>
                <div class="card-body text-secondary">
                <h5 class="card-title">Definición del Trabajo</h5>
                <p style="text-align: justify;" class="card-text">Se sugiere que dadas las ${cantidad} historias de usuario, presentes en el proyecto, y con una espectativa de ${numRelease} releases, se debe realizar un release cada ${parseInt(diff/numRelease)} días, y a su vez, en cada release efectuar ${Math.round(cantP/numRelease)+1} puntos de historia.</p>
                </div>
            </div>
        `);
    });
}

function cerrarSesion(){
    localStorage.clear();
    location.reload();
}