console.log("Client-side app.js loaded");



console.log("roomId:", roomId);

// Just call io() — it automatically connects to the server that served the page
const socket = io('/'); // No need to manually append roomId in URL for connection

socket.on('connect', () => {
  console.log('Connected to server with id:', socket.id);
  socket.emit('joinRoom', roomId);

  socket.on('user-connected', (userId) => {
    console.log('New user joined the room:', userId);
  });
});

socket.on('user-disconnected', (userId) => {
  console.log('User disconnected:', userId);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});