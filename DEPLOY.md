# Hướng dẫn Deploy Dự án lên Vercel (Frontend) và Render (Backend)

## 📋 Tổng quan

- **Frontend**: Deploy lên Vercel (Vue.js + Vite)
- **Backend**: Deploy lên Render (Node.js + Express)
- **Database**: MongoDB Atlas (hoặc MongoDB trên Render)

---

## 🚀 Bước 1: Deploy Backend lên Render

### 1.1. Chuẩn bị

1. Đăng ký tài khoản tại [Render.com](https://render.com)
2. Tạo MongoDB database:
   - Có thể dùng MongoDB Atlas (miễn phí): [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Hoặc tạo MongoDB service trên Render

### 1.2. Tạo MongoDB Atlas (Nếu chưa có)

1. Đăng ký MongoDB Atlas
2. Tạo cluster (chọn free tier)
3. Tạo database user
4. Whitelist IP (0.0.0.0/0 để cho phép mọi IP)
5. Lấy connection string: `mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority`

### 1.3. Deploy Backend trên Render

1. **Tạo Web Service mới:**
   - Vào Render Dashboard → New → Web Service
   - Connect repository GitHub của bạn
   - Chọn repository và branch

2. **Cấu hình Build:**
   - **Name**: `library-management-backend` (hoặc tên bạn muốn)
   - **Environment**: `Node`
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
   - **Root Directory**: Để trống (hoặc `/`)

3. **Thiết lập Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   JWT_EXPIRE=30d
   ```

4. **Plan**: Chọn Free plan

5. **Click "Create Web Service"**

6. **Lưu lại URL backend**: `https://your-backend-name.onrender.com`

### 1.4. (Tùy chọn) Sử dụng render.yaml

Nếu bạn muốn tự động hóa, có thể sử dụng file `render.yaml` đã tạo:
- Render sẽ tự động đọc file này
- Hoặc bạn có thể import từ file khi tạo service

---

## 🎨 Bước 2: Deploy Frontend lên Vercel

### 2.1. Chuẩn bị

1. Đăng ký tài khoản tại [Vercel.com](https://vercel.com)
2. Cài đặt Vercel CLI (tùy chọn):
   ```bash
   npm i -g vercel
   ```

### 2.2. Cập nhật API URL

1. Tạo file `.env.production` trong thư mục `Frontend/`:
   ```env
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

2. Hoặc sẽ set trong Vercel Dashboard (xem bước 2.3)

### 2.3. Deploy qua Vercel Dashboard

1. **Import Project:**
   - Vào Vercel Dashboard → Add New → Project
   - Connect repository GitHub
   - Chọn repository

2. **Cấu hình Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables:**
   - Click vào "Environment Variables"
   - Thêm biến mới:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://your-backend-name.onrender.com` (URL backend từ Render)
     - **Environment**: Chọn cả 3: Production, Preview, Development
   - Click "Save"

4. **Click "Deploy"**

**⚠️ Lưu ý:** Nếu bạn đã deploy rồi và gặp lỗi về environment variable:
- Vào Project Settings → Environment Variables
- Thêm `VITE_API_URL` với giá trị là URL backend của bạn
- Redeploy lại project

### 2.4. Deploy qua Vercel CLI (Tùy chọn)

```bash
cd Frontend
vercel login
vercel --prod
```

Khi được hỏi:
- Set up and deploy? **Yes**
- Which scope? Chọn tài khoản của bạn
- Link to existing project? **No**
- Project name? `library-management-frontend`
- Directory? `./`
- Override settings? **No**

Sau đó set environment variable:
```bash
vercel env add VITE_API_URL production
# Nhập: https://your-backend-name.onrender.com
```

---

## 🔧 Bước 3: Cấu hình CORS (Quan trọng!)

### 3.1. Cập nhật Backend để cho phép CORS từ Vercel

Trong file `Backend/server.js`, cập nhật CORS:

```javascript
const cors = require('cors');

// Cấu hình CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*', // Trong production, set URL frontend cụ thể
  credentials: true,
};

app.use(cors(corsOptions));
```

Hoặc thêm vào Environment Variables trên Render:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

### 3.2. Cập nhật API service trong Frontend

File `Frontend/src/services/api.js` đã được cập nhật để sử dụng biến môi trường.

---

## 📝 Bước 4: Kiểm tra và Test

### 4.1. Test Backend

1. Truy cập: `https://your-backend-name.onrender.com/health`
2. Nên thấy: `{"success":true,"message":"Server is running",...}`
3. Truy cập: `https://your-backend-name.onrender.com/api-docs` để xem Swagger docs

### 4.2. Test Frontend

1. Truy cập URL Vercel của bạn
2. Kiểm tra console browser (F12) xem có lỗi CORS không
3. Thử đăng nhập/đăng ký

### 4.3. Seed Database (Nếu cần)

Nếu cần seed dữ liệu ban đầu, bạn có thể:
1. SSH vào Render (nếu có) hoặc
2. Tạo một endpoint tạm thời để seed
3. Hoặc chạy script seed local và kết nối với MongoDB Atlas

---

## 🔐 Bước 5: Bảo mật

### 5.1. Environment Variables quan trọng

**Backend (Render):**
- `JWT_SECRET`: Phải là chuỗi ngẫu nhiên, dài ít nhất 32 ký tự
- `MONGODB_URI`: Không được commit lên Git
- `CORS_ORIGIN`: Nên set URL frontend cụ thể thay vì `*`

**Frontend (Vercel):**
- `VITE_API_URL`: URL backend từ Render

### 5.2. Kiểm tra .gitignore

Đảm bảo các file sau đã được ignore:
```
.env
.env.local
.env.production
Backend/.env
Frontend/.env
```

---

## 🐛 Troubleshooting

### Lỗi CORS

- Kiểm tra `CORS_ORIGIN` trong Render
- Đảm bảo URL frontend đúng format (không có trailing slash)

### Backend không start

- Kiểm tra logs trên Render Dashboard
- Đảm bảo `PORT` được set đúng
- Kiểm tra MongoDB connection string

### Frontend không kết nối được API

- Kiểm tra `VITE_API_URL` trong Vercel
- Kiểm tra network tab trong browser console
- Đảm bảo backend đã deploy thành công

### Database connection failed

- Kiểm tra MongoDB Atlas IP whitelist
- Kiểm tra username/password trong connection string
- Đảm bảo cluster đã được tạo và active

---

## 📚 Tài liệu tham khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

## ✅ Checklist trước khi deploy

- [ ] MongoDB Atlas đã được setup
- [ ] Backend đã test local thành công
- [ ] Frontend đã test local thành công
- [ ] Environment variables đã được set
- [ ] CORS đã được cấu hình
- [ ] .gitignore đã có .env files
- [ ] JWT_SECRET đã được thay đổi (không dùng default)
- [ ] Database connection string đã được test

---

## 🎉 Sau khi deploy thành công

1. Test tất cả các chức năng:
   - Đăng ký/Đăng nhập
   - Xem danh sách sách
   - Quản lý sách (admin)
   - Mượn/Trả sách

2. Monitor logs trên cả Vercel và Render

3. Setup custom domain (nếu cần)

Chúc bạn deploy thành công! 🚀

