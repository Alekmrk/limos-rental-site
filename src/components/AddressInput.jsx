import { useState, useRef, useEffect } from "react";

const AddressInput = ({ value, onChange, name, placeholder, onPlaceSelected, className }) => {
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const lastSelectedRef = useRef(value);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    if (!window.google) return;

    // Create a new session token for billing optimization
    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();

    const switzerlandBounds = {
      north: 47.8084,
      south: 45.8179,
      west: 5.9566,
      east: 10.4915
    };

    const options = {
      fields: ["formatted_address", "geometry", "place_id", "address_components"],
      sessionToken: sessionTokenRef.current,
      bounds: new window.google.maps.LatLngBounds(
        { lat: switzerlandBounds.south, lng: switzerlandBounds.west },
        { lat: switzerlandBounds.north, lng: switzerlandBounds.east }
      ),
      strictBounds: false
    };

    if (autocompleteRef.current) {
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);

    // Apply custom styles to the autocomplete dropdown
    const pacContainer = document.querySelector('.pac-container');
    if (pacContainer) {
      pacContainer.remove();
    }
    
    // Observer to style new pac-containers as they are added
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

            // Style all pac-items
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

            // Style the pac-item-query (main text)
            node.querySelectorAll('.pac-item-query').forEach(query => {
              query.classList.add('text-white');
            });

            // Remove the Google default styles
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

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      isSelectingRef.current = true;
      setError(null);

      if (!place.geometry) {
        setError("Please select a location from the suggestions");
        isSelectingRef.current = false;
        return;
      }

      const countryComponent = place.address_components?.find(
        component => component.types.includes("country")
      );
      const adminArea = place.address_components?.find(
        component => component.types.includes("administrative_area_level_1")
      );

      const isSwiss = countryComponent?.short_name === "CH";
      const canton = adminArea?.short_name;

      const placeInfo = {
        formattedAddress: place.formatted_address,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        placeId: place.place_id,
        isSwiss,
        canton
      };

      lastSelectedRef.current = place.formatted_address;

      onChange({
        target: {
          name,
          value: place.formatted_address
        }
      });

      if (onPlaceSelected) {
        onPlaceSelected(placeInfo);
      }

      // Create a new session token for the next search
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      isSelectingRef.current = false;
    });

    return () => {
      observer.disconnect();
      if (window.google && autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [name, onChange, onPlaceSelected]);

  useEffect(() => {
    if (!isSelectingRef.current) {
      lastSelectedRef.current = value;
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    
    // If user is typing or clearing the input, allow changes
    if (!isSelectingRef.current) {
      onChange(e);
      setError(null);
    }

    // Reinitialize autocomplete if input is cleared
    if (!newValue) {
      lastSelectedRef.current = null;
      isSelectingRef.current = false;
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        name={name}
        placeholder={placeholder || "Enter location"}
        className={`bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border text-white transition-colors ${
          error ? 'border-red-500' : className || 'border-zinc-700/50'
        }`}
        autoComplete="off"
      />
      {error && (
        <div className="absolute -bottom-1 left-0 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddressInput;