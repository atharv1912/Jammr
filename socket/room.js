const roomhistory = {};

module.exports = (io) => {
  
  io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('joinRoom', (roomId) => {
  console.log(`User ${socket.id} joined room: ${roomId}`);
  socket.join(roomId);

  
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
    // console.log('Mouse moved:', data);
    socket.to(roomId).emit('mousemove', data); 

  });
});
  
  


  // You can now handle events
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

}