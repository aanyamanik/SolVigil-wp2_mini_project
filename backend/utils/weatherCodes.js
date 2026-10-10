/**
 * Maps WMO Weather Interpretation Codes (Open-Meteo) to human-readable condition & icons.
 */
export function getWeatherInterpretation(code) {
  const codeMap = {
    0: { condition: "Clear Sky", icon: "☀️" },
    1: { condition: "Mainly Clear", icon: "🌤️" },
    2: { condition: "Partly Cloudy", icon: "⛅" },
    3: { condition: "Overcast", icon: "☁️" },
    45: { condition: "Fog", icon: "🌫️" },
    48: { condition: "Depositing Rime Fog", icon: "🌫️" },
    51: { condition: "Light Drizzle", icon: "🌦️" },
    53: { condition: "Moderate Drizzle", icon: "🌦️" },
    55: { condition: "Dense Drizzle", icon: "🌦️" },
    61: { condition: "Slight Rain", icon: "🌧️" },
    63: { condition: "Moderate Rain", icon: "🌧️" },
    65: { condition: "Heavy Rain", icon: "🌧️" },
    71: { condition: "Slight Snow Fall", icon: "🌨️" },
    73: { condition: "Moderate Snow Fall", icon: "🌨️" },
    75: { condition: "Heavy Snow Fall", icon: "🌨️" },
    80: { condition: "Slight Rain Showers", icon: "🌦️" },
    81: { condition: "Moderate Rain Showers", icon: "🌦️" },
    82: { condition: "Violent Rain Showers", icon: "⛈️" },
    95: { condition: "Thunderstorm", icon: "⛈️" },
    96: { condition: "Thunderstorm with Hail", icon: "⛈️" },
    99: { condition: "Severe Thunderstorm with Hail", icon: "⛈️" }
  };

  return codeMap[code] || { condition: "Clear / Partly Sunny", icon: "🌤️" };
}
