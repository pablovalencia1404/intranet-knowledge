<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->Usuarios;

// Borramos lo que haya para no duplicar en las pruebas
$coleccion->deleteMany([]);

// Insertamos un par de usuarios de ejemplo
$passwordPlano = '123456';
$passwordHash = password_hash($passwordPlano, PASSWORD_BCRYPT);

$usuarios = [
    [
        'nombre' => 'Raul Sanchez',
        'email' => 'i52saflr@uco.es',
        'contraseña' => $passwordHash,
        'rol' => 'admin'
    ],
    [
        'nombre' => 'Manuel Palomares',
        'email' => 'i42papim@uco.es',
        'contraseña' => $passwordHash,
        'rol' => 'user'
    ],
    [
        'nombre' => 'Pablo Valencia',
        'email' => 'pablo@uco.es',
        'contraseña' => $passwordHash,
        'rol' => 'user'
    ]
];

$coleccion->insertMany($usuarios);

echo json_encode([
    "status" => "ok",
    "msj" => "Base de datos sembrada con 3 usuarios.",
    "credenciales_prueba" => [
        "password" => $passwordPlano
    ]
]);