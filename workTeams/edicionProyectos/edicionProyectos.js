// var aUsers;
$(document).ready(function (){
    validarsesion();
    cargarHistorias();

    //Funcion para inicializar boton de menu izquierdo
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

function obtenerR(idTarea){
    var responsable = 0;
    let idProyectoOP = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        async: false,
        method: "post",
        url: "edicionProyectos.php",
        data: {"idProyectoOP": idProyectoOP, 'idTareaOP': idTarea}
    }).done(function(respuesta){
        console.log(respuesta);
        responsable = respuesta;
    });
    console.log(responsable);
    return responsable;
}

//Valida si hay una sesion iniciada
function validarsesion(){
    if(!localStorage.getItem("Logueado")){
        location.href ="../login/";
    }
}

//Cargar las historias pertenecientes al proyecto
function cargarHistorias(){
    eliminarHistorias();
    let idProyectoCH = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        async: false,
        method: "post",
        url: "edicionProyectos.php",
        data: {"idProyectoCH": idProyectoCH}
    }).done(function(respuesta){
        // console.log(aUsers);
        let array = JSON.parse(respuesta);
        console.log(JSON.parse(respuesta));
        let contenedor; 
        // let asignado;
        for(i=0;i<array.length;i++){
            if(array[i]['estatus'] == 1){
                contenedor = "espacioDetalles";
                let nombreT = array[i]['nombreT'];
                $("#"+contenedor).append(`
                    <div class="card border-primary mb-3" style="width: 95%; margin-left:10px;">
                        <div class="card-header bg-primary text-white">${array[i].nombreT} (Sin Asignar)</div>
                        <div class="card-body text-secondary">
                        <h5 class="card-title">N° Historia: ${array[i].numT} | Puntos: ${array[i].puntos}</h5>
                        <p class="card-text">${array[i].descripcion}</p>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-9"></div>
                            <div class="form-group col-md-3">
                                <button type="button" onclick="agregarHU(${array[i].idTarea}, '${nombreT}');" class="btn btn-success"><i class="fas fa-plus"></i>
                            </div>
                        </div>
                    </div>
                `);
            }else if(array[i]['estatus'] == 2){
                contenedor = "cont1";
                let nombreT = array[i]['nombreT'];
                let val = 1;
                console.log(array[i]['asignado']);
                $("#"+contenedor).append(`
                    <div class="card border-secondary mb-3" style="width: 95%; margin-left:10px;">
                        <div class="card-header bg-secondary text-white">${array[i].nombreT} asignado a ${obtenerR(array[i].idTarea)}</div>
                        <div class="card-body text-secondary">
                        <h5 class="card-title">N° Historia: ${array[i].numT} | Puntos: ${array[i].puntos}</h5>
                        <p class="card-text">${array[i].descripcion}</p>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-10"></div>
                            <div class="form-group col-md-2">
                                <button type="button" onclick="actHUU(${array[i].idTarea}, '${nombreT}', '${array[i].asignado}', '${val}');" class="btn btn-success"><i class="fas fa-retweet"></i>
                            </div>
                        </div>
                    </div>
                `);
            }else if(array[i]['estatus'] == 3){
                contenedor = "cont2";
                let nombreT = array[i]['nombreT'];
                let val = 2;
                $("#"+contenedor).append(`
                    <div class="card border-secondary mb-3" style="width: 95%; margin-left:10px;">
                        <div class="card-header bg-secondary text-white">${array[i].nombreT} asignado a ${obtenerR(array[i].idTarea)}</div>
                        <div class="card-body text-secondary">
                        <h5 class="card-title">N° Historia: ${array[i].numT} | Puntos: ${array[i].puntos}</h5>
                        <p class="card-text">${array[i].descripcion}</p>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-10"></div>
                            <div class="form-group col-md-2">
                                <button type="button" onclick="actHUU(${array[i].idTarea}, '${nombreT}', '${array[i].asignado}', '${val}');" class="btn btn-success"><i class="fas fa-retweet"></i>
                            </div>
                        </div>
                    </div>
                `);
            }else if(array[i]['estatus'] == 4){
                contenedor = "cont3";
                $("#"+contenedor).append(`
                <div class="card border-secondary mb-3" style="width: 95%; margin-left:10px;">
                    <div class="card-header bg-secondary text-white">${array[i].nombreT} asignado a ${obtenerR(array[i].idTarea)}</div>
                    <div class="card-body text-secondary">
                    <h5 class="card-title">N° Historia: ${array[i].numT} | Puntos: ${array[i].puntos}</h5>
                    <p class="card-text">${array[i].descripcion}</p>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-10"></div>
                        <div class="form-group col-md-2">
                            <button type="button" onclick="" class="btn btn-success"><i class="far fa-comment"></i>
                        </div>
                    </div>
                </div>
                `);
            }
        }
    });
}

