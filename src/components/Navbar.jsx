import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path ? "nav-link active" : "nav-link";
  }

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
  }

  return (
    <header className="navbar-header">
      <nav className="navbar" aria-label="Main Navigation">
        <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-icon" aria-hidden="true">☀️</span>
          <div className="logo-text">
            <span className="brand-name">SolVigil</span>
            <span className="brand-sub">Heat Intelligence</span>
          </div>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          type="button"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop & Mobile Navigation Links Container */}
        <div className={`nav-menu-wrapper ${mobileMenuOpen ? "open" : ""}`}>
          <div className="nav-main-links">
            <Link
              to="/"
              className={isActive("/")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/forecast"
              className={isActive("/forecast")}
              onClick={() => setMobileMenuOpen(false)}
            >
              7-Day Forecast
            </Link>

            <Link
              to="/alerts"
              className={isActive("/alerts")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Heat Alerts
            </Link>
          </div>

          <div className="nav-divider" aria-hidden="true"></div>

          {/* User Auth Section */}
          <div className="nav-auth-section">
            {user ? (
              <div className="user-profile-badge">
                <span className="user-avatar" aria-hidden="true">👤</span>
                <span className="user-display-name">{user.name.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="nav-logout-btn"
                  title="Sign out of SolVigil"
                  type="button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links-group">
                <Link
                  to="/login"
                  className={isActive("/login")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="nav-register-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
