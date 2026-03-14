const express = require('express');
const {
  getCardsByList,
  createCard,
  updateCard,
  getCard,
  deleteCard,
} = require('../controllers/card.controller');
const { protect } = require('../middleware/auth');

// Include other resource routers
const commentRouter = require('./comment.routes');

const router = express.Router({ mergeParams: true });

router.use(protect);

// Re-route into other resource routers
router.use('/:cardId/comments', commentRouter);

router.route('/').get(getCardsByList).post(createCard);
router.route('/:id').get(getCard).put(updateCard).delete(deleteCard);

module.exports = router;
