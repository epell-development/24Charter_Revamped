const fetch = require('node-fetch');

let cache = {};
let lastFetch = 0;
const FETCH_INTERVAL = 3000; // 3 seconds
const CACHE_DURATION = 60000; // 1 minute

async function fetchAircraftData() {
  if (Date.now() - lastFetch < FETCH_INTERVAL) return cache;
  try {
    const response = await fetch('https://24data.ptfs.app/acft-data', {
      headers: { 'User-Agent': '24CharterApp/1.0' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    cache = await response.json();
    lastFetch = Date.now();
    return cache;
  } catch (err) {
    console.error('Error fetching acft-data:', err);
    return cache; // Return stale cache on error
  }
}

module.exports = async (req, res) => {
  try {
    const data = await fetchAircraftData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch aircraft data' });
  }
};
