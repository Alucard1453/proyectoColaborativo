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
        //Agregar Tarea al release
        $sql5 = $mdb->prepare("SELECT idRelease FROM `release` WHERE idProyecto = '".$_POST['idProyectoR']."' AND estado='3'");
        $sql5->execute();
        $resultado2 = $sql5->fetch(PDO::FETCH_OBJ);
        $sql4 = "INSERT INTO tareasrelease (idRelease, idTarea)
        VALUES ('".$resultado2->idRelease."' , '".$_POST['idTarea']."')";
        $mdb->exec($sql4);

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
        //Se obtiene el id de usuario
        $sql2 = $mdb->prepare("SELECT u.usuario FROM usuario as u INNER JOIN tarea as t ON u.idUsuario=t.asignado WHERE t.idProyecto='".$_POST['idProyectoOP']."' AND t.idTarea='".$_POST['idTareaOP']."'");
        $sql2->execute();
        $resultado = $sql2->fetch(PDO::FETCH_OBJ);
        $mdb = null;
        echo $resultado->usuario;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}
 
if(isset($_POST['idProyectoAR'])){
    try {
        //Se actualiza el estatus de la historia
        // $sql2 = "UPDATE `release` SET estado='4' WHERE idTarea='".$_POST['idTareaA2']."'";
        // $mdb->exec($sql2);
        $sql = "INSERT INTO `release` (idProyecto, fechaInicio, fechaFin, estado, numHistorias, totalH)
        VALUES ( '".$_POST['idProyectoAR']."' , '".$_POST['fechaI']."', '".$_POST['fechaF']."', '3' ,'".$_POST['NumH']."', '0')";
        $mdb->exec($sql);
        $mdb = null;
        echo 1;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Recuperar info del release
if(isset($_POST['idProyectoVR'])){
    try {
        $Release = array();
        $band = false;
        $sql = $mdb->prepare("SELECT idRelease, fechaInicio, fechaFin, numHistorias, totalH FROM `release` WHERE idProyecto = '".$_POST['idProyectoVR']."' AND estado='3' ");
        $sql->execute();
        while($resultado = $sql->fetch(PDO::FETCH_OBJ)){
            $band = true;
            $Release[] = array(
                'idRelease' => $resultado->idRelease,
                'fIni' => $resultado->fechaInicio,
                'fFin' => $resultado->fechaFin,
                'numH' => $resultado->numHistorias,
                'totalH' => $resultado->totalH
            );
        }
        $mdb = null;

        if($band){
            $myJSON = json_encode($Release);
            echo $myJSON;
        }else{
            echo "[]";
        }
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Cambiar status de asignada a en curso
if(isset($_POST['idRelease'])){
    try {
        //Se actualiza el estatus de la historia
        $sql = "UPDATE `release` SET estado='4' WHERE idRelease='".$_POST['idRelease']."'";
        $mdb->exec($sql);
        $mdb = null;
        echo 1;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Definir encabezado
if(isset($_POST['idProyectoE'])){
    try {
        //Se obtiene el num de historias
        $sql2 = $mdb->prepare("SELECT COUNT(idProyecto) AS numR FROM `release` WHERE idProyecto='".$_POST['idProyectoE']."' ");
        $sql2->execute();
        $resultado = $sql2->fetch(PDO::FETCH_OBJ);
        //Se obtine el total de release
        $sql = $mdb->prepare("SELECT numRelease FROM proyecto WHERE idProyecto='".$_POST['idProyectoE']."' ");
        $sql->execute();
        $resultado2 = $sql->fetch(PDO::FETCH_OBJ);
        //Creamos Objeto
        $Release = array();
        $Release[] = array(
            'numActual' => $resultado->numR,
            'numFinal' => $resultado2->numRelease
        );
        $mdb = null;

        $myJSON = json_encode($Release);
        echo $myJSON;
    }
    catch(PDOException $e){
        echo $sql . "<br>" . $e->getMessage();
    }
}

//Retornar fechaFinal
if(isset($_POST['idProyectoF'])){
        //Se retorna la fecha final
        $sql2 = $mdb->prepare("SELECT fechaFin FROM `release` WHERE idProyecto='".$_POST['idProyectoF']."' AND estado='4' ORDER BY idRelease DESC LIMIT 1");
        $sql2->execute();
        $resultado = $sql2->fetch(PDO::FETCH_OBJ);
        $mdb = null;
        if(empty($resultado->fechaFin)){
            echo "";
        }else{
            echo $resultado->fechaFin;
        }
}
?>