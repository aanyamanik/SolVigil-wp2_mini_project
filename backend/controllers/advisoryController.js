/**
 * Stakeholder-Specific Rule-Based Advisory Controller
 * 
 * Generates tailored heat-safety advisories for Citizens, Farmers, and Authorities
 * based on deterministic meteorological thresholds and risk categories.
 */

const ADVISORY_RULES = {
  Extreme: {
    citizen: {
      title: "Citizen Early Warning — Extreme Risk",
      icon: "👤",
      summary: "Dangerous extreme heat conditions. Severe risk of heat stroke and severe dehydration.",
      tips: [
        "Avoid all direct outdoor sun exposure between 11:30 AM and 4:30 PM.",
        "Drink at least 3–4 litres of water, oral rehydration salts (ORS), or natural fluids like coconut water daily.",
        "Wear loose, light-coloured cotton garments and keep a wet cloth or umbrella handy.",
        "Actively check on elderly relatives, infants, and individuals with cardiovascular conditions.",
        "Immediately seek air-conditioned shelter or emergency medical aid if dizziness or nausea occurs."
      ]
    },
    farmer: {
      title: "Agricultural Action — Extreme Heat",
      icon: "🌾",
      summary: "Critical thermal stress on crops and livestock. High soil moisture evaporation.",
      tips: [
        "Shift all field operations, weeding, and spraying to early dawn (5 AM – 9 AM) or dusk.",
        "Apply light, frequent evening irrigation or drip watering to minimise soil desiccation.",
        "Ensure livestock enclosures have adequate cross-ventilation, shaded tarpaulins, and continuous cool water.",
        "Avoid pesticide application during peak heat to prevent chemical scorch on plant foliage."
      ]
    },
    authority: {
      title: "Civic Preparedness — Heat Emergency",
      icon: "🏛️",
      summary: "Activate local heat action plan (HAP). Coordinate municipal response teams.",
      tips: [
        "Open public cooling centres, shaded transit shelters, and municipal drinking-water kiosks.",
        "Ensure emergency departments and primary healthcare centres are stocked with IV fluids and ice packs.",
        "Issue public safety broadcasts via SMS, radio, and digital roadside displays.",
        "Adjust municipal labour and construction working hours away from peak afternoon heat."
      ]
    }
  },

  High: {
    citizen: {
      title: "Citizen Advisory — High Risk",
      icon: "👤",
      summary: "Elevated heat conditions. Heat exhaustion and cramps are likely with prolonged outdoor activity.",
      tips: [
        "Minimise non-essential outdoor travel and strenuous workouts during the afternoon.",
        "Hydrate frequently before feeling thirsty; carry a reusable water bottle when travelling.",
        "Protect eyes and head with UV-blocking sunglasses, wide-brimmed hats, or umbrellas.",
        "Never leave children, pets, or elderly persons in parked vehicles, even with cracked windows."
      ]
    },
    farmer: {
      title: "Agricultural Advisory — High Thermal Load",
      icon: "🌾",
      summary: "High evapotranspiration rate. Crop wilting and livestock thermal discomfort expected.",
      tips: [
        "Schedule field irrigation during late afternoon or night to curb evaporative water loss.",
        "Monitor young seedlings and heat-sensitive crops for wilting or leaf curl.",
        "Provide mineral-salt supplements and shaded resting sheds for milking cattle.",
        "Plan harvesting or tillage during early morning hours."
      ]
    },
    authority: {
      title: "Civic Preparedness — Elevated Alert",
      icon: "🏛️",
      summary: "Review municipal heat readiness and monitor primary vulnerable wards.",
      tips: [
        "Monitor real-time weather stations and district heatwave forecast models.",
        "Inspect reliability of drinking-water distribution points across high-footfall areas.",
        "Coordinate with transport hubs and schools to ensure adequate hydration facilities.",
        "Keep municipal ambulances and paramedic squads on high alert."
      ]
    }
  },

  Moderate: {
    citizen: {
      title: "Citizen Advisory — Moderate Risk",
      icon: "👤",
      summary: "Warm conditions detected. Fatigue possible with prolonged outdoor exertion.",
      tips: [
        "Maintain routine water intake throughout the day.",
        "Take rest breaks in shaded areas if engaging in physical outdoor tasks.",
        "Wear lightweight, breathable clothing.",
        "Monitor children during outdoor afternoon sports."
      ]
    },
    farmer: {
      title: "Agricultural Advisory — Moderate Conditions",
      icon: "🌾",
      summary: "Standard seasonal warmth. Normal crop maintenance with adequate soil moisture.",
      tips: [
        "Ensure routine scheduled irrigation based on seasonal crop requirements.",
        "Provide clean drinking water for farm animals.",
        "Carry on normal harvesting and field maintenance with periodic hydration breaks."
      ]
    },
    authority: {
      title: "Civic Advisory — Moderate Monitoring",
      icon: "🏛️",
      summary: "Standard weather monitoring and routine civic health surveillance.",
      tips: [
        "Track daily temperature trajectory and local meteorological forecasts.",
        "Ensure standard public drinking-water stations are operational.",
        "Disseminate general seasonal health advisories."
      ]
    }
  },

  Low: {
    citizen: {
      title: "Citizen Advisory — Low Risk",
      icon: "👤",
      summary: "Pleasant to mild conditions. Minimal heat-related physiological strain.",
      tips: [
        "Enjoy outdoor activities while maintaining baseline hydration.",
        "Standard outdoor precautions apply."
      ]
    },
    farmer: {
      title: "Agricultural Advisory — Low Risk",
      icon: "🌾",
      summary: "Favourable conditions for standard field activities.",
      tips: [
        "Normal crop management and regular agricultural schedules.",
        "Standard livestock care."
      ]
    },
    authority: {
      title: "Civic Advisory — Low Risk",
      icon: "🏛️",
      summary: "Normal municipal operations with standard baseline monitoring.",
      tips: [
        "Routine meteorological surveillance.",
        "Standard public health measures."
      ]
    }
  }
};

export function getAdvisory(req, res) {
  const risk = req.query.risk || "Moderate";
  const role = req.query.role || "all";
  const validRisk = ADVISORY_RULES[risk] ? risk : "Moderate";

  const riskRules = ADVISORY_RULES[validRisk];

  if (role !== "all" && riskRules[role]) {
    return res.json({
      success: true,
      riskLevel: validRisk,
      role,
      advisory: riskRules[role],
      disclaimer: "General advisory generated from rule-based thresholds. Not intended as personalised medical or agricultural diagnosis."
    });
  }

  res.json({
    success: true,
    riskLevel: validRisk,
    advisories: riskRules,
    disclaimer: "General advisory generated from rule-based thresholds. Not intended as personalised medical or agricultural diagnosis."
  });
}
