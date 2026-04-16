import React from 'react';
import '../styles/ActionsCell.css';

export const ActionsCell = ({ ticket, onDetailsClick, onIssueClick }) => {
  return (
    <div className="actions-cell">
      <button 
        className="btn-action btn-details"
        onClick={() => onDetailsClick(ticket)}
        title="Ver detalles completos del ticket"
      >Detalles</button>
      <button 
        className="btn-action btn-issue"
        onClick={() => onIssueClick(ticket)}
        title={`Abrir en ${ticket.source === 'mantis' ? 'MantisBT' : 'Redmine'}`}
      >Issue</button>
    </div>
  );
};
