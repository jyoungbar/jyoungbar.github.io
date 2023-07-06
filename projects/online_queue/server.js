//Socket.io server
const express = require('express')
const PORT = 3000
const app = express()
var server = require('http').Server(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let count = 0;
io.on('connection', (socket) => {
  count++;
  console.log(`${count} user(s) connected`);
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});

