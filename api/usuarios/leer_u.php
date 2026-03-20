<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->Usuarios;

// Buscqueda de usuarios
$usuarios = $coleccion->find()->toArray();

// Respuesta en formato JSON
echo json_encode([
    "status" => "ok",
    "data" => $usuarios
]);
?>