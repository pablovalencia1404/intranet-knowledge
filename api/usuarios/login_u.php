<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

session_start();

$db = conectarDB();
$coleccion = $db->Usuarios;

// Capturamos el JSON del Frontend
$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['email']) || !isset($datos['contraseña'])) {
    echo json_encode(["status" => "error", "mensaje" => "Email y contraseña son obligatorios"]);
    exit;
}

// Buscar usuario por email
$usuario = $coleccion->findOne(["email" => $datos['email']]);

if (!$usuario) {
    echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado"]);
    exit;
}

// Verificar contraseña
if (!isset($usuario['contraseña']) || !password_verify($datos['contraseña'], $usuario['contraseña'])) {
    echo json_encode(["status" => "error", "mensaje" => "Contraseña incorrecta"]);
    exit;
}

// Iniciar sesión
$_SESSION['usuario_id'] = (string)$usuario['_id'];
$_SESSION['usuario_nombre'] = $usuario['nombre'];
$_SESSION['usuario_email'] = $usuario['email'];
$_SESSION['usuario_rol'] = $usuario['rol'] ?? 'user';

echo json_encode([
    "status" => "success",
    "mensaje" => "Sesión iniciada",
    "usuario" => [
        "id" => $_SESSION['usuario_id'],
        "nombre" => $_SESSION['usuario_nombre'],
        "email" => $_SESSION['usuario_email'],
        "rol" => $_SESSION['usuario_rol']
    ]
]);
?>
