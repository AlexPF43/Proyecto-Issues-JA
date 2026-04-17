-- db/schema.sql
-- Script completo para crear las tablas de tickets

-- Eliminar tablas existentes si las hay
DROP TABLE IF EXISTS sync_log;
DROP TABLE IF EXISTS tickets;

CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `external_id` int NOT NULL,
  `source` varchar(50) NOT NULL COMMENT 'mantis o redmine',
  `title` varchar(500) NOT NULL,
  `description` longtext,
  `status` varchar(100) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL COMMENT 'Persona que abre la petición',
  `assigned_to` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `external_created_at` datetime DEFAULT NULL,
  `external_updated_at` datetime DEFAULT NULL,
  `data` json DEFAULT NULL COMMENT 'Datos adicionales en JSON (info_extra)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_external_id_source` (`external_id`,`source`),
  KEY `idx_tickets_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=5281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar consultas
CREATE INDEX idx_tickets_source ON tickets(source);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_external_id ON tickets(external_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- Tabla para sincronización de último timestamp
CREATE TABLE `sync_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source` varchar(50) NOT NULL,
  `last_sync` datetime DEFAULT NULL,
  `total_synced` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
