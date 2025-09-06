// --- Data ---
// [Existing data: commercialAirlines, cargoAirlines, unlockCosts, aircraftCosts, airportGates, airports, airlineHubsAndRoutes, airlineColors, aircraftData, aircraftByAirline unchanged]

// --- State ---
const state = {
  airline: null,
  flights: [],
  offers: [],
  currency: 0,
  unlockedAirlines: ["FDX"],
  ownedAircraft: { "FDX": ["C208F"] },
  flightPlans: {}, // { flightId: { callsign, aircraft, departing, arriving, validated: boolean } }
  lastGenerated: 0
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
  setCookie('flightPlans', JSON.stringify(state.flightPlans));
}

function loadState() {
  const airlineCookie = getCookie('airline');
  const flightsCookie = getCookie('flights');
  const currencyCookie = getCookie('currency');
  const unlockedAirlinesCookie = getCookie('unlockedAirlines');
  const ownedAircraftCookie = getCookie('ownedAircraft');
  const flightPlansCookie = getCookie('flightPlans');

  if (airlineCookie) state.airline = JSON.parse(airlineCookie);
  if (flightsCookie) state.flights = JSON.parse(flightsCookie);
  if (currencyCookie) state.currency = parseInt(currencyCookie, 10) || 0;
  if (unlockedAirlinesCookie) state.unlockedAirlines = JSON.parse(unlockedAirlinesCookie);
  else state.unlockedAirlines = ["FDX"];
  if (ownedAircraftCookie) state.ownedAircraft = JSON.parse(ownedAircraftCookie);
  else state.ownedAircraft = { "FDX": ["C208F"] };
  if (flightPlansCookie) state.flightPlans = JSON.parse(flightPlansCookie);
  else state.flightPlans = {};
}

// --- 24data API Integration ---
let sseFlightPlans = null;

function initFlightPlanListener() {
  sseFlightPlans = new EventSource('/api/flight-plans');
  sseFlightPlans.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.t === 'FLIGHT_PLAN') {
      const fp = data.d;
      const flight = state.flights.find(f => {
        const callsign = `${f.code}${f.flight.replace(f.code, '')}`;
        return callsign === fp.callsign &&
               fp.aircraft === f.aircraft &&
               fp.departing === f.from &&
               fp.arriving === f.to;
      });
      if (flight) {
        state.flightPlans[flight.id] = {
          callsign: fp.callsign,
          aircraft: fp.aircraft,
          departing: fp.departing,
          arriving: fp.arriving,
          validated: true
        };
        save();
        renderFlights();
        toast(`Flight plan validated for ${fp.callsign}`);
      }
    }
  };
  sseFlightPlans.onerror = () => {
    toast('Error connecting to flight plan updates. Retrying...');
    setTimeout(initFlightPlanListener, 5000);
  };
}

async function checkAircraftOnGround(flight) {
  try {
    const callsign = `${flight.code}${flight.flight.replace(flight.code, '')}`;
    const response = await fetch('/api/acft-data');
    if (!response.ok) throw new Error('Failed to fetch aircraft data');
    const aircraftData = await response.json();
    const aircraft = aircraftData[callsign];
    return aircraft && aircraft.isOnGround === true;
  } catch (e) {
    console.error('Error fetching aircraft data:', e);
    toast('Unable to verify aircraft status');
    return false;
  }
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
    
    const acData = aircraftData[aircraft];
    const capacity = isCargo ? acData.capacity.cargo : acData.capacity.pax;
    const basePay = isCargo ? capacity / 1000 : capacity / 5;
    const distanceFactor = distance / 10;
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
      pay: Math.max(10, pay),
      departureGate: getRandomGate(o.icao, isCargo),
      arrivalGate: getRandomGate(d.icao, isCargo)
    };
    offers.push(offer);
  }
  return offers;
}

