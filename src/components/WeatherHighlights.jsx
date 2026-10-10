import React from "react";


function WeatherHighlights() {
    const highlights = [
        {
            title: "Humidity",
            value: "65%",
            icon: "💧"
        },


        {
            title: "Wind Speed",
            value: "15 km/h",
            icon: "💨"
        },


        {
            title: "UV Index",
            value: "High",
            icon: "☀️"
        }
    ];


    return (
        <section className = "highlights-section">
            <div className = "section-heading">
                <h2>Today's highlights</h2>
                <p>Key conditions for Mumbai</p>
            </div>


            <div className = "highlights">
                {highlights.map((item, index) => (
                    <div className = "highlight-card" key = {index}>
                        <div className = "highlight-icon">{item.icon}</div>
                        <h3>{item.title}</h3>
                        <p>{item.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}


export default WeatherHighlights;
