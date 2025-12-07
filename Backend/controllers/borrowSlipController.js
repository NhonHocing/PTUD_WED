const BorrowSlip = require('../models/BorrowSlip');
const Book = require('../models/Book');
const BorrowRequest = require('../models/BorrowRequest');

// @desc    Tạo phiếu mượn sách
// @route   POST /api/borrow-slips
// @access  Private/Staff
exports.createBorrowSlip = async (req, res, next) => {
  try {
    const { reader, book, borrowDate, expectedReturnDate, note, requestId } = req.body;

    // Kiểm tra sách có sẵn không
    const bookData = await Book.findById(book);
    if (!bookData) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    if (bookData.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sách hiện không có sẵn',
      });
    }

    // Tạo phiếu mượn
    const borrowSlip = await BorrowSlip.create({
      reader,
      book,
      borrowDate: borrowDate || new Date(),
      expectedReturnDate,
      note,
      createdBy: req.user._id,
    });

    // Giảm số lượng sách có sẵn
    bookData.availableCopies -= 1;
    await bookData.save();

    // Nếu có requestId, cập nhật trạng thái yêu cầu
    if (requestId) {
      const request = await BorrowRequest.findById(requestId);
      if (request && request.status === 'approved') {
        request.status = 'approved'; // Đã tạo phiếu mượn
        await request.save();
      }
    }

    await borrowSlip.populate('reader', 'fullName email phone');
    await borrowSlip.populate('book', 'title author isbn');
    await borrowSlip.populate('createdBy', 'fullName');

    res.status(201).json({
      success: true,
      data: borrowSlip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách phiếu mượn
// @route   GET /api/borrow-slips
// @access  Private
exports.getBorrowSlips = async (req, res, next) => {
  try {
    const { status, reader } = req.query;
    const query = {};

    // Nếu là độc giả, chỉ xem phiếu của mình
    if (req.user.role === 'reader') {
      query.reader = req.user._id;
    } else if (reader) {
      query.reader = reader;
    }

    if (status) {
      query.status = status;
    }

    const slips = await BorrowSlip.find(query)
      .populate('reader', 'fullName email phone')
      .populate('book', 'title author isbn coverImage')
      .populate('createdBy', 'fullName')
      .populate('returnedBy', 'fullName')
      .sort({ borrowDate: -1 });

    res.json({
      success: true,
      data: slips,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin một phiếu mượn
// @route   GET /api/borrow-slips/:id
// @access  Private
exports.getBorrowSlip = async (req, res, next) => {
  try {
    const slip = await BorrowSlip.findById(req.params.id)
      .populate('reader', 'fullName email phone address')
      .populate('book', 'title author isbn publisher coverImage')
      .populate('createdBy', 'fullName')
      .populate('returnedBy', 'fullName');

    if (!slip) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu mượn',
      });
    }

    // Kiểm tra quyền truy cập
    if (req.user.role === 'reader' && slip.reader._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem phiếu mượn này',
      });
    }

    res.json({
      success: true,
      data: slip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trả sách
// @route   PUT /api/borrow-slips/:id/return
// @access  Private/Staff
exports.returnBook = async (req, res, next) => {
  try {
    const { actualReturnDate, fine, fineReason, note } = req.body;

    const slip = await BorrowSlip.findById(req.params.id);

    if (!slip) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu mượn',
      });
    }

    if (slip.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Sách đã được trả',
      });
    }

    // Cập nhật thông tin trả sách
    slip.actualReturnDate = actualReturnDate || new Date();
    slip.status = 'returned';
    slip.returnedBy = req.user._id;
    if (fine !== undefined) slip.fine = fine;
    if (fineReason) slip.fineReason = fineReason;
    if (note) slip.note = note;

    await slip.save();

    // Tăng số lượng sách có sẵn
    const book = await Book.findById(slip.book);
    book.availableCopies += 1;
    await book.save();

    await slip.populate('reader', 'fullName email');
    await slip.populate('book', 'title author');
    await slip.populate('returnedBy', 'fullName');

    res.json({
      success: true,
      message: 'Đã cập nhật thông tin trả sách thành công',
      data: slip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy lịch sử mượn-trả của độc giả
// @route   GET /api/borrow-slips/my-history
// @access  Private/Reader
exports.getMyHistory = async (req, res, next) => {
  try {
    const slips = await BorrowSlip.find({ reader: req.user._id })
      .populate('book', 'title author isbn coverImage')
      .populate('returnedBy', 'fullName')
      .sort({ borrowDate: -1 });

    res.json({
      success: true,
      data: slips,
    });
  } catch (error) {
    next(error);
  }
};

