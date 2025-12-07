# 🐛 Debug: Frontend không call được Backend

## Vấn đề

Frontend trên Vercel không call được backend trên Render:
- Trang books hiển thị "Không tìm thấy sách nào"
- API calls thất bại
- Swagger UI đã work (backend OK)

## Các bước debug

### Bước 1: Kiểm tra Environment Variable trong Vercel

1. **Vào Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Chọn project `ptud-wed`

2. **Kiểm tra Environment Variables:**
   - Settings → Environment Variables
   - Tìm biến `VITE_API_URL`
   - **Value phải là**: `https://ptud-wed.onrender.com`
   - **Không có dấu `/` ở cuối**

3. **Nếu chưa có hoặc sai:**
   - Add New hoặc Edit
   - Key: `VITE_API_URL`
   - Value: `https://ptud-wed.onrender.com`
   - Environments: ✅ Production ✅ Preview ✅ Development
   - Save

4. **Redeploy:**
   - Deployments → Latest deployment → Redeploy

### Bước 2: Kiểm tra Browser Console

1. **Mở website Vercel:**
   - https://ptud-wed-ebc7.vercel.app

2. **Mở Browser Console (F12)**

3. **Kiểm tra logs:**
   - Tìm log: `🔗 API Base URL: ...`
   - Phải hiển thị: `https://ptud-wed.onrender.com`
   - Nếu hiển thị `/api` → Environment variable chưa được set hoặc chưa redeploy

4. **Kiểm tra Network tab:**
   - Thử load trang books
   - Xem request đến API
   - Request URL phải là: `https://ptud-wed.onrender.com/api/books`
   - Không phải: `https://ptud-wed-ebc7.vercel.app/api/books`

### Bước 3: Kiểm tra CORS trên Render

1. **Vào Render Dashboard:**
   - https://dashboard.render.com
   - Chọn service `ptud-wed`

2. **Kiểm tra Environment Variables:**
   - Tìm `CORS_ORIGIN`
   - Phải có: `https://ptud-wed-ebc7.vercel.app`
   - Hoặc để `*` (cho phép tất cả - không khuyến nghị production)

3. **Nếu chưa có:**
   - Add New
   - Key: `CORS_ORIGIN`
   - Value: `https://ptud-wed-ebc7.vercel.app`
   - Save và redeploy

### Bước 4: Test Backend trực tiếp

Test xem backend có hoạt động không:

```bash
# Test health endpoint
curl https://ptud-wed.onrender.com/health

# Test books endpoint
curl https://ptud-wed.onrender.com/api/books?limit=5
```

Nếu cả 2 đều trả về data → Backend OK
Nếu lỗi → Vấn đề ở backend

### Bước 5: Kiểm tra Browser Console Errors

Mở Console và xem có lỗi gì:

**Lỗi CORS:**
```
Access to fetch at 'https://ptud-wed.onrender.com/api/books' 
from origin 'https://ptud-wed-ebc7.vercel.app' has been blocked by CORS policy
```
→ Cần set `CORS_ORIGIN` trên Render

**Lỗi Network:**
```
Failed to fetch
Network Error
```
→ Kiểm tra:
- Backend có đang chạy không
- URL có đúng không
- CORS đã được cấu hình chưa

**Lỗi 404:**
```
404 Not Found
```
→ Kiểm tra:
- URL endpoint có đúng không
- Routes có được đăng ký đúng không

## Checklist

- [ ] `VITE_API_URL` đã được set trong Vercel = `https://ptud-wed.onrender.com`
- [ ] Đã redeploy frontend sau khi set env var
- [ ] Browser console log hiển thị đúng API URL
- [ ] Network tab shows requests đến `https://ptud-wed.onrender.com`
- [ ] `CORS_ORIGIN` đã được set trên Render = `https://ptud-wed-ebc7.vercel.app`
- [ ] Backend đang chạy (test bằng curl hoặc Swagger)
- [ ] Không có lỗi CORS trong console

## Quick Fix

Nếu vẫn không work, thử:

1. **Clear browser cache và hard refresh:**
   - `Ctrl+Shift+R` (Windows) hoặc `Cmd+Shift+R` (Mac)

2. **Test trong Incognito/Private window:**
   - Để tránh cache issues

3. **Kiểm tra lại tất cả env vars:**
   - Vercel: `VITE_API_URL=https://ptud-wed.onrender.com`
   - Render: `CORS_ORIGIN=https://ptud-wed-ebc7.vercel.app`

4. **Redeploy cả 2:**
   - Frontend trên Vercel
   - Backend trên Render

## Debug Commands

Mở Browser Console và chạy:

```javascript
// Check API URL
console.log('API URL:', import.meta.env.VITE_API_URL)

// Test API call manually
fetch('https://ptud-wed.onrender.com/api/books?limit=5')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Nếu manual fetch work → Vấn đề ở code frontend
Nếu manual fetch không work → Vấn đề ở backend hoặc CORS

