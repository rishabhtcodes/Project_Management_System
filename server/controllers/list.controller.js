const List = require('../models/List');
const Board = require('../models/Board');
const Workspace = require('../models/Workspace');

// Helper to check board access
const checkBoardAccess = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) return { hasAccess: false, error: 'Board not found', code: 404 };

  const workspace = await Workspace.findById(board.workspaceId);
  const isWorkspaceMember =
    workspace.owner.toString() === userId ||
    workspace.members.some((member) => member.user.toString() === userId);

  if (!isWorkspaceMember) {
    return { hasAccess: false, error: 'Not authorized to access this board', code: 403 };
  }
  
  return { hasAccess: true, board };
};

// @desc    Get all lists for a board
// @route   GET /api/v1/boards/:boardId/lists
// @access  Private
exports.getLists = async (req, res, next) => {
  try {
    const access = await checkBoardAccess(req.params.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    const lists = await List.find({ boardId: req.params.boardId }).sort('position');

    res.status(200).json({
      success: true,
      count: lists.length,
      data: lists,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new list
// @route   POST /api/v1/boards/:boardId/lists
// @access  Private
exports.createList = async (req, res, next) => {
  try {
    const access = await checkBoardAccess(req.params.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    // Get highest position
    const lists = await List.find({ boardId: req.params.boardId }).sort('-position').limit(1);
    let newPosition = 65535; // Default jump
    if (lists.length > 0) {
      newPosition = lists[0].position + 65535;
    }

    req.body.boardId = req.params.boardId;
    req.body.position = req.body.position || newPosition;

    const list = await List.create(req.body);

    if (req.io) {
      req.io.to(`board_${req.params.boardId}`).emit('boardUpdated');
    }

    res.status(201).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update list
// @route   PUT /api/v1/lists/:id
// @access  Private
exports.updateList = async (req, res, next) => {
  try {
    let list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ success: false, error: 'List not found' });
    }

    const access = await checkBoardAccess(list.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    list = await List.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.io) {
      req.io.to(`board_${list.boardId}`).emit('boardUpdated');
    }

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete list
// @route   DELETE /api/v1/lists/:id
// @access  Private
exports.deleteList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ success: false, error: 'List not found' });
    }

    const access = await checkBoardAccess(list.boardId, req.user.id);
    if (!access.hasAccess) {
      return res.status(access.code).json({ success: false, error: access.error });
    }

    await list.deleteOne();

    if (req.io) {
      req.io.to(`board_${list.boardId}`).emit('boardUpdated');
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
