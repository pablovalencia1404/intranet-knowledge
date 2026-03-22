<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

$db = conectarDB();
$coleccion = $db->Documentos;

// Crear directorio de uploads si no existe
$uploadDir = __DIR__ . '/../../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$datos = [];

if (stripos($contentType, 'application/json') !== false) {
    $datos = json_decode(file_get_contents("php://input"), true) ?? [];
} else {
    $datos = $_POST;
}

$archivoNombre = '';
$archivoUrl = '';

// Procesar archivo subido
if (isset($_FILES['archivo']) && isset($_FILES['archivo']['name']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
    $archivoTMP = $_FILES['archivo']['tmp_name'];
    $archivoNombre = basename($_FILES['archivo']['name']);
    // Generar nombre único para el archivo
    $archivoNombre = preg_replace('/[^a-zA-Z0-9._-]/', '_', $archivoNombre);
    $timestamp = time();
    $archivoNombre = $timestamp . '_' . $archivoNombre;
    $archivoPath = $uploadDir . $archivoNombre;
    
    if (move_uploaded_file($archivoTMP, $archivoPath)) {
        $archivoUrl = '/uploads/' . $archivoNombre;
    } else {
        echo json_encode(["status" => "error", "msj" => "Error al guardar el archivo"]);
        exit;
    }
}

$titulo = trim($datos['titulo'] ?? $archivoNombre ?? '');
$url = trim($datos['url'] ?? $archivoUrl);
$usuarioId = trim($datos['usuario_id'] ?? $datos['usuario'] ?? 'anonimo');
$usuarioNombre = trim($datos['usuario_nombre'] ?? 'Usuario');
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
    "subido_por_id" => $usuarioId,
    "subido_por" => $usuarioNombre,
    "fecha_subida" => gmdate('c')
];

$resultado = $coleccion->insertOne($doc);
echo json_encode([
    "status" => "success",
    "msj" => "Documento registrado",
    "id" => (string)$resultado->getInsertedId()
]);
?>