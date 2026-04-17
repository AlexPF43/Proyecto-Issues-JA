# Proyecto Issues

Este proyecto es una aplicación web para la gestión unificada de incidencias (Tickets/Issues) que se conecta con sistemas como Mantis y Redmine. Cuenta con un backend en Node.js y un frontend en React.

## Requisitos previos

- Node.js (versión 18 o superior recomendada)
- npm (viene instalado con Node.js)

## Instalación de dependencias

El proyecto se divide en dos partes principales: el backend y el react-frontend. Debes instalar las dependencias de ambas partes por separado.

### 1. Dependencias del Backend

Abre una terminal, navega a la carpeta del backend y ejecuta la instalación:
npm install

### 2. Dependencias del Frontend (React)

Navega a la carpeta del frontend y ejecuta la instalación:
npm install

## Configuración del entorno

1. En la carpeta app/backend, debes tener configurado un archivo .env con estas variables:

=== BASE DE DATOS MYSQL ===

DB_HOST=

DB_PORT=

DB_USER=

DB_PASSWORD=

DB_NAME=


==== SERVIDOR (server.js) ====

PORT=3000


==== SINCRONIZACIÓN ====

Intervalo en milisegundos (1000 ms= 1 sec)

SYNC_INTERVAL=


===== MANTIS =====
MANTIS_URL=urlMantis/api/rest/issues

MANTIS_TOKEN=


===== REDMINE =====
REDMINE_URL=urlRedmine/issues.json

REDMINE_API_KEY=your_redmine_api_key


## Ejecución del proyecto

Para levantar todo el entorno, necesitas iniciar ambos servicios.

## Iniciar el servidor Backend

Ve a la terminal que tienes en la carpeta del backend y ejecuta:
cd app/backend
npm start
(El servidor backend se iniciará normalmente en el puerto 5000, o el configurado).

## Iniciar la aplicación Frontend (React)

Ve a la terminal que tienes en la carpeta del frontend y ejecuta:
cd app/react-frontend
npm start
(Esto abrirá automáticamente tu navegador en http://localhost:3000 con la aplicación cargada).

## Despliegue con Docker (Opcional)

Si prefieres usar Docker, este proyecto también incluye la configuración necesaria:
docker-compose up --build

Esto levantará los contenedores configurados en el archivo docker-compose.yml. Para más detalles, consulta el archivo DOCKER_SETUP.md.
