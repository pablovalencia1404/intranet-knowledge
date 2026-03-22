<?php

function iniciarSesionSegura(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $inactividadMaxima = 1800; // 30 minutos

    ini_set('session.gc_maxlifetime', (string)$inactividadMaxima);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Lax');

    $esHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);

    session_set_cookie_params([
        'lifetime' => $inactividadMaxima,
        'path' => '/',
        'secure' => $esHttps,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    session_start();
}

function sesionExpiradaPorInactividad(int $segundosMaximos = 1800): bool {
    if (!isset($_SESSION['ultima_actividad'])) {
        $_SESSION['ultima_actividad'] = time();
        return false;
    }

    if ((time() - (int)$_SESSION['ultima_actividad']) > $segundosMaximos) {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
        return true;
    }

    $_SESSION['ultima_actividad'] = time();
    return false;
}
