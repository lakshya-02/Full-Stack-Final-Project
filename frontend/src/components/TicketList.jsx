import { useState } from "react";
import { Link } from "react-router-dom";

export const TicketList = ({ tickets, isAdmin, onDelete, onStatusChange }) => {
  const [processingId, setProcessingId] = useState("");

  const handleStatusChange = async (ticketId, status) => {
    setProcessingId(ticketId);
    await onStatusChange(ticketId, status);
    setProcessingId("");
  };

  const handleDelete = async (ticketId) => {
    setProcessingId(ticketId);
    await onDelete(ticketId);
    setProcessingId("");
  };

  if (!tickets.length) {
    return (
      <div className="card empty-state">
        <h3>No tickets found</h3>
        <p>Try adjusting your filters or create a new ticket to get started.</p>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <article className="card ticket-card" key={ticket._id}>
          <div className="ticket-header">
            <div>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
            </div>
            <span className={`badge badge-${ticket.priority.toLowerCase()}`}>
              {ticket.priority}
            </span>
          </div>

          <div className="ticket-meta">
            <span>Status: {ticket.status}</span>
            <span>Category: {ticket.category}</span>
            <span>Raised by: {ticket.createdBy?.name || "Unknown"}</span>
          </div>

          <div className="ticket-actions">
            <Link className="ghost-button ticket-link" to={`/tickets/${ticket._id}`}>
              View Details
            </Link>
            {isAdmin && (
              <select
                disabled={processingId === ticket._id}
                onChange={(event) => handleStatusChange(ticket._id, event.target.value)}
                value={ticket.status}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            )}
            <button
              className="danger-button"
              disabled={processingId === ticket._id}
              onClick={() => handleDelete(ticket._id)}
              type="button"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};
