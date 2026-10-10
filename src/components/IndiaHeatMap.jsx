import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";

/**
 * Interactive India Heat Risk Map
 * Built using native SVG, React, and CSS.
 * Strictly adheres to project constraints: Zero external mapping/charting libraries.
 */
function IndiaHeatMap({ regionsData = [], loading = false, error = null }) {
  const [selectedRegionId, setSelectedRegionId] = useState("maharashtra");
  const { setLocation } = useLocation();
  const navigate = useNavigate();

  // Geographic SVG path definitions for key Indian States & Regions
  // Sized on a 620 x 700 viewBox grounded in India's subcontinent geometry.
  const REGION_SHAPES = [
    {
      id: "delhi",
      name: "Delhi / NCR",
      center: { x: 260, y: 195 },
      // Small prominent region near northern hub
      d: "M 252 188 L 268 188 L 272 202 L 255 204 Z"
    },
    {
      id: "punjab",
      name: "Punjab & Haryana",
      center: { x: 215, y: 165 },
      d: "M 195 135 L 245 130 L 260 165 L 250 200 L 205 195 L 185 160 Z"
    },
    {
      id: "rajasthan",
      name: "Rajasthan",
      center: { x: 175, y: 245 },
      d: "M 185 160 L 205 195 L 235 210 L 225 280 L 165 310 L 115 285 L 125 215 L 165 175 Z"
    },
    {
      id: "gujarat",
      name: "Gujarat",
      center: { x: 125, y: 355 },
      d: "M 115 285 L 165 310 L 175 350 L 155 385 L 120 400 L 95 380 L 70 340 L 95 315 Z"
    },
    {
      id: "uttarpradesh",
      name: "Uttar Pradesh",
      center: { x: 310, y: 230 },
      d: "M 245 130 L 290 145 L 375 205 L 385 255 L 320 285 L 250 245 L 260 190 Z"
    },
    {
      id: "madhyapradesh",
      name: "Madhya Pradesh",
      center: { x: 275, y: 335 },
      d: "M 225 280 L 320 285 L 365 320 L 340 380 L 265 385 L 175 350 Z"
    },
    {
      id: "bihar",
      name: "Bihar",
      center: { x: 410, y: 245 },
      d: "M 375 205 L 450 220 L 460 270 L 385 275 L 375 240 Z"
    },
    {
      id: "westbengal",
      name: "West Bengal",
      center: { x: 465, y: 320 },
      d: "M 445 235 L 485 240 L 490 320 L 460 380 L 435 345 L 455 270 Z"
    },
    {
      id: "odisha",
      name: "Odisha",
      center: { x: 395, y: 395 },
      d: "M 365 320 L 435 345 L 440 420 L 370 455 L 340 400 Z"
    },
    {
      id: "maharashtra",
      name: "Maharashtra",
      center: { x: 215, y: 430 },
      d: "M 155 385 L 265 385 L 315 410 L 310 475 L 220 500 L 170 455 Z"
    },
    {
      id: "telangana",
      name: "Telangana & AP",
      center: { x: 310, y: 490 },
      d: "M 315 410 L 370 455 L 360 550 L 305 560 L 265 520 L 295 460 Z"
    },
    {
      id: "karnataka",
      name: "Karnataka",
      center: { x: 215, y: 540 },
      d: "M 170 455 L 220 500 L 265 520 L 255 605 L 195 595 L 175 510 Z"
    },
    {
      id: "tamilnadu",
      name: "Tamil Nadu",
      center: { x: 275, y: 620 },
      d: "M 255 570 L 305 560 L 315 635 L 265 675 L 240 630 Z"
    },
    {
      id: "kerala",
      name: "Kerala",
      center: { x: 215, y: 635 },
      d: "M 195 595 L 240 630 L 235 675 L 200 660 Z"
    },
    {
      id: "assam",
      name: "Assam & NE",
      center: { x: 535, y: 220 },
      d: "M 485 210 L 585 190 L 595 260 L 525 285 L 490 250 Z"
    }
  ];

  // Match regional live data with shapes
  const regionsMap = {};
  regionsData.forEach((r) => {
    regionsMap[r.id] = r;
  });

  const selectedRegion = regionsMap[selectedRegionId] || regionsData[0] || null;

  function getRiskFill(risk) {
    switch (risk) {
      case "Extreme":
        return "#fca5a5"; // Soft Red
      case "High":
        return "#fed7aa"; // Soft Orange
      case "Moderate":
        return "#fef08a"; // Soft Amber
      case "Low":
        return "#bbf7d0"; // Soft Green
      default:
        return "#e5e7eb"; // Grey
    }
  }

  function getRiskStroke(risk) {
    switch (risk) {
      case "Extreme":
        return "#b91c1c";
      case "High":
        return "#c2410c";
      case "Moderate":
        return "#a16207";
      case "Low":
        return "#15803d";
      default:
        return "#9ca3af";
    }
  }

  function handleSelectRegion(regionId) {
    setSelectedRegionId(regionId);
  }

  function handleViewInDashboard() {
    if (selectedRegion) {
      setLocation({
        city: selectedRegion.representativeCity,
        region: selectedRegion.name,
        displayName: `${selectedRegion.representativeCity}, ${selectedRegion.name}`
      });
      navigate("/");
    }
  }

  return (
    <div className="heat-map-layout">
      {/* Map Column */}
      <div className="map-container">
        <div className="map-title">
          <h2>India Regional Heat Risk Index</h2>
          <p>Select a region or state to inspect representative temperature & thermal severity</p>
        </div>

        {loading ? (
          <div className="map-loading-state">
            <div className="loading-spinner"></div>
            <p>Fetching representative meteorological data across regions...</p>
          </div>
        ) : error ? (
          <div className="map-error-state">
            <p>⚠️ Unable to load live regional heat data. {error}</p>
          </div>
        ) : (
          <div className="svg-map-wrapper">
            <svg
              viewBox="0 0 620 700"
              className="india-svg-map"
              role="region"
              aria-label="Interactive Heat Risk Map of India"
            >
              {/* Regional polygons */}
              {REGION_SHAPES.map((shape) => {
                const data = regionsMap[shape.id];
                const risk = data ? data.risk : "Moderate";
                const isSelected = selectedRegionId === shape.id;
                const fill = getRiskFill(risk);
                const stroke = getRiskStroke(risk);

                return (
                  <g key={shape.id} className="svg-state-group">
                    <path
                      d={shape.d}
                      fill={fill}
                      stroke={isSelected ? "#111827" : stroke}
                      strokeWidth={isSelected ? "3.5" : "1.8"}
                      className={`svg-state-path ${isSelected ? "selected" : ""}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`${shape.name}: ${data ? `${data.temperature}°C, ${data.risk} Risk` : "Data unavailable"}`}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectRegion(shape.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectRegion(shape.id);
                        }
                      }}
                    />

                    {/* Centered label */}
                    <text
                      x={shape.center.x}
                      y={shape.center.y}
                      textAnchor="middle"
                      className={`map-state-text ${isSelected ? "selected" : ""}`}
                      pointerEvents="none"
                    >
                      <tspan x={shape.center.x} dy="-2" fontWeight="600" fontSize="10.5">
                        {shape.id.toUpperCase().slice(0, 3)}
                      </tspan>
                      <tspan x={shape.center.x} dy="13" fontWeight="bold" fontSize="11.5">
                        {data ? `${data.temperature}°C` : "--"}
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-color-box" style={{ background: "#bbf7d0", borderColor: "#15803d" }}></span>
                <span>Low (&lt;33°C)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-box" style={{ background: "#fef08a", borderColor: "#a16207" }}></span>
                <span>Moderate (33–38°C)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-box" style={{ background: "#fed7aa", borderColor: "#c2410c" }}></span>
                <span>High (39–43°C)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-box" style={{ background: "#fca5a5", borderColor: "#b91c1c" }}></span>
                <span>Extreme (≥44°C)</span>
              </div>
            </div>

            <p className="map-disclaimer">
              * Simplified regional visualization. Colours represent heat-risk categories evaluated from representative meteorological observations.
            </p>
          </div>
        )}
      </div>

      {/* Adjacent Information Column */}
      <div className="region-details">
        {selectedRegion ? (
          <div>
            <div className="details-label">REGIONAL HEAT INTELLIGENCE</div>
            <h2>{selectedRegion.name}</h2>
            <div className="details-city-tag">
              📍 Representative City: <strong>{selectedRegion.representativeCity}</strong>
            </div>

            <div className="details-metric-row">
              <div className="details-temperature">
                {selectedRegion.temperature}°C
              </div>
              <div className={`details-risk-badge risk-${selectedRegion.risk.toLowerCase()}`}>
                ● {selectedRegion.risk} Heat Risk
              </div>
            </div>

            <div className="details-data-grid">
              <div className="data-box">
                <span className="data-box-label">Feels Like</span>
                <strong className="data-box-val">{selectedRegion.apparentTemperature}°C</strong>
              </div>
              <div className="data-box">
                <span className="data-box-label">Humidity</span>
                <strong className="data-box-val">{selectedRegion.humidity}%</strong>
              </div>
              <div className="data-box">
                <span className="data-box-label">Condition</span>
                <strong className="data-box-val">{selectedRegion.condition} {selectedRegion.icon}</strong>
              </div>
            </div>

            <div className="details-explanation-box">
              <h4>Met Assessment</h4>
              <p>{selectedRegion.explanation}</p>
            </div>

            <div className="representative-notice">
              ⚠️ <em>Note: Observations are sourced from {selectedRegion.representativeCity} weather monitoring stations and serve as an indicative regional sample rather than a uniform state-wide measurement.</em>
            </div>

            <button
              className="view-dashboard-btn"
              onClick={handleViewInDashboard}
            >
              Inspect {selectedRegion.representativeCity} on Dashboard →
            </button>
          </div>
        ) : (
          <div className="no-region-selected">
            <div className="no-region-icon">🗺️</div>
            <h2>Select a Region</h2>
            <p>Click on any state or regional boundary on the India map to examine localized heatwave risk factors.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IndiaHeatMap;
