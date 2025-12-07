const mongoose = require('mongoose');

const borrowSlipSchema = new mongoose.Schema({
  slipNumber: {
    type: String,
    unique: true,
    required: true,
  },
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
  borrowDate: {
    type: Date,
    required: [true, 'Vui lòng nhập ngày mượn'],
    default: Date.now,
  },
  expectedReturnDate: {
    type: Date,
    required: [true, 'Vui lòng nhập ngày trả dự kiến'],
  },
  actualReturnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed',
  },
  fine: {
    type: Number,
    default: 0,
    min: 0,
  },
  fineReason: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  returnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tự động tạo số phiếu mượn
borrowSlipSchema.pre('save', async function (next) {
  if (!this.slipNumber) {
    try {
      const BorrowSlipModel = this.constructor;
      const count = await BorrowSlipModel.countDocuments();
      this.slipNumber = `PM${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      // Fallback nếu có lỗi
      this.slipNumber = `PM${Date.now().toString().slice(-6)}`;
    }
  }
  next();
});

// Cập nhật trạng thái quá hạn
borrowSlipSchema.methods.updateStatus = function () {
  if (this.status === 'borrowed' && !this.actualReturnDate) {
    const now = new Date();
    if (now > this.expectedReturnDate) {
      this.status = 'overdue';
    }
  }
};

module.exports = mongoose.model('BorrowSlip', borrowSlipSchema);

