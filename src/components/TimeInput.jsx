import { useState, useEffect, useRef } from 'react';

const TimeInput = ({ value, onChange, name, id, className, dropdownClassName }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [selectedHour, setSelectedHour] = useState(value ? value.split(':')[0] : '00');
  const [selectedMinute, setSelectedMinute] = useState(value ? value.split(':')[1] : '00');
  const containerRef = useRef(null);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Generate minutes (00-55) in 5-minute intervals
  const minutes = Array.from({ length: 12 }, (_, i) => 
    (i * 5).toString().padStart(2, '0')
  );

  const handleTimeSelect = (hour = selectedHour, minute = selectedMinute) => {
    const timeString = `${hour}:${minute}`;
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setInputValue(timeString);
    onChange({ target: { name, value: timeString, type: 'time' }});
    
    // Close the picker only if we're updating the minute, or if the minute is already selected
    if (minute !== selectedMinute || selectedMinute !== '00') {
      setShowPicker(false);
    }
  };

  // Update display value when the time prop changes
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setInputValue(value);
    }
  }, [value]);

  // Handle clicking outside of the time picker
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

  useEffect(() => {
    if (showPicker && hoursRef.current && minutesRef.current) {
      // Scroll to selected hour
      const hourElement = hoursRef.current.querySelector(`button[data-hour="${selectedHour}"]`);
      if (hourElement) {
        hourElement.scrollIntoView({ block: 'center' });
      }

      // Scroll to selected minute
      const minuteElement = minutesRef.current.querySelector(`button[data-minute="${selectedMinute}"]`);
      if (minuteElement) {
        minuteElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [showPicker, selectedHour, selectedMinute]);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onClick={() => setShowPicker(true)}
        readOnly
        placeholder="HH:mm"
        name={name}
        id={id}
        className={`${className || ''} hour24`.trim()}
      />
      
      {showPicker && (
        <div className={`absolute z-50 top-full -mt-0 bg-zinc-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-zinc-700/50 ${dropdownClassName || 'w-full'}`}>
          <div className="p-2 flex">
            {/* Hours column */}
            <div ref={hoursRef} className="flex-1 h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent border-r border-zinc-700/50">
              <div className="text-center text-sm text-zinc-400 pb-2 border-b border-zinc-700/50">Hours</div>
              <div className="grid grid-cols-1 gap-0.5">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    data-hour={hour}
                    onClick={() => handleTimeSelect(hour, selectedMinute)}
                    className={`text-center px-3 py-2 hover:bg-zinc-700/70 rounded transition-colors duration-200 ${
                      selectedHour === hour ? 'bg-gold text-black' : 'text-white'
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Minutes column */}
            <div ref={minutesRef} className="flex-1 h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
              <div className="text-center text-sm text-zinc-400 pb-2 border-b border-zinc-700/50">Minutes</div>
              <div className="grid grid-cols-1 gap-0.5">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    data-minute={minute}
                    onClick={() => handleTimeSelect(selectedHour, minute)}
                    className={`text-center px-3 py-2 hover:bg-zinc-700/70 rounded transition-colors duration-200 ${
                      selectedMinute === minute ? 'bg-gold text-black' : 'text-white'
                    }`}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInput;