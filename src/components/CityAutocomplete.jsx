import { useState, useEffect, useCallback, useMemo } from "react";

const CityAutocomplete = ({ onSelect, savedQuery, onClear }) => {
  const [query, setQuery] = useState(savedQuery || "");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useCallback(async () => {
    const url = `/.netlify/functions/geoapify-proxy?text=${encodeURIComponent(
      query
    )}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const filteredMap = new Map();
      (data.features || []).forEach((f) => {
        const { city, name, state, country } = f.properties;
        const cityName = city || name || "";
        const uniqueKey = `${cityName}|${state}|${country}`;

        if (
          cityName.toLowerCase().includes(query.toLowerCase()) &&
          !filteredMap.has(uniqueKey)
        ) {
          filteredMap.set(uniqueKey, f);
        }
      });

      setSuggestions(Array.from(filteredMap.values()));
    } catch (err) {
      console.error("Errore nel caricamento dei suggerimenti:", err);
      setSuggestions([]);
    }
  }, [query]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    if (query.trim() === "") {
      onClear();
      localStorage.removeItem("selectedCity");
    }
  }, [query, onClear]);

  const handleSelect = useCallback(
    (feature) => {
      const { city, name, state, country } = feature.properties;
      const cityName = city || name;
      setQuery(`${cityName}, ${state}, ${country}`);
      setSuggestions([]);
      onSelect(feature);
    },
    [onSelect]
  );

  const renderedSuggestions = useMemo(
    () =>
      suggestions.map((feature, idx) => {
        const { city, name, state, country } = feature.properties;
        const cityName = city || name;
        return (
          <li
            key={`${cityName}-${state}-${country}-${idx}`}
            className="list-group-item list-group-item-action"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect(feature)}
          >
            {cityName}
            {state ? `, ${state}` : ""}
            {country ? `, ${country}` : ""}
          </li>
        );
      }),
    [suggestions, handleSelect]
  );

  return (
    <div className="position-relative mb-4 container">
      <input
        type="text"
        className="form-control"
        placeholder="Cerca una città"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Campo di ricerca città"
      />
      {query.length >= 2 && suggestions.length > 0 && (
        <ul
          className="list-group position-absolute w-100 mt-1"
          style={{ zIndex: 99999 }}
        >
          {renderedSuggestions}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;
