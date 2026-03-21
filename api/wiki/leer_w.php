<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config_bbdd.php';

$db = conectarDB();
$coleccion = $db->Wiki;

$fallback = [
    [
        "id" => 1,
        "title" => "Manual de Onboarding",
        "pages" => [
            [
                "id" => "onb-1",
                "title" => "Bienvenida",
                "body" => "Bienvenido a Intranet Knowledge. Esta guia te ayudara en tu primera semana para configurar accesos, entorno de trabajo y herramientas internas."
            ],
            [
                "id" => "onb-2",
                "title" => "Instalacion VPN",
                "body" => "Descarga el cliente oficial desde el portal IT, usa tus credenciales corporativas y valida la conexion con el recurso interno de prueba."
            ],
            [
                "id" => "onb-3",
                "title" => "Herramientas IT",
                "body" => "Solicita acceso a correo, repositorio, gestor de tareas y panel de incidencias. Revisa tambien el protocolo de soporte y escalado."
            ]
        ]
    ],
    [
        "id" => 2,
        "title" => "Politica de Empresa",
        "pages" => [
            [
                "id" => "pol-1",
                "title" => "Codigo de Conducta",
                "body" => "Se espera un comportamiento profesional, respeto entre equipos y cumplimiento del reglamento interno en canales online y presenciales."
            ],
            [
                "id" => "pol-2",
                "title" => "Seguridad de Datos",
                "body" => "No compartas credenciales, usa MFA cuando aplique y reporta cualquier incidente al equipo de seguridad en menos de 24 horas."
            ],
            [
                "id" => "pol-3",
                "title" => "Vacaciones",
                "body" => "Las vacaciones deben solicitarse con antelacion en el portal de RRHH y ser aprobadas por el responsable de area antes de su disfrute."
            ]
        ]
    ]
];

$docs = $coleccion->find()->toArray();

if (count($docs) === 0) {
    echo json_encode([
        "status" => "ok",
        "biblioteca" => $fallback,
        "source" => "fallback"
    ]);
    exit;
}

$normalizado = json_decode(json_encode($docs), true);

if (isset($normalizado[0]['biblioteca']) && is_array($normalizado[0]['biblioteca'])) {
    echo json_encode([
        "status" => "ok",
        "biblioteca" => $normalizado[0]['biblioteca'],
        "source" => "db"
    ]);
    exit;
}

echo json_encode([
    "status" => "ok",
    "biblioteca" => $normalizado,
    "source" => "db"
]);
