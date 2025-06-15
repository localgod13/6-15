const { ExpressPeerServer } = require('peer');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const port = args.find(arg => arg.startsWith('--port='))?.split('=')[1] || process.env.PORT || 9000;
const pathPrefix = args.find(arg => arg.startsWith('--path='))?.split('=')[1] || '/myapp';

const app = express();

// Enable CORS
app.use(cors());

// Create HTTP server
const server = require('http').createServer(app);

// Configure PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: pathPrefix,
  proxied: true,
  ssl: {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT
  },
  // Configure STUN/TURN servers
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // Add your TURN server configuration here if needed
      // {
      //   urls: 'turn:your-turn-server.com:3478',
      //   username: 'username',
      //   credential: 'password'
      // }
    ]
  }
});

// Use PeerJS server
app.use(pathPrefix, peerServer);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Error handling
peerServer.on('error', (err) => {
  console.error('PeerJS server error:', err);
});

// Start server
server.listen(port, () => {
  console.log(`PeerJS server running on port ${port} with path ${pathPrefix}`);
}); 