<?php
require_once __DIR__ . '/../../config_bbdd.php';
header("Content-Type: application/json");

try {
    $db = conectarDB();
    $coleccion = $db->Documentos;

    // Crear directorio de uploads si no existe
    $uploadDir = __DIR__ . '/../../uploads/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception("No se pudo crear el directorio de uploads");
        }
    }

    // Verificar que se haya enviado un archivo
    if (!isset($_FILES['archivo'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "msj" => "No se envió ningún archivo"]);
        exit;
    }

    // Verificar errores del upload
    if ($_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
        $errores = [
            UPLOAD_ERR_INI_SIZE => "El archivo es demasiado grande (límite del servidor)",
            UPLOAD_ERR_FORM_SIZE => "El archivo es demasiado grande (límite del formulario)",
            UPLOAD_ERR_PARTIAL => "El archivo se subió parcialmente",
            UPLOAD_ERR_NO_FILE => "No se seleccionó ningún archivo",
            UPLOAD_ERR_NO_TMP_DIR => "Directorio temporal no encontrado",
            UPLOAD_ERR_CANT_WRITE => "No se puede escribir en el servidor",
            UPLOAD_ERR_EXTENSION => "Extensión de archivo no permitida",
        ];
        $mensaje = $errores[$_FILES['archivo']['error']] ?? "Error desconocido en la subida";
        http_response_code(400);
        echo json_encode(["status" => "error", "msj" => $mensaje]);
        exit;
    }

    $archivoTMP = $_FILES['archivo']['tmp_name'];
    $archivoNombre = basename($_FILES['archivo']['name']);
    
    // Generar nombre único para el archivo
    $archivoNombre = preg_replace('/[^a-zA-Z0-9._-]/', '_', $archivoNombre);
    $timestamp = time();
    $archivoNombre = $timestamp . '_' . $archivoNombre;
    $archivoPath = $uploadDir . $archivoNombre;
    
    if (!move_uploaded_file($archivoTMP, $archivoPath)) {
        http_response_code(500);
        echo json_encode(["status" => "error", "msj" => "Error al guardar el archivo en el servidor"]);
        exit;
    }

    // Obtener datos del formulario
    $datos = $_POST;
    $titulo = trim($datos['titulo'] ?? $archivoNombre ?? '');
    $url = '/api/documentos/descargar_d.php?archivo=' . urlencode($archivoNombre);
    $usuarioId = trim($datos['usuario_id'] ?? $datos['usuario'] ?? 'anonimo');
    $usuarioNombre = trim($datos['usuario_nombre'] ?? 'Usuario');
    $categoria = trim($datos['categoria'] ?? 'general');

    if ($titulo === '') {
        http_response_code(400);
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
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "msj" => "Error en el servidor: " . $e->getMessage()
    ]);
}
?>