const express = require('express');
const { ExpressPeerServer } = require('peerjs');

const app = express();
const PORT = process.env.PORT || 443;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
});

const peerServer = ExpressPeerServer(server, {
    path: '/myapp',
    allow_discovery: true,
    proxied: true
});

app.use('/myapp', peerServer);
