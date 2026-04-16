import React from 'react';
import '../styles/FilterModal.css';

export const FilterModal = ({ isOpen, onClose, filters, onFilterChange, onApplyFilters, onClearFilters, allStatuses }) => {
  if (!isOpen) return null;

  const allSources = ["mantis", "redmine"];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Filtros de Tickets</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Filtro por nombre */}
          <div className="filter-group">
            <label>Buscar por nombre:</label>
            <input
              type="text"
              name="title"
              placeholder="Título o descripción..."
              value={filters.title}
              onChange={onFilterChange}
              className="filter-input"
            />
          </div>

          {/* Filtro por fechas */}
          <div className="filter-group">
            <label>Rango de fechas:</label>
            <div className="date-inputs">
              <div>
                <label htmlFor="dateFrom">Desde:</label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={onFilterChange}
                  className="filter-input"
                />
              </div>
              <div>
                <label htmlFor="dateTo">Hasta:</label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={onFilterChange}
                  className="filter-input"
                />
              </div>
            </div>
          </div>

          {/* Filtro por estados */}
          <div className="filter-group">
            <label>Estados:</label>
            <div className="checkbox-group">
              {allStatuses.length > 0 ? (
                allStatuses.map(status => (
                  <label key={status} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onChange={onFilterChange}
                    />
                    {status}
                  </label>
                ))
              ) : (
                <p className="no-options">Cargando estados...</p>
              )}
            </div>
          </div>

          {/* Filtro por ITSM */}
          <div className="filter-group">
            <label>ITSM (Fuente):</label>
            <div className="checkbox-group">
              {allSources.map(source => (
                <label key={source} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={`source-${source}`}
                    checked={filters.source.includes(source)}
                    onChange={onFilterChange}
                  />
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-clear" onClick={onClearFilters}>
            Limpiar Filtros
          </button>
          <button className="btn-apply" onClick={onApplyFilters}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
