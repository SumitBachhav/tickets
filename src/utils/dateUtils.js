/**
 * Date utility functions
 * @module utils/dateUtils
 */

import { DATE_FORMAT } from "../constants";

/**
 * Format current date/time as timestamp string
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = () => {
  const d = new Date();
  return d.toLocaleString(DATE_FORMAT.locale, {
    day: DATE_FORMAT.day,
    month: DATE_FORMAT.month,
    year: DATE_FORMAT.year,
    hour: DATE_FORMAT.hour,
    minute: DATE_FORMAT.minute,
  });
};

/**
 * Parse date string in format "DD/MM/YYYY, HH:mm"
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDateString = (dateString) => {
  if (!dateString) return null;

  try {
    const [datePart, timePart] = dateString.split(", ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return null;
  }
};

/**
 * Check if a date is within the last 24 hours
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if within last 24 hours
 */
export const isWithinLast24Hours = (dateString) => {
  const date = parseDateString(dateString);
  if (!date) return false;

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return date >= twentyFourHoursAgo && date <= now;
};