// --- UI Renderers ---
function updateCurrencyDisplay() {
  const amountEl = el('#currencyAmount');
  if (amountEl) amountEl.textContent = state.currency;
}

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
    const typeIcon = acData.size === 'small' ? 'flight' : acData.size === 'regional' ? 'airplanemode_active' : 'airplane_ticket';
    return `<span class="fleet-tag" title="${ac}"><span class="material-icons-round" style="font-size: 1em;">${typeIcon}</span> ${ac}</span>`;
  }).join('');

  const logo = el('#airlineLogo');
  if (logo) {
    logo.innerHTML = `<img src="airline_icons/${code}.png" alt="${name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${airlineColors[code]?.color||'#fff'};font-weight:bold;font-size:0.9rem\\'>${code}</div>'">`;
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
    box.innerHTML = `
      <div class="muted" style="margin-bottom: 12px;">No airline selected</div>
      <button class="btn primary" id="openAirlines" aria-label="Choose Airline" style="width: 100%; justify-content: center;">
        <span class="btn-icon material-icons-round">flight_takeoff</span>
        <span>Choose Airline</span>
      </button>`;
  } else {
    box.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1)">
        <div class="airline-logo-container" id="airlineLogo"></div>
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
        <button class="btn primary" id="switchAirline">
          <span class="btn-icon material-icons-round">swap_horiz</span>
          <span>Switch</span>
        </button>
        <button class="btn warn" id="clearAirline">
          <span class="btn-icon material-icons-round">clear</span>
          <span>Clear</span>
        </button>
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
    state.flightPlans = {};
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
          <button class="btn primary" data-accept="${idx}">
            <span class="btn-icon material-icons-round">check</span>
            <span>Accept</span>
          </button>
          <button class="btn warn" data-decline="${idx}">
            <span class="btn-icon material-icons-round">close</span>
            <span>Decline</span>
          </button>
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
    const flightPlan = state.flightPlans[f.id] || {};
    const isFlightPlanValid = flightPlan.validated;
    const flightPlanStatus = isFlightPlanValid ? 'Valid' : 'Pending';
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
        <td><span class="chip ${isFlightPlanValid ? 'good' : 'warn'}">${flightPlanStatus}</span></td>
        <td>
          <div class="btn-row">
            ${f.status==='scheduled' ? `<button class="btn good" data-ops="${f.id}"><span class="btn-icon material-icons-round">tune</span><span>Ground Ops</span></button>` : ''}
            ${f.status==='scheduled'? `<button class="btn primary" data-start="${f.id}" ${!isFlightPlanValid || !f.ops.tasks.pushback || f.ops.tasks.pushback.status !== 'done' ? 'disabled' : ''}><span class="btn-icon material-icons-round">flight_takeoff</span><span>Start</span></button>`:''}
            ${f.status==='enroute'? `<button class="btn primary" data-complete="${f.id}"><span class="btn-icon material-icons-round">check_circle</span><span>Complete</span></button>`:''}
            ${f.status!=='completed'? `<button class="btn warn" data-cancel="${f.id}"><span class="btn-icon material-icons-round">cancel</span><span>Cancel</span></button>`:''}
          </div>
        </td>
      </tr>`;
  }).join('');

  body.querySelectorAll('[data-start]').forEach(b => b.onclick = async () => {
    const f = state.flights.find(x => x.id === b.dataset.start);
    if (!f) return;
    if (!state.flightPlans[f.id]?.validated) {
      toast('Awaiting valid flight plan');
      return;
    }
    if (!f.ops.tasks.pushback || f.ops.tasks.pushback.status !== 'done') {
      toast('Complete ground operations before starting');
      return;
    }
    const isOnGround = await checkAircraftOnGround(f);
    if (!isOnGround) {
      toast('Aircraft must be on the ground to start');
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
  const hint = el('#opsHint');
  const allDone = tpl.every(t => f.ops.tasks[t.key].status === 'done');
  cont.innerHTML = `
    <div class="banner"><div>
      <div style="font-weight:800">${f.code}${f.flight.replace(f.code,'')} • ${f.aircraft}</div>
      <div class="muted">${f.from} → ${f.to} • ${fmtTime(new Date(f.depISO))} → ${fmtTime(new Date(f.arrISO))}</div>
    </div></div>
    <div class="ops-list">
      ${tpl.map((t, idx) => {
        const task = f.ops.tasks[t.key];
        const prevDone = idx === 0 ? true : tpl.slice(0, idx).every(tt => f.ops.tasks[tt.key].status === 'done');
        const disabled = !prevDone && task.status !== 'done';
        const btns = task.status === 'pending'
          ? `<button class="btn good" data-start="${t.key}" ${disabled?'disabled':''}><span class="btn-icon material-icons-round">play_arrow</span><span>Start</span></button>`
          : task.status === 'in_progress'
            ? `<button class="btn primary" data-complete="${t.key}"><span class="btn-icon material-icons-round">check</span><span>Complete</span></button><button class="btn warn" data-stop="${t.key}"><span class="btn-icon material-icons-round">stop</span><span>Stop</span></button>`
            : `<span class="chip good"><span class="material-icons-round" style="font-size: 1em;">check_circle</span> Done</span>`;
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
  hint.innerHTML = allDone ? 'All tasks complete. You may depart.' : 'Complete all tasks to enable pushback.';

  cont.querySelectorAll('[data-start]').forEach(b => b.onclick = () => startTask(f, b.dataset.start));
  cont.querySelectorAll('[data-complete]').forEach(b => b.onclick = () => completeTask(f, b.dataset.complete));
  cont.querySelectorAll('[data-stop]').forEach(b => b.onclick = () => stopTask(f, b.dataset.stop));
  el('#opsQuick').onclick = () => {
    const t = getTemplateForFlight(f); t.forEach(x => { f.ops.tasks[x.key]={status:'done', progress:100}; }); save(); renderOpsModal(f); toast('All ground ops complete');
  };
  el('#opsLoadSheet').onclick = () => {
    const acData = aircraftData[f.aircraft] || { capacity: { pax: 0, cargo: 0 } };
    const isCargo = airlineIsCargo(f.code);
    const capacity = isCargo ? acData.capacity.cargo : acData.capacity.pax;
    const load = Math.round(capacity * (0.7 + Math.random() * 0.25));
    const fuel = Math.round((isCargo ? 5000 : 3000) + Math.random() * 2000);
    const totalWeight = isCargo ? load + fuel : load * 80 + fuel;
    const loadSheet = `
      <div class="load-sheet">
        <h3>Load Sheet for ${f.code}${f.flight.replace(f.code,'')}</h3>
        <div class="load-sheet-grid">
          <div class="load-sheet-item">
            <span class="label">${isCargo ? 'Cargo' : 'Passengers'}</span>
            <span class="value">${load}${isCargo ? 'kg' : ''}</span>
          </div>
          <div class="load-sheet-item">
            <span class="label">Fuel</span>
            <span class="value">${fuel}kg</span>
          </div>
          <div class="load-sheet-item">
            <span class="label">Total Weight</span>
            <span class="value">${totalWeight}kg</span>
          </div>
          <div class="load-sheet-item total">
            <span class="label">Capacity Utilization</span>
            <span class="value">${Math.round((load / capacity) * 100)}%</span>
          </div>
        </div>
        <div class="load-sheet-progress">
          <div class="load-sheet-progress-bar" style="width:${Math.round((load / capacity) * 100)}%"></div>
        </div>
      </div>`;
    cont.innerHTML = loadSheet + cont.innerHTML;
  };
  el('#opsClose').onclick = closeOps;
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

// --- Flight Management ---
function updateFlight(id, newStatus) {
  const f = state.flights.find(x => x.id === id); if (!f) return;
  if (newStatus === 'enroute') {
    if (!state.flightPlans[f.id]?.validated) {
      toast('Awaiting valid flight plan');
      return;
    }
    if (!f.ops || !f.ops.tasks.pushback || f.ops.tasks.pushback.status !== 'done') {
      toast('Complete ground operations before starting');
      return;
    }
  }
  f.status = newStatus; 
  save(); 
  renderFlights(); 
  toast(`Flight ${newStatus}`);
}

function removeFlight(id) {
  state.flights = state.flights.filter(x => x.id !== id);
  delete state.flightPlans[id];
  save();
  renderFlights();
  toast('Flight removed');
}

// --- Shop and Airlines ---
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
      const typeIcon = acData.size === 'small' ? 'flight' : acData.size === 'regional' ? 'airplanemode_active' : 'airplane_ticket';
      return `<span class="fleet-tag" title="${ac}"><span class="material-icons-round" style="font-size: 1em;">${typeIcon}</span> ${ac}</span>`;
    }).join('');

    return `
      <div class="card airline-card">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <div class="airline-logo-container">
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
      buttonHtml = `<button class="btn primary select-airline" data-code="${code}" data-name="${name}"><span class="btn-icon material-icons-round">check</span><span>Select</span></button>`;
    } else if (code !== 'FDX') {
      buttonHtml = `<button class="btn primary buy-airline" data-code="${code}" ${state.currency < cost ? 'disabled' : ''}><span class="btn-icon material-icons-round">lock_open</span><span>Unlock for $${cost}</span></button>`;
    }
    return `
      <div class="airline-pill ${isUnlocked ? '' : 'locked'}" data-code="${code}" data-name="${name}">
        <div class="airline-logo-container">
          <img src="airline_icons/${code}.png" alt="${name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.textContent='${code}'; this.remove();" />
        </div>
        <div style="flex:1; min-width:0">
          <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${name}</div>
          <div class="muted" style="font-size:.85rem">${code}</div>
        </div>
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
      state.flightPlans = {};
      state.lastGenerated = 0;
      save();
      closeAirlineModal();
      renderSelectedAirline();
      renderOffers();
      renderShop();
      toast(`Selected ${name}`);
    };
  });
  
  document.querySelectorAll('.buy-airline').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.code;
      const cost = unlockCosts[code];
      if (state.currency >= cost) {
        state.currency -= cost;
        state.unlockedAirlines.push(code);
        state.ownedAircraft[code] = state.ownedAircraft[code] || [];
        save();
        updateCurrencyDisplay();
        renderModalAirlines();
        renderShop();
        renderAirlines();
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
      statusHtml = `<span class="chip good"><span class="material-icons-round" style="font-size: 1em;">check_circle</span> Unlocked</span>`;
    } else if (code !== 'FDX') {
      statusHtml = `<button class="btn primary buy-airline" data-code="${code}" ${state.currency < cost ? 'disabled' : ''}><span class="btn-icon material-icons-round">lock_open</span><span>Unlock for $${cost}</span></button>`;
    }
    const info = airlineHubsAndRoutes[code] || { description: '' };
    return `
      <div class="card shop-card">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <div class="airline-logo-container">
            <img src="airline_icons/${code}.png" alt="${name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.textContent='${code}'; this.remove();" />
          </div>
          <div style="flex:1">
            <div style="font-weight:800">${name} (${code})</div>
            <div class="muted" style="font-size:.85rem">${info.description || 'No description'}</div>
          </div>
        </div>
        <div class="btn-row">${statusHtml}</div>
      </div>`;
  };

  shopEl.innerHTML = Object.entries(allAirlines)
    .map(([name, code]) => renderShopCard(name, code))
    .join('');

  const renderFleetCard = (aircraft, code) => {
    const acData = aircraftData[aircraft] || { capacity: { pax: 0, cargo: 0 }, size: 'major', range: 0 };
    const isCargo = airlineIsCargo(code);
    const cost = aircraftCosts[aircraft] || 100;
    const owned = (state.ownedAircraft[code] || []).includes(aircraft);
    const capacityText = isCargo ? `${acData.capacity.cargo}kg cargo` : `${acData.capacity.pax} pax`;
    const typeIcon = acData.size === 'small' ? 'flight' : acData.size === 'regional' ? 'airplanemode_active' : 'airplane_ticket';
    return `
      <div class="card shop-card">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <div style="flex:1">
            <div style="font-weight:800">${aircraft}</div>
            <div class="muted" style="font-size:.85rem">Capacity: ${capacityText} | Range: ${acData.range} units</div>
            <div class="muted" style="font-size:.85rem">${badge(acData.size)}</div>
          </div>
        </div>
        <div class="btn-row">
          ${owned ? 
            `<span class="chip good"><span class="material-icons-round" style="font-size: 1em;">check_circle</span> Owned</span>` : 
            `<button class="btn primary buy-aircraft" data-aircraft="${aircraft}" data-code="${code}" ${state.currency < cost ? 'disabled' : ''}><span class="btn-icon material-icons-round">add_shopping_cart</span><span>Buy for $${cost}</span></button>`}
        </div>
      </div>`;
  };

  const availableAircraft = state.unlockedAirlines
    .filter(code => aircraftByAirline[code])
    .flatMap(code => aircraftByAirline[code].map(aircraft => ({ aircraft, code })))
    .sort((a, b) => aircraftCosts[a.aircraft] - aircraftCosts[b.aircraft]);

  fleetEl.innerHTML = availableAircraft
    .map(({ aircraft, code }) => renderFleetCard(aircraft, code))
    .join('');

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
        renderAirlines();
        renderModalAirlines();
        toast(`Unlocked ${allAirlines[code]} for $${cost}`);
      } else {
        toast('Not enough currency');
      }
    };
  });

  fleetEl.querySelectorAll('.buy-aircraft').forEach(btn => {
    btn.onclick = () => {
      const aircraft = btn.dataset.aircraft;
      const code = btn.dataset.code;
      const cost = aircraftCosts[aircraft];
      if (state.currency >= cost) {
        state.currency -= cost;
        state.ownedAircraft[code] = state.ownedAircraft[code] || [];
        state.ownedAircraft[code].push(aircraft);
        save();
        updateCurrencyDisplay();
        renderShop();
        renderAirlines();
        renderSelectedAirline();
        renderOffers();
        toast(`Purchased ${aircraft} for $${cost}`);
      } else {
        toast('Not enough currency');
      }
    };
  });
}

