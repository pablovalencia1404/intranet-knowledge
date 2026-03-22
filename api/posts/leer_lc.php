<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccionLikes = $db->Likes;
$coleccionComentarios = $db->PostComentarios;

$postId = $_GET['post_id'] ?? $_POST['post_id'] ?? '';

if ($postId === '') {
    echo json_encode(["status" => "error", "msj" => "post_id requerido"]);
    exit;
}

try {
    // Obtener likes de este post
    $likes = $coleccionLikes->find(['post_id' => $postId])->toArray();
    
    // Obtener comentarios de este post
    $comentarios = $coleccionComentarios->find(['post_id' => $postId])->toArray();
    
    echo json_encode([
        "status" => "success",
        "likes" => $likes,
        "comentarios" => $comentarios,
        "total_likes" => count($likes),
        "total_comentarios" => count($comentarios)
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "msj" => "Error: " . $e->getMessage()]);
}
?>
