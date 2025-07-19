const express = require('express');
const { Server } = require('socket.io');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = new Server(server);
const ejs = require('ejs');
const { v4: uuidV4 } = require('uuid');

// Set up the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));



// Route for the home page
app.get('/', (req, res) => {
  // Redirect to a new unique room
  res.render('index');
});
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

app.post('/new', (req, res) => {
    const roomId = uuidV4();
    res.redirect(`/${roomId}`);
});



io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('joinRoom', (roomId) => {
  console.log(`User ${socket.id} joined room: ${roomId}`);
  socket.join(roomId);

  // ✅ updated event name
  socket.to(roomId).emit('user-connected', socket.id);
  });

  // You can now handle events
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});