import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { getHomeRoute } from "../utils/navigation";

const initialState = {
  name: "",
  email: "",
  password: "",
};

export const AuthForm = ({ mode }) => {
  const isSignup = mode === "signup";
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password };

      const data = await apiRequest(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      login({ token: data.token, user: data.user });
      navigate(getHomeRoute(data.user), { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-panel">
      <div className="hero-copy">
        <span className="eyebrow">Internal support made simple</span>
        <h1>Track issues, reduce delays, and keep teams moving.</h1>
        <p>
          Employees can raise tickets in seconds, while admins can prioritize,
          manage, and resolve requests from one place.
        </p>
        <div className="hero-points">
          <span>JWT-based login</span>
          <span>MongoDB-backed tickets</span>
          <span>Admin and employee workflows</span>
        </div>
      </div>

      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>{isSignup ? "Create account" : "Login"}</h2>
        {error && <p className="form-error">{error}</p>}
        {isSignup && (
          <label>
            Full Name
            <input
              name="name"
              onChange={handleChange}
              placeholder="John Doe"
              required
              type="text"
              value={formData.name}
            />
          </label>
        )}
        <label>
          Email
          <input
            name="email"
            onChange={handleChange}
            placeholder="john@company.com"
            required
            type="email"
            value={formData.email}
          />
        </label>
        <label>
          Password
          <input
            minLength="6"
            name="password"
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            required
            type="password"
            value={formData.password}
          />
        </label>
        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="switch-link">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <Link to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Login" : "Create one"}
          </Link>
        </p>
      </form>
    </div>
  );
};
