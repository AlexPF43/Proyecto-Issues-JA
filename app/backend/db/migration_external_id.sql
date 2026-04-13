-- Script de migración: Cambiar external_id a número entero
-- Este script convierte external_id de VARCHAR a INT

-- Primero, actualizar los datos existentes removiendo los prefijos
UPDATE tickets 
SET external_id = CAST(SUBSTRING_INDEX(external_id, '_', -1) AS UNSIGNED)
WHERE external_id LIKE 'mantis_%' OR external_id LIKE 'redmine_%';

-- Cambiar el tipo de columna
ALTER TABLE tickets 
MODIFY COLUMN external_id INT NOT NULL,
DROP INDEX idx_tickets_external_id;

-- Recrear la constraint UNIQUE considerando tanto external_id como source
ALTER TABLE tickets 
ADD UNIQUE KEY unique_external_id_source (external_id, source),
ADD INDEX idx_tickets_external_id (external_id);

-- Verificar los cambios
DESCRIBE tickets;
SELECT external_id, source, title FROM tickets LIMIT 5;
