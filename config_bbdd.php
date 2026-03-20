<?php
require_once 'vendor/autoload.php';

function conectarDB() {
    try{
        $cliente = new MongoDB\Client("mongodb://mongodb:27017");
        return $cliente->intranet_knowledge;
    } catch (Exception $e) {
        die("Error conectando a la base de datos: " . $e->getMessage());
    }
}
?>