# Hệ thống Quản lý Mượn Sách Thư viện - Backend API

Backend API cho hệ thống quản lý mượn sách thư viện được xây dựng với Node.js, Express.js và MongoDB.

## Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Xác thực người dùng
- **bcryptjs** - Mã hóa mật khẩu
- **Swagger/OpenAPI** - API documentation và testing

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` và cấu hình:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Đảm bảo MongoDB đang chạy

4. Khởi chạy server:
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

## Cấu trúc dự án

```
├── config/
│   └── database.js          # Cấu hình kết nối MongoDB
├── controllers/             # Business logic
│   ├── authController.js
│   ├── bookController.js
│   ├── borrowRequestController.js
│   ├── borrowSlipController.js
│   ├── publisherController.js
│   └── userController.js
├── middleware/              # Middleware
│   ├── auth.js             # Xác thực và phân quyền
│   └── errorHandler.js     # Xử lý lỗi
├── models/                 # Database models
│   ├── Book.js
│   ├── BorrowRequest.js
│   ├── BorrowSlip.js
│   ├── Publisher.js
│   └── User.js
├── routes/                 # API routes
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── borrowRequestRoutes.js
│   ├── borrowSlipRoutes.js
│   ├── publisherRoutes.js
│   ├── userRoutes.js
│   └── index.js
├── utils/
│   └── generateToken.js    # Tạo JWT token
├── server.js               # Entry point
└── package.json
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Đăng ký tài khoản (Public)
- `POST /api/auth/login` - Đăng nhập (Public)
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại (Private)

### Books (`/api/books`)

- `GET /api/books` - Lấy danh sách sách (Public, có phân trang và tìm kiếm)
- `GET /api/books/:id` - Lấy thông tin một cuốn sách (Public)
- `GET /api/books/categories/list` - Lấy danh sách categories (Public)
- `POST /api/books` - Tạo sách mới (Staff only)
- `PUT /api/books/:id` - Cập nhật sách (Staff only)
- `DELETE /api/books/:id` - Xóa sách (Staff only)

### Publishers (`/api/publishers`)

- `GET /api/publishers` - Lấy danh sách nhà xuất bản (Public)
- `GET /api/publishers/:id` - Lấy thông tin một nhà xuất bản (Public)
- `POST /api/publishers` - Tạo nhà xuất bản mới (Staff only)
- `PUT /api/publishers/:id` - Cập nhật nhà xuất bản (Staff only)
- `DELETE /api/publishers/:id` - Xóa nhà xuất bản (Staff only)

### Borrow Requests (`/api/borrow-requests`)

- `POST /api/borrow-requests` - Tạo yêu cầu mượn sách (Reader only)
- `GET /api/borrow-requests/my-requests` - Lấy yêu cầu của mình (Reader only)
- `PUT /api/borrow-requests/:id/cancel` - Hủy yêu cầu (Reader only)
- `GET /api/borrow-requests` - Lấy tất cả yêu cầu (Staff only)
- `PUT /api/borrow-requests/:id/process` - Xử lý yêu cầu (duyệt/từ chối) (Staff only)

### Borrow Slips (`/api/borrow-slips`)

- `POST /api/borrow-slips` - Tạo phiếu mượn sách (Staff only)
- `GET /api/borrow-slips` - Lấy danh sách phiếu mượn (Private)
- `GET /api/borrow-slips/:id` - Lấy thông tin một phiếu mượn (Private)
- `GET /api/borrow-slips/my-history` - Lấy lịch sử mượn-trả của mình (Reader only)
- `PUT /api/borrow-slips/:id/return` - Trả sách (Staff only)

### Users (`/api/users`)

- `PUT /api/users/profile` - Cập nhật thông tin cá nhân (Private)
- `PUT /api/users/change-password` - Đổi mật khẩu (Private)
- `GET /api/users/readers` - Lấy danh sách độc giả (Staff only)
- `GET /api/users/readers/:id` - Lấy thông tin một độc giả (Staff only)
- `PUT /api/users/readers/:id` - Cập nhật thông tin độc giả (Staff only)

## Phân quyền

### Khách vãng lai (Public)
- Xem danh sách sách
- Tìm kiếm sách
- Xem thông tin sách
- Xem danh sách nhà xuất bản

### Độc giả (Reader - sau khi đăng nhập)
- Tất cả quyền của khách vãng lai
- Quản lý tài khoản cá nhân
- Gửi yêu cầu mượn sách
- Xem lịch sử mượn-trả
- Theo dõi yêu cầu đang chờ

### Nhân viên thư viện (Staff)
- Tất cả quyền của độc giả
- Quản lý danh mục sách (CRUD)
- Quản lý nhà xuất bản (CRUD)
- Quản lý thông tin độc giả
- Tạo và cập nhật phiếu mượn-trả
- Xử lý yêu cầu mượn sách
- Tra cứu dữ liệu

## Xác thực

API sử dụng JWT (JSON Web Token) để xác thực. Khi đăng nhập thành công, token sẽ được trả về và cần được gửi kèm trong header:

```
Authorization: Bearer <token>
```

## Ví dụ Request

### Đăng ký
```json
POST /api/auth/register
{
  "username": "docgia1",
  "email": "docgia1@example.com",
  "password": "123456",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC"
}
```

### Đăng nhập
```json
POST /api/auth/login
{
  "username": "docgia1",
  "password": "123456"
}
```

### Tạo yêu cầu mượn sách
```json
POST /api/borrow-requests
Authorization: Bearer <token>
{
  "book": "book_id_here",
  "expectedBorrowDate": "2024-01-15",
  "expectedReturnDate": "2024-01-30",
  "note": "Cần sách cho nghiên cứu"
}
```

## Swagger API Documentation

Sau khi khởi động server, truy cập Swagger UI tại:
```
http://localhost:3001/api-docs
```

Swagger UI cung cấp:
- Tài liệu API đầy đủ với tất cả endpoints
- Thử nghiệm API trực tiếp từ trình duyệt
- Xem request/response schemas
- Xác thực JWT token để test các API protected

### Cách sử dụng Swagger UI:

1. Khởi động server: `npm run dev`
2. Mở trình duyệt và truy cập: `http://localhost:3001/api-docs`
3. Để test các API yêu cầu authentication:
   - Đăng nhập qua endpoint `/api/auth/login`
   - Copy token từ response
   - Click nút "Authorize" ở đầu trang Swagger
   - Dán token vào (không cần "Bearer", chỉ cần token)
   - Click "Authorize" và "Close"
   - Bây giờ bạn có thể test các API protected

## Lưu ý

- Đảm bảo MongoDB đang chạy trước khi khởi động server
- Thay đổi `JWT_SECRET` trong file `.env` cho môi trường production
- Tất cả ngày tháng sử dụng định dạng ISO 8601 hoặc Date object
- Swagger documentation được tự động tạo từ JSDoc comments trong các file routes

