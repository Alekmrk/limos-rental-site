import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const AddressInput = ({ value, onChange, name, placeholder, onPlaceSelected, className }) => {
  const [error, setError] = useState(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const lastSelectedRef = useRef(value);
  const isSelectingRef = useRef(false);
  
  // Memoize the bounds to prevent recreating on every render
  const switzerlandBounds = useMemo(() => {
    if (window.google) {
      return new window.google.maps.LatLngBounds(
        { lat: 45.8179, lng: 5.9566 },
        { lat: 47.8084, lng: 10.4915 }
      );
    }
    return null;
  }, []);

  // Memoize autocomplete options
  const autocompleteOptions = useMemo(() => ({
    fields: ["formatted_address", "geometry", "place_id", "address_components", "name", "types"],
    bounds: switzerlandBounds,
    strictBounds: false,
    componentRestrictions: { country: ['ch', 'de', 'fr', 'it', 'at', 'li'] }
  }), [switzerlandBounds]);

  // Setup autocomplete once when component mounts
  useEffect(() => {
    if (!window.google || !inputRef.current || autocompleteRef.current) return;

    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        ...autocompleteOptions,
        sessionToken: sessionTokenRef.current
      }
    );

    const handlePlaceChange = () => {
      const place = autocompleteRef.current.getPlace();
      isSelectingRef.current = true;
      setError(null);
      setIsTyping(false);

      if (!place.geometry) {
        setError("Please select a location from the suggestions");
        isSelectingRef.current = false;
        setIsLocationSelected(false);
        return;
      }

      const countryComponent = place.address_components?.find(
        component => component.types.includes("country")
      );

      const isSwiss = countryComponent?.short_name === "CH";
      const isSpecialLocation = place.types?.some(type => 
        ['airport', 'train_station', 'transit_station', 'premise', 'point_of_interest'].includes(type)
      );

      const displayName = isSpecialLocation ? place.name : place.formatted_address;
      const placeInfo = {
        formattedAddress: displayName,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        placeId: place.place_id,
        isSwiss,
        originalName: place.name,
        types: place.types,
        isConfirmed: true
      };

      lastSelectedRef.current = displayName;
      setIsLocationSelected(true);
      
      onChange({
        target: {
          name,
          value: displayName,
          placeInfo
        }
      });

      if (onPlaceSelected) {
        onPlaceSelected(placeInfo);
      }

      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      isSelectingRef.current = false;
    };

    autocompleteRef.current.addListener("place_changed", handlePlaceChange);

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [autocompleteOptions, name, onChange, onPlaceSelected]);

  // Handle styles observer
  useEffect(() => {
    const setupStyleObserver = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains('pac-container')) {
              node.classList.add(
                'dark:bg-zinc-800/85',
                'backdrop-blur-xl',
                'border',
                'border-zinc-700/50',
                'rounded-2xl',
                'shadow-xl',
                'mt-2',
                'overflow-hidden'
              );

              node.querySelectorAll('.pac-item').forEach(item => {
                item.classList.add(
                  'text-white',
                  'hover:bg-gold/20',
                  'cursor-pointer',
                  'px-6',
                  'py-3',
                  'border-zinc-700/50'
                );
              });

              node.querySelectorAll('.pac-item-query').forEach(query => {
                query.classList.add('text-white');
              });

              node.style.border = 'none';
              node.style.background = 'transparent';
              node.style.boxShadow = 'none';
              node.style.marginTop = '8px';
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    setupStyleObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle value sync
  useEffect(() => {
    if (!isSelectingRef.current) {
      lastSelectedRef.current = value;
      setIsLocationSelected(!!value && value === lastSelectedRef.current);
    }
  }, [value]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setIsTyping(true);
    
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!isSelectingRef.current) {
      onChange({
        target: {
          name,
          value: newValue,
          placeInfo: {
            formattedAddress: newValue,
            isConfirmed: false
          }
        }
      });
      setError(null);
      setIsLocationSelected(false);
    }

    if (!newValue) {
      lastSelectedRef.current = null;
      isSelectingRef.current = false;
      setIsLocationSelected(false);
      setIsTyping(false);
    }

    // Set a timeout to clear the typing state
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, [onChange, name]);

  const handleKeyDown = (e) => {
    // Get the active element
    const pacContainer = document.querySelector('.pac-container');
    const hasSuggestions = pacContainer && pacContainer.children.length > 0;

    if (e.key === 'Enter') {
      // Only prevent form submission if there are no suggestions
      // This allows the Google Places Autocomplete to handle selection on Enter
      if (!hasSuggestions) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        name={name}
        placeholder={placeholder || "Enter location"}
        className={`bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border text-white transition-colors ${
          error ? 'border-red-500' : isLocationSelected ? 'border-gold' : isTyping ? 'border-zinc-500' : className || 'border-zinc-700/50'
        }`}
        autoComplete="off"
        aria-label={placeholder || "Location input"}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="false"
      />
      {error && (
        <div 
          id={`${name}-error`}
          className="absolute -bottom-1 left-0 text-red-500 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AddressInput;