const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a list title'],
      trim: true,
      maxlength: [50, 'Title cannot be more than 50 characters'],
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
  },
  {
    timestamps: true,
  }
);

// Cascade delete cards when a list is deleted
ListSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await this.model('Card').deleteMany({ listId: this._id });
  next();
});

module.exports = mongoose.model('List', ListSchema);
