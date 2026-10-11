/**
 * Stakeholder-Specific Rule-Based Advisory Controller
 * 
 * Generates transparent, deterministic heat-safety advisories for:
 * 1. Citizens and the general public
 * 2. Farmers and agricultural workers
 * 3. Health agencies and hospitals
 * 4. Disaster-management authorities
 * 5. Municipal and public-health authorities
 * 
 * NOTE: These are rule-based advisory guidelines based on established public-health
 * and heat-action-plan (HAP) thresholds. They are indicative decision support,
 * not official government declarations or machine-learning outputs.
 */

const ADVISORY_RULES = {
  Extreme: {
    citizen: {
      title: "Citizen Early Warning — Extreme Risk",
      roleName: "Citizens & General Public",
      icon: "👤",
      summary: "Dangerous extreme heat conditions. Severe risk of heat stroke, heat exhaustion, and critical dehydration.",
      tips: [
        "Avoid all non-emergency outdoor exposure between 11:30 AM and 4:30 PM.",
        "Drink at least 3–4 litres of clean water, ORS (oral rehydration salts), or natural fluids like coconut water daily.",
        "Wear loose, light-coloured cotton garments; use umbrellas, hats, and sunglasses when outdoors.",
        "Actively monitor vulnerable family members: infants, elderly relatives, and individuals with cardiovascular conditions.",
        "Immediately seek shaded cooling or call emergency services if symptoms of heat stroke (dizziness, nausea, cessation of sweating) appear."
      ]
    },
    farmer: {
      title: "Agricultural Action — Extreme Heat",
      roleName: "Farmers & Agricultural Workers",
      icon: "🌾",
      summary: "Critical thermal stress on crops and livestock. High soil moisture evaporation and livestock heat shock risk.",
      tips: [
        "Shift all field operations, weeding, and spraying strictly to early dawn (5:00 AM – 8:30 AM) or dusk.",
        "Apply light, frequent evening irrigation or drip watering to minimise rapid evapotranspiration.",
        "Ensure livestock enclosures have adequate cross-ventilation, shaded tarpaulins, cool drinking water, and misting.",
        "Avoid chemical and pesticide spraying during peak daytime temperatures to prevent leaf burn."
      ]
    },
    health: {
      title: "Hospital & Health Agency Preparedness — Red Alert",
      roleName: "Health Agencies & Hospitals",
      icon: "🏥",
      summary: "High surge in heat-induced clinical presentations expected. Severe strain on emergency care units.",
      tips: [
        "Pre-allocate dedicated heat-illness wards equipped with ice packs, cooling blankets, and intravenous saline solutions.",
        "Ensure rapid triage protocols are active for elderly and comatose heat-stroke admissions.",
        "Maintain uninterrupted cold-chain storage for temperature-sensitive medications and vaccines.",
        "Deploy mobile medical health units to high-density informal settlements and labour camps."
      ]
    },
    disaster: {
      title: "Disaster Management Directive — Extreme Heat Emergency",
      roleName: "Disaster Management Authorities",
      icon: "🚨",
      summary: "Activate Level-3 Heat Action Plan (HAP). Coordinate multi-departmental emergency response.",
      tips: [
        "Trigger inter-agency coordination across fire services, ambulance fleets, and civic utilities.",
        "Issue localized emergency heatwave broadcasts via SMS alerts, public radio, and transit variable-message signs.",
        "Audit power grids to avert transformer overheating and prevent power failures in critical hospitals.",
        "Establish regional emergency cooling centres in public halls, libraries, and transit concourses."
      ]
    },
    municipal: {
      title: "Municipal Civic Action — Heat Emergency Protocol",
      roleName: "Municipal & Civic Authorities",
      icon: "🏛️",
      summary: "Enforce civic heat mitigation protocols across urban wards and public spaces.",
      tips: [
        "Mandate suspension or rescheduling of hazardous outdoor construction and physical civic labour during 12 PM – 4 PM.",
        "Deploy municipal water tankers and establish shaded drinking-water kiosks (pyaus) at bus terminals and markets.",
        "Coordinate continuous road sprinkling in thermal hotspot commercial corridors.",
        "Keep municipal parks and shaded public spaces open throughout the afternoon for public shelter."
      ]
    }
  },

  High: {
    citizen: {
      title: "Citizen Advisory — High Heat Risk",
      roleName: "Citizens & General Public",
      icon: "👤",
      summary: "Elevated thermal stress. High likelihood of heat exhaustion and cramps with prolonged outdoor activity.",
      tips: [
        "Minimise strenuous outdoor physical exertion during afternoon peak hours (12:00 PM – 4:00 PM).",
        "Hydrate frequently before feeling thirsty; carry a reusable water bottle when travelling.",
        "Protect head and eyes with wide-brimmed hats, light scarves, or umbrellas.",
        "Never leave children, pets, or elderly persons in parked vehicles, even with windows cracked open."
      ]
    },
    farmer: {
      title: "Agricultural Advisory — High Thermal Load",
      roleName: "Farmers & Agricultural Workers",
      icon: "🌾",
      summary: "Accelerated soil moisture loss. Crop wilting and livestock thermal discomfort expected.",
      tips: [
        "Schedule field irrigation during late afternoon or night to curb evaporative water loss.",
        "Monitor young seedlings and heat-sensitive crops for wilting or leaf curl.",
        "Provide mineral-salt supplements and shaded resting sheds for milking cattle.",
        "Plan harvesting or tillage during early morning hours."
      ]
    },
    health: {
      title: "Health Facilities Advisory — Elevated Surveillance",
      roleName: "Health Agencies & Hospitals",
      icon: "🏥",
      summary: "Anticipate increased admissions for dehydration, gastroenteritis, and heat cramps.",
      tips: [
        "Ensure primary healthcare centres (PHCs) are stocked with sufficient ORS packets and rehydration fluids.",
        "Brief outpatient and emergency clinical staff on heat exhaustion diagnostic criteria.",
        "Issue preventive guidance leaflets to high-risk outpatients (diabetics, hypertensive patients, pregnant mothers)."
      ]
    },
    disaster: {
      title: "Disaster Readiness Advisory — Amber Level Alert",
      roleName: "Disaster Management Authorities",
      icon: "🚨",
      summary: "Elevate district readiness and initiate public heatwave advisory bulletins.",
      tips: [
        "Verify emergency ambulance fleet readiness and paramedical supply chains.",
        "Maintain liaison with state meteorological centres for 48-hour localized forecast tracking.",
        "Coordinate with voluntary organizations for vulnerable community outreach."
      ]
    },
    municipal: {
      title: "Municipal Operational Advisory — High Heat Watch",
      roleName: "Municipal & Civic Authorities",
      icon: "🏛️",
      summary: "Implement protective civic measures across public infrastructure and sanitation teams.",
      tips: [
        "Ensure municipal sanitation workers have shaded rest periods and mandatory hydration breaks.",
        "Inspect reliability of drinking-water distribution points across high-footfall commercial areas.",
        "Coordinate with transport hubs and schools to ensure adequate hydration and ventilation."
      ]
    }
  },

  Moderate: {
    citizen: {
      title: "Citizen Advisory — Moderate Risk",
      roleName: "Citizens & General Public",
      icon: "👤",
      summary: "Warm conditions detected. Fatigue and mild dehydration possible with prolonged outdoor exertion.",
      tips: [
        "Maintain routine water intake throughout the day (at least 2–2.5 litres).",
        "Take rest breaks in shaded areas if engaging in physical outdoor tasks.",
        "Wear lightweight, breathable cotton clothing.",
        "Monitor children and pets during outdoor afternoon recreation."
      ]
    },
    farmer: {
      title: "Agricultural Advisory — Moderate Conditions",
      roleName: "Farmers & Agricultural Workers",
      icon: "🌾",
      summary: "Standard seasonal warmth. Normal crop maintenance with regular soil moisture checks.",
      tips: [
        "Ensure routine scheduled irrigation based on seasonal crop requirements.",
        "Provide clean, shaded drinking water for farm animals.",
        "Carry on normal harvesting and field maintenance with periodic hydration breaks."
      ]
    },
    health: {
      title: "Health Services Advisory — Routine Thermal Monitoring",
      roleName: "Health Agencies & Hospitals",
      icon: "🏥",
      summary: "Baseline warm weather conditions with sporadic seasonal dehydration cases.",
      tips: [
        "Maintain standard inventory of oral rehydration supplies at outpatient clinics.",
        "Promote general hydration messaging through community health workers (ASHAs/ANMs)."
      ]
    },
    disaster: {
      title: "Disaster Monitoring — Yellow Level Watch",
      roleName: "Disaster Management Authorities",
      icon: "🚨",
      summary: "Routine surveillance of meteorological trajectories across district blocks.",
      tips: [
        "Review weekly thermal forecasts from national and regional meteorological centres.",
        "Keep district emergency operating centres updated on temperature trends."
      ]
    },
    municipal: {
      title: "Municipal Maintenance — Standard Seasonal Protocols",
      roleName: "Municipal & Civic Authorities",
      icon: "🏛️",
      summary: "Standard weather monitoring and routine civic infrastructure maintenance.",
      tips: [
        "Track daily temperature trajectory and local meteorological forecasts.",
        "Ensure standard public drinking-water stations and fountains are operational.",
        "Disseminate general seasonal wellness advisories via municipal portals."
      ]
    }
  },

  Low: {
    citizen: {
      title: "Citizen Advisory — Low Risk",
      roleName: "Citizens & General Public",
      icon: "👤",
      summary: "Pleasant to mild conditions. Minimal heat-related physiological strain.",
      tips: [
        "Enjoy outdoor activities while maintaining baseline daily hydration.",
        "Standard outdoor precautions apply."
      ]
    },
    farmer: {
      title: "Agricultural Advisory — Favourable Conditions",
      roleName: "Farmers & Agricultural Workers",
      icon: "🌾",
      summary: "Favourable conditions for standard field activities, seeding, and harvesting.",
      tips: [
        "Carry out scheduled crop management and regular agricultural operations.",
        "Standard livestock care and feeding regimens."
      ]
    },
    health: {
      title: "Health Services Advisory — Normal Baseline",
      roleName: "Health Agencies & Hospitals",
      icon: "🏥",
      summary: "Comfortable thermal environment with no acute heatwave pathology expected.",
      tips: [
        "Standard clinical and primary healthcare operations."
      ]
    },
    disaster: {
      title: "Disaster Monitoring — Normal Green Level",
      roleName: "Disaster Management Authorities",
      icon: "🚨",
      summary: "Normal operating status with routine environmental monitoring.",
      tips: [
        "Continuous standard seasonal meteorological tracking."
      ]
    },
    municipal: {
      title: "Municipal Operations — Normal Baseline",
      roleName: "Municipal & Civic Authorities",
      icon: "🏛️",
      summary: "Normal civic operations with routine baseline environmental monitoring.",
      tips: [
        "Routine meteorological surveillance and standard public health services."
      ]
    }
  }
};

export function getAdvisory(req, res) {
  const risk = req.query.risk || "Moderate";
  const role = req.query.role || "all";
  const validRisk = ADVISORY_RULES[risk] ? risk : "Moderate";

  const riskRules = ADVISORY_RULES[validRisk];

  // Support backward compatibility where 'authority' maps to 'municipal'
  const targetRole = role === "authority" ? "municipal" : role;

  if (targetRole !== "all" && riskRules[targetRole]) {
    return res.json({
      success: true,
      riskLevel: validRisk,
      role: targetRole,
      advisory: riskRules[targetRole],
      disclaimer: "Transparent, rule-based advisory guidelines based on heat risk thresholds. Not intended as personalised medical diagnosis or official government declaration."
    });
  }

  res.json({
    success: true,
    riskLevel: validRisk,
    advisories: riskRules,
    disclaimer: "Transparent, rule-based advisory guidelines based on heat risk thresholds. Not intended as personalised medical diagnosis or official government declaration."
  });
}
