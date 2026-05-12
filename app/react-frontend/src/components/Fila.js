import React, { useState } from 'react';
import { ActionsCell } from './ActionsCell';
import { DetailsModal } from './DetailsModal';

export const Fila = ({ ticket }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Función para calcular el semáforo de cumplimiento ANS
  const getAnsData = () => {
    const normalizedStatus = (ticket.mapped_status || ticket.status || '').toString().trim().toLowerCase();
    if (['new', 'nuevo', 'nueva'].indexOf(normalizedStatus) === -1) return null;

    const createdAtValue = ticket.external_created_at || ticket.created_at;
    const createdAt = new Date(createdAtValue);
    if (!createdAtValue || isNaN(createdAt.getTime())) return null;

    const now = new Date();
    const elapsed = (now - createdAt) / (1000 * 60 * 60); // horas transcurridas

    const normalizedPriority = (ticket.priority || '').toString().trim().toLowerCase();
    const isUrgent = normalizedPriority.includes('urg') || normalizedPriority.includes('alta');
    const limit = isUrgent ? 6 : 8;

    const percentage = elapsed / limit;
    const color = percentage >= 1 ? 'rojo' : percentage >= 0.75 ? 'amarillo' : 'verde';
    const remaining = Math.max(limit - elapsed, 0);
    const hoursText = elapsed >= limit
      ? `+${(elapsed - limit).toFixed(1)}h`
      : `${remaining.toFixed(1)}h`;

    return { color, hoursText };
  };

  const ansData = getAnsData();

  // Manejo de detalles del ticket
  const handleDetailsClick = () => {
    setIsDetailsModalOpen(true);
  };

  // Manejo de ir a issue
  const handleIssueClick = () => {
    let issueUrl = '';
    const id = ticket.external_id;
    if (ticket.source === 'mantis') {
      issueUrl = process.env.REACT_APP_MANTIS_URL + "/view.php?id=" + id;
    } else if (ticket.source === 'redmine') {
      issueUrl = process.env.REACT_APP_REDMINE_URL + "/issues/" + id;
    }
    if (issueUrl) {
      window.open(issueUrl, '_blank');
    }
  };

  return (
    <>
      <tr>
        <td>{ticket.external_id}</td>
        <td>{ticket.source}</td>
        <td>{ticket.title}</td>
        <td>{ticket.status}</td>
        <td>{ticket.priority}</td>
        <td>
          {ansData ? (
            <div className="ans-cell">
              <div className={`semaforo ${ansData.color}`}></div>
              <span className="ans-text">{ansData.hoursText}</span>
            </div>
          ) : '-'}
        </td>
        <td>
          <ActionsCell
            ticket={ticket}
            onDetailsClick={handleDetailsClick}
            onIssueClick={handleIssueClick}
          />
        </td>
      </tr>
      <DetailsModal
        isOpen={isDetailsModalOpen}
        ticket={ticket}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};
