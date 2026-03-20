#!/bin/bash
set -e

DUMP_PATH="/docker-entrypoint-initdb.d/dump/Proyecto_backend"
DB_NAME="Proyecto_backend"

if [ -d "$DUMP_PATH" ]; then
  echo "[mongo-init] Restaurando dump en la base de datos '$DB_NAME'..."
  mongorestore --drop --db "$DB_NAME" "$DUMP_PATH"
  echo "[mongo-init] Restauracion completada."
else
  echo "[mongo-init] No se encontro el dump en $DUMP_PATH. Omitiendo restauracion."
fi
