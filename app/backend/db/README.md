# Configuración de Base de Datos MySQL

## 🚀 Pasos para configurar

### 1️⃣ Instalar MySQL
- **Windows**: Descargar desde https://dev.mysql.com/downloads/mysql/
- **Mac**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

### 2️⃣ Clonar archivo de configuración
```bash
cp .env.example .env
```

### 3️⃣ Editar `.env` con tus credenciales
```bash
# En .env, reemplaza:
DB_PASSWORD=tu_contraseña_segura_aqui
DB_USER=root  # (o el usuario que uses)
DB_HOST=localhost  # Host de MySQL
DB_PORT=3306  # Puerto por defecto de MySQL
```

### 4️⃣ Inicializar la base de datos

#### En Windows:
```bash
cd db
init.bat
```

#### En macOS/Linux:
```bash
cd db
chmod +x init.sh
./init.sh
```

#### O manualmente:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS tickets_db;"
mysql -u root -p tickets_db < db/schema.sql
```

### 5️⃣ Instalar dependencias de Node.js
```bash
npm install
```

### 6️⃣ Iniciar el servidor
```bash
npm start
```

## 📊 Endpoints disponibles

- **GET /tickets** - Obtener todos los tickets
- **POST /tickets** - Crear ticket (con filtros)
- **GET /stats** - Ver estadísticas
- **POST /sync** - Sincronizar manualmente
- **GET /health** - Estado del servidor

## 🗄️ Estructura de datos

### Tabla `tickets`
```
- id (Primary Key, AUTO_INCREMENT)
- external_id (Unique) - ID de Mantis/Redmine
- source (VARCHAR) - 'mantis' o 'redmine'
- title - Título del ticket
- description - Descripción (LONGTEXT)
- status - Estado
- priority - Prioridad
- assigned_to - Asignado a
- created_at - Fecha de creación
- updated_at - Fecha de actualización (actualiza automáticamente)
- external_created_at - Fecha creación en fuente original
- external_updated_at - Fecha actualización en fuente original
- data (JSON) - Datos adicionales
```

### Tabla `sync_log`
Registra cada sincronización:
- source - Fuente (mantis/redmine)
- last_sync - Última sincronización
- total_synced - Total sincronizado

## 🔧 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
Verifica tu contraseña en .env:
```bash
# En Windows, prueba:
mysql -u root -p
# Te pedirá contraseña

# En .env usa esa misma contraseña
DB_PASSWORD=tu_contraseña_correcta
```

### Error: "Can't connect to MySQL server"
- MySQL no está corriendo
- En Windows: Services > MySQL80 > Start
- En Mac: `brew services start mysql`
- En Linux: `sudo systemctl start mysql`

### Error: "database does not exist"
```bash
mysql -u root -p -e "CREATE DATABASE tickets_db;"
mysql -u root -p tickets_db < db/schema.sql
```

### Error: "mysql command not found"
MySQL no está agregado al PATH. Intenta:
- Windows: Reinicia la terminal o añade MySQL al PATH
- Mac/Linux: `which mysql` para verificar la ubicación

## 📝 Variables de entorno importante

```
DB_HOST=localhost       # Host de MySQL (localhost o IP)
DB_PORT=3306           # Puerto por defecto
DB_USER=root           # Usuario de MySQL
DB_PASSWORD=xxxxx      # Tu contraseña
DB_NAME=tickets_db     # Nombre de la BD
PORT=3000              # Puerto del servidor Node.js
SYNC_INTERVAL=50000    # Intervalo de sincronización (ms)
```

## ✨ Características de MySQL

- **ON DUPLICATE KEY UPDATE**: Actualiza automáticamente si el external_id ya existe
- **JSON Storage**: Campo `data` para almacenar información adicional en JSON
- **UTF-8 Support**: Collation `utf8mb4_unicode_ci` para caracteres especiales
- **InnoDB**: Motor de storage confiable con transacciones
- **Auto Timestamp**: `updated_at` se actualiza automáticamente
