import { useState, useEffect, useRef } from "react";

const API_KEY = process.env.REACT_APP_HERE_API_KEY;

// Swiss airports data
const SWISS_AIRPORTS = [
  {
    name: 'Zürich Airport',
    city: 'Zürich',
    code: 'ZRH',
    keywords: ['zurich', 'kloten', 'zürich', 'zuerich'],
    display: 'Zürich Airport (ZRH), Kloten, Switzerland'
  },
  {
    name: 'Geneva Airport',
    city: 'Geneva',
    code: 'GVA',
    keywords: ['geneva', 'geneve', 'genève', 'cointrin'],
    display: 'Geneva Airport (GVA), Geneva, Switzerland'
  },
  {
    name: 'EuroAirport Basel Mulhouse Freiburg',
    city: 'Basel',
    code: 'BSL',
    keywords: ['basel', 'mulhouse', 'freiburg', 'bsl', 'mlh'],
    display: 'EuroAirport Basel Mulhouse Freiburg (BSL), Basel, Switzerland'
  },
  {
    name: 'Bern Airport',
    city: 'Bern',
    code: 'BRN',
    keywords: ['bern', 'belp'],
    display: 'Bern Airport (BRN), Belp, Switzerland'
  },
  {
    name: 'Lugano Airport',
    city: 'Lugano',
    code: 'LUG',
    keywords: ['lugano', 'agno'],
    display: 'Lugano Airport (LUG), Agno, Switzerland'
  },
  {
    name: 'Sion Airport',
    city: 'Sion',
    code: 'SIR',
    keywords: ['sion'],
    display: 'Sion Airport (SIR), Sion, Switzerland'
  },
  {
    name: 'St. Gallen-Altenrhein Airport',
    city: 'St. Gallen',
    code: 'ACH',
    keywords: ['st. gallen', 'saint gallen', 'st gallen', 'altenrhein'],
    display: 'St. Gallen-Altenrhein Airport (ACH), St. Gallen, Switzerland'
  }
];

// Keywords that indicate an airport search (from shortest to longest)
const AIRPORT_KEYWORDS = [
  { partial: 'air', full: 'airport' },
  { partial: 'airp', full: 'airport' },
  { partial: 'airpo', full: 'airport' },
  { partial: 'airport', full: 'airport' },
  { partial: 'flu', full: 'flughafen' },
  { partial: 'flug', full: 'flughafen' },
  { partial: 'flugh', full: 'flughafen' },
  { partial: 'flughafen', full: 'flughafen' },
  { partial: 'aer', full: 'aeroport' },
  { partial: 'aero', full: 'aeroport' },
  { partial: 'aerop', full: 'aeroport' },
  { partial: 'aeroport', full: 'aeroport' }
];

