import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setClientError("");

    // Client-side validations
    if (!name.trim()) {
      setClientError("Please provide your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setClientError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setClientError("Password must be at least 6 characters in length.");
      return;
    }

    if (password !== confirmPassword) {
      setClientError("Passwords do not match. Please verify both fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword
      });

      if (res.success) {
        navigate("/");
      } else {
        setClientError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setClientError(err.message || "Network error. Please ensure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page" aria-label="Register for SolVigil">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo-badge">☀️ SolVigil</span>
          <h1>Create an Account</h1>
          <p>Register for heat advisory monitoring and custom location alerts</p>
        </div>

        {clientError && (
          <div className="auth-error-banner" role="alert">
            <span>⚠️ {clientError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g., Rajesh Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="e.g., rajesh.sharma@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password (Minimum 6 characters)</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Register & Sign In"}
          </button>
        </form>


        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
