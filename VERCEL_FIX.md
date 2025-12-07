# 🔧 Sửa lỗi Vercel: Environment Variable "VITE_API_URL" references Secret

## Vấn đề

Lỗi: `Environment Variable "VITE_API_URL" references Secret "api_url", which does not exist`

## Nguyên nhân

File `Frontend/vercel.json` đã được cập nhật để không còn reference secret nữa. Bạn cần set environment variable trực tiếp trong Vercel Dashboard.

## Cách sửa

### Cách 1: Set trong Vercel Dashboard (Khuyến nghị)

1. **Vào Vercel Dashboard:**
   - Truy cập: https://vercel.com/dashboard
   - Chọn project của bạn

2. **Vào Settings:**
   - Click vào tab **Settings**
   - Chọn **Environment Variables** ở menu bên trái

3. **Thêm Environment Variable:**
   - Click nút **Add New**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com` (thay bằng URL backend thực tế của bạn)
   - **Environment**: Chọn cả 3:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **Save**

4. **Redeploy:**
   - Vào tab **Deployments**
   - Click vào deployment mới nhất
   - Click nút **Redeploy** (3 chấm → Redeploy)
   - Hoặc push một commit mới lên GitHub

### Cách 2: Xóa và tạo lại project

Nếu cách 1 không work:

1. Xóa project hiện tại trong Vercel
2. Tạo lại project mới
3. Khi setup, nhớ thêm Environment Variable `VITE_API_URL` ngay từ đầu

### Cách 3: Sử dụng Vercel CLI

```bash
cd Frontend
vercel env add VITE_API_URL production
# Nhập URL backend khi được hỏi: https://your-backend-name.onrender.com

vercel env add VITE_API_URL preview
# Nhập cùng URL

vercel env add VITE_API_URL development
# Nhập cùng URL hoặc http://localhost:3001 cho dev

# Sau đó redeploy
vercel --prod
```

## Kiểm tra

Sau khi redeploy, kiểm tra:

1. Vào deployment → View Function Logs
2. Kiểm tra build logs xem có lỗi không
3. Mở website và test kết nối API
4. Mở browser console (F12) → Network tab → xem request đến API có thành công không

## Lưu ý

- Environment variable phải được set **trước khi build**
- Nếu đã build rồi mới thêm env var, cần **redeploy**
- Đảm bảo URL backend đúng format (không có trailing slash `/` ở cuối)
- URL phải là HTTPS (không phải HTTP) nếu backend đã deploy production

## Ví dụ

**Đúng:**
```
VITE_API_URL=https://library-backend.onrender.com
```

**Sai:**
```
VITE_API_URL=https://library-backend.onrender.com/  (có dấu / ở cuối)
VITE_API_URL=http://library-backend.onrender.com   (dùng HTTP thay vì HTTPS)
VITE_API_URL=library-backend.onrender.com          (thiếu https://)
```

