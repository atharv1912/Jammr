export function handleSocketConnection(socket,ctx, pointerCtx) {
  socket.on('connect', () => {
  console.log('Connected to server with id:', socket.id);

  // Join the specific room
  socket.emit('joinRoom', roomId);

  // Listener for a new user joining
  socket.on('user-connected', (userId) => {
    console.log('New user joined the room:', userId);
  
  });
  // Listener for a user leaving
  socket.on('user-disconnected', (userId) => {
    console.log('User disconnected:', userId);
  });

  // Listener for drawing events from other users
  socket.on('drawing', (lineData) => {
  console.log('Receiving a complete line from another user');
  // Use the function that can draw an array of points
  drawLine(lineData.x0, lineData.y0, lineData.x1, lineData.y1, lineData.color, false, ctx);
});

    // Listener for drawing segments from other users
  socket.on('drawing-segment', (segment) => {
  const { from, to, color } = segment;
  drawLine(from.x, from.y, to.x, to.y, color || 'black', false, ctx);
});

    // Listener for mouse movements from other users
  socket.on('draw-history', (history) => {
    console.log('Drawing history received:', history);
    drawHistory(history, ctx);
  });

    // Listener for mouse movements from other users
  socket.on('mousemove', (data) => {

    console.log('Mouse moved:', data);
    drawPointer(data.x, data.y, pointerCtx); // Draw the pointer for other users
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});


 }

import { drawLine, drawHistory, drawPointer } from './drawingUtils.js';
 