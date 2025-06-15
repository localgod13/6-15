const express = require('express');
const http = require('http');
const { createPeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

// Create PeerJS server
const peerServer = createPeerServer({
  port: PORT,
  path: '/myapp',
  proxied: true,
  allow_discovery: true,
});

// Mount PeerJS server middleware
app.use('/myapp', peerServer);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`PeerJS server running on 0.0.0.0:${PORT}`);
});
