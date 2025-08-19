import React, { useState, useEffect, useRef } from 'react';

const NumberDropdown = ({ 
  id, 
  name, 
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  label, 
  className = "",
  error = null,
  placeholder = "Select..."
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const containerRef = useRef(null);
  const numbersRef = useRef(null);

  // Generate numbers array from min to max
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  const handleNumberSelect = (number) => {
    setInputValue(number.toString());
    onChange({ target: { name, value: number }});
    setShowPicker(false);
  };

  // Update display value when the value prop changes
  useEffect(() => {
    if (value !== '' && value !== null && value !== undefined) {
      setInputValue(value.toString());
    } else {
      setInputValue('');
    }
  }, [value]);

  // Handle clicking outside of the picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showPicker]);

  // Auto-scroll to selected value when picker opens
  useEffect(() => {
    if (showPicker && numbersRef.current && value !== '' && value !== null && value !== undefined) {
      const selectedElement = numbersRef.current.querySelector(`button[data-number="${value}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [showPicker, value]);

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type="text"
        value={inputValue}
        onClick={() => setShowPicker(true)}
        onTouchStart={(e) => {
          e.preventDefault();
          setShowPicker(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
        }}
        onFocus={() => setShowPicker(true)}
        readOnly
        placeholder={placeholder}
        name={name}
        id={id}
        className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-primary-gold/30 focus:border-primary-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:outline-none cursor-pointer touch-manipulation
                   ${error ? 'border-red-500 ring-1 ring-red-500/50' : 'border-primary-gold/20'} ${className}`}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      />
      
      {showPicker && (
        <div className="absolute z-[9999] top-full mt-1 bg-warm-white/95 backdrop-blur-md rounded-lg shadow-xl border border-primary-gold/30 left-0 min-w-full w-max touch-manipulation">
          <div className="p-3">
            <div ref={numbersRef} className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-gold/60 scrollbar-track-transparent" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
              <div className="text-center text-sm text-primary-gold font-medium pb-2 border-b border-primary-gold/20 mb-2">{label || 'Select'}</div>
              <div className="grid grid-cols-1 gap-1">
                {numbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    data-number={number}
                    onClick={() => handleNumberSelect(number)}
                    className={`text-center px-4 py-2 hover:bg-primary-gold/10 active:bg-primary-gold/20 rounded-lg transition-all duration-200 whitespace-nowrap select-none touch-manipulation ${
                      value === number ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-primary-gold shadow-md' : 'text-gray-700 hover:text-primary-gold'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default NumberDropdown;