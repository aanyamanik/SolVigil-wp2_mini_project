import React from "react";

function HeatAlert({ heatRisk = null, current = null, locationName = "Region" }) {
  const riskLevel = heatRisk?.level || "Moderate";
  const explanation = heatRisk?.explanation || "Moderate heat conditions detected. Hydration and shade recommended during prolonged outdoor activity.";
  const temp = current?.temperature ?? 38;
  const apparentTemp = current?.apparentTemperature ?? 41;

  function getRiskTheme(level) {
    switch (level) {
      case "Extreme":
        return {
          icon: "🚨",
          badgeClass: "alert-theme-extreme",
          label: "EXTREME HEAT EMERGENCY",
          leadTitle: `Severe heatwave conditions in ${locationName}`,
          advice: "Avoid direct sun exposure between 11:30 AM and 4:30 PM. Drink plenty of water and seek air-conditioned spaces."
        };
      case "High":
        return {
          icon: "⚠️",
          badgeClass: "alert-theme-high",
          label: "ELEVATED HEAT ADVISORY",
          leadTitle: `High thermal stress forecast for ${locationName}`,
          advice: "Limit strenuous outdoor exertion during midday. Hydrate frequently and wear breathable protective clothing."
        };
      case "Moderate":
        return {
          icon: "☀️",
          badgeClass: "alert-theme-moderate",
          label: "MODERATE HEAT WATCH",
          leadTitle: `Standard warm conditions in ${locationName}`,
          advice: "Maintain regular hydration and take shade breaks during outdoor physical activities."
        };
      case "Low":
      default:
        return {
          icon: "🌱",
          badgeClass: "alert-theme-low",
          label: "NORMAL CONDITIONS",
          leadTitle: `Mild thermal environment in ${locationName}`,
          advice: "No acute heat stress detected. Standard daily hydration and sun protection apply."
        };
    }
  }

  const theme = getRiskTheme(riskLevel);

  return (
    <section className={`heat-alert ${theme.badgeClass}`} aria-label="Heat Alert and Safety Notice">
      <div className="alert-icon-col">
        <span className="alert-symbol">{theme.icon}</span>
      </div>

      <div className="alert-content">
        <div className="alert-tag-row">
          <span className="alert-label">{theme.label}</span>
        </div>

        <h2>{theme.leadTitle}</h2>
        <p className="alert-description">{explanation}</p>

        <div className="alert-details">
          <div className="alert-metric">
            <span>Observed Ambient</span>
            <strong>{temp}°C</strong>
          </div>

          <div className="alert-metric">
            <span>Feels-Like Index</span>
            <strong>{apparentTemp}°C</strong>
          </div>

          <div className="alert-metric">
            <span>Severity Category</span>
            <strong className={`metric-severity ${riskLevel.toLowerCase()}`}>
              {riskLevel} Risk
            </strong>
          </div>

          <div className="alert-metric">
            <span>Critical Hours</span>
            <strong>12 PM – 4 PM</strong>
          </div>
        </div>

        <div className="alert-advice-box">
          <span className="advice-icon">💡</span>
          <p className="alert-advice"><strong>Safety Protocol:</strong> {theme.advice}</p>
        </div>
      </div>
    </section>
  );
}

export default HeatAlert;
