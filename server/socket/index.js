const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join a specific board room
    socket.on('joinBoard', (boardId) => {
      socket.join(`board_${boardId}`);
      logger.info(`Socket ${socket.id} joined board_${boardId}`);
    });

    // Leave a specific board room
    socket.on('leaveBoard', (boardId) => {
      socket.leave(`board_${boardId}`);
      logger.info(`Socket ${socket.id} left board_${boardId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};
