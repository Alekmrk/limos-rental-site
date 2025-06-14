import { useState, useRef, useEffect, useCallback } from "react";

const AddressInput = ({ value, onChange, name, placeholder, onPlaceSelected, className }) => {
  const [error, setError] = useState(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const lastSelectedRef = useRef(value);
  const isSelectingRef = useRef(false);
  const observerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Debug logging
  const debugRef = useRef({
    inputChanges: 0,
    placeSelections: 0,
    lastAction: null
  });

  const setupAutocomplete = useCallback(() => {
    console.log('🔧 [AddressInput] Setting up autocomplete for field:', name);
    
    if (!window.google || !inputRef.current) {
      console.log('⚠️ [AddressInput] Google Maps or input ref not available');
      return;
    }

    if (autocompleteRef.current) {
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();

    const options = {
      fields: ["formatted_address", "geometry", "place_id", "address_components", "name", "types"],
      sessionToken: sessionTokenRef.current,
      bounds: new window.google.maps.LatLngBounds(
        { lat: 45.8179, lng: 5.9566 },  // Southwest corner of Switzerland
        { lat: 47.8084, lng: 10.4915 }  // Northeast corner of Switzerland
      ),
      strictBounds: false,
      // Remove the country restriction to allow other European countries
      componentRestrictions: { country: ['ch', 'de', 'fr', 'it', 'at', 'li'] }
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);
    
    // Bias the results towards Switzerland without restricting to it
    const switzerlandCenter = new window.google.maps.LatLng(46.8182, 8.2275);
    autocompleteRef.current.setBounds(new window.google.maps.LatLngBounds(
      switzerlandCenter,  // Center point
      switzerlandCenter  // Center point
    ).extend(new window.google.maps.LatLng(45.8179, 5.9566))  // Extend to cover Switzerland
     .extend(new window.google.maps.LatLng(47.8084, 10.4915)));

    // Add a listener for when the input starts receiving predictions
    const pacContainer = document.querySelector('.pac-container');
    if (pacContainer) {
      const observer = new MutationObserver(() => {
        setIsTyping(true);
      });
      observer.observe(pacContainer, { childList: true, subtree: true });
    }

    autocompleteRef.current.addListener("place_changed", () => {
      debugRef.current.placeSelections++;
      const selectionId = `selection-${Date.now()}-${debugRef.current.placeSelections}`;
      
      console.group(`📍 [${selectionId}] Place selection for field: ${name}`);
      
      const place = autocompleteRef.current.getPlace();
      isSelectingRef.current = true;
      setError(null);
      setIsTyping(false);

      console.log('📊 Place object:', place);

      if (!place.geometry) {
        console.log('❌ No geometry found - invalid place');
        setError("Please select a location from the suggestions");
        isSelectingRef.current = false;
        setIsLocationSelected(false);
        console.groupEnd();
        return;
      }

      const countryComponent = place.address_components?.find(
        component => component.types.includes("country")
      );

      const isSwiss = countryComponent?.short_name === "CH";
      
      // Always use the full formatted address for consistency
      const displayName = place.formatted_address;

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

      console.log('✅ Valid place selected:', {
        displayName,
        isSwiss,
        placeInfo,
        alwaysUsingFullAddress: true
      });

      lastSelectedRef.current = displayName;
      setIsLocationSelected(true);
      debugRef.current.lastAction = { type: 'place_selected', timestamp: Date.now(), placeInfo };

      // Call onChange with both the displayName and placeInfo
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
      
      console.groupEnd();
    });
  }, [name, onChange, onPlaceSelected]);

  // Handle autocomplete setup
  useEffect(() => {
    setupAutocomplete();
    return () => {
      if (window.google && autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [setupAutocomplete]);

  // Handle styles observer
  useEffect(() => {
    const setupStyleObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new MutationObserver((mutations) => {
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

      observerRef.current.observe(document.body, {
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
    debugRef.current.inputChanges++;
    const changeId = `input-${Date.now()}-${debugRef.current.inputChanges}`;
    
    console.group(`⌨️ [${changeId}] Input change for field: ${name}`);
    
    const newValue = e.target.value;
    console.log('📝 Input details:', {
      newValue,
      previousValue: value,
      isSelecting: isSelectingRef.current,
      lastSelected: lastSelectedRef.current,
      isLocationSelected
    });
    
    setIsTyping(true);
    
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!isSelectingRef.current) {
      console.log('🔄 Triggering onChange with manual input');
      debugRef.current.lastAction = { type: 'manual_input', timestamp: Date.now(), value: newValue };
      
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
    } else {
      console.log('⏭️ Skipping onChange - place selection in progress');
    }

    if (!newValue) {
      console.log('🧹 Empty value - clearing selections');
      lastSelectedRef.current = null;
      isSelectingRef.current = false;
      setIsLocationSelected(false);
      setIsTyping(false);
    }

    // Set a timeout to clear the typing state
    typingTimeoutRef.current = setTimeout(() => {
      console.log('⏰ Typing timeout - clearing typing state');
      setIsTyping(false);
    }, 1000);
    
    console.groupEnd();
  }, [onChange, name, value, isLocationSelected]);

  const handleKeyDown = (e) => {
    console.log('⌨️ [AddressInput] Key pressed:', {
      key: e.key,
      field: name,
      currentValue: value
    });
    
    // Get the active element
    const pacContainer = document.querySelector('.pac-container');
    const hasSuggestions = pacContainer && pacContainer.children.length > 0;
    
    console.log('🔍 Suggestions state:', {
      hasSuggestions,
      pacContainerExists: !!pacContainer,
      suggestionsCount: pacContainer?.children?.length || 0
    });
    
    if (e.key === 'Enter') {
      console.log('🔄 Enter key pressed');
      // Only prevent form submission if there are no suggestions
      // This allows the Google Places Autocomplete to handle selection on Enter
      if (!hasSuggestions) {
        console.log('🛑 Preventing form submission - no suggestions available');
        e.preventDefault();
      } else {
        console.log('✅ Allowing autocomplete to handle Enter');
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