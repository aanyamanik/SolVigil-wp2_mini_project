import React, { useState } from "react";


function AdvisoryCard() {
    const [activeRole, setActiveRole] = useState("citizen");


    const advisories = {
        citizen: {
            title: "For Citizens",
            icon: "👤",
            message: "Avoid prolonged exposure to direct sunlight, especially during peak afternoon hours.",
            tips: [
                "Drink water frequently",
                "Avoid strenuous outdoor activities between 12 PM and 4 PM",
                "Wear light and breathable clothing",
                "Check on elderly people and children"
            ]
        },


        farmer: {
            title: "For Farmers",
            icon: "🌾",
            message: "High temperatures may increase crop water requirements and heat stress.",
            tips: [
                "Increase irrigation during extreme heat",
                "Monitor crops for signs of heat stress",
                "Avoid unnecessary field work during peak heat",
                "Provide adequate water for livestock"
            ]
        },


        authority: {
            title: "For Authorities",
            icon: "🏛️",
            message: "Extreme heat conditions require increased monitoring and preparedness.",
            tips: [
                "Monitor high-risk regions",
                "Review active heatwave alerts",
                "Coordinate emergency response teams",
                "Ensure public advisories are disseminated"
            ]
        }
    };


    const advisory = advisories[activeRole];


    return (
        <section className = "advisory-section">
            <div className = "section-heading">
                <h2>Heat Advisory</h2>
                <p>Recommendations based on the current heat risk</p>
            </div>


            <div className = "advisory-card">
                <div className = "advisory-tabs">
                    <button
                    className = {activeRole === "citizen" ? "active-tab" : ""}
                    onClick = {() => setActiveRole("citizen")}
                    >👤 Citizen</button>


                    <button
                    className = {activeRole ==="farmer" ? "active-tab" : ""}
                    onClick = {() => setActiveRole("farmer")}
                    >🌾 Farmer</button>


                    <button
                    className = {activeRole === "authority" ? "active-tab" : ""}
                    onClick = {() => setActiveRole("authority")}
                    >🏛️ Authority</button>
                </div>


                <div className = "advisory-content">
                    <div className = "advisory-title">
                        <span className = "advisory-role-icon">{advisory.icon}</span>
                        <h3>{advisory.title}</h3>
                    </div>
                    <p className = "advisory-message">{advisory.message}</p>
                    <h4>Recommended Actions</h4>
                    <ul>{advisory.tips.map((tip, index) => (
                        <li key = {index}>
                            {tip}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}


export default AdvisoryCard;

