const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a card title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    listId: {
      type: mongoose.Schema.ObjectId,
      ref: 'List',
      required: true,
    },
    boardId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Board',
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    labels: [
      {
        color: String,
        text: String,
      },
    ],
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    attachments: [
      {
        url: String,
        public_id: String,
        filename: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Cascade delete comments when a card is deleted
CardSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await this.model('Comment').deleteMany({ cardId: this._id });
  next();
});

module.exports = mongoose.model('Card', CardSchema);
