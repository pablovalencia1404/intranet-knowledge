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

if (!defined('ANYTHINGLLM_TIMEOUT_SECONDS')) {
	define('ANYTHINGLLM_TIMEOUT_SECONDS', (int)(getenv('ANYTHINGLLM_TIMEOUT_SECONDS') ?: 15));
}

if (!defined('OLLAMA_TIMEOUT_SECONDS')) {
	define('OLLAMA_TIMEOUT_SECONDS', (int)(getenv('OLLAMA_TIMEOUT_SECONDS') ?: 18));
}

if (!defined('CHATBOT_CONTEXT_MAX_CHARS')) {
	define('CHATBOT_CONTEXT_MAX_CHARS', (int)(getenv('CHATBOT_CONTEXT_MAX_CHARS') ?: 1200));
}

if (!defined('OLLAMA_NUM_CTX')) {
	define('OLLAMA_NUM_CTX', (int)(getenv('OLLAMA_NUM_CTX') ?: 1024));
}

if (!defined('OLLAMA_NUM_PREDICT')) {
	define('OLLAMA_NUM_PREDICT', (int)(getenv('OLLAMA_NUM_PREDICT') ?: 180));
}
?>
