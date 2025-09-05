// --- Data ---
const commercialAirlines = {
  "Delta Airlines": "DAL",
  "Spirit Wings": "NKS",
  "British Airways": "BAW",
  "Scandinavian Airlines": "SAS",
  "American Airlines": "AAL",
  "Lufthansa": "DLH",
};

const cargoAirlines = {
  "UPS Cargo": "UPS",
  "FedEx Cargo": "FDX",
};

// Unlock costs for airlines (FDX is free)
const unlockCosts = {
  "NKS": 200,
  "SAS": 400,
  "AAL": 600,
  "BAW": 800,
  "DAL": 1000,
  "DLH": 1200,
  "UPS": 300
};

// Aircraft unlock costs (based on capacity)
const aircraftCosts = {
  "ATR72": 100,
  "C208F": 50,
  "CRJ700": 150,
  "A220": 300,
  "A320": 350,
  "E190": 250,
  "B717": 200,
  "B727": 400,
  "B737": 450,
  "B737BCF": 400,
  "B727F": 350,
  "CONC": 600,
  "A330": 800,
  "A340": 850,
  "A350": 900,
  "A380": 1000,
  "B707": 500,
  "B747": 950,
  "B757": 700,
  "B767": 750,
  "B777": 900,
  "B787": 950,
  "MD11": 800,
  "MD90": 600,
  "B757F": 700,
  "B767F": 750,
  "B777F": 900,
  "MD11F": 800,
  "B747F": 950
};

// Airport gate configurations
const airportGates = {
  "IRFD": { commercial: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], cargo: [21,22] },
  "ITKO": { commercial: [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], cargo: [17,18,19,20,21,22] },
  "IPPH": { commercial: [1,2,3,4,5,6,11,12,13,14], cargo: [11,12,13,14] },
  "IMLR": { commercial: [1,2,3,4], cargo: [1,2,3,4] },
  "IBTH": { any: true },
  "IGRV": { commercial: [1,2,3,4], cargo: [1,2,3,4] },
  "ILAR": { commercial: [1,2,3,4,5,6,7,8,9], cargo: [8,9] },
  "IPAP": { commercial: [1,2,3], cargo: [1,2,3] },
  "ISAU": { commercial: [1,2,3,4], cargo: [1,2,3,4] },
  "IZOL": { commercial: [1,2,3,4,5,6,7,10,11,12,13,14], cargo: [10,11,12,13,14] },
  "IBLT": { any: true },
  "IDCS": { any: true },
  "ILKL": { any: true }
};

// Airport data with coordinates and metadata
const airports = {
  "IRFD": { type: "major", location: "rockford island", x: 50.33, y: 57.59 },
  "IMLR": { type: "major", location: "rockford island", x: 38.67, y: 52.92 },
  "IBLT": { type: "small", location: "rockford island", x: 43.83, y: 53.45 },
  "ISAU": { type: "regional", location: "sauthemptona island", x: 18.17, y: 62.28 },
  "IGRV": { type: "major", location: "grindavik island", x: 20.67, y: 39.95 },
  "ITKO": { type: "major", location: "tokyo island", x: 47.00, y: 17.25 },
  "IDCS": { type: "small", location: "saba island", x: 48.17, y: 8.79 },
  "IPPH": { type: "major", location: "perth island", x: 66.33, y: 27.25 },
  "ILKL": { type: "small", location: "lukla island", x: 70.50, y: 28.29 },
  "IZOL": { type: "major", location: "izolirani island", x: 84.67, y: 44.25 },
  "ILAR": { type: "major", location: "larnaca", x: 70.67, y: 65.92 },
  "IPAP": { type: "major", location: "paphos", x: 77.17, y: 67.62 },
  "IHEN": { type: "small", location: "henstridge", x: 65.17, y: 73.45 },
  "IBTH": { type: "small", location: "saint barthelemy", x: 57.83, y: 39.09 }
};

// Airline hub, route configuration, and descriptions
const airlineHubsAndRoutes = {
  "DAL": { hub: "IRFD", routes: ["ITKO", "ILAR", "IZOL"], routeFrequency: 0.8, description: "Delta Airlines, a major global airline known for its extensive network." },
  "NKS": { hub: "IMLR", routes: ["IRFD", "ISAU", "IGRV", "ILAR"], routeFrequency: 0.8, description: "Spirit Wings, a low-cost carrier with a focus on efficiency." },
  "BAW": { hub: "IPPH", routes: ["IRFD", "IMLR", "IBTH", "ILAR", "ITKO"], routeFrequency: 0.8, description: "British Airways, the UK's flag carrier with premium service." },
  "SAS": { hub: "IGRV", routes: ["ISAU", "ITKO", "IMLR"], routeFrequency: 0.8, description: "Scandinavian Airlines, efficient service across colder islands." },
  "AAL": { hub: "ILAR", routes: ["ITKO", "IPPH", "ISAU", "IBTH", "IMLR", "IRFD", "IPAP"], routeFrequency: 0.8, description: "American Airlines, vast network with modern fleet." },
  "DLH": { hub: "ITKO", routes: ["IRFD", "IPPH", "IZOL", "IGRV", "IBTH", "ILAR"], routeFrequency: 0.8, description: "Lufthansa, Germany's flag carrier with premium service." },
  "UPS": { hub: null, routes: [], routeFrequency: 0.0, description: "UPS Airlines, major cargo operator with global reach." },
  "FDX": { hub: null, routes: [], routeFrequency: 0.0, description: "FedEx Express, world's largest cargo airline with overnight services." }
};

// Airline colors for logos
const airlineColors = {
  "DAL": { bg: "#0033a0", color: "#ffffff" },
  "NKS": { bg: "#000000", color: "#ffb81c" },
  "BAW": { bg: "#01295c", color: "#ffffff" },
  "SAS": { bg: "#003d73", color: "#ffffff" },
  "AAL": { bg: "#0039aa", color: "#ffffff" },
  "DLH": { bg: "#001a49", color: "#f9b000" },
  "UPS": { bg: "#351c15", color: "#ffb500" },
  "FDX": { bg: "#4d148c", color: "#ff6600" }
};

