<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Documentos;

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['titulo']) || !isset($datos['url'])) {
    echo json_encode(["status" => "error", "msj" => "Faltan datos del documento"]);
    exit;
}

$doc = [
    "titulo" => $datos['titulo'],
    "url" => $datos['url'],
    "categoria" => $datos['categoria'] ?? 'general',
    "subido_por" => $datos['usuario_id']
];

$resultado = $coleccion->insertOne($doc);
echo json_encode(["status" => "success", "msj" => "Documento registrado"]);