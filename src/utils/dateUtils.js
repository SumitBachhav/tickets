export const formatTimestamp = () => {
  const d = new Date();
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Parse date string in format "DD/MM/YYYY, HH:mm"
export const parseDateString = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Format: "DD/MM/YYYY, HH:mm"
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

// Check if a date is within the last 24 hours
export const isWithinLast24Hours = (dateString) => {
  const date = parseDateString(dateString);
  if (!date) return false;
  
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return date >= twentyFourHoursAgo && date <= now;
};

