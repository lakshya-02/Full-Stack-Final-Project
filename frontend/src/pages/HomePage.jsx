import { Link, Navigate } from "react-router-dom";

import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getHomeRoute } from "../utils/navigation";

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getHomeRoute(user)} replace />;
  }

  return (
    <Layout>
      <section className="landing">
        <div className="landing-card">
          <span className="eyebrow">Corporate Helpdesk Ticketing System</span>
          <h1>Support workflows built for fast internal resolution.</h1>
          <p>
            Centralize issue reporting, track progress in real time, and give support
            teams a clear queue to manage.
          </p>
          <div className="landing-highlights">
            <div>
              <strong>Raise tickets faster</strong>
              <span>Submit issues with category and priority in one simple flow.</span>
            </div>
            <div>
              <strong>Stay on top of progress</strong>
              <span>Track open, in-progress, and resolved requests from the dashboard.</span>
            </div>
            <div>
              <strong>Give admins full control</strong>
              <span>Review every ticket, update statuses, and keep the queue organized.</span>
            </div>
          </div>
          <div className="landing-actions">
            <Link className="primary-button" to="/signup">
              Get Started
            </Link>
            <Link className="ghost-button" to="/login">
              Login
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
