const form = document.getElementById("flight-form");
const generateBtn = document.getElementById("generate-flight-plan");
const resultsDiv = document.getElementById("results");

const ingameCallsignInput = document.getElementById("ingame-callsign");
const callsignInput = document.getElementById("callsign");

// Function to get canonical callsign (keeping for compatibility)
function getCanonicalCallsign(input) {
    return input; // Simply return input as is
}

// Function to get ingame callsign (keeping for compatibility)
function getIngameCallsign(input) {
    return input; // Simply return input as is
}

// Function to generate random flight data
function generateRandomFlight() {
    // Airline fleets (provided)
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

    // Aircraft size and range (map units)
    const aircraftData = {
      "ATR72": { size: "small", range: 15 },
      "C208F": { size: "small", range: 12 },
      "CRJ700": { size: "small", range: 20 },
      "A220": { size: "regional", range: 35 },
      "A320": { size: "regional", range: 30 },
      "E190": { size: "regional", range: 28 },
      "B717": { size: "regional", range: 25 },
      "B727": { size: "regional", range: 30 },
      "B737": { size: "regional", range: 32 },
      "B737BCF": { size: "regional", range: 30 },
      "B727F": { size: "regional", range: 30 },
      "CONC": { size: "regional", range: 45 },
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

    // Airport specs (type + coordinates) keyed by ICAO
    const airportSpecs = {
      "IRFD": { type: "major", location: "rockford island", x: 50.33, y: 57.59 },
      "IMLR": { type: "major", location: "rockford island", x: 38.67, y: 52.92 },
      "IBLT": { type: "small", location: "rockford island", x: 43.83, y: 53.45 },
      "ISAU": { type: "regional", location: "sauthemptona island", x: 18.17, y: 62.28 },
      "IGRV": { type: "major", location: "grindavik island", x: 20.67, y: 39.95 },
      "ITKO": { type: "major", location: "orenji island", x: 47.00, y: 17.25 },
      "IDCS": { type: "small", location: "orenji island", x: 48.17, y: 8.79 },
      "IPPH": { type: "major", location: "perth island", x: 66.33, y: 27.25 },
      "ILKL": { type: "small", location: "perth island", x: 70.50, y: 28.29 },
      "IZOL": { type: "major", location: "izolirani island", x: 84.67, y: 44.25 },
      "IJAF": { type: "small", location: "izolirani island", x: 87.67, y: 41.62 },
      "ILAR": { type: "major", location: "cyprus island", x: 70.67, y: 65.92 },
      "IPAP": { type: "major", location: "cyprus island", x: 77.17, y: 67.62 },
      "IHEN": { type: "small", location: "cyprus island", x: 65.17, y: 73.45 },
      "IBTH": { type: "small", location: "saint barthelemy", x: 57.83, y: 39.09 }
    };

    // Helper: Euclidean distance in map units
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    // Airport size compatibility
    const typeAllowance = {
        // Which AIRPORT TYPES each AIRCRAFT SIZE can use
        // small aircraft can use any airport, regional can use regional/major, major can use major only
        small: new Set(["small", "regional", "major"]),
        regional: new Set(["regional", "major"]),
        major: new Set(["major"])
    };

    // Build a list of valid airport ICAOs present in airportSpecs
    const airportICAOs = Object.keys(airportSpecs);

    // Airline to in-game analog mapping
    const airlineAnalogs = {
        "DAL": "Belta",
        "NKS": "Sprit Wings",
        "BAW": "Speedbird",
        "SAS": "Scandialien",
        "AAL": "Americano",
        "DLH": "Lifthansa",
        "UPS": "SUS",
        "FDX": "Tedex"
    };

    // Pick random airline
    const airlines = Object.keys(aircraftByAirline);
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = Math.floor(100 + Math.random() * 900);
    const callsign = `${airline}${flightNumber}`;
    const airlineAnalog = airlineAnalogs[airline] || airline; // Fallback to original if no analog
    const ingameCallsign = `${airlineAnalog}-[Insert Callsign #]`;

    // Try aircraft in randomized order until we find a valid route
    const shuffledFleet = [...aircraftByAirline[airline]].sort(() => Math.random() - 0.5);
    let selectedAircraft = null;
    let departureICAO = null;
    let arrivalICAO = null;

    for (const ac of shuffledFleet) {
        const spec = aircraftData[ac];
        if (!spec) continue;
        const allowed = typeAllowance[spec.size];
        // Candidate departure airports compatible with aircraft size
        const depCandidates = airportICAOs.filter(icao => allowed.has(airportSpecs[icao].type));
        if (depCandidates.length === 0) continue;

        // Try up to N attempts to find a pair within range
        for (let attempt = 0; attempt < 30; attempt++) {
            const depICAO = depCandidates[Math.floor(Math.random() * depCandidates.length)];
            const dep = airportSpecs[depICAO];
            // Arrival must be different and compatible type
            const arrCandidates = airportICAOs.filter(icao => icao !== depICAO && allowed.has(airportSpecs[icao].type));
            if (arrCandidates.length === 0) break;
            const arrICAO = arrCandidates[Math.floor(Math.random() * arrCandidates.length)];
            const arr = airportSpecs[arrICAO];
            const d = dist(dep, arr);
            if (d <= spec.range) {
                selectedAircraft = ac;
                // We already have the ICAO codes
                departureICAO = depICAO;
                arrivalICAO = arrICAO;
                break;
            }
        }
        if (selectedAircraft) break;
    }

    // If we still didn't find a valid combo, fall back to a small aircraft universally accepted
    if (!selectedAircraft) {
        const fallbackAirline = airline;
        const smallFromAirline = aircraftByAirline[fallbackAirline].find(a => aircraftData[a] && aircraftData[a].size === 'small');
        selectedAircraft = smallFromAirline || 'CRJ700';
        // Pick two small-compatible airports
        const allowed = typeAllowance[aircraftData[selectedAircraft]?.size || 'small'];
        const comps = airportICAOs.filter(icao => allowed.has(airportSpecs[icao].type));
        if (comps.length >= 2) {
            const i1 = Math.floor(Math.random() * comps.length);
            let i2 = Math.floor(Math.random() * comps.length);
            if (i2 === i1) i2 = (i2 + 1) % comps.length;
            departureICAO = comps[i1];
            arrivalICAO = comps[i2];
        } else {
            // Absolute fallback to any two
            const any = airportICAOs;
            departureICAO = any[0];
            arrivalICAO = any[1] || any[0];
        }
    }

    // Random flight level and rules
    const flightLevels = ['020', '030', '035', '040', '045', '050', '055', '060'];
    const randomFlightLevel = flightLevels[Math.floor(Math.random() * flightLevels.length)];

    // Determine flight rules based on island location
    const departureLocation = airportSpecs[departureICAO].location;
    const arrivalLocation = airportSpecs[arrivalICAO].location;
    const flightRules = (departureLocation === arrivalLocation) ? 'VFR' : 'IFR';

    // Fill in the form
    document.getElementById('callsign').value = callsign;
    document.getElementById('ingame-callsign').value = ingameCallsign;
    document.getElementById('aircraft').value = selectedAircraft;
    document.getElementById('departure').value = departureICAO;
    document.getElementById('arrival').value = arrivalICAO;
    document.getElementById('flight-level').value = randomFlightLevel;

    // Set flight rules button
    if (flightRules === 'IFR') {
        ifrButton.click();
    } else {
        vfrButton.click();
    }

    // Trigger the route generation after a short delay to ensure the form is updated
    setTimeout(() => {
        document.getElementById('generate-flight-plan').click();
    }, 100);
}

// Add event listener for random flight button
document.getElementById('random-flight').addEventListener('click', generateRandomFlight);

// Form submission handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const aircraft = document.getElementById('aircraft').value.toUpperCase();
    const callsign = document.getElementById('callsign').value;
    const ingameCallsign = document.getElementById('ingame-callsign').value;
    const departure = document.getElementById('departure').value.toUpperCase();
    const arrival = document.getElementById('arrival').value.toUpperCase();
    const flightLevel = document.getElementById('flight-level').value || 'N/A';
    const route = document.getElementById('route').value || 'DIRECT';
    
    // Find the departure and arrival airports (check both icao and fullName)
    const findAirport = (query) => {
        // First try to find by ICAO (exact match)
        let airport = airports.find(a => a.icao === query);
        
        // If not found by ICAO, try to find by fullName (case-insensitive)
        if (!airport) {
            const queryLower = query.toLowerCase();
            airport = airports.find(a => a.fullName.toLowerCase() === queryLower);
        }
        
        return airport;
    };
    
    const departureAirport = findAirport(departure);
    const arrivalAirport = findAirport(arrival);
    
    // Validate airports
    if (!departureAirport || !arrivalAirport) {
        alert('Please enter valid departure and arrival airports (ICAO code or full name)');
        return;
    }
    
    // Get flight rules
    const flightRules = document.querySelector('.flight-rule-button.selected')?.textContent || 'VFR';
    
    // Build the Discord command with full airport names
    const discordMessage = `/createflightplan ingamecallsign:${ingameCallsign} callsign:${callsign} aircraft:${aircraft} flightrules:${flightRules} departing:${departureAirport.fullName} arriving:${arrivalAirport.fullName} flightlevel:${flightLevel} route:${route}`;
    
    // Mark flight as planned and update UI
    isFlightPlanned = true;
    if (typeof drawRouteLine === 'function') {
        drawRouteLine(false); // Draw solid line for planned flight
    }
    
    // Update chart links with departure and arrival ICAO codes
    updateChartLinks(departureAirport.icao, arrivalAirport.icao);
    
    // Create formatted notes text including ingame callsign and callsign
    const formattedNotes = `${callsign}/${ingameCallsign} | ${aircraft}
-------------------------

FLPN TYPE: ${flightRules}

ROUTE: ${departure} / ${route} / ${arrival}
`;

    // Display results with copy buttons including ingame callsign
    resultsDiv.innerHTML = `
        <p><strong>In Game Callsign:</strong> ${ingameCallsign}</p>
        <p><strong>Callsign:</strong> ${callsign}</p>
        <p><strong>Aircraft:</strong> ${aircraft}</p>
        <p><strong>Flight Rules:</strong> ${flightRules}</p>
        <p><strong>Flight Level:</strong> ${flightLevel}</p>
        <p><strong>Route:</strong> ${departure} / ${route} / ${arrival}</p>
        <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
            <button id="copy-notes">Copy formatted for notes</button>
            <span id="copy-side-text-notes" style="font-size: 0.9em; color: green;"></span>
            <button id="copy-discord">Copy formatted for Discord</button>
            <span id="copy-side-text" style="font-size: 0.9em; color: green;"></span>
        </div>
    `;


    // Add click handler for the notes copy button
    document.getElementById("copy-notes").addEventListener("click", () => {
        navigator.clipboard.writeText(formattedNotes).then(() => {
            const btn = document.getElementById("copy-notes");
            const originalText = btn.textContent;
            btn.textContent = "Copied!";
            
            // Get the side text element
            const sideText = document.getElementById("copy-side-text-notes");
            sideText.textContent = "You can now copy this into your note app of choice!";
            
            setTimeout(() => {
                sideText.textContent = "";
                if (btn.textContent === "Copied!") {
                    btn.textContent = originalText;
                }
            }, 5000);
        });
    });

    // Add click handler for the Discord copy button
    document.getElementById("copy-discord").addEventListener("click", () => {
        navigator.clipboard.writeText(discordMessage).then(() => {
            const btn = document.getElementById("copy-discord");
            btn.textContent = "Copied!";
            // Get the side text element
            const sideText = document.getElementById("copy-side-text");
            sideText.textContent = "You may paste your flight directly into #flight-plans!";
            setTimeout(() => {
                sideText.textContent = "";
                if (btn.textContent === "Copied!") {
                    btn.textContent = "Copy formatted for Discord";
                }
            }, 5000);
        });
    });
});

