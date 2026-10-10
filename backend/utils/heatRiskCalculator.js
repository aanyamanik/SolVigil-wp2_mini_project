/**
 * Prototype Rule-Based Heat Risk Assessment Algorithm
 * 
 * NOTE: This is a decision-support and educational prototype calculation
 * based on ambient temperature, apparent temperature (heat index), relative humidity,
 * and UV exposure. It is not an official meteorological standard or trained AI prediction.
 */
export function calculateHeatRisk({
  temperature,
  apparentTemperature,
  relativeHumidity = null,
  windSpeed = null,
  uvIndex = null
}) {
  const temp = typeof temperature === 'number' ? temperature : parseFloat(temperature) || 0;
  const feelsLike = typeof apparentTemperature === 'number'
    ? apparentTemperature
    : (parseFloat(apparentTemperature) || temp);
  const humidity = typeof relativeHumidity === 'number' ? relativeHumidity : null;
  const uv = typeof uvIndex === 'number' ? uvIndex : null;

  // Primary decision metric combines ambient temperature and apparent heat index
  let level = "Low";
  let score = 1;
  let explanation = "";

  if (temp >= 44 || feelsLike >= 50 || (temp >= 41 && humidity !== null && humidity >= 60)) {
    level = "Extreme";
    score = 4;
    explanation = `Extreme thermal stress detected (Ambient: ${temp.toFixed(1)}°C, Feels like: ${feelsLike.toFixed(1)}°C${
      humidity !== null ? `, Humidity: ${humidity}%` : ""
    }). Danger of heat stroke and rapid dehydration during outdoor exposure.`;
  } else if (temp >= 39 || feelsLike >= 42) {
    level = "High";
    score = 3;
    explanation = `Elevated heat risk (Ambient: ${temp.toFixed(1)}°C, Feels like: ${feelsLike.toFixed(1)}°C). High likelihood of heat exhaustion and severe fatigue with prolonged outdoor activity.`;
  } else if (temp >= 33 || feelsLike >= 35) {
    level = "Moderate";
    score = 2;
    explanation = `Moderate heat conditions (Ambient: ${temp.toFixed(1)}°C, Feels like: ${feelsLike.toFixed(1)}°C). Prolonged physical exertion may cause fatigue. Hydration and shade recommended.`;
  } else {
    level = "Low";
    score = 1;
    explanation = `Comfortable to mild heat conditions (Ambient: ${temp.toFixed(1)}°C, Feels like: ${feelsLike.toFixed(1)}°C). Minimal thermal risk for standard daily activities.`;
  }

  // Factor annotations
  const factors = {
    temperature: temp,
    apparentTemperature: feelsLike,
    relativeHumidity: humidity,
    windSpeed: typeof windSpeed === 'number' ? windSpeed : null,
    uvIndex: uv
  };

  return {
    level,
    score,
    explanation,
    factors,
    isRuleBased: true
  };
}
