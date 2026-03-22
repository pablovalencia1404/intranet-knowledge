# Funcionamiento completo del proyecto Intranet Knowledge

## 1. Objetivo del sistema
Intranet Knowledge es una plataforma interna para gestion de conocimiento institucional. El sistema combina:

- Wiki editable para documentacion interna.
- Foro para dudas y debates.
- Muro social para comunicacion diaria.
- Gestor documental con subida y descarga de archivos.
- Asistente IA integrado (widget flotante) con contexto interno.

La aplicacion esta construida con React en frontend, PHP en backend y MongoDB como base de datos, todo orquestado con Docker Compose.

## 2. Arquitectura general

### 2.1 Capas
- Frontend: React + Vite + Tailwind.
- Backend: API PHP (endpoints en carpeta api).
- Datos: MongoDB.
- IA: AnythingLLM + Ollama (fallback local).
- Proxy web: Nginx para servir frontend y enrutar API.

### 2.2 Servicios Docker
Definidos en docker-compose.yml:

- frontend: interfaz web en puerto 80.
- backend: API PHP en puerto 8080.
- mongodb: base de datos en puerto 27017.
- anythingllm: servidor de asistente IA en puerto 3001.
- ollama: inferencia local de modelos en puerto 11434.
- ollama-init: descarga inicial del modelo configurado.

### 2.3 Configuracion clave
Variables relevantes (config.php + docker-compose.yml):

- ANYTHINGLLM_BASE_URL
- ANYTHINGLLM_WORKSPACE_SLUG
- ANYTHINGLLM_API_KEY
- OLLAMA_BASE_URL
- OLLAMA_MODEL
- LLM_TIMEOUT_SECONDS

## 3. Flujo de autenticacion y sesion

### 3.1 Registro
Endpoint: api/usuarios/crear_u.php

- Recibe nombre, email y contrasena.
- Verifica email no duplicado.
- Hashea contrasena con BCRYPT.
- Crea usuario con rol user por defecto.

### 3.2 Login
Endpoint: api/usuarios/login_u.php

- Busca usuario por email.
- Verifica contrasena hasheada.
- Regenera session_id.
- Guarda en sesion: id, nombre, email, rol y ultima_actividad.

### 3.3 Verificacion de sesion
Endpoint: api/usuarios/verificar_sesion.php

- Revisa si hay sesion activa.
- Revisa inactividad maxima (30 min).
- Devuelve status autenticado, no_autenticado o expirada.

### 3.4 Logout
Endpoint: api/usuarios/logout_u.php

- Limpia variables de sesion.
- Elimina cookie de sesion.
- Destruye sesion.

### 3.5 Seguridad de sesion
Archivo: api/usuarios/session_config.php

- Cookies httponly.
- SameSite Lax.
- Secure condicionado a HTTPS.
- Expiracion por inactividad.
- Modo estricto de sesion.

## 4. Modulos funcionales del frontend

## 4.1 Dashboard principal y navegacion
- Componente principal: frontend/src/App.jsx
- Barra superior: frontend/src/componentes/Navbar.jsx

Funciones:
- Rutas protegidas por usuario autenticado.
- Navegacion a Wiki, Foro, Documentos, Red social y Perfil.
- Buscador global (Wiki/Foro/Documentos).
- Centro de notificaciones con contador de no leidas.
- Acceso condicional a panel de analitica para rol admin.

## 4.2 Perfil de usuario
Componente: frontend/src/componentes/UserProfile.jsx

Funciones:
- Muestra datos basicos del usuario logueado.
- Calcula estadisticas reales de posts y documentos del usuario.
- Permite editar descripcion personal (persistencia en localStorage).
- Permite compartir enlace de perfil (clipboard).

## 4.3 Gestor de documentos
Componentes:
- frontend/src/componentes/DocumentManager.jsx
- frontend/src/componentes/FileUploader.jsx

Funciones:
- Lista documentos desde API.
- Subida de archivo con FormData.
- Registro de metadatos (titulo, categoria, autor).
- Descarga por URL generada por backend.

