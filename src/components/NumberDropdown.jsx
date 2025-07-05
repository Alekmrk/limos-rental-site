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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        readOnly
        placeholder={placeholder}
        name={name}
        id={id}
        className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 focus:shadow-[0_0_15px_rgba(65,105,225,0.1)] focus:outline-none cursor-pointer
                   ${error ? 'border-red-500 ring-1 ring-red-500/50' : 'border-royal-blue/20'} ${className}`}
      />
      
      {showPicker && (
        <div className="absolute z-50 top-full mt-1 bg-warm-white/95 backdrop-blur-md rounded-lg shadow-xl border border-royal-blue/30 w-[90%] left-[5%]">
          <div className="p-3">
            <div ref={numbersRef} className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue/60 scrollbar-track-transparent">
              <div className="text-center text-sm text-royal-blue font-medium pb-2 border-b border-royal-blue/20 mb-2">{label || 'Select'}</div>
              <div className="grid grid-cols-1 gap-1">
                {numbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    data-number={number}
                    onClick={() => handleNumberSelect(number)}
                    className={`text-center px-4 py-2 hover:bg-royal-blue/10 rounded-lg transition-all duration-200 ${
                      value === number ? 'bg-gradient-to-r from-royal-blue to-royal-blue-light text-white shadow-md' : 'text-gray-700 hover:text-royal-blue'
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