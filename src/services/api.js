/**
 * SolVigil Central API Client
 * Uses JavaScript's native Fetch API with cookie credentials.
 */

const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    credentials: "include", // ensures session cookies are transmitted
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `HTTP Error ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Request Error] ${endpoint}:`, err.message);
    throw err;
  }
}

// Weather & Forecast Endpoints
export function fetchWeather(city = "Mumbai") {
  return request(`/weather?city=${encodeURIComponent(city)}`);
}

export function fetchForecast(city = "Mumbai") {
  return request(`/forecast?city=${encodeURIComponent(city)}`);
}

export function searchCities(query = "") {
  return request(`/weather/search?q=${encodeURIComponent(query)}`);
}

export function fetchHeatMap() {
  return request(`/heatmap`);
}

export function fetchAdvisory(risk = "Moderate", role = "all") {
  return request(`/advisory?risk=${encodeURIComponent(risk)}&role=${encodeURIComponent(role)}`);
}

// Alerts Endpoints (MongoDB backed)
export function fetchAlerts(severity = "All", search = "") {
  const params = new URLSearchParams();
  if (severity && severity !== "All") params.append("severity", severity);
  if (search) params.append("search", search);
  const q = params.toString() ? `?${params.toString()}` : "";
  return request(`/alerts${q}`);
}

export function fetchAlertById(id) {
  return request(`/alerts/${id}`);
}

export function createAlert(alertData) {
  return request(`/alerts`, {
    method: "POST",
    body: JSON.stringify(alertData)
  });
}

export function updateAlert(id, alertData) {
  return request(`/alerts/${id}`, {
    method: "PUT",
    body: JSON.stringify(alertData)
  });
}

export function deleteAlert(id) {
  return request(`/alerts/${id}`, {
    method: "DELETE"
  });
}

// Authentication Endpoints
export function apiRegister(userData) {
  return request(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData)
  });
}

export function apiLogin(credentials) {
  return request(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function apiGetMe() {
  return request(`/auth/me`);
}

export function apiLogout() {
  return request(`/auth/logout`, {
    method: "POST"
  });
}
