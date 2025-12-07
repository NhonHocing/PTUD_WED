const BorrowRequest = require('../models/BorrowRequest');
const Book = require('../models/Book');

// @desc    Tạo yêu cầu mượn sách
// @route   POST /api/borrow-requests
// @access  Private/Reader
exports.createBorrowRequest = async (req, res, next) => {
  try {
    const { book, expectedBorrowDate, expectedReturnDate, note } = req.body;

    // Kiểm tra sách có tồn tại và có sẵn không
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

    // Kiểm tra xem độc giả đã có yêu cầu đang chờ cho sách này chưa
    const existingRequest = await BorrowRequest.findOne({
      reader: req.user._id,
      book: book,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã có yêu cầu mượn sách này đang chờ xử lý',
      });
    }

    const borrowRequest = await BorrowRequest.create({
      reader: req.user._id,
      book,
      expectedBorrowDate,
      expectedReturnDate,
      note,
    });

    await borrowRequest.populate('book', 'title author');
    await borrowRequest.populate('reader', 'fullName email');

    res.status(201).json({
      success: true,
      data: borrowRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách yêu cầu mượn sách của độc giả
// @route   GET /api/borrow-requests/my-requests
// @access  Private/Reader
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await BorrowRequest.find({ reader: req.user._id })
      .populate('book', 'title author isbn coverImage')
      .populate('processedBy', 'fullName')
      .sort({ requestDate: -1 });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy tất cả yêu cầu mượn sách (cho nhân viên)
// @route   GET /api/borrow-requests
// @access  Private/Staff
exports.getAllRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const requests = await BorrowRequest.find(query)
      .populate('reader', 'fullName email phone')
      .populate('book', 'title author isbn')
      .populate('processedBy', 'fullName')
      .sort({ requestDate: -1 });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xử lý yêu cầu mượn sách (duyệt/từ chối)
// @route   PUT /api/borrow-requests/:id/process
// @access  Private/Staff
exports.processRequest = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ',
      });
    }

    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Yêu cầu này đã được xử lý',
      });
    }

    // Nếu duyệt, kiểm tra lại sách có sẵn không
    if (status === 'approved') {
      const book = await Book.findById(request.book);
      if (book.availableCopies <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Sách hiện không còn sẵn',
        });
      }
    }

    request.status = status;
    request.processedBy = req.user._id;
    request.processedAt = new Date();
    if (status === 'rejected' && rejectionReason) {
      request.rejectionReason = rejectionReason;
    }

    await request.save();

    await request.populate('reader', 'fullName email');
    await request.populate('book', 'title author');
    await request.populate('processedBy', 'fullName');

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hủy yêu cầu mượn sách
// @route   PUT /api/borrow-requests/:id/cancel
// @access  Private/Reader
exports.cancelRequest = async (req, res, next) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu',
      });
    }

    if (request.reader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền hủy yêu cầu này',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy yêu cầu đang chờ xử lý',
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({
      success: true,
      message: 'Đã hủy yêu cầu thành công',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

