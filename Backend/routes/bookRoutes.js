const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getCategories,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Lấy danh sách sách (có phân trang và tìm kiếm)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng sách mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên sách, tác giả hoặc ISBN
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo thể loại
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, unavailable]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Chỉ lấy sách có sẵn
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
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books/categories/list:
 *   get:
 *     summary: Lấy danh sách tất cả thể loại sách
 *     tags: [Books]
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
 *                     type: string
 */
router.get('/categories/list', getCategories);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Lấy thông tin một cuốn sách
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sách
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
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Không tìm thấy sách
 */
router.get('/:id', getBook);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Tạo sách mới (Chỉ nhân viên)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - publisher
 *               - totalCopies
 *             properties:
 *               title:
 *                 type: string
 *                 example: Đắc Nhân Tâm
 *               author:
 *                 type: string
 *                 example: Dale Carnegie
 *               isbn:
 *                 type: string
 *                 example: 9786043074015
 *               publisher:
 *                 type: string
 *                 description: ID nhà xuất bản
 *               publishYear:
 *                 type: number
 *                 example: 2020
 *               category:
 *                 type: string
 *                 example: Kỹ năng sống
 *               description:
 *                 type: string
 *               totalCopies:
 *                 type: number
 *                 example: 10
 *               coverImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo sách thành công
 *       400:
 *         description: Lỗi validation
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền (chỉ nhân viên)
 */
router.post('/', protect, authorize('staff'), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Cập nhật thông tin sách (Chỉ nhân viên)
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publisher:
 *                 type: string
 *               publishYear:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               totalCopies:
 *                 type: number
 *               availableCopies:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [available, unavailable]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sách
 *       403:
 *         description: Không có quyền
 */
router.put('/:id', protect, authorize('staff'), updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Xóa sách (Chỉ nhân viên)
 *     tags: [Books]
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
 *         description: Không tìm thấy sách
 *       403:
 *         description: Không có quyền
 */
router.delete('/:id', protect, authorize('staff'), deleteBook);

module.exports = router;
