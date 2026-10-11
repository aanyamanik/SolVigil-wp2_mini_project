import React from "react";

function WeatherHighlights({ current = null, locationName = "Current Location" }) {
  const humidity = current?.humidity ?? 62;
  const windSpeed = current?.windSpeed ?? 14;
  const uvIndex = current?.uvIndex ?? 7;
  const apparentTemp = current?.apparentTemperature ?? 41;

  function getUvRating(uv) {
    if (uv === null || uv === undefined) return "Moderate";
    if (uv >= 11) return "Extreme";
    if (uv >= 8) return "Very High";
    if (uv >= 6) return "High";
    if (uv >= 3) return "Moderate";
    return "Low";
  }

  const highlights = [
    {
      title: "Feels Like (Thermal Index)",
      value: `${apparentTemp}°C`,
      subtitle: apparentTemp > (current?.temperature || 35) ? "Higher due to humidity" : "Aligned with ambient temp",
      icon: "🌡️"
    },
    {
      title: "Relative Humidity",
      value: `${humidity}%`,
      subtitle: humidity > 60 ? "Elevates apparent heat stress" : "Moderate moisture level",
      icon: "💧"
    },
    {
      title: "Wind Velocity",
      value: `${windSpeed} km/h`,
      subtitle: windSpeed < 10 ? "Calm air (limited thermal relief)" : "Moderate breeze",
      icon: "💨"
    },
    {
      title: "UV Radiation Index",
      value: uvIndex !== null ? `${uvIndex} (${getUvRating(uvIndex)})` : "Moderate",
      subtitle: uvIndex >= 8 ? "Sun protection strictly advised" : "Standard daylight UV level",
      icon: "☀️"
    }
  ];

  return (
    <section className="highlights-section" aria-label="Key Weather Metrics">
      <div className="section-heading">
        <h2>Atmospheric Highlights</h2>
        <p>Key thermal and meteorological observations for {locationName}</p>
      </div>

      <div className="highlights">
        {highlights.map((item, index) => (
          <div className="highlight-card" key={index}>
            <div className="highlight-top-row">
              <div className="highlight-icon">{item.icon}</div>
              <h3>{item.title}</h3>
            </div>
            <p className="highlight-value">{item.value}</p>
            <span className="highlight-sub">{item.subtitle}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeatherHighlights;
