const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = {};

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (name) => {
    users[socket.id] = name;
    console.log(`Registered user: ${name}`);
    io.emit('user list', Object.values(users));
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});