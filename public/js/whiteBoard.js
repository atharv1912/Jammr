const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
console.log("Whiteboard script loaded");
let drawing = false;
let current = { x: 0, y: 0 };
// Don't redeclare if already declared
const waitForSocket = setInterval(() => {
  if (window.sharedSocket) {
    const socket = window.sharedSocket;
    console.log('Whiteboard.js using shared socket:', socket.id);

    // Your whiteboard logic here
    socket.on('draw', (data) => {
      // drawing logic
    });

    clearInterval(waitForSocket); // stop checking
  }
}, 100); 


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Drawing event handlers
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  current.x = e.clientX;
  current.y = e.clientY;
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  drawLine(current.x, current.y, e.clientX, e.clientY, 'black', true);
  current.x = e.clientX;
  current.y = e.clientY;
});

// Draw function
function drawLine(x0, y0, x1, y1, color, emit) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  if (!emit) return;

  socket.emit('drawing', {
    roomId: window.roomId,
    x0, y0, x1, y1, color
  });
}

// Listen to drawing from other users
socket.on('drawing', (data) => {
  drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false);
  
});