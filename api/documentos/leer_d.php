<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->Documentos; 

$datos = $coleccion->find()->toArray();
echo json_encode(["estado" => "ok", "datos" => $datos]);