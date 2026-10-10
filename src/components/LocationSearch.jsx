import React, { useState, useEffect, useRef } from "react";
import { searchCities } from "../services/api";

function LocationSearch({ onLocationSelect, currentCity = "" }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch location search suggestions with debounce
  useEffect(() => {
    if (!search.trim()) {
      // Fetch popular defaults when input is empty
      searchCities("").then((res) => {
        if (res && res.results) setResults(res.results);
      }).catch(() => {});
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchCities(search.trim());
        if (res && res.results) {
          setResults(res.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  function handleSelect(cityObj) {
    const formatted = cityObj.displayName || `${cityObj.name}, ${cityObj.region}`;
    setSearch(cityObj.name);
    setShowResults(false);
    if (onLocationSelect) {
      onLocationSelect({
        city: cityObj.name,
        region: cityObj.region,
        displayName: formatted
      });
    }
  }

  function handleClear() {
    setSearch("");
    setShowResults(false);
  }

  return (
    <div className="location-search" ref={wrapperRef}>
      <div className="search-box">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Search for an Indian city (e.g., Delhi, Pune, Jaipur)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          aria-label="Search city for heat intelligence data"
        />

        {loading && <span className="search-spinner" aria-label="Searching">⏳</span>}

        {search && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear location search"
            type="button"
          >
            ×
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-results" role="listbox">
          <div className="search-results-header">
            {search.trim() ? "Search Results" : "Popular Indian Cities"}
          </div>

          {results.length > 0 ? (
            results.map((item, index) => (
              <button
                key={index}
                className="search-result"
                onClick={() => handleSelect(item)}
                type="button"
                role="option"
              >
                <span className="result-pin">📍</span>
                <span className="result-name">
                  <strong>{item.name}</strong>
                  {item.region && <span className="result-region">, {item.region}</span>}
                </span>
              </button>
            ))
          ) : (
            <div className="no-results">
              <p>No matching city found for "{search}".</p>
              <small>Try searching for major Indian urban hubs or district centres.</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;
