import React from "react";
function HeatAlert() {
    return (
        <section className = "heat-alert">
            <div className = "alert-icon">
                ⚠️
            </div>


            <div className = "alert-content">
                <p className = "alert-label">HEATWAVE MONITORING</p>
                <h2>Severe heat conditions expected</h2>
                <p className = "alert-description">Temperatures are expected to remain high throughout the afternoon.</p>
                <div className = "alert-details">
                    <div>
                        <span>Expected Peak</span>
                        <strong>42°C</strong>
                    </div>


                    <div>
                        <span>Risk Level</span>
                        <strong>Extreme</strong>
                    </div>


                    <div>
                        <span>Peak Time</span>
                        <strong>2 PM</strong>
                    </div>
                </div>
                <p className = "alert-advice">Avoid prolonged outdoor exposure between 12 PM - 4 PM and stay hydrated.</p>
            </div>
        </section>
    );
}


export default HeatAlert;

