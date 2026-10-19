import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import Alerts from "./pages/Alerts";
import CustomAdvisory from "./pages/CustomAdvisory";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <div className="solvigil-app-shell">
          <Navbar />
          <div className="main-content-layout">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/custom-advisory" element={<CustomAdvisory />} />
              <Route path="/advisory-check" element={<CustomAdvisory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <footer className="platform-footer">
            <div className="footer-container">
              <div className="footer-brand">
                <span className="footer-logo">☀️ SolVigil</span>
                <p>AI-Inspired Heat Intelligence & Early Warning Platform</p>
              </div>
              <div className="footer-notes">
                <small>© {new Date().getFullYear()} SolVigil. All rights reserved.</small>
              </div>
            </div>
          </footer>
        </div>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;