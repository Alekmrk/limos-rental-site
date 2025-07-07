import { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';

const DateInput = ({ value, onChange, name, id, className, dropdownClassName }) => {
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
        <div className={`absolute z-[9999] top-full mt-1 bg-warm-white/95 backdrop-blur-md rounded-lg shadow-xl border border-royal-blue/30 min-w-[280px] left-1/2 transform -translate-x-1/2 ${dropdownClassName || 'w-full'}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={(e) => changeMonth(-1, e)}
                className="text-gray-600 hover:text-royal-blue p-2 rounded-lg hover:bg-royal-blue/10 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <div className="text-gray-700 font-medium text-lg">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button
                type="button"
                onClick={(e) => changeMonth(1, e)}
                className="text-gray-600 hover:text-royal-blue p-2 rounded-lg hover:bg-royal-blue/10 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center text-royal-blue font-medium text-sm py-2">
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
                      text-center p-2 text-sm rounded-lg transition-all duration-200
                      ${dateInfo.isCurrentMonth ? 'text-gray-700 hover:bg-royal-blue/10 hover:text-royal-blue' : 'text-gray-400'}
                      ${isSelected ? 'bg-gradient-to-r from-royal-blue to-royal-blue-light text-white shadow-md' : ''}
                      ${isToday && !isSelected ? 'border border-gold/50 bg-gold/10' : ''}
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
                className="px-4 py-2 text-sm text-gray-600 hover:text-royal-blue bg-gray-100 hover:bg-royal-blue/10 rounded-lg transition-all duration-200"
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