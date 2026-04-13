# Guía de Dockerización - Proyecto de Issues

Este proyecto ha sido completamente dockerizado para ejecutarse en Docker Desktop.

## Requisitos

- **Docker Desktop** instalado y ejecutándose
- **Git** (opcional, solo si clonas el repositorio)

## Estructura de Servicios

El proyecto incluye los siguientes servicios:

1. **Backend (Node.js/Express)** - Puerto 5000
   - API REST para gestionar tickets
   - Sincronización con Mantis y Redmine
   - Base de datos MySQL

2. **Frontend (React)** - Puerto 3000
   - Interfaz web usando Nginx
   - Proxy automático al backend

3. **Base de Datos MySQL** (issues-db) - Puerto 3305
   - Almacena los tickets sincronizados
   - Usuario: `admin` / Contraseña: `rootpass`

4. **Mantis** - Puerto 3200
   - Sistema de tickets integrado
   - Base de datos MySQL separada

5. **Redmine** - Puerto 3100
   - Sistema de gestión de proyectos
   - Base de datos MySQL separada

## Instrucciones de Ejecución

### 1. Iniciar los servicios

```bash
# En la raíz del proyecto
docker-compose up -d
```

Esto descargará las imágenes necesarias, compilará el backend y frontend, e iniciará todos los servicios.

### 2. Verificar el estado de los servicios

```bash
docker-compose ps
```

Todos los servicios deben mostrarse como "Up" después de 30-60 segundos.

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mantis**: http://localhost:3200
- **Redmine**: http://localhost:3100
- **Base de datos**: localhost:3305 (usuario: admin, contraseña: rootpass)

## Comandos Útiles

### Ver logs de un servicio
```bash
# Todos los servicios
docker-compose logs -f

# Solo el backend
docker-compose logs -f backend

# Solo el frontend
docker-compose logs -f frontend

# Solo la base de datos
docker-compose logs -f db
```

### Detener los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes
```bash
docker-compose down -v
```

### Rebuilds (si modificas código)
```bash
# Rebuild solo el backend
docker-compose up -d --build backend

# Rebuild solo el frontend
docker-compose up -d --build frontend

# Rebuild todo
docker-compose up -d --build
```

### Ejecutar comandos dentro de un contenedor
```bash
# Shell en el backend
docker-compose exec backend sh

# Shell en el frontend
docker-compose exec frontend sh

# Shell en MySQL
docker-compose exec db mysql -u admin -p -e "USE db; SHOW TABLES;"
```

## Configuración

### Variables de Entorno del Backend

El archivo `.env` en `app/backend/.env` contiene:
- `DB_HOST`: Nombre del servicio de BD (db para Docker)
- `DB_PORT`: Puerto de MySQL dentro de Docker (3306)
- `PORT`: Puerto del servidor (5000)
- `MANTIS_BASE_URL`: URL de Mantis
- `REDMINE_URL`: URL de Redmine

### Sincronización Automática

- El backend sincroniza periódicamente tickets de Mantis y Redmine
- Intervalo: 50 segundos (configurable con `SYNC_INTERVAL`)

### Nginx (Frontend)

El archivo `app/react-frontend/nginx.conf` configura:
- Servir la aplicación React desde `/`
- Proxy automático a `/tickets`, `/stats`, `/sync`, `/health`

## Solución de Problemas

### Port ya está en uso
```bash
# Busca qué servicio está usando el puerto (Windows PowerShell)
Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property OwningProcess

# Mata el proceso (reemplaza PID con el número)
Stop-Process -Id <PID> -Force

# O cambia el puerto en docker-compose.yml
# Ejemplo: "5001:5000" en lugar de "5000:5000"
```

### Base de datos no se inicializa
```bash
# Verifica los logs
docker-compose logs db

# Reinicia la base de datos
docker-compose restart db
```

### Frontend no puede conectarse al backend
```bash
# Verifica que el backend esté corriendo
docker-compose logs backend

# Verifica la conectividad de red
docker-compose exec frontend curl http://backend:5000/health
```

### Limpiar todo y empezar de nuevo
```bash
# Detiene y elimina todo
docker-compose down -v

# Elimina las imágenes
docker-compose down -v --rmi all

# Inicia nuevamente (descarga todo desde cero)
docker-compose up -d --build
```

## Desarrollo Local (sin Docker)

Si deseas ejecutar localmente sin Docker:

### Backend
```bash
cd app/backend
cp .env.example .env  # Ajusta DB_HOST a 127.0.0.1
npm install
npm start
```

### Frontend
```bash
cd app/react-frontend
npm install
npm start
```

Nota: Necesitarás tener MySQL ejecutándose localmente.

## Notas Importantes

1. **Redes**: Se crearon dos redes Docker:
   - `main-network`: Para el flujo principal (frontend → backend → db)
   - `itsm-network`: Para Mantis y Redmine

2. **Volúmenes Persistentes**: Los datos de las bases de datos se almacenan en volúmenes Docker, no se pierden al reiniciar

3. **Health Checks**: Backend y MySQL tienen health checks configurados para asegurar que los servicios están listos

4. **Credenciales por defecto**: Cambialas en producción. Ver docker-compose.yml

## API Endpoints Disponibles

- `GET /health` - Estado del servidor
- `GET /tickets` - Obtener todos los tickets (con filtros opcionales)
- `GET /stats` - Estadísticas de tickets
- `POST /sync` - Sincronizar manualmente tickets

## Más Información

Ver archivos README individuales en:
- `app/backend/SETUP.md` - Documentación del backend
- `app/react-frontend/README.md` - Documentación del frontend
