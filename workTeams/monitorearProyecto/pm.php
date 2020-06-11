<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

$servername = "localhost";
$usuario = "root";
$contrasena = "";
$dbname = "workteams";

$id = 3;
    $k = 0;
    $mysqli = new mysqli($servername,$usuario,$contrasena,$dbname);

$sql = "SELECT idRelease FROM `release` WHERE idProyecto=$id";
            $result = $mysqli->query($sql);            
            if($result->num_rows > 0)
            {
                $arrayReportes = array();

                while($row = $result->fetch_assoc())
                    $arrayReportes[] = $row; 

             //   echo json_encode($arrayReportes);    
            }
            else
              echo -1;

     //     echo strval(sizeof($arrayReportes));

    for($i = 0; $i<sizeof($arrayReportes); $i++)
    {
      //  echo $i;    
         $id = $arrayReportes[$i]["idRelease"];

    $mysqli = new mysqli($servername,$usuario,$contrasena,$dbname);

    $sql = "SELECT COUNT(idTarea) FROM tareasrelease WHERE idRelease=$id";
            $result = $mysqli->query($sql);            
            if($result->num_rows > 0)
            {
                $arrayReportes2 = array();

                while($row = $result->fetch_assoc())
                    $arrayReportes2[] = $row; 

                $totalTareas = $arrayReportes2[0]["COUNT(idTarea)"];  
            }

    $sql = "SELECT COUNT(tareasrelease.idTarea) FROM tareasrelease INNER JOIN tarea on tarea.idTarea= tareasrelease.idTarea WHERE estado=4 AND idRelease=$id";
            $result = $mysqli->query($sql);            
            if($result->num_rows > 0)
            {
                $arrayReportes3 = array();

                while($row = $result->fetch_assoc())
                    $arrayReportes3[] = $row; 

                $terminadas = $arrayReportes3[0]["COUNT(tareasrelease.idTarea)"]; 
              //  echo $terminadas; 
            }
            $porcentajes[$k] = ($terminadas*100)/$totalTareas;
            $k = $k + 1;
          //  echo strval(($terminadas*100)/$totalTareas);

    }

    echo json_encode($porcentajes);

?>