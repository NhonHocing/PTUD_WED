# 🚀 Quick Deploy Guide

## Backend (Render) - 5 phút

1. **Tạo MongoDB Atlas:**
   - Đăng ký: https://mongodb.com/cloud/atlas
   - Tạo cluster free
   - Lấy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/library_management`

2. **Deploy trên Render:**
   - Vào: https://dashboard.render.com
   - New → Web Service
   - Connect GitHub repo
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
   - **Environment Variables:**
     ```
     NODE_ENV=production
     PORT=3001
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/library_management
     JWT_SECRET=your-secret-key-min-32-chars
     JWT_EXPIRE=30d
     ```
   - Lưu URL backend: `https://xxx.onrender.com`

## Frontend (Vercel) - 3 phút

1. **Deploy trên Vercel:**
   - Vào: https://vercel.com
   - Add New → Project
   - Connect GitHub repo
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable:**
     - Key: `VITE_API_URL`
     - Value: `https://xxx.onrender.com` (URL backend từ Render)

2. **Done!** 🎉

## ⚠️ Lưu ý

- Backend có thể mất 1-2 phút để start lần đầu (free tier)
- Nếu lỗi CORS, thêm vào Render env: `CORS_ORIGIN=https://your-frontend.vercel.app`
- Test API: `https://xxx.onrender.com/health`

