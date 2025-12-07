# Library Management Frontend

Frontend cho hệ thống quản lý mượn sách thư viện được xây dựng với Vue.js 3.

## Công nghệ sử dụng

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful hand-crafted SVG icons

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Khởi chạy development server:
```bash
npm run dev
```

3. Build cho production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Cấu trúc dự án

```
src/
├── components/          # Reusable components
│   └── layout/         # Layout components (Header, Footer)
├── views/              # Page components
│   ├── auth/          # Authentication pages
│   ├── books/         # Books pages
│   ├── borrow/        # Borrow request/history pages
│   └── admin/         # Admin pages
├── router/            # Vue Router configuration
├── stores/            # Pinia stores
├── services/          # API services
├── style.css          # Global styles
└── main.js            # Application entry point
```

## Tính năng

### Khách vãng lai
- Xem danh sách sách
- Tìm kiếm và lọc sách
- Xem chi tiết sách

### Độc giả (sau khi đăng nhập)
- Quản lý tài khoản cá nhân
- Gửi yêu cầu mượn sách
- Xem lịch sử mượn-trả
- Theo dõi yêu cầu đang chờ

### Nhân viên thư viện
- Quản lý sách
- Quản lý nhà xuất bản
- Xử lý yêu cầu mượn sách
- Quản lý phiếu mượn-trả
- Quản lý độc giả

## API Integration

Frontend kết nối với backend API tại `http://localhost:3001/api` (có thể cấu hình trong `vite.config.js`).

## Development

Server sẽ chạy tại `http://localhost:5173` (mặc định).

Proxy được cấu hình để forward các request `/api/*` đến backend server.

