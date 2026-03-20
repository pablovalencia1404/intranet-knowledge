<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Usuarios;

// Capturamos el JSON del Frontend
$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['nombre']) || !isset($datos['email']) || !isset($datos['contraseña'])) {
    echo json_encode(["status" => "error", "msj" => "Nombre, email y contraseña son obligatorios"]);
    exit;
}

// Verificar que el email no exista
$usuarioExistente = $coleccion->findOne(["email" => $datos['email']]);
if ($usuarioExistente) {
    echo json_encode(["status" => "error", "msj" => "El email ya está registrado"]);
    exit;
}

// Hashear contraseña
$contraseña_hasheada = password_hash($datos['contraseña'], PASSWORD_BCRYPT);

$nuevo = [
    "nombre" => $datos['nombre'],
    "email" => $datos['email'],
    "contraseña" => $contraseña_hasheada,
    "rol" => $datos['rol'] ?? 'user',
    "fecha_creacion" => new MongoDB\BSON\UTCDateTime()
];

$resultado = $coleccion->insertOne($nuevo);
echo json_encode(["status" => "success", "id" => $resultado->getInsertedId()]);