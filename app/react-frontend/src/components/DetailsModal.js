import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/DetailsModal.css';

export const DetailsModal = ({ isOpen, ticket, onClose }) => {
  if (!isOpen || !ticket) return null;

  // Función para generar la URL de la issue según la fuente
  const getIssueUrl = () => {
    const id = ticket.external_id;
    if (ticket.source === 'mantis') {
      // Extraer el ID numérico de external_id si es necesario
      console.log("ID de mantis:" + id);

      return `${process.env.REACT_APP_MANTIS_URL}/view.php?id=${id}`;
    } else if (ticket.source === 'redmine') {
      console.log("ID de redmine:" + id);
      return `${process.env.REACT_APP_REDMINE_URL}/issues/${id}`;
    }
    return '#';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Ticket</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">

            <div className="detail-row">
              <label>ID Externo:</label>
              <span className="detail-value">{ticket.external_id}</span>
            </div>

            <div className="detail-row">
              <label>ID Interno (BD):</label>
              <span className="detail-value">{ticket.id}</span>
            </div>

            <div className="detail-row">
              <label>Fuente:</label>
              <span className={`source-badge source-${ticket.source}`}>
                {ticket.source.toUpperCase()}
              </span>
            </div>

            <div className="detail-row">
              <label>Título:</label>
              <span className="detail-value">{ticket.title}</span>
            </div>

            <div className="detail-row">
              <label>Estado:</label>
              <span className={`status-badge status-${ticket.status?.toLowerCase()}`}>
                {ticket.status}
              </span>
            </div>

            <div className="detail-row">
              <label>Prioridad:</label>
              <span className={`priority-badge priority-${ticket.priority?.toLowerCase()}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Información Adicional</h3>

            <div className="detail-row">
              <label>Creado por:</label>
              <span className="detail-value">{ticket.created_by || 'Desconocido'}</span>
            </div>

            <div className="detail-row">
              <label>Asignado a:</label>
              <span className="detail-value">{ticket.assigned_to || 'Sin asignar'}</span>
            </div>

            <div className="detail-row">
              <label>Fecha de Creación:</label>
              <span className="detail-value">{formatDate(ticket.created_at)}</span>
            </div>

            <div className="detail-row">
              <label>Última Actualización:</label>
              <span className="detail-value">{formatDate(ticket.updated_at)}</span>
            </div>

            <div className="detail-row">
              <label>Creación Externa:</label>
              <span className="detail-value">{formatDate(ticket.external_created_at)}</span>
            </div>

            <div className="detail-row">
              <label>Actualización Externa:</label>
              <span className="detail-value">{formatDate(ticket.external_updated_at)}</span>
            </div>
          </div>

          {ticket.description && (
            <div className="detail-section">
              <h3>Descripción</h3>
              <div className="description-box">
                {ticket.description}
              </div>
            </div>
          )}

          {ticket.data && (
            <div className="detail-section">
              <h3>Datos Adicionales</h3>
              <pre className="data-box">
                {JSON.stringify(ticket.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <a
            href={getIssueUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            🔗 Ir a {ticket.source === 'mantis' ? 'MantisBT' : 'Redmine'}
          </a>
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>,
    document.body
  );
};
