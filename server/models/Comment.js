const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a comment text'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    cardId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Card',
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
