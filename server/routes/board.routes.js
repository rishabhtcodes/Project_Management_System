const express = require('express');
const {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} = require('../controllers/board.controller');
const { protect } = require('../middleware/auth');

// Include other resource routers
const listRouter = require('./list.routes');

// Note: we need to mergeParams to access workspaceId from the workspace router
const router = express.Router({ mergeParams: true });

router.use(protect); // All routes require auth

// Re-route into other resource routers
router.use('/:boardId/lists', listRouter);

router.route('/').get(getBoards).post(createBoard);
router.route('/:id').get(getBoard).put(updateBoard).delete(deleteBoard);

module.exports = router;
