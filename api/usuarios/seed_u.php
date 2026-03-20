<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->usuarios;

// Borramos lo que haya para no duplicar en las pruebas
$coleccion->deleteMany([]);

// Insertamos un par de usuarios de ejemplo
$usuarios = [
    ['nombre' => 'Raul Sanchez', 'email' => 'i52saflr@uco.es', 'rol' => 'admin'],
    ['nombre' => 'Manuel Palomares', 'email' => 'i42papim@uco.es', 'rol' => 'user'],
    ['nombre' => 'Pablo Valencia', 'email' => 'pablo@uco.es', 'rol' => 'user']
];

$coleccion->insertMany($usuarios);

echo json_encode(["status" => "ok", "msj" => "¡Base de datos sembrada con 3 usuarios!"]);