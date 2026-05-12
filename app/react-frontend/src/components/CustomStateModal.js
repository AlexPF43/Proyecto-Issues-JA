import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/CustomStateModal.css';

export const CustomStateModal = ({ isOpen, onClose }) => {
  const [mappings, setMappings] = useState([]);
  const [source, setSource] = useState('mantis');
  const [customState, setCustomState] = useState('');
  const [parentState, setParentState] = useState('new');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadMappings();
    }
  }, [isOpen]);

  const loadMappings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/custom-states`);
      const data = await response.json();
      setMappings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('No se pudieron cargar los estados personalizados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMapping = async (event) => {
    event.preventDefault();
    setError('');

    if (!customState.trim() || !parentState.trim()) {
      setError('El estado personalizado y el estado padre son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/custom-states`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, custom_state: customState.trim(), parent_state: parentState.trim() })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Error guardando el estado personalizado');
      }

      setCustomState('');
      setParentState('new');
      await loadMappings();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/custom-states/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'No se pudo eliminar el mapeo');
      }
      await loadMappings();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-state-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Estados personalizados</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <form className="mapping-form" onSubmit={handleAddMapping}>
            <div className="form-group">
              <label>Fuente</label>
              <select value={source} onChange={e => setSource(e.target.value)}>
                <option value="mantis">Mantis</option>
                <option value="redmine">Redmine</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estado personalizado</label>
              <input
                type="text"
                value={customState}
                onChange={e => setCustomState(e.target.value)}
                placeholder="Por ejemplo: registro, pdte validación"
              />
            </div>

            <div className="form-group">
              <label>Estado padre</label>
              <input
                type="text"
                value={parentState}
                onChange={e => setParentState(e.target.value)}
                placeholder="Por ejemplo: new, in_progress"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              Guardar estado
            </button>
            {error && <p className="form-error">{error}</p>}
          </form>

          <div className="mapping-list">
            <h3>Lista de estados personalizados</h3>
            {isLoading ? (
              <p>Cargando...</p>
            ) : mappings.length === 0 ? (
              <p>No hay estados personalizados definidos todavía.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Fuente</th>
                    <th>Estado personalizado</th>
                    <th>Estado padre</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map(mapping => (
                    <tr key={mapping.id}>
                      <td>{mapping.source}</td>
                      <td>{mapping.custom_state}</td>
                      <td>{mapping.parent_state}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-small"
                          type="button"
                          onClick={() => handleDelete(mapping.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
