// --- State ---
const state = {
  airline: null,
  flights: [],
  offers: [],
  currency: 0,
  unlockedAirlines: ["FDX"],
  ownedAircraft: { "FDX": ["C208F"] },
  flightPlans: {}, // New: Store flight plan status { flightId: { callsign, aircraft, departing, arriving, validated: boolean } }
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
  // Connect to backend SSE endpoint for flight plan updates
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
    const aircraftData = await response.json();
    const aircraft = aircraftData[callsign];
    return aircraft && aircraft.isOnGround === true;
  } catch (e) {
    console.error('Error fetching aircraft data:', e);
    return false;
  }
}

// --- Helpers ---
// [Existing helpers: getRandomGate, el, els, rand, pick, fmtTime, fmtDate, hashCode, seededBetween, toast, airlineList, airlineIsCargo, airportEntries, filterAirports, genFlightNumber, estimateBlock, calculateDistance, findSuitableAircraft, getMinAirportType, typeAllowance unchanged]

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
            <button class="btn primary" data-file-plan="${f.id}">
              <span class="btn-icon material-icons-round">description</span>
              <span>File Plan</span>
            </button>
            ${f.status==='scheduled' ? `<button class="btn good" data-ops="${f.id}"><span class="btn-icon material-icons-round">tune</span><span>Ground Ops</span></button>` : ''}
            ${f.status==='scheduled'? `<button class="btn primary" data-start="${f.id}" ${!isFlightPlanValid || !f.ops.tasks.pushback || f.ops.tasks.pushback.status !== 'done' ? 'disabled' : ''}><span class="btn-icon material-icons-round">flight_takeoff</span><span>Start</span></button>`:''}
            ${f.status==='enroute'? `<button class="btn primary" data-complete="${f.id}"><span class="btn-icon material-icons-round">check_circle</span><span>Complete</span></button>`:''}
            ${f.status!=='completed'? `<button class="btn warn" data-cancel="${f.id}"><span class="btn-icon material-icons-round">cancel</span><span>Cancel</span></button>`:''}
          </div>
        </td>
      </tr>`;
  }).join('');

  body.querySelectorAll('[data-file-plan]').forEach(btn => {
    btn.onclick = () => {
      const flight = state.flights.find(x => x.id === btn.dataset.filePlan);
      if (flight) {
        submitFlightPlan(flight);
      }
    };
  });

  body.querySelectorAll('[data-start]').forEach(b => b.onclick = async () => {
    const f = state.flights.find(x => x.id === b.dataset.start);
    if (!f) return;
    if (!state.flightPlans[f.id]?.validated) {
      toast('Submit a valid flight plan before starting');
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

async function submitFlightPlan(flight) {
  const callsign = `${flight.code}${flight.flight.replace(flight.code, '')}`;
  const flightPlan = {
    robloxName: 'Player', // Placeholder; in a real app, get from user input or auth
    callsign: callsign,
    realcallsign: callsign,
    aircraft: flight.aircraft,
    flightrules: 'IFR', // Default to IFR for simplicity
    departing: flight.from,
    arriving: flight.to,
    route: 'GPS DIRECT', // Simplified; could be dynamic
    flightlevel: '030' // Default for demo
  };
  try {
    const response = await fetch('/api/submit-flight-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flightPlan)
    });
    if (response.ok) {
      toast(`Flight plan submitted for ${callsign}. Awaiting validation...`);
      state.flightPlans[flight.id] = {
        callsign: flightPlan.callsign,
        aircraft: flightPlan.aircraft,
        departing: flightPlan.departing,
        arriving: flightPlan.arriving,
        validated: false
      };
      save();
      renderFlights();
    } else {
      toast('Failed to submit flight plan');
    }
  } catch (e) {
    console.error('Error submitting flight plan:', e);
    toast('Error submitting flight plan');
  }
}

// --- Ground Ops ---
// [Existing OPS_TEMPLATES, timers, getTemplateForFlight, ensureOps, openOps, closeOps, renderOpsModal, startTask, stopTask, completeTask unchanged]

// --- Flight Management ---
function updateFlight(id, newStatus) {
  const f = state.flights.find(x => x.id === id); if (!f) return;
  if (newStatus === 'enroute' && (!f.ops || !f.ops.tasks.pushback || f.ops.tasks.pushback.status !== 'done')) {
    toast('Complete ground operations before starting');
    return;
  }
  if (newStatus === 'enroute' && !state.flightPlans[f.id]?.validated) {
    toast('Submit a valid flight plan before starting');
    return;
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
// [Existing renderAirlines, renderModalAirlines, renderShop unchanged]

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
// [Existing capitalize, formatTimeRemaining unchanged]

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
