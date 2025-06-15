const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected players
const players = new Map();

// Generate unique player ID
function generatePlayerId() {
  return Math.random().toString(36).substring(2, 15);
}

// Broadcast to all clients except sender
function broadcast(message, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Send player list to all clients
function broadcastPlayerList() {
  const playerList = Array.from(players.entries()).map(([id, data]) => ({
    id,
    ...data
  }));
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'playerList',
        players: playerList
      }));
    }
  });
}

wss.on('connection', (ws) => {
  const playerId = generatePlayerId();
  console.log(`Player ${playerId} connected`);

  // Store player data
  players.set(playerId, {
    position: { x: 0, y: 0 },
    lastUpdate: Date.now()
  });

  // Send initial player ID
  ws.send(JSON.stringify({
    type: 'init',
    playerId
  }));

  // Broadcast new player to others
  broadcast({
    type: 'playerJoined',
    playerId
  }, ws);

  // Send current player list
  broadcastPlayerList();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'join':
          // Update player data
          players.set(playerId, {
            position: data.position || { x: 0, y: 0 },
            lastUpdate: Date.now()
          });
          broadcastPlayerList();
          break;

        case 'update':
          // Update player position
          if (players.has(playerId)) {
            const playerData = players.get(playerId);
            playerData.position = data.position;
            playerData.lastUpdate = Date.now();
            players.set(playerId, playerData);

            // Broadcast position update to other players
            broadcast({
              type: 'playerUpdate',
              playerId,
              position: data.position
            }, ws);
          }
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Player ${playerId} disconnected`);
    players.delete(playerId);
    broadcast({
      type: 'playerLeft',
      playerId
    });
    broadcastPlayerList();
  });
});

// Periodically broadcast player list (every 5 seconds)
setInterval(broadcastPlayerList, 5000);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
}); 