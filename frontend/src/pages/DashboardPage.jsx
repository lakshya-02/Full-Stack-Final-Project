import { useEffect, useMemo, useState } from "react";

import { Layout } from "../components/Layout";
import { TicketFilters } from "../components/TicketFilters";
import { TicketForm } from "../components/TicketForm";
import { TicketList } from "../components/TicketList";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  category: "",
};

export const DashboardPage = ({ adminView = false }) => {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTickets = async (activeFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams(
        Object.entries(activeFilters).filter(([, value]) => value)
      ).toString();
      const data = await apiRequest(`/tickets${query ? `?${query}` : ""}`, {}, token);
      setTickets(data.tickets);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(filters);
  }, []);

  const stats = useMemo(
    () =>
      tickets.reduce(
        (summary, ticket) => {
          summary.total += 1;
          if (ticket.status === "Open") summary.open += 1;
          if (ticket.status === "In Progress") summary.inProgress += 1;
          if (ticket.status === "Resolved") summary.resolved += 1;
          return summary;
        },
        { total: 0, open: 0, inProgress: 0, resolved: 0 }
      ),
    [tickets]
  );

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    fetchTickets(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    fetchTickets(initialFilters);
  };

  const handleCreateTicket = async (ticketData) => {
    setSubmitting(true);
    setError("");

    try {
      await apiRequest(
        "/tickets",
        {
          method: "POST",
          body: JSON.stringify(ticketData),
        },
        token
      );
      await fetchTickets(filters);
      return true;
    } catch (submitError) {
      setError(submitError.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await apiRequest(`/tickets/${ticketId}`, { method: "DELETE" }, token);
      await fetchTickets(filters);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await apiRequest(
        `/tickets/${ticketId}`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        },
        token
      );
      await fetchTickets(filters);
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <Layout>
      <section className="dashboard-grid">
        <div className="dashboard-header card">
          <div>
            <span className="eyebrow">{adminView ? "Admin dashboard" : "Employee dashboard"}</span>
            <h1>Welcome back, {user?.name}</h1>
            <p>
              {adminView
                ? "Manage organization-wide tickets, assign priority, and update statuses."
                : "Create tickets, monitor progress, and stay informed on issue resolution."}
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="card stat-card">
            <strong>{stats.total}</strong>
            <span>Total Tickets</span>
          </div>
          <div className="card stat-card">
            <strong>{stats.open}</strong>
            <span>Open</span>
          </div>
          <div className="card stat-card">
            <strong>{stats.inProgress}</strong>
            <span>In Progress</span>
          </div>
          <div className="card stat-card">
            <strong>{stats.resolved}</strong>
            <span>Resolved</span>
          </div>
        </div>

        {!adminView && <TicketForm onSubmit={handleCreateTicket} submitting={submitting} />}

        <TicketFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {error && <p className="form-error card">{error}</p>}

        {loading ? (
          <div className="card">Loading tickets...</div>
        ) : (
          <TicketList
            isAdmin={adminView}
            onDelete={handleDeleteTicket}
            onStatusChange={handleStatusChange}
            tickets={tickets}
          />
        )}
      </section>
    </Layout>
  );
};
