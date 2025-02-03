const formatDuration = (start, end) => {
    if (!start || !end) return "N/A";

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate; // Difference in milliseconds

    const seconds = Math.floor(diffMs / 1000) % 60;
    const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s ago`;
  };
export default formatDuration;