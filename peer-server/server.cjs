// trigger redeploy
const express = require('express');
const { ExpressPeerServer } = require('peerjs'); // <-- This is the correct way
const cors = require('cors');

const app = express();
app.use(cors());

const server = app.listen(process.env.PORT || 10000, () => {
  console.log(`Server listening on port ${process.env.PORT || 10000}`);
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/myapp'
});

app.use('/myapp', peerServer);
