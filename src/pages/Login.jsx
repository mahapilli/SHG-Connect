
import {
  LogIn,
  ArrowLeft,
  Mail,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/useApp";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    login(role);
    const requestedPath = location.state?.from?.pathname;
    const canOpenPortal = role === "Admin" || role === "SHG Member";
    if (role === "Admin") {
      navigate(canOpenPortal && requestedPath ? requestedPath : "/dashboard", { replace: true });
    } else if (role === "SHG Member") {
      navigate(canOpenPortal && requestedPath ? requestedPath : "/dashboard", { replace: true });
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <Link to="/" className="login-logo">
            <div className="login-logo-mark">S</div>
            <div className="login-logo-text">
              <strong>SHG Connect</strong>
              <span>Empowering Women</span>
            </div>
          </Link>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">
              <LogIn size={24} />
            </div>

            <span className="page-eyebrow">SHG CONNECT</span>
            <h1>Welcome Back</h1>
            <p>Sign in to access your SHG Connect account.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <LockKeyhole size={18} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="role">Login As</label>
              <div className="login-input-wrapper">
                <UserRound size={18} />
                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option value="Customer">Customer</option>
                  <option value="SHG Member">SHG Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-submit">
              <LogIn size={18} />
              Login
            </button>
          </form>

          <div className="login-status">
            <ShieldCheck size={20} />
            <div>
              <h3>Choose your workspace</h3>
              <p>
                Members get financial tools and product management. Customers
                go straight to the marketplace.
              </p>
            </div>
          </div>

          <Link to="/" className="login-back">
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
