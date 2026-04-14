# Proyecto Issues

Este proyecto es una aplicación web para la gestión unificada de incidencias (Tickets/Issues) que se conecta con sistemas como Mantis y Redmine. Cuenta con un backend en Node.js y un frontend en React.

## Requisitos previos

- [Node.js](https://nodejs.org/es/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (viene instalado con Node.js)

## Instalación de dependencias

El proyecto se divide en dos partes principales: el `backend` y el `react-frontend`. Debes instalar las dependencias de ambas partes por separado.

### 1. Dependencias del Backend

Abre una terminal, navega a la carpeta del backend y ejecuta la instalación:

```bash
cd app/backend
npm install
```

### 2. Dependencias del Frontend (React)

En otra terminal (o en la misma, volviendo hacia atrás), navega a la carpeta del frontend y ejecuta la instalación:

```bash
cd app/react-frontend
npm install
```

## Configuración del entorno

1. En la carpeta `app/backend`, asegúrate de tener configurado tu archivo `.env` con las variables de entorno necesarias (conexión a bases de datos, URLs de las APIs de Redmine/Mantis, claves, etc.).
2. En la carpeta `app/react-frontend`, configura también tu archivo `.env` (generalmente con el prefijo `REACT_APP_` para indicar la URL del backend, ej: `REACT_APP_API_URL=http://localhost:5000`).

## Ejecución del proyecto

Para levantar todo el entorno, necesitas iniciar ambos servicios.

### Iniciar el servidor Backend

Ve a la terminal que tienes en la carpeta del backend y ejecuta:

```bash
cd app/backend
npm start
```
El servidor backend se iniciará (normalmente en el puerto 5000, o el configurado).

### Iniciar la aplicación Frontend (React)

Ve a la terminal que tienes en la carpeta del frontend y ejecuta:

```bash
cd app/react-frontend
npm start
```
Esto abrirá automáticamente tu navegador en `http://localhost:3000` con la aplicación cargada.

## Despliegue con Docker (Opcional)

Si prefieres usar Docker, este proyecto también incluye la configuración necesaria:

```bash
docker-compose up --build
```
Esto levantará los contenedores configurados en el archivo `docker-compose.yml`. Para más detalles, consulta el archivo `DOCKER_SETUP.md`.
