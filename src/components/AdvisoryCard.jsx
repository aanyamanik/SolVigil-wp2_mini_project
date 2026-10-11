import React, { useState, useEffect } from "react";
import { fetchAdvisory } from "../services/api";

const DEFAULT_FALLBACK_ADVISORIES = {
  citizen: {
    title: "For Citizens & General Public",
    roleName: "Citizens & General Public",
    icon: "👤",
    summary: "Avoid prolonged exposure to direct sunlight, especially during peak afternoon hours.",
    tips: [
      "Drink clean water and natural rehydration fluids frequently throughout the day",
      "Avoid strenuous outdoor activities between 11:30 AM and 4:00 PM",
      "Wear loose, light-coloured cotton clothing and carry an umbrella or hat",
      "Actively check on elderly relatives, infants, and pets"
    ]
  },
  farmer: {
    title: "For Farmers & Agricultural Workers",
    roleName: "Farmers & Agriculture",
    icon: "🌾",
    summary: "Elevated temperatures accelerate soil moisture loss and create thermal stress on livestock.",
    tips: [
      "Shift critical field operations to early dawn (5:00 AM – 8:30 AM) or late dusk",
      "Apply light evening irrigation or drip watering to curb rapid evaporation",
      "Provide shaded resting sheds and cool drinking water for cattle and livestock",
      "Avoid pesticide and herbicide spraying during peak daytime heat"
    ]
  },
  health: {
    title: "For Health Agencies & Hospitals",
    roleName: "Health & Hospitals",
    icon: "🏥",
    summary: "Monitor patient presentation for heat exhaustion, dehydration, and heat stroke symptoms.",
    tips: [
      "Ensure primary care centres are stocked with oral rehydration salts (ORS) and IV fluids",
      "Prepare designated cooling areas with ice packs and blankets for heat emergencies",
      "Maintain continuous temperature control for heat-sensitive drugs and vaccine stocks",
      "Distribute preventive hydration guidelines to high-risk outpatients"
    ]
  },
  disaster: {
    title: "For Disaster-Management Authorities",
    roleName: "Disaster Management",
    icon: "🚨",
    summary: "Maintain inter-agency coordination and track localized thermal severity trajectories.",
    tips: [
      "Issue localized heatwave bulletins via SMS and community broadcast channels",
      "Ensure rapid deployment capability for ambulance and emergency medical squads",
      "Coordinate with municipal agencies to establish shaded temporary cooling shelters",
      "Track district-level weather developments from meteorological bulletins"
    ]
  },
  municipal: {
    title: "For Municipal & Civic Authorities",
    roleName: "Municipal Authorities",
    icon: "🏛️",
    summary: "Activate urban heat mitigation measures across public facilities, transit hubs, and markets.",
    tips: [
      "Enforce shaded rest breaks and shift working hours for outdoor sanitation workers",
      "Ensure clean drinking water kiosks (pyaus) are operational in high-footfall areas",
      "Coordinate street-level shade provisioning and misting in dense commercial corridors",
      "Keep public parks open during peak afternoon heat to provide accessible shelter"
    ]
  }
};

function AdvisoryCard({ riskLevel = "Moderate", advisoriesData = null }) {
  const [activeRole, setActiveRole] = useState("citizen");
  const [advisories, setAdvisories] = useState(advisoriesData || DEFAULT_FALLBACK_ADVISORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (advisoriesData) {
      setAdvisories(advisoriesData);
      return;
    }

    let isMounted = true;
    setLoading(true);
    fetchAdvisory(riskLevel, "all")
      .then((res) => {
        if (isMounted && res && res.advisories) {
          setAdvisories(res.advisories);
        }
      })
      .catch((err) => {
        console.warn("[Advisory Fetch Notice] Using baseline advisories:", err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [riskLevel, advisoriesData]);

  // Fallback to citizen if current active role is missing in retrieved dataset
  const currentAdvisory = advisories[activeRole] || advisories.citizen || DEFAULT_FALLBACK_ADVISORIES.citizen;

  const roles = [
    { key: "citizen", label: "Citizen", icon: "👤" },
    { key: "farmer", label: "Farmer", icon: "🌾" },
    { key: "health", label: "Health & Care", icon: "🏥" },
    { key: "disaster", label: "Disaster Relief", icon: "🚨" },
    { key: "municipal", label: "Municipal", icon: "🏛️" }
  ];

  return (
    <section className="advisory-section" aria-label="Stakeholder Heat Advisories">
      <div className="section-heading">
        <div className="section-title-wrap">
          <h2>Stakeholder Heat Advisories</h2>
          <span className={`advisory-risk-tag risk-tag-${(riskLevel || "moderate").toLowerCase()}`}>
            ● Current Level: {riskLevel}
          </span>
        </div>
        <p>Targeted safety protocols and preventive guidance tailored for key community stakeholders</p>
      </div>

      <div className="advisory-card">
        {/* Role Navigation Tabs */}
        <div className="advisory-tabs" role="tablist" aria-label="Stakeholder groups">
          {roles.map((r) => (
            <button
              key={r.key}
              role="tab"
              aria-selected={activeRole === r.key}
              className={`advisory-tab-btn ${activeRole === r.key ? "active-tab" : ""}`}
              onClick={() => setActiveRole(r.key)}
              type="button"
            >
              <span>{r.icon}</span> {r.label}
            </button>
          ))}
        </div>

        {/* Selected Advisory Content */}
        <div className="advisory-content" role="tabpanel">
          {loading ? (
            <div className="advisory-loading">
              <span className="loading-spinner"></span>
              <p>Loading tailored stakeholder advisory...</p>
            </div>
          ) : (
            <>
              <div className="advisory-title">
                <span className="advisory-role-icon">{currentAdvisory.icon}</span>
                <div>
                  <h3>{currentAdvisory.title}</h3>
                  <p className="advisory-role-subtitle">{currentAdvisory.roleName || "Operational Guidance"}</p>
                </div>
              </div>

              <div className="advisory-summary-box">
                <p className="advisory-message">{currentAdvisory.summary || currentAdvisory.message}</p>
              </div>

              <h4>Recommended Action Protocols</h4>
              <ul className="advisory-tips-list">
                {currentAdvisory.tips && currentAdvisory.tips.map((tip, index) => (
                  <li key={index} className="advisory-tip-item">
                    <span className="tip-bullet">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdvisoryCard;
