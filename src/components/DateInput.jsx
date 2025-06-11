import { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';

const DateInput = ({ value, onChange, name, id, className }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const containerRef = useRef(null);
  
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    try {
      return DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: 'Europe/Zurich' }).toFormat('dd-MM-yyyy');
    } catch (err) {
      return dateString;
    }
  };

  const handleClick = () => {
    if (value) {
      const [year, month] = value.split('-');
      setCurrentDate(new Date(parseInt(year), parseInt(month) - 1));
    }
    setShowPicker(true);
  };

  const getDaysInMonth = (date) => {
    const daysInMonth = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get the first and last day of the current month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate previous month details
    const prevMonth = new Date(year, month, 0);
    const prevMonthYear = prevMonth.getFullYear();
    const prevMonthIndex = prevMonth.getMonth();
    
    // Add empty spaces for days before the first day of the month
    const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7 for proper calculation
    for (let i = 1; i < firstDayOfWeek; i++) {
      const day = prevMonth.getDate() - firstDayOfWeek + i + 1;
      daysInMonth.push({
        day,
        month: prevMonthIndex,
        year: prevMonthYear,
        isPrevMonth: true
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push({
        day,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Calculate next month details
    const nextMonth = new Date(year, month + 1, 1);
    const nextMonthYear = nextMonth.getFullYear();
    const nextMonthIndex = nextMonth.getMonth();
    
    // Add days from next month to complete the calendar
    const remainingDays = 42 - daysInMonth.length; // 6 rows * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      daysInMonth.push({
        day,
        month: nextMonthIndex,
        year: nextMonthYear,
        isNextMonth: true
      });
    }
    
    return daysInMonth;
  };

  const handleDateSelect = (dateInfo) => {
    const { year, month, day } = dateInfo;
    // Format the date string as yyyy-MM-dd for storage, but display as dd-MM-yyyy
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange({
      target: {
        name,
        value: formattedDate,
        type: 'date'
      }
    });
    setShowPicker(false);
  };

  const changeMonth = (increment, e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleClear = (e) => {
    e.preventDefault(); // Prevent form submission
    onChange({
      target: {
        name,
        value: '',
        type: 'date'
      }
    });
    setShowPicker(false);
  };

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
    setDisplayValue(formatDisplayDate(value));
  }, [value]);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={displayValue}
        onClick={handleClick}
        readOnly
        placeholder="DD MMM YYYY"
        name={name}
        id={id}
        className={className}
      />
      {showPicker && (
        <div className="absolute z-50 mt-2 bg-zinc-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-zinc-700/50 w-full min-w-[280px]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={(e) => changeMonth(-1, e)}
                className="text-zinc-300 hover:text-gold p-1"
              >
                &#x3c;
              </button>
              <div className="text-white font-medium">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button
                type="button"
                onClick={(e) => changeMonth(1, e)}
                className="text-zinc-300 hover:text-gold p-1"
              >
                &#x3e;
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center text-zinc-400 text-sm py-1">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth(currentDate).map((dateInfo, index) => {
                // For comparison, make sure both dates are in the same format (YYYY-MM-DD)
                const compareDate = `${dateInfo.year}-${String(dateInfo.month + 1).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`;
                const isSelected = compareDate === value;
                
                // For today's date, use local timezone comparison
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const dateToCheck = new Date(dateInfo.year, dateInfo.month, dateInfo.day);
                const isToday = today.getTime() === dateToCheck.getTime();
                
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleDateSelect(dateInfo)}
                    className={`
                      text-center p-1 text-sm rounded transition-colors duration-200
                      ${dateInfo.isCurrentMonth ? 'text-white hover:bg-zinc-700/70' : 'text-zinc-500'}
                      ${isSelected ? 'bg-gold text-black hover:bg-gold/90' : ''}
                      ${isToday && !isSelected ? 'border border-gold/50' : ''}
                      ${dateInfo.isPrevMonth || dateInfo.isNextMonth ? 'opacity-50' : ''}
                    `}
                  >
                    {dateInfo.day}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 text-sm text-zinc-300 hover:text-white bg-zinc-700/50 hover:bg-zinc-700 rounded transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;