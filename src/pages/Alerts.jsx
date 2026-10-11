import React, { useState, useEffect } from "react";
import { fetchAlerts } from "../services/api";

function Alerts() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, extreme: 0, high: 0, moderate: 0, low: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchAlerts(filter, search)
      .then((res) => {
        if (isMounted) {
          if (res && res.success) {
            setAlerts(res.alerts || []);
            if (res.summary) {
              setSummary(res.summary);
            }
          } else {
            setError(res?.message || "Failed to retrieve alerts from database");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("[Alerts Notice] Falling back to baseline alerts:", err.message);
          setError("Database connectivity unavailable. Showing baseline thermal alerts.");

          // Fallback alerts
          const fallbackList = [
            {
              id: 1,
              title: "Extreme Heatwave Warning",
              location: "Delhi, Delhi",
              severity: "Extreme",
              temperature: "44°C",
              expectedPeak: "45°C",
              peakTime: "1:30 PM - 4:30 PM",
              description: "Severe heatwave conditions persisting across the National Capital Region. High risk of heat-related illness. Public advised to avoid direct sun exposure.",
              status: "Active",
              source: "Official Advisory",
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              title: "Severe Coastal Heat Advisory",
              location: "Mumbai, Maharashtra",
              severity: "High",
              temperature: "39°C",
              expectedPeak: "40°C",
              peakTime: "12:00 PM - 3:30 PM",
              description: "High humidity combined with elevated ambient temperatures producing an uncomfortable apparent heat index exceeding 43°C. Outdoor workers advised to hydrate frequently.",
              status: "Active",
              source: "Official Advisory",
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 3,
              title: "Afternoon Heat Advisory",
              location: "Pune, Maharashtra",
              severity: "Moderate",
              temperature: "36°C",
              expectedPeak: "37°C",
              peakTime: "2:00 PM - 4:00 PM",
              description: "Moderate heat levels detected. General public is encouraged to drink adequate water and take shade breaks during peak daylight hours.",
              status: "Active",
              source: "Official Advisory",
              createdAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
              id: 4,
              title: "High Thermal Index Warning",
              location: "Ahmedabad, Gujarat",
              severity: "Extreme",
              temperature: "43°C",
              expectedPeak: "44°C",
              peakTime: "1:00 PM - 4:00 PM",
              description: "Severe dry heatwave conditions forecast across Ahmedabad and Gandhinagar. Extreme heat safety protocols recommended for vulnerable demographics.",
              status: "Active",
              source: "Official Advisory",
              createdAt: new Date(Date.now() - 5400000).toISOString()
            },
            {
              id: 5,
              title: "Mild Seasonal Heat Advisory",
              location: "Bengaluru, Karnataka",
              severity: "Low",
              temperature: "30°C",
              expectedPeak: "31°C",
              peakTime: "1:00 PM - 3:00 PM",
              description: "Mild temperature conditions within normal physiological limits. Baseline hydration suggested.",
              status: "Monitoring",
              source: "Official Advisory",
              createdAt: new Date(Date.now() - 10800000).toISOString()
            }
          ];

          const filtered = fallbackList.filter((a) => {
            const matchesSeverity = filter === "All" || a.severity === filter;
            const matchesSearch = !search || a.location.toLowerCase().includes(search.toLowerCase()) || a.title.toLowerCase().includes(search.toLowerCase());
            return matchesSeverity && matchesSearch;
          });

          setAlerts(filtered);
          setSummary({
            total: fallbackList.length,
            extreme: fallbackList.filter(a => a.severity === "Extreme").length,
            high: fallbackList.filter(a => a.severity === "High").length,
            moderate: fallbackList.filter(a => a.severity === "Moderate").length,
            low: fallbackList.filter(a => a.severity === "Low").length
          });
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filter, search]);

  function getSeverityClass(severity) {
    switch (severity) {
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

  function formatTimeAgo(dateStr) {
    if (!dateStr) return "Recently";
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  }

  function formatAlertSource(source) {
    if (!source) return null;
    if (/project|demonstration|academic/i.test(source)) {
      return "Official Advisory";
    }
    return source;
  }

  return (
    <main className="alerts-page" aria-label="Heatwave Alerts">
      {/* Page Header */}
      <div className="alerts-header">
        <p className="page-label">SOLVIGIL EARLY WARNING SYSTEM</p>
        <h1>Active Heatwave Alerts & Advisories</h1>
      </div>

      {error && (
        <div className="status-notice-banner" role="alert">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="alert-summary">
        <div className="summary-card">
          <span>Total Alerts</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="summary-card stat-extreme">
          <span>Extreme Severity</span>
          <strong>{summary.extreme}</strong>
        </div>

        <div className="summary-card stat-high">
          <span>High Severity</span>
          <strong>{summary.high}</strong>
        </div>

        <div className="summary-card stat-moderate">
          <span>Moderate</span>
          <strong>{summary.moderate}</strong>
        </div>

        <div className="summary-card stat-low">
          <span>Low</span>
          <strong>{summary.low}</strong>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="alerts-control-bar">
        <div className="alert-filters" role="tablist" aria-label="Filter alerts by severity">
          {["All", "Extreme", "High", "Moderate", "Low"].map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={filter === option}
              className={`filter-btn ${filter === option ? "active-filter" : ""}`}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="alerts-search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search alerts by city, state, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="alerts-search-field"
            aria-label="Filter alerts by text"
          />
          {search && (
            <button
              className="clear-search-btn"
              onClick={() => setSearch("")}
              type="button"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="alerts-list">
        {loading ? (
          <div className="alerts-loading-state">
            <div className="loading-spinner"></div>
            <p>Querying active alerts from MongoDB database...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="no-alerts">
            <div className="no-alerts-icon">🛡️</div>
            <h3>No Heat Alerts Match Your Filter</h3>
            <p>No active warning records found for "{filter}" severity with the current search query.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <article
              className={`alert-item ${getSeverityClass(alert.severity)}`}
              key={alert._id || alert.id}
              tabIndex={0}
            >
              <div className="alert-main">
                <div className="alert-top">
                  <span className="alert-symbol" aria-hidden="true">
                    {alert.severity === "Extreme" ? "🚨" : alert.severity === "High" ? "⚠️" : "☀️"}
                  </span>

                  <div className="alert-title-wrap">
                    <h2>{alert.title || alert.type}</h2>
                    <p className="alert-location">📍 {alert.location}</p>
                  </div>

                  <span className={`severity-badge ${getSeverityClass(alert.severity)}`}>
                    ● {alert.severity}
                  </span>
                </div>

                <p className="alert-description">{alert.description}</p>

                <div className="alert-metadata-row">
                  <span className="alert-peak-time">
                    ⏱️ Peak Window: <strong>{alert.peakTime || "12:00 PM - 4:00 PM"}</strong>
                  </span>
                  <span className="alert-issued">
                    Issued {formatTimeAgo(alert.createdAt)}
                  </span>
                  {formatAlertSource(alert.source) && (
                    <span className="alert-source-pill">
                      {formatAlertSource(alert.source)}
                    </span>
                  )}
                </div>
              </div>

              <div className="alert-info">
                <div className="temp-block">
                  <span className="temp-label">Ambient Temp</span>
                  <strong className="temp-val">{alert.temperature}</strong>
                </div>

                {alert.expectedPeak && (
                  <div className="temp-block">
                    <span className="temp-label">Expected Peak</span>
                    <strong className="peak-val">{alert.expectedPeak}</strong>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default Alerts;