<?php 
    session_start();


    require_once dirname(__DIR__) . '/vendor/autoload.php';
    use Dotenv\Dotenv;

    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    // Configuración de la conexión desde variables de entorno
    $host     = $_ENV['DB_HOST'];
    $port     = $_ENV['DB_PORT'];
    $dbname   = $_ENV['DB_NAME']; 
    $user     = $_ENV['DB_USER']; 
    $password = $_ENV['DB_PASSWORD'];   

// Función para conectar con PostgreSQL utilizando PDO de forma segura
function conectarPgSQL() {
    global $host, $port, $dbname, $user, $password;

    // Verificar que las variables de conexión no estén vacías
    if (empty($dbname) || empty($user) || empty($password)) {
        throw new Exception("Faltan las credenciales de la base de datos");
    }

    // Usar try-catch para manejar errores de conexión
    try {
        // Cadena de conexión PDO con SSL (si es necesario)
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require"; // sslmode=require para forzar el uso de SSL

        // Establecer la conexión con PDO
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Modo de error: excepción
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Modo de obtención de resultados por defecto
            PDO::ATTR_EMULATE_PREPARES => false, // Desactivar la emulación de consultas preparadas
            PDO::ATTR_PERSISTENT => true, // Conexión persistente para mejorar el rendimiento
        ]);

        return $pdo;
    } catch (PDOException $e) {
        // Manejar el error de conexión sin exponer información sensible
        error_log("Error de conexión a la base de datos: " . $e->getMessage());
        throw new Exception("No se pudo establecer conexión con la base de datos.");
    }
}

function insertar ($fullname, $email, $fec_nacimiento, $sexo, $pais_name, $estado_name, $ciudad_name, $mac_user, $mac_ap){
    // Llamar a la función para conectar
    $DB_TABLES              = $_ENV['DB_TABLES'];   
    $DB_USER_FULL_NAME      = $_ENV['COLUMNS_USERS_FULL_NAME'];  
    $DB_USER_EMAIL          = $_ENV['COLUMNS_USERS_USER_EMAIL'];    
    $DB_USER_DATE_LOGIN     = $_ENV['COLUMNS_USERS_DATE_LOGIN'];       
    $DB_USER_FEC_NACIMI     = $_ENV['COLUMNS_USERS_FEC_NACIMI']; 
    $DB_USER_SEXO           = $_ENV['COLUMNS_USERS_SEXO']; 
    $DB_USER_PAIS           = $_ENV['COLUMNS_USERS_PAIS']; 
    $DB_USER_ESTADO         = $_ENV['COLUMNS_USERS_ESTADO']; 
    $DB_USER_CIUDAD         = $_ENV['COLUMNS_USERS_CIUDAD']; 
    $DB_USER_MAC_USER       = $_ENV['COLUMNS_USERS_MAC_USER']; 
    $DB_USER_MAC_AP         = $_ENV['COLUMNS_USERS_MAC_AP']; 
    
    try {
        $conexion = conectarPgSQL();

        $sql = "INSERT INTO $DB_TABLES ($DB_USER_FULL_NAME, $DB_USER_EMAIL, $DB_USER_DATE_LOGIN, $DB_USER_FEC_NACIMI, $DB_USER_SEXO, 
        $DB_USER_PAIS, $DB_USER_ESTADO, $DB_USER_CIUDAD, $DB_USER_MAC_USER, $DB_USER_MAC_AP) 
        VALUES (:fullname, :email, CURRENT_TIMESTAMP, :fec_nacimiento, :sexo, :pais_name, :estado_name, :ciudad_name, :mac_user, :mac_ap);";

        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(':fullname', $fullname, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':fec_nacimiento', $fec_nacimiento, PDO::PARAM_STR);
        $stmt->bindValue(':sexo', $sexo, PDO::PARAM_STR);
        $stmt->bindValue(':pais_name', $pais_name, PDO::PARAM_STR);
        $stmt->bindValue(':estado_name', $estado_name, PDO::PARAM_STR);
        $stmt->bindValue(':ciudad_name', $ciudad_name, PDO::PARAM_STR);
        $stmt->bindValue(':mac_user', $mac_user, PDO::PARAM_STR);
        $stmt->bindValue(':mac_ap', $mac_ap, PDO::PARAM_STR);

        $stmt->execute();
        
    } catch (PDOException $e) {
        // Capturar error específico de PDO y mostrar mensaje personalizado
        error_log("Error al insertar datos: " . $e->getMessage(), 3, "errores_bd.log");

        // Opcional: Registrar el error en un archivo de log
        error_log("Error de base de datos: " . $e->getMessage(), 3, "errores_bd.log"); 
    }
    catch (Exception $e) {
        error_log("Ocurrió un error inesperado: " . $e->getMessage());
        
        // Registrar errores generales también
        error_log("Error general: " . $e->getMessage(), 3, "errores_generales.log");
    }
}

?>