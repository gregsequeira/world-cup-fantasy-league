/// Format a date string into DD/MM/YYYY
export const formatShortDate = (d) => {
  if (!d) return '';
  const dateString = d.toString().trim();
  let dt = new Date(dateString);
  if (isNaN(dt)) {
    dt = new Date(`${dateString}T00:00`);
  }
  if (!isNaN(dt)) {
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  return dateString.replace(/T.*$/, '');
};

// Format a time string into HH:MM
export const formatShortTime = (t) => {
  if (!t) return '';
  const timeString = t.toString().trim();
  const [hours, minutes] = timeString.split(':');
  return [hours, minutes].slice(0, 2).join(':');
};

// only DD/MM
export const formatDayMonth = (d) => {
  if (!d) return '';
  const dateString = d.toString().trim();
  let dt = new Date(dateString);
  if (isNaN(dt)) {
    dt = new Date(`${dateString}T00:00`);
  }
  if (!isNaN(dt)) {
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  }
  // fallback if parsing fails
  const parts = dateString.split(/[-/]/);
  if (parts.length >= 2) {
    return `${parts[2] || parts[0]}/${parts[1]}`;
  }
  return dateString;
};