function eliminarHistorias(){
    
    let element1 = document.getElementById("espacioDetalles");
    while (element1.firstChild) {
        element1.removeChild(element1.firstChild);
    }

    let element2 = document.getElementById("cont1");
    while (element2.firstChild) {
        element2.removeChild(element2.firstChild);
    }

    let element3 = document.getElementById("cont2");
    while (element3.firstChild) {
        element3.removeChild(element3.firstChild);
    }

    let element4 = document.getElementById("cont3");
    while (element4.firstChild) {
        element4.removeChild(element4.firstChild);
    }
}

function agregarHU(idTarea, nombreT){
    console.log(idTarea);
    let cont = document.createElement("div");
    cont.setAttribute("id", "uno");

    //Inicio de la Alerta
    alertify.confirm("Asignación de la Tarea", cont, function(){
        let value = document.getElementById("search").value;
        if(value){
            $.ajax({
                async: false,
                method: "post",
                url: "edicionProyectos.php",
                data: {"idTarea": idTarea, "usuario": value}
            }).done(function(respuesta){
                console.log(respuesta);
            });
            cargarHistorias();
            alertify.success('Se realizo correctamente la asignación');
        }else{
            alertify.error('No se realizo la asignación');
        }
    },function(){
        alertify.error('No se realizo la asignación');
    }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false,}, ejecutar(nombreT));
}

function ejecutar(nombreT){
    $("#uno").append(`
    <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
            <br>
            <p style="text-align: justify;">Seleccione el integrante que tendrá asignada la historia ${nombreT}</p>
            <br>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1"><i class="fas fa-search"></i></span>
                </div>
                <input list="usuarios" id="search" type="search" class="form-control" placeholder="Busqueda de usuarios" aria-label="Busqueda de envio" aria-describedby="basic-addon1">
                <datalist id="usuarios">
                </datalist>
            </div>
        </div>
        <div class="col-md-1"></div>
    </div>
    `);

    let idProyectoBU = localStorage.getItem("proyectoSeleccionado");

    $.ajax({
        async: false,
        method: "post",
        url: "edicionProyectos.php",
        data: {"idProyectoBU": idProyectoBU}
    }).done(function(respuesta){
        let array = JSON.parse(respuesta);
        console.log(array);
        for(let i=0; i < array.length; i++){
            $("#usuarios").append(`
            <option value="${array[i].usuario}">
        `);
        }
    });
}

function actHUU(idTarea, nomT, asignado, val){
    //var idLider;
    console.log(asignado, val);
    let idProyecto = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        async: false,
        method: "post",
        url: "edicionProyectos.php",
        data: {"asignado": asignado, 'idProyecto':idProyecto}
    }).done(function(respuesta){
        console.log(respuesta);
        localStorage.setItem("lider", respuesta);

    });

    $.ajax({
        async: false,
        method: "post",
        url: "../logica.php",
        data: {"asignado": asignado}
    }).done(function(respuesta){
        //console.log("Lider"+idLider);
        if(respuesta == asignado || respuesta == localStorage.getItem("lider")){
            let cont = document.createElement("div");
            cont.setAttribute("id", "dos");
            if(val == '1'){
                //Inicio de la Alerta
                alertify.confirm("Actualizar Estatus", cont, function(){
                    $.ajax({
                        async: "false",
                        method: "post",
                        url: "edicionProyectos.php",
                        data: {"idTareaA": idTarea}
                    }).done(function(respuesta){
                        console.log(respuesta);
                        alertify.success('Se realizo correctamente la asignación');
                    });
                    cargarHistorias();
                },function(){
                    alertify.error('No se realizo la asignación');
                }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false,}, ejecutar2(nomT));
                //Fin de la alerta
            }else if(val == '2'){
                //Inicio de la Alerta
                alertify.confirm("Actualizar Estatus", cont, function(){
                        $.ajax({
                            async: false,
                            method: "post",
                            url: "edicionProyectos.php",
                            data: {"idTareaA2": idTarea}
                        }).done(function(respuesta){
                            console.log(respuesta);
                            alertify.success('Se realizo correctamente la asignación');
                        });
                        cargarHistorias();
                },function(){
                    alertify.error('No se realizo la asignación');
                }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false,}, ejecutar3(nomT));
                //Fin de la alerta
            }

        }else{
            console.log(asignado, localStorage.getItem("lider"));
            alertify.error("Solo el usuario asignado puede actualizar la historia");
        }
    });
}

function ejecutar2(nombreT){
    $("#dos").append(`
    <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
            <br>
            <p style="text-align: justify;">¿Desea Actualizar el estatus de la historia ${nombreT} de "Asignada" a "En Curso"?</p>
        </div>
        <div class="col-md-1"></div>
    </div>
    `);
}

function ejecutar3(nombreT){
    $("#dos").append(`
    <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
            <br>
            <p style="text-align: justify;">¿Desea Actualizar el estatus de la historia ${nombreT} de "En Curso" a "Finalizada"?</p>
        </div>
        <div class="col-md-1"></div>
    </div>
    `);
}