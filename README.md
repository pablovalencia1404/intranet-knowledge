# Intranet Knowledge

Proyecto full stack (React + PHP + MongoDB) preparado para levantar con Docker Compose.

## Requisitos

- Docker
- Docker Compose

## Modo local (sin SSL)

Este modo es el predeterminado y funciona solo con clonar el repositorio.

```bash
docker compose up --build -d
```

Aplicación:

- Frontend + API proxificada: http://localhost
- API directa (opcional): http://localhost:8080/api

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
