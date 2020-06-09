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


?>