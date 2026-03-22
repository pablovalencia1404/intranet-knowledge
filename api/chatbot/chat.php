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

    $tokens = preg_split('/[^\p{L}\p{N}]+/u', strtolower($texto));
    $tokens = array_filter($tokens, function ($token) use ($stopwords) {
        return strlen($token) >= 3 && !in_array($token, $stopwords, true);
    });

    return array_values(array_unique($tokens));
}

function puntuarContenido(string $texto, array $keywords): int {
    if ($texto === '' || empty($keywords)) {
        return 0;
    }

    $textoLower = strtolower($texto);
    $score = 0;
    foreach ($keywords as $kw) {
        if (str_contains($textoLower, $kw)) {
            $score += 1;
        }
    }

    return $score;
}

function truncarTexto(string $texto, int $maxLen = 150): string {
    $clean = trim(preg_replace('/\s+/', ' ', $texto));
    if (strlen($clean) <= $maxLen) {
        return $clean;
    }
    return substr($clean, 0, $maxLen - 3) . '...';
}

function construirContextoInterno($db, string $pregunta, string $rol): array {
    $keywords = extraerKeywords($pregunta);
    $lineas = [];
    $sources = [];

    // Wiki
    $wikiDocs = $db->Wiki->find([], ['limit' => 3])->toArray();
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
    $foroDocs = $db->Comentarios->find([], ['limit' => 40])->toArray();
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
    $docDocs = $db->Documentos->find([], ['limit' => 40])->toArray();
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
    $maxContext = CHATBOT_CONTEXT_MAX_CHARS > 0 ? CHATBOT_CONTEXT_MAX_CHARS : 1200;
    if (strlen($contexto) > $maxContext) {
        $contexto = substr($contexto, 0, $maxContext);
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
    $mensajeFinal = "Eres el asistente de la intranet. Responde en espanol, de forma directa y breve. "
        . "Maximo 6 lineas o 120 palabras. No expliques de mas ni razonamientos internos. "
        . "Si faltan datos, dilo en una frase. "
        . "Al final incluye 'Fuentes consultadas' con 2-3 referencias cortas del contexto.\n\n"
        . "CONTEXTO INTERNO:\n"
        . $contextoInterno
        . "\n\nPREGUNTA DEL USUARIO:\n"
        . $message;
}

$timeoutGlobal = LLM_TIMEOUT_SECONDS > 0 ? LLM_TIMEOUT_SECONDS : 20;
$timeoutAnything = ANYTHINGLLM_TIMEOUT_SECONDS > 0 ? ANYTHINGLLM_TIMEOUT_SECONDS : 15;
$timeoutAnything = max(12, min($timeoutAnything, 30));
$timeoutOllama = OLLAMA_TIMEOUT_SECONDS > 0 ? OLLAMA_TIMEOUT_SECONDS : $timeoutGlobal;

// 1) Intento principal: AnythingLLM
$payload = json_encode([
    'message' => $mensajeFinal,
    'mode' => 'chat'
], JSON_UNESCAPED_UNICODE);

$ch = curl_init($url);
$headers = ['Content-Type: application/json'];
if (ANYTHINGLLM_API_KEY !== '') {
    $headers[] = 'Authorization: Bearer ' . ANYTHINGLLM_API_KEY;
}

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_TIMEOUT => $timeoutAnything
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

$data = is_string($response) ? json_decode($response, true) : null;
$ok = (!$curlError) && is_array($data) && $httpCode >= 200 && $httpCode < 300;

if ($ok) {
    $text = $data['textResponse'] ?? $data['response'] ?? $data['text'] ?? 'No se recibió texto del asistente.';
    echo json_encode([
        'ok' => true,
        'error' => null,
        'text' => $text,
        'sources' => $sources,
        'engine' => 'anythingllm',
        'raw' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2) Fallback rapido: Ollama directo con reintento de modelo conocido
$ollamaUrl = rtrim(OLLAMA_BASE_URL, '/') . '/api/generate';
$modelos = array_values(array_unique([
    OLLAMA_MODEL,
    'llama3.2:1b',
    'phi3:mini'
]));

$curlError2 = null;
$response2 = null;
$data2 = null;
$httpCode2 = 0;
$modeloUsado = null;

foreach ($modelos as $modeloIntento) {
    $ollamaPayload = json_encode([
        'model' => $modeloIntento,
        'prompt' => $mensajeFinal,
        'stream' => false,
        'options' => [
            'temperature' => 0.1,
            'num_ctx' => OLLAMA_NUM_CTX > 0 ? OLLAMA_NUM_CTX : 1024,
            'num_predict' => OLLAMA_NUM_PREDICT > 0 ? OLLAMA_NUM_PREDICT : 180
        ]
    ], JSON_UNESCAPED_UNICODE);

    $ch2 = curl_init($ollamaUrl);
    curl_setopt_array($ch2, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => $ollamaPayload,
        CURLOPT_TIMEOUT => $timeoutOllama
    ]);

    $response2 = curl_exec($ch2);
    $httpCode2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    $curlError2 = curl_error($ch2);
    curl_close($ch2);

    if (!$curlError2) {
        $data2 = json_decode((string)$response2, true);
        if (is_array($data2) && $httpCode2 >= 200 && $httpCode2 < 300 && !empty($data2['response'])) {
            $modeloUsado = $modeloIntento;
            break;
        }
    }
}

if (!is_array($data2) || empty($data2['response']) || $httpCode2 < 200 || $httpCode2 >= 300) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Timeout o error de LLM. AnythingLLM: ' . ($curlError ?: 'sin detalle') . ' | Ollama: ' . ($curlError2 ?: 'sin detalle'),
        'sources' => $sources,
        'raw_anythingllm' => is_array($data) ? $data : $response,
        'raw_ollama' => $response2
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$text2 = $data2['response'];
echo json_encode([
    'ok' => true,
    'error' => null,
    'text' => $text2,
    'sources' => $sources,
    'engine' => 'ollama' . ($modeloUsado ? ':' . $modeloUsado : '')
], JSON_UNESCAPED_UNICODE);