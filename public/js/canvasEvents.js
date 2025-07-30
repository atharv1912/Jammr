export function registerCanvasEvents(canvas, pointerCanvas, socket, ctx, pointerCtx) {
  let drawing = false;
  let currentColor = document.getElementById('colorPicker').value;
  let currentLine = [];

  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    drawPointer(e.clientX, e.clientY, pointerCtx);
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    currentLine = [{ x: e.clientX, y: e.clientY, color: currentColor }];
  });

  canvas.addEventListener('mouseup', (e) => {
    if (!drawing) return;
    drawing = false;
    socket.emit('drawing', currentLine);
    drawPointer(e.clientX, e.clientY, pointerCtx);
  });

  canvas.addEventListener('mouseout', () => drawing = false);

  canvas.addEventListener('mousemove', (e) => {
    
    socket.emit('mousemove', { x: e.clientX, y: e.clientY });
    drawPointer(e.clientX, e.clientY, pointerCtx);
    if (!drawing) return;

    const point = { x: e.clientX, y: e.clientY };
    currentLine.push(point);
    const prev = currentLine[currentLine.length - 2];
    drawLine(prev.x, prev.y, point.x, point.y, currentColor, false, ctx);
    socket.emit('drawing-segment', {
      from: prev,
      to: point,
      color: currentColor
    });
  });

  // Handle color changes
  document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
  });

  document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearCanvas');
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pointerCanvas.width = window.innerWidth;
    pointerCanvas.height = window.innerHeight;
    // You can also redraw here if needed
  });
}

import { drawLine, drawPointer } from './drawingUtils.js';
