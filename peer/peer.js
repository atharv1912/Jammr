// peerServer.js
const { ExpressPeerServer } = require('peer');

/**
 * Initializes and returns the ExpressPeerServer middleware.
 * @param {http.Server} server - The HTTP server instance (from http.createServer or app.listen).
 * @returns {Function} - The Express middleware for PeerJS.
 */
function initializePeerServer(server) {
  console.log('✅ PeerJS server is initializing...');
  const peerServer = ExpressPeerServer(server, {
    debug: true,
  });

  return peerServer;
}

module.exports = initializePeerServer;


