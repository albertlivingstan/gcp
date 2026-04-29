const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let chatHistory = []; // Store the recent chat messages

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send chat history to the new user immediately
  socket.emit('chat history', chatHistory);

  socket.on('chat message', (msg) => {
    // Save to history and broadcast
    const messageData = {
      id: Date.now(),
      text: msg.text,
      user: msg.user || 'Anonymous',
      timestamp: new Date().toISOString()
    };
    
    chatHistory.push(messageData);
    // Keep only the last 50 messages
    if (chatHistory.length > 50) chatHistory.shift();

    io.emit('chat message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Live Chat Socket.IO Server running on port ${PORT}`);
});
