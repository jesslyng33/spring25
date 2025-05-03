const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/chatdb');
}
main().catch(err => console.log(err));

const messageSchema = new mongoose.Schema({
  name: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

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

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.delete('/messages', async (req, res) => {
  try {
    await Message.deleteMany({});
    io.emit('clear messages');
    res.status(200).json({ message: 'All messages deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete messages' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', async (name) => {
    users[socket.id] = name;
    console.log(`Registered user: ${name}`);
    io.emit('user list', Object.values(users));
  
    const history = await Message.find().sort({ timestamp: 1 }).limit(100);
    history.forEach((msg) => {
      socket.emit('chat message', `${msg.name}: ${msg.text}`);
    });
  });

  socket.on('chat message', async (msg) => {
    io.emit('chat message', msg);
  
    const [name, ...textParts] = msg.split(':');
    const text = textParts.join(':').trim();
  
    const newMessage = new Message({
      name: name.trim(),
      text: text,
    });
  
    await newMessage.save();
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