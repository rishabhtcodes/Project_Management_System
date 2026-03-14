const express = require('express');
const {
  getLists,
  createList,
  updateList,
  deleteList,
} = require('../controllers/list.controller');
const { protect } = require('../middleware/auth');

// Include other resource routers
const cardRouter = require('./card.routes');

const router = express.Router({ mergeParams: true });

router.use(protect);

// Re-route into other resource routers
router.use('/:listId/cards', cardRouter);

router.route('/').get(getLists).post(createList);
router.route('/:id').put(updateList).delete(deleteList);

module.exports = router;
