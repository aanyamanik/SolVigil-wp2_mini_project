import React, { useState } from "react";

function Alerts() {

    const [filter, setFilter] = useState("All");

    const alerts = [
        {
            id: 1,
            location: "Delhi, Delhi",
            type: "Extreme Heatwave",
            severity: "Extreme",
            temperature: "43°C",
            issued: "20 minutes ago",
            description:
                "Extreme temperatures are expected during the afternoon. Take necessary precautions."
        },
        {
            id: 2,
            location: "Mumbai, Maharashtra",
            type: "Severe Heat",
            severity: "High",
            temperature: "39°C",
            issued: "35 minutes ago",
            description:
                "High heat conditions are expected. Avoid prolonged outdoor exposure during peak hours."
        },
        {
            id: 3,
            location: "Pune, Maharashtra",
            type: "Heat Advisory",
            severity: "Moderate",
            temperature: "36°C",
            issued: "1 hour ago",
            description:
                "Moderate heat conditions detected. Stay hydrated and limit unnecessary outdoor activity."
        },
        {
            id: 4,
            location: "Bhopal, Madhya Pradesh",
            type: "Extreme Heatwave",
            severity: "Extreme",
            temperature: "41°C",
            issued: "45 minutes ago",
            description:
                "Extreme heat conditions may pose health risks, particularly to vulnerable groups."
        }
    ];


    const filteredAlerts =
        filter === "All"
            ? alerts
            : alerts.filter((alert) => alert.severity === filter);


    function getSeverityClass(severity) {

        if (severity === "Extreme") {
            return "alert-extreme";
        }

        if (severity === "High") {
            return "alert-high";
        }

        return "alert-moderate";
    }


    return (

        <main className="alerts-page">

            {/* Header */}

            <div className="alerts-header">

                <p className="page-label">
                    SOLVIGIL EARLY WARNING
                </p>

                <h1>
                    Heat Alerts
                </h1>

                <p>
                    Monitor active heat warnings across affected regions.
                </p>

            </div>


            {/* Summary */}

            <div className="alert-summary">

                <div className="summary-card">
                    <span>Active Alerts</span>
                    <strong>{alerts.length}</strong>
                </div>

                <div className="summary-card">
                    <span>Extreme</span>
                    <strong>
                        {alerts.filter(
                            (alert) => alert.severity === "Extreme"
                        ).length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>High</span>
                    <strong>
                        {alerts.filter(
                            (alert) => alert.severity === "High"
                        ).length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Moderate</span>
                    <strong>
                        {alerts.filter(
                            (alert) => alert.severity === "Moderate"
                        ).length}
                    </strong>
                </div>

            </div>


            {/* Filters */}

            <div className="alert-filters">

                {["All", "Extreme", "High", "Moderate"].map((option) => (

                    <button
                        key={option}
                        className={
                            filter === option
                                ? "active-filter"
                                : ""
                        }
                        onClick={() => setFilter(option)}
                    >
                        {option}
                    </button>

                ))}

            </div>


            {/* Alert List */}

            <div className="alerts-list">

                {filteredAlerts.map((alert) => (

                    <div
                        className={`alert-item ${getSeverityClass(
                            alert.severity
                        )}`}
                        key={alert.id}
                    >

                        <div className="alert-main">

                            <div className="alert-top">

                                <span className="alert-symbol">
                                    ⚠️
                                </span>

                                <div>

                                    <h2>
                                        {alert.type}
                                    </h2>

                                    <p className="alert-location">
                                        📍 {alert.location}
                                    </p>

                                </div>

                            </div>


                            <p className="alert-description">
                                {alert.description}
                            </p>


                            <p className="alert-issued">
                                Issued {alert.issued}
                            </p>

                        </div>


                        <div className="alert-info">

                            <span
                                className={`severity-badge ${getSeverityClass(
                                    alert.severity
                                )}`}
                            >
                                {alert.severity}
                            </span>

                            <strong>
                                {alert.temperature}
                            </strong>

                        </div>

                    </div>

                ))}


                {filteredAlerts.length === 0 && (

                    <div className="no-alerts">
                        No alerts found for this severity level.
                    </div>

                )}

            </div>

        </main>

    );
}

export default Alerts;