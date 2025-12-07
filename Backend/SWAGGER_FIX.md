# 🔧 Sửa lỗi Swagger UI: Failed to fetch

## Vấn đề

Khi test API trong Swagger UI, gặp lỗi:
- "Failed to fetch"
- "CORS error"
- "URL scheme must be "http" or "https" for CORS request"

## Nguyên nhân

1. Swagger UI đang cố gọi `localhost:3000` nhưng server chạy trên port `3001`
2. CORS chưa được cấu hình đúng để cho phép Swagger UI
3. Swagger servers config chưa đúng với môi trường hiện tại

## Cách sửa

### 1. Kiểm tra server đang chạy

```bash
cd Backend
npm run dev
```

Đảm bảo server chạy trên port đúng (mặc định là 3001).

### 2. Truy cập Swagger UI

- **Local**: http://localhost:3001/api-docs
- **Production**: https://ptud-wed.onrender.com/api-docs

### 3. Chọn đúng server trong Swagger UI

1. Mở Swagger UI
2. Ở góc trên bên phải, có dropdown "Servers"
3. Chọn server đúng:
   - **Development**: `http://localhost:3001`
   - **Production**: `https://ptud-wed.onrender.com`

### 4. Nếu vẫn lỗi CORS

**Cho Development (local):**
- CORS đã được cấu hình để cho phép tất cả origins trong development
- Nếu vẫn lỗi, kiểm tra xem server có đang chạy không

**Cho Production (Render):**
- Đảm bảo `CORS_ORIGIN` trên Render đã được set
- Hoặc để `CORS_ORIGIN=*` để cho phép tất cả (không khuyến nghị cho production)

### 5. Test API bằng cách khác

Nếu Swagger UI vẫn không work, có thể test bằng:

**Postman:**
```
POST https://ptud-wed.onrender.com/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**cURL:**
```bash
curl -X POST https://ptud-wed.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Browser Console:**
```javascript
fetch('https://ptud-wed.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
.then(r => r.json())
.then(console.log)
```

## Lưu ý

- Swagger UI trong browser có thể bị block bởi CORS policy
- Nếu test từ `localhost:3001/api-docs` và gọi API đến cùng domain, sẽ không có vấn đề CORS
- Nếu test từ domain khác (ví dụ: frontend Vercel), cần đảm bảo CORS đã được cấu hình đúng

## URLs

- **Local Swagger**: http://localhost:3001/api-docs
- **Production Swagger**: https://ptud-wed.onrender.com/api-docs
- **Backend Health**: https://ptud-wed.onrender.com/health

