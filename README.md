\# 🚀 Portfolio Full-Stack | Truong A



!\[React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)

!\[Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)

!\[MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

!\[Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

!\[License](https://img.shields.io/badge/License-MIT-green)

!\[Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)



> Portfolio cá nhân Full-Stack hiện đại với React, Node.js, MongoDB, AI ChatBot, đa ngôn ngữ và Admin Panel chuyên nghiệp.



\---



\## ✨ Tính Năng



\### 🏠 Trang Công Khai

\- ⚡ \*\*Hero Section\*\* - Giới thiệu bản thân, download CV, liên kết mạng xã hội

\- 📁 \*\*Projects\*\* - Hiển thị dự án với bộ lọc, modal chi tiết

\- 🎯 \*\*Skills\*\* - Thanh tiến trình kỹ năng trực quan

\- 📝 \*\*Blog\*\* - Đọc bài viết, like, comment, chia sẻ (Facebook, X, Zalo)

\- 📧 \*\*Contact\*\* - Form liên hệ với email tự động (nodemailer)

\- 🌍 \*\*Đa ngôn ngữ\*\* - Tiếng Việt / English

\- 🎨 \*\*Dark/Light Mode\*\* - Toggle theme



\### 🤖 AI ChatBot

\- 🧠 \*\*Groq AI\*\* (Llama 3.3 70B) - Trả lời thông minh

\- 🔍 \*\*Tự động nhận diện ngôn ngữ\*\* - Tiếng Việt / English

\- 💬 \*\*Quick Replies\*\* - Nút gợi ý câu hỏi

\- 🎤 \*\*Voice Input\*\* - Nhập bằng giọng nói

\- 📝 \*\*Chat History\*\* - Lưu lịch sử chat



\### ⚙️ Admin Panel

\- 📊 \*\*Dashboard\*\* - Thống kê tổng quan

\- 📁 \*\*Projects Manager\*\* - CRUD, tìm kiếm, lọc, phân trang

\- 🎯 \*\*Skills Manager\*\* - CRUD, Grid/List view

\- 📝 \*\*Blog Manager\*\* - Rich Text Editor, upload ảnh, draft/publish

\- 💬 \*\*Messages Manager\*\* - Đọc, đánh dấu sao, lưu trữ, trả lời

\- 📈 \*\*Analytics\*\* - Thống kê, biểu đồ, xuất PDF/CSV

\- ⚙️ \*\*Settings\*\* - Profile, Security, Social Links, SEO



\### 🔒 Bảo Mật

\- JWT Authentication

\- bcrypt Password Hashing

\- Helmet HTTP Headers

\- CORS Protection

\- Rate Limiting

\- HTML Sanitize



\---



\## 🛠️ Công Nghệ



| Frontend | Backend | Database | Khác |

|----------|---------|----------|------|

| React 18 | Node.js | MongoDB Atlas | Socket.io |

| Vite | Express | Mongoose | Groq AI |

| Tailwind CSS | JWT | | Nodemailer |

| Framer Motion | bcrypt | | pdfmake |

| React Router | Helmet | | PWA |

| React Quill | Rate Limit | | i18n |



\---



\## 🚀 Cài Đặt \& Chạy



\### Yêu cầu

\- Node.js 18+

\- MongoDB Atlas (hoặc local)



\### Cài đặt



```bash

\# Clone repository

git clone https://github.com/truonga-dev/PortfolioWeb.git

cd PortfolioWeb



\# Cài đặt Server

cd server

npm install



\# Tạo file .env từ mẫu

cp .env.example .env

\# Điền các thông tin: MONGO\_URI, JWT\_SECRET, EMAIL\_USER, EMAIL\_PASS, GROQ\_API\_KEY



\# Seed database (chỉ chạy 1 lần)

npm run seed



\# Chạy server

npm run dev



\# Mở terminal mới - Cài đặt Client

cd ../client

npm install



\# Chạy client

npm run dev



Truy cập

Website: http://localhost:5173



Admin: http://localhost:5173/admin



Password mặc định: admin123



📁 Cấu Trúc Thư Mục

text

modern-portfolio/

├── server/                    # Backend Node.js + Express

│   ├── models/               # Mongoose Models

│   │   ├── Project.js

│   │   ├── Skill.js

│   │   ├── Blog.js

│   │   ├── Message.js

│   │   ├── Visitor.js

│   │   └── Settings.js

│   ├── routes/               # API Routes

│   │   ├── projects.js

│   │   ├── skills.js

│   │   ├── blog.js

│   │   ├── contact.js

│   │   ├── analytics.js

│   │   ├── settings.js

│   │   └── chatbot.js

│   ├── middleware/            # Middleware

│   │   └── auth.js

│   ├── utils/                # Utilities

│   │   ├── chatbot.js        # Groq AI Integration

│   │   └── emailTemplates.js

│   ├── socket.js             # Socket.io Real-time

│   ├── server.js             # Entry Point

│   ├── seed.js               # Database Seed

│   └── .env                  # Environment Variables

│

├── client/                    # Frontend React + Vite

│   ├── src/

│   │   ├── components/

│   │   │   ├── sections/     # Hero, About, Projects, Skills, Blog, Contact, Lab, Testimonials

│   │   │   ├── features/     # ChatBot, Terminal, ExportPDF, LiveVisitor, ScrollToTop

│   │   │   ├── layout/       # Navbar, Footer, ParticleBackground

│   │   │   └── ui/           # Skeleton, LazyImage, Card3D, StarRating

│   │   ├── pages/

│   │   │   ├── Home.jsx

│   │   │   ├── NotFound.jsx

│   │   │   └── admin/        # AdminLogin, AdminLayout, Dashboard, ProjectsManager, SkillsManager, BlogManager, MessagesManager, AnalyticsManager, SettingsManager

│   │   ├── context/          # ThemeContext, LanguageContext

│   │   ├── hooks/            # useTypingEffect, useVisitorTracking, useGitHubStats

│   │   ├── utils/            # api.js, sanitize.js

│   │   ├── assets/styles/    # globals.css

│   │   ├── App.jsx

│   │   └── main.jsx

│   ├── public/               # favicon, profile.jpg, sitemap.xml, robots.txt

│   ├── index.html

│   ├── vite.config.js

│   ├── tailwind.config.js

│   └── package.json

│

├── .gitignore

├── LICENSE

└── README.md

🌐 API Endpoints

Public

Method	Endpoint	Mô tả

GET	/api/projects	Lấy danh sách dự án

GET	/api/projects/:id	Chi tiết dự án

GET	/api/skills	Lấy danh sách kỹ năng

GET	/api/blog	Lấy danh sách blog

GET	/api/blog/:slug	Chi tiết bài viết

POST	/api/blog/:id/like	Like bài viết

POST	/api/blog/:id/comment	Bình luận

POST	/api/contact	Gửi tin nhắn

POST	/api/chatbot	Chat với AI

GET	/api/settings/public	Lấy thông tin public

GET	/api/health	Health check

Admin (Yêu cầu JWT)

Method	Endpoint	Mô tả

POST	/api/projects	Thêm dự án

PUT	/api/projects/:id	Sửa dự án

DELETE	/api/projects/:id	Xóa dự án

POST	/api/skills	Thêm kỹ năng

PUT	/api/skills/:id	Sửa kỹ năng

DELETE	/api/skills/:id	Xóa kỹ năng

POST	/api/blog	Thêm bài viết

PUT	/api/blog/:id	Sửa bài viết

DELETE	/api/blog/:id	Xóa bài viết

GET	/api/blog/admin/all	Tất cả bài viết

GET	/api/contact	Danh sách tin nhắn

GET	/api/analytics/stats	Thống kê

PUT	/api/settings/profile	Cập nhật profile

PUT	/api/settings/password	Đổi mật khẩu

PUT	/api/settings/social	Cập nhật social links

PUT	/api/settings/seo	Cập nhật SEO

🎯 Deploy

Frontend (Vercel - Miễn Phí)

bash

cd client

npm i -g vercel

vercel

\# Trả lời câu hỏi, chọn default

vercel --prod

Backend (Render - Miễn Phí)

Vào Render → New Web Service



Connect GitHub repo



Root Directory: server



Build Command: npm install



Start Command: node server.js



Thêm tất cả Environment Variables từ .env



Cập nhật API URL

Sau khi deploy, sửa CLIENT\_URL trong .env thành URL Vercel.



🔑 Biến Môi Trường (.env)

env

PORT=5000

MONGO\_URI=mongodb+srv://...

JWT\_SECRET=your-secret-key

EMAIL\_USER=your-email@gmail.com

EMAIL\_PASS=your-app-password

EMAIL\_TO=your-email@gmail.com

GROQ\_API\_KEY=gsk\_...

CLIENT\_URL=http://localhost:5173

NODE\_ENV=development

👤 Tác Giả

Truong A - Full-Stack Developer



📧 Email: truonga01.dev@gmail.com



📱 Phone: +84 0347084605



🐙 GitHub: @truonga102005vn



📍 Location: Da Nang, Vietnam



📄 License

MIT License - Xem file LICENSE



🙏 Cảm Ơn

Cảm ơn bạn đã ghé thăm portfolio của tôi! Nếu bạn thấy dự án hữu ích, hãy ⭐ Star repo này nhé!



⭐ Star this repo | 🍴 Fork this repo | 📧 Contact me



\---



\## ✅ LƯU + PUSH:



```powershell

git add README.md

git commit -m "Add professional README"

git push

