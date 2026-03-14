const express = require('express');
const {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
} = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth');

// Include other resource routers
const boardRouter = require('./board.routes');

const router = express.Router();

router.use(protect); // All routes require auth

// Re-route into other resource routers
router.use('/:workspaceId/boards', boardRouter);

router.route('/').get(getWorkspaces).post(createWorkspace);
router.route('/:id').get(getWorkspace).put(updateWorkspace).delete(deleteWorkspace);
router.post('/:id/members', inviteMember);

module.exports = router;
