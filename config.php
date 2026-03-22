<?php
require_once __DIR__ . '/config_bbdd.php';

if (!defined('ANYTHINGLLM_BASE_URL')) {
	define('ANYTHINGLLM_BASE_URL', getenv('ANYTHINGLLM_BASE_URL') ?: '');
}

if (!defined('ANYTHINGLLM_WORKSPACE_SLUG')) {
	define('ANYTHINGLLM_WORKSPACE_SLUG', getenv('ANYTHINGLLM_WORKSPACE_SLUG') ?: '');
}

if (!defined('ANYTHINGLLM_API_KEY')) {
	define('ANYTHINGLLM_API_KEY', getenv('ANYTHINGLLM_API_KEY') ?: '');
}
?>
