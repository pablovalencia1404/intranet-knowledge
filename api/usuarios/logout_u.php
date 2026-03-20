<?php
header("Content-Type: application/json");

session_start();

// Destruir sesión
session_destroy();

echo json_encode([
    "status" => "success",
    "mensaje" => "Sesión cerrada"
]);
?>
