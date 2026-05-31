// utils/cutoff.js
async function isBeforeCutoff() {
  // Fixed cutoff: June 11, 2026 at 19:00 South Africa time (UTC+2)
  const cutoff = new Date('2026-06-11T19:00:00+02:00');

  // 🔎 Log for debugging
  console.log('Cutoff datetime (SAST):', cutoff.toString());

  return new Date() < cutoff;
}

module.exports = { isBeforeCutoff };
