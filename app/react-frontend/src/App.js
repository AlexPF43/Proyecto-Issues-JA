import './App.css';
import React, { useState, useEffect } from 'react';
import { FilterModal } from './components/FilterModal';
import { SortDropdown } from './components/SortDropdown';
import { Fila } from './components/Fila';

function App() {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allStatuses, setAllStatuses] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    status: [],
    source: [],
    dateFrom: "",
    dateTo: "",
    sortBy: "external_created_at",
    sortOrder: "DESC"
  });
  const [appliedFilters, setAppliedFilters] = useState({
    title: "",
    status: [],
    source: [],
    dateFrom: "",
    dateTo: "",
    sortBy: "external_created_at",
    sortOrder: "DESC"
  });

  useEffect(() => {
    cargarTickets();
    const interval = setInterval(cargarTickets, 480000);
    return () => clearInterval(interval);
  }, [appliedFilters]);

  async function cargarTickets() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (appliedFilters.title) params.append("title", appliedFilters.title);
      if (appliedFilters.status.length > 0) params.append("status", appliedFilters.status.join(","));
      if (appliedFilters.source.length > 0) params.append("source", appliedFilters.source.join(","));
      if (appliedFilters.dateFrom) params.append("dateFrom", appliedFilters.dateFrom);
      if (appliedFilters.dateTo) params.append("dateTo", appliedFilters.dateTo);
      params.append("sortBy", appliedFilters.sortBy);
      params.append("sortOrder", appliedFilters.sortOrder);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/tickets?${params}`);
      const data = await response.json();

      // Asegurar que data es un array
      const ticketsArray = Array.isArray(data) ? data : (data.tickets || data.issues || []);

      setTickets(ticketsArray);
      setCurrentPage(1);

      // Extraer todos los estados únicos
      const statuses = [...new Set(ticketsArray.map(t => t.status))];
      setAllStatuses(statuses);
    } catch (error) {
      console.error("Error cargando tickets:", error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Manejar cambios en los filtros (solo actualiza el estado local)
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name.startsWith("status-")) {
        const status = name.replace("status-", "");
        setFilters(prev => ({
          ...prev,
          status: checked
            ? [...prev.status, status]
            : prev.status.filter(s => s !== status)
        }));
      } else if (name.startsWith("source-")) {
        const source = name.replace("source-", "");
        setFilters(prev => ({
          ...prev,
          source: checked
            ? [...prev.source, source]
            : prev.source.filter(s => s !== source)
        }));
      }
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Aplicar filtros (copia filters a appliedFilters)
  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    const emptyFilters = {
      title: "",
      status: [],
      source: [],
      dateFrom: "",
      dateTo: "",
      sortBy: "external_created_at",
      sortOrder: "DESC"
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  // Manejar cambios de ordenamiento
  const handleSortChange = (sortBy, sortOrder) => {
    const newSort = { sortBy, sortOrder };
    setFilters(prev => ({ ...prev, ...newSort }));
    setAppliedFilters(prev => ({ ...prev, ...newSort }));
  };

  // Calcular los tickets para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Número total de páginas
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  return (
    <div className="App">
      <header>
        <div className="header-div">
          <h1>PANEL UNFICADO DE INCIDENCIAS</h1>
          <h2>Junta de Andalucía</h2>
        </div>
      </header>
      <main>
        <div className="main-header">
          <h1>Lista de Tickets</h1>
          <div className="header-actions">
            <SortDropdown
              sortBy={appliedFilters.sortBy}
              sortOrder={appliedFilters.sortOrder}
              onSortChange={handleSortChange}
            />
            <button
              className="btn-filters"
              onClick={() => setIsFilterModalOpen(true)}
            >Filtros</button>
            {(appliedFilters.title || appliedFilters.status.length > 0 || appliedFilters.source.length > 0 || appliedFilters.dateFrom || appliedFilters.dateTo) && (
              <span className="filters-active">Filtros activos</span>
            )}
          </div>
        </div>

        {/* Modal de Filtros */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
          onClearFilters={limpiarFiltros}
          allStatuses={allStatuses} />

        {/* Tabla de Tickets */}
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID EXTERNO</th>
              <th>FUENTE</th>
              <th>TÍTULO</th>
              <th>ESTADO</th>
              <th>PRIORIDAD</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="loading">
                  Cargando tickets...
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map(ticket => (
                <Fila key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No se encontraron tickets con los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}

      </main>

      {/* Recuento de tikets */}
      <div className="tickets-summary">
        <h4>Total: {tickets.length} ; Mantis: {tickets.filter(t => t.source === 'mantis').length} -  Redmine: {tickets.filter(t => t.source === 'redmine').length}</h4>
      </div>
    </div>
  );
}

export default App;