// var aUsers;
$(document).ready(function (){
    validarsesion();
    validarRelease();
    $("#historiasI").click(function() {
        agregarRelease();
    });

    //Funcion para inicializar boton de menu izquierdo
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

function validarRelease(){
    // localStorage.setItem("bandera", true);
    let idProyectoVR = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        async: false,
        method: "post",
        url: "edicionProyectos.php",
        data: {"idProyectoVR": idProyectoVR}
    }).done(function(respuesta){
        var objRelease = JSON.parse(respuesta);
        console.log(objRelease);
        if(objRelease.length){
            //Establecemos encabezado
            agregarEncabezado(objRelease[0]['fIni'], objRelease[0]['fFin'], objRelease[0]['idRelease'], objRelease[0]['numH']);
            //Cambiamos el formato
            let arregloFecha = objRelease[0]['fFin'].split("-");
            //Convertimos el string fecha a formato date
            let final = new Date(arregloFecha[0]+"/"+arregloFecha[1]+"/"+arregloFecha[2]);
            console.log(final);
            //Obtenemos la fecha actual
            let horaA = new Date(); //IMPORTANTE Ingrese la fecha en formato 'YYYY-MM-DD' para definir una fecha actual
            console.log(horaA);
            //Preguntamos
            if(horaA > final){
                console.log("Entre if");
                //La fecha actual es mayor al fin del release
                //Cambiar la bandera para no mostrar las historias 
                localStorage.setItem("bandera", false);
                //Cambiar el status del del release
                $.ajax({
                    async: false,
                    method: "post",
                    url: "edicionProyectos.php",
                    data: {"idRelease": objRelease[0]['idRelease']}
                }).done(function(respuesta){
                    console.log(respuesta);
                });
                //Fin cambio status
                cargarHistorias(false);
                $("#historiasI").removeAttr("disabled");
            }else{
                console.log("Entre false");
                cargarHistorias(true);
            }
        }else{
            $("#historiasI").removeAttr("disabled");
            cargarHistorias(false);
            agregarE();
        }
    });

}

function agregarE(){
    eliminarE();
    $("#titulo2").append(`
        (No hay un release actual, cree uno nuevo).
    `);
}

function agregarEncabezado(fInicio, fFinal, idRelease, numH){
    console.log(fInicio, fFinal, idRelease, numH);
    let idProyectoE = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        async: false,
        method: "post",
        url: "edicionProyectos.php",
        data: {"idProyectoE": idProyectoE}
    }).done(function(respuesta){
        let datos = JSON.parse(respuesta);
        let actual = datos[0]['numActual'];
        let total = datos[0]['numFinal'];
        eliminarE();
        $("#titulo2").append(`
            | Inicio: ${fInicio} | Final: ${fFinal} | Release: (${actual}/${total}) |
        `);
    });
}

function eliminarE(){
    let element1 = document.getElementById("titulo2");
    while (element1.firstChild) {
        element1.removeChild(element1.firstChild);
    }
}

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
function cargarHistorias(band){
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
        // var band = localStorage.getItem("bandera");
        // console.log(band);
        // let asignado;
        for(i=0;i<array.length;i++){
            if(array[i]['estatus'] == 1){
                if(band){
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
                }
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
                            <button type="button" onclick="agregarComentario(${array[i].idTarea}, '${array[i].nombreT}');" class="btn btn-success"><i class="far fa-comment"></i>
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
    let idProyectoR = localStorage.getItem("proyectoSeleccionado");
    //Inicio de la Alerta
    alertify.confirm("Asignación de la Tarea", cont, function(){
        let value = document.getElementById("search").value;
        if(value){
            //Actualizar estado
            $.ajax({
                async: false,
                method: "post",
                url: "edicionProyectos.php",
                data: {"idTarea": idTarea, "usuario": value, "idProyectoR": idProyectoR}
            }).done(function(respuesta){
                console.log(respuesta);
            });
            cargarHistorias(true);
            alertify.success('Se realizó correctamente la asignación');
        }else{
            alertify.error('No se realizó la asignación');
        }
    },function(){
        alertify.error('No se realizó la asignación');
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
        localStorage.setItem("usuarioActual", respuesta);
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
                        alertify.success('Se realizó correctamente la asignación 1');
                        cargarHistorias(true);
                    });
                },function(){
                    alertify.error('No se realizó la asignación');
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
                            alertify.success('Se realizó correctamente la asignación');
                            cargarHistorias(true);
                        });
                },function(){
                    alertify.error('No se realizó la asignación');
                }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false,}, ejecutar3(nomT));
                //Fin de la alerta
            }

        }else{
            console.log(asignado, localStorage.getItem("lider"));
            alertify.error("Sólo el usuario asignado puede actualizar la historia");
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

function agregarRelease(){
    let cont = document.createElement("div");
    cont.setAttribute("id", "tres");
    let idProyectoAR = localStorage.getItem("proyectoSeleccionado");
    //Inicio de la Alerta
    alertify.confirm("Crear Release", cont, function(){
        let fechaI = $("#fechaInicio").val();
        let fechaF = $("#fechaFin").val();
        let numH = $("#numH").val()
        if(numH){
            console.log(fechaI, fechaF, numH);
            //Petición Ajax
            $.ajax({
                async: false,
                method: "post",
                url: "edicionProyectos.php",
                data: {"idProyectoAR": idProyectoAR, "fechaI": fechaI, "fechaF": fechaF, "NumH": numH}
            }).done(function(respuesta){
                console.log(respuesta);
                validarRelease();
            });
            document.getElementById("historiasI").disabled = true;
            //Fin Petición Ajax
            alertify.success('Se realizó correctamente la asignación del release');
        }else{
            alertify.error('No se agregó el valor del número de historias');
        }
    },function(){
        alertify.error('No se realizó la asignación del release');
    }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false,}, abrirR());
}

