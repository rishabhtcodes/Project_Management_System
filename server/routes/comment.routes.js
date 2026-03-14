const express = require('express');
const {
  getComments,
  createComment,
  deleteComment,
} = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/').get(getComments).post(createComment);
router.route('/:id').delete(deleteComment);

module.exports = router;