// Aircraft data with size, range, and capacity (pax for commercial, kg for cargo)
const aircraftData = {
  "ATR72": { size: "small", range: 15, capacity: { pax: 78, cargo: 4000 } },
  "C208F": { size: "small", range: 12, capacity: { pax: 0, cargo: 2000 } },
  "CRJ700": { size: "small", range: 20, capacity: { pax: 78, cargo: 4000 } },
  "A220": { size: "regional", range: 35, capacity: { pax: 130, cargo: 6000 } },
  "A320": { size: "regional", range: 30, capacity: { pax: 180, cargo: 8000 } },
  "E190": { size: "regional", range: 28, capacity: { pax: 114, cargo: 5000 } },
  "B717": { size: "regional", range: 25, capacity: { pax: 134, cargo: 5000 } },
  "B727": { size: "regional", range: 30, capacity: { pax: 189, cargo: 8000 } },
  "B737": { size: "regional", range: 32, capacity: { pax: 189, cargo: 8000 } },
  "B737BCF": { size: "regional", range: 30, capacity: { pax: 0, cargo: 20000 } },
  "B727F": { size: "regional", range: 30, capacity: { pax: 0, cargo: 20000 } },
  "CONC": { size: "regional", range: 45, capacity: { pax: 100, cargo: 5000 } },
  "A330": { size: "major", range: 70, capacity: { pax: 335, cargo: 20000 } },
  "A340": { size: "major", range: 75, capacity: { pax: 375, cargo: 22000 } },
  "A350": { size: "major", range: 80, capacity: { pax: 410, cargo: 25000 } },
  "A380": { size: "major", range: 85, capacity: { pax: 853, cargo: 30000 } },
  "B707": { size: "regional", range: 65, capacity: { pax: 202, cargo: 10000 } },
  "B747": { size: "major", range: 75, capacity: { pax: 660, cargo: 30000 } },
  "B757": { size: "major", range: 60, capacity: { pax: 295, cargo: 15000 } },
  "B767": { size: "major", range: 65, capacity: { pax: 375, cargo: 18000 } },
  "B777": { size: "major", range: 80, capacity: { pax: 426, cargo: 25000 } },
  "B787": { size: "major", range: 85, capacity: { pax: 336, cargo: 20000 } },
  "MD11": { size: "major", range: 70, capacity: { pax: 410, cargo: 20000 } },
  "MD90": { size: "major", range: 55, capacity: { pax: 172, cargo: 10000 } },
  "B757F": { size: "major", range: 60, capacity: { pax: 0, cargo: 35000 } },
  "B767F": { size: "major", range: 65, capacity: { pax: 0, cargo: 40000 } },
  "B777F": { size: "major", range: 80, capacity: { pax: 0, cargo: 50000 } },
  "MD11F": { size: "major", range: 70, capacity: { pax: 0, cargo: 45000 } },
  "B747F": { size: "major", range: 75, capacity: { pax: 0, cargo: 60000 } }
};

// Aircraft by airline (available for purchase)
const aircraftByAirline = {
  "DAL": ["A220", "A320", "A330", "A350", "B717", "B737", "B757", "B767", "B727", "B747", "MD11", "MD90", "CRJ700"],
  "NKS": ["A320"],
  "BAW": ["A320", "A350", "A380", "B777", "B787", "B737", "B707", "B727", "B747", "B757", "B767", "CONC", "CRJ700"],
  "SAS": ["A320", "A330", "A350", "ATR72", "E190", "B737", "B747", "B757", "B767", "MD90"],
  "AAL": ["A320", "B737", "B777", "B787", "B707", "B727", "B747", "B757", "B767", "MD11", "CRJ700"],
  "DLH": ["A220", "A320", "A330", "A340", "A350", "A380", "B747", "B767", "B777", "B787", "B707", "B727", "B737"],
  "UPS": ["B757F", "B767F", "MD11F", "B747F", "B727F"],
  "FDX": ["B757F", "B767F", "B777F", "MD11F", "ATR72F", "C208F", "B727F", "B737BCF"]
};

// --- State ---
const state = {
  airline: null,
  flights: [],
  offers: [],
  currency: 0,
  unlockedAirlines: ["FDX"],
  ownedAircraft: { "FDX": ["C208F"] } // Start with C208F for FDX
};

// --- Cookie Helpers ---
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function save() {
  setCookie('airline', JSON.stringify(state.airline));
  setCookie('flights', JSON.stringify(state.flights));
  setCookie('currency', state.currency.toString());
  setCookie('unlockedAirlines', JSON.stringify(state.unlockedAirlines));
  setCookie('ownedAircraft', JSON.stringify(state.ownedAircraft));
}

function loadState() {
  const airlineCookie = getCookie('airline');
  const flightsCookie = getCookie('flights');
  const currencyCookie = getCookie('currency');
  const unlockedAirlinesCookie = getCookie('unlockedAirlines');
  const ownedAircraftCookie = getCookie('ownedAircraft');

  if (airlineCookie) state.airline = JSON.parse(airlineCookie);
  if (flightsCookie) state.flights = JSON.parse(flightsCookie);
  if (currencyCookie) state.currency = parseInt(currencyCookie, 10) || 0;
  if (unlockedAirlinesCookie) state.unlockedAirlines = JSON.parse(unlockedAirlinesCookie);
  else state.unlockedAirlines = ["FDX"];
  if (ownedAircraftCookie) state.ownedAircraft = JSON.parse(ownedAircraftCookie);
  else state.ownedAircraft = { "FDX": ["C208F"] };
}

// --- Helpers ---
function getRandomGate(airportIcao, isCargo = false) {
  const gates = airportGates[airportIcao];
  if (!gates) return 'N/A';
  if (gates.any) return 'ANY';
  const gateList = isCargo ? (gates.cargo?.length ? gates.cargo : gates.commercial) : gates.commercial;
  return gateList?.length ? pick(gateList).toString() : 'N/A';
}

const el = sel => document.querySelector(sel);
const els = sel => Array.from(document.querySelectorAll(sel));
const rand = (min, max) => Math.floor(Math.random()*(max-min+1))+min;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const fmtTime = d => d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
const fmtDate = d => d.toLocaleDateString([], {month:'short', day:'numeric'});
const hashCode = (str) => {
  let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
};
const seededBetween = (min, max, seed) => {
  const x = Math.sin(seed) * 10000; const frac = x - Math.floor(x);
  return Math.round(min + (max - min) * frac);
};

