import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AdvisoryCard from "../components/AdvisoryCard";

function CustomAdvisory() {
  const { user, login, register } = useAuth();

  // Temperature input states
  const [ambientTemp, setAmbientTemp] = useState("");
  const [expectedPeak, setExpectedPeak] = useState("");
  const [locationName, setLocationName] = useState("");
  const [humidity, setHumidity] = useState("");

  // Advisory calculation state
  const [evaluation, setEvaluation] = useState(null);
  const [formError, setFormError] = useState("");

  // Auth popup modal states: initialize to true if user is not logged in
  const [showAuthModal, setShowAuthModal] = useState(() => !user);
  const [hasPromptedModal, setHasPromptedModal] = useState(() => !user);
  const [authTab, setAuthTab] = useState("login"); // 'login' or 'register'

  // Handle escape key to dismiss modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && showAuthModal) {
        setShowAuthModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAuthModal]);

  // Handle focus on inputs to prompt login popup if not shown yet
  function handleInputFocus() {
    if (!user && !hasPromptedModal) {
      setShowAuthModal(true);
      setHasPromptedModal(true);
    }
  }

  // Handle Auth Modal Submission
  async function handleModalAuthSubmit(e) {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");

    if (!modalEmail.trim() || !modalPassword) {
      setModalError("Please enter both email and password.");
      return;
    }

    setIsSubmittingAuth(true);
    try {
      if (authTab === "login") {
        const res = await login(modalEmail.trim(), modalPassword);
        if (res.success) {
          setModalSuccess("Successfully signed in! You can now proceed.");
          setTimeout(() => {
            setShowAuthModal(false);
          }, 600);
        } else {
          setModalError(res.message || "Sign in failed. Please check credentials.");
        }
      } else {
        if (!modalName.trim()) {
          setModalError("Please enter your name.");
          setIsSubmittingAuth(false);
          return;
        }
        const res = await register({
          name: modalName.trim(),
          email: modalEmail.trim(),
          password: modalPassword,
          role: modalRole
        });
        if (res.success) {
          setModalSuccess("Account created successfully! You are now signed in.");
          setTimeout(() => {
            setShowAuthModal(false);
          }, 600);
        } else {
          setModalError(res.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      setModalError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  // Calculate advisory based on ambient temperature and expected peak (corresponding to heat alerts rules)
  function calculateAdvisory(ambientVal, peakVal, customLoc = "") {
    const amb = parseFloat(ambientVal);
    const pk = parseFloat(peakVal);

    if (isNaN(amb) && isNaN(pk)) {
      setFormError("Please enter at least the ambient temperature or expected peak.");
      return;
    }

    setFormError("");

    const effectiveAmb = isNaN(amb) ? pk : amb;
    const effectivePk = isNaN(pk) ? amb : pk;
    const maxTemp = Math.max(effectiveAmb, effectivePk);
    const hum = parseFloat(humidity);

    let severity = "Low";
    let title = "Mild Seasonal Thermal Advisory";
    let symbol = "🌱";
    let description = "";
    let peakWindow = "1:00 PM - 3:00 PM";
    let safetyProtocol = "";

    // Exact threshold logic aligned with SolVigil heat risk model and Heat Alerts page
    if (effectiveAmb >= 44 || effectivePk >= 45 || maxTemp >= 44 || (effectiveAmb >= 41 && !isNaN(hum) && hum >= 60)) {
      severity = "Extreme";
      title = "Extreme Heatwave Warning";
      symbol = "🚨";
      description = `Severe heatwave conditions identified for ambient temperature of ${effectiveAmb.toFixed(1)}°C with peak reaching ${effectivePk.toFixed(1)}°C. High risk of heat stroke, thermal distress, and acute dehydration. Avoid non-emergency outdoor exposure.`;
      peakWindow = "1:30 PM - 4:30 PM";
      safetyProtocol = "Avoid all direct outdoor sun exposure between 11:30 AM and 4:30 PM. Drink 3–4 litres of clean water or oral rehydration solution (ORS). Provide shaded cooling for vulnerable individuals and livestock.";
    } else if (effectiveAmb >= 39 || effectivePk >= 40 || maxTemp >= 39) {
      severity = "High";
      title = "Elevated Heat Advisory";
      symbol = "⚠️";
      description = `Elevated thermal stress detected with ambient temperature of ${effectiveAmb.toFixed(1)}°C and peak forecast of ${effectivePk.toFixed(1)}°C. High likelihood of heat exhaustion and severe muscle cramps with prolonged midday exposure.`;
      peakWindow = "12:00 PM - 3:30 PM";
      safetyProtocol = "Minimise strenuous outdoor physical exertion during midday. Hydrate frequently before feeling thirsty and wear loose, breathable, light-coloured cotton clothing.";
    } else if (effectiveAmb >= 33 || effectivePk >= 35 || maxTemp >= 33) {
      severity = "Moderate";
      title = "Afternoon Heat Advisory";
      symbol = "☀️";
      description = `Moderate heat levels detected (Ambient: ${effectiveAmb.toFixed(1)}°C, Expected Peak: ${effectivePk.toFixed(1)}°C). Prolonged outdoor exertion may cause fatigue. Hydration breaks and shade precautions recommended.`;
      peakWindow = "1:00 PM - 4:00 PM";
      safetyProtocol = "Maintain routine water intake throughout daylight hours. Schedule regular shade rest intervals during outdoor tasks and monitor children and pets.";
    } else {
      severity = "Low";
      title = "Mild Seasonal Heat Advisory";
      symbol = "☀️";
      description = `Mild thermal conditions within normal physiological limits (Ambient: ${effectiveAmb.toFixed(1)}°C, Peak: ${effectivePk.toFixed(1)}°C). Minimal heat-related physiological strain for the general public.`;
      peakWindow = "1:00 PM - 3:00 PM";
      safetyProtocol = "Standard seasonal precautions apply. Maintain baseline daily hydration and standard sun protection during outdoor recreational activities.";
    }

    setEvaluation({
      ambient: effectiveAmb.toFixed(1),
      expectedPeak: effectivePk.toFixed(1),
      severity,
      title,
      symbol,
      description,
      peakWindow,
      safetyProtocol,
      location: (customLoc || locationName).trim() || "Local Area",
      evaluatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    calculateAdvisory(ambientTemp, expectedPeak);
  }

  // Quick preset buttons for instant evaluation
  function handlePreset(amb, pk, label) {
    setAmbientTemp(amb.toString());
    setExpectedPeak(pk.toString());
    setLocationName(label);
    calculateAdvisory(amb, pk, label);
  }

  function handleReset() {
    setAmbientTemp("");
    setExpectedPeak("");
    setLocationName("");
    setHumidity("");
    setEvaluation(null);
    setFormError("");
  }

  function getSeverityClass(sev) {
    switch (sev) {
      case "Extreme":
        return "alert-extreme";
      case "High":
        return "alert-high";
      case "Moderate":
        return "alert-moderate";
      case "Low":
      default:
        return "alert-low";
    }
  }

  return (
    <main className="custom-advisory-page alerts-page" aria-label="Custom Heat Advisory Checker">
      {/* Page Header */}
      <div className="alerts-header">
        <p className="page-label">SOLVIGIL PERSONALIZED THERMAL INTELLIGENCE</p>
        <h1>Custom Advisory & Heat Risk Check</h1>
        <p>
          Enter your current ambient temperature and expected peak conditions to generate real-time thermal risk assessments and stakeholder-specific safety advisories corresponding to the official heat alerts system.
        </p>
      </div>

      {/* Guest Notice Banner if not logged in */}
      {!user && (
        <div className="guest-advisory-banner">
          <div className="guest-banner-left">
            <span className="guest-banner-icon">👤</span>
            <div>
              <strong>Using SolVigil as a Guest</strong>
              <p>You can freely calculate custom advisories without logging in. Sign in anytime to sync personal regional alerts.</p>
            </div>
          </div>
          <button
            type="button"
            className="guest-banner-action-btn"
            onClick={() => {
              setModalError("");
              setModalSuccess("");
              setShowAuthModal(true);
            }}
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Input Form Card */}
      <section className="custom-input-card">
        <div className="custom-card-header">
          <div className="custom-card-title">
            <span className="title-icon">🌡️</span>
            <div>
              <h2>Enter Local Temperature Parameters</h2>
              <p>Provide the temperatures you observe or forecast in your area</p>
            </div>
          </div>

          <div className="preset-buttons-group">
            <span className="presets-label">Quick Presets:</span>
            <button
              type="button"
              className="preset-btn preset-extreme"
              onClick={() => handlePreset(44, 45, "Delhi NCR")}
            >
              🚨 Extreme (44°/45°)
            </button>
            <button
              type="button"
              className="preset-btn preset-high"
              onClick={() => handlePreset(39, 40, "Mumbai Coast")}
            >
              ⚠️ High (39°/40°)
            </button>
            <button
              type="button"
              className="preset-btn preset-moderate"
              onClick={() => handlePreset(35, 36, "Pune Region")}
            >
              ☀️ Moderate (35°/36°)
            </button>
            <button
              type="button"
              className="preset-btn preset-low"
              onClick={() => handlePreset(30, 31, "Bengaluru")}
            >
              🌱 Mild (30°/31°)
            </button>
          </div>
        </div>

        {formError && (
          <div className="auth-error-banner" role="alert" style={{ marginBottom: "16px" }}>
            <span>⚠️ {formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="custom-advisory-form">
          <div className="form-fields-grid">
            {/* Ambient Temperature Field */}
            <div className="form-field-item">
              <label htmlFor="ambient-temp-input">
                <span className="field-required-dot">●</span> Current Ambient Temperature (°C)
              </label>
              <div className="input-with-unit">
                <input
                  id="ambient-temp-input"
                  type="number"
                  step="0.1"
                  min="-10"
                  max="65"
                  placeholder="e.g. 42.5"
                  value={ambientTemp}
                  onFocus={handleInputFocus}
                  onChange={(e) => setAmbientTemp(e.target.value)}
                  required
                />
                <span className="unit-badge">°C</span>
              </div>
              <small className="field-hint">Current shaded outdoor temperature</small>
            </div>

            {/* Expected Peak Temperature Field */}
            <div className="form-field-item">
              <label htmlFor="peak-temp-input">
                <span className="field-required-dot">●</span> Expected Peak Temperature (°C)
              </label>
              <div className="input-with-unit">
                <input
                  id="peak-temp-input"
                  type="number"
                  step="0.1"
                  min="-10"
                  max="65"
                  placeholder="e.g. 45.0"
                  value={expectedPeak}
                  onFocus={handleInputFocus}
                  onChange={(e) => setExpectedPeak(e.target.value)}
                  required
                />
                <span className="unit-badge">°C</span>
              </div>
              <small className="field-hint">Maximum afternoon forecasted temperature</small>
            </div>

            {/* Location / Area Name (Optional) */}
            <div className="form-field-item">
              <label htmlFor="location-input">Location or Area Name (Optional)</label>
              <input
                id="location-input"
                type="text"
                placeholder="e.g., Delhi NCR, North Ward, Farm Block 4"
                value={locationName}
                onFocus={handleInputFocus}
                onChange={(e) => setLocationName(e.target.value)}
              />
              <small className="field-hint">Helps personalize the generated advisory label</small>
            </div>

            {/* Relative Humidity (Optional) */}
            <div className="form-field-item">
              <label htmlFor="humidity-input">Relative Humidity % (Optional)</label>
              <div className="input-with-unit">
                <input
                  id="humidity-input"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="e.g. 55"
                  value={humidity}
                  onFocus={handleInputFocus}
                  onChange={(e) => setHumidity(e.target.value)}
                />
                <span className="unit-badge">%</span>
              </div>
              <small className="field-hint">Used for apparent heat index calculation</small>
            </div>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="calculate-advisory-btn">
              ⚡ Generate Heat Advisory
            </button>
            {(ambientTemp || expectedPeak || evaluation) && (
              <button type="button" onClick={handleReset} className="reset-advisory-btn">
                Reset Fields
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Generated Advisory Results (Matching Heat Alerts Page & Advisory Component) */}
      {evaluation && (
        <section className="advisory-results-container" aria-live="polite">
          <div className="section-heading" style={{ marginTop: "32px", marginBottom: "16px" }}>
            <div className="section-title-wrap">
              <h2>Evaluated Heat Alert & Thermal Advisory</h2>
              <span className={`advisory-risk-tag risk-tag-${evaluation.severity.toLowerCase()}`}>
                ● Risk Tier: {evaluation.severity}
              </span>
            </div>
            <p>Generated based on your custom ambient ({evaluation.ambient}°C) and peak ({evaluation.expectedPeak}°C) inputs</p>
          </div>

          {/* Primary Alert Card formatted exactly like the Heat Alerts page */}
          <article className={`alert-item ${getSeverityClass(evaluation.severity)}`} style={{ marginBottom: "28px" }}>
            <div className="alert-main">
              <div className="alert-top">
                <span className="alert-symbol" aria-hidden="true">
                  {evaluation.symbol}
                </span>

                <div className="alert-title-wrap">
                  <h2>{evaluation.title}</h2>
                  <p className="alert-location">📍 {evaluation.location}</p>
                </div>

                <span className={`severity-badge ${getSeverityClass(evaluation.severity)}`}>
                  ● {evaluation.severity}
                </span>
              </div>

              <p className="alert-description">{evaluation.description}</p>

              <div className="alert-metadata-row">
                <span className="alert-peak-time">
                  ⏱️ Critical Peak Window: <strong>{evaluation.peakWindow}</strong>
                </span>
                <span className="alert-issued">
                  Generated at {evaluation.evaluatedAt}
                </span>
                <span className="alert-source-pill">
                  User Parameter Assessment
                </span>
              </div>
            </div>

            <div className="alert-info">
              <div className="temp-block">
                <span className="temp-label">Ambient Temp</span>
                <strong className="temp-val">{evaluation.ambient}°C</strong>
              </div>

              <div className="temp-block">
                <span className="temp-label">Expected Peak</span>
                <strong className="peak-val">{evaluation.expectedPeak}°C</strong>
              </div>
            </div>
          </article>

          {/* Stakeholder Action Advisories (Citizens, Farmers, Health, Disaster, Municipal) */}
          <AdvisoryCard riskLevel={evaluation.severity} />
        </section>
      )}

      {/* ======================================================================
          SIGN IN / REGISTER POPUP MODAL
          Appears before user enters details if not authenticated.
          User can dismiss at any time and still freely use the advisory calculator!
          ====================================================================== */}
      {showAuthModal && !user && (
        <div
          className="auth-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onClick={(e) => {
            if (e.target.classList.contains("auth-modal-overlay")) {
              setShowAuthModal(false);
            }
          }}
        >
          <div className="auth-modal-card">
            {/* Top Close Button */}
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close dialog without signing in"
              title="Close without signing in"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="modal-header-content">
              <span className="modal-logo-icon">☀️</span>
              <h2 id="auth-modal-title">
                {authTab === "login" ? "Sign In to SolVigil" : "Create SolVigil Account"}
              </h2>
              <p className="modal-subtext">
                Sign in or register to receive localized thermal warnings and persist custom profiles — or simply proceed as a guest.
              </p>
            </div>

            {/* Tabs for Login vs Register */}
            <div className="modal-tab-switcher">
              <button
                type="button"
                className={`modal-tab-btn ${authTab === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthTab("login");
                  setModalError("");
                  setModalSuccess("");
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${authTab === "register" ? "active" : ""}`}
                onClick={() => {
                  setAuthTab("register");
                  setModalError("");
                  setModalSuccess("");
                }}
              >
                Create Account
              </button>
            </div>

            {/* Feedback notifications */}
            {modalError && (
              <div className="auth-error-banner" role="alert" style={{ marginBottom: "14px" }}>
                <span>⚠️ {modalError}</span>
              </div>
            )}
            {modalSuccess && (
              <div className="auth-success-banner" role="status" style={{ marginBottom: "14px" }}>
                <span>✓ {modalSuccess}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleModalAuthSubmit} className="modal-auth-form">
              {authTab === "register" && (
                <>
                  <div className="form-group">
                    <label htmlFor="modal-name">Full Name</label>
                    <input
                      id="modal-name"
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-role">Stakeholder Profile</label>
                    <select
                      id="modal-role"
                      value={modalRole}
                      onChange={(e) => setModalRole(e.target.value)}
                    >
                      <option value="citizen">Citizen / General Public</option>
                      <option value="farmer">Farmer / Agricultural Worker</option>
                      <option value="health">Healthcare / Medical Facility</option>
                      <option value="disaster">Disaster Response Agency</option>
                      <option value="municipal">Municipal / Civic Authority</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="modal-email">Email Address</label>
                <input
                  id="modal-email"
                  type="email"
                  placeholder="e.g. rajesh@example.com"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-password">Password</label>
                <input
                  id="modal-password"
                  type="password"
                  placeholder="Enter your password"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  autoComplete={authTab === "login" ? "current-password" : "new-password"}
                  required
                />
              </div>

              <button
                type="submit"
                className="modal-submit-btn"
                disabled={isSubmittingAuth}
              >
                {isSubmittingAuth
                  ? "Processing..."
                  : authTab === "login"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            {/* Divider and Guest Continue Button */}
            <div className="modal-divider-wrap">
              <span>or</span>
            </div>

            <button
              type="button"
              className="guest-skip-btn"
              onClick={() => setShowAuthModal(false)}
            >
              Continue without Signing In (Use Advisory Directly) →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default CustomAdvisory;
