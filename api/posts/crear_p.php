<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Comentarios;

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$datos = [];

if (stripos($contentType, 'application/json') !== false) {
    $datos = json_decode(file_get_contents("php://input"), true) ?? [];
} else {
    $datos = $_POST;
}

$contenido = trim($datos['contenido'] ?? $datos['content'] ?? '');
$usuarioId = trim($datos['usuario_id'] ?? $datos['user'] ?? $datos['usuario'] ?? '');
$tituloHilo = trim($datos['titulo_hilo'] ?? $datos['categoria'] ?? 'General');

if ($contenido === '' || $usuarioId === '') {
    echo json_encode(["status" => "error", "msj" => "El comentario no puede estar vacío"]);
    exit;
}

$post = [
    "usuario_id" => $usuarioId,
    "user" => $usuarioId,
    "contenido" => $contenido,
    "content" => $contenido,
    "titulo_hilo" => $tituloHilo,
    "categoria" => $tituloHilo,
    "fecha" => gmdate('c')
];

$resultado = $coleccion->insertOne($post);
echo json_encode([
    "status" => "success",
    "msj" => "Post publicado",
    "id" => (string)$resultado->getInsertedId()
]);