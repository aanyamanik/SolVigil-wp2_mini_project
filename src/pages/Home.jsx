import React, { useState } from "react";

import HourlyForecast from "../components/HourlyForecast";
import HeatAlert from "../components/HeatAlert";
import WeatherHighlights from "../components/WeatherHighlights";
import AdvisoryCard from "../components/AdvisoryCard";
import LocationSearch from "../components/LocationSearch";

function Home() {
    const [location, setLocation] = useState("Mumbai, Maharashtra");

    return (
        <div className="home">
            <LocationSearch onLocationSelect={setLocation} />

            <div className="weather-container">
                <div className="weather-card">
                    <h2>{location}</h2>

                    <div className="temperature">
                        ☀️ 39°C
                    </div>

                    <p>Feels like 43°C</p>
                    <p>Updated 2 minutes ago</p>
                </div>

                <div className="risk-card">
                    <h2>Heat Risk</h2>

                    <div className="risk-level">
                        🔴 Severe
                    </div>

                    <p>Extreme heat conditions expected.</p>
                </div>
            </div>

            <HourlyForecast />
            <HeatAlert />
            <WeatherHighlights />
            <AdvisoryCard />
        </div>
    );
}

export default Home;