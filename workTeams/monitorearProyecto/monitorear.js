
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

function cargaTareasPendientes()
{
    let idProyecto = localStorage.getItem("proyectoSeleccionado");
     $.ajax({
          url: 'monitorear.php',
          data: {idProyecto},
          type: 'POST',
          success: function (response) {
            console.log(response);
            document.getElementById("pendientes").innerHTML= response;

            cargaTareasTerminadas();
            }   
        })
}

function cargaTareasTerminadas()
{
    let idProyecto2 = localStorage.getItem("proyectoSeleccionado");
     $.ajax({
          url: 'monitorear.php',
          data: {idProyecto2},
          type: 'POST',
          success: function (response) {
            console.log(response);
            document.getElementById("terminadas").innerHTML= response;

            cargaAvanceProyecto();
            }    
        })
}

function cargaAvanceProyecto()
{
    let idProyecto3 = localStorage.getItem("proyectoSeleccionado");
     $.ajax({
          url: 'monitorear.php',
          data: {idProyecto3},
          type: 'POST',
          success: function (response) {
            console.log(response);
            document.getElementById("avancePro").innerHTML= response+"%";
            let div = document.getElementById("progressAvenceP");
             let barra = response;
            div.style.width = barra+"%";

            cargaAvanceRelease();
            }    
        })
}

function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function cargaTarea()
{
    var opcion = getParameterByName('opc');
    
    if(opcion == 1)
    {
        let tareas = localStorage.getItem("proyectoSeleccionado");
       $.ajax({
          url: 'monitorear.php',
          data: {tareas},
          type: 'POST',
          success: function (response) {
            console.log(response);

            let lista = JSON.parse(response);
            for(let i in lista){
            $("#historias").append(`
                <div class="col-6" style="padding: 20px">
                <div class="card border-danger">
                    <div class="card-header bg-danger text-white">${lista[i]['nombreTarea']}</div>
                    <div class="card-body text-secondary">
                    <h5 class="card-title">N° Historia: ${lista[i]['numTarea']} | Puntos: ${lista[i]['puntos']}</h5>
                    <p class="card-text">${lista[i]['descripcion']}</p>
                    </div>
                </div>
                </div>
            `);
            }
            document.getElementById("tipoT").innerHTML= "Tareas Pendientes";  
          }  
        }) 
    }
    else
    {
        let tareas2 = localStorage.getItem("proyectoSeleccionado");
        $.ajax({
          url: 'monitorear.php',
          data: {tareas2},
          type: 'POST',
          success: function (response) {
            console.log(response);

            let lista = JSON.parse(response);
            for(let i in lista){
            $("#historias").append(`
                <div class="col-6" style="padding: 20px">
                <div class="card border-success">
                    <div class="card-header bg-success text-white">${lista[i]['nombreTarea']}</div>
                    <div class="card-body text-secondary">
                    <h5 class="card-title">N° Historia: ${lista[i]['numTarea']} | Puntos: ${lista[i]['puntos']}</h5>
                    <p class="card-text">${lista[i]['descripcion']}</p>
                    </div>
                </div>
                </div>
            `);
            }
            document.getElementById("tipoT").innerHTML= "Tareas Terminadas";  
          }  
        })
    }
}

function cargaAvanceRelease()
{
    let release1 = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
          url: 'monitorear.php',
          data: {release1},
          type: 'POST',
          success: function (response) {
            console.log(response);
            let template = '';
            let lista = JSON.parse(response);
            for(let i in lista)
            {
            template += `
                        <h4 class="small font-weight-bold">Release ${i}<span class="float-right">${lista[i].toFixed(2)}%</span></h4>
                          <div class="progress mb-4">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${lista[i]}%" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        `
            }
                $('#avzRelease').html(template);
                diferencia();
          }  
        })
}

