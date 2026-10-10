import React from "react";


function Forecast() {
    const forecastData = [
        {
            icon: "☀️",
            maxTemperature: 39,
            minTemperature: 27,
            condition: "Sunny",
            risk: "High"
        },


        {
            icon: "🌤️",
            maxTemperature: 38,
            minTemperature: 27,
            condition: "Mostly Sunny",
            risk: "High"
        },


        {
            icon: "🌤️",
            maxTemperature: 37,
            minTemperature: 26,
            condition: "Partly Cloudy",
            risk: "Moderate"
        },


        {
            icon: "⛅",
            maxTemperature: 35,
            minTemperature: 26,
            condition: "Cloudy",
            risk: "Moderate"
        },


        {
            icon: "🌦️",
            maxTemperature: 34,
            minTemperature: 25,
            condition: "Scattered Showers",
            risk: "Moderate"
        },


        {
            icon: "🌦️",
            maxTemperature: 33,
            minTemperature: 25,
            condition: "Light Rain",
            risk: "Low"
        },


        {
            icon: "🌤️",
            maxTemperature: 35,
            minTemperature: 26,
            condition: "Partly Cloudy",
            risk: "Moderate"
        }
    ];


    function getDate(dayOffset) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        return date;
    }


    function formatDay(date, index) {
        if (index === 0) {
            return "Today";
        }


        if (index === 1) {
            return "Tomorrow";
        }


        return date.toLocaleDateString("en-IN", {
            weekday: "short"
        });
    }


    function formatDate(date) {
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });
    }


    return (
        <main className = "forecast-page">
            <div className = "forecast-header">
                <p className = "page-label">SOLVIGIL FORECAST</p>
                <h1>7-Day Heat Forecast</h1>
                <p>Mumbai, Maharashtra</p>
            </div>


            <div className = "forecast-list">
                {forecastData.map((day, index) => {
                    const date = getDate(index);


                    return (
                        <div className = "forecast-card" key = {index}>
                            <div className = "forecast-date">
                                <h3>{formatDay(date, index)}</h3>
                                <p>{formatDate(date)}</p>
                            </div>


                            <div className = "forecast-icon">{day.icon}</div>


                            <div className = "forecast-condition">
                                <p>{day.condition}</p>
                            </div>


                            <div className = "forecast-temperature">
                                <strong>{day.maxTemperature}°C</strong>
                                <span>{day.minTemperature}°C</span>
                            </div>


                            <div className = {`forecast-risk ${day.risk.toLowerCase()}`}>
                                {day.risk}
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}


export default Forecast;

