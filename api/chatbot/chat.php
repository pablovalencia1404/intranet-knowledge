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
        'error' => 'Método no permitido'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

iniciarSesionSegura();

if (sesionExpiradaPorInactividad(1800) || !isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode([
        'ok' => false,
        'error' => 'Sesion no valida. Inicia sesion de nuevo.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/../../config.php';

function extraerKeywords(string $texto): array {
    $stopwords = [
        'de', 'la', 'el', 'en', 'y', 'a', 'que', 'los', 'las', 'un', 'una', 'por', 'para',
        'con', 'del', 'al', 'se', 'me', 'mi', 'tu', 'su', 'es', 'son', 'como', 'cual', 'cuales',
        'donde', 'cuando', 'porque', 'sobre', 'hay', 'ya', 'si', 'no', 'o'
    ];

    $tokens = preg_split('/[^\p{L}\p{N}]+/u', mb_strtolower($texto));
    $tokens = array_filter($tokens, function ($token) use ($stopwords) {
        return mb_strlen($token) >= 3 && !in_array($token, $stopwords, true);
    });

    return array_values(array_unique($tokens));
}

function puntuarContenido(string $texto, array $keywords): int {
    if ($texto === '' || empty($keywords)) {
        return 0;
    }

    $textoLower = mb_strtolower($texto);
    $score = 0;
    foreach ($keywords as $kw) {
        if (str_contains($textoLower, $kw)) {
            $score += 1;
        }
    }

    return $score;
}

function truncarTexto(string $texto, int $maxLen = 220): string {
    $clean = trim(preg_replace('/\s+/', ' ', $texto));
    if (mb_strlen($clean) <= $maxLen) {
        return $clean;
    }
    return mb_substr($clean, 0, $maxLen - 3) . '...';
}

function construirContextoInterno($db, string $pregunta, string $rol): array {
    $keywords = extraerKeywords($pregunta);
    $lineas = [];
    $sources = [];

    // Wiki
    $wikiDocs = $db->Wiki->find([], ['limit' => 5])->toArray();
    $wikiItems = [];

    foreach ($wikiDocs as $doc) {
        $arr = json_decode(json_encode($doc), true);
        $biblioteca = [];

        if (isset($arr['biblioteca']) && is_array($arr['biblioteca'])) {
            $biblioteca = $arr['biblioteca'];
        } elseif (isset($arr['pages']) || isset($arr['title'])) {
            $biblioteca = [$arr];
        }

        foreach ($biblioteca as $libro) {
            $tituloLibro = $libro['title'] ?? $libro['titulo'] ?? 'Libro sin titulo';
            $pages = $libro['pages'] ?? [];
            if (!is_array($pages)) {
                continue;
            }

            foreach ($pages as $page) {
                $titulo = $page['title'] ?? $page['titulo'] ?? 'Pagina sin titulo';
                $body = $page['body'] ?? $page['contenido'] ?? '';
                $texto = $tituloLibro . ' ' . $titulo . ' ' . $body;
                $score = puntuarContenido($texto, $keywords);

                $wikiItems[] = [
                    'score' => $score,
                    'line' => '- [Wiki] ' . $tituloLibro . ' > ' . $titulo . ': ' . truncarTexto($body),
                    'source' => [
                        'tipo' => 'wiki',
                        'titulo' => $tituloLibro . ' > ' . $titulo,
                        'resumen' => truncarTexto($body)
                    ]
                ];
            }
        }
    }

    usort($wikiItems, fn($a, $b) => $b['score'] <=> $a['score']);
    foreach (array_slice($wikiItems, 0, 5) as $item) {
        $lineas[] = $item['line'];
        $sources[] = $item['source'];
    }

    // Foro
    $foroDocs = $db->Comentarios->find([], ['limit' => 120])->toArray();
    $foroItems = [];
    foreach ($foroDocs as $post) {
        $arr = json_decode(json_encode($post), true);
        if ($rol !== 'admin' && isset($arr['es_privado']) && $arr['es_privado'] === true) {
            continue;
        }
        $titulo = $arr['titulo_hilo'] ?? $arr['titulo'] ?? 'Tema sin titulo';
        $contenido = $arr['contenido'] ?? '';
        $usuario = $arr['user'] ?? $arr['usuario'] ?? 'usuario';
        $texto = $titulo . ' ' . $contenido;
        $score = puntuarContenido($texto, $keywords);
        $foroItems[] = [
            'score' => $score,
            'line' => '- [Foro] ' . $titulo . ' (por ' . $usuario . '): ' . truncarTexto($contenido),
            'source' => [
                'tipo' => 'foro',
                'titulo' => $titulo,
                'resumen' => truncarTexto($contenido)
            ]
        ];
    }

    usort($foroItems, fn($a, $b) => $b['score'] <=> $a['score']);
    foreach (array_slice($foroItems, 0, 4) as $item) {
        $lineas[] = $item['line'];
        $sources[] = $item['source'];
    }

    // Documentos
    $docDocs = $db->Documentos->find([], ['limit' => 120])->toArray();
    $docItems = [];
    foreach ($docDocs as $doc) {
        $arr = json_decode(json_encode($doc), true);
        if ($rol !== 'admin' && isset($arr['es_privado']) && $arr['es_privado'] === true) {
            continue;
        }
        $titulo = $arr['titulo'] ?? $arr['nombre'] ?? 'Documento sin titulo';
        $categoria = $arr['categoria'] ?? 'sin categoria';
        $subidoPor = $arr['subido_por'] ?? $arr['user'] ?? 'usuario';
        $texto = $titulo . ' ' . $categoria . ' ' . $subidoPor;
        $score = puntuarContenido($texto, $keywords);
        $docItems[] = [
            'score' => $score,
            'line' => '- [Documento] ' . $titulo . ' | categoria: ' . $categoria . ' | subido por: ' . $subidoPor,
            'source' => [
                'tipo' => 'documento',
                'titulo' => $titulo,
                'resumen' => 'Categoria: ' . $categoria . ' | Subido por: ' . $subidoPor
            ]
        ];
    }

    usort($docItems, fn($a, $b) => $b['score'] <=> $a['score']);
    foreach (array_slice($docItems, 0, 4) as $item) {
        $lineas[] = $item['line'];
        $sources[] = $item['source'];
    }

    if (empty($lineas)) {
        return [
            'texto' => '',
            'sources' => []
        ];
    }

    $contexto = implode("\n", $lineas);
    // Limita tamaño para no saturar tokens
    if (mb_strlen($contexto) > 5000) {
        $contexto = mb_substr($contexto, 0, 5000);
    }

    return [
        'texto' => $contexto,
        'sources' => array_slice($sources, 0, 10)
    ];
}

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

$db = conectarDB();
$rolUsuario = $_SESSION['usuario_rol'] ?? 'user';
$contextData = construirContextoInterno($db, $message, $rolUsuario);
$contextoInterno = $contextData['texto'];
$sources = $contextData['sources'];

$mensajeFinal = $message;
if ($contextoInterno !== '') {
    $mensajeFinal = "Eres el asistente de la intranet. Usa el CONTEXTO INTERNO para responder con precision. "
        . "Si no hay datos suficientes, indicalo claramente. Responde en espanol."
        . " Al final incluye 'Fuentes consultadas' con 2-4 referencias breves tomadas del contexto.\n\n"
        . "CONTEXTO INTERNO:\n"
        . $contextoInterno
        . "\n\nPREGUNTA DEL USUARIO:\n"
        . $message;
}

$payload = json_encode([
    'message' => $mensajeFinal,
    'mode' => 'chat'
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

$ok = $httpCode >= 200 && $httpCode < 300;
$error = null;

if (!$ok) {
    $error =
        $data['error'] ??
        $data['message'] ??
        $data['msg'] ??
        $data['detail'] ??
        'Error devuelto por AnythingLLM';
}

http_response_code($httpCode ?: 200);
echo json_encode([
    'ok' => $ok,
    'error' => $error,
    'text' => $text,
    'sources' => $sources,
    'raw' => $data
], JSON_UNESCAPED_UNICODE);