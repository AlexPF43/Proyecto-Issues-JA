import React, { useState } from 'react';
import { ActionsCell } from './ActionsCell';
import { DetailsModal } from './DetailsModal';

export const Fila = ({ ticket }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