function toast(msg) {
  const t = el('#toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 5000);
}

function airlineList() {
  return { ...commercialAirlines, ...cargoAirlines };
}

function airlineIsCargo(code) {
  return Object.values(cargoAirlines).includes(code);
}

function airportEntries() {
  return Object.entries(airports).map(([icao, data]) => ({
    icao,
    type: data.type,
    location: data.location,
    island: data.location,
    x: data.x,
    y: data.y
  }));
}

function filterAirports({types, q}) {
  const lowerQ = (q||'').trim().toLowerCase();
  return airportEntries().filter(a => {
    const hitType = types.includes(a.type);
    const hitQ = !lowerQ || 
      a.icao.toLowerCase().includes(lowerQ) || 
      a.location.toLowerCase().includes(lowerQ);
    return hitType && hitQ;
  });
}

function genFlightNumber(prefix) {
  return `${prefix}${rand(10, 9999)}`;
}

function estimateBlock(from, to) {
  const distance = calculateDistance(from, to);
  const baseTime = Math.max(10, Math.round(distance * 2));
  const variation = Math.round(baseTime * 0.1);
  return baseTime + rand(-variation, variation);
}

function calculateDistance(fromIcao, toIcao) {
  const from = airports[fromIcao];
  const to = airports[toIcao];
  if (!from || !to) return 0;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function findSuitableAircraft(fleet, distance, destType, originType) {
  const suitable = fleet.filter(ac => {
    const acData = aircraftData[ac];
    if (!acData) return false;
    const canServeOrigin = typeAllowance[acData.size].has(originType);
    const canServeDest = typeAllowance[acData.size].has(destType);
    return acData.range >= distance * 0.9 && canServeOrigin && canServeDest;
  });
  return suitable.length ? pick(suitable) : null;
}

function getMinAirportType(aircraft) {
  const acData = aircraftData[aircraft] || { size: 'major' };
  return acData.size;
}

const typeAllowance = {
  small: new Set(["small", "regional", "major"]),
  regional: new Set(["regional", "major"]),
  major: new Set(["major"])
};

function generateOffers(n=12) {
  const selected = state.airline; 
  if (!selected) return [];
  
  const types = Array.from(document.querySelectorAll('.flt-type:checked')).map(i => i.value);
  const allAirports = airportEntries();
  const offers = [];
  
  const isCargo = airlineIsCargo(selected.code);
  const fleet = state.ownedAircraft[selected.code] || [];
  if (fleet.length === 0) return [];
  
  const airlineInfo = airlineHubsAndRoutes[selected.code] || { hub: null, routes: [], routeFrequency: 0 };
  const { hub, routes, routeFrequency } = airlineInfo;
  
  const fleetCapabilities = {
    small: false,
    regional: false,
    major: false
  };
  
  fleet.forEach(ac => {
    const minType = getMinAirportType(ac);
    fleetCapabilities.small = fleetCapabilities.small || minType === 'small';
    fleetCapabilities.regional = fleetCapabilities.regional || minType === 'regional' || minType === 'small';
    fleetCapabilities.major = true;
  });
  
  const pool = allAirports.filter(a => 
    types.includes(a.type) && 
    ((a.type === 'small' && fleetCapabilities.small) ||
     (a.type === 'regional' && fleetCapabilities.regional) ||
     (a.type === 'major' && fleetCapabilities.major))
  );
  
  if (pool.length < 2) return [];

  const now = new Date();
  const minMinutes = 10;
  const maxMinutes = 15;
  
  for (let i = 0; i < n; i++) {
    let o, d, distance, aircraft, attempts = 0;
    
    do {
      if (hub && !isCargo && Math.random() < routeFrequency) {
        const isHubToSpoke = Math.random() > 0.5;
        if (isHubToSpoke) {
          o = pool.find(a => a.icao === hub) || pick(pool);
          const preferredDests = pool.filter(dest => 
            dest.icao !== o.icao && routes.includes(dest.icao)
          );
          d = preferredDests.length > 0 ? pick(preferredDests) : pick(pool.filter(dest => dest.icao !== o.icao));
        } else {
          d = pool.find(a => a.icao === hub) || pick(pool);
          const preferredOrigs = pool.filter(orig => 
            orig.icao !== d.icao && routes.includes(orig.icao)
          );
          o = preferredOrigs.length > 0 ? pick(preferredOrigs) : pick(pool.filter(orig => orig.icao !== d.icao));
        }
      } else {
        o = pick(pool);
        const potentialDests = pool.filter(dest => {
          if (dest.icao === o.icao) return false;
          return fleet.some(ac => {
            const acData = aircraftData[ac];
            const canServeOrigin = typeAllowance[acData.size].has(o.type);
            const canServeDest = typeAllowance[acData.size].has(dest.type);
            return canServeOrigin && canServeDest;
          });
        });
        if (potentialDests.length === 0) continue;
        d = pick(potentialDests);
      }
      
      distance = calculateDistance(o.icao, d.icao);
      aircraft = findSuitableAircraft(fleet, distance, d.type, o.type);
      attempts++;
    } while ((!aircraft || o.icao === d.icao) && attempts < 50);
    
    if (!aircraft) continue;
    
    const baseSpeed = aircraftData[aircraft].range / 2.5;
    const minutes = Math.max(8, Math.min(22, Math.round(distance * 12 / baseSpeed) + 6));
    const depMinutes = rand(minMinutes, maxMinutes);
    const dep = new Date(now.getTime() + depMinutes * 60000);
    const arr = new Date(dep.getTime() + minutes * 60000);
    
    // Calculate pay based on aircraft capacity and distance
    const acData = aircraftData[aircraft];
    const capacity = isCargo ? acData.capacity.cargo : acData.capacity.pax;
    const basePay = isCargo ? capacity / 1000 : capacity / 5; // $1 per 1000kg cargo, $0.2 per pax
    const distanceFactor = distance / 10; // Scale by distance
    const pay = Math.round(basePay * distanceFactor * (isCargo ? 1.15 : 1.0));
    
    const offer = {
      airline: selected.name, 
      code: selected.code, 
      flight: genFlightNumber(selected.code),
      from: o.icao, 
      to: d.icao, 
      fromIsland: o.island, 
      toIsland: d.island, 
      fromType: o.type, 
      toType: d.type,
      depISO: dep.toISOString(), 
      arrISO: arr.toISOString(), 
      minutes, 
      aircraft, 
      pay: Math.max(10, pay), // Ensure minimum pay
      departureGate: getRandomGate(o.icao, isCargo),
      arrivalGate: getRandomGate(d.icao, isCargo)
    };
    offers.push(offer);
  }
  return offers;
}

function updateCurrencyDisplay() {
  const amountEl = el('#currencyAmount');
  if (amountEl) amountEl.textContent = state.currency;
}

// --- UI Renderers ---
function updateAirlineInfo() {
  if (!state.airline) return;
  const { name, code } = state.airline;
  const isCargo = airlineIsCargo(code);
  const airlineData = airlineHubsAndRoutes[code] || { hub: null, routes: [] };
  const fleet = state.ownedAircraft[code] || [];

  const hubAirport = airlineData.hub || 'None';
  const routes = airlineData.routes.length > 0 
    ? airlineData.routes.slice(0, 5).join(', ') 
      + (airlineData.routes.length > 5 ? ` +${airlineData.routes.length - 5} more` : '')
    : 'Various';

  const fleetDisplay = fleet.map(ac => {
    const acData = aircraftData[ac] || {};
    const typeIcon = acData.size === 'small' ? '✈️' : acData.size === 'regional' ? '🛩️' : '✈️';
    return `<span class="fleet-tag" title="${ac}">${typeIcon} ${ac}</span>`;
  }).join('');

  const logo = el('#airlineLogo');
  if (logo) {
    logo.textContent = code;
    logo.style.background = airlineColors[code]?.bg || '#1a73e8';
    logo.style.color = airlineColors[code]?.color || '#ffffff';
  }
  const nameEl = el('#airlineName'); if (nameEl) nameEl.textContent = name;
  const icaoEl = el('#airlineIcao'); if (icaoEl) icaoEl.innerHTML = `ICAO <span class="highlight">•</span> <span class="code">${code}</span>`;
  const hubEl = el('#airlineHub'); if (hubEl) hubEl.innerHTML = `<span class="highlight">${hubAirport}</span>`;
  const routesEl = el('#airlineRoutes'); if (routesEl) routesEl.innerHTML = routes;
  const fleetEl = el('#airlineFleet'); if (fleetEl) fleetEl.innerHTML = `<div class="fleet-list" data-field="fleet">${fleetDisplay}</div>`;
  const typeEl = el('#airlineType'); 
  if (typeEl) {
    const isSidebar = typeEl.closest('.left');
    const displayText = isCargo ? 'Cargo' : (isSidebar ? 'PAX' : 'Passenger');
    typeEl.innerHTML = `<span class="tag ${isCargo ? 'tag-cargo' : 'tag-pax'}">${displayText}</span>`;
  }
  const descEl = el('#airlineDescription'); if (descEl) descEl.textContent = airlineData.description || 'No description available.';
}

function renderSelectedAirline() {
  if (window.innerWidth <= 768) {
    document.querySelector('.left').scrollIntoView({ behavior: 'smooth' });
  }
  const box = el('#selectedAirline');
  box.innerHTML = '';
  if (!state.airline) {
    box.innerHTML = `<div class="muted" style="padding: 8px 0; text-align: center;">No airline selected</div>`;
  } else {
    box.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1)">
        <div class="airline-logo-container" style="background: transparent; border: none;">
          <img src="airline_icons/${state.airline?.code}.png" alt="${state.airline?.name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.textContent='${state.airline?.code}'; this.remove();" />
        </div>
        <div style="flex:1; min-width:0">
          <div id="airlineName" style="font-weight:800; font-size:1.2rem; word-wrap:break-word;">${state.airline?.name || ''}</div>
          <div id="airlineIcao" class="muted" style="font-size:0.85rem; margin-top:2px;">${state.airline?.code || ''}</div>
        </div>
      </div>
      <div style="font-size:0.9rem; line-height:1.5; margin-bottom:12px; color:var(--muted);">
        <div id="airlineDescription"></div>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Hub</div>
          <div id="airlineHub" class="info-value">-</div>
        </div>
        <div class="info-item">
          <div class="info-label">Type</div>
          <div id="airlineType" class="info-value">-</div>
        </div>
        <div class="info-item" style="grid-column: 1 / -1;">
          <div class="info-label">Main Routes</div>
          <div id="airlineRoutes" class="info-value" style="line-height:1.5">-</div>
        </div>
        <div class="info-item" style="grid-column: 1 / -1;">
          <div class="info-label">Fleet</div>
          <div id="airlineFleet" class="info-value" style="margin-top:4px">-</div>
        </div>
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn" id="switchAirline">Switch</button>
        <button class="btn warn" id="clearAirline">Clear</button>
      </div>`;
  }
  
  updateAirlineInfo();
  
  const openBtn = el('#openAirlines'); if (openBtn) openBtn.onclick = openAirlineModal;
  const switchBtn = el('#switchAirline'); 
  if (switchBtn) {
    switchBtn.onclick = () => {
      openAirlineModal();
    };
  }
  const clearBtn = el('#clearAirline'); 
  if (clearBtn) clearBtn.onclick = () => {
    state.airline = null; 
    state.offers = [];
    save();
    renderSelectedAirline(); 
    renderOffers();
    toast('Airline cleared.');
  };
}

function filterOffers(searchTerm) {
  const cards = document.querySelectorAll('.offer-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const isVisible = text.includes(searchTerm);
    card.style.display = isVisible ? 'block' : 'none';
    if (isVisible) visibleCount++;
  });
  
  const empty = el('#offersEmpty');
  if (visibleCount === 0 && state.offers.length > 0) {
    empty.style.display = 'block';
    empty.textContent = 'No offers match your search. Try different keywords.';
  } else {
    empty.style.display = 'none';
  }
}

function renderOffers() {
  const grid = el('#offersGrid'); 
  const empty = el('#offersEmpty');
  const banner = el('#airlineBanner');
  const searchTerm = el('#searchOffers')?.value.trim().toLowerCase() || '';
  
  if (!state.airline) {
    grid.innerHTML=''; 
    empty.style.display='block'; 
    banner.style.display='flex';
    return;
  }
  
  banner.style.display='none';
  
  if (state.offers.length === 0 || !state.lastGenerated || (Date.now() - state.lastGenerated) > 60000) {
    state.offers = generateOffers(12);
    state.lastGenerated = Date.now();
  }
  
  if (!state.offers.length) { 
    grid.innerHTML=''; 
    empty.style.display='block'; 
    empty.textContent = 'No offers available. Try adjusting your filters or purchasing more aircraft.';
    return; 
  }
  
  empty.style.display='none';
  grid.innerHTML = state.offers.map((o, idx) => {
    const acData = aircraftData[o.aircraft] || {};
    const capacityText = airlineIsCargo(o.code) ? `${acData.capacity.cargo}kg cargo` : `${acData.capacity.pax} pax`;
    return `
      <article class="card offer-card" data-departure="${o.depISO}">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px">
          <span class="chip"><b>${o.code}</b> • ${o.flight}</span>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:2px">
            <span class="chip time-until" title="Time until departure">Departs in ${formatTimeRemaining(new Date(o.depISO) - new Date())}</span>
          </div>
        </div>
        <div class="route" style="margin-top:8px">${o.from} → ${o.to}</div>
        <div class="muted" style="margin-bottom:6px">${capitalize(o.fromIsland)} → ${capitalize(o.toIsland)}</div>
        <div class="times">
          <div class="kv"><div class="k">Departure</div><div class="v">${fmtDate(new Date(o.depISO))} • ${fmtTime(new Date(o.depISO))}</div></div>
          <div class="kv"><div class="k">Arrival</div><div class="v">${fmtDate(new Date(o.arrISO))} • ${fmtTime(new Date(o.arrISO))}</div></div>
          <div class="kv"><div class="k">Aircraft</div><div class="v">${o.aircraft} (${capacityText})</div></div>
          <div class="kv"><div class="k">Dep Gate</div><div class="v">${isNaN(+o.departureGate) ? o.departureGate : 'G'+o.departureGate}</div></div>
          <div class="kv"><div class="k">Arr Gate</div><div class="v">${isNaN(+o.arrivalGate) ? o.arrivalGate : 'G'+o.arrivalGate}</div></div>
          <div class="kv"><div class="k">Pay</div><div class="v">$${o.pay}</div></div>
        </div>
        <div class="muted" style="margin-top:6px; font-size:.85rem">${badge(o.fromType)} • ${badge(o.toType)}</div>
        <div class="btn-row" style="margin-top:10px">
          <button class="btn primary" style="background:linear-gradient(180deg, #4caf50, #2e7d32); border-color:#43a047" data-accept="${idx}">Accept</button>
          <button class="btn warn" data-decline="${idx}">Decline</button>
        </div>
      </article>`;
  }).join('');

  grid.querySelectorAll('[data-accept]').forEach(btn => {
    btn.onclick = () => {
      const i = +btn.dataset.accept;
      const card = btn.closest('.offer-card');
      if (card && state.offers[i]) {
        const o = state.offers[i];
        state.offers.splice(i, 1);
        state.flights.push({...o, id: crypto.randomUUID(), status: 'scheduled'});
        save();
        renderFlights();
        card.classList.add('accepted');
        setTimeout(() => card.remove(), 300);
        toast('Flight added to My Flights');
        renderOffers();
      }
    };
  });

  grid.querySelectorAll('[data-decline]').forEach(btn => {
    btn.onclick = () => {
      const i = +btn.dataset.decline;
      const card = btn.closest('.offer-card');
      if (card && state.offers[i]) {
        state.offers.splice(i, 1);
        save();
        card.classList.add('declined');
        setTimeout(() => card.remove(), 300);
        toast('Offer declined');
        renderOffers();
      }
    };
  });
}

function badge(type) {
  const map = {major:'Major', regional:'Regional', small:'Small'};
  return `<span class="chip">${map[type]||type}</span>`;
}

function renderFlights() {
  const body = el('#flightsBody'); 
  const empty = el('#flightsEmpty');
  if (!state.flights.length) { 
    body.innerHTML=''; 
    empty.style.display='block'; 
    return; 
  }
  empty.style.display='none';
  body.innerHTML = state.flights.slice().reverse().map(f => {
    ensureOps(f);
    const acData = aircraftData[f.aircraft] || {};
    const capacityText = airlineIsCargo(f.code) ? `${acData.capacity.cargo}kg` : `${acData.capacity.pax} pax`;
    return `
      <tr data-flight-id="${f.id}">
        <td><b>${f.code}${f.flight.replace(f.code,'')}</b></td>
        <td>
          ${f.from} → ${f.to}
          <div class="muted" style="font-size:.8rem">${capitalize(f.fromIsland)} → ${capitalize(f.toIsland)}</div>
          <div class="muted" style="font-size:.8rem">Gates: ${isNaN(+f.departureGate) ? f.departureGate : 'G'+f.departureGate} → ${isNaN(+f.arrivalGate) ? f.arrivalGate : 'G'+f.arrivalGate}</div>
        </td>
        <td>${fmtTime(new Date(f.depISO))} → ${fmtTime(new Date(f.arrISO))}</td>
        <td>${f.aircraft} (${capacityText})</td>
        <td><span class="status ${f.status}">${f.status[0].toUpperCase()+f.status.slice(1)}</span></td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap">
            ${f.status==='scheduled' ? `<button class="btn" style="background:linear-gradient(180deg, #ffd700, #ff8c00); border-color:#ffa500; color:#1a1a1a" data-ops="${f.id}">Ground Ops</button>` : ''}
            ${f.status==='scheduled'? `<button class="btn" style="background:linear-gradient(180deg, #4caf50, #2e7d32); border-color:#43a047; color:white" data-start="${f.id}">Start</button>`:''}
            ${f.status==='enroute'? `<button class="btn good" data-complete="${f.id}">Complete</button>`:''}
            ${f.status!=='completed'? `<button class="btn warn" data-cancel="${f.id}">Cancel</button>`:''}
          </div>
        </td>
      </tr>`;
  }).join('');

  body.querySelectorAll('[data-start]').forEach(b => b.onclick = () => {
    const f = state.flights.find(x => x.id === b.dataset.start);
    if (f && ensureOps(f).tasks.pushback.status !== 'done') {
      toast('Complete ground operations before starting');
      return;
    }
    updateFlight(b.dataset.start, 'enroute');
  });
  body.querySelectorAll('[data-complete]').forEach(b => b.onclick = () => {
    const f = state.flights.find(x => x.id === b.dataset.complete);
    if (f) {
      state.currency += f.pay;
      save();
      updateCurrencyDisplay();
      toast(`Earned $${f.pay} for completing flight!`);
      updateFlight(b.dataset.complete, 'completed');
    }
  });
  body.querySelectorAll('[data-cancel]').forEach(b => b.onclick = () => removeFlight(b.dataset.cancel));
  body.querySelectorAll('[data-ops]').forEach(b => b.onclick = () => openOps(b.dataset.ops));
}

// --- Ground Ops ---
const OPS_TEMPLATES = {
  pax: [
    {key:'fuel', name:'Fueling', dur:30},
    {key:'catering', name:'Catering', dur:20},
    {key:'boarding', name:'Boarding', dur:40},
    {key:'baggage', name:'Baggage', dur:25},
    {key:'pushback', name:'Pushback', dur:10},
  ],
  cargo: [
    {key:'fuel', name:'Fueling', dur:30},
    {key:'loading', name:'Loading', dur:35},
    {key:'paperwork', name:'Paperwork', dur:15},
    {key:'pushback', name:'Pushback', dur:10},
  ]
};
const timers = {};

function getTemplateForFlight(f) { return airlineIsCargo(f.code) ? OPS_TEMPLATES.cargo : OPS_TEMPLATES.pax; }
function ensureOps(f) {
  if (!f.ops) {
    const tpl = getTemplateForFlight(f);
    f.ops = { tasks: {} };
    tpl.forEach(t => { f.ops.tasks[t.key] = {status:'pending', progress:0}; });
    save();
  }
  return f.ops;
}
function openOps(id) {
  const f = state.flights.find(x => x.id === id);
  if (!f) return;
  ensureOps(f);
  renderOpsModal(f);
  el('#opsModal').classList.add('active');
}
function closeOps() { el('#opsModal').classList.remove('active'); }

function renderOpsModal(f) {
  const tpl = getTemplateForFlight(f);
  const cont = el('#opsContent');
  const allDone = tpl.every(t => f.ops.tasks[t.key].status === 'done');
  cont.innerHTML = `
    <div class="banner"><div>
      <div style="font-weight:800">${f.code}${f.flight.replace(f.code,'')} • ${f.aircraft}</div>
      <div class="muted">${f.from} → ${f.to} • ${fmtTime(new Date(f.depISO))} → ${fmtTime(new Date(f.arrISO))}</div>
    </div></div>
    <div class="muted" style="margin: 12px 0; padding: 0 8px; font-size: 0.9rem; text-align: center;" id="opsHint">
      ${allDone ? 'All tasks complete. You may depart.' : 'Complete all tasks to enable pushback.'}
    </div>
    <div class="ops-list">
      ${tpl.map((t, idx) => {
        const task = f.ops.tasks[t.key];
        const prevDone = idx === 0 ? true : tpl.slice(0, idx).every(tt => f.ops.tasks[tt.key].status === 'done');
        const disabled = !prevDone && task.status !== 'done';
        const btns = task.status === 'pending'
          ? `<button class="btn" style="background:linear-gradient(180deg, #ffd700, #ff8c00); border-color:#ffa500; color:#1a1a1a" data-start="${t.key}" ${disabled?'disabled':''}>Start</button>`
          : task.status === 'in_progress'
            ? `<button class="btn" style="background:linear-gradient(180deg, #4caf50, #2e7d32); border-color:#43a047; color:white" data-complete="${t.key}">Complete</button><button class="btn" style="background:linear-gradient(180deg, #f44336, #d32f2f); border-color:#e53935; color:white" data-stop="${t.key}">Stop</button>`
            : `<span class="chip">✓ Done</span>`;
        return `
          <div class="task" data-task="${t.key}"> 
            <div class="row"> 
              <div><b>${t.name}</b> <span class="muted" style="font-size:.85rem">(${t.dur}s)</span></div>
              <div class="btn-row">${btns}</div>
            </div>
            <div class="progress"><div style="width:${task.progress||0}%"></div></div>
          </div>`;
      }).join('')}
    </div>`;

  cont.querySelectorAll('[data-start]').forEach(b => b.onclick = () => startTask(f, b.dataset.start));
  cont.querySelectorAll('[data-complete]').forEach(b => b.onclick = () => completeTask(f, b.dataset.complete));
  cont.querySelectorAll('[data-stop]').forEach(b => b.onclick = () => stopTask(f, b.dataset.stop));
  el('#opsQuick').onclick = () => {
    const t = getTemplateForFlight(f); t.forEach(x => { f.ops.tasks[x.key]={status:'done', progress:100}; }); save(); renderOpsModal(f); toast('All ground ops complete');
  };
  el('#opsClose').onclick = closeOps;
  el('#opsLoadSheet').onclick = () => {
    const ls = getOrCreateLoadSheet(f);
    save();
    renderOpsModal(f);
    renderFlights();
    toast(`Load sheet received: ${ls.passengers} pax, ${ls.cargo}kg cargo, ${ls.fuel}kg fuel`);
  };
}

function startTask(f, key) {
  ensureOps(f);
  const tpl = getTemplateForFlight(f);
  const idx = tpl.findIndex(t => t.key === key);
  if (idx > 0) {
    const prevDone = tpl.slice(0, idx).every(t => f.ops.tasks[t.key].status === 'done');
    if (!prevDone) { toast('Finish prior tasks first'); return; }
  }
  const task = f.ops.tasks[key]; if (task.status === 'done') return;
  task.status = 'in_progress'; save(); renderOpsModal(f);
  const dur = tpl[idx].dur; const start = Date.now();
  timers[f.id] ||= {}; if (timers[f.id][key]) clearInterval(timers[f.id][key]);
  timers[f.id][key] = setInterval(() => {
    const pct = Math.min(100, Math.round(((Date.now()-start)/1000) * 100 / dur));
    task.progress = pct;
    if (pct >= 100) {
      clearInterval(timers[f.id][key]); delete timers[f.id][key];
      task.status = 'done'; save(); renderOpsModal(f); renderFlights();
      if (key === 'pushback') { updateFlight(f.id, 'enroute'); closeOps(); switchTab('flights'); }
    } else {
      const bar = el(`#opsContent .task[data-task="${key}"] .progress > div`);
      if (bar) bar.style.width = pct+'%';
      renderFlights();
    }
  }, 250);
}

