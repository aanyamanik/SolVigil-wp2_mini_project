import { calculateHeatRisk } from "../utils/heatRiskCalculator.js";
import { getWeatherInterpretation } from "../utils/weatherCodes.js";

// Comprehensive fallback coordinates for Indian cities
const KNOWN_INDIAN_CITIES = {
  mumbai: { name: "Mumbai", region: "Maharashtra", lat: 19.0760, lon: 72.8777 },
  delhi: { name: "Delhi", region: "Delhi", lat: 28.6139, lon: 77.2090 },
  bengaluru: { name: "Bengaluru", region: "Karnataka", lat: 12.9716, lon: 77.5946 },
  hyderabad: { name: "Hyderabad", region: "Telangana", lat: 17.3850, lon: 78.4867 },
  ahmedabad: { name: "Ahmedabad", region: "Gujarat", lat: 23.0225, lon: 72.5714 },
  chennai: { name: "Chennai", region: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  kolkata: { name: "Kolkata", region: "West Bengal", lat: 22.5726, lon: 88.3639 },
  pune: { name: "Pune", region: "Maharashtra", lat: 18.5204, lon: 73.8567 },
  jaipur: { name: "Jaipur", region: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  lucknow: { name: "Lucknow", region: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  bhopal: { name: "Bhopal", region: "Madhya Pradesh", lat: 23.2599, lon: 77.4126 },
  patna: { name: "Patna", region: "Bihar", lat: 25.5941, lon: 85.1376 },
  nagpur: { name: "Nagpur", region: "Maharashtra", lat: 21.1458, lon: 79.0882 },
  bhubaneswar: { name: "Bhubaneswar", region: "Odisha", lat: 20.2961, lon: 85.8245 },
  thiruvananthapuram: { name: "Thiruvananthapuram", region: "Kerala", lat: 8.5241, lon: 76.9366 },
  guwahati: { name: "Guwahati", region: "Assam", lat: 26.1445, lon: 91.7362 },
  chandigarh: { name: "Chandigarh", region: "Punjab & Haryana", lat: 30.7333, lon: 76.7794 },
  raipur: { name: "Raipur", region: "Chhattisgarh", lat: 21.2514, lon: 81.6296 },
  ranchi: { name: "Ranchi", region: "Jharkhand", lat: 23.3441, lon: 85.3096 }
};

/**
 * Geocode a city name using Open-Meteo Geocoding API with fallback
 */
async function resolveLocation(cityName) {
  if (!cityName || !cityName.trim()) {
    return KNOWN_INDIAN_CITIES.mumbai;
  }

  const cleanName = cityName.split(",")[0].trim().toLowerCase();
  
  // Quick lookup in known dictionary
  if (KNOWN_INDIAN_CITIES[cleanName]) {
    return KNOWN_INDIAN_CITIES[cleanName];
  }

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=5&language=en&format=json`;
    const res = await fetch(geoUrl, { signal: AbortSignal.timeout(6000) });
    
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Find best match (prefer country = India if available)
        const indiaMatch = data.results.find(r => r.country_code === "IN" || r.country === "India") || data.results[0];
        return {
          name: indiaMatch.name,
          region: indiaMatch.admin1 || indiaMatch.country || "India",
          lat: indiaMatch.latitude,
          lon: indiaMatch.longitude
        };
      }
    }
  } catch (err) {
    console.warn(`[Geocoding Warning] Failed to geocode "${cityName}":`, err.message);
  }

  // Fallback to closest known or default Mumbai
  return KNOWN_INDIAN_CITIES[cleanName] || {
    name: cityName.split(",")[0].trim(),
    region: "India",
    lat: KNOWN_INDIAN_CITIES.mumbai.lat,
    lon: KNOWN_INDIAN_CITIES.mumbai.lon,
    isFallback: true
  };
}

/**
 * Search locations endpoint
 * GET /api/weather/search?q=...
 */
export async function searchLocations(req, res, next) {
  try {
    const query = (req.query.q || "").trim();
    if (!query) {
      // Return popular Indian cities
      const popular = Object.values(KNOWN_INDIAN_CITIES).slice(0, 10).map(c => ({
        name: c.name,
        region: c.region,
        displayName: `${c.name}, ${c.region}`
      }));
      return res.json({ success: true, results: popular });
    }

    // Try geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
    const response = await fetch(geoUrl, { signal: AbortSignal.timeout(5000) });
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const matches = data.results.map(r => ({
          name: r.name,
          region: r.admin1 || r.country || "India",
          country: r.country,
          latitude: r.latitude,
          longitude: r.longitude,
          displayName: `${r.name}${r.admin1 ? `, ${r.admin1}` : ""}${r.country ? `, ${r.country}` : ""}`
        }));
        return res.json({ success: true, results: matches });
      }
    }

    // Filter local known cities as fallback
    const filtered = Object.values(KNOWN_INDIAN_CITIES).filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.region.toLowerCase().includes(query.toLowerCase())
    ).map(c => ({
      name: c.name,
      region: c.region,
      displayName: `${c.name}, ${c.region}`
    }));

    res.json({ success: true, results: filtered });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current weather and hourly forecast for a city
 * GET /api/weather?city=Mumbai
 */
export async function getWeather(req, res, _next) {
  try {
    const cityName = req.query.city || "Mumbai";
    const loc = await resolveLocation(cityName);

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,uv_index&timezone=auto&forecast_days=2`;

    const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(8000) });
    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo returned status ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const cur = weatherData.current || {};
    const interp = getWeatherInterpretation(cur.weather_code);

    // Current Heat Risk Calculation
    const heatRisk = calculateHeatRisk({
      temperature: cur.temperature_2m,
      apparentTemperature: cur.apparent_temperature,
      relativeHumidity: cur.relative_humidity_2m,
      windSpeed: cur.wind_speed_10m,
      uvIndex: null // will be drawn from hourly if available
    });

    // Format next 24 hours
    const hourlyList = [];
    if (weatherData.hourly && weatherData.hourly.time) {
      const times = weatherData.hourly.time;
      const temps = weatherData.hourly.temperature_2m;
      const apps = weatherData.hourly.apparent_temperature;
      const hums = weatherData.hourly.relative_humidity_2m;
      const codes = weatherData.hourly.weather_code;
      const uvs = weatherData.hourly.uv_index || [];

      // Determine starting index closest to current time
      const nowIso = new Date().toISOString().slice(0, 13);
      let startIndex = times.findIndex(t => t.startsWith(nowIso));
      if (startIndex < 0) startIndex = 0;

      const endIndex = Math.min(startIndex + 24, times.length);

      for (let i = startIndex; i < endIndex; i++) {
        const hTime = new Date(times[i]);
        const hourInterp = getWeatherInterpretation(codes[i]);
        const hRisk = calculateHeatRisk({
          temperature: temps[i],
          apparentTemperature: apps[i],
          relativeHumidity: hums[i],
          uvIndex: uvs[i]
        });

        // Readable hour string, e.g., "1 PM", "12 AM"
        const formattedHour = hTime.toLocaleTimeString("en-IN", {
          hour: "numeric",
          hour12: true
        });

        hourlyList.push({
          time: formattedHour,
          isoTime: times[i],
          temperature: Math.round(temps[i]),
          apparentTemperature: Math.round(apps[i]),
          humidity: hums[i],
          uvIndex: uvs[i] ?? null,
          condition: hourInterp.condition,
          icon: hourInterp.icon,
          risk: hRisk.level,
          riskScore: hRisk.score
        });
      }
    }

    // Extract current UV from first hourly match if available
    const currentUv = hourlyList.length > 0 && hourlyList[0].uvIndex !== null
      ? hourlyList[0].uvIndex
      : null;

    if (currentUv !== null) {
      heatRisk.factors.uvIndex = currentUv;
    }

    const payload = {
      success: true,
      location: {
        city: loc.name,
        region: loc.region,
        country: "India",
        latitude: loc.lat,
        longitude: loc.lon
      },
      current: {
        temperature: Math.round(cur.temperature_2m),
        apparentTemperature: Math.round(cur.apparent_temperature),
        humidity: cur.relative_humidity_2m,
        windSpeed: Math.round(cur.wind_speed_10m),
        uvIndex: currentUv,
        condition: interp.condition,
        icon: interp.icon,
        weatherCode: cur.weather_code,
        lastUpdated: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        isLive: true
      },
      heatRisk,
      hourly: hourlyList
    };

    res.json(payload);
  } catch (err) {
    console.error("[Weather Controller Error]:", err.message);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve weather data: ${err.message}`
    });
  }
}

/**
 * Get 7-day daily forecast for a city
 * GET /api/forecast?city=Mumbai
 */
export async function getForecast(req, res, _next) {
  try {
    const cityName = req.query.city || "Mumbai";
    const loc = await resolveLocation(cityName);

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max&timezone=auto&forecast_days=7`;

    const response = await fetch(forecastUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const data = await response.json();
    const daily = data.daily || {};
    const dates = daily.time || [];
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    const appMaxTemps = daily.apparent_temperature_max || [];
    const codes = daily.weather_code || [];
    const uvMax = daily.uv_index_max || [];

    const dailyForecast = [];

    for (let i = 0; i < dates.length; i++) {
      const dayDate = new Date(dates[i]);
      const interp = getWeatherInterpretation(codes[i]);
      
      const dayRisk = calculateHeatRisk({
        temperature: maxTemps[i],
        apparentTemperature: appMaxTemps[i],
        uvIndex: uvMax[i]
      });

      let dayLabel = dayDate.toLocaleDateString("en-IN", { weekday: "short" });
      if (i === 0) dayLabel = "Today";
      else if (i === 1) dayLabel = "Tomorrow";

      dailyForecast.push({
        date: dates[i],
        calendarDate: dayDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        weekday: dayLabel,
        isToday: i === 0,
        isTomorrow: i === 1,
        condition: interp.condition,
        icon: interp.icon,
        maxTemperature: Math.round(maxTemps[i]),
        minTemperature: Math.round(minTemps[i]),
        apparentMax: Math.round(appMaxTemps[i]),
        uvIndexMax: uvMax[i] !== undefined ? uvMax[i] : null,
        risk: dayRisk.level,
        riskScore: dayRisk.score,
        explanation: dayRisk.explanation
      });
    }

    res.json({
      success: true,
      location: {
        city: loc.name,
        region: loc.region,
        country: "India"
      },
      forecast: dailyForecast
    });
  } catch (err) {
    console.error("[Forecast Controller Error]:", err.message);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve 7-day forecast: ${err.message}`
    });
  }
}

/**
 * Get regional heat map data across India
 * GET /api/heatmap
 */
export async function getHeatMapData(req, res, next) {
  try {
    // Representative regions across India with representative monitoring cities
    const regions = [
      { id: "delhi", name: "Delhi / NCR", city: "Delhi", region: "Northern", lat: 28.6139, lon: 77.2090 },
      { id: "rajasthan", name: "Rajasthan", city: "Jaipur", region: "North-Western", lat: 26.9124, lon: 75.7873 },
      { id: "gujarat", name: "Gujarat", city: "Ahmedabad", region: "Western", lat: 23.0225, lon: 72.5714 },
      { id: "maharashtra", name: "Maharashtra", city: "Mumbai", region: "Western", lat: 19.0760, lon: 72.8777 },
      { id: "madhyapradesh", name: "Madhya Pradesh", city: "Bhopal", region: "Central", lat: 23.2599, lon: 77.4126 },
      { id: "karnataka", name: "Karnataka", city: "Bengaluru", region: "Southern", lat: 12.9716, lon: 77.5946 },
      { id: "tamilnadu", name: "Tamil Nadu", city: "Chennai", region: "Southern", lat: 13.0827, lon: 80.2707 },
      { id: "telangana", name: "Telangana & AP", city: "Hyderabad", region: "Southern", lat: 17.3850, lon: 78.4867 },
      { id: "westbengal", name: "West Bengal", city: "Kolkata", region: "Eastern", lat: 22.5726, lon: 88.3639 },
      { id: "uttarpradesh", name: "Uttar Pradesh", city: "Lucknow", region: "Northern", lat: 26.8467, lon: 80.9462 },
      { id: "punjab", name: "Punjab & Haryana", city: "Chandigarh", region: "Northern", lat: 30.7333, lon: 76.7794 },
      { id: "bihar", name: "Bihar", city: "Patna", region: "Eastern", lat: 25.5941, lon: 85.1376 },
      { id: "odisha", name: "Odisha", city: "Bhubaneswar", region: "Eastern", lat: 20.2961, lon: 85.8245 },
      { id: "kerala", name: "Kerala", city: "Thiruvananthapuram", region: "Southern", lat: 8.5241, lon: 76.9366 },
      { id: "assam", name: "Assam & NE", city: "Guwahati", region: "North-Eastern", lat: 26.1445, lon: 91.7362 }
    ];

    // Fetch batch weather observations from Open-Meteo
    const lats = regions.map(r => r.lat).join(",");
    const lons = regions.map(r => r.lon).join(",");
    const batchUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    let weatherResults = [];
    try {
      const response = await fetch(batchUrl, { signal: AbortSignal.timeout(9000) });
      if (response.ok) {
        const data = await response.json();
        // data will be an array if multiple coordinates, or single object if 1
        weatherResults = Array.isArray(data) ? data : [data];
      }
    } catch (apiErr) {
      console.warn("[HeatMap Warning] Live batch weather fetch failed, using fallback:", apiErr.message);
    }

    const mapData = regions.map((region, idx) => {
      const w = weatherResults[idx]?.current;
      const temp = w?.temperature_2m ?? (32 + ((idx * 3) % 11)); // realistic fallback if offline
      const apparent = w?.apparent_temperature ?? (temp + 3);
      const humidity = w?.relative_humidity_2m ?? 55;
      const weatherCode = w?.weather_code ?? 0;
      const interp = getWeatherInterpretation(weatherCode);

      const riskObj = calculateHeatRisk({
        temperature: temp,
        apparentTemperature: apparent,
        relativeHumidity: humidity
      });

      return {
        id: region.id,
        name: region.name,
        zone: region.region,
        representativeCity: region.city,
        temperature: Math.round(temp),
        apparentTemperature: Math.round(apparent),
        humidity,
        condition: interp.condition,
        icon: interp.icon,
        risk: riskObj.level,
        riskScore: riskObj.score,
        explanation: `${region.name} heat index based on representative observations from ${region.city}: Ambient ${Math.round(temp)}°C, Feels like ${Math.round(apparent)}°C. ${riskObj.explanation}`,
        isRepresentative: true,
        isLive: !!w
      };
    });

    res.json({
      success: true,
      regions: mapData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
}
