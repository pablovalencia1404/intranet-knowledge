<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';
require_once __DIR__ . '/session_config.php';

iniciarSesionSegura();

if (sesionExpiradaPorInactividad(1800)) {
    echo json_encode([
        "status" => "expirada",
        "usuario" => null,
        "mensaje" => "Sesión expirada por inactividad"
    ]);
    exit;
}

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
