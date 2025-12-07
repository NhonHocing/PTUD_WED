const express = require('express');
const router = express.Router();
const {
  createBorrowSlip,
  getBorrowSlips,
  getBorrowSlip,
  returnBook,
  getMyHistory,
} = require('../controllers/borrowSlipController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/borrow-slips/my-history:
 *   get:
 *     summary: Lấy lịch sử mượn-trả sách của mình (Chỉ độc giả)
 *     tags: [Borrow Slips]
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
 *                     $ref: '#/components/schemas/BorrowSlip'
 */
router.get('/my-history', protect, authorize('reader'), getMyHistory);

/**
 * @swagger
 * /api/borrow-slips:
 *   get:
 *     summary: Lấy danh sách phiếu mượn (Độc giả xem của mình, nhân viên xem tất cả)
 *     tags: [Borrow Slips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [borrowed, returned, overdue]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: reader
 *         schema:
 *           type: string
 *         description: Lọc theo độc giả (chỉ nhân viên)
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', protect, getBorrowSlips);

/**
 * @swagger
 * /api/borrow-slips/{id}:
 *   get:
 *     summary: Lấy thông tin một phiếu mượn
 *     tags: [Borrow Slips]
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
 *       403:
 *         description: Không có quyền xem phiếu mượn này
 *       404:
 *         description: Không tìm thấy phiếu mượn
 */
router.get('/:id', protect, getBorrowSlip);

/**
 * @swagger
 * /api/borrow-slips:
 *   post:
 *     summary: Tạo phiếu mượn sách (Chỉ nhân viên)
 *     tags: [Borrow Slips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reader
 *               - book
 *               - expectedReturnDate
 *             properties:
 *               reader:
 *                 type: string
 *                 description: ID độc giả
 *               book:
 *                 type: string
 *                 description: ID sách
 *               borrowDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày mượn (mặc định là hiện tại)
 *               expectedReturnDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-30
 *               note:
 *                 type: string
 *               requestId:
 *                 type: string
 *                 description: ID yêu cầu mượn (nếu có)
 *     responses:
 *       201:
 *         description: Tạo phiếu mượn thành công
 *       400:
 *         description: Sách không có sẵn
 *       403:
 *         description: Chỉ nhân viên mới có quyền
 */
router.post('/', protect, authorize('staff'), createBorrowSlip);

/**
 * @swagger
 * /api/borrow-slips/{id}/return:
 *   put:
 *     summary: Trả sách (Chỉ nhân viên)
 *     tags: [Borrow Slips]
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
 *               actualReturnDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày trả thực tế (mặc định là hiện tại)
 *               fine:
 *                 type: number
 *                 description: Tiền phạt (nếu có)
 *                 example: 0
 *               fineReason:
 *                 type: string
 *                 description: Lý do phạt
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin trả sách thành công
 *       400:
 *         description: Sách đã được trả
 *       404:
 *         description: Không tìm thấy phiếu mượn
 *       403:
 *         description: Chỉ nhân viên mới có quyền
 */
router.put('/:id/return', protect, authorize('staff'), returnBook);

module.exports = router;
