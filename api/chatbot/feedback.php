<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../config_bbdd.php';
require_once __DIR__ . '/../usuarios/session_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => 'Metodo no permitido'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

iniciarSesionSegura();

if (sesionExpiradaPorInactividad(1800) || !isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode([
        'ok' => false,
        'error' => 'Sesion no valida'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$util = $input['util'] ?? null;
$pregunta = trim($input['pregunta'] ?? '');
$respuesta = trim($input['respuesta'] ?? '');

if (!is_bool($util) || $pregunta === '' || $respuesta === '') {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'Datos invalidos para feedback'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$db = conectarDB();
$coleccion = $db->ChatbotFeedback;

$coleccion->insertOne([
    'usuario_id' => $_SESSION['usuario_id'],
    'usuario_nombre' => $_SESSION['usuario_nombre'] ?? 'usuario',
    'util' => $util,
    'pregunta' => $pregunta,
    'respuesta' => $respuesta,
    'fecha' => date('c')
]);

echo json_encode([
    'ok' => true,
    'mensaje' => 'Feedback guardado'
], JSON_UNESCAPED_UNICODE);
