function formatDateTime(dateStr) {
    const date = new Date(dateStr);
  
    // Get day (with leading zero)
    const day = String(date.getDate()).padStart(2, '0');
  
    // Get abbreviated month in lowercase
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = monthNames[date.getMonth()];
  
    // Get full year
    const year = date.getFullYear();
  
    // Get hours and minutes for the time, then convert to 12-hour format with am/pm
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if (hours === 0) hours = 12; // Handle midnight (0 hours) as 12
  
    return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
  }
  
  // Example usage:
  const isoString = "2025-02-03T06:15:34.457Z";
  console.log(formatDateTime(isoString)); // Outputs: "03-feb-2025 6:15am" or "03-feb-2025 6:15pm" based on local time

export default formatDateTime;