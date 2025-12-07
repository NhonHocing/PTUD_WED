const Book = require('../models/Book');

// @desc    Lấy danh sách tất cả sách (có phân trang và tìm kiếm)
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tìm kiếm
    const searchQuery = {};
    if (req.query.search) {
      searchQuery.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } },
        { isbn: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Lọc theo category
    if (req.query.category) {
      searchQuery.category = req.query.category;
    }

    // Lọc theo status
    if (req.query.status) {
      searchQuery.status = req.query.status;
    }

    // Lọc sách có sẵn
    if (req.query.available === 'true') {
      searchQuery.availableCopies = { $gt: 0 };
      searchQuery.status = 'available';
    }

    const books = await Book.find(searchQuery)
      .populate('publisher', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(searchQuery);

    res.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin một cuốn sách
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('publisher');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo sách mới
// @route   POST /api/books
// @access  Private/Staff
exports.createBook = async (req, res, next) => {
  try {
    // Đảm bảo availableCopies = totalCopies khi tạo mới
    if (!req.body.availableCopies && req.body.totalCopies) {
      req.body.availableCopies = req.body.totalCopies;
    }

    const book = await Book.create(req.body);
    await book.populate('publisher', 'name');

    res.status(201).json({
      success: true,
      data: book,
      message: 'Tạo sách thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật sách
// @route   PUT /api/books/:id
// @access  Private/Staff
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    // Nếu cập nhật totalCopies, điều chỉnh availableCopies nếu cần
    if (req.body.totalCopies !== undefined) {
      const diff = req.body.totalCopies - book.totalCopies;
      if (req.body.availableCopies === undefined) {
        req.body.availableCopies = Math.max(0, book.availableCopies + diff);
      }
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await book.populate('publisher', 'name');

    res.json({
      success: true,
      data: book,
      message: 'Cập nhật sách thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa sách
// @route   DELETE /api/books/:id
// @access  Private/Staff
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa sách thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách categories
// @route   GET /api/books/categories/list
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Book.distinct('category');
    res.json({
      success: true,
      data: categories.filter(cat => cat && cat.trim() !== ''),
    });
  } catch (error) {
    next(error);
  }
};