function diferencia()
{



//console.log(fecha1.diff(fecha2, 'days'));
let template='';
let release2 = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
          url: 'monitorear.php',
          data: {release2},
          type: 'POST',
          success: function (response) {
            console.log(response);
            let lista = JSON.parse(response);
            for(let i in lista){
            let alertaTipo1 = false;
            let alertaTipo2 = false;
            var fecha1 = moment(lista[i]["fechaInicio"], 'DD/MM/YYYY');
            var fecha2 = moment(lista[i]["fechaFin"], 'DD/MM/YYYY');
            var fechaHoy = moment().format('DD/MM/YYYY');
            var calculo = moment(fechaHoy, 'DD/MM/YYYY');


            let duracion = fecha2.diff(fecha1, 'days');
        //    console.log(duracion);
            let avance = duracion/2;

            let avance2 = (avance/2)+avance;
        //    console.log(avance);
            let dif2 = (fecha1.diff(calculo, 'days'))*-1;
          //      console.log(dif2);
            let idRel = lista[i]['idRelease'];
            $.ajax({
          url: 'monitorear.php',
          data: {idRel},
          type: 'POST',
          success: function (response) {
            console.log(response);
            let porcentajes = 0;
            var respuesta = response.split(',');
            porcentajes = (respuesta[1]*100)/respuesta[0];
            if(dif2 >= avance && porcentajes < 51)
            {
                alertaTipo1 = true;
             //   console.log("retraso release: "+lista[i]['idRelease']);
            }

            if(dif2 >= avance2 && porcentajes < 80)
                {
                    alertaTipo2 = true;
                    alertaTipo1 = false;
                }

            if(alertaTipo1 == true){
            template += `
                        <div class="card border-warning mb-3" t style="width: 93.5%; float: left; margin-left:10px;">
                            <div class="card-header bg-warning border-danger text-white">Release ${i} atrasado</div>
                            <div class="card-body text-secondary">
                            <h5 class="card-title">Duración del Release: ${duracion} dias</h5>
                            <h5 class="card-title">Fecha Inicio Release: ${lista[i]['fechaInicio']}</h5>
                            <h5 class="card-title">Fecha Fin Release: ${lista[i]['fechaFin']}</h5>
                            <p style="text-align: justify;" class="card-text">Existe un retraso en el release</p>
                            </div>
                        </div>
                        `
                    }
                    else
                    {
                        if(alertaTipo2 == true)
                        {
                            template += `
                        <div class="card border-danger mb-3" t style="width: 93.5%; float: left; margin-left:10px;">
                            <div class="card-header bg-danger border-danger text-white">Release ${i} atrasado</div>
                            <div class="card-body text-secondary">
                            <h5 class="card-title">Duración del Release: ${duracion} dias</h5>
                            <h5 class="card-title">Fecha Inicio Release: ${lista[i]['fechaInicio']}</h5>
                            <h5 class="card-title">Fecha Fin Release: ${lista[i]['fechaFin']}</h5>
                            <p style="text-align: justify;" class="card-text">El release esta por terminar</p>
                            </div>
                        </div>
                        `
                        }
                    }
                    $('#avisoRe').html(template);
          }  
        })


            }
      /*      let template = '';
            
            for(let i in lista)
            {
            template += `
                        <h4 class="small font-weight-bold">Release ${i}<span class="float-right">${lista[i].toFixed(2)}%</span></h4>
                          <div class="progress mb-4">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${lista[i]}%" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        `
            }
                $('#avzRelease').html(template);*/;
          }  
        }) 
}

function inserteAvanceRelease(release)
{
    let release2 = release;
    $.ajax({
          url: 'monitorear.php',
          data: {release2},
          type: 'POST',
          success: function (response) {
            console.log(response);
            let template = '';
            let lista = JSON.parse(response);
            template += `
                        <h4 class="small font-weight-bold">Release 1<span class="float-right">20%</span></h4>
                          <div class="progress mb-4">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        `

                $('#global').html(template);
            
          }  
        })
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