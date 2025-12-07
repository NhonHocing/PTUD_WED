const express = require('express');
const router = express.Router();
const {
  createBorrowRequest,
  getMyRequests,
  getAllRequests,
  processRequest,
  cancelRequest,
} = require('../controllers/borrowRequestController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/borrow-requests:
 *   post:
 *     summary: Tạo yêu cầu mượn sách (Chỉ độc giả)
 *     tags: [Borrow Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book
 *               - expectedReturnDate
 *             properties:
 *               book:
 *                 type: string
 *                 description: ID của sách
 *               expectedBorrowDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               expectedReturnDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-30
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo yêu cầu thành công
 *       400:
 *         description: Sách không có sẵn hoặc đã có yêu cầu đang chờ
 *       403:
 *         description: Chỉ độc giả mới có quyền
 */
router.post('/', protect, authorize('reader'), createBorrowRequest);

/**
 * @swagger
 * /api/borrow-requests/my-requests:
 *   get:
 *     summary: Lấy danh sách yêu cầu mượn sách của mình (Chỉ độc giả)
 *     tags: [Borrow Requests]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/BorrowRequest'
 */
router.get('/my-requests', protect, authorize('reader'), getMyRequests);

/**
 * @swagger
 * /api/borrow-requests:
 *   get:
 *     summary: Lấy tất cả yêu cầu mượn sách (Chỉ nhân viên)
 *     tags: [Borrow Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, cancelled]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Chỉ nhân viên mới có quyền
 */
router.get('/', protect, authorize('staff'), getAllRequests);

/**
 * @swagger
 * /api/borrow-requests/{id}/process:
 *   put:
 *     summary: Xử lý yêu cầu mượn sách - duyệt hoặc từ chối (Chỉ nhân viên)
 *     tags: [Borrow Requests]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: approved
 *               rejectionReason:
 *                 type: string
 *                 description: Lý do từ chối (nếu status là rejected)
 *     responses:
 *       200:
 *         description: Xử lý thành công
 *       400:
 *         description: Yêu cầu đã được xử lý hoặc sách không còn sẵn
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       403:
 *         description: Chỉ nhân viên mới có quyền
 */
router.put('/:id/process', protect, authorize('staff'), processRequest);

/**
 * @swagger
 * /api/borrow-requests/{id}/cancel:
 *   put:
 *     summary: Hủy yêu cầu mượn sách (Chỉ độc giả - yêu cầu của chính mình)
 *     tags: [Borrow Requests]
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
 *         description: Hủy thành công
 *       400:
 *         description: Chỉ có thể hủy yêu cầu đang chờ xử lý
 *       403:
 *         description: Không có quyền hủy yêu cầu này
 *       404:
 *         description: Không tìm thấy yêu cầu
 */
router.put('/:id/cancel', protect, authorize('reader'), cancelRequest);

module.exports = router;
