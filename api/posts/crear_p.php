<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Comentarios;

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['contenido']) || !isset($datos['usuario_id'])) {
    echo json_encode(["status" => "error", "msj" => "El comentario no puede estar vacío"]);
    exit;
}

$post = [
    "usuario_id" => $datos['usuario_id'],
    "contenido" => $datos['contenido'],
    "titulo_hilo" => $datos['titulo_hilo'] ?? 'Sin título',
    "fecha" => new MongoDB\BSON\UTCDateTime()
];

$resultado = $coleccion->insertOne($post);
echo json_encode(["status" => "success", "msj" => "Post publicado"]);