const AddressInput = ({ value, onChange, name, placeholder, onBlur, className }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAirportSearch = (query) => {
    const lowercaseQuery = query.toLowerCase().trim();
    
    // Check for airport keywords
    return AIRPORT_KEYWORDS.some(keyword => 
      lowercaseQuery.includes(keyword.partial) ||
      SWISS_AIRPORTS.some(airport => lowercaseQuery.includes(airport.code.toLowerCase()))
    );
  };

  const getAirportSuggestions = (query) => {
    const lowercaseQuery = query.toLowerCase().trim();
    
    // If it's just an airport keyword, show all airports
    const isJustAirportKeyword = AIRPORT_KEYWORDS.some(keyword => 
      lowercaseQuery === keyword.partial || lowercaseQuery === keyword.full
    );

    if (isJustAirportKeyword) {
      return SWISS_AIRPORTS.map(airport => ({
        display: airport.display,
        full: airport.display,
        type: 'airport',
        importance: 1,
        code: airport.code
      }));
    }

    // Remove airport keywords from the search term
    let searchTerm = lowercaseQuery;
    AIRPORT_KEYWORDS.forEach(keyword => {
      searchTerm = searchTerm.replace(keyword.partial, '').replace(keyword.full, '');
    });
    searchTerm = searchTerm.trim();

    return SWISS_AIRPORTS
      .filter(airport => {
        if (!searchTerm) {
          return true; // Show all airports if only airport keyword is present
        }
        return airport.keywords.some(keyword => keyword.includes(searchTerm)) ||
               airport.code.toLowerCase().includes(searchTerm) ||
               airport.city.toLowerCase().includes(searchTerm) ||
               searchTerm.includes(airport.code.toLowerCase());
      })
      .map(airport => ({
        display: airport.display,
        full: airport.display,
        type: 'airport',
        importance: 1,
        code: airport.code
      }));
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setError(null);

      // Check if this is an airport search
      const airportSearchCheck = isAirportSearch(query);
      
      // Get airport suggestions
      const airportResults = getAirportSuggestions(query);

      // If it's an airport search and we have results, only show airports
      if (airportSearchCheck && airportResults.length > 0) {
        setSuggestions(airportResults);
        return;
      }

      // Otherwise, fetch general location suggestions from HERE API
      const baseUrl = 'https://geocode.search.hereapi.com/v1/geocode';
      const params = new URLSearchParams({
        q: `${query} Switzerland`,
        apiKey: API_KEY,
        limit: 10,
        lang: 'en'
      });

      const response = await fetch(`${baseUrl}?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        console.error("Invalid response format:", data);
        setSuggestions(airportResults);
        return;
      }

      const locationSuggestions = data.items
        .filter(item => item.address && item.address.countryCode === 'CHE')
        .map(item => {
          const address = item.address;
          const parts = [];

          if (address.street) parts.push(address.street);
          if (address.houseNumber) parts.push(address.houseNumber);
          if (address.city) parts.push(address.city);
          if (address.postalCode) parts.push(address.postalCode);
          parts.push('Switzerland');

          return {
            display: parts.filter(Boolean).join(', '),
            full: address.label,
            type: 'location',
            importance: 0.9
          };
        });

      // Combine and sort all suggestions
      const allSuggestions = [...airportResults, ...locationSuggestions];
      
      // Sort results
      allSuggestions.sort((a, b) => {
        // Always prioritize exact airport code matches
        const isExactAirportCodeMatch = (suggestion, q) => 
          suggestion.type === 'airport' && 
          suggestion.code?.toLowerCase() === q.toLowerCase();

        if (isExactAirportCodeMatch(a, query)) return -1;
        if (isExactAirportCodeMatch(b, query)) return 1;

        // Then prioritize exact matches
        const aStartMatch = a.display.toLowerCase().startsWith(query.toLowerCase());
        const bStartMatch = b.display.toLowerCase().startsWith(query.toLowerCase());
        if (aStartMatch && !bStartMatch) return -1;
        if (!aStartMatch && bStartMatch) return 1;
        
        // Then prioritize airports if searching for airports
        if (airportSearchCheck) {
          if (a.type === 'airport' && b.type !== 'airport') return -1;
          if (a.type !== 'airport' && b.type === 'airport') return 1;
        }
        
        return b.importance - a.importance;
      });

      setSuggestions(allSuggestions.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to fetch address suggestions");
      setSuggestions(getAirportSuggestions(query));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    onChange(e);
    setShowSuggestions(true);
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    const syntheticEvent = {
      target: {
        name,
        value: suggestion.full
      }
    };
    onChange(syntheticEvent);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder || "Enter an address in Switzerland"}
        className={`bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border text-white transition-colors ${className || 'border-zinc-700/50'}`}
        autoComplete="off"
      />
      {error && (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      )}
      {!API_KEY && (
        <div className="text-red-500 text-sm mb-2">
          HERE API key is missing
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-zinc-800 border border-zinc-700/50 rounded-[0.6rem] mt-[-10px] max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-white text-sm border-b border-zinc-700/50 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;