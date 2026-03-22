<?php
header("Content-Type: application/json");

$archivo = $_GET['archivo'] ?? '';

if ($archivo === '') {
    http_response_code(400);
    echo json_encode(["error" => "Parámetro 'archivo' requerido"]);
    exit;
}

// Sanitizar el nombre del archivo para evitar path traversal
$archivo = basename($archivo);
$filePath = __DIR__ . '/../../uploads/' . $archivo;

// Verificar que el archivo existe y está dentro del directorio permitido
if (!file_exists($filePath) || !is_file($filePath) || realpath($filePath) === false) {
    http_response_code(404);
    echo json_encode(["error" => "Archivo no encontrado"]);
    exit;
}

// Verificar que el archivo está dentro del directorio de uploads
$uploadDir = realpath(__DIR__ . '/../../uploads/');
$filePath = realpath($filePath);

if (strpos($filePath, $uploadDir) !== 0) {
    http_response_code(403);
    echo json_encode(["error" => "Acceso denegado"]);
    exit;
}

// Obtener el tipo MIME correcto
$mimeTypes = [
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls' => 'application/vnd.ms-excel',
    'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt' => 'text/plain',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'zip' => 'application/zip',
];

$ext = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
$mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

// Servir el archivo con los headers correctos
header('Content-Type: ' . $mimeType);
header('Content-Disposition: attachment; filename="' . basename($archivo) . '"');
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

readfile($filePath);
exit;
?>
