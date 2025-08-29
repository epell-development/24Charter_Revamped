// --- Data from prompt (converted to JS) ---
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

    // Airport gate configurations
    const airportGates = {
      "IRFD": {
        commercial: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
        cargo: [21,22]
      },
      "ITKO": {
        commercial: [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
        cargo: [17,18,19,20,21,22]
      },
      "IPPH": {
        commercial: [1,2,3,4,5,6,11,12,13,14],
        cargo: [11,12,13,14]
      },
      "IMLR": {
        commercial: [1,2,3,4],
        cargo: [1,2,3,4]
      },
      "IBTH": {
        any: true
      },
      "IGRV": {
        commercial: [1,2,3,4],
        cargo: [1,2,3,4]
      },
      "ILAR": {
        commercial: [1,2,3,4,5,6,7,8,9],
        cargo: [8,9]
      },
      "IPAP": {
        commercial: [1,2,3],
        cargo: [1,2,3]
      },
      "ISAU": {
        commercial: [1,2,3,4],
        cargo: [1,2,3,4]
      },
      "IZOL": {
        commercial: [1,2,3,4,5,6,7,10,11,12,13,14],
        cargo: [10,11,12,13,14]
      },
      "IBLT": {
        any: true
      },
      "IDCS": {
        any: true
      },
      "ILKL": {
        any: true
      }
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
      "DAL": { 
        hub: "IRFD", 
        routes: ["ITKO", "ILAR", "IZOL"],
        routeFrequency: 0.8,
        description: "Delta Airlines, a major global airline known for its extensive domestic and international network. Founded in 1924, it operates a large fleet of modern aircraft and is recognized for its operational reliability and customer service."
      },
      "NKS": { 
        hub: "IMLR", 
        routes: ["IRFD", "ISAU", "IGRV", "ILAR"],
        routeFrequency: 0.8,
        description: "Spirit Wings, a rapidly growing low-cost carrier known for its ultra-low fares and no-frills approach. Despite its budget model, it maintains a strong focus on safety and operational efficiency."
      },
      "BAW": { 
        hub: "IPPH", 
        routes: ["IRFD", "IMLR", "IBTH", "ILAR", "ITKO"],
        routeFrequency: 0.8,
        description: "British Airways, the flag carrier of the United Kingdom, with a rich history dating back to 1919. Known for its premium service and extensive long-haul network, connecting major cities worldwide."
      },
      "SAS": { 
        hub: "IGRV", 
        routes: ["ISAU", "ITKO", "IMLR"],
        routeFrequency: 0.8,
        description: "Scandinavian Airlines, the flag carrier of Denmark, Norway, and Sweden. Founded in 1946, it's known for its efficient service and extensive network across Europe and the North Atlantic. In PTFS it is a more western airline focusing more on the colder islands in the game."
      },
      "AAL": { 
        hub: "ILAR", 
        routes: ["ITKO", "IPPH", "ISAU", "IBTH", "IMLR", "IRFD", "IPAP"],
        routeFrequency: 0.8,
        description: "American Airlines, one of the world's largest airlines with a vast domestic and international network. Known for its modern fleet and comprehensive route map serving 9 different destinations in game."
      },
      "DLH": { 
        hub: "ITKO", 
        routes: ["IRFD", "IPPH", "IZOL", "IGRV", "IBTH", "ILAR"],
        routeFrequency: 0.8,
        description: "Lufthansa, Germany's flag carrier and one of Europe's largest airlines. Renowned for its technical excellence, punctuality, and premium service across its global network in the game."
      },
      "UPS": {
        hub: null,
        routes: [],
        routeFrequency: 0.0,
        description: "UPS Airlines, the cargo division of United Parcel Service. Operating one of the world's largest cargo fleets, it provides time-definite air freight services to over 15 destinations in the game."
      },
      "FDX": {
        hub: null,
        routes: [],
        routeFrequency: 0.0,
        description: "FedEx Express, the world's largest cargo airline by fleet size. Known for its overnight shipping services and global logistics network, operating hundreds of flights daily in the game."
      }
    };
    
    // Airline colors for logos
    const airlineColors = {
      "DAL": { bg: "#0033a0", color: "#ffffff" },
      "NKS": { bg: "#000000", color: "#ffb81c" },
      "BAW": { bg: "#01295c", color: "#ffffff" },
      "SAS": { bg: "#003d73", color: "#ffffff" },
      "AAL": { bg: "#0039aa", color: "#ffffff" },
      "DLH": { bg: "#001a49", color: "#f9b000" },
      "UPS": { bg: "351c15", color: "#ffb500" },
      "FDX": { bg: "#4d148c", color: "#ff6600" }
    };

    // Aircraft data by airline
    const aircraftByAirline = {
      // Commercial airlines
      "DAL": ["A220", "A320", "A330", "A350", "B717", "B737", "B757", "B767", "B727", "B747", "MD11", "MD90", "CRJ700"],
      "NKS": ["A320"],
      "BAW": ["A320", "A350", "A380", "B777", "B787", "B737", "B707", "B727", "B747", "B757", "B767", "CONC", "CRJ700"],
      "SAS": ["A320", "A330", "A350", "ATR72", "E190", "B737", "B747", "B757", "B767", "MD90"],
      "AAL": ["A320", "B737", "B777", "B787", "B707", "B727", "B747", "B757", "B767", "MD11", "CRJ700"],
      "DLH": ["A220", "A320", "A330", "A340", "A350", "A380", "B747", "B767", "B777", "B787", "B707", "B727", "B737"],
      // Cargo airlines
      "UPS": ["B757F", "B767F", "MD11F", "B747F", "B727F"],
      "FDX": ["B757F", "B767F", "B777F", "MD11F", "ATR72F", "C208F", "B727F", "B737BCF"]
    };

    // Aircraft data with size and range in map units
    const aircraftData = {
      // Small aircraft (short range)
      "ATR72": { size: "small", range: 15 },
      "C208F": { size: "small", range: 12 },
      "CRJ700": { size: "small", range: 20 },
      
      // Regional aircraft (medium range)
      "A220": { size: "regional", range: 35 },
      "A320": { size: "regional", range: 30 },
      "E190": { size: "regional", range: 28 },
      "B717": { size: "regional", range: 25 },
      "B727": { size: "regional", range: 30 },
      "B737": { size: "regional", range: 32 },
      "B737BCF": { size: "regional", range: 30 },
      "B727F": { size: "regional", range: 30 },
      "CONC": { size: "regional", range: 45 }, // Concorde has longer range
      
      // Major aircraft (long range)
      "A330": { size: "major", range: 70 },
      "A340": { size: "major", range: 75 },
      "A350": { size: "major", range: 80 },
      "A380": { size: "major", range: 85 },
      "B707": { size: "regional", range: 65 },
      "B747": { size: "major", range: 75 },
      "B757": { size: "major", range: 60 },
      "B767": { size: "major", range: 65 },
      "B777": { size: "major", range: 80 },
      "B787": { size: "major", range: 85 },
      "MD11": { size: "major", range: 70 },
      "MD90": { size: "major", range: 55 },
      "B757F": { size: "major", range: 60 },
      "B767F": { size: "major", range: 65 },
      "B777F": { size: "major", range: 80 },
      "MD11F": { size: "major", range: 70 },
      "B747F": { size: "major", range: 75 }
    };
    
    // Aircraft size categories for compatibility
    const aircraftSizes = Object.fromEntries(
      Object.entries(aircraftData).map(([model, data]) => [model, data.size])
    );

    // --- State ---
    const state = {
      airline: JSON.parse(localStorage.getItem('airline')||'null'),
      flights: JSON.parse(localStorage.getItem('flights')||'[]'),
      offers: []
    };

    // --- Helpers ---
    function getRandomGate(airportIcao, isCargo = false) {
      const gates = airportGates[airportIcao];
      if (!gates) return 'N/A';
      
      if (gates.any) return 'ANY';
      
      const gateList = isCargo ? 
        (gates.cargo && gates.cargo.length ? gates.cargo : gates.commercial) : 
        gates.commercial;
      
      return gateList.length ? pick(gateList).toString() : 'N/A';
    }

    const el = sel => document.querySelector(sel);
    const els = sel => Array.from(document.querySelectorAll(sel));
    const rand = (min, max) => Math.floor(Math.random()*(max-min+1))+min;
    const pick = arr => arr[Math.floor(Math.random()*arr.length)];
    const fmtTime = d => d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const fmtDate = d => d.toLocaleDateString([], {month:'short', day:'numeric'});
    // Deterministic hash and seeded number helpers (for consistent load sheets)
    const hashCode = (str) => {
      let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
      return Math.abs(h);
    };
    const seededBetween = (min, max, seed) => {
      const x = Math.sin(seed) * 10000; const frac = x - Math.floor(x);
      return Math.round(min + (max - min) * frac);
    };

    function toast(msg){
      const t = el('#toast');
      t.textContent = msg; t.classList.add('show');
      setTimeout(()=>t.classList.remove('show'), 5000);
    }

    function airlineList(){
      return { ...commercialAirlines, ...cargoAirlines };
    }
    function airlineIsCargo(code){
      return Object.values(cargoAirlines).includes(code);
    }

    function airportEntries(){
      return Object.entries(airports).map(([icao, data]) => ({
        icao,
        type: data.type,
        location: data.location,
        island: data.location, // For backward compatibility
        x: data.x,
        y: data.y
      }));
    }

    function filterAirports({types, q}){
      const lowerQ = (q||'').trim().toLowerCase();
      return airportEntries().filter(a => {
        const hitType = types.includes(a.type);
        const hitQ = !lowerQ || 
          a.icao.toLowerCase().includes(lowerQ) || 
          a.location.toLowerCase().includes(lowerQ);
        return hitType && hitQ;
      });
    }

    function genFlightNumber(prefix){
      return `${prefix}${rand(10, 9999)}`;
    }

    function estimateBlock(from, to) {
      // Calculate distance between airports
      const distance = calculateDistance(from, to);
      
      // Base time on distance (1 minute per 0.5 units of distance, minimum 10 minutes)
      const baseTime = Math.max(10, Math.round(distance * 2));
      
      // Add some randomness (10% variation)
      const variation = Math.round(baseTime * 0.1);
      return baseTime + rand(-variation, variation);
    }

    // Calculate distance between two airports using their coordinates
    function calculateDistance(fromIcao, toIcao) {
      const from = airports[fromIcao];
      const to = airports[toIcao];
      if (!from || !to) return 0;
      
      // Simple Euclidean distance for our map coordinates
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Find suitable aircraft for a given distance and airport types
    function findSuitableAircraft(fleet, distance, destType, originType) {
      // Filter aircraft that can make the distance and serve both airports
      const suitable = fleet.filter(ac => {
        const acData = aircraftData[ac];
        if (!acData) return false;
        
        // Get aircraft size
        const acSize = acData.size;
        
        // Check if aircraft can serve origin
        let originCompatible = false;
        if (originType === 'small') {
          originCompatible = (acSize === 'small');
        } else if (originType === 'regional') {
          originCompatible = (acSize === 'small' || acSize === 'regional');
        } else { // major
          originCompatible = true; // All aircraft can serve major airports
        }
        
        // Check if aircraft can serve destination
        let destCompatible = false;
        if (destType === 'small') {
          destCompatible = (acSize === 'small');
        } else if (destType === 'regional') {
          destCompatible = (acSize === 'small' || acSize === 'regional');
        } else { // major
          destCompatible = true; // All aircraft can serve major airports
        }
        
        return acData.range >= distance * 0.9 && originCompatible && destCompatible;
      });
      
      if (suitable.length === 0) return null;
      
      // Randomly select from all suitable aircraft
      return suitable[Math.floor(Math.random() * suitable.length)];
    }
    
    // Get the minimum airport type an aircraft can serve
    function getMinAirportType(aircraft) {
      const acData = aircraftData[aircraft];
      if (!acData) return 'major'; // Default to most restrictive if unknown
      
      // Return the minimum airport type this aircraft can serve
      // Order: small < regional < major
      return acData.size; // The size is the minimum airport type it can serve
    }
    
    function generateOffers(n=12) {
      const selected = state.airline; 
      if (!selected) return [];
      
      const types = Array.from(document.querySelectorAll('.flt-type:checked')).map(i => i.value);
      const allAirports = airportEntries();
      const offers = [];
      
      const isCargo = airlineIsCargo(selected.code);
      const fleet = aircraftByAirline[selected.code] || [];
      if (fleet.length === 0) return [];
      
      // Get airline's hub and route information
      const airlineInfo = airlineHubsAndRoutes[selected.code] || { hub: null, routes: [], routeFrequency: 0 };
      const { hub, routes, routeFrequency } = airlineInfo;
      
      // Determine what types of airports this airline can serve based on its fleet
      const fleetCapabilities = {
        small: false,
        regional: false,
        major: false
      };
      
      // Check what types of airports this airline can serve
      fleet.forEach(ac => {
        const minType = getMinAirportType(ac);
        fleetCapabilities.small = fleetCapabilities.small || minType === 'small';
        fleetCapabilities.regional = fleetCapabilities.regional || minType === 'regional' || minType === 'small';
        fleetCapabilities.major = true; // All aircraft can serve major airports
      });
      
      // Filter airports to only include those this airline can serve
      const pool = allAirports.filter(a => 
        types.includes(a.type) && 
        ((a.type === 'small' && fleetCapabilities.small) ||
         (a.type === 'regional' && fleetCapabilities.regional) ||
         (a.type === 'major' && fleetCapabilities.major))
      );
      
      if (pool.length < 2) return [];

      // Generate offers within 10-15 minutes from current time
      const now = new Date();
      const minMinutes = 10;
      const maxMinutes = 15;
      
      for (let i = 0; i < n; i++) {
        let o, d, distance, aircraft, attempts = 0;
        
        // Determine if we should generate a hub-based route (for non-cargo airlines with a hub)
        const useHubRoute = hub && !isCargo && Math.random() < routeFrequency;
        
        // Try to find a valid route with suitable aircraft
        do {
          // If using hub route, ensure either origin or destination is the hub
          if (useHubRoute) {
            const isHubToSpoke = Math.random() > 0.5;
            
            if (isHubToSpoke) {
              // Hub to spoke
              o = pool.find(a => a.icao === hub) || pick(pool);
              // Filter destinations to preferred routes if available, otherwise use any valid destination
              const preferredDests = pool.filter(dest => 
                dest.icao !== o.icao && routes.includes(dest.icao)
              );
              d = preferredDests.length > 0 ? pick(preferredDests) : pick(pool.filter(dest => dest.icao !== o.icao));
            } else {
              // Spoke to hub
              d = pool.find(a => a.icao === hub) || pick(pool);
              // Filter origins to preferred routes if available, otherwise use any valid origin
              const preferredOrigs = pool.filter(orig => 
                orig.icao !== d.icao && routes.includes(orig.icao)
              );
              o = preferredOrigs.length > 0 ? pick(preferredOrigs) : pick(pool.filter(orig => orig.icao !== d.icao));
            }
          } else {
            // Regular route selection
            o = pick(pool);
            
            // Filter potential destinations to only those that can be served by our fleet
            const potentialDests = pool.filter(dest => {
              if (dest.icao === o.icao) return false; // Don't fly to self
              
              // Check if any aircraft in our fleet can serve both origin and destination
              return fleet.some(ac => {
                const acData = aircraftData[ac];
                if (!acData) return false;
                
                // Check if aircraft can serve both airports
                const canServeOrigin = acData.size === o.type || 
                                     (o.type === 'small' && acData.size === 'regional') ||
                                     (o.type === 'regional' && acData.size === 'major');
                const canServeDest = acData.size === dest.type || 
                                   (dest.type === 'small' && acData.size === 'regional') ||
                                   (dest.type === 'regional' && acData.size === 'major');
                
                return canServeOrigin && canServeDest;
              });
            });
            
            if (potentialDests.length === 0) continue; // No valid destinations for this origin
            
            d = pick(potentialDests);
          }
          
          distance = calculateDistance(o.icao, d.icao);
          aircraft = findSuitableAircraft(fleet, distance, d.type, o.type);
          attempts++;
        } while ((!aircraft || o.icao === d.icao) && attempts < 50);
        
        if (!aircraft) continue; // Skip if no suitable aircraft found
        
        // Calculate flight time based on distance and aircraft type
        // Adjusted to create realistic flight times between 10-18 minutes
        const baseSpeed = aircraftData[aircraft].range / 2.5; // Slightly reduced speed
        // Scale the time to target 10-18 minutes for most routes
        const minutes = Math.max(8, Math.min(22, Math.round(distance * 12 / baseSpeed) + 6));
        
        // Calculate departure time within 10-15 minutes from now
        const depMinutes = rand(minMinutes, maxMinutes);
        const dep = new Date(now.getTime() + depMinutes * 60000);
        const arr = new Date(dep.getTime() + minutes * 60000);
        
        // Calculate pay based on distance and aircraft type
        const isMajor = aircraftData[aircraft].size === 'major';
        const payMultiplier = isCargo ? 1.15 : 1.0;
        const pay = Math.round(payMultiplier * (minutes * 3 + (isMajor ? 50 : 0)));
        
        // Generate the offer with all details
        const offer = {
          airline: selected.name, 
          code:selected.code, 
          flight: genFlightNumber(selected.code),
          from:o.icao, 
          to:d.icao, 
          fromIsland:o.island, 
          toIsland:d.island, 
          fromType:o.type, 
          toType:d.type,
          depISO: dep.toISOString(), 
          arrISO: arr.toISOString(), 
          minutes, 
          aircraft, 
          pay: Math.round(pay),
          departureGate: getRandomGate(o.icao, isCargo),
          arrivalGate: getRandomGate(d.icao, isCargo)
        };
        offers.push(offer);
      }
      return offers;
    }

    function save(){
      localStorage.setItem('airline', JSON.stringify(state.airline));
      localStorage.setItem('flights', JSON.stringify(state.flights));
    }

    // --- UI Renderers ---
    function updateAirlineInfo() {
      if (!state.airline) return;
      const { name, code } = state.airline;
      const isCargo = airlineIsCargo(code);
      const airlineData = airlineHubsAndRoutes[code] || { hub: null, routes: [] };
      const fleet = aircraftByAirline[code] || [];

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
      // In the sidebar, show 'PAX' instead of 'Passenger' for better space usage
      const typeEl = el('#airlineType'); 
      if (typeEl) {
        const isSidebar = typeEl.closest('.left');
        const displayText = isCargo ? 'Cargo' : (isSidebar ? 'PAX' : 'Passenger');
        typeEl.innerHTML = `<span class="tag ${isCargo ? 'tag-cargo' : 'tag-pax'}">${displayText}</span>`;
      }
      const descEl = el('#airlineDescription'); if (descEl) descEl.textContent = airlineData.description || 'No description available.';
    }
    
    function renderSelectedAirline(){
      // Ensure airline info is visible on mobile
      if (window.innerWidth <= 768) {
        document.querySelector('.left').scrollIntoView({ behavior: 'smooth' });
      }
      const box = el('#selectedAirline');
      box.innerHTML = '';
      if(!state.airline){
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
      
      // Update the airline info section
      updateAirlineInfo();
      
      const openBtn = el('#openAirlines'); if(openBtn) openBtn.onclick = openAirlineModal;
      const switchBtn = el('#switchAirline'); 
      if(switchBtn) {
        switchBtn.onclick = () => {
          openAirlineModal();
          // When the modal is closed after selection, it will automatically refresh offers
        };
      }
      const clearBtn = el('#clearAirline'); 
      if(clearBtn) clearBtn.onclick = ()=>{
        state.airline = null; 
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
    
    function renderOffers(){
      const grid = el('#offersGrid'); 
      const empty = el('#offersEmpty');
      const banner = el('#airlineBanner');
      const searchTerm = el('#searchOffers')?.value.trim().toLowerCase() || '';
      
      if(!state.airline){
        grid.innerHTML=''; 
        empty.style.display='block'; 
        banner.style.display='flex';
        return;
      }
      
      banner.style.display='none';
      
      // Only regenerate offers if we don't have any or if explicitly refreshed
      if(state.offers.length === 0 || !state.lastGenerated || (Date.now() - state.lastGenerated) > 60000) {
        state.offers = generateOffers(12);
        state.lastGenerated = Date.now();
      }
      
      if(!state.offers.length){ 
        grid.innerHTML=''; 
        empty.style.display='block'; 
        empty.textContent = 'No offers available. Try adjusting your filters.';
        return; 
      }
      
      empty.style.display='none';
      grid.innerHTML = state.offers.map((o,idx)=>{
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
              <div class="kv"><div class="k">Aircraft</div><div class="v">${o.aircraft}</div></div>
              <div class="kv"><div class="k">Dep Gate</div><div class="v">${isNaN(+o.departureGate) ? o.departureGate : 'G'+o.departureGate}</div></div>
              <div class="kv"><div class="k">Arr Gate</div><div class="v">${isNaN(+o.arrivalGate) ? o.arrivalGate : 'G'+o.arrivalGate}</div></div>
            </div>
            <div class="muted" style="margin-top:6px; font-size:.85rem">${badge(o.fromType)} • ${badge(o.toType)}</div>
            <div class="btn-row" style="position: relative; display: flex; align-items: center; gap: 8px;">
              <button class="btn primary" style="background:linear-gradient(180deg, #4caf50, #2e7d32); border-color:#43a047" data-accept="${idx}">Accept</button>
              <div class="push-time-dropdown" data-offer-idx="${idx}" style="position: relative; height: 38px;">
                <div class="push-time-trigger" style="height: 100%;">
                  <span>Push Time</span>
                  <span class="push-time-arrow">▼</span>
                </div>
                <div class="push-time-options" style="position: absolute; bottom: calc(100% + 4px); left: 0; background: #2d2d2d; border: 1px solid #444; border-radius: 6px; padding: 4px 0; min-width: 140px; z-index: 1000; display: none;">
                  <div class="push-time-option" data-minutes="15" style="padding: 8px 12px; cursor: pointer;">15 minutes</div>
                  <div class="push-time-option" data-minutes="30" style="padding: 8px 12px; cursor: pointer;">30 minutes</div>
                  <div class="push-time-option" data-minutes="45" style="padding: 8px 12px; cursor: pointer;">45 minutes</div>
                  <div class="push-time-option" data-minutes="60" style="padding: 8px 12px; cursor: pointer;">60 minutes</div>
                </div>
              </div>
              <button class="btn warn" data-decline="${idx}" style="color: white !important;">Decline</button>
            </div>
          </article>`;
      }).join('');

      grid.querySelectorAll('[data-accept]').forEach(btn => {
        btn.onclick = () => {
          const i = +btn.dataset.accept;
          const card = btn.closest('.offer-card');
          if (card) {
            const o = state.offers[i];
            state.offers.splice(i, 1);
            state.flights.push({...o, id: crypto.randomUUID(), status: 'scheduled'});
            save();
            renderFlights();
            card.remove();
            toast('Flight added to My Flights');
          }
        };
      });
      // Handle Push Time dropdown
      grid.querySelectorAll('.push-time-dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.push-time-trigger');
        const options = dropdown.querySelector('.push-time-options');
        
        // Toggle dropdown on trigger click (always open upwards)
        trigger.onclick = (e) => {
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('open');
          
          // Close all other dropdowns
          document.querySelectorAll('.push-time-dropdown').forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('open');
              const opt = d.querySelector('.push-time-options');
              if (opt) opt.style.display = 'none';
            }
          });
          
          // Toggle this dropdown
          if (!isOpen) {
            dropdown.classList.add('open');
            
            // Show the dropdown
            options.style.display = 'block';
            // Force position above
            options.style.bottom = '100%';
            options.style.top = 'auto';
            options.style.marginBottom = '4px';
            options.style.marginTop = '0';
            
            // Close dropdown when clicking outside
            const handleClickOutside = (e) => {
              if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                options.style.display = 'none';
                document.removeEventListener('click', handleClickOutside);
              }
            };
            
            // Add listener on next tick to avoid immediate close
            setTimeout(() => {
              document.addEventListener('click', handleClickOutside);
            }, 0);
          } else {
            dropdown.classList.remove('open');
            options.style.display = 'none';
          }
        };
        
        // Handle option selection
        dropdown.querySelectorAll('.push-time-option').forEach((option) => {
          option.onclick = (e) => {
            e.stopPropagation();
            const minutes = +option.dataset.minutes;
            const i = +dropdown.dataset.offerIdx;
            const offer = state.offers[i];
            
            if (offer) {
              // Update departure and arrival times
              const depTime = new Date(offer.depISO);
              const arrTime = new Date(offer.arrISO);
              depTime.setMinutes(depTime.getMinutes() + minutes);
              arrTime.setMinutes(arrTime.getMinutes() + minutes);
              
              // Update the offer with new times
              offer.depISO = depTime.toISOString();
              offer.arrISO = arrTime.toISOString();
              
              // Close the dropdown
              dropdown.classList.remove('open');
              dropdown.querySelector('.push-time-options').style.display = 'none';
              
              // Re-render the offers to show the updated time
              renderOffers();
              toast(`Flight pushed back ${minutes} minutes`);
            }
          };
        });
      });
      
      // Handle Decline button
      grid.querySelectorAll('[data-decline]').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const i = +btn.dataset.decline;
          const card = btn.closest('.offer-card');
          if (card) {
            state.offers.splice(i, 1);
            save();
            card.remove();
            toast('Offer declined');
            
            // If no offers left, show the empty state
            if (state.offers.length === 0) {
              el('#offersEmpty').style.display = 'block';
            }
          }
        };
      });
    }

    function badge(type){
      const map = {major:'Major', regional:'Regional', small:'Small', military:'Military', training:'Training', restricted:'Restricted'};
      return `<span class="chip">${map[type]||type}</span>`;
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

    function getTemplateForFlight(f){ return airlineIsCargo(f.code) ? OPS_TEMPLATES.cargo : OPS_TEMPLATES.pax; }
    function ensureOps(f){
      if(!f.ops){
        const tpl = getTemplateForFlight(f);
        f.ops = { tasks:{} };
        tpl.forEach(t=>{ f.ops.tasks[t.key] = {status:'pending', progress:0}; });
        save();
      }
      return f.ops;
    }
    function openOps(id){ const f = state.flights.find(x=>x.id===id); if(!f) return; ensureOps(f); renderOpsModal(f); el('#opsModal').classList.add('active'); }
    function closeOps(){ el('#opsModal').classList.remove('active'); }

    function renderOpsModal(f){
      const tpl = getTemplateForFlight(f);
      const cont = el('#opsContent');
      const allDone = getTemplateForFlight(f).every(t => f.ops.tasks[t.key].status==='done');
      cont.innerHTML = `
        <div class="banner"><div>
          <div style="font-weight:800">${f.code}${f.flight.replace(f.code,'')} • ${f.aircraft}</div>
          <div class="muted">${f.from} → ${f.to} • ${fmtTime(new Date(f.depISO))} → ${fmtTime(new Date(f.arrISO))}</div>
        </div></div>
        <div class="muted" style="margin: 12px 0; padding: 0 8px; font-size: 0.9rem; text-align: center;" id="opsHint">
          ${allDone ? 'All tasks complete. You may depart.' : 'Complete all tasks to enable pushback.'}
        </div>
        <div class="ops-list">
          ${tpl.map((t, idx)=>{
            const task = f.ops.tasks[t.key];
            const prevDone = idx===0 ? true : tpl.slice(0,idx).every(tt => f.ops.tasks[tt.key].status==='done');
            const disabled = !prevDone && task.status!=='done';
            const btns = task.status==='pending'
              ? `<button class=\"btn\" style=\"background:linear-gradient(180deg, #ffd700, #ff8c00); border-color:#ffa500; color:#1a1a1a\" data-start=\"${t.key}\" ${disabled?'disabled':''}>Start</button>`
              : task.status==='in_progress'
                ? `<button class=\"btn\" style=\"background:linear-gradient(180deg, #4caf50, #2e7d32); border-color:#43a047; color:white\" data-complete=\"${t.key}\">Complete</button><button class=\"btn\" style=\"background:linear-gradient(180deg, #f44336, #d32f2f); border-color:#e53935; color:white\" data-stop=\"${t.key}\">Stop</button>`
                : `<span class=\"chip\">✓ Done</span>`;
            return `
              <div class=\"task\" data-task=\"${t.key}\"> 
                <div class=\"row\"> 
                  <div><b>${t.name}</b> <span class=\"muted\" style=\"font-size:.85rem\">(${t.dur}s)</span></div>
                  <div class=\"btn-row\">${btns}</div>
                </div>
                <div class=\"progress\"><div style=\"width:${task.progress||0}%\"></div></div>
              </div>`;
          }).join('')}
        </div>`;

      cont.querySelectorAll('[data-start]').forEach(b=> b.onclick = ()=> startTask(f, b.dataset.start));
      cont.querySelectorAll('[data-complete]').forEach(b=> b.onclick = ()=> completeTask(f, b.dataset.complete));
      cont.querySelectorAll('[data-stop]').forEach(b=> b.onclick = ()=> stopTask(f, b.dataset.stop));
      const hintEl = cont.querySelector('#opsHint');
      if (hintEl) {
        hintEl.textContent = allDone ? 'All tasks complete. You may depart.' : 'Complete all tasks to enable pushback.';
      }
      el('#opsQuick').onclick = ()=>{
        const t = getTemplateForFlight(f); t.forEach(x=>{ f.ops.tasks[x.key]={status:'done', progress:100}; }); save(); renderOpsModal(f); toast('All ground ops complete');
      };
      el('#opsClose').onclick = closeOps;
      el('#opsLoadSheet').onclick = () => {
        // Create or reuse deterministic load sheet per flight
        const ls = getOrCreateLoadSheet(f);
        save();
        // Update both Ops modal and Flights table preview
        renderOpsModal(f);
        renderFlights();
        toast(`Load sheet received: ${ls.passengers} pax, ${ls.cargo}kg cargo, ${ls.fuel}kg fuel`);
      };
    }

    function startTask(f, key){
      ensureOps(f);
      const tpl = getTemplateForFlight(f);
      const idx = tpl.findIndex(t=>t.key===key);
      if(idx>0){
        const prevDone = tpl.slice(0,idx).every(t=> f.ops.tasks[t.key].status==='done');
        if(!prevDone){ toast('Finish prior tasks first'); return; }
      }
      const task = f.ops.tasks[key]; if(task.status==='done') return;
      task.status='in_progress'; save(); renderOpsModal(f);
      const dur = tpl[idx].dur; const start = Date.now();
      timers[f.id] ||= {}; if(timers[f.id][key]) clearInterval(timers[f.id][key]);
      timers[f.id][key] = setInterval(()=>{
        const pct = Math.min(100, Math.round(((Date.now()-start)/1000) * 100 / dur));
        task.progress = pct;
        if(pct>=100){
          clearInterval(timers[f.id][key]); delete timers[f.id][key];
          task.status='done'; save(); renderOpsModal(f); renderFlights();
          if(key==='pushback'){ updateFlight(f.id, 'enroute'); closeOps(); switchTab('flights'); }
        } else {
          const bar = el(`#opsContent .task[data-task=\"${key}\"] .progress > div`);
          if(bar) bar.style.width = pct+'%';
          renderFlights();
        }
      }, 250);
    }

    function stopTask(f, key){
      if(timers[f.id] && timers[f.id][key]){ clearInterval(timers[f.id][key]); delete timers[f.id][key]; }
      const task = f.ops.tasks[key]; if(task.status==='in_progress'){ task.status='pending'; task.progress=0; save(); renderOpsModal(f); renderFlights(); }
    }

    function completeTask(f, key){
      if(timers[f.id] && timers[f.id][key]){ clearInterval(timers[f.id][key]); delete timers[f.id][key]; }
      const task = f.ops.tasks[key]; task.status='done'; task.progress=100; save(); renderOpsModal(f); renderFlights();
      if(key==='pushback'){ updateFlight(f.id, 'enroute'); closeOps(); switchTab('flights'); }
    }

    function generateLoadSheetPreview(f) {
      // Ensure ops exists so we can read task progress
      ensureOps(f);
      // Create expected load sheet if missing so current can scale against it
      const ls = getOrCreateLoadSheet(f);
      const { pax: paxCount, cargo: cargoWeight, fuel: fuelWeight } = getCurrentLoad(f, ls);
      const paxWeight = f.aircraft === 'A320' ? 84 : 90; // Average passenger weight in kg
      const totalPaxWeight = paxCount * paxWeight;
      const totalWeight = totalPaxWeight + cargoWeight + fuelWeight;
      const maxWeight = f.aircraft === 'A320' ? 78500 : 100000;
      const weightPercentage = Math.min(100, Math.round((totalWeight / maxWeight) * 100));
      
      return `
        <div class="mini-load-sheet">
          <div class="mini-load-sheet-grid">
            <div class="mini-load-sheet-item">
              <div class="mini-load-sheet-label">Pax</div>
              <div class="mini-load-sheet-value">${paxCount}</div>
            </div>
            <div class="mini-load-sheet-item">
              <div class="mini-load-sheet-label">Cargo</div>
              <div class="mini-load-sheet-value">${cargoWeight}kg</div>
            </div>
            <div class="mini-load-sheet-item">
        </div>
        <div class="mini-load-sheet-item">
          <div class="mini-load-sheet-label">Fuel</div>
          <div class="mini-load-sheet-value">${fuelWeight}kg</div>
        </div>
        <div class="mini-load-sheet-progress">
          <div class="mini-load-sheet-progress-bar" style="width: ${weightPercentage}%;"></div>
          <div class="mini-load-sheet-value">${totalWeight}kg</div>
        </div>
      </div>
    </div>
  `;
}
    // Deterministic per-flight load sheet generator and store
    function getOrCreateLoadSheet(f) {
      if (!f.loadSheet) {
        const seed = hashCode(`${f.id || f.flight}-${f.from}-${f.to}-${f.aircraft}`);
        const isCargo = airlineIsCargo(f.code);
        const distance = calculateDistance(f.from, f.to);
        const acSize = aircraftData[f.aircraft]?.size || 'regional';

        // Seat/capacity estimates by size
        const paxCap = acSize === 'small' ? 78 : acSize === 'regional' ? 150 : 230;
        const occMin = Math.max(40, Math.min(85, 50 + Math.round(distance))); // clamp-ish by distance
        const occ = seededBetween(occMin, 95, seed % 97);
        const passengers = isCargo ? 0 : Math.min(paxCap, Math.max(0, Math.round(paxCap * (occ / 100))));

        // Cargo estimates (kg)
        const cargoBase = isCargo ? (acSize === 'small' ? 4000 : acSize === 'regional' ? 12000 : 48000)
                                  : (acSize === 'small' ? 800 : acSize === 'regional' ? 1800 : 3500);
        const cargoVar = seededBetween(-Math.round(cargoBase * 0.15), Math.round(cargoBase * 0.15), (seed >> 1) % 97);
        const cargo = Math.max(0, cargoBase + cargoVar);

        // Fuel estimate based on block time
        const minutes = f.minutes || estimateBlock(f.from, f.to);
        const burnPerMin = acSize === 'small' ? 35 : acSize === 'regional' ? 90 : 180; // kg/min rough
        const fuel = Math.max(3000, Math.round(burnPerMin * minutes * 1.2)); // include reserves

        f.loadSheet = { passengers, cargo, fuel };
      }
      return f.loadSheet;
    }

    // Compute current (in-progress) load values based on Ground Ops progress
    function getCurrentLoad(f, ls){
      // If enroute or completed, treat as fully loaded
      if (f.status === 'enroute' || f.status === 'completed') return { pax: ls.passengers, cargo: ls.cargo, fuel: ls.fuel };

      const isCargo = airlineIsCargo(f.code);
      const tasks = f.ops?.tasks || {};
      const pct = (key) => {
        const t = tasks[key];
        if (!t) return 0;
        if (t.status === 'done') return 100;
        if (t.status === 'in_progress') return Math.max(0, Math.min(100, t.progress||0));
        return 0; // pending
      };
      // Map task progress to quantities
      let pax = 0, cargo = 0, fuel = 0;
      if (isCargo) {
        // Cargo ops schema
        cargo = Math.round(ls.cargo * (pct('loading')/100));
        fuel = Math.round(ls.fuel * (pct('fuel')/100));
        pax = 0;
      } else {
        // Pax ops schema
        pax = Math.round(ls.passengers * (pct('boarding')/100));
        cargo = Math.round(ls.cargo * (pct('baggage')/100));
        fuel = Math.round(ls.fuel * (pct('fueling')/100));
      }
      return { pax, cargo, fuel };
    }

    function renderFlights(){
      const body = el('#flightsBody'); const empty = el('#flightsEmpty');
      if(!state.flights.length){ body.innerHTML=''; empty.style.display='block'; return; }
      empty.style.display='none';
      body.innerHTML = state.flights.slice().reverse().map(f=>{
        ensureOps(f);
        return `
        <tr>
          <td><b>${f.code}${f.flight.replace(f.code,'')}</b></td>
          <td>
            ${f.from} → ${f.to}
            <div class="muted" style="font-size:.8rem">${capitalize(f.fromIsland)} → ${capitalize(f.toIsland)}</div>
            <div class="muted" style="font-size:.8rem">Gates: ${isNaN(+f.departureGate) ? f.departureGate : 'G'+f.departureGate} → ${isNaN(+f.arrivalGate) ? f.arrivalGate : 'G'+f.arrivalGate}</div>
          </td>
          <td>${fmtTime(new Date(f.depISO))} → ${fmtTime(new Date(f.arrISO))}
          </td>
          <td>${f.aircraft}</td>
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

      body.querySelectorAll('[data-start]').forEach(b=> b.onclick = ()=>updateFlight(b.dataset.start,'enroute'));
      body.querySelectorAll('[data-complete]').forEach(b=> b.onclick = ()=>updateFlight(b.dataset.complete,'completed'));
      body.querySelectorAll('[data-cancel]').forEach(b=> b.onclick = ()=>removeFlight(b.dataset.cancel));
      body.querySelectorAll('[data-ops]').forEach(b=> b.onclick = ()=> openOps(b.dataset.ops));
    }

    function updateFlight(id, newStatus){
      const f = state.flights.find(x=>x.id===id); if(!f) return;
      
      // Check if all ground ops are complete when trying to start a flight
      if (newStatus === 'enroute') {
        const tpl = getTemplateForFlight(f);
        const allOpsComplete = tpl.every(t => f.ops?.tasks?.[t.key]?.status === 'done');
        
        if (!allOpsComplete) {
          toast('Complete all ground operations before starting the flight');
          return;
        }
      }
      
      f.status = newStatus; 
      save(); 
      renderFlights(); 
      toast(`Flight ${newStatus}`);
    }

    function removeFlight(id){
      state.flights = state.flights.filter(x=>x.id!==id); save(); renderFlights(); toast('Flight removed');
    }

    function renderAirlines(){
      const commercialEl = el('#commercialList');
      const cargoEl = el('#cargoList');

      const renderInfoCard = (name, code) => {
        const color = airlineColors[code] || {};
        const isCargo = airlineIsCargo(code);
        const info = airlineHubsAndRoutes[code] || { hub: null, routes: [], description: '' };
        const hub = info.hub || 'None';
        const routes = (info.routes && info.routes.length)
          ? info.routes.join(', ')
          : 'Various';
        const fleet = (aircraftByAirline[code] || []).map(ac => {
          const acData = aircraftData[ac] || {};
          const typeIcon = acData.size === 'small' ? '✈️' : acData.size === 'regional' ? '🛩️' : '✈️';
          return `<span class="fleet-tag" title="${ac}">${typeIcon} ${ac}</span>`;
        }).join('');

        return `
          <div class="card airline-card">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
              <div class="airline-logo-container" style="background: transparent; border: none;">
                <img src="airline_icons/${code}.png" alt="${name} Logo" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${color.color||'#fff'};font-weight:bold;font-size:0.9rem\'>${code}</div>'">
              </div>
              <div style="min-width:0; flex:1">
                <div style="font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</div>
                <div class="muted" style="font-size:.85rem">ICAO <span class="highlight">•</span> <span class="code">${code}</span> · <span class="tag ${isCargo ? 'tag-cargo' : 'tag-pax'}">${isCargo ? 'Cargo' : 'Passenger'}</span></div>
              </div>
            </div>
            <div id="" class="muted" style="font-size:.9rem; line-height:1.5; margin-bottom:10px;">${info.description || 'No description available.'}</div>
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

      commercialEl.innerHTML = Object.entries(commercialAirlines)
        .map(([name, code]) => renderInfoCard(name, code)).join('');

      cargoEl.innerHTML = Object.entries(cargoAirlines)
        .map(([name, code]) => renderInfoCard(name, code)).join('');

      // Keep modal list for switching from other UI (Switch button)
      renderModalAirlines();
    }
    
    function renderModalAirlines() {
      const commercialEl = el('#modalCommercialAirlines');
      const cargoEl = el('#modalCargoAirlines');
      
      commercialEl.innerHTML = Object.entries(commercialAirlines).map(([name,code]) => {
        return `<div class="airline-pill" data-code="${code}" data-name="${name}">
          <div class="airline-logo-container" style="background: transparent; border: none;">
            <img src="airline_icons/${code}.png" alt="${name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.textContent='${code}'; this.remove();" />
          </div>
          <div>${name} <span class="muted">${code}</span></div>
        </div>`;
      }).join('');
      
      cargoEl.innerHTML = Object.entries(cargoAirlines).map(([name,code]) => {
        return `<div class="airline-pill" data-code="${code}" data-name="${name}">
          <div class="airline-logo-container" style="background: transparent; border: none;">
            <img src="airline_icons/${code}.png" alt="${name}" class="airline-logo-img" onerror="this.onerror=null; this.parentElement.textContent='${code}'; this.remove();" />
          </div>
          <div>${name} <span class="muted">${code}</span></div>
        </div>`;
      }).join('');
      
      // Add click handlers for airline selection
      document.querySelectorAll('#modalCommercialAirlines .airline-pill, #modalCargoAirlines .airline-pill').forEach(el => {
        el.onclick = () => {
          const code = el.dataset.code;
          const name = el.dataset.name;
          state.airline = { code, name };
          state.offers = []; // Clear existing offers to force refresh
          state.lastGenerated = 0; // Reset the generation timestamp
          save();
          closeAirlineModal();
          renderSelectedAirline();
          renderOffers(); // This will generate new offers for the selected airline
          toast(`Selected ${name}`);
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

    function capitalize(s){ return s[0].toUpperCase()+s.slice(1); }

    function formatTimeRemaining(ms) {
      const minutes = Math.floor(ms / 60000);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${minutes}m`;
    }

    function updateOfferTimes() {
      const now = new Date();
      document.querySelectorAll('.offer-card').forEach(card => {
        const depTime = new Date(card.dataset.departure);
        const timeRemaining = depTime - now;
        const timeElement = card.querySelector('.time-until');
        
        if (!timeElement) return;
        
        if (timeRemaining > 0) {
          timeElement.textContent = `Departs in ${formatTimeRemaining(timeRemaining)}`;
          timeElement.style.color = timeRemaining < 300000 ? '#ef4444' : 'var(--muted)';
        } else {
          timeElement.textContent = 'Departed';
          timeElement.style.color = '#ef4444';
        }
      });
    }

    function uiTick(){
      renderSelectedAirline();
      renderAirlines();
      renderOffers();
      renderFlights();
      updateOfferTimes();
    }

    // Tab switching function
    function switchTab(tabId) {
      // Update active tab
      document.querySelectorAll('.tab').forEach(tab => {
        if (tab.dataset.tab === tabId) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Show corresponding content
      document.querySelectorAll('.content').forEach(content => {
        if (content.id === `tab-${tabId}`) {
          content.style.display = 'block';
          // Load content if needed
          if (tabId === 'flights') renderFlights();
          if (tabId === 'airlines') renderAirlines();
        } else {
          content.style.display = 'none';
        }
      });
    }

    // --- Touch Event Helpers ---
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

// Add touch feedback class
const addTouchFeedback = (element) => {
  if (!isTouchDevice()) return;
  
  const handleTouchStart = () => {
    element.classList.add('touch-active');
  };
  
  const handleTouchEnd = () => {
    element.classList.remove('touch-active');
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  element.addEventListener('touchcancel', handleTouchEnd, { passive: true });
};

// Prevent double-tap zoom on buttons
const preventDoubleTapZoom = () => {
  if (!isTouchDevice()) return;
  
  let lastTap = 0;
  document.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault();
      e.target.click();
    }
    lastTap = currentTime;
  }, { passive: false });
};

// --- Events ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize touch feedback for buttons
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
    preventDoubleTapZoom();
    
    // Add touch feedback to all interactive elements
    document.querySelectorAll('.btn, .tab, .airline-pill, .chip').forEach(el => {
      addTouchFeedback(el);
    });
  }
  
  // Initialize tab switching
  document.querySelectorAll('.tab').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
      });
      
      // Airlines tab is informational now; disable click-to-select in this tab
      const tabAirlines = document.querySelector('#tab-airlines');
      if (tabAirlines) {
        tabAirlines.addEventListener('click', (e) => {
          // Intentionally no selection behavior
        });
      }
      
      // Event delegation for airline pill clicks in Airlines tab
      document.querySelector('#tab-airlines').addEventListener('click', (e) => {
        // Intentionally no selection behavior
      });
      
      // Other event listeners
      const bannerChoose = el('#bannerChoose');
      const closeModal = el('#closeModal');
      const openAirlines = el('#openAirlines');
      
      if (bannerChoose) bannerChoose.onclick = openAirlineModal;
      if (closeModal) closeModal.onclick = closeAirlineModal;
      if (openAirlines) openAirlines.onclick = openAirlineModal;
      
      // Initialize the default tab
      switchTab('offers');
    });

    // Event listeners for filters and search
    const refreshBtn = el('#refreshOffers');
    if (refreshBtn) refreshBtn.onclick = ()=>{ state.lastGenerated = 0; renderOffers(); toast('Offers refreshed'); };
    
    const searchAirport = el('#searchAirport');
    if (searchAirport) {
      searchAirport.addEventListener('input', ()=> renderOffers());
      const clearSearch = el('#clearSearch');
      if (clearSearch) clearSearch.onclick = ()=>{ searchAirport.value=''; renderOffers(); };
    }
    
    // Use event delegation for filter checkboxes since they might be moved
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('flt-type')) {
        renderOffers();
      }
    });
    
    // Offer search functionality
    el('#searchOffers').addEventListener('input', (e) => {
      filterOffers(e.target.value.trim().toLowerCase());
    });
    
    el('#clearOfferSearch').onclick = () => {
      el('#searchOffers').value = '';
      filterOffers('');
    };


    // Handle viewport height on mobile
const setViewportHeight = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// --- Init ---
uiTick();

// Update viewport height on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
setViewportHeight();

// Initialize with or without airline
if(!state.airline){
      // gentle nudge to choose airline
      el('#airlineBanner').style.display='flex';
      setTimeout(openAirlineModal, 300);
    }