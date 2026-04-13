# 🗄️ Configuración de Base de Datos - Guía Rápida

## ✅ Cambios realizados

Tu aplicación ahora almacena tickets en **MySQL** en lugar de memoria.

### Nuevos archivos creados:

📁 **Carpeta `db/`**
- `connection.js` - Conexión a MySQL
- `schema.sql` - Estructura de tablas
- `init.sh` / `init.bat` - Scripts de inicialización
- `README.md` - Documentación detallada

📄 **Archivos modificados:**
- `package.json` - Agregadas dependencias: `mysql2`, `dotenv`
- `services/ticketService.js` - Ahora guarda en BD
- `server.js` - Nuevo endpoint de sincronización `/sync`

📄 **Archivos nuevos:**
- `config.js` - Gestión de variables de entorno
- `models/Ticket.js` - Modelo de datos con métodos CRUD
- `.env.example` - Plantilla de configuración

---

## 🚀 Pasos para poner en marcha

### 1. Instalar MySQL
- **Windows**: https://dev.mysql.com/downloads/mysql/
- **Mac**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

### 2. Configurar credenciales
```bash
cp .env.example .env
# Edita .env con tus credenciales de MySQL
```

### 3. Crear base de datos
```bash
# Windows:
cd db && init.bat

# Mac/Linux:
cd db && ./init.sh

# O manualmente:
mysql -u root -p -e "CREATE DATABASE tickets_db;"
mysql -u root -p tickets_db < db/schema.sql
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Iniciar servidor
```bash
npm start
```

---

## 📊 Nuevos endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/sync` | Sincronizar tickets ahora |
| GET | `/stats` | Ver estadísticas de tickets |
| GET | `/health` | Estado del servidor |
| POST | `/tickets` | Crear/filtrar tickets |

---

## 🔑 Variables de .env
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tickets_db
```

¡Listo! Los tickets ahora se guardaran en MySQL automáticamente.
