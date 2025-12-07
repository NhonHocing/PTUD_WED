# 🔧 Sửa lỗi: VITE_API_URL env: Not set

## Vấn đề

Console hiển thị:
```
🔗 API Base URL: /api
🔗 VITE_API_URL env: Not set
```

→ Frontend đang dùng relative path `/api` thay vì URL backend từ Render
→ Request sẽ gọi đến: `https://ptud-wed-ebc7.vercel.app/api/books` (SAI)
→ Phải gọi đến: `https://ptud-wed.onrender.com/api/books` (ĐÚNG)

## Nguyên nhân

Environment variable `VITE_API_URL` chưa được set trong Vercel, hoặc đã set nhưng chưa redeploy.

## Cách sửa (5 phút)

### Bước 1: Vào Vercel Dashboard

1. Truy cập: https://vercel.com/dashboard
2. Đăng nhập (nếu chưa)
3. Chọn project `ptud-wed` (hoặc tên project của bạn)

### Bước 2: Thêm Environment Variable

1. **Click vào project** → Vào tab **Settings**
2. **Chọn "Environment Variables"** ở menu bên trái
3. **Click nút "Add New"** (nếu chưa có) hoặc **Edit** (nếu đã có nhưng sai)
4. **Điền thông tin:**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://ptud-wed.onrender.com`
   - **⚠️ QUAN TRỌNG**: 
     - Phải có `https://` ở đầu
     - **KHÔNG có `/api` ở cuối** (code sẽ tự động thêm)
     - Không có dấu `/` ở cuối
     - Không có khoảng trắng
   - **Environment**: Chọn cả 3:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
5. **Click "Save"**

### Bước 3: Redeploy

**Cách 1: Manual Redeploy (Khuyến nghị)**
1. Vào tab **Deployments**
2. Tìm deployment mới nhất
3. Click vào 3 chấm `...` bên cạnh deployment
4. Chọn **"Redeploy"**
5. Chọn **"Use existing Build Cache"** (hoặc không, tùy bạn)
6. Click **"Redeploy"**

**Cách 2: Push commit mới**
- Push một commit mới lên GitHub
- Vercel sẽ tự động deploy

### Bước 4: Kiểm tra

1. **Đợi deploy xong** (thường 1-2 phút)
2. **Mở website**: https://ptud-wed-ebc7.vercel.app
3. **Mở Browser Console (F12)**
4. **Kiểm tra logs:**
   ```
   🔗 API Base URL: https://ptud-wed.onrender.com/api  ✅
   🔗 VITE_API_URL env: https://ptud-wed.onrender.com  ✅
   ```
   → Lưu ý: `API Base URL` sẽ có `/api` ở cuối (code tự động thêm)
5. **Kiểm tra Network tab:**
   - Load trang books
   - Xem request đến API
   - URL phải là: `https://ptud-wed.onrender.com/api/books` ✅

## Lưu ý quan trọng

### ✅ Đúng:
```
VITE_API_URL=https://ptud-wed.onrender.com
```
→ Code sẽ tự động thêm `/api` → `https://ptud-wed.onrender.com/api`

### ❌ Sai:
```
VITE_API_URL=https://ptud-wed.onrender.com/api  (KHÔNG thêm /api, code sẽ tự thêm)
VITE_API_URL=https://ptud-wed.onrender.com/     (có dấu / ở cuối)
VITE_API_URL=http://ptud-wed.onrender.com       (dùng HTTP)
VITE_API_URL=ptud-wed.onrender.com              (thiếu https://)
VITE_API_URL= https://ptud-wed.onrender.com     (có khoảng trắng ở đầu)
```

## Tại sao cần redeploy?

Environment variables chỉ có hiệu lực khi:
- **Build time** (khi Vite build app)
- Không có hiệu lực ở runtime

Vì vậy:
- Set env var → Phải redeploy để rebuild với env var mới
- Nếu chỉ set mà không redeploy → Vẫn dùng giá trị cũ (hoặc không có)

## Nếu vẫn không work sau khi redeploy

### 1. Kiểm tra lại env var:
- Vào Settings → Environment Variables
- Đảm bảo `VITE_API_URL` có giá trị đúng
- Đảm bảo đã chọn đúng environments

### 2. Clear browser cache:
- Hard refresh: `Ctrl+Shift+R` (Windows) hoặc `Cmd+Shift+R` (Mac)
- Hoặc test trong Incognito window

### 3. Kiểm tra deployment logs:
- Vào Deployments → Chọn deployment mới nhất
- Xem Build Logs
- Tìm xem có lỗi gì không

### 4. Test manual trong console:
```javascript
// Check env var
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)

// Test API call
fetch('https://ptud-wed.onrender.com/api/books?limit=5')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

## Checklist

- [ ] Đã vào Vercel Dashboard
- [ ] Đã tìm thấy project `ptud-wed`
- [ ] Đã vào Settings → Environment Variables
- [ ] Đã thêm/sửa `VITE_API_URL` = `https://ptud-wed.onrender.com`
- [ ] Đã chọn cả 3 environments (Production, Preview, Development)
- [ ] Đã Save
- [ ] Đã Redeploy
- [ ] Đã đợi deploy xong
- [ ] Đã kiểm tra console - thấy đúng URL
- [ ] Đã test và API calls work

## Kết quả mong đợi

Sau khi fix:
- Console sẽ hiển thị: `🔗 API Base URL: https://ptud-wed.onrender.com/api` (có `/api`)
- Network requests sẽ đến: `https://ptud-wed.onrender.com/api/books` ✅
- Trang books sẽ load được sách từ backend
- Không còn lỗi 404 hoặc "No books found" (nếu database có data)