// --- Modal Handlers ---
function openAirlineModal() {
  el('#airlineModal').classList.add('active');
}

function closeAirlineModal() {
  el('#airlineModal').classList.remove('active');
}

// --- Tab Navigation ---
function switchTab(tab) {
  els('.tab').forEach(t => t.classList.remove('active'));
  els('.content').forEach(c => c.style.display = 'none');
  el(`.tab[data-tab="${tab}"]`).classList.add('active');
  el(`#tab-${tab}`).style.display = 'block';
  
  if (tab === 'offers') renderOffers();
  else if (tab === 'flights') renderFlights();
  else if (tab === 'airlines') renderAirlines();
  else if (tab === 'shop') renderShop();
}

// --- Utility Functions ---
function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function formatTimeRemaining(ms) {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) return `${hours}h ${remainingMinutes}m`;
  return `${minutes}m`;
}

// --- Initialization ---
function init() {
  loadState();
  updateCurrencyDisplay();
  renderSelectedAirline();
  renderOffers();
  renderAirlines();
  renderShop();
  initFlightPlanListener();

  els('.tab').forEach(tab => {
    tab.onclick = () => switchTab(tab.dataset.tab);
  });

  el('#openAirlines').onclick = openAirlineModal;
  el('#bannerChoose').onclick = openAirlineModal;
  el('#closeModal').onclick = closeAirlineModal;

  el('#refreshOffers').onclick = () => {
    state.offers = [];
    state.lastGenerated = 0;
    renderOffers();
    toast('Offers refreshed');
  };

  el('#searchOffers').oninput = e => filterOffers(e.target.value.trim().toLowerCase());
  el('#clearOfferSearch').onclick = () => {
    el('#searchOffers').value = '';
    filterOffers('');
  };

  els('.flt-type').forEach(cb => cb.onchange = () => {
    state.offers = [];
    state.lastGenerated = 0;
    renderOffers();
  });
}

document.addEventListener('DOMContentLoaded', init);
