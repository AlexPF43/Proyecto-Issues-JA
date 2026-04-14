// models/Ticket.js
import pool from '../db/connection.js';

export class Ticket {
  /**
   * Guardar o actualizar un ticket en la base de datos
   */
  static async upsert(ticketData) {
    const connection = await pool.getConnection();
    
    try {
      const {
        external_id,
        source,
        title,
        description,
        status,
        priority,
        assigned_to,
        external_created_at,
        external_updated_at,
        data,
      } = ticketData;

      const query = `
        INSERT INTO tickets (
          external_id, source, title, description, status, 
          priority, assigned_to, external_created_at, external_updated_at, data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          description = VALUES(description),
          status = VALUES(status),
          priority = VALUES(priority),
          assigned_to = VALUES(assigned_to),
          external_updated_at = VALUES(external_updated_at),
          data = VALUES(data),
          updated_at = CURRENT_TIMESTAMP
      `;

      const result = await connection.query(query, [
        external_id,
        source,
        title,
        description,
        status,
        priority,
        assigned_to,
        external_created_at,
        external_updated_at,
        JSON.stringify(data),
      ]);

      return result[0];
    } catch (error) {
      console.error('Error al guardar ticket:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener todos los tickets con filtros opcionales
   */
  static async findAll(filters = {}) {
    const connection = await pool.getConnection();
    
    try {
      let query = 'SELECT * FROM tickets WHERE 1=1';
      const params = [];

      if (filters.source) {
        if (Array.isArray(filters.source)) {
          const placeholders = filters.source.map(() => '?').join(',');
          query += ` AND source IN (${placeholders})`;
          params.push(...filters.source);
        } else {
          query += ' AND source = ?';
          params.push(filters.source);
        }
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          const placeholders = filters.status.map(() => '?').join(',');
          query += ` AND status IN (${placeholders})`;
          params.push(...filters.status);
        } else {
          query += ' AND status = ?';
          params.push(filters.status);
        }
      }

      if (filters.title) {
        query += ' AND title LIKE ?';
        params.push(`%${filters.title}%`);
      }

      if (filters.dateFrom) {
        query += ' AND external_created_at >= ?';
        params.push(filters.dateFrom);
      }

      if (filters.dateTo) {
        query += ' AND external_created_at <= ?';
        params.push(filters.dateTo);
      }

      const allowedSortColumns = {
        'external_created_at': 'external_created_at',
        'priority': 'priority',
        'external_updated_at': 'external_updated_at'
      };
      
      const sortColumn = allowedSortColumns[filters.sortBy] || 'external_created_at';
      const sortOrder = (filters.sortOrder && filters.sortOrder.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

      query += ` ORDER BY ${sortColumn} ${sortOrder}`;

      const [rows] = await connection.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener un ticket por ID externo
   */
  static async findByExternalId(externalId) {
    const connection = await pool.getConnection();
    
    try {
      const query = 'SELECT * FROM tickets WHERE external_id = ?';
      const [rows] = await connection.query(query, [externalId]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener ticket:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Eliminar todos los tickets
   */
  static async deleteAll() {
    const connection = await pool.getConnection();
    
    try {
      const query = 'DELETE FROM tickets';
      const result = await connection.query(query);
      return result[0].affectedRows;
    } catch (error) {
      console.error('Error al eliminar tickets:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Contar tickets por filtros
   */
  static async count(filters = {}) {
    const connection = await pool.getConnection();
    
    try {
      let query = 'SELECT COUNT(*) as count FROM tickets WHERE 1=1';
      const params = [];

      if (filters.source) {
        query += ' AND source = ?';
        params.push(filters.source);
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          const placeholders = filters.status.map(() => '?').join(',');
          query += ` AND status IN (${placeholders})`;
          params.push(...filters.status);
        } else {
          query += ' AND status = ?';
          params.push(filters.status);
        }
      }

      const [rows] = await connection.query(query, params);
      return parseInt(rows[0].count);
    } catch (error) {
      console.error('Error al contar tickets:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Ticket;
