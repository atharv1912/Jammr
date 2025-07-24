// This one script handles everything for the room page
console.log("Client-side script loaded");
console.log("Room ID:", roomId); // This variable is passed from the EJS template

// 1. ESTABLISH SOCKET CONNECTION
const socket = io('/');

// 2. DEFINE ALL SOCKET EVENT HANDLERS
// This runs only when the connection is successfully established
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
  socket.on('drawing', (data) => {
    console.log('Receiving drawing from another user');
    drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false);
  });
  socket.on('mousemove', (data) => {

    console.log('Mouse moved:', data);
    drawPointer(data.x, data.y);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});


// 3. SETUP CANVAS AND UI EVENT LISTENERS
const canvas = document.getElementById('whiteboard');
const pointercanvas = document.getElementById('pointerlayer');
const ctx = canvas.getContext('2d');
const pointerCtx = pointercanvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

pointercanvas.width = window.innerWidth;
pointercanvas.height = window.innerHeight;
pointerCtx.strokeStyle = 'red';
pointerCtx.lineWidth = 2;
let drawing = false;
let current = { x: 0, y: 0 };

// Drawing event handlers
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  current.x = e.clientX;
  current.y = e.clientY;
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
  drawPointer(e.clientX, e.clientY);
  if (!drawing) return;
  // Draw on my own canvas and emit the event to others
  drawLine(current.x, current.y, e.clientX, e.clientY, 'black', true);
  current.x = e.clientX;
  current.y = e.clientY;
});

// Resizing canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Note: This will clear the canvas. You might want to redraw the state if needed.
});

// 4. DEFINE THE DRAWING FUNCTION
function drawLine(x0, y0, x1, y1, color, emit) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
  

  // If `emit` is false, it means this is a received drawing, so don't re-emit it.
  if (!emit) return;
 
  // Emit the drawing event to the server
  socket.emit('drawing', {
    x0,
    y0,
    x1,
    y1,
    color
  });
}
function drawPointer(x, y) {
  pointerCtx.clearRect(0, 0, pointercanvas.width, pointercanvas.height); // Clear previous pointer
  pointerCtx.beginPath();
  pointerCtx.arc(x, y, 5, 0, Math.PI * 2); // Draw a circle for the pointer
  pointerCtx.fillStyle = 'red';
  pointerCtx.fill();
  pointerCtx.closePath();

  // Emit the mouse move event to the server
  socket.emit('mousemove', {
    x,
    y
  });

}




























