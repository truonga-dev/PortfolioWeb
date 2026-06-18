# 🚀 Modern Portfolio — Full-Stack Personal Website

<div align="center">

### Build • Create • Share

Modern Full-Stack Portfolio with **React, Node.js, MongoDB Atlas, AI ChatBot, Admin Dashboard, Analytics and Multi-Language Support**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📌 Overview

A modern full-stack portfolio platform built for showcasing projects, blogging, AI interaction, and content management.

This project combines:

* Interactive portfolio experience
* Real-time admin dashboard
* AI assistant integration
* Content publishing workflow
* Analytics and visitor tracking
* Production-ready backend architecture

---

# ✨ Features

## 🌐 Public Website

* Hero section with introduction
* Download CV
* Social media integration
* Project showcase
* Advanced filtering
* Skill visualization
* Blog system
* Like / Comment / Share
* Contact form
* Email notifications
* Dark / Light mode
* Responsive UI
* Vietnamese / English support

---

## 🤖 AI ChatBot

Powered by **Groq + Llama**

Features:

* AI conversation
* Language detection
* Quick replies
* Voice input
* Chat history
* Context awareness

---

## ⚙️ Admin Dashboard

Complete content management:

### Dashboard

* Statistics overview
* Visitor insights

### Project Manager

* Create / Update / Delete
* Search
* Pagination

### Blog Manager

* Rich Text Editor
* Draft / Publish
* Upload images

### Message Manager

* Inbox
* Archive
* Reply system

### Analytics

* Charts
* Export PDF / CSV

### Settings

* Profile
* Social links
* SEO

---

# 🔒 Security

* JWT Authentication
* Password Hashing (bcrypt)
* Helmet Protection
* Rate Limiting
* CORS Security
* HTML Sanitization

---

# 🛠 Tech Stack

| Frontend      | Backend    | Database      | Services   |
| ------------- | ---------- | ------------- | ---------- |
| React 18      | Node.js    | MongoDB Atlas | Groq AI    |
| Vite          | Express    | Mongoose      | Nodemailer |
| Tailwind CSS  | JWT        |               | Socket.io  |
| Framer Motion | Helmet     |               | PDF Export |
| React Router  | Rate Limit |               | i18n       |

---

# 📁 Project Structure

```bash
modern-portfolio/

server/
├── models/
├── routes/
├── middleware/
├── utils/
├── socket.js
├── server.js
├── seed.js

client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   └── App.jsx

.env
README.md
```

---

# 🚀 Installation

## Clone Project

```bash
git clone https://github.com/truonga-dev/PortfolioWeb.git
cd PortfolioWeb
```

---

## Backend Setup

```bash
cd server

npm install
cp .env.example .env
```

Update environment variables.

Run:

```bash
npm run seed
npm run dev
```

Backend:

```bash
http://localhost:5000
```

---

## Frontend Setup

```bash
cd client

npm install
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

Admin:

```bash
http://localhost:5173/admin
```

Default Password:

```text
admin123
```

---

# 🔑 Environment Variables

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=

EMAIL_TO=

GROQ_API_KEY=

CLIENT_URL=

NODE_ENV=development
```

---

# 🌐 API Overview

## Public

```http
GET /api/projects
GET /api/skills
GET /api/blog
POST /api/contact
POST /api/chatbot
GET /api/settings/public
```

## Admin

```http
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

POST /api/blog
PUT /api/blog/:id
DELETE /api/blog/:id
```

---

# 🚀 Deployment

## Frontend (Vercel)

```bash
cd client

npm install -g vercel

vercel

vercel --prod
```

---

## Backend (Render)

* Create Web Service
* Connect GitHub
* Root Directory → server
* Build → npm install
* Start → node server.js

Add environment variables.

---

# 📷 Screenshots

Add screenshots here:

```text
/docs/home.png
/docs/admin.png
/docs/chatbot.png
```

---

# 👨‍💻 Author

**Truong A**
Full-Stack Developer

GitHub:
@truonga102005vn

Email:
[truonga01.dev@gmail.com](mailto:truonga01.dev@gmail.com)

---

# ⭐ Support

If you find this project useful:

⭐ Star the repository
🍴 Fork the project
📩 Share feedback

---

MIT License © Truong A