function stopTask(f, key) {
  if (timers[f.id] && timers[f.id][key]) { clearInterval(timers[f.id][key]); delete timers[f.id][key]; }
  const task = f.ops.tasks[key]; if (task.status === 'in_progress') { task.status = 'pending'; task.progress = 0; save(); renderOpsModal(f); renderFlights(); }
}

function completeTask(f, key) {
  if (timers[f.id] && timers[f.id][key]) { clearInterval(timers[f.id][key]); delete timers[f.id][key]; }
  const task = f.ops.tasks[key]; task.status = 'done'; task.progress = 100; save(); renderOpsModal(f); renderFlights();
  if (key === 'pushback') { updateFlight(f.id, 'enroute'); closeOps(); switchTab('flights'); }
}

function updateFlight(id, newStatus) {
  const f = state.flights.find(x => x.id === id); if (!f) return;
  if (newStatus === 'enroute' && (!f.ops || !f.ops.tasks.pushback || f.ops.tasks.pushback.status !== 'done')) {
    toast('Complete ground operations before starting');
    return;
  }
  f.status = newStatus; 
  save(); 
  renderFlights(); 
  toast(`Flight ${newStatus}`);
}

function removeFlight(id) {
  state.flights = state.flights.filter(x => x.id !== id); save(); renderFlights(); toast('Flight removed');
}

