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
        <label className="mb-2 block text-sm font-medium" htmlFor={id}>
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
        className={`bg-zinc-800/30 rounded-lg py-2 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] focus:outline-none cursor-pointer
                   ${error ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/50'} ${className}`}
      />
      
      {showPicker && (
        <div className="absolute z-50 top-full -mt-0 bg-zinc-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-zinc-700/50 w-[90%] left-[5%]">
          <div className="p-2">
            <div ref={numbersRef} className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
              <div className="text-center text-sm text-zinc-400 pb-2 border-b border-zinc-700/50">{label || 'Select'}</div>
              <div className="grid grid-cols-1 gap-0.5">
                {numbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    data-number={number}
                    onClick={() => handleNumberSelect(number)}
                    className={`text-center px-3 py-2 hover:bg-zinc-700/70 rounded transition-colors duration-200 ${
                      value === number ? 'bg-gold text-black' : 'text-white'
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