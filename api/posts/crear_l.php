<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Likes;

$datos = json_decode(file_get_contents("php://input"), true) ?? $_POST;

$postId = trim($datos['post_id'] ?? '');
$usuarioId = trim($datos['usuario_id'] ?? '');
$usuarioNombre = trim($datos['usuario_nombre'] ?? 'Usuario');

if ($postId === '' || $usuarioId === '') {
    echo json_encode(["status" => "error", "msj" => "Datos incompletos"]);
    exit;
}

// Verificar si ya existe un like de este usuario
try {
    $idOid = new MongoDB\BSON\ObjectId($postId);
    $likeExistente = $coleccion->findOne([
        'post_id' => $postId,
        'usuario_id' => $usuarioId
    ]);
    
    if ($likeExistente) {
        // Eliminar like (unlike)
        $coleccion->deleteOne(['_id' => $likeExistente['_id']]);
        echo json_encode([
            "status" => "success",
            "msj" => "Like removido",
            "accion" => "unlike"
        ]);
    } else {
        // Crear nuevo like
        $like = [
            "post_id" => $postId,
            "usuario_id" => $usuarioId,
            "usuario_nombre" => $usuarioNombre,
            "fecha" => gmdate('c')
        ];
        
        $resultado = $coleccion->insertOne($like);
        echo json_encode([
            "status" => "success",
            "msj" => "Like agregado",
            "accion" => "like"
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "msj" => "Error: " . $e->getMessage()]);
}
?>
