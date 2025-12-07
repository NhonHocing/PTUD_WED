const User = require('../models/User');

// @desc    Cập nhật thông tin cá nhân
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, address },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Đổi mật khẩu
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách độc giả (cho nhân viên)
// @route   GET /api/users/readers
// @access  Private/Staff
exports.getReaders = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { role: 'reader' };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const readers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: readers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin một độc giả
// @route   GET /api/users/readers/:id
// @access  Private/Staff
exports.getReader = async (req, res, next) => {
  try {
    const reader = await User.findById(req.params.id).select('-password');

    if (!reader || reader.role !== 'reader') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả',
      });
    }

    res.json({
      success: true,
      data: reader,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật thông tin độc giả (cho nhân viên)
// @route   PUT /api/users/readers/:id
// @access  Private/Staff
exports.updateReader = async (req, res, next) => {
  try {
    const { fullName, phone, address, isActive } = req.body;

    const reader = await User.findById(req.params.id);

    if (!reader || reader.role !== 'reader') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả',
      });
    }

    if (fullName) reader.fullName = fullName;
    if (phone) reader.phone = phone;
    if (address) reader.address = address;
    if (isActive !== undefined) reader.isActive = isActive;

    await reader.save();

    res.json({
      success: true,
      data: reader,
    });
  } catch (error) {
    next(error);
  }
};

