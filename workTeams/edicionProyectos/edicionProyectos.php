<?php
$servername = "localhost";
$usuario = "root";
$contrasena = "";
$dbname = "workteams";

$mdb = new PDO("mysql:host=$servername;dbname=$dbname", $usuario, $contrasena);
$mdb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//Cargar las historias de usuario por idProyecto
if(isset($_POST['idProyectoCH'])){
    try {
        $Historias = array();
        $band = false;
        $sql = $mdb->prepare("SELECT * FROM tarea WHERE idProyecto = '".$_POST['idProyectoCH']."' ");
        $sql->execute();
        while($resultado = $sql->fetch(PDO::FETCH_OBJ)){
            $band = true;
            $Historias[] = array(
                'idTarea' => $resultado->idTarea,
                'idProyecto' => $resultado->idProyecto,
                'nombreT' => $resultado->nombreTarea,
                'numT' => $resultado->numTarea,
                'descripcion' => $resultado->descripcion,
                'puntos' => $resultado->puntos,
                'estatus' => $resultado->estado,
                'asignado' => $resultado->asignado
            );
        }
        $mdb = null;

        if($band){
            $myJSON = json_encode($Historias);
            echo $myJSON;
        }else{
            echo "[]";
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Cargar las historias de usuario por idProyecto
if(isset($_POST['idTarea'])){
    try {
        //Se actualiza el estatus de la historia
        $sql = "UPDATE tarea SET estado='2' WHERE idTarea='".$_POST['idTarea']."'";
        $mdb->exec($sql);
        //Se obtiene el id de usuario
        $sql2 = $mdb->prepare("SELECT idUsuario FROM usuario WHERE usuario = '".$_POST['usuario']."' ");
        $sql2->execute();
        $resultado = $sql2->fetch(PDO::FETCH_OBJ);
        if($resultado->idUsuario){
            //Agregamos el usuario a la tarea
            $sql3 = "UPDATE tarea SET asignado='".$resultado->idUsuario."' WHERE idTarea='".$_POST['idTarea']."'";
            $mdb->exec($sql3);
        }
        $mdb = null;
        echo 1;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

if(isset($_POST['idProyectoBU'])){
    try {
        $Usuarios = array();
        $band = false;
        $sql = $mdb->prepare("SELECT u.idUsuario, usuario FROM usuario AS u INNER JOIN participantes AS p ON u.idUsuario=p.idUsuario INNER JOIN proyecto AS pr ON p.idProyecto=pr.idProyecto WHERE pr.idProyecto='".$_POST['idProyectoBU']."' ");
        $sql->execute();
        while($resultado = $sql->fetch(PDO::FETCH_OBJ)){
            $band = true;
            $Usuarios[] = array(
                'idUsuario' => $resultado->idUsuario,
                'usuario' => $resultado->usuario
            );
        }
        $mdb = null;

        if($band){
            $myJSON = json_encode($Usuarios);
            echo $myJSON;
        }else{
            echo "[]";
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Obtener el id del lider del proyecto
if(isset($_POST['asignado'])){
    try {
        //Se obtiene el id de usuario
        $sql2 = $mdb->prepare("SELECT idUsuario FROM participantes WHERE rol='1' AND idProyecto = '".$_POST['idProyecto']."' ");
        $sql2->execute();
        $resultado = $sql2->fetch(PDO::FETCH_OBJ);
        $mdb = null;
        echo $resultado->idUsuario;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Cambiar status de asignada a en curso
if(isset($_POST['idTareaA'])){
    try {
        //Se actualiza el estatus de la historia
        $sql = "UPDATE tarea SET estado='3' WHERE idTarea='".$_POST['idTareaA']."'";
        $mdb->exec($sql);
        $mdb = null;
        echo 1;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Cambiar status de asignada a en curso
if(isset($_POST['idTareaA2'])){
    try {
        //Se actualiza el estatus de la historia
        $sql = "UPDATE tarea SET estado='4' WHERE idTarea='".$_POST['idTareaA2']."'";
        $mdb->exec($sql);
        $mdb = null;
        echo 1;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Cargar los participantes del idProyecto
if(isset($_POST['idProyectoOP'])){
    try {
        $Usuario = array();
        $band = false;
        $sql = $mdb->prepare("SELECT idTarea, u.usuario FROM tarea AS t INNER JOIN usuario AS u ON t.asignado=u.idUsuario WHERE idProyecto = '".$_POST['idProyectoOP']."' ");
        $sql->execute();
        while($resultado = $sql->fetch(PDO::FETCH_OBJ)){
            $band = true;
            $Usuario[] = array(
                'idTarea' => $resultado->idTarea,
                'asignado' => $resultado->usuario
            );
        }
        $mdb = null;

        if($band){
            $myJSON = json_encode($Usuario);
            echo $myJSON;
        }else{
            echo "[]";
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}
?>