// routes/roomRoutes.js
const express = require('express');
const { v4: uuidV4 } = require('uuid');
const router = express.Router();

// Route to render home page
router.get('/', (req, res) => {
  res.render('index');
});

// Route to render a room
router.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

// Route to create new room and redirect
router.post('/new', (req, res) => {
  const roomId = uuidV4();
  res.redirect(`/${roomId}`);
});

module.exports = router;
