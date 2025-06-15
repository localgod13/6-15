const express = require('express');
const { ExpressPeerServer } = require('peerjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 443;

// Enable CORS for all routes
app.use(cors());

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${PORT}`);
});

const peerServer = ExpressPeerServer(server, {
  path: '/myapp',
  allow_discovery: true,
  proxied: true,
  debug: 3
});

app.use('/myapp', peerServer);

// Add a health check endpoint
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});
