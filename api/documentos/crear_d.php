<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Documentos;

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$datos = [];

if (stripos($contentType, 'application/json') !== false) {
    $datos = json_decode(file_get_contents("php://input"), true) ?? [];
} else {
    $datos = $_POST;
}

$archivoNombre = '';
if (isset($_FILES['archivo']) && isset($_FILES['archivo']['name'])) {
    $archivoNombre = trim($_FILES['archivo']['name']);
}

$titulo = trim($datos['titulo'] ?? $archivoNombre);
$url = trim($datos['url'] ?? '');
$usuarioId = trim($datos['usuario_id'] ?? $datos['usuario'] ?? 'anonimo');
$categoria = trim($datos['categoria'] ?? 'general');

if ($titulo === '') {
    echo json_encode(["status" => "error", "msj" => "Faltan datos del documento"]);
    exit;
}

$doc = [
    "titulo" => $titulo,
    "nombre" => $titulo,
    "url" => $url,
    "categoria" => $categoria,
    "subido_por" => $usuarioId,
    "fecha_subida" => gmdate('c')
];

$resultado = $coleccion->insertOne($doc);
echo json_encode([
    "status" => "success",
    "msj" => "Documento registrado",
    "id" => (string)$resultado->getInsertedId()
]);