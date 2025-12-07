# 🔧 Sửa lỗi 405: API calls từ Vercel Frontend

## Vấn đề

Lỗi: `405 Method Not Allowed` khi gọi API từ frontend Vercel
- Frontend đang gọi: `https://ptud-wed-ebc7.vercel.app/api/auth/login`
- Vercel không có backend nên trả về 405

## Nguyên nhân

Frontend đang dùng relative path `/api` thay vì URL backend từ Render vì:
- Environment variable `VITE_API_URL` chưa được set trong Vercel
- Hoặc đã set nhưng chưa redeploy

## Cách sửa

### Bước 1: Lấy URL Backend từ Render

1. Vào Render Dashboard: https://dashboard.render.com
2. Chọn service backend của bạn
3. Copy URL (ví dụ: `https://library-backend-xxx.onrender.com`)

### Bước 2: Set Environment Variable trong Vercel

1. **Vào Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Chọn project `ptud-wed`

2. **Vào Settings → Environment Variables:**
   - Click tab **Settings**
   - Chọn **Environment Variables** ở menu trái

3. **Thêm/Update biến:**
   - Nếu chưa có, click **Add New**
   - Nếu đã có, click vào biến `VITE_API_URL` để edit
   - **Key**: `VITE_API_URL`
   - **Value**: `https://ptud-wed.onrender.com` ⬅️ **URL backend của bạn**
   - **⚠️ QUAN TRỌNG**: Không có dấu `/` ở cuối!
   - **Environment**: Chọn cả 3:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

4. **Redeploy:**
   - Vào tab **Deployments**
   - Click vào deployment mới nhất
   - Click **...** → **Redeploy**
   - Hoặc push một commit mới lên GitHub

### Bước 3: Kiểm tra

Sau khi redeploy:

1. **Mở website Vercel**
2. **Mở Browser Console (F12)**
3. **Thử đăng nhập**
4. **Kiểm tra Network tab:**
   - Request phải gọi đến: `https://your-backend-name.onrender.com/api/auth/login`
   - Không phải: `https://ptud-wed-ebc7.vercel.app/api/auth/login`

## Ví dụ đúng/sai

### ✅ Đúng (cho project của bạn):
```
VITE_API_URL=https://ptud-wed.onrender.com
```
Request sẽ là: `https://ptud-wed.onrender.com/api/auth/login`

### ❌ Sai:
```
VITE_API_URL=https://ptud-wed.onrender.com/  (có dấu / ở cuối)
VITE_API_URL=http://ptud-wed.onrender.com     (dùng HTTP)
VITE_API_URL=ptud-wed.onrender.com           (thiếu https://)
```

## Debug

Nếu vẫn lỗi, kiểm tra:

1. **Console log:**
   - Mở browser console
   - Tìm log: `🔗 API URL: ...`
   - Xem URL có đúng không

2. **Network tab:**
   - Xem request URL trong Network tab
   - Đảm bảo nó gọi đến Render backend, không phải Vercel

3. **Environment Variable:**
   - Vào Vercel → Settings → Environment Variables
   - Đảm bảo `VITE_API_URL` đã được set và có giá trị đúng

4. **Redeploy:**
   - Environment variable chỉ có hiệu lực sau khi redeploy
   - Đảm bảo đã redeploy sau khi set env var

## Lưu ý về CORS

Nếu gặp lỗi CORS sau khi sửa:

1. **Vào Render Dashboard**: https://dashboard.render.com
2. **Vào service backend** `ptud-wed` → **Environment**
3. **Thêm/Update:**
   ```
   CORS_ORIGIN=https://ptud-wed-ebc7.vercel.app
   ```
   (Hoặc URL Vercel frontend của bạn nếu khác)
4. **Redeploy backend trên Render**

## Checklist

- [ ] Đã lấy URL backend từ Render
- [ ] Đã set `VITE_API_URL` trong Vercel
- [ ] URL không có dấu `/` ở cuối
- [ ] URL dùng HTTPS (không phải HTTP)
- [ ] Đã chọn cả 3 environments (Production, Preview, Development)
- [ ] Đã redeploy frontend trên Vercel
- [ ] Đã set `CORS_ORIGIN` trên Render (nếu cần)
- [ ] Đã test lại và request gọi đúng URL backend

