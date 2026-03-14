const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a board title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    workspaceId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    background: {
      type: String,
      default: '#0079bf', // Default Trello blue
    },
    members: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['admin', 'member', 'observer'],
          default: 'member',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Cascade delete lists when a board is deleted
BoardSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await this.model('List').deleteMany({ boardId: this._id });
  next();
});

module.exports = mongoose.model('Board', BoardSchema);
