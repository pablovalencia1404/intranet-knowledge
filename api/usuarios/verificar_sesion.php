<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

session_start();

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        "status" => "no_autenticado",
        "usuario" => null
    ]);
    exit;
}

echo json_encode([
    "status" => "autenticado",
    "usuario" => [
        "id" => $_SESSION['usuario_id'],
        "nombre" => $_SESSION['usuario_nombre'],
        "email" => $_SESSION['usuario_email'],
        "rol" => $_SESSION['usuario_rol']
    ]
]);
?>
