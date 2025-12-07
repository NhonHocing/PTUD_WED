const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
  reader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vui lòng chọn độc giả'],
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Vui lòng chọn sách'],
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  expectedBorrowDate: {
    type: Date,
  },
  expectedReturnDate: {
    type: Date,
  },
  note: {
    type: String,
    trim: true,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  processedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);