generateBtn.addEventListener("click", () => {
    const departure = document.getElementById("departure").value.trim().toUpperCase();
    const arrival = document.getElementById("arrival").value.trim().toUpperCase();
    
    // Calculate waypoint count based on airport proximity
    const waypointCount = calculateWaypointCount(departure, arrival);
    
    // Update the UI to show the calculated waypoint count
    document.getElementById("waypoint-count").value = waypointCount;

    if (!departure || !arrival) {
        alert("Please enter both departure and arrival airports first");
        return;
    }

    // Check if departure and arrival exist in graph
    if (!graphNodes[departure] || !graphNodes[arrival]) {
        alert("Invalid departure or arrival airport");
        return;
    }

    // Find path using A*
    let path = aStar(departure, arrival);

    if (path.length === 0) {
        alert("No route found between the selected airports");
        return;
    }

    // Remove departure, arrival, and any other airports from intermediate waypoints
    const airportIds = new Set([...mapAirports.map(ap => ap.id), departure, arrival]);
    let intermediateWaypoints = path.filter(id => !airportIds.has(id));

    // Adjust intermediate waypoints to match waypointCount
    if (intermediateWaypoints.length > waypointCount) {
        // Prune waypoints evenly
        const step = intermediateWaypoints.length / waypointCount;
        const pruned = [];
        for (let i = 0; i < waypointCount; i++) {
            pruned.push(intermediateWaypoints[Math.floor(i * step)]);
        }
        intermediateWaypoints = pruned;
    } else if (intermediateWaypoints.length < waypointCount) {
        // Add additional waypoints near the path to reach waypointCount
        const needed = waypointCount - intermediateWaypoints.length;
        // Filter out all airports from candidates, only allow waypoints and VORs
        const candidates = Object.keys(graphNodes).filter(id => 
            id !== departure && 
            id !== arrival && 
            !intermediateWaypoints.includes(id) &&
            !airportIds.has(id) // Exclude airports
        );

        // If we don't have enough candidates, just return what we have
        if (candidates.length === 0) {
            console.log("No valid non-airport waypoints available to add");
            return;
        }

        // Simple heuristic: add closest candidates to the path nodes
        const added = [];
        for (let i = 0; i < needed && candidates.length > 0; i++) {
            let bestCandidate = null;
            let bestDist = Infinity;
            
            // Calculate distance to path for each candidate
            candidates.forEach(id => {
                const node = graphNodes[id];
                let minDistToPath = Infinity;
                
                // Calculate minimum distance to any point in the current path
                const allPoints = [departure, ...intermediateWaypoints, arrival];
                for (let j = 0; j < allPoints.length - 1; j++) {
                    const start = graphNodes[allPoints[j]];
                    const end = graphNodes[allPoints[j + 1]];
                    if (start && end) {
                        const dist = distanceToLine(
                            node.xPercent, node.yPercent,
                            start.xPercent, start.yPercent,
                            end.xPercent, end.yPercent
                        );
                        minDistToPath = Math.min(minDistToPath, dist);
                    }
                }
                
                if (minDistToPath < bestDist) {
                    bestDist = minDistToPath;
                    bestCandidate = id;
                }
            });
            
            if (bestCandidate) {
                added.push(bestCandidate);
                // Add to intermediate waypoints so it's considered in next iteration
                intermediateWaypoints.push(bestCandidate);
                // Remove from candidates
                const index = candidates.indexOf(bestCandidate);
                if (index > -1) candidates.splice(index, 1);
            } else {
                // If no good candidate found, break the loop
                break;
            }
        }
    }

    // Sort intermediate waypoints by distance from departure to ensure realistic order
    const departureNode = graphNodes[departure];
    intermediateWaypoints.sort((a, b) => {
        const distA = euclideanDistance(graphNodes[a], departureNode);
        const distB = euclideanDistance(graphNodes[b], departureNode);
        return distA - distB;
    });

    document.getElementById("route").value = intermediateWaypoints.join(" ");

    isFlightPlanned = false;
    drawRouteLine(true);

    // Trigger input event to update the route display
    document.getElementById("route").dispatchEvent(new Event('input'));
});

