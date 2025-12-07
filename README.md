# Hệ thống Quản lý Mượn Sách Thư viện

Hệ thống quản lý mượn sách thư viện với backend Node.js/Express và frontend Vue.js.

## Cấu trúc dự án

```
PTUD_WED/
├── Backend/          # Backend API (Node.js + Express + MongoDB)
└── Frontend/         # Frontend (Vue.js 3 + Vite)
```

## Cài đặt và chạy

### Backend

1. Di chuyển vào thư mục Backend:
```bash
cd Backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env`:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Chạy seed data (tùy chọn):
```bash
npm run seed
```

5. Khởi động server:
```bash
npm run dev
```

Backend sẽ chạy tại `http://localhost:3001`
Swagger UI: `http://localhost:3001/api-docs`

### Frontend

1. Di chuyển vào thư mục Frontend:
```bash
cd Frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Khởi động development server:
```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## Tính năng

### Khách vãng lai
- Xem danh sách sách
- Tìm kiếm và lọc sách
- Xem chi tiết sách

### Độc giả (sau khi đăng nhập)
- Quản lý tài khoản cá nhân
- Gửi yêu cầu mượn sách trực tuyến
- Xem lịch sử mượn-trả
- Theo dõi yêu cầu đang chờ xử lý

### Nhân viên thư viện
- Quản lý danh mục sách (CRUD)
- Quản lý nhà xuất bản (CRUD)
- Quản lý thông tin độc giả
- Tạo và cập nhật phiếu mượn-trả
- Xử lý yêu cầu mượn sách
- Tra cứu dữ liệu

## Công nghệ

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- Vue.js 3
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS
- Heroicons

## Tài khoản mẫu

Sau khi chạy seed data, bạn có thể sử dụng:

**Nhân viên:**
- Username: `admin`
- Password: `admin123`

**Độc giả:**
- Username: `reader1`
- Password: `123456`

## API Documentation

Truy cập Swagger UI tại: `http://localhost:3001/api-docs`

## License

ISC
