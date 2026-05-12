import pool from '../db/connection.js';

export class CustomStateMapping {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM custom_state_mappings ORDER BY source, parent_state, custom_state';
      const [rows] = await connection.query(query);
      return rows;
    } catch (error) {
      console.error('Error al obtener los mapeos de estados personalizados:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findBySourceAndCustomState(source, customState) {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM custom_state_mappings WHERE source = ? AND LOWER(custom_state) = LOWER(?) LIMIT 1';
      const [rows] = await connection.query(query, [source, customState]);
      return rows[0];
    } catch (error) {
      console.error('Error al buscar el mapeo de estado personalizado:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async create(mapping) {
    const connection = await pool.getConnection();
    try {
      const query = `
        INSERT INTO custom_state_mappings (source, parent_state, custom_state)
        VALUES (?, ?, ?)
      `;
      const [result] = await connection.query(query, [mapping.source, mapping.parent_state, mapping.custom_state]);
      return { id: result.insertId, ...mapping };
    } catch (error) {
      console.error('Error al crear el mapeo de estado personalizado:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteById(id) {
    const connection = await pool.getConnection();
    try {
      const query = 'DELETE FROM custom_state_mappings WHERE id = ?';
      const [result] = await connection.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar el mapeo de estado personalizado:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default CustomStateMapping;