Endpoint de lectura: api/documentos/leer_d.php
Endpoint de creacion: api/documentos/crear_d.php

## 4.4 Wiki institucional
Componente: frontend/src/componentes/Wiki.jsx

Funciones:
- Carga biblioteca desde API.
- Fallback local si hay error de red.
- Navegacion por libros y paginas.
- Edicion de pagina existente.
- Creacion de nueva pagina.
- Guardado de biblioteca completa en backend.

Endpoint lectura: api/wiki/leer_w.php
Endpoint escritura: api/wiki/crear_w.php

## 4.5 Foro
Componentes:
- frontend/src/componentes/Foro.jsx
- frontend/src/componentes/NuevoPost.jsx
- frontend/src/componentes/TemaDetalle.jsx

Funciones:
- Lista temas (ordenados por mas recientes).
- Filtros: recientes, populares, sin respuesta.
- Etiquetas y metricas por actividad.
- Creacion de nuevo tema.
- Apertura de detalle de tema y respuestas.

Endpoint principal: api/posts/leer_p.php
Creacion tema/respuesta: api/posts/crear_p.php

## 4.6 Red social
Componentes:
- frontend/src/componentes/SocialWall.jsx
- frontend/src/componentes/NuevoSocialPost.jsx

Funciones:
- Feed del muro social basado en categoria Muro social.
- Publicacion de post social.
- Sistema de likes.
- Sistema de comentarios por post.
- Metricas de interaccion en tiempo real.
- Boton para abrir chatbot via evento global.

Endpoints usados:
- api/posts/leer_p.php
- api/posts/crear_p.php
- api/posts/crear_l.php
- api/posts/crear_c.php
- api/posts/leer_lc.php

## 4.7 Chatbot como widget flotante
Componente: frontend/src/componentes/ChatbotWidget.jsx

Funciones:
- Disponible en toda la app autenticada.
- Apertura por boton flotante y por evento open-chatbot-widget.
- Historial visual de conversacion.
- Prompts rapidos.
- Envio de feedback util/no util por respuesta.
- Muestra fuentes y motor de respuesta.

Endpoints:
- api/chatbot/chat.php
- api/chatbot/feedback.php

## 4.8 Analitica para administradores
Componente: frontend/src/componentes/AdminAnalytics.jsx

Funciones:
- Visible solo para rol admin.
- Mide usuarios, documentos, temas y actividad semanal.
- Ranking de colaboradores del foro.
- Listado de actividad reciente.

Ruta: /admin

## 5. Funcionamiento del backend por dominios

## 5.1 Usuarios
Carpeta: api/usuarios

- crear_u.php: registro.
- leer_u.php: listado de usuarios.
- login_u.php: inicio de sesion.
- logout_u.php: cierre de sesion.
- verificar_sesion.php: estado de sesion.
- seed_u.php: carga inicial de usuarios (si aplica).

## 5.2 Documentos
Carpeta: api/documentos

- crear_d.php: recibe archivo, lo guarda en uploads y registra metadata.
- leer_d.php: devuelve listado de documentos.
- descargar_d.php: entrega archivo por nombre.

## 5.3 Posts, likes y comentarios
Carpeta: api/posts

- crear_p.php: crea temas o respuestas.
- leer_p.php: lista temas del foro.
- crear_l.php: like/unlike por usuario.
- crear_c.php: crea comentario en post.
- leer_lc.php: resume likes y comentarios de un post.

## 5.4 Wiki
Carpeta: api/wiki

- leer_w.php: devuelve biblioteca desde DB o fallback.
- crear_w.php: reemplaza biblioteca por nueva version.

## 5.5 Chatbot
Carpeta: api/chatbot

- chat.php: motor principal del asistente.
- feedback.php: guarda valoracion de respuesta en DB.

## 6. Logica del chatbot IA (detalle)

## 6.1 Entrada y control de acceso
- Solo acepta metodo POST.
- Requiere sesion valida y no expirada.
- Valida que el mensaje no sea vacio.

