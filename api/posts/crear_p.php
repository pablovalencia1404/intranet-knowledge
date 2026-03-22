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
$usuarioNombre = trim($datos['usuario_nombre'] ?? $datos['nombre'] ?? 'Usuario');
$tituloHilo = trim($datos['titulo_hilo'] ?? $datos['categoria'] ?? 'General');
$temaPadreId = trim($datos['tema_padre_id'] ?? '');
$tipo = trim($datos['tipo'] ?? 'tema');

if ($contenido === '' || $usuarioId === '') {
    echo json_encode(["status" => "error", "msj" => "El comentario no puede estar vacío"]);
    exit;
}

$post = [
    "usuario_id" => $usuarioId,
    "user" => $usuarioNombre,
    "usuario" => $usuarioNombre,
    "contenido" => $contenido,
    "content" => $contenido,
    "titulo_hilo" => $tituloHilo,
    "categoria" => $tituloHilo,
    "fecha" => gmdate('c'),
    "tipo" => $tipo
];

// Si es una respuesta, agregar el ID del tema padre
if ($temaPadreId !== '') {
    $post["tema_padre_id"] = $temaPadreId;
}

$resultado = $coleccion->insertOne($post);
echo json_encode([
    "status" => "success",
    "msj" => "Post publicado",
    "id" => (string)$resultado->getInsertedId()
]);