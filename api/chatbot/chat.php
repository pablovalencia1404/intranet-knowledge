<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../config_bbdd.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => 'Método no permitido'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/../../config.php';

if (ANYTHINGLLM_BASE_URL === '' || ANYTHINGLLM_WORKSPACE_SLUG === '') {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Falta configurar ANYTHINGLLM_BASE_URL y/o ANYTHINGLLM_WORKSPACE_SLUG en config.php/.env'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$message = trim($body['message'] ?? '');

if ($message === '') {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'Falta el mensaje'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$url = ANYTHINGLLM_BASE_URL . '/api/v1/workspace/' . ANYTHINGLLM_WORKSPACE_SLUG . '/chat';

$payload = json_encode([
    'message' => $message
], JSON_UNESCAPED_UNICODE);

$ch = curl_init($url);

$headers = [
    'Content-Type: application/json'
];

if (ANYTHINGLLM_API_KEY !== '') {
    $headers[] = 'Authorization: Bearer ' . ANYTHINGLLM_API_KEY;
}

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_TIMEOUT => 60
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Error cURL: ' . $curlError
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode($response, true);

if (!is_array($data)) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'La respuesta de AnythingLLM no es JSON válido',
        'raw' => $response
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$text =
    $data['textResponse'] ??
    $data['response'] ??
    $data['text'] ??
    'No se recibió texto del asistente.';

http_response_code($httpCode ?: 200);
echo json_encode([
    'ok' => $httpCode >= 200 && $httpCode < 300,
    'text' => $text,
    'raw' => $data
], JSON_UNESCAPED_UNICODE);