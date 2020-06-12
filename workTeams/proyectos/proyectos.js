$(document).ready(function (){
    validarsesion();
    recuperaProyectos();

    //Funcion para inicializar boton de menu izquierdo
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

//Valida si hay una sesion iniciada
function validarsesion(){
    if(!localStorage.getItem("Logueado")){
        location.href ="../login/";
    }
}

function recuperaProyectos(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            respuesta = JSON.parse(this.responseText);
            // respuesta = this.responseText;
            // console.log(respuesta);
            for(i=0;i<respuesta.length;i++){
                $("#proyectos").append(`
                                        <div class="col-sm-6 tarjeta">
                                            <div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title">${respuesta[i].nombre}</h5>
                                                    <h6 class="card-subtitle mb-2 text-muted small">Líder: ${respuesta[i].propietario}</h6>
                                                    <p class="card-text">${respuesta[i].descripcion}</p>
                                                    <button type="button" onclick="seleccionarProyecto(${respuesta[i].idProyecto})" class="btn btn-primary">Seleccionar</a>
                                                </div>
                                            </div>
                                        </div>
                                        `);
            }
        }
    };
    xmlhttp.open("POST", "../logica.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("obtenProyectosParticipo=1");
}

function seleccionarProyecto(num){
    console.log(num);
    localStorage.setItem("proyectoSeleccionado",num);
    location.href="../edicionProyectos/edicionProyectos.html";
}

//Cierra la sesion actual
function cerrarSesion(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            localStorage.clear();
            validarsesion();
        }
    };
    xmlhttp.open("POST", "../logica.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("cerrarSesion=1");
}