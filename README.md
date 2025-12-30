# 🛒 MERN E-commerce Platform

A full-stack **E-commerce web application** built using the **MERN Stack** with secure authentication, online payments, Cash on Delivery (COD), and an **admin management system**.  
Designed with real-world features, clean architecture, and responsive UI for all devices.

---

## 🚀 Features

### 👤 User Features
- User authentication & authorization (JWT)
- Browse products with images & details
- Add to cart & manage orders
- Secure payments using **Stripe**
- **Cash on Delivery (COD)** option
- Order tracking and status updates
- Fully responsive UI (mobile, tablet & desktop)

### 🛠 Admin Features
- Admin dashboard
- Add, update & delete products
- Manage orders & order status
- Real-time order status updates
- Image upload & management
- Product inventory management

---

## 🧰 Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- Bcrypt (password hashing)
- Validator

### Payments
- Stripe
- Cash on Delivery (COD)

### Media & Utilities
- Multer
- CORS
- Dotenv

---

## 🌐 Live Demo
🔗 **Live Site:** https://ecommerce-mern.vercel.app

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js
- MongoDB
- Stripe account

---

### Clone the repository
```bash
git clone https://github.com/dir-hub/E-commerce-App.git
cd E-commerce-App
```

### Backend Setup
```bash
cd backend
npm install
npm run server
```

Create a `.env` file inside backend and add:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

---

## 🏗️ Project Structure
```
E-commerce App/
├── backend/           # Node.js & Express API
├── frontend/          # React User Interface
├── admin/            # React Admin Dashboard
└── README.md
```

---

## 📌 Key Features Implemented

### Authentication System
- JWT-based secure authentication
- Protected routes for users and admin
- Token validation middleware

### Payment Integration
- Stripe payment gateway
- Cash on Delivery option
- Order confirmation system

### Admin Management
- Product CRUD operations
- Order status management
- Real-time updates

### User Experience
- Responsive design
- Cart management
- Order tracking
- Toast notifications

---

## 📚 Learning Outcome
This project helped me gain hands-on experience in:
- Full-stack application architecture
- Secure payment integration
- Real-world authentication & authorization
- State management with React Context
- Writing clean, scalable REST APIs
- Admin panel development

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

---

## 📩 Contact
**Dhiraj Roy**  
Full-Stack Developer (MERN)  
🔗 LinkedIn: www.linkedin.com/in/dhiraj-roy7

---

⭐ If you like this project, don't forget to give it a star!