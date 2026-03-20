<?php
header("Content-Type: application/json");
require_once '../../config.php';

$db = conectarDB();
$coleccion = $db->usuarios;

// Buscqueda de usuarios
$usuarios = $coleccion->find()->toArray();

// Respuesta en formato JSON
echo json_encode([
    "status" => "ok",
    "data" => $usuarios
]);
?>