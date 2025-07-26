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
  socket.on('drawing', (lineData) => {
  console.log('Receiving a complete line from another user');
  // Use the function that can draw an array of points
  drawLine(lineData.x0, lineData.y0, lineData.x1, lineData.y1, lineData.color, false);
});
   socket.on('drawing-segment', (segment) => {
  const { from, to, color } = segment;
  drawLine(from.x, from.y, to.x, to.y, color || 'black', false);
});


  socket.on('draw-history', (history) => {
    console.log('Drawing history received:', history);
    drawHistory(history, ctx);
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

let currentLine = [];
const drawingHistory = [];
// Color picker and clear button
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');

// Set initial color
let currentColor = colorPicker.value;

// Update color on input change
colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

// Clear button event
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clearCanvas');
});

// Drawing event handlers
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  // Start a new line with the first point

  drawPointer(e.clientX, e.clientY); // Draw pointer at the start

  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  

  currentLine = [{ x: e.clientX, y: e.clientY, color: currentColor }];
 
});

canvas.addEventListener('mouseup', (e) => {
  if (!drawing) return;
  drawing = false;

  // IMPORTANT: Emit the entire completed line to the server
  // The server from our previous discussion expects an array of points
  socket.emit('drawing', currentLine);
  drawPointer(e.clientX, e.clientY);

});

canvas.addEventListener('mouseout', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
  // Always emit the pointer position for other users
  socket.emit('mousemove', { x: e.clientX, y: e.clientY });
  drawPointer(e.clientX, e.clientY);

  if (!drawing) return;

  // Add the new point to the line we are currently drawing
  const point = { x: e.clientX, y: e.clientY };
  currentLine.push(point);

  // Draw the latest segment on our own canvas for instant feedback
  const prevPoint = currentLine[currentLine.length - 2];
  drawLine(prevPoint.x, prevPoint.y, point.x, point.y, currentColor, false); // IMPORTANT: emit is false

  socket.emit('drawing-segment', {
    from: prevPoint,
    to: point,
    color: currentColor
  });
});

// Resizing canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Note: This will clear the canvas. You might want to redraw the state if needed.
});


function drawCompleteLine(line, context) {
  if (!line || line.length < 2) return;
  context.beginPath();
  context.strokeStyle = line[0].color || 'black'; // Use the color from the first point
  context.moveTo(line[0].x, line[0].y);
  for (let i = 1; i < line.length; i++) {
    context.lineTo(line[i].x, line[i].y);
  }
  
  context.stroke();
}
// Add this function to your script
function drawLine(x0, y0, x1, y1, color, isLocal) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
  
  // Only emit if it's from local drawing
  if (isLocal) {
    socket.emit('drawing-segment', {
      from: { x: x0, y: y0 },
      to: { x: x1, y: y1 },
      color: color
    });
  }
}


function drawPointer(x, y) {
  pointerCtx.clearRect(0, 0, pointercanvas.width, pointercanvas.height); // Clear previous pointer
  pointerCtx.beginPath();
  pointerCtx.arc(x, y, 5, 0, Math.PI * 2); // Draw a circle for the pointer
  pointerCtx.fillStyle = 'red';
  pointerCtx.fill();
  pointerCtx.closePath();
}


function drawHistory(history, ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Loop through each complete line in the history
  history.forEach(line => {
    drawCompleteLine(line, ctx);
  });
  // DO NOT EMIT FROM HERE - THIS CAUSED THE INFINITE LOOP
}




