function renderAirlines() {
  const commercialEl = el('#commercialList');
  const cargoEl = el('#cargoList');

  const renderInfoCard = (name, code) => {
    const color = airlineColors[code] || {};
    const isCargo = airlineIsCargo(code);
    const info = airlineHubsAndRoutes[code] || { hub: null, routes: [], description: '' };
    const hub = info.hub || 'None';
    const routes = (info.routes && info.routes.length) ? info.routes.join(', ') : 'Various';
    const fleet = (state.ownedAircraft[code] || []).map(ac => {
      const acData = aircraftData[ac] || {};
      const typeIcon = acData.size === 'small' ? '✈️' : acData.size === 'regional' ? '🛩️' : '✈️';
      return `<span class="fleet-tag" title="${ac}">${typeIcon} ${ac}</span>`;
    }).join('');

    return `
      <div class="card airline-card">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <div class="airline-logo-container" style="background: transparent; border: none;">
            <img src="airline_icons/${code}.png" alt="${name} Logo" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${color.color||'#fff'};font-weight:bold;font-size:0.9rem\\'>${code}</div>'">
          </div>
          <div style="min-width:0; flex:1">
            <div style="font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</div>
            <div class="muted" style="font-size:.85rem">ICAO <span class="highlight">•</span> <span class="code">${code}</span> · <span class="tag ${isCargo ? 'tag-cargo' : 'tag-pax'}">${isCargo ? 'Cargo' : 'Passenger'}</span></div>
          </div>
        </div>
        <div class="muted" style="font-size:.9rem; line-height:1.5; margin-bottom:10px;">${info.description || 'No description available.'}</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Hub</div>
            <div class="info-value"><span class="highlight">${hub}</span></div>
          </div>
          <div class="info-item">
            <div class="info-label">Main Routes</div>
            <div class="info-value" style="line-height:1.5">${routes}</div>
          </div>
          <div class="info-item" style="grid-column:1 / -1">
            <div class="info-label">Fleet</div>
            <div class="info-value" data-field="fleet"><div class="fleet-list">${fleet}</div></div>
          </div>
        </div>
      </div>`;
  };

  commercialEl.innerHTML = Object.entries(commercialAirlines).map(([name, code]) => renderInfoCard(name, code)).join('');
  cargoEl.innerHTML = Object.entries(cargoAirlines).map(([name, code]) => renderInfoCard(name, code)).join('');
  renderModalAirlines();
}

