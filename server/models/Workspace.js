const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a workspace name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['admin', 'member'],
          default: 'member',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Cascade delete boards when a workspace is deleted
WorkspaceSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await this.model('Board').deleteMany({ workspaceId: this._id });
  next();
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);
