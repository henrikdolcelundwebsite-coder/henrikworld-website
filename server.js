const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MESSAGE_FILE = path.join(__dirname, 'messages.json');

// Serve static frontend files
app.use(express.static(__dirname));
app.use(express.json());

// GET endpoint: get all messages
app.get('/messages', (req, res) => {
  if (fs.existsSync(MESSAGE_FILE)) {
    const data = fs.readFileSync(MESSAGE_FILE);
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

// POST endpoint: add a new message
app.post('/messages', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Missing fields' });

  let messages = [];
  if (fs.existsSync(MESSAGE_FILE)) {
    messages = JSON.parse(fs.readFileSync(MESSAGE_FILE));
  }

  const newMessage = { name, message, time: new Date().toISOString() };
  messages.push(newMessage);
  fs.writeFileSync(MESSAGE_FILE, JSON.stringify(messages, null, 2));

  // Broadcast to all connected clients
  io.emit('new-message', newMessage);

  res.json({ success: true });
});

// WebSocket connection for live chat
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Listen on all network interfaces for local network access
http.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://localhost:3000');
});
