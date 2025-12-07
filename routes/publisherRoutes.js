const express = require('express');
const router = express.Router();
const {
  getPublishers,
  getPublisher,
  createPublisher,
  updatePublisher,
  deletePublisher,
} = require('../controllers/publisherController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/publishers:
 *   get:
 *     summary: Lấy danh sách nhà xuất bản
 *     tags: [Publishers]
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
 *                     $ref: '#/components/schemas/Publisher'
 */
router.get('/', getPublishers);

/**
 * @swagger
 * /api/publishers/{id}:
 *   get:
 *     summary: Lấy thông tin một nhà xuất bản
 *     tags: [Publishers]
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
 *         description: Không tìm thấy nhà xuất bản
 */
router.get('/:id', getPublisher);

/**
 * @swagger
 * /api/publishers:
 *   post:
 *     summary: Tạo nhà xuất bản mới (Chỉ nhân viên)
 *     tags: [Publishers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nhà xuất bản Giáo dục Việt Nam
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Lỗi validation hoặc tên đã tồn tại
 *       403:
 *         description: Không có quyền
 */
router.post('/', protect, authorize('staff'), createPublisher);

/**
 * @swagger
 * /api/publishers/{id}:
 *   put:
 *     summary: Cập nhật nhà xuất bản (Chỉ nhân viên)
 *     tags: [Publishers]
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
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy nhà xuất bản
 *       403:
 *         description: Không có quyền
 */
router.put('/:id', protect, authorize('staff'), updatePublisher);

/**
 * @swagger
 * /api/publishers/{id}:
 *   delete:
 *     summary: Xóa nhà xuất bản (Chỉ nhân viên)
 *     tags: [Publishers]
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
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy nhà xuất bản
 *       403:
 *         description: Không có quyền
 */
router.delete('/:id', protect, authorize('staff'), deletePublisher);

module.exports = router;
