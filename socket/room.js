// socketServer.js
const roomPeers = {}; // Store room-peer mapping

module.exports = function (io) {
  console.log('Socket server initialized');
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.join(roomId);

      

      socket.on('drawing', (data) => {
        socket.to(roomId).emit('drawing', data);
      });
      

    



      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        const disconnectedPeerId = roomPeers[roomId]?.[socket.id];
        delete roomPeers[roomId]?.[socket.id];

        socket.to(roomId).emit('user-disconnected', disconnectedPeerId);
      });
    });
  });
};
