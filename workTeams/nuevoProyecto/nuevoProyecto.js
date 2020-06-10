var arreglo = new Array();

$(document).ready(function (){
    validarsesion();
    getActualUser();

    //Funcion para inicializar boton de menu izquierdo
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    inicio=moment().format("YYYY-MM-DD");
    fin=moment().add('days',7).format("YYYY-MM-DD");

    $("#fechaInicio").val(inicio);
    $("#fechaFin").val(fin);

    $("#fechaInicio").attr("min",inicio);
    $("#fechaFin").attr("min",fin);

    //Funcion de busqueda de envio
    $('#search').keyup(function(e){
        let search = $('#search').val();
        if(search == ""){
            $("#resultados").attr("class","invisible");
        }else{
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // var res = this.responseText;
                    // console.log(res);
                    var res = JSON.parse(this.responseText);
                    if(res.length > 0){
                        $("#resultados").attr("class","visible");
                        let template = `<table class="table tabla">
                        <thead class="thead-light">
                        <tr>
                            <th>Usuario</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>`;
                        for(i=0;i<Object.keys(res).length;i++){
                            band=true;
                            for(j=0;j<arreglo.length;j++){
                                if(arreglo[j].id == res[i].idUsuario){
                                    band=false;
                                }
                            }
                            if(band){
                            template += `
                            <tr>
                                <td>${res[i].userName}</td>
                                <td><button type="button" title="Agregar" class="btn btn-primary rounded" onclick="agregarUsuario('${res[i].userName}')"><i class="fas fa-plus"></i></button></td>`;
                            }
                        }
                        template += `</tr>`;
                        template += `
                        </tbody>
                        </table>
                        `;
                        $('#resultados').html(template);
                    }else{
                        $("#resultados").attr("class","invisible");
                    }
                }
            };
            xmlhttp.open("POST", "../logica.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("searchUsuario=1&busca="+search);
        }
    });

    //funcion que valida campos vacios
    $("#contenedor").change(function(){
        $("#error").attr("class","invisible");
        $("#proyectoName").attr("class","form-control");
        if(validaroles()){
            if($("#proyectoName").val().length>0 && $("#numRelease").val().length>0 && $("#descripcion").val().length>0){
                inicio=moment($("#fechaInicio").val());
                fin=moment($("#fechaFin").val());
                if(inicio<fin){
                    $("#btnContinuar").attr("class","btn btn-primary visible");
                }else{
                    $("#btnContinuar").attr("class","invisible");
                }
            }else{
                $("#btnContinuar").attr("class","invisible");
            }
        }else{
            $("#btnContinuar").attr("class","invisible");
        }
    });

    //funciones para avisos con modales
    $("#btnContinuar").click(function(){
        $("#modalConfirmacion").click();
    });

    $("#btn-confirmacion").click(function(){
        guardarProyecto();
    });

});

//Valida si hay una sesion iniciada
function validarsesion(){
    if(!localStorage.getItem("Logueado")){
        location.href ="../login/";
    }
}

//Valida que todos los miembros tengan un rol asignado
function validaroles(){
    band = true;
    if(arreglo.length>1){
        aux=arreglo.slice(1);
        for(i=0;i<aux.length;i++){
            elemento=document.getElementById("rol"+aux[i].id);
            if(elemento){
                if(elemento.value == ""){
                    band = false;
                }
            }
        }
    }
    return band;
}

//Obtiene el usuario actual 
function getActualUser(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            respuesta = JSON.parse(this.responseText);
            // console.log(respuesta);
            usuario = new Object();
            usuario.id=respuesta[0].idUsuario;
            usuario.nombre=respuesta[0].userName;
            usuario.rol=1;
            arreglo.push(usuario);
            cargarUsuarios();
        }
    };
    xmlhttp.open("POST", "../logica.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("searchUsuario=1&actual=1");
}

