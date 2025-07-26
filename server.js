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


const roomhistory = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('joinRoom', (roomId) => {
  console.log(`User ${socket.id} joined room: ${roomId}`);
  socket.join(roomId);

  // ✅ updated event name
  socket.to(roomId).emit('user-connected', socket.id);
  if (!roomhistory[roomId]) {
    roomhistory[roomId] = [];
  }
  socket.emit('draw-history', roomhistory[roomId]);


  socket.on('drawing', (data) => {
    console.log('Received drawing data from', socket.id);
    roomhistory[roomId].push(data);
    console.log('Updated drawing history:', roomhistory[roomId]);
    socket.to(roomId).emit('drawing', data);


  });
  socket.on('drawing-segment', (segment) => {
  socket.to(roomId).emit('drawing-segment', segment);
  });

  socket.on('mousemove', (data) => {
    console.log('Mouse moved:', data);
    socket.to(roomId).emit('mousemove', data); 

  });
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