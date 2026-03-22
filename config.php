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

if (!defined('OLLAMA_BASE_URL')) {
	define('OLLAMA_BASE_URL', getenv('OLLAMA_BASE_URL') ?: 'http://ollama:11434');
}

if (!defined('OLLAMA_MODEL')) {
	define('OLLAMA_MODEL', getenv('OLLAMA_MODEL') ?: 'llama3.2:1b');
}

if (!defined('LLM_TIMEOUT_SECONDS')) {
	define('LLM_TIMEOUT_SECONDS', (int)(getenv('LLM_TIMEOUT_SECONDS') ?: 20));
}
?>