//agrega un usuario al recuadro derecho
function agregarUsuario(username){
    $("#btnContinuar").attr("class","invisible");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // respuesta = this.responseText;
            respuesta = JSON.parse(this.responseText);
            // console.log(respuesta);
            usuario = new Object();
            usuario.id=respuesta[0].idUsuario;
            usuario.nombre=respuesta[0].userName;
            arreglo.push(usuario);
            $("#search").val("");
            $("#resultados").attr("class","invisible");
            cargarUsuarios();
        }
    };
    xmlhttp.open("POST", "../logica.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("searchUsuario=1&busca="+username);
}

//carga los usuarios al recuadro derecho
function cargarUsuarios(){
    $("#espacioDetalles").empty();
    for(i=0;i<arreglo.length;i++){
        if(arreglo[i].rol == 1){
            $("#espacioDetalles").append(`
            <div class="form-row">
                <div class="form-group col-md-3">
                    <b>${arreglo[i].nombre}</b>
                </div>
                <div class="form-group col-md-7">
                    <select disabled class="custom-select">
                        <option value="1" selected disabled>Lider de proyecto</option>
                    </select>
                </div>
                <div class="form-group col-md-2">
                    <button type="button" disabled class="btn btn-danger"><i class="fas fa-trash-alt"></i></a>
                </div>
            </div>
            `);
        }else{
            $("#espacioDetalles").append(`
            <div class="form-row">
                <div class="form-group col-md-3">
                    <b>${arreglo[i].nombre}</b>
                </div>
                <div class="form-group col-md-7">
                    <select id="rol${arreglo[i].id}" class="custom-select">
                        <option value="" selected disabled>Rol del usuario</option>
                        <option value="2">Stakeholder</option>
                        <option value="3">Programador</option>
                    </select>
                </div>
                <div class="form-group col-md-2">
                    <button type="button" onclick="eliminarUser(${arreglo[i].id})" class="btn btn-danger"><i class="fas fa-trash-alt"></i></a>
                </div>
            </div>
            `);
        }
    }
}

//Elimina usuario del recuadro derecho
function eliminarUser(id){
    for(i=0;i<arreglo.length;i++){
        if(arreglo[i].id==id)
            indice=i;
    }
    // console.log(indice);
    arreglo.splice(indice, 1);
    cargarUsuarios();
}

function guardarProyecto(){
    nombre=$("#proyectoName").val();
    numRelease=$("#numRelease").val();
    fechaInicio=moment($("#fechaInicio").val()).format("DD/MM/YYYY");
    fechaFin=moment($("#fechaFin").val()).format("DD/MM/YYYY");
    descripcion=$("#descripcion").val();
    
    for(i=0;i<arreglo.length;i++){
        elemento=document.getElementById("rol"+arreglo[i].id);
        if(elemento){
            if(elemento.value != ""){
                arreglo[i].rol = elemento.value;
            }
        }
    }

    json = JSON.stringify(arreglo);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // respuesta = this.responseText;
            // console.log(respuesta);
            respuesta = parseInt(this.responseText,10);
            // respuesta = JSON.parse(this.responseText);
            if(respuesta){
                $("#avisoExito").click();

                $("#search").val("");
                $("#proyectoName").val("");
                $("#numRelease").val("");
                inicio=moment().format("YYYY-MM-DD");
                fin=moment().add('days',7).format("YYYY-MM-DD");

                $("#fechaInicio").val(inicio);
                $("#fechaFin").val(fin);
                
                descripcion=$("#descripcion").val("");
                $("#espacioDetalles").empty();
                
                arreglo=new Array();
                
                getActualUser();
            }else{
                $("#error").attr("class","alert alert-danger");
                $("#proyectoName").attr("class","form-control is-invalid");
            }
        }
    };
    xmlhttp.open("POST", "../logica.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("guardarProyecto=1&nombre="+nombre+"&numRelease="+numRelease+"&fechaInicio="+fechaInicio+"&fechaFin="+fechaFin+"&descripcion="+descripcion+"&json="+json);
}