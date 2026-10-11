import React from "react";

function HourlyForecast({ hourlyData = [] }) {
  // Use passed hourlyData or sensible fallback
  const fallbackData = [
    { time: "12 PM", icon: "☀️", temperature: 38, risk: "High" },
    { time: "1 PM", icon: "☀️", temperature: 39, risk: "High" },
    { time: "2 PM", icon: "🔥", temperature: 41, risk: "Extreme" },
    { time: "3 PM", icon: "🔥", temperature: 40, risk: "Extreme" },
    { time: "4 PM", icon: "🌤️", temperature: 38, risk: "High" },
    { time: "5 PM", icon: "🌤️", temperature: 36, risk: "Moderate" },
    { time: "6 PM", icon: "🌤️", temperature: 34, risk: "Moderate" },
    { time: "7 PM", icon: "🌙", temperature: 32, risk: "Low" }
  ];

  const dataToDisplay = (hourlyData && hourlyData.length > 0) ? hourlyData.slice(0, 12) : fallbackData;

  return (
    <section className="hourly-section" aria-label="Hourly Heat Forecast">
      <div className="section-heading">
        <h2>Hourly Heat Progression</h2>
        <p>Hourly forecasted temperature, condition, and thermal risk category</p>
      </div>

      <div className="hourly-container">
        {dataToDisplay.map((hour, index) => (
          <div className="hour-card" key={index} tabIndex={0}>
            <p className="hour-time">{hour.time}</p>
            <div className="weather-icon">{hour.icon}</div>
            <p className="hour-temperature">{hour.temperature}°C</p>
            {hour.apparentTemperature !== undefined && (
              <span className="hour-apparent">Feels {hour.apparentTemperature}°</span>
            )}
            <p className={`hour-risk ${String(hour.risk).toLowerCase()}`}>
              {hour.risk}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HourlyForecast;