function renderModalAirlines() {
  const commercialEl = el('#modalCommercialAirlines');
  const cargoEl = el('#modalCargoAirlines');
  
  const renderPill = (name, code) => {
    const isUnlocked = state.unlockedAirlines.includes(code);
    const cost = unlockCosts[code] || 0;
    let buttonHtml = '';
    if (isUnlocked) {
      buttonHtml = `<button class="btn primary select-airline" data-code="${code}" data-name="${name}">Select</button>`;
    } else if (code !== 'FDX') {
      buttonHtml = `<button class="btn" data-buy="${code}" ${state.currency < cost ? 'disabled' : ''}>Unlock for $${cost}</button>`;
    }
    return `
      <div class="airline-pill ${isUnlocked ? '' : 'locked'}" data-code="${code}" data-name="${name}">
        <div class="airline-logo-container" style="background: transparent; border: none;">
          <img src="airline_icons/${code}.png" alt="${name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.textContent='${code}'; this.remove();" />
        </div>
        <div>${name} <span class="muted">${code}</span></div>
        ${buttonHtml}
      </div>`;
  };
  
  commercialEl.innerHTML = Object.entries(commercialAirlines).map(([name, code]) => renderPill(name, code)).join('');
  cargoEl.innerHTML = Object.entries(cargoAirlines).map(([name, code]) => renderPill(name, code)).join('');
  
  document.querySelectorAll('.select-airline').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.code;
      const name = btn.dataset.name;
      state.airline = { code, name };
      state.offers = [];
      state.lastGenerated = 0;
      save();
      closeAirlineModal();
      renderSelectedAirline();
      renderOffers();
      toast(`Selected ${name}`);
    };
  });
  
  document.querySelectorAll('[data-buy]').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.buy;
      const cost = unlockCosts[code];
      if (state.currency >= cost) {
        state.currency -= cost;
        state.unlockedAirlines.push(code);
        state.ownedAircraft[code] = state.ownedAircraft[code] || [];
        save();
        updateCurrencyDisplay();
        renderModalAirlines();
        renderShop();
        toast(`Unlocked ${airlineList()[code]} for $${cost}`);
      } else {
        toast('Not enough currency');
      }
    };
  });
}

