export const TicketFilters = ({ filters, onChange, onReset }) => (
  <div className="card filters">
    <div className="section-heading">
      <div>
        <h2>Search & Filter</h2>
        <p>Refine the ticket list by status, priority, or category.</p>
      </div>
      <button className="ghost-button" onClick={onReset} type="button">
        Reset
      </button>
    </div>
    <div className="filter-grid">
      <label>
        Search
        <input
          name="search"
          onChange={onChange}
          placeholder="Search title or description"
          type="text"
          value={filters.search}
        />
      </label>
      <label>
        Status
        <select name="status" onChange={onChange} value={filters.status}>
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </label>
      <label>
        Priority
        <select name="priority" onChange={onChange} value={filters.priority}>
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>
      <label>
        Category
        <input
          name="category"
          onChange={onChange}
          placeholder="Filter by category"
          type="text"
          value={filters.category}
        />
      </label>
    </div>
  </div>
);
