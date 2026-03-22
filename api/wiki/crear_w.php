<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->Wiki;

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['biblioteca']) || !is_array($input['biblioteca'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "mensaje" => "Datos inválidos: se requiere campo 'biblioteca'"
        ]);
        exit;
    }

    // Eliminar documentos antiguos
    $coleccion->deleteMany([]);

    // Insertar nuevos documentos
    $coleccion->insertOne([
        "biblioteca" => $input['biblioteca'],
        "actualizado_en" => new MongoDB\BSON\UTCDateTime(time() * 1000),
        "versión" => "1.0"
    ]);

    echo json_encode([
        "status" => "ok",
        "mensaje" => "Wiki actualizada correctamente"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al guardar la wiki: " . $e->getMessage()
    ]);
}
