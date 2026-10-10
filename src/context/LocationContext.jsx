import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState({
    city: "Mumbai",
    region: "Maharashtra",
    displayName: "Mumbai, Maharashtra"
  });

  function setLocation(loc) {
    if (typeof loc === "string") {
      const parts = loc.split(",");
      const city = parts[0].trim();
      const region = parts[1] ? parts[1].trim() : "India";
      setSelectedLocation({
        city,
        region,
        displayName: loc
      });
    } else if (loc && loc.city) {
      setSelectedLocation({
        city: loc.city,
        region: loc.region || "India",
        displayName: loc.displayName || `${loc.city}, ${loc.region || "India"}`
      });
    }
  }

  return (
    <LocationContext.Provider value={{ selectedLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return ctx;
}
