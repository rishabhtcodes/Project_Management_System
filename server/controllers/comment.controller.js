const Comment = require('../models/Comment');
const Card = require('../models/Card');
const Board = require('../models/Board');
const Workspace = require('../models/Workspace');

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

// @desc    Get comments for a card
// @route   GET /api/v1/cards/:cardId/comments
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });

    const access = await checkBoardAccess(card.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    const comments = await Comment.find({ cardId: req.params.cardId })
      .sort('-createdAt')
      .populate('userId', 'name email avatar');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create comment
// @route   POST /api/v1/cards/:cardId/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });

    const access = await checkBoardAccess(card.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    req.body.cardId = req.params.cardId;
    req.body.userId = req.user.id;

    let comment = await Comment.create(req.body);
    comment = await comment.populate('userId', 'name email avatar');

    if (req.io) {
      req.io.to(`board_${card.boardId}`).emit('commentAdded', comment);
    }

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    // Only comment owner can delete
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this comment' });
    }

    const card = await Card.findById(comment.cardId);

    await comment.deleteOne();

    if (req.io && card) {
      req.io.to(`board_${card.boardId}`).emit('boardUpdated');
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
