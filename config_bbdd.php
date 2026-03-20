<?php
header("Access-Control-Allow-Origin: http://localhost:5173");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");

header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
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