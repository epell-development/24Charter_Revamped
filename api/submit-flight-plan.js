let submittedPlans = []; // In-memory storage (ephemeral in serverless)

module.exports = (req, res) => {
  const plan = req.body;
  if (!plan.callsign || !plan.aircraft || !plan.departing || !plan.arriving) {
    return res.status(400).json({ error: 'Invalid flight plan' });
  }

  // Store flight plan
  submittedPlans.push({
    robloxName: plan.robloxName || 'Player',
    callsign: plan.callsign,
    realcallsign: plan.callsign,
    aircraft: plan.aircraft,
    flightrules: plan.flightrules || 'IFR',
    departing: plan.departing,
    arriving: plan.arriving,
    route: plan.route || 'GPS DIRECT',
    flightlevel: plan.flightlevel || '030'
  });

  // Simulate ATC 24 validation (replace with actual bot submission)
  setTimeout(() => {
    // Broadcast to flight-plans SSE clients
    const event = { t: 'FLIGHT_PLAN', d: submittedPlans[submittedPlans.length - 1] };
    require('./flight-plans').clients.forEach(client => {
      client.write(`data: ${JSON.stringify(event)}\n\n`);
    });
  }, 1000); // Simulate delay

  res.json({ success: true });
};
