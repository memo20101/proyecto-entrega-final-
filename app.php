<?php // home de la aplicación

session_name("app"); session_start();

$Prog = $_GET['Acc'];
if($Prog == "Leer" )     { echo Leer(); return;}
if($Prog == "Editar" )   { echo Editar($_GET['Solicitud']); return;}
if($Prog == "Eliminar" ) { echo Eliminar($_GET['Solicitud']); return;}
if($Prog == "Agregar")   { echo Agregar(json_decode(file_get_contents('php://input'), true)); }
if($Prog == "Modificar") { echo Modificar(json_decode(file_get_contents('php://input'), true)); }
if($Prog == "EnvCorreo") { echo EnviarCorreo(json_decode(file_get_contents('php://input'), true)); }

// Conexion a BD
function Conexion()
{ $conex =mysqli_connect("localhost","JuanDavid","C1001173480=","Poli");
  return $conex;
}

// Leer solicitudes de la app
function Leer()
{ $array=array();
  $inc=Conexion();
  if($inc)
  { $consulta="SELECT * FROM Solicitud";
    $resultado= mysqli_query($inc,$consulta);
    if($resultado)
    { while($row = mysqli_fetch_assoc($resultado))
        array_push($array,$row);
    }
  }
  return json_encode($array);
}

// Editar solicitudes de la app
function Editar($xSol)
{ $array=array();
  $inc=Conexion();
  if($inc)
  { $consulta="SELECT * FROM Solicitud WHERE NumSol='$xSol'";
    $resultado= mysqli_query($inc,$consulta);
    if($resultado) { $array = mysqli_fetch_assoc($resultado);}
  }
  return json_encode($array);
}

// Modificar Solicitud
function Modificar($Arr)
{ $Fecha   = $Arr[0];
  $NumSol  = $Arr[1];
  $TipDoc  = $Arr[2];
  $Doc     = $Arr[3];
  $Nombre  = $Arr[4];
  $DescSol = $Arr[5];

  $inc=Conexion();
  if($inc)
  { $consulta = "UPDATE Solicitud SET Fecha='$Fecha',TipDoc='$TipDoc',Doc='$Doc',Nombre='$Nombre',DescSol='$DescSol' WHERE NumSol='$NumSol'";
    $resultado= mysqli_query($inc,$consulta);
    if(!$resultado) return "Error al modificar la solicitud";
  }
  return "";
}

// Crear Solicitud
function Agregar($Arr)
{ $Fecha   = $Arr[0];
  $NumSol  = $Arr[1];
  $TipDoc  = $Arr[2];
  $Doc     = $Arr[3];
  $Nombre  = $Arr[4];
  $DescSol = $Arr[5];

  $inc=Conexion();
  if($inc)
  { $consulta = "INSERT INTO Solicitud (NumSol,Fecha,TipDoc,Doc,Nombre,DescSol) VALUES ('$NumSol','$Fecha','$TipDoc','$Doc','$Nombre','$DescSol')";
    $resultado= mysqli_query($inc,$consulta);
    if(!$resultado) return "Error al agregar la solicitud";
  }
  return "";
}

//Eliminar solicitud
function Eliminar($xSol)
{ $inc=Conexion();
  if($inc)
  { $consulta = "DELETE FROM Solicitud WHERE NumSol='$xSol'";
    $resultado= mysqli_query($inc,$consulta);
    if(!$resultado) return "Error al eliminar la solicitud";
  }
  return "";
}

//Enviar Correo
function EnviarCorreo($Arr)
{   $xCorreo      = $Arr[0];
    $xAsunto      = $Arr[1];
    $xDescripcion = $Arr[2];

    require_once("../PHPMailer/PHPMailerAutoload.php");
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->setFrom("jugonzalez38@poligran.edu.co", "Soporte");
    $mail->Username = 'jugonzalez38@poligran.edu.co';
    $mail->Password = 'Neymarjr11@';
    $mail->Host = 'smtp.office365.com';
    $mail->SMTPAuth = true;  
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    $mail->addAddress($xCorreo, utf8_decode('Correo de soporte'));
    $mail->Subject = $xAsunto;
    $body  = "Señores <br><b> Departamento de Soporte.</b><br><br>";  
    $body .= $xDescripcion;
    $body .= "<br>Saludos.<br>Atentamente,<br><b>Usuario</b><br>";  

    $mail->Body = $body;  

    if(!$mail->Send()){return "El Correo $xCorreo no pudo ser enviado... Intente Nuevamente...";}
    $mail->clearAddresses();
    $mail->clearAttachments();

    return "";
  }


?>
