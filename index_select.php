<?php

session_start();

//Get the MAC addresses of AP and user

$_SESSION["id"] = $_GET["id"];
$_SESSION["ap"] = $_GET["ap"];

?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>WiFi Shopping Paris</title>
	<link rel="icon" type="image/x-icon" href="./assets/img/favicon-256x256.png">
	<link rel="stylesheet" href="estilos_select.css">
</head>

<body>

	<section class="container">
		<div class="img-header">
			<img src="./assets/img/SP_LOGO02.png" alt="Registro WiFi Shopping Paris">
			<h2>WiFi Shopping Paris</h2>
		</div>
		<form method="post" action="connecting.php" class="form">
			<div class="input-box">
				<label for="fullname">Nombre y Apellido</label>
				<input type="text" id="fullname" name="fullname" placeholder="Nombre y Apellido" required  />
			</div>
			<div class="input-box">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" placeholder="Email" required  />
			</div>
			<div class="column">
				<div class="input-box">
					<label for="fec_nacimiento">Fecha Nacimiento</label>
					<input type="date" id="fec_nacimiento" name="fec_nacimiento" placeholder="Fecha Nacimiento" required />
				</div>
			</div>
			<div class="gender-box">
				<h3>Sexo</h3>
				<div class="gender-option">
					<div class="gender">
						<input type="radio" id="check-male" name="gender" value="M" checked />
						<label for="check-male">Masculino</label>
					</div>
					<div class="gender">
						<input type="radio" id="check-female" name="gender" value="F" />
						<label for="check-female">Femenino</label>
					</div>
				</div>
			</div>
			<div class="select-box">
				<div class="pais">
					<label for="pais">País</label>
					<select name="pais_id" id="pais" data-label="país" require>
						<option value="">Seleccionar País</option>
					</select>
					<input type="hidden" name="pais_name" id="pais_name" />
				</div>
				<div class="estado">
					<label for="estado">Estado</label>
					<select name="estado_id" id="estado" data-label="estado" require>
					</select>
					<input type="hidden" name="estado_name" id="estado_name" />
				</div>
				<div class="ciudad">
					<label for="ciudad">Ciudad</label>
					<select name="ciudad_id" id="ciudad" data-label="ciudad" require>
					</select>
					<input type="hidden" name="ciudad_name" id="ciudad_name" />
				</div>
			</div>
			
			<!-- Modal -->
			<div class="container-policy">
				<label for="check-policy">Terminos de uso del WiFi Shopping Paris</label>
				<input type="checkbox" id="check-policy" class="check-policy" name="check-policy" required />
			</div>

			<div id="policyModal" class="modal">
				<div class="modal-content">
					<!-- <span class="close-btn">&times;</span> -->
					<p>
						El uso de la red WiFi del Shopping Paris implica que declaras conocer y aceptar los términos de uso de la misma.
						Al acceder y utilizar la red WiFi del Shopping Paris, declaras que has leído, entendido y aceptas los términos y condiciones para su utilización. Si no estás de acuerdo con esta norma, no debes acceder a este servicio.

						La red WiFi está destinada únicamente para el uso exclusivo de los usuarios que se encuentren en las instalaciones del Shopping Paris en la Av. Dr. Luis Maria Argaña, Cd. del Este 100135.

						Aceptas y reconoces que hay riesgos potenciales a través de un servicio WiFi. 
						Debe tener cuidado al transmitir datos como: número de tarjeta de crédito, contraseñas u otra información personal sensible a través de redes WiFi. 
						El Shopping Paris no puede y no garantiza la privacidad y seguridad de sus datos y de las comunicaciones al utilizar este servicio.

						El Shopping Paris, no garantiza el nivel de funcionamiento de la red WiFi. 
						El servicio puede no estar disponible o ser limitado en cualquier momento y por cualquier motivo, incluyendo emergencias, sobrecarga de conexiones, 
						fallo del enlace, problemas en equipos de red, interferencias o fuerza de la señal. 
						El Shopping Paris, no se responsabiliza por datos, mensajes o páginas perdidas, no guardadas o retrasos por interrupciones o problemas de rendimiento 
						con el servicio.

						El Shopping Paris, puede establecer límites de uso, suspender el servicio o bloquear ciertos comportamientos, 
						acceso a ciertos servicios o dominios para proteger la red del Shopping Paris de fraudes o actividades que atenten contra las leyes nacionales.

						Tanto El Shopping Paris como los administradores de este servicio pondrán en conocimiento de las autoridades competentes, 
						de manera inmediata, cualquier uso ilegal o fraudulento de la red.
					</p>
					<h4>No se podrá utilizar la red WiFi con los siguientes fines:</h4>
					<p>
						<li>Transmisión de contenido fraudulento, difamatorio, obsceno, ofensivo o de vandalismo, insultante o acosador, sea sual sea su formato.</li>
						<li>Interceptar, recopilar o almacenar datos sobre terceros sin su conocimiento o consentimiento.</li>
						<li>Escanear o probar la vulnerabilidad de equipos, sistemas o segmentos de esta red. Este acto será considerado un ataque informático y será puesto en conocimiento de las autoridades legales competentes.</li>
						<li>Enviar mensajes no solicitados (spam), virus, o realizar ataques informáticos internos o externos a la red del Shopping Paris.</li>
						<li>Obtener acceso no autorizado a equipos, sistemas o programas tanto al interior de la red del Shopping Paris como fuera de ella.</li>
						<li>Obtener, manipular y compartir cualquier archivo sin tener los derechos de propiedad intelectual.</li>
						<li>Transmitir, copiar y/o descargar cualquier material que viole cualquier ley. Esto incluye entre otros: material con derecho de autor, pornografía infantil, material amenazante u obsceno, o material protegido por secreto comercial o patentes.</li>
						<li>Dañar equipos, sistemas informáticos o redes y/o perturbar el normal funcionamiento de esta u otras redes. Ser utilizada para crear y/o la infectar con virus informático o malware en la red.</li>
						<li>Fines de lucro y actividades comerciales de cualquier tipo ya sean legales o ilegales.</li>
						<li>Cualquier otro uso malicioso.</li>
					</p>
					
					<div class="modal-buttons">
						<button id="cancel-btn" class="modal-btn">Cancelar</button>
						<button id="accept-btn" class="modal-btn">Aceptar</button>
					</div>
				</div>
			</div>
			<input type="submit" name="button" id="button" class="button" value="Acceso"> 
		</form>


	</section>
	<script defer src="js/index.js"></script>
</body>

</html>