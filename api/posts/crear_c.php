<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->PostComentarios;

$datos = json_decode(file_get_contents("php://input"), true) ?? $_POST;

$postId = trim($datos['post_id'] ?? '');
$usuarioId = trim($datos['usuario_id'] ?? '');
$usuarioNombre = trim($datos['usuario_nombre'] ?? 'Usuario');
$contenido = trim($datos['contenido'] ?? $datos['comentario'] ?? '');

if ($postId === '' || $usuarioId === '' || $contenido === '') {
    echo json_encode(["status" => "error", "msj" => "Datos incompletos"]);
    exit;
}

try {
    $comentario = [
        "post_id" => $postId,
        "usuario_id" => $usuarioId,
        "usuario_nombre" => $usuarioNombre,
        "contenido" => $contenido,
        "fecha" => gmdate('c')
    ];
    
    $resultado = $coleccion->insertOne($comentario);
    echo json_encode([
        "status" => "success",
        "msj" => "Comentario agregado",
        "id" => (string)$resultado->getInsertedId()
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "msj" => "Error: " . $e->getMessage()]);
}
?>
