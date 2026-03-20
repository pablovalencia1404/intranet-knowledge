<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->Comentarios; 

$datos = $coleccion->find()->toArray();
echo json_encode(["estado" => "ok", "foro" => $datos]);