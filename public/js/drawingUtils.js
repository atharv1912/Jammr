
  export function drawCompleteLine(line, context) {
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
export function drawLine(x0, y0, x1, y1, color, isLocal,ctx) {
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


export function drawPointer(x, y,pointerCtx) {
  pointerCtx.clearRect(0, 0, pointerCtx.canvas.width, pointerCtx.canvas.height); // Clear previous pointer
  pointerCtx.beginPath();
  pointerCtx.arc(x, y, 5, 0, Math.PI * 2); // Draw a circle for the pointer
  pointerCtx.fillStyle = 'red';
  pointerCtx.fill();
  pointerCtx.closePath();
}


export function drawHistory(history, ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  history.forEach(line => {
    drawCompleteLine(line, ctx);
  });

}