function abrirR(){
    $("#tres").append(`
    <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
            <br>
            <p style="text-align: justify;">Para iniciar un nuevo release defina la información correspondiente.</p>
            <br>
            <div id="contenido">                                
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="fechaInicio">Fecha de inicio</label>
                    <input type="date" class="form-control" id="fechaInicio">
                </div>
                <div class="form-group col-md-6">
                    <label for="fechaFin">Fecha de fin</label>
                    <input type="date" class="form-control" id="fechaFin">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label>Número de Historias</label>
                    <input type="number" min="1" class="form-control" id="numH" placeholder="# Historias">
                </div>
                <div class="form-group col-md-6">
                <label for="inputEstatus">Estatus</label>
                <input type="text" class="form-control" id="status" value="En Curso" readonly>
            </div>
            </div>
        </div>
        <br>
        </div>
        <div class="col-md-1"></div>
    </div>
    `);

    inicio=moment().format("YYYY-MM-DD");
    fin=moment().add('days',7).format("YYYY-MM-DD");
    // $("#fechaInicio").val(inicio);
    // $("#fechaFin").val(fin);

    let idProyectoF = localStorage.getItem("proyectoSeleccionado");
    $.ajax({
        async: false,
        method: "post",
        url: "edicionProyectos.php",
        data: {"idProyectoF": idProyectoF}
    }).done(function(respuesta){
        console.log(respuesta);
        if(respuesta){
            //Tratamos la fecha
            // let arregloFecha = respuesta.split("-");
            // let final = (arregloFecha[0]+"/"+arregloFecha[1]+"/"+arregloFecha[2]);
            // console.log(final);
            //Realizar peticion para conocer la fecha fin del ultimo release
            $("#fechaInicio").attr("min",respuesta);
            $("#fechaFin").attr("min",respuesta);
        }else{
            //Realizar peticion para conocer la fecha fin del ultimo release
            console.log("Entre false fecha");
            $("#fechaInicio").attr("min",inicio);
            $("#fechaFin").attr("min",inicio);
        }

    });

}

function agregarComentario(idTarea, nombreT){
    console.log(idTarea, nombreT);
    let cont = document.createElement("div");
    cont.setAttribute("id", "cuatro");

    //Inicio de la Alerta
    alertify.confirm("Agregar Comentario", cont, function(){
        let comentario = $("#comentarioT").val();
        let fecha = moment().format("YYYY-MM-DD");
        if(comentario){
            console.log(comentario, fecha);
            //Petición Ajax
            $.ajax({
                async: false,
                method: "post",
                url: "edicionProyectos.php",
                data: {"idTareaC": idTarea, "fecha": fecha, "comentario": comentario}
            }).done(function(respuesta){
                console.log(respuesta);
                alertify.success("Se asignó correctamente el comentario");
            });
        }else{
            alertify.error('No existe un comentario');
        }
    },function(){
        alertify.error('No se realizó la asignación del comentario');
    }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false,}, setComentario(nombreT));
}

function setComentario(nombreT){
    $("#cuatro").append(`
        <div class="row">
            <div class="col-md-1"></div>
            <div class="col-md-10">
                <br>
                <p style="text-align: justify;">¿Desea agregar un comentario a la historia ${nombreT}?</p>
                <br>
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <textarea class="form-control" id="comentarioT" rows="3" placeholder="Ingrese el comentario"></textarea>
                    </div>
                </div>
                <p style="text-align: justify;"><b>Presione Enter o Aceptar para agregar el comentario.</b></p>
            </div>
            <div class="col-md-1"></div>
        </div>
    `);
}