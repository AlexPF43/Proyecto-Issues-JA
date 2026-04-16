import React from 'react';

export function SortDropdown({ sortBy, sortOrder, onSortChange }) {
  const handleSortByChange = (e) => {
    onSortChange(e.target.value, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    onSortChange(sortBy, e.target.value);
  };

  return (
    <div className="sort-dropdown-container" style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', marginRight: '15px' }}>
      <label htmlFor="sortBy">Ordenar por:</label>
      <select id="sortBy" value={sortBy} onChange={handleSortByChange} style={{ padding: '5px' }}>
        <option value="external_created_at">Fecha de Creación</option>
        <option value="priority">Prioridad</option>
        <option value="external_updated_at">Última Actualización</option>
      </select>
      
      <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange} style={{ padding: '5px' }}>
        <option value="DESC">Descendente</option>
        <option value="ASC">Ascendente</option>
      </select>
    </div>
  );
}
