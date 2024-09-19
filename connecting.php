<?php

require __DIR__ . '/vendor/autoload.php';
require_once 'db/db_conn.php';
$subida     = 5120;
$bajada     = 10240;

$fullname        = isset($_POST['fullname']) ? $_POST['fullname'] : '';
$email           = isset($_POST['email']) ? $_POST['email'] : '';
$fec_nacimiento  = isset($_POST['fec_nacimiento']) ? $_POST['fec_nacimiento'] : '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener el valor del género seleccionado
    $sexo = isset($_POST['gender']) ? $_POST['gender'] : '';

    // Mostrar el género seleccionado
    if ($sexo == 'M') {
        $sexo = 'M';
    } elseif ($sexo == 'F') {
        $sexo = 'F';
    }
}

$pais            = isset($_POST['pais']) ? $_POST['pais'] : '';
$estado          = isset($_POST['estado']) ? $_POST['estado'] : '';
$ciudad          = isset($_POST['ciudad']) ? $_POST['ciudad'] : '';
$mac_user        = isset($_SESSION['id']) ? $_SESSION['id'] : '';
$mac_ap          = isset($_SESSION['ap']) ? $_SESSION['ap'] : '';



$duration = 480; //Duration of authorization in minutes
$site_id = 'mnvfpsky'; //Site ID found in URL (https://1.1.1.1:8443/manage/site/<site_ID>/devices/1/50)

$controlleruser     = 'pcorvalan'; // the user name for access to the UniFi Controller
$controllerpassword = 'P4bl0N3rud4'; // the password for access to the UniFi Controller
$controllerurl      = 'https://unifi.vive.com.py:8443'; // full url to the UniFi Controller, eg. 'https://22.22.11.11:8443'
$controllerversion  = '8.2.93'; // the version of the Controller software, eg. '4.6.6' (must be at least 4.0.0)
$debug = false;

$unifi_connection = new UniFi_API\Client($controlleruser, $controllerpassword, $controllerurl, $site_id, $controllerversion);
$set_debug_mode   = $unifi_connection->set_debug($debug);
$loginresults     = $unifi_connection->login();

$auth_result = $unifi_connection->authorize_guest($mac_user, $duration, $up = $subida, $down = $bajada, $MBytes = null, $mac_ap);

//User will be authorized at this point; their name and email address can be saved to some database now

insertar($fullname, $email, $fec_nacimiento, $sexo, $pais, $estado, $ciudad, $mac_user, $mac_ap);

?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>WiFi Shopping Paris</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- <meta http-equiv="refresh" content="0;url=https:/www.shoppingparis.com.py/" /> -->
</head>
    <!-- <script>
        window.location.replace("https:/www.shoppingparis.com.py/");
    </script> -->
</html>