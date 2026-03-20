<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Usuarios;

// Capturamos el JSON del Frontend
$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['nombre']) || !isset($datos['email'])) {
    echo json_encode(["status" => "error", "msj" => "Nombre y email son obligatorios"]);
    exit;
}

$nuevo = [
    "nombre" => $datos['nombre'],
    "email" => $datos['email'],
    "rol" => $datos['rol'] ?? 'user',
    "fecha_creacion" => new MongoDB\BSON\UTCDateTime()
];

$resultado = $coleccion->insertOne($nuevo);
echo json_encode(["status" => "success", "id" => $resultado->getInsertedId()]);