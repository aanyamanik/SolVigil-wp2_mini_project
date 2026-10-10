import React from "react";


function HourlyForecast() {
    const hourlyData = [
        { time: "12 PM", icon: "☀️", temperature: 39, risk: "High" },
        { time: "1 PM", icon: "☀️", temperature: 40, risk: "High" },
        { time: "2 PM", icon: "🔥", temperature: 42, risk: "Extreme" },
        { time: "3 PM", icon: "🔥", temperature: 41, risk: "Extreme" },
        { time: "4 PM", icon: "🌤️", temperature: 39, risk: "High" },
        { time: "5 PM", icon: "🌤️", temperature: 37, risk: "Moderate" }
    ];


    return (
        <section className = "hourly-section">
            <div className = "section-heading">
                <h2>Hourly Heat Forecast</h2>
                <p>Today's temperature and heat risk</p>
            </div>


            <div className = "hourly-container">
                {hourlyData.map((hour, index) => (
                    <div className = "hour-card" key = {index}>
                        <p className = "hour-time">{hour.time}</p>
                        <div className = "weather-icon">{hour.icon}</div>
                        <p className = "hour-temperature">{hour.temperature}°C</p>
                        <p className = {`hour-risk ${hour.risk.toLowerCase()}`}>{hour.risk}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}


export default HourlyForecast;

