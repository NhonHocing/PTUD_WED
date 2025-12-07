const Publisher = require('../models/Publisher');

// @desc    Lấy danh sách nhà xuất bản
// @route   GET /api/publishers
// @access  Public
exports.getPublishers = async (req, res, next) => {
  try {
    const publishers = await Publisher.find().sort({ name: 1 });

    res.json({
      success: true,
      data: publishers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin một nhà xuất bản
// @route   GET /api/publishers/:id
// @access  Public
exports.getPublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.params.id);

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản',
      });
    }

    res.json({
      success: true,
      data: publisher,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo nhà xuất bản mới
// @route   POST /api/publishers
// @access  Private/Staff
exports.createPublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.create(req.body);

    res.status(201).json({
      success: true,
      data: publisher,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật nhà xuất bản
// @route   PUT /api/publishers/:id
// @access  Private/Staff
exports.updatePublisher = async (req, res, next) => {
  try {
    let publisher = await Publisher.findById(req.params.id);

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản',
      });
    }

    publisher = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: publisher,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa nhà xuất bản
// @route   DELETE /api/publishers/:id
// @access  Private/Staff
exports.deletePublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.params.id);

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản',
      });
    }

    await publisher.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa nhà xuất bản thành công',
    });
  } catch (error) {
    next(error);
  }
};