## 6.2 Construccion de contexto interno
Antes de consultar el LLM, el backend analiza datos de:

- Wiki
- Foro
- Documentos

Proceso:
- Extrae keywords de la pregunta.
- Puntua coincidencias por keyword.
- Selecciona fragmentos con mejor score.
- Genera contexto compacto (limite de longitud).
- Adjunta fuentes para transparencia.

## 6.3 Control por rol
Si el contenido esta marcado como privado y el usuario no es admin, se excluye del contexto.

## 6.4 Estrategia de respuesta
- Primer intento: AnythingLLM (modo chat).
- Fallback automatico: Ollama local.
- Timeout configurable por variable.

Respuesta final al frontend:
- texto generado
- fuentes consultadas
- engine usado (anythingllm u ollama)

## 7. Persistencia de datos (MongoDB)
Colecciones principales observadas en el proyecto:

- Usuarios
- Documentos
- Comentarios (foro y posts)
- Likes
- PostComentarios
- Wiki
- ChatbotFeedback

Carga inicial:
- Se usa carpeta dum con dump BSON.
- Script mongodb/init-mongo.sh inicializa datos al arrancar contenedor.

## 8. Seguridad, CORS y sesion
Archivo central: config_bbdd.php

- CORS con lista blanca de origenes.
- Credenciales habilitadas para cookie de sesion.
- Headers para metodos permitidos y preflight OPTIONS.
- Conexion a MongoDB por red de Docker.

Sesion:
- Timeout por inactividad en backend.
- Aviso previo de expiracion en frontend con cuenta regresiva.
- Posibilidad de continuar sesion desde modal.

## 9. Flujo de uso del usuario (end to end)

## 9.1 Usuario estandar
1. Se registra o inicia sesion.
2. Entra al dashboard con metricas y muro.
3. Consulta wiki, abre foros o gestiona documentos.
4. Publica en foro o muro social.
5. Interactua con likes y comentarios.
6. Usa chatbot para resolver dudas de conocimiento interno.

## 9.2 Administrador
1. Mismo flujo base del usuario.
2. Accede ademas a ruta /admin.
3. Revisa analitica consolidada de uso.

## 10. Rutas de frontend
Definidas en frontend/src/App.jsx:

- /login
- /registrarse
- /
- /social
- /documentos
- /perfil
- /wiki
- /foro
- /admin

Nota: /chatbot redirige a /social porque el chatbot se usa como widget global, no como pagina independiente.

## 11. Despliegue y operacion

## 11.1 Local
Comando principal:

- docker compose up --build -d

Servicios disponibles:
- App: http://localhost
- API directa: http://localhost:8080/api
- AnythingLLM: http://localhost:3001
- Ollama: http://localhost:11434

## 11.2 Produccion
Comando:

- docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

Usa:
- nginx/conf.d/default.prod.conf
- certificados SSL del servidor

## 12. Estado funcional actual
Actualmente el proyecto incluye:

- Autenticacion con sesion y expiracion por inactividad.
- Gestion documental con subida y descarga.
- Wiki editable con persistencia en MongoDB.
- Foro con filtros y orden por reciente.
- Muro social con likes y comentarios.
- Chatbot IA contextual con fallback.
- Busqueda global desde navbar.
- Notificaciones internas en navbar.
- Panel de analitica para admin.

## 13. Limitaciones conocidas y recomendaciones

Limitaciones tecnicas posibles:
- Subida de imagen en post social aun no se persiste en backend (solo seleccion UI).
- No hay sistema de paginacion en listados grandes.
- No hay busqueda full-text indexada en MongoDB (la busqueda actual es por filtrado simple en frontend).

Mejoras recomendadas:
- Añadir control de permisos por endpoint para escritura sensible.
- Implementar validacion de tipos/tamanos de archivo mas estricta.
- Agregar tests automatizados (frontend y backend).
- Incluir auditoria de acciones de administracion.

---

Documento generado para describir de forma integral el funcionamiento tecnico y funcional del proyecto actual.
