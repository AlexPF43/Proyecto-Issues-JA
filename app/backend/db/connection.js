// db/connection.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Probar la conexión
pool.getConnection()
  .then(() => console.log('✓ Conectado a MySQL'))
  .catch((err) => console.error('Error conectando a MySQL:', err));

export default pool;
