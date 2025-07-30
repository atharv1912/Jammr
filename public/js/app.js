import { registerCanvasEvents } from './canvasEvents.js';

import {  handleSocketConnection} from './socketHandler.js';


console.log("Client-side script loaded");
console.log("Room ID:", roomId); // This variable is passed from the EJS template




const canvas = document.getElementById('whiteboard');
const pointerCanvas = document.getElementById('pointerlayer');
const ctx = canvas.getContext('2d');
const pointerCtx = pointerCanvas.getContext('2d');



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
pointerCanvas.width = window.innerWidth;
pointerCanvas.height = window.innerHeight;



const socket = io('/');
handleSocketConnection(socket, ctx, pointerCtx);
registerCanvasEvents(canvas, pointerCanvas, socket, ctx, pointerCtx);
























