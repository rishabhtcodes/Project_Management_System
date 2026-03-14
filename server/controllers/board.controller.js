const Board = require('../models/Board');
const Workspace = require('../models/Workspace');

// @desc    Get all boards for a workspace
// @route   GET /api/v1/workspaces/:workspaceId/boards
// @access  Private
exports.getBoards = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Check if user is member of workspace
    const isMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((member) => member.user.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ success: false, error: 'Not authorized to access boards in this workspace' });
    }

    const boards = await Board.find({ workspaceId: req.params.workspaceId });

    res.status(200).json({
      success: true,
      count: boards.length,
      data: boards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single board
// @route   GET /api/v1/boards/:id
// @access  Private
exports.getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id).populate('members.user', 'name email avatar');

    if (!board) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }

    const workspace = await Workspace.findById(board.workspaceId);

    // Check permissions
    const isWorkspaceMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((member) => member.user.toString() === req.user.id);

    if (!isWorkspaceMember) {
      return res.status(403).json({ success: false, error: 'Not authorized to access this board' });
    }

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new board
// @route   POST /api/v1/workspaces/:workspaceId/boards
// @access  Private
exports.createBoard = async (req, res, next) => {
  try {
    req.body.workspaceId = req.params.workspaceId;
    
    // Auto add creator as board admin
    req.body.members = [{ user: req.user.id, role: 'admin' }];

    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Check permissions
    const isWorkspaceMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((member) => member.user.toString() === req.user.id);

    if (!isWorkspaceMember) {
      return res.status(403).json({ success: false, error: 'Not authorized to create a board in this workspace' });
    }

    const board = await Board.create(req.body);

    res.status(201).json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update board
// @route   PUT /api/v1/boards/:id
// @access  Private
exports.updateBoard = async (req, res, next) => {
  try {
    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }

    const workspace = await Workspace.findById(board.workspaceId);

    // Check permissions (simple check: must be workspace member)
    const isWorkspaceMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((member) => member.user.toString() === req.user.id);

    if (!isWorkspaceMember) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this board' });
    }

    board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.io) {
      req.io.to(`board_${board._id}`).emit('boardUpdated', board);
    }

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete board
// @route   DELETE /api/v1/boards/:id
// @access  Private
exports.deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }

    const workspace = await Workspace.findById(board.workspaceId);

    // Check permissions
    const isOwnerOrAdmin =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some(
        (member) => member.user.toString() === req.user.id && member.role === 'admin'
      );

    if (!isOwnerOrAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this board' });
    }

    await board.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
