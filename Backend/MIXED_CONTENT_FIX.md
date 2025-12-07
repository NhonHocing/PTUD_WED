# 🔒 Sửa lỗi Mixed Content trong Swagger UI

## Vấn đề

Lỗi: **Mixed Content Error**
```
Mixed Content: The page at 'https://ptud-wed.onrender.com/api-docs/...' 
was loaded over HTTPS, but requested an insecure resource 
'http://ptud-wed.onrender.com/api/auth/login'. 
This request has been blocked; the content must be served over HTTPS.
```

## Nguyên nhân

1. Swagger UI đang cố gọi API bằng **HTTP** (`http://`) thay vì **HTTPS** (`https://`)
2. Browser block requests từ HTTPS page đến HTTP resource (Mixed Content Policy)
3. Swagger không tự động detect protocol đúng từ request

## Đã sửa

### 1. Thêm Trust Proxy
```javascript
app.set('trust proxy', true);
```
→ Cho phép Express đọc `x-forwarded-proto` header từ Render

### 2. Force HTTPS cho Production Domains
- Tự động detect domain `onrender.com` → force HTTPS
- Kiểm tra `x-forwarded-proto` header
- Đảm bảo Swagger spec luôn dùng HTTPS URL

### 3. Cải thiện URL Detection
- Ưu tiên `API_URL` env var (nếu có)
- Tự động replace `http://` → `https://` cho production domains
- Kiểm tra `req.secure` và `x-forwarded-proto`

## Cách kiểm tra

### 1. Deploy lại Backend trên Render

Sau khi code đã được push lên GitHub:
- Render sẽ tự động deploy
- Hoặc manual deploy từ Render Dashboard

### 2. Kiểm tra Swagger UI

1. Mở: https://ptud-wed.onrender.com/api-docs
2. Mở Browser Console (F12)
3. Kiểm tra dropdown "Servers" (góc trên bên phải):
   - Phải hiển thị: `https://ptud-wed.onrender.com` ✅
   - Không còn: `http://ptud-wed.onrender.com` ❌

### 3. Test API

1. Chọn endpoint `/api/auth/login`
2. Click "Try it out"
3. Nhập credentials
4. Click "Execute"
5. **Không còn lỗi Mixed Content** ✅

## Environment Variables cần set trên Render

Đảm bảo đã set:
```
NODE_ENV=production
API_URL=https://ptud-wed.onrender.com
```

**Lưu ý**: URL phải là `https://` (không phải `http://`)

## Nếu vẫn lỗi

### Kiểm tra 1: Environment Variables
- Vào Render Dashboard → Environment
- Đảm bảo `API_URL=https://ptud-wed.onrender.com` (với https)
- Đảm bảo `NODE_ENV=production`

### Kiểm tra 2: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) hoặc `Cmd+Shift+R` (Mac)
- Hoặc clear cache và reload

### Kiểm tra 3: Xem Network Tab
- Mở Browser DevTools → Network tab
- Test API trong Swagger
- Xem request URL:
  - ✅ Đúng: `https://ptud-wed.onrender.com/api/auth/login`
  - ❌ Sai: `http://ptud-wed.onrender.com/api/auth/login`

### Kiểm tra 4: Manual Test
Test bằng cURL để xem API có hoạt động không:
```bash
curl -X POST https://ptud-wed.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Nếu cURL work nhưng Swagger UI không work → vấn đề ở Swagger config
Nếu cả 2 đều không work → vấn đề ở backend hoặc CORS

## Tóm tắt

✅ **Đã sửa:**
- Thêm `trust proxy` để đọc protocol từ Render
- Force HTTPS cho production domains
- Auto-detect và fix HTTP → HTTPS

✅ **Cần làm:**
- Set `API_URL=https://ptud-wed.onrender.com` trên Render
- Deploy lại backend
- Test lại Swagger UI

Sau khi deploy lại, lỗi Mixed Content sẽ hết! 🎉

