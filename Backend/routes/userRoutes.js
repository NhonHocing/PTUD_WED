const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  getReaders,
  getReader,
  updateReader,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa đăng nhập
 */
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       401:
 *         description: Mật khẩu hiện tại không đúng
 */
router.put('/change-password', protect, changePassword);

/**
 * @swagger
 * /api/users/readers:
 *   get:
 *     summary: Lấy danh sách độc giả (Chỉ nhân viên)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên, email hoặc username
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Chỉ nhân viên mới có quyền
 */
router.get('/readers', protect, authorize('staff'), getReaders);

/**
 * @swagger
 * /api/users/readers/{id}:
 *   get:
 *     summary: Lấy thông tin một độc giả (Chỉ nhân viên)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy độc giả
 *       403:
 *         description: Chỉ nhân viên mới có quyền
 */
router.get('/readers/:id', protect, authorize('staff'), getReader);

/**
 * @swagger
 * /api/users/readers/{id}:
 *   put:
 *     summary: Cập nhật thông tin độc giả (Chỉ nhân viên)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 description: Kích hoạt/vô hiệu hóa tài khoản
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy độc giả
 *       403:
 *         description: Chỉ nhân viên mới có quyền
 */
router.put('/readers/:id', protect, authorize('staff'), updateReader);

module.exports = router;
