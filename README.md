# 🍅 Tomato - Food Delivery Application

A full-stack food delivery platform built with the MERN stack, featuring secure authentication, Stripe payments, Redis caching, and an admin dashboard for seamless food ordering and management.

---

## 📌 Problem

Existing food delivery platforms often suffer from slow performance, complex user flows, and inefficient menu and order management, leading to a poor user experience.

---

## 💡 Solution

Tomato provides a fast, secure, and responsive food ordering experience with real-time cart management, Redis caching for improved performance, Stripe payment integration, and a dedicated admin panel for managing food items and orders.

---

## 🛠 Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database & Cache**
- MongoDB
- Redis

**Authentication**
- JWT
- Google OAuth

**Cloud & Payments**
- Cloudinary
- Stripe

**Deployment**
- Vercel (Frontend & Admin)
- Render (Backend)

---

## ✨ Features

- 🔐 JWT & Google OAuth Authentication
- 🍔 Food Browsing & Category Filters
- 🛒 Shopping Cart Management
- 💳 Secure Stripe Payments
- ⚡ Redis Caching for Faster API Responses
- 📦 Order Tracking
- 🛠️ Admin Dashboard for Food & Order Management
- 📱 Fully Responsive UI

---
## 📷 Sample Images

### Home Page (Hero Banner)

![Home Hero](images/home_hero.png)

---

### Explore Menu & Popular Dishes

![Home Menu](images/home_menu.png)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repo-url>
cd Tomato
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGOURL=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

### 4. Admin Panel Setup
1. Navigate to the admin directory:
   ```bash
   cd ../admin/vite-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `admin/vite-project/` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the admin panel:
   ```bash
   npm run dev
   ```