// Flight rule buttons functionality
const vfrButton = document.getElementById("vfrButton");
const ifrButton = document.getElementById("ifrButton");

// Set initial selection (IFR by default)
if (vfrButton && ifrButton) {
    ifrButton.classList.add("selected");
    
    // Add click event listeners
    vfrButton.addEventListener("click", () => {
        vfrButton.classList.add("selected");
        ifrButton.classList.remove("selected");
    });
    
    ifrButton.addEventListener("click", () => {
        ifrButton.classList.add("selected");
        vfrButton.classList.remove("selected");
    });
}

// Auto-fill form button handler
const autoFillButton = document.getElementById("auto-fill-form");
if (autoFillButton) {
    autoFillButton.addEventListener("click", () => {
        document.getElementById("callsign").value = "JBU1234";
        document.getElementById("aircraft").value = "A320";
        document.getElementById("departure").value = "IRFD";
        document.getElementById("arrival").value = "IPPH";
        document.getElementById("route").value = "HONDA";
        
        // Update flight rules UI
        const vfrButton = document.getElementById("vfrButton");
        const ifrButton = document.getElementById("ifrButton");
        if (vfrButton && ifrButton) {
            vfrButton.classList.add("selected");
            ifrButton.classList.remove("selected");
        }
        
        // Render waypoints and route if functions exist
        if (typeof renderWaypoints === 'function') {
            renderWaypoints();
        }
        if (typeof drawRouteLine === 'function') {
            drawRouteLine();
        }
    });
}

