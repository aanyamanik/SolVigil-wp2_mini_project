import React, { useState, useEffect } from "react";
import { useLocation } from "../context/LocationContext";
import { fetchWeather } from "../services/api";

import LocationSearch from "../components/LocationSearch";
import HourlyForecast from "../components/HourlyForecast";
import TemperatureGraph from "../components/TemperatureGraph";
import HeatAlert from "../components/HeatAlert";
import WeatherHighlights from "../components/WeatherHighlights";
import AdvisoryCard from "../components/AdvisoryCard";

function Home() {
  const { selectedLocation, setLocation } = useLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const cityToQuery = selectedLocation?.city || "Mumbai";

    fetchWeather(cityToQuery)
      .then((data) => {
        if (isMounted) {
          if (data && data.success) {
            setWeatherData(data);
          } else {
            setError(data?.message || "Failed to load meteorological data");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("[Dashboard Weather Notice] Fetch failed, using fallback:", err.message);
          setError("Could not connect to live weather service. Showing indicative fallback data.");
          // Provide indicative baseline so dashboard remains interactive
          setWeatherData({
            success: true,
            location: {
              city: selectedLocation?.city || "Mumbai",
              region: selectedLocation?.region || "Maharashtra",
              country: "India"
            },
            current: {
              temperature: 38,
              apparentTemperature: 42,
              humidity: 62,
              windSpeed: 14,
              uvIndex: 8,
              condition: "Hot & Humid",
              icon: "☀️",
              lastUpdated: "Indicative Offline Observation",
              isLive: false
            },
            heatRisk: {
              level: "High",
              score: 3,
              explanation: "Elevated thermal stress. High likelihood of heat fatigue with extended outdoor exposure.",
              isRuleBased: true
            },
            hourly: [
              { time: "11 AM", temperature: 36, apparentTemperature: 39, risk: "Moderate", condition: "Sunny", icon: "☀️" },
              { time: "12 PM", temperature: 38, apparentTemperature: 41, risk: "High", condition: "Sunny", icon: "☀️" },
              { time: "1 PM", temperature: 39, apparentTemperature: 43, risk: "High", condition: "Sunny", icon: "☀️" },
              { time: "2 PM", temperature: 40, apparentTemperature: 44, risk: "Extreme", condition: "Hot", icon: "🔥" },
              { time: "3 PM", temperature: 39, apparentTemperature: 43, risk: "High", condition: "Hot", icon: "🔥" },
              { time: "4 PM", temperature: 38, apparentTemperature: 41, risk: "High", condition: "Sunny", icon: "☀️" },
              { time: "5 PM", temperature: 36, apparentTemperature: 39, risk: "Moderate", condition: "Partly Cloudy", icon: "🌤️" },
              { time: "6 PM", temperature: 34, apparentTemperature: 37, risk: "Moderate", condition: "Partly Cloudy", icon: "🌤️" }
            ]
          });
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLocation]);

  function handleLocationSelect(loc) {
    setLocation(loc);
  }

  const current = weatherData?.current;
  const heatRisk = weatherData?.heatRisk;
  const locationName = weatherData?.location?.displayName || selectedLocation?.displayName || "Mumbai, Maharashtra";

  return (
    <main className="home" aria-label="SolVigil Dashboard">
      {/* Search Bar */}
      <LocationSearch
        onLocationSelect={handleLocationSelect}
        currentCity={selectedLocation?.city || "Mumbai"}
      />

      {/* Live Loading Bar */}
      {loading && (
        <div className="dashboard-loading-bar" aria-live="polite">
          <span className="loading-spinner"></span>
          <span>Updating meteorological feeds for {locationName}...</span>
        </div>
      )}

      {/* Connectivity Alert if degraded */}
      {error && (
        <div className="status-notice-banner" role="alert">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setLocation({ ...selectedLocation })}
            className="retry-btn"
            type="button"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Meteorological & Heat Risk Cards */}
      <div className="weather-container">
        {/* Normal Weather Overview Card */}
        <div className="weather-card" tabIndex={0}>
          <div className="card-top-badge">
            <span className="source-label">METEOROLOGICAL OBSERVATION</span>
            {current?.isLive ? (
              <span className="live-pill">● LIVE</span>
            ) : (
              <span className="offline-pill">● SAMPLE</span>
            )}
          </div>

          <h2>{locationName}</h2>

          <div className="temperature-display">
            <span className="weather-symbol">{current?.icon || "☀️"}</span>
            <span className="temperature-value">{current?.temperature ?? 38}°C</span>
          </div>

          <div className="weather-condition-text">
            <strong>{current?.condition || "Partly Cloudy"}</strong>
          </div>

          <p className="apparent-temp">
            Feels like <strong>{current?.apparentTemperature ?? 42}°C</strong>
          </p>

          <p className="update-timestamp">
            {current?.lastUpdated ? `Updated: ${current.lastUpdated}` : "Real-time satellite & station data"}
          </p>
        </div>

        {/* Heat-Risk Severity Card (Clearly distinct from normal weather) */}
        <div className={`risk-card risk-border-${(heatRisk?.level || "moderate").toLowerCase()}`} tabIndex={0}>
          <h2>Thermal Risk Severity</h2>

          <div className={`risk-level-badge risk-bg-${(heatRisk?.level || "moderate").toLowerCase()}`}>
            <span className="risk-bullet">●</span>
            <span className="risk-text">{heatRisk?.level || "Moderate"} Severity</span>
          </div>

          <p className="risk-assessment-desc">
            {heatRisk?.explanation || "Elevated heat stress. Prolonged outdoor exposure may lead to fatigue and heat exhaustion."}
          </p>

          <div className="risk-score-indicator">
            <span className="score-label">Thermal Stress Index:</span>
            <div className="score-meter">
              <div
                className={`score-fill score-${(heatRisk?.level || "moderate").toLowerCase()}`}
                style={{ width: `${((heatRisk?.score || 2) / 4) * 100}%` }}
              ></div>
            </div>
            <span className="score-val">{heatRisk?.score || 2}/4</span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Strip */}
      <HourlyForecast hourlyData={weatherData?.hourly || []} />

      {/* Native SVG Temperature Trend Graph */}
      <TemperatureGraph hourlyData={weatherData?.hourly || []} />

      {/* Active Heatwave Alert / Warning Details */}
      <HeatAlert
        heatRisk={heatRisk}
        current={current}
        locationName={selectedLocation?.city || "Mumbai"}
      />

      {/* Atmospheric Highlights (Humidity, Wind, UV) */}
      <WeatherHighlights
        current={current}
        locationName={selectedLocation?.city || "Mumbai"}
      />

      {/* Multi-Stakeholder Heat Safety Advisories */}
      <AdvisoryCard
        riskLevel={heatRisk?.level || "Moderate"}
      />
    </main>
  );
}

export default Home;