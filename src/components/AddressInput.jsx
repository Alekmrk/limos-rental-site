import { useState, useEffect, useRef } from "react";
import { isHotel } from "../services/GoogleMapsService";

// Swiss airports data remains the same
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

const AIRPORT_KEYWORDS = [
  { partial: 'air', full: 'airport' },
  { partial: 'airp', full: 'airport' },
  { partial: 'flug', full: 'flughafen' },
  { partial: 'aero', full: 'aeroport' }
];

// Common hotel chains in Switzerland for better suggestions
const HOTEL_CHAINS = [
  'hilton', 'marriott', 'sheraton', 'hyatt', 'radisson', 
  'novotel', 'swissotel', 'movenpick', 'four seasons'
];

const AddressInput = ({ value, onChange, name, placeholder, onBlur, className, onPlaceSelected }) => {
  const [showAirports, setShowAirports] = useState(false);
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [placeDetails, setPlaceDetails] = useState(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Initialize Google Maps Autocomplete when the component mounts
  useEffect(() => {
    if (!window.google) return;
    
    const options = {
      types: ["establishment", "geocode"],
      componentRestrictions: { country: "ch" },
      fields: ["formatted_address", "geometry", "place_id", "types", "name"]
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        const detectedHotel = isHotel(place.types || []);
        const placeInfo = {
          formattedAddress: place.formatted_address,
          location: place.geometry?.location ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          } : null,
          placeId: place.place_id,
          isHotel: detectedHotel,
          name: place.name
        };

        setPlaceDetails(placeInfo);
        onChange({
          target: {
            name,
            value: detectedHotel ? `${place.name}, ${place.formatted_address}` : place.formatted_address
          }
        });

        if (onPlaceSelected) {
          onPlaceSelected(placeInfo);
        }

        setShowAirports(false);
      }
    });

    return () => {
      if (window.google && listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [name, onChange, onPlaceSelected]);

  // Handle clicks outside the component to close the suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowAirports(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if the input is an airport search
  const isAirportSearch = (query) => {
    const lowercaseQuery = query?.toLowerCase().trim() || '';
    return AIRPORT_KEYWORDS.some(keyword => 
      lowercaseQuery.includes(keyword.partial)
    ) || SWISS_AIRPORTS.some(airport => 
      lowercaseQuery.includes(airport.code.toLowerCase())
    );
  };

  // Get airport suggestions based on the input
  const getAirportSuggestions = (query) => {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase().trim();
    return SWISS_AIRPORTS.filter(airport => {
      return airport.keywords.some(keyword => keyword.includes(lowercaseQuery)) ||
             airport.code.toLowerCase().includes(lowercaseQuery) ||
             airport.city.toLowerCase().includes(lowercaseQuery);
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    onChange(e);
    setPlaceDetails(null);

    // Check for airports or hotels
    const lowercaseValue = value.toLowerCase();
    if (isAirportSearch(lowercaseValue)) {
      const suggestions = getAirportSuggestions(lowercaseValue);
      setAirportSuggestions(suggestions);
      setShowAirports(suggestions.length > 0);
    } else {
      setShowAirports(false);
    }

    // Bias autocomplete to hotels when hotel-related keywords are typed
    if (HOTEL_CHAINS.some(chain => lowercaseValue.includes(chain)) || 
        lowercaseValue.includes('hotel')) {
      if (autocompleteRef.current) {
        autocompleteRef.current.setTypes(['lodging']);
      }
    } else {
      if (autocompleteRef.current) {
        autocompleteRef.current.setTypes(['establishment', 'geocode']);
      }
    }
  };

  // Handle airport selection
  const handleAirportSelect = (airport) => {
    const airportInfo = {
      formattedAddress: airport.display,
      isAirport: true,
      code: airport.code
    };
    
    onChange({
      target: {
        name,
        value: airport.display
      }
    });
    
    if (onPlaceSelected) {
      onPlaceSelected(airportInfo);
    }
    
    setShowAirports(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder || "Enter an address in Switzerland"}
        className={`bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border text-white transition-colors ${className || 'border-zinc-700/50'}`}
        autoComplete="off"
      />

      {showAirports && airportSuggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-zinc-800 border border-zinc-700/50 rounded-[0.6rem] mt-[-10px] max-h-60 overflow-y-auto">
          {airportSuggestions.map((airport, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-white text-sm border-b border-zinc-700/50 last:border-b-0"
              onClick={() => handleAirportSelect(airport)}
            >
              {airport.display}
            </li>
          ))}
        </ul>
      )}

      {placeDetails?.isHotel && (
        <div className="absolute right-3 top-2">
          <span className="text-gold text-sm bg-gold/10 px-2 py-1 rounded-full">
            Hotel
          </span>
        </div>
      )}
    </div>
  );
};

export default AddressInput;