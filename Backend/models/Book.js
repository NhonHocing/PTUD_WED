const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tên sách'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Vui lòng nhập tác giả'],
    trim: true,
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher',
    required: [true, 'Vui lòng chọn nhà xuất bản'],
  },
  publishYear: {
    type: Number,
    min: [1000, 'Năm xuất bản không hợp lệ'],
    max: [new Date().getFullYear() + 1, 'Năm xuất bản không hợp lệ'],
  },
  category: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  totalCopies: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng sách'],
    min: [0, 'Số lượng sách phải lớn hơn hoặc bằng 0'],
    default: 0,
  },
  availableCopies: {
    type: Number,
    min: [0, 'Số lượng sách có sẵn phải lớn hơn hoặc bằng 0'],
    default: 0,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tự động cập nhật availableCopies khi totalCopies thay đổi
bookSchema.pre('save', function (next) {
  if (this.isNew && this.availableCopies === 0) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);

