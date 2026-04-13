-- db/schema.sql
-- Script completo para crear las tablas de tickets

-- Eliminar tablas existentes si las hay
DROP TABLE IF EXISTS sync_log;
DROP TABLE IF EXISTS tickets;

-- Tabla para almacenar tickets sincronizados
CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_id INT NOT NULL,
  source VARCHAR(50) NOT NULL COMMENT 'mantis o redmine',
  title VARCHAR(500) NOT NULL,
  description LONGTEXT,
  status VARCHAR(100),
  priority VARCHAR(50),
  created_by VARCHAR(255) COMMENT 'Persona que abre la petición',
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  external_created_at DATETIME,
  external_updated_at DATETIME,
  data JSON COMMENT 'Datos adicionales en JSON (info_extra)',
  UNIQUE KEY unique_external_id_source (external_id, source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar consultas
CREATE INDEX idx_tickets_source ON tickets(source);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_external_id ON tickets(external_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- Tabla para sincronización de último timestamp
CREATE TABLE sync_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  last_sync DATETIME,
  total_synced INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
