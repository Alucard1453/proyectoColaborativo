<?php
$servername = "localhost";
$usuario = "root";
$contrasena = "";
$dbname = "workteams";

$mdb = new PDO("mysql:host=$servername;dbname=$dbname", $usuario, $contrasena);
$mdb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

session_start();

//Registro usuario
if(isset($_POST['registroUser'])){
    try {
        $sql = $mdb->prepare("SELECT usuario FROM usuario WHERE usuario = '".$_POST['usuario']."' ");
        $sql->execute();
        // use exec() because no results are returned
        $resultado = $sql->fetch(PDO::FETCH_OBJ);
        if($resultado){
            $mdb = null;
            echo 0;
        }else{
            $sql = "INSERT INTO usuario (nombre, aPaterno,aMaterno, usuario, contrasena)
            VALUES ( '".$_POST['nombre']."' , '".$_POST['paterno']."', '".$_POST['materno']."', '".$_POST['usuario']."', '".$_POST['contra']."' )";
            // use exec() because no results are returned
            $mdb->exec($sql);

            $sql = $mdb->prepare("SELECT idUsuario FROM usuario WHERE usuario = '".$_POST['usuario']."' ");
            $sql->execute();
            // use exec() because no results are returned
            $resultado = $sql->fetch(PDO::FETCH_OBJ);

            $_SESSION['idUsuario']=$resultado->idUsuario;
            $_SESSION['usuario']=$_POST['usuario'];

            $mdb = null;
            
            echo 1;
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Login usuario
if(isset($_POST['login'])){
    try {
        $sql = $mdb->prepare("SELECT * FROM usuario WHERE usuario = '".$_POST['usuario']."' ");
        $sql->execute();
        // use exec() because no results are returned
        $resultado = $sql->fetch(PDO::FETCH_OBJ);
        if($resultado->contrasena == $_POST['contra']){
            $_SESSION['idUsuario']=$resultado->idUsuario;
            $_SESSION['usuario']=$resultado->usuario;

            $mdb = null;
            echo 1;
        }else{
            $mdb = null;
            echo 0;
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Se recuperan los proyectos del usuario
if(isset($_POST['obtenProyectosUser'])){
    try {
        $Obtener = array();
        $band = false;
        $sql = $mdb->prepare("SELECT * FROM proyecto WHERE propietario = '".$_SESSION['idUsuario']."' ");
        $sql->execute();
        while($resultado = $sql->fetch(PDO::FETCH_OBJ)){
            $band = true;
            $Obtener[] = array(
                'idProyecto' => $resultado->idProyecto,
                'propietario' => $resultado->propietario,
                'nombre' => $resultado->nombre,
                'descripcion' => $resultado->descripcion,
                'fechaInicio' => $resultado->fechaInicio,
                'fechaFin' => $resultado->fechaFin,
                'numRelease' => $resultado->numRelease,
                'estado' => $resultado->estado
            );
        }
        $mdb = null;

        if($band){
            $myJSON = json_encode($Obtener);
            echo $myJSON;
        }else{
            echo "[]";
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}


//Busqueda de usuario por username util para autocompletado
if(isset($_POST['searchUsuario'])){
    try {
        if(isset($_POST['actual'])){
            $sql = $mdb->prepare("SELECT idUsuario, usuario FROM usuario WHERE idUsuario = '".$_SESSION['idUsuario']."' ");
        }else{
            $search=$_POST['busca'];
            $sql = $mdb->prepare("SELECT idUsuario, usuario FROM usuario WHERE usuario LIKE '$search%' ");
        }
        $sql->execute();
        $band = false;
        while($resultado = $sql->fetch(PDO::FETCH_OBJ)){
            $band = true;
            $Obtener[] = array(
                'idUsuario' => $resultado->idUsuario,
                'userName' => $resultado->usuario
            );
        }
        $mdb = null;

        if($band){
            $myJSON = json_encode($Obtener);
            echo $myJSON;
        }else{
            echo "[]";
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Guardado de proyecto junto con integrantes
if(isset($_POST['guardarProyecto'])){
    try {
        $sql = $mdb->prepare("SELECT nombre FROM proyecto WHERE propietario = '".$_SESSION['idUsuario']."'
        AND nombre =  '".$_POST['nombre']."' ");
        $sql->execute();

        $resultado = $sql->fetch(PDO::FETCH_OBJ);
        if($resultado){
            $mdb = null;
            echo 0;
        }else{
            $sql = "INSERT INTO proyecto (propietario, nombre, descripcion, fechaInicio, fechaFin, numRelease, estado)
            VALUES ( '".$_SESSION['idUsuario']."' , '".$_POST['nombre']."', '".$_POST['descripcion']."',
             '".$_POST['fechaInicio']."', '".$_POST['fechaFin']."', '".$_POST['numRelease']."', 1 )";
            $mdb->exec($sql);

            $sql = $mdb->prepare("SELECT idProyecto FROM proyecto WHERE propietario = '".$_SESSION['idUsuario']."'
            AND nombre =  '".$_POST['nombre']."' ");
            $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_OBJ);
            $idProyecto=$resultado->idProyecto;

            $myJson = json_decode($_POST['json'],true);
            foreach ($myJson as $value) {
                $sql = "INSERT INTO participantes (idProyecto, idUsuario, rol)
                VALUES ( '".$idProyecto."' , '".$value['id']."', '".$value['rol']."')";
                $mdb->exec($sql);
            }
            $mdb = null;
            echo 1;
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Cerrar la sesion actual
if(isset($_POST['cerrarSesion'])){
    // Destruir todas las variables de sesión.
    $_SESSION = array();
    // Finalmente, destruir la sesión.
    session_destroy();
}

?>