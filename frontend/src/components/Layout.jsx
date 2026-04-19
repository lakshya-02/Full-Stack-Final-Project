import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getHomeRoute } from "../utils/navigation";

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to={user ? getHomeRoute(user) : "/"}>
          Corporate Helpdesk
        </Link>
        <nav className="nav-links">
          {user && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              {user.role === "admin" && <NavLink to="/admin">Admin Panel</NavLink>}
              <button className="ghost-button" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main className="page">{children}</main>
    </div>
  );
};
