const Workspace = require('../models/Workspace');
const User = require('../models/User');

// @desc    Get all workspaces for a user
// @route   GET /api/v1/workspaces
// @access  Private
exports.getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user.id }, { 'members.user': req.user.id }],
    }).populate('owner', 'name email avatar').populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workspace
// @route   GET /api/v1/workspaces/:id
// @access  Private
exports.getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Check permissions
    const isMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((member) => member.user._id.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ success: false, error: 'Not authorized to access this workspace' });
    }

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new workspace
// @route   POST /api/v1/workspaces
// @access  Private
exports.createWorkspace = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    req.body.members = [{ user: req.user.id, role: 'admin' }];

    const workspace = await Workspace.create(req.body);

    res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workspace
// @route   PUT /api/v1/workspaces/:id
// @access  Private
exports.updateWorkspace = async (req, res, next) => {
  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Check if user is owner or admin
    const isAdmin =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some(
        (member) => member.user.toString() === req.user.id && member.role === 'admin'
      );

    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this workspace' });
    }

    workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workspace
// @route   DELETE /api/v1/workspaces/:id
// @access  Private
exports.deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Only owner can delete
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this workspace' });
    }

    await workspace.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite members to workspace
// @route   POST /api/v1/workspaces/:id/members
// @access  Private
exports.inviteMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    const isAdmin =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some(
        (member) => member.user.toString() === req.user.id && member.role === 'admin'
      );

    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized to invite members' });
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ success: false, error: 'User with this email not found' });
    }

    // Check if already member
    const isAlreadyMember = workspace.members.some(
      (member) => member.user.toString() === userToAdd._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ success: false, error: 'User is already a member' });
    }

    workspace.members.push({ user: userToAdd._id, role: 'member' });
    await workspace.save();

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};
