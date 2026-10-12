# ☀️ SolVigil — Heat Intelligence & Early Warning Platform

SolVigil is an AI-inspired heat intelligence, thermal risk assessment, and early warning platform designed to forecast, analyze, and mitigate localized extreme heat stress across India.

The platform combines real-time meteorological observations with a transparent, rule-based thermal risk assessment algorithm and provides tailored, actionable advisories across five major community stakeholder groups.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 (JSX) with native CSS
- **Routing**: React Router DOM (v7)
- **Data Visualization**: Native SVG (Temperature Trend Trajectory — strictly zero third-party charting/mapping libraries)
- **Backend**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB (Mongoose ODM) with fallback capability
- **Meteorological Data**: Open-Meteo API (ambient temperature, apparent temperature/heat index, relative humidity, UV radiation, wind velocity)
- **Authentication**: Salted password hashing (`crypto.scryptSync`) & HttpOnly SameSite session cookies

---

## 🌟 Key Application Features

### 1. Unified Heat Intelligence Dashboard (`/`)
- **Live Search**: Debounced autocomplete search across Indian cities and district centres.
- **Normal Weather vs. Heat Risk**: Clear visual distinction between general weather metrics and thermal risk severity indices.
- **Native SVG Temperature Trend Graph**: Interactive hourly trajectory displaying forecasted temperatures, thermal risk indicators, axis labels, and hover tooltips without third-party chart libraries.
- **Atmospheric Highlights**: Relative humidity, apparent heat index ("feels like"), wind speed, and UV index.
- **Early Warning Notice**: Dynamic heatwave alert banner with peak severity windows and public safety protocols.

### 2. 7-Day Regional Heat Forecast (`/forecast`)
- Dynamically generated forecast dates (e.g., Today, Tomorrow, Wed, 14 Oct).
- Maximum and minimum temperature curves, apparent heat indices, and UV exposure ratings.
- Deterministic heat-risk assessment for each upcoming day.

### 3. Heatwave Alerts (`/alerts`)
- Persistent alert records stored in MongoDB.
- Filtering by severity (`All`, `Extreme`, `High`, `Moderate`, `Low`) and search by city/state.
- Summary metrics and alert status monitoring.

### 5. Multi-Stakeholder Safety Advisories
Deterministic, rule-based safety action plans tailored for 5 groups:
1. **Citizens & General Public**: Hydration guidelines, peak exposure windows, and vulnerable family protection.
2. **Farmers & Agricultural Workers**: Dawn/dusk field operations, evening irrigation, and livestock care.
3. **Health Agencies & Hospitals**: Surge capacity, rehydration supplies, and heat stroke triage protocols.
4. **Disaster Management Authorities**: Inter-agency coordination, SMS broadcasts, and cooling shelter mobilization.
5. **Municipal & Civic Authorities**: Construction shift adjustments, civic water kiosks (pyaus), and street shade provisioning.

### 6. User Authentication & Session Management (`/login`, `/register`)
- Client-side and server-side input validation.
- Cryptographic password hashing (`scrypt`) with unique 16-byte random salts.
- Secure HttpOnly session cookies persisted in MongoDB.
- Navigation bar with user profile state and one-click logout.

---

## 🚀 How to Run SolVigil

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a MongoDB Atlas URI)

### 1. Clone & Install Dependencies
From the project root:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root and in `backend/`:
```bash
cp backend/.env.example backend/.env
cp backend/.env.example .env
```
Default configuration values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/solvigil
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SESSION_SECRET=solvigil_heat_intelligence_session_secret_key_2026
```

### 3. Running the Project

#### Option A: Run via VS Code (Recommended)
1. Open the workspace folder in VS Code.
2. Press **`Ctrl + Shift + D`** (or open the **Run & Debug** pane).
3. Select **`Full Stack: Dev (Vite + Backend)`** from the dropdown.
4. Press **`F5`** (or click the green Play button). Both the Vite frontend and Express backend will start concurrently.

#### Option B: Run via Terminal
Open two terminal windows:

**Terminal 1 (Backend API Server):**
```bash
npm run server
# Server running at http://localhost:5000/api
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev
# Frontend live at http://localhost:5173
```

---

## 🔍 Verification & Testing

### Build Check
To verify that all JSX components and bundles compile cleanly:
```bash
npm run build
```

### Linting Check
To run code analysis and enforce styling standards:
```bash
npm run lint
```

### API Health Check
With the backend running, test server and database status:
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "ok",
  "app": "SolVigil Heat Intelligence Platform",
  "database": "connected",
  "timestamp": "..."
}
```

---

## ⚖️ Advisory Notice
*SolVigil is an early warning and decision-support platform. Heat-risk categories and advisories are derived using transparent threshold-based formulas rather than government-certified statutory warnings. In the event of acute heat emergencies, always consult the official directives issued by the India Meteorological Department (IMD) and National Disaster Management Authority (NDMA).*
