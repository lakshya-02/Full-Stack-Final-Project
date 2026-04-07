import { Link, Navigate } from "react-router-dom";

import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
