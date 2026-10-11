import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  if (user) {
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setClientError("");

    // Client-side validations
    if (!email.trim() || !password) {
      setClientError("Please fill in both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setClientError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate("/");
      } else {
        setClientError(res.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setClientError(err.message || "Network error. Please check server status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page" aria-label="Sign In to SolVigil">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo-badge">☀️ SolVigil</span>
          <h1>Welcome Back</h1>
          <p>Sign in to access personalized heat alerts and regional monitoring</p>
        </div>

        {clientError && (
          <div className="auth-error-banner" role="alert">
            <span>⚠️ {clientError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="e.g., rajesh.sharma@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Authenticating..." : "Sign In to Platform"}
          </button>
        </form>


        <div className="auth-footer">
          <p>
            Don't have an account yet?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
