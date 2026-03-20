<?php
$origenesPermitidos = [
    'http://localhost:5173',
    'https://intranet-knowledge.servehalflife.com'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $origenesPermitidos, true)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}

header('Vary: Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
require_once __DIR__ . '/vendor/autoload.php';

function conectarDB() {
    try{
        $cliente = new MongoDB\Client("mongodb://mongodb:27017");
        return $cliente->Proyecto_backend;
    } catch (Exception $e) {
        die("Error conectando a la base de datos: " . $e->getMessage());
    }
}
?>