# Intranet Knowledge

Proyecto full stack (React + PHP + MongoDB) preparado para levantar con Docker Compose.

Incluye integración de chatbot con contenedores dedicados para AnythingLLM y Ollama.

## Requisitos

- Docker
- Docker Compose

## Modo local (sin SSL)

Este modo es el predeterminado y funciona solo con clonar el repositorio.

```bash
docker compose up --build -d
```

Aplicación:

- Frontend + API proxificada: <http://localhost>
- API directa (opcional): <http://localhost:8080/api>
- AnythingLLM (panel): <http://localhost:3001>
- Ollama API: <http://localhost:11434>

## Chatbot automatizado con Docker

Con `docker compose up --build -d` también se levantan:

- `anythingllm` (servidor del asistente)
- `ollama` (modelo local)

Variables del chatbot:

- `.env` para uso local
- `.env.example` como plantilla versionada

Para personalizar, copia y edita:

```bash
cp .env.example .env
```

Luego reinicia:

```bash
docker compose down
docker compose up --build -d
```

Nota: la primera vez, entra en <http://localhost:3001>, completa el setup inicial de AnythingLLM y crea (si aplica) el workspace con slug `intranet-knowledge`.

## Modo producción (con SSL)

Este modo usa un archivo override con certificados del servidor.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Archivos usados en producción:

- `docker-compose.prod.yml`
- `nginx/conf.d/default.prod.conf`

## Detener

Modo local:

```bash
docker compose down
```

Modo producción:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## Notas

- El frontend usa `VITE_API_URL=/api`, por lo que no depende de un dominio externo.
- Los certificados SSL no se incluyen en el repositorio.
- Revisa `nginx/conf.d/default.prod.conf` y ajusta `server_name` y rutas de certificados a tu dominio real.