// Reset form button functionality
document.getElementById("reset-form").addEventListener("click", (e) => {
    e.preventDefault();
    
    // Show confirmation modal
    showModal("Are you sure you want to reset the flight plan? This will clear all fields and reset the map.", () => {
        // Reset the form
        const flightForm = document.getElementById("flight-form");
        if (flightForm) {
            flightForm.reset();
        }
        
        // Clear specific fields that might not be reset by the form reset
        const flightPlanType = document.getElementById("flight-plan-type");
        if (flightPlanType) {
            flightPlanType.textContent = "";
        }
        const autofillPrompt = document.getElementById("autofill-prompt");
        if (autofillPrompt) {
            autofillPrompt.textContent = "";
        }
        
        // Reset the results display
        const resultsDiv = document.getElementById("results");
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <p style="text-align: center;">Your flight plan will be displayed here after you submit it.</p>
                <p>Make sure you have entered <span style="font-weight: bold;">valid callsigns</span>. If not, you could get in trouble if you copy paste!</p>
            `;
        }
        
        // Clear only user-added elements (route lines and waypoint texts)
        const waypointTexts = document.querySelectorAll(".icao-text");
        waypointTexts.forEach(text => text.remove());
        
        // Clear the route line
        const svg = document.getElementById("route-line-svg");
        if (svg) {
            svg.innerHTML = '';
        }
        
        // Clear currentPolyline variable
        currentPolyline = null;
        
        // Explicitly clear route, departure, and arrival inputs
        const routeInput = document.getElementById("route");
        if (routeInput) {
            routeInput.value = "";
        }
        const departureInput = document.getElementById("departure");
        if (departureInput) {
            departureInput.value = "";
        }
        const arrivalInput = document.getElementById("arrival");
        if (arrivalInput) {
            arrivalInput.value = "";
        }
        
        // Re-render the waypoints to restore them
        renderWaypoints();
        
        // Reset flight plan state
        flightRules = "";
        isFlightPlanned = false;
        
        // Redraw the route line as dotted
        drawRouteLine(true);
        
        console.log("Flight plan has been reset");
    });
});

// Add click handler for chart viewer button
document.addEventListener('DOMContentLoaded', () => {
    const chartViewerBtn = document.querySelector('a[aria-label="Sheep\'s Janky Chart Viewer"]');
    if (chartViewerBtn) {
        chartViewerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal("Sheep's Janky Chart Viewer is still in development! Please use our chart providers linked at the bottom for your convenience.");
        });
    }

    // Add click handler for roadmap button
    const roadmapBtn = document.querySelector('a[aria-label="Roadmap"]');
    if (roadmapBtn) {
        roadmapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRoadmapModal();
        });
    }
    
    // Add click handler for clear waypoints button
    const clearWaypointsBtn = document.getElementById('clear-waypoints');
    if (clearWaypointsBtn) {
        clearWaypointsBtn.addEventListener('click', () => {
            // Remove all ICAO text elements and clear the visibleLabels Set
            const existingTexts = document.querySelectorAll(".icao-text");
            existingTexts.forEach(text => text.remove());
            // Clear the visibleLabels Set to prevent waypoints from reappearing on resize
            if (typeof visibleLabels !== 'undefined') {
                visibleLabels.clear();
            }
        });
    }

    // Call renderWaypoints on initial page load to show waypoints immediately
    if (typeof renderWaypoints === 'function') {
        renderWaypoints();
    }

    // On initial load, if departure and arrival inputs have values, draw route line
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');
    if (departureInput && arrivalInput) {
        if (departureInput.value.trim() !== '' && arrivalInput.value.trim() !== '') {
            if (typeof drawRouteLine === 'function') {
                drawRouteLine(true);
            }
        }
        // Add event listeners to update route line immediately on input change
        departureInput.addEventListener('input', () => {
            if (typeof drawRouteLine === 'function') {
                drawRouteLine(true);
            }
        });
        arrivalInput.addEventListener('input', () => {
            if (typeof drawRouteLine === 'function') {
                drawRouteLine(true);
            }
        });
    }

    // Add event listeners for chart buttons to update chart links
    const btn24Charts = document.getElementById('btn-24charts');
    const btnQuickCharts = document.getElementById('btn-quickcharts');
    const btnDirectUrls = document.getElementById('btn-direct-urls');

    if (btn24Charts) {
        btn24Charts.addEventListener('click', () => {
            if (typeof updateChartLinks === 'function') {
                const departure = document.getElementById('departure').value.toUpperCase();
                const arrival = document.getElementById('arrival').value.toUpperCase();
                updateChartLinks(departure, arrival, '24charts');
            }
        });
    }

    if (btnQuickCharts) {
        btnQuickCharts.addEventListener('click', () => {
            if (typeof updateChartLinks === 'function') {
                const departure = document.getElementById('departure').value.toUpperCase();
                const arrival = document.getElementById('arrival').value.toUpperCase();
                updateChartLinks(departure, arrival, 'quickcharts');
            }
        });
    }

    if (btnDirectUrls) {
        btnDirectUrls.addEventListener('click', () => {
            if (typeof updateChartLinks === 'function') {
                const departure = document.getElementById('departure').value.toUpperCase();
                const arrival = document.getElementById('arrival').value.toUpperCase();
                updateChartLinks(departure, arrival, 'direct-urls');
            }
        });
    }

    // Add event listener on route input to update route line on manual change
    const routeInput = document.getElementById('route');
    if (routeInput) {
        routeInput.addEventListener('input', () => {
            if (typeof drawRouteLine === 'function') {
                drawRouteLine(true);
            }
        });
    }
});
