import { useState, useRef, useEffect, useCallback } from "react";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";

const AddressInput = ({ value, onChange, name, placeholder, onPlaceSelected, className }) => {
  const [error, setError] = useState(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const lastSelectedRef = useRef(value);
  const isSelectingRef = useRef(false);
  // Track the last confirmed address to detect manual edits
  const lastConfirmedAddressRef = useRef(null);
  const { isLoaded } = useGoogleMapsApi();

  // Debug logging
  const debugRef = useRef({
    inputChanges: 0,
    placeSelections: 0,
    lastAction: null
  });

  // Initialize session token
  useEffect(() => {
    if (isLoaded && window.google?.maps?.places) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  // Helper function to highlight matching text
  const highlightMatch = (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <span key={index} className="text-gold font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Fetch autocomplete suggestions using new Places API
  const fetchSuggestions = useCallback(async (input) => {
    if (!isLoaded || !window.google?.maps?.places || !input.trim()) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      console.log('🔍 [AddressInput] Fetching suggestions for:', input);

      // Use the correct request structure for the new Places API
      const request = {
        input: input.trim(),
        sessionToken: sessionTokenRef.current,
        locationBias: {
          center: { lat: 46.8182, lng: 8.2275 }, // Switzerland center
          radius: 50000 // 50km radius (maximum allowed)
        },
        // Restrict to Switzerland and bordering countries only
        includedRegionCodes: ['CH', 'DE', 'FR', 'IT', 'AT', 'LI']
      };

      const { suggestions } = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      
      console.log('📍 [AddressInput] Received suggestions:', suggestions.length);
      setPredictions(suggestions);
      setShowSuggestions(suggestions.length > 0);
      setActiveSuggestionIndex(-1);

    } catch (error) {
      console.error('💥 Error fetching autocomplete suggestions:', error);
      setPredictions([]);
      setShowSuggestions(false);
    }
  }, [isLoaded]);

  // Handle place selection
  const selectPlace = useCallback(async (suggestion) => {
    if (!suggestion) return;

    try {
      isSelectingRef.current = true;
      console.log('📍 [AddressInput] Selecting place:', suggestion);
      console.log('📍 [AddressInput] Suggestion text structure:', {
        mainText: suggestion.placePrediction.structuredFormat?.mainText?.text,
        secondaryText: suggestion.placePrediction.structuredFormat?.secondaryText?.text,
        fullText: suggestion.placePrediction.text?.text
      });

      // Convert suggestion to place using new API
      const place = await suggestion.placePrediction.toPlace();
      
      console.log('🔍 [AddressInput] Place object:', place);
      
      // Fetch required fields with correct field names for new API
      await place.fetchFields({
        fields: ['location', 'formattedAddress', 'displayName', 'addressComponents', 'types', 'id', 'internationalPhoneNumber', 'nationalPhoneNumber', 'businessStatus']
      });

      console.log('📋 [AddressInput] Place after fetchFields:', {
        location: place.location,
        formattedAddress: place.formattedAddress,
        displayName: place.displayName,
        addressComponents: place.addressComponents,
        types: place.types,
        id: place.id
      });

      // Use the exact suggestion text that user sees in dropdown
      const suggestionMainText = suggestion.placePrediction.structuredFormat?.mainText?.text;
      const suggestionSecondaryText = suggestion.placePrediction.structuredFormat?.secondaryText?.text;
      const suggestionFullText = suggestion.placePrediction.text?.text;
      
      // Build display name using the exact text shown to user
      let displayName;
      
      // Priority 1: Use the full suggestion text if available (most descriptive)
      if (suggestionFullText && suggestionFullText.length > 0) {
        displayName = suggestionFullText;
      }
      // Priority 2: Combine main + secondary text (what user sees in dropdown)
      else if (suggestionMainText && suggestionSecondaryText) {
        displayName = `${suggestionMainText}, ${suggestionSecondaryText}`;
      }
      // Priority 3: Just main text
      else if (suggestionMainText) {
        displayName = suggestionMainText;
      }
      // Priority 4: Fallback to place data
      else if (place.formattedAddress && place.formattedAddress !== "Switzerland" && place.formattedAddress.length > 10) {
        displayName = place.formattedAddress;
      }
      // Priority 5: Last resort
      else {
        displayName = place.displayName || "Selected Location";
      }

      console.log('🎯 [AddressInput] Display name decision:', {
        chosen: displayName,
        suggestionFullText,
        suggestionMainText,
        suggestionSecondaryText,
        placeFormattedAddress: place.formattedAddress,
        placeDisplayName: place.displayName
      });

      const countryComponent = place.addressComponents?.find(
        component => component.types.includes("country")
      );

      const isSwiss = countryComponent?.shortText === "CH";

      const placeInfo = {
        formattedAddress: displayName,
        routingAddress: displayName,
        location: {
          lat: place.location?.lat() || 0,
          lng: place.location?.lng() || 0
        },
        placeId: place.id,
        isSwiss,
        originalName: place.displayName,
        types: place.types || [],
        isConfirmed: true
      };

      console.log('✅ [AddressInput] Place selected:', placeInfo);

      lastSelectedRef.current = displayName;
      // Store the confirmed address to detect future manual edits
      lastConfirmedAddressRef.current = displayName;
      setIsLocationSelected(true);
      setShowSuggestions(false);
      setPredictions([]);
      setError(null);

      // Create new session token for next request
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();

      // Call onChange with the place info
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

      isSelectingRef.current = false;

    } catch (error) {
      console.error('💥 Error selecting place:', error);
      setError("Error loading place details. Please try again.");
      isSelectingRef.current = false;
    }
  }, [name, onChange, onPlaceSelected]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    debugRef.current.inputChanges++;
    const changeId = `input-${Date.now()}-${debugRef.current.inputChanges}`;
    
    console.group(`⌨️ [${changeId}] Input change for field: ${name}`);
    
    const newValue = e.target.value;
    console.log('📝 Input details:', {
      newValue,
      previousValue: value,
      isSelecting: isSelectingRef.current,
      lastConfirmedAddress: lastConfirmedAddressRef.current
    });

    if (!isSelectingRef.current) {
      // Check if this is a manual edit after a confirmed selection
      const wasManuallyEdited = lastConfirmedAddressRef.current && 
                               newValue !== lastConfirmedAddressRef.current && 
                               newValue.trim() !== '';
      
      console.log('🔍 Manual edit detection:', {
        wasManuallyEdited,
        hasLastConfirmed: !!lastConfirmedAddressRef.current,
        valueChanged: newValue !== lastConfirmedAddressRef.current
      });

      onChange({
        target: {
          name,
          value: newValue,
          placeInfo: {
            formattedAddress: newValue,
            isConfirmed: false, // Always false for manual input
            wasManuallyEdited // Flag to indicate this was manually edited after selection
          }
        }
      });
      
      setError(null);
      setIsLocationSelected(false);
      
      // If manually edited after confirmation, clear the confirmed address reference
      if (wasManuallyEdited) {
        lastConfirmedAddressRef.current = null;
        console.log('🧹 Cleared confirmed address reference due to manual edit');
      }
      
      // Fetch suggestions for new input
      if (newValue.trim()) {
        fetchSuggestions(newValue);
      } else {
        setPredictions([]);
        setShowSuggestions(false);
        // Clear confirmed reference when input is empty
        lastConfirmedAddressRef.current = null;
      }
    }

    console.groupEnd();
  }, [onChange, name, fetchSuggestions, value]);

  // Handle input focus - show suggestions if there's enough text
  const handleInputFocus = useCallback(() => {
    console.log('🎯 [AddressInput] Input focused:', {
      currentValue: value,
      valueLength: value?.length,
      hasEnoughChars: value && value.trim().length >= 2
    });
    
    // Scroll into view when user clicks/focuses on address input on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        if (inputRef.current) {
          const inputRect = inputRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Position at 25% from top for better visibility
          const targetPosition = viewportHeight * 0.25;
          const currentPosition = inputRect.top;
          
          if (currentPosition > targetPosition) {
            const scrollAmount = currentPosition - targetPosition;
            window.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            });
          }
        }
      }, 100); // Small delay to ensure input is focused
    }
    
    // If there's enough text to trigger suggestions, fetch them
    if (value && value.trim().length >= 2) {
      console.log('🔍 [AddressInput] Refetching suggestions on focus');
      fetchSuggestions(value);
    }
  }, [value, fetchSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions || predictions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : predictions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && predictions[activeSuggestionIndex]) {
          selectPlace(predictions[activeSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, predictions, activeSuggestionIndex, selectPlace]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle value sync
  useEffect(() => {
    if (!isSelectingRef.current) {
      lastSelectedRef.current = value;
      setIsLocationSelected(!!value && value === lastSelectedRef.current);
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        name={name}
        placeholder={placeholder || "Enter location"}
        className={`bg-warm-white/80 backdrop-blur-sm mb-3 py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 focus:shadow-[0_0_15px_rgba(65,105,225,0.1)] focus:outline-none ${
          error ? 'border-red-500 ring-1 ring-red-500/50' : isLocationSelected ? 'border-gold/50 ring-1 ring-gold/20' : 'border-royal-blue/20'
        } ${className || ''} ${showSuggestions ? 'rounded-t-lg rounded-b-none' : 'rounded-lg'}`}
        autoComplete="off"
        aria-label={placeholder || "Location input"}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-activedescendant={activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined}
      />
      
      {/* Custom suggestions dropdown - updated to harmonious theme */}
      {showSuggestions && predictions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-[9999] w-full top-full -mt-0 bg-warm-white/95 backdrop-blur-md border border-royal-blue/30 rounded-lg shadow-xl overflow-hidden"
          role="listbox"
        >
          {predictions.map((suggestion, index) => (
            <div
              key={suggestion.placePrediction.placeId}
              id={`suggestion-${index}`}
              className={`flex items-center cursor-pointer transition-all duration-200 ${
                index === activeSuggestionIndex 
                  ? 'bg-royal-blue/10' 
                  : 'hover:bg-royal-blue/5'
              } ${index !== 0 ? 'border-t border-royal-blue/10' : ''}`}
              style={{
                padding: '0.75rem 1rem'
              }}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              onClick={() => selectPlace(suggestion)}
              role="option"
              aria-selected={index === activeSuggestionIndex}
            >
              <div className="mr-3 flex-shrink-0 text-royal-blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-700 text-sm font-medium">
                  {highlightMatch(suggestion.placePrediction.structuredFormat?.mainText?.text || 
                   suggestion.placePrediction.text?.text, value)}
                </div>
                {suggestion.placePrediction.structuredFormat?.secondaryText?.text && (
                  <div className="text-gray-500 text-sm">
                    {suggestion.placePrediction.structuredFormat.secondaryText.text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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