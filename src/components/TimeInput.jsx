import { useState, useEffect } from 'react';

const TimeInput = ({ value, onChange, name, id, className }) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (e) => {
    let val = e.target.value.replace(/[^\d:]/g, '');
    
    // Handle backspace and deletion
    if (val.length < inputValue.length) {
      setInputValue(val);
      onChange({ target: { name, value: val, type: 'time' }});
      return;
    }

    // Format as user types
    if (val.length === 2 && !val.includes(':')) {
      val = val + ':';
    }
    
    // Validate hours and minutes
    const [hours, minutes] = val.split(':').map(Number);
    if (val.includes(':')) {
      if (hours > 23) val = '23:' + (minutes?.toString().padStart(2, '0') || '');
      if (minutes > 59) val = hours.toString().padStart(2, '0') + ':59';
    }

    setInputValue(val);
    if (val.length === 5) {
      // Convert to Switzerland time if needed
      const [h, m] = val.split(':').map(Number);
      const date = new Date();
      date.setHours(h, m);
      
      // Format in 24-hour time
      const swissTime = date.toLocaleTimeString('en-CH', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false,
        timeZone: 'Europe/Zurich'
      });
      
      onChange({ target: { name, value: swissTime, type: 'time' }});
    }
  };

  // Update display value when the time prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="HH:mm"
      maxLength={5}
      name={name}
      id={id}
      className={`${className || ''} hour24 appearance-none`.trim()}
      pattern="[0-2][0-9]:[0-5][0-9]"
      autoComplete="off"
    />
  );
};

export default TimeInput;