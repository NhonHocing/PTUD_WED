# 🔑 Environment Variables cho Deploy

## Backend (Render) - https://ptud-wed.onrender.com

### Environment Variables cần set trên Render:

```
NODE_ENV=production
# PORT không cần set - Render tự động cấp
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=30d
CORS_ORIGIN=https://ptud-wed-ebc7.vercel.app
API_URL=https://ptud-wed.onrender.com
```

**Lưu ý:**
- `API_URL`: Set để Swagger UI biết URL đúng khi test API
- `CORS_ORIGIN`: URL frontend Vercel của bạn

**Lưu ý:**
- Thay `username:password` và `cluster.mongodb.net` bằng thông tin MongoDB Atlas thực tế của bạn
- `JWT_SECRET` phải là chuỗi ngẫu nhiên dài ít nhất 32 ký tự
- `CORS_ORIGIN` là URL frontend Vercel của bạn

---

## Frontend (Vercel) - https://ptud-wed-ebc7.vercel.app

### Environment Variable cần set trên Vercel:

```
VITE_API_URL=https://ptud-wed.onrender.com
```

**⚠️ QUAN TRỌNG:**
- Không có dấu `/` ở cuối URL
- Phải dùng `https://` (không phải `http://`)
- Set cho cả 3 environments: Production, Preview, Development

---

## Cách set trong Vercel:

1. Vào: https://vercel.com/dashboard
2. Chọn project `ptud-wed`
3. Settings → Environment Variables
4. Add New:
   - Key: `VITE_API_URL`
   - Value: `https://ptud-wed.onrender.com`
   - Environments: ✅ Production ✅ Preview ✅ Development
5. Save
6. Redeploy project

---

## Test sau khi set:

1. Mở website: https://ptud-wed-ebc7.vercel.app
2. Mở Browser Console (F12)
3. Thử đăng nhập
4. Kiểm tra Network tab:
   - Request phải gọi đến: `https://ptud-wed.onrender.com/api/auth/login`
   - Không phải: `https://ptud-wed-ebc7.vercel.app/api/auth/login`

---

## URLs:

- **Frontend**: https://ptud-wed-ebc7.vercel.app
- **Backend**: https://ptud-wed.onrender.com
- **Backend Health Check**: https://ptud-wed.onrender.com/health
- **Backend API Docs**: https://ptud-wed.onrender.com/api-docs

