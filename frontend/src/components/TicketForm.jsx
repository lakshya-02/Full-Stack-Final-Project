import { useState } from "react";

const emptyTicket = {
  title: "",
  description: "",
  category: "",
  priority: "Medium",
};

export const TicketForm = ({ onSubmit, submitting }) => {
  const [formData, setFormData] = useState(emptyTicket);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await onSubmit(formData);

    if (created) {
      setFormData(emptyTicket);
    }
  };

  return (
    <form className="card ticket-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <h2>Create Ticket</h2>
          <p>Raise a new internal support request.</p>
        </div>
      </div>
      <label>
        Title
        <input
          name="title"
          onChange={handleChange}
          placeholder="Laptop not connecting to VPN"
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
          placeholder="Describe the issue with useful details"
          required
          rows="4"
          value={formData.description}
        />
      </label>
      <div className="form-grid">
        <label>
          Category
          <input
            name="category"
            onChange={handleChange}
            placeholder="IT, HR, Payroll"
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
      <button className="primary-button" disabled={submitting} type="submit">
        {submitting ? "Creating..." : "Submit Ticket"}
      </button>
    </form>
  );
};
