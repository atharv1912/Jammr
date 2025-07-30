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

// Set up routes
const roomRoutes = require('./routes/roomRoutes');
app.use('/', roomRoutes);


require('./socket/room')(io);






const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});