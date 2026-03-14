const Card = require('../models/Card');
const List = require('../models/List');
const Board = require('../models/Board');

// Helper to check board access
const checkBoardAccess = async (boardId, userId) => {
  const board = await Board.findById(boardId).populate('workspaceId');
  if (!board) return { hasAccess: false, error: 'Board not found', code: 404 };

  const workspace = board.workspaceId;
  const isWorkspaceMember =
    workspace.owner.toString() === userId ||
    workspace.members.some((member) => member.user.toString() === userId);

  if (!isWorkspaceMember) {
    return { hasAccess: false, error: 'Not authorized to access this board', code: 403 };
  }
  
  return { hasAccess: true, board };
};

// @desc    Get all cards for a list
// @route   GET /api/v1/lists/:listId/cards
// @access  Private
exports.getCardsByList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).json({ success: false, error: 'List not found' });

    const access = await checkBoardAccess(list.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    const cards = await Card.find({ listId: req.params.listId })
      .sort('position')
      .populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new card
// @route   POST /api/v1/lists/:listId/cards
// @access  Private
exports.createCard = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).json({ success: false, error: 'List not found' });

    const access = await checkBoardAccess(list.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    // Get highest position
    const cards = await Card.find({ listId: req.params.listId }).sort('-position').limit(1);
    let newPosition = 65535; // Default jump
    if (cards.length > 0) {
      newPosition = cards[0].position + 65535;
    }

    req.body.listId = req.params.listId;
    req.body.boardId = list.boardId;
    req.body.position = req.body.position || newPosition;

    let card = await Card.create(req.body);

    if (req.io) {
      card = await card.populate('members', 'name email avatar');
      req.io.to(`board_${list.boardId}`).emit('cardCreated', card);
    }

    res.status(201).json({
      success: true,
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update card (including move between lists)
// @route   PUT /api/v1/cards/:id
// @access  Private
exports.updateCard = async (req, res, next) => {
  try {
    let card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }

    const access = await checkBoardAccess(card.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('members', 'name email avatar');

    if (req.io) {
      // If moving or updating, broadcast
      req.io.to(`board_${card.boardId}`).emit('cardUpdated', card);
    }

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single card
// @route   GET /api/v1/cards/:id
// @access  Private
exports.getCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate({
        path: 'listId',
        select: 'title',
      });

    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }

    const access = await checkBoardAccess(card.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete card
// @route   DELETE /api/v1/cards/:id
// @access  Private
exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }

    const access = await checkBoardAccess(card.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    const boardId = card.boardId;
    await card.deleteOne();

    if (req.io) {
      req.io.to(`board_${boardId}`).emit('boardUpdated');
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
