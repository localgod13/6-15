const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 3000;

const peerServer = ExpressPeerServer(app, {
  path: '/myapp',
  allow_discovery: true
});

app.use('/myapp', peerServer);
app.get('/', (_, res) => res.send('PeerJS Server is running.'));

app.listen(PORT, () => {
  console.log(`PeerJS server listening on ${PORT}`);
}); 