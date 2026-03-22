<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->Comentarios; 

// Verificar si se solicita un tema específico
$idTema = $_GET['id'] ?? $_POST['id'] ?? null;

if ($idTema) {
    // Buscar un tema específico por su ID
    try {
        $idOid = new MongoDB\BSON\ObjectId($idTema);
        $tema = $coleccion->findOne(['_id' => $idOid]);
        
        if ($tema) {
            // Buscar respuestas a este tema
            $respuestas = $coleccion->find(['tema_padre_id' => $idTema])->toArray();
            
            echo json_encode([
                "estado" => "ok", 
                "tema" => $tema,
                "respuestas" => $respuestas
            ]);
        } else {
            echo json_encode(["estado" => "error", "mensaje" => "Tema no encontrado"]);
        }
    } catch (Exception $e) {
        echo json_encode(["estado" => "error", "mensaje" => "ID inválido"]);
    }
} else {
    // Devolver todos los posts ordenados por fecha más reciente
    $todos = $coleccion->find([], ['sort' => ['fecha' => -1, '_id' => -1]])->toArray();
    $temas = array_filter($todos, function($item) {
        return !isset($item['tema_padre_id']) || $item['tema_padre_id'] === null;
    });
    
    echo json_encode(["estado" => "ok", "foro" => array_values($temas)]);
}
?>