function renderShop() {
  const shopEl = el('#shopList');
  const fleetEl = el('#fleetList');
  const allAirlines = { ...commercialAirlines, ...cargoAirlines };
  
  const renderShopCard = (name, code) => {
    const isUnlocked = state.unlockedAirlines.includes(code);
    const cost = unlockCosts[code] || 0;
    let statusHtml = '';
    if (isUnlocked) {
      statusHtml = `<span class="chip good">Unlocked</span>`;
    } else if (code !== 'FDX') {
      statusHtml = `<button class="btn primary buy-airline" data-code="${code}" ${state.currency < cost ? 'disabled' : ''}>Unlock for $${cost}</button>`;
    }
    const info = airlineHubsAndRoutes[code] || { description: '' };
    return `
      <div class="card shop-card">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <div class="airline-logo-container" style="background: transparent; border: none;">
            <img src="airline_icons/${code}.png" alt="${name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.textContent='${code}'; this.remove();" />
          </div>
          <div style="flex:1">
            <div style="font-weight:800">${name} (${code})</div>
            <div class="muted" style="font-size:.85rem">${info.description || 'No description'}</div>
          </div>
        </div>
        ${statusHtml}
      </div>`;
  };

  const renderFleetCard = (aircraft, code) => {
    const acData = aircraftData[aircraft] || { capacity: { pax: 0, cargo: 0 } };
    const isCargo = airlineIsCargo(code);
    const cost = aircraftCosts[aircraft] || 100;
    const owned = (state.ownedAircraft[code] || []).includes(aircraft);
    const capacityText = isCargo ? `${acData.capacity.cargo}kg cargo` : `${acData.capacity.pax} pax`;
    return `
      <div class="card shop-card">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <div style="font-weight:800">${aircraft}</div>
          <div class="muted" style="font-size:.85rem">Capacity: ${capacityText}</div>
        </div>
        ${owned ? 
          `<span class="chip good">Owned</span>` : 
          `<button class="btn primary buy-aircraft" data-aircraft="${aircraft}" data-airline="${code}" ${state.currency < cost || !state.unlockedAirlines.includes(code) ? 'disabled' : ''}>Buy for $${cost}</button>`}
      </div>`;
  };

  shopEl.innerHTML = Object.entries(allAirlines).map(([name, code]) => renderShopCard(name, code)).join('');
  fleetEl.innerHTML = state.airline ? 
    (aircraftByAirline[state.airline.code] || []).map(aircraft => renderFleetCard(aircraft, state.airline.code)).join('') :
    `<div class="muted" style="padding: 8px 0; text-align: center;">Select an airline to view available aircraft</div>`;

  shopEl.querySelectorAll('.buy-airline').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.code;
      const cost = unlockCosts[code];
      if (state.currency >= cost) {
        state.currency -= cost;
        state.unlockedAirlines.push(code);
        state.ownedAircraft[code] = state.ownedAircraft[code] || [];
        save();
        updateCurrencyDisplay();
        renderShop();
        renderModalAirlines();
        toast(`Unlocked ${airlineList()[code]}`);
      } else {
        toast('Not enough currency');
      }
    };
  });

  fleetEl.querySelectorAll('.buy-aircraft').forEach(btn => {
    btn.onclick = () => {
      const aircraft = btn.dataset.aircraft;
      const code = btn.dataset.airline;
      const cost = aircraftCosts[aircraft];
      if (state.currency >= cost && state.unlockedAirlines.includes(code)) {
        state.currency -= cost;
        state.ownedAircraft[code] = state.ownedAircraft[code] || [];
        state.ownedAircraft[code].push(aircraft);
        state.offers = []; // Clear offers to force refresh with new aircraft
        state.lastGenerated = 0;
        save();
        updateCurrencyDisplay();
        renderShop();
        renderOffers();
        toast(`Purchased ${aircraft} for ${airlineList()[code]}`);
      } else {
        toast('Not enough currency or airline not unlocked');
      }
    };
  });
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openAirlineModal() {
  showModal('airlineModal');
}

function closeAirlineModal() {
  closeModal('airlineModal');
}

function capitalize(s) { return s[0].toUpperCase()+s.slice(1); }

function formatTimeRemaining(ms) {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
}

function updateOfferTimes() {
  const now = new Date();
  document.querySelectorAll('.offer-card').forEach(card => {
    const depTime = new Date(card.dataset.departure);
    const timeElement = card.querySelector('.time-until');
    if (!timeElement) return;
    const timeRemaining = depTime - now;
    if (timeRemaining > 0) {
      timeElement.textContent = `Departs in ${formatTimeRemaining(timeRemaining)}`;
      timeElement.style.color = timeRemaining < 300000 ? '#ef4444' : 'var(--muted)';
    } else {
      timeElement.textContent = 'Departed';
      timeElement.style.color = '#ef4444';
    }
  });
}

function uiTick() {
  renderSelectedAirline();
  renderAirlines();
  renderOffers();
  renderFlights();
  renderShop();
  updateCurrencyDisplay();
  updateOfferTimes();
}

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  document.querySelectorAll('.content').forEach(content => {
    content.style.display = content.id === `tab-${tabId}` ? 'block' : 'none';
  });
  if (tabId === 'flights') renderFlights();
  if (tabId === 'airlines') renderAirlines();
  if (tabId === 'shop') renderShop();
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => switchTab(tab.dataset.tab);
  });
  const bannerChoose = el('#bannerChoose');
  const closeModal = el('#closeModal');
  const openAirlines = el('#openAirlines');
  if (bannerChoose) bannerChoose.onclick = openAirlineModal;
  if (closeModal) closeModal.onclick = closeAirlineModal;
  if (openAirlines) openAirlines.onclick = openAirlineModal;
  el('#refreshOffers').onclick = () => { state.lastGenerated = 0; renderOffers(); toast('Offers refreshed'); };
  el('#searchOffers').addEventListener('input', (e) => filterOffers(e.target.value.trim().toLowerCase()));
  el('#clearOfferSearch').onclick = () => { el('#searchOffers').value = ''; filterOffers(''); };
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('flt-type')) renderOffers();
  });
  switchTab('offers');
  if (!state.airline) {
    el('#airlineBanner').style.display = 'flex';
    setTimeout(openAirlineModal, 300);
  }
  uiTick();
});
