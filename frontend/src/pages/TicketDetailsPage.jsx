import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  priority: "Medium",
  status: "Open",
};

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canEditStatus = user?.role === "admin";

  const fetchTicket = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/tickets/${id}`, {}, token);
      setTicket(data.ticket);
      setFormData({
        title: data.ticket.title,
        description: data.ticket.description,
        category: data.ticket.category,
        priority: data.ticket.priority,
        status: data.ticket.status,
      });
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = canEditStatus ? formData : { ...formData, status: undefined };
      const data = await apiRequest(
        `/tickets/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        token
      );

      setTicket(data.ticket);
      setFormData({
        title: data.ticket.title,
        description: data.ticket.description,
        category: data.ticket.category,
        priority: data.ticket.priority,
        status: data.ticket.status,
      });
      setSuccess("Ticket updated successfully.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await apiRequest(`/tickets/${id}`, { method: "DELETE" }, token);
      navigate(user?.role === "admin" ? "/admin" : "/dashboard");
    } catch (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <section className="dashboard-grid">
        <div className="card detail-header">
          <div>
            <span className="eyebrow">Ticket details</span>
            <h1>{ticket?.title || "Ticket"}</h1>
            <p>View the full ticket information and update it when needed.</p>
          </div>
          <Link className="ghost-button" to={user?.role === "admin" ? "/admin" : "/dashboard"}>
            Back to dashboard
          </Link>
        </div>

        {loading ? (
          <div className="card">Loading ticket...</div>
        ) : error && !ticket ? (
          <div className="card form-error">{error}</div>
        ) : (
          <>
            <div className="card detail-grid">
              <div>
                <h2>Current details</h2>
                <p className="detail-copy">{ticket.description}</p>
              </div>
              <div className="ticket-meta detail-meta">
                <span>Status: {ticket.status}</span>
                <span>Priority: {ticket.priority}</span>
                <span>Category: {ticket.category}</span>
                <span>Raised by: {ticket.createdBy?.name || "Unknown"}</span>
              </div>
            </div>

            <form className="card ticket-form" onSubmit={handleSubmit}>
              <div className="section-heading">
                <div>
                  <h2>Edit ticket</h2>
                  <p>Update the ticket information using the form below.</p>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}
              {success && <p className="form-success">{success}</p>}

              <label>
                Title
                <input
                  name="title"
                  onChange={handleChange}
                  required
                  type="text"
                  value={formData.title}
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  onChange={handleChange}
                  required
                  rows="5"
                  value={formData.description}
                />
              </label>

              <div className="form-grid">
                <label>
                  Category
                  <input
                    name="category"
                    onChange={handleChange}
                    required
                    type="text"
                    value={formData.category}
                  />
                </label>

                <label>
                  Priority
                  <select name="priority" onChange={handleChange} value={formData.priority}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
              </div>

              {canEditStatus && (
                <label>
                  Status
                  <select name="status" onChange={handleChange} value={formData.status}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </label>
              )}

              <div className="ticket-actions">
                <button className="primary-button" disabled={saving} type="submit">
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  className="danger-button"
                  disabled={deleting}
                  onClick={handleDelete}
                  type="button"
                >
                  {deleting ? "Deleting..." : "Delete ticket"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </Layout>
  );
};
