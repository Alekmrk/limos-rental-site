const { DateTime } = require('luxon');

/**
 * Format date to Swiss format (dd-MM-yyyy)
 * @param {string} dateString - Date in yyyy-MM-dd format
 * @returns {string} - Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: 'Europe/Zurich' }).toFormat('dd-MM-yyyy');
  } catch {
    return dateString;
  }
};

/**
 * Format time for display
 * @param {string} timeString - Time string
 * @returns {string} - Formatted time
 */
const formatTime = (timeString) => {
  if (!timeString) return 'Not specified';
  return timeString;
};

/**
 * Format date and time together
 * @param {string} dateString - Date string
 * @param {string} timeString - Time string
 * @returns {string} - Combined formatted date and time
 */
const formatDateTime = (dateString, timeString) => {
  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);
  return `${formattedDate} at ${formattedTime}`;
};

/**
 * Get current timestamp in Swiss timezone
 * @returns {string} - ISO timestamp in Swiss timezone
 */
const getSwissTimestamp = () => {
  return DateTime.now().setZone('Europe/Zurich').toISO();
};

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  getSwissTimestamp
};
