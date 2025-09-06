const WebSocket = require('ws');

let ws = null;
const clients = new Set();
let flightPlans = []; // Cache flight plans

function connectWebSocket() {
  ws = new WebSocket('wss://24data.ptfs.app/wss', { origin: '' });

  ws.on('open', () => {
    console.log('Connected to 24data WebSocket');
  });

  ws.on('message', (data) => {
    const event = JSON.parse(data);
    if (event.t === 'FLIGHT_PLAN') {
      flightPlans.push(event.d);
      if (flightPlans.length > 100) flightPlans.shift(); // Limit cache size
      // Broadcast to all SSE clients
      clients.forEach(client => {
        client.write(`data: ${JSON.stringify(event)}\n\n`);
      });
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    setTimeout(connectWebSocket, 5000); // Reconnect after 5s
  });

  ws.on('close', () => {
    console.log('WebSocket closed, reconnecting...');
    setTimeout(connectWebSocket, 5000);
  });
}

// Initialize WebSocket connection
connectWebSocket();

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add client to set
  clients.add(res);

  // Send initial flight plans
  flightPlans.forEach(fp => {
    res.write(`data: ${JSON.stringify({ t: 'FLIGHT_PLAN', d: fp })}\n\n`);
  });

  // Remove client on close
  req.on('close', () => {
    clients.delete(res);
  });
};
