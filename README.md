# Jewelry Shop - MERN Stack Application

This project is a **MERN stack** e-commerce web application for a **Jewelry Shop** with authentication, cart, payment integration (Razorpay), and an admin panel to manage products.

## 🚀 Features

- **User Authentication:** Register/Login with JWT authentication.
- **Product Management:** Browse, filter, and add to cart.
- **Cart & Checkout:** Manage cart with quantity controls & checkout via Razorpay.
- **Admin Panel:** Add, edit, delete products (for admin users only).
- **Profile Management:** Update user details, reset password, and delete account.
- **Order History:** View past and ongoing orders.

---

# 🛠 Installation Guide

Follow the steps below to set up and run the **Jewelry Shop** project from scratch.

## 1️⃣ Install Node.js

- **Required Version:** `20.18.0`
- Download & Install from: [Node.js Official Website](https://nodejs.org/)
- Verify Installation:
  ```sh
  node -v
  ```

## 2️⃣ Install MongoDB

- **Download & Install:** [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Start MongoDB:
  ```sh
  mongod
  ```
- Check MongoDB is running:
  ```sh
  mongo
  ```

---

# 🔥 Backend Setup (Express + MongoDB)

## 1️⃣ Clone the Repository

```sh
git clone https://github.com/ANKIT161020/Jewellery_App.git
cd jewelry-shop
```

## 2️⃣ Install Backend Dependencies

```sh
cd backend
npm install
```

## 3️⃣ Configure Environment Variables

Create a `.env` file inside the `backend` folder and add:

```env
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_KEY="your_cloudinary_api_key"
CLOUDINARY_SECRET="your_cloudinary_api_secret"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

## 4️⃣ Start the Backend Server

```sh
npm start
```

Server runs at: **`http://localhost:5000`**

---

# 💎 Frontend Setup (React + Vite)

## 1️⃣ Install Frontend Dependencies

```sh
cd ../frontend
npm install
```

## 2️⃣ Start the Frontend Server

```sh
npm run dev
```

Frontend runs at: **`http://localhost:5173`**

---

# 💳 Razorpay Test Account Setup

1. **Sign up on Razorpay**: [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Get API Keys**:
   - Go to **Settings > API Keys**
   - Generate **Key ID** and **Key Secret**
   - Add these to `.env` file in backend
3. **Enable Test Mode** to simulate transactions.

---

# 📁 Project Folder Structure

```
/jewelry-shop
│── backend   # Node.js, Express, MongoDB
│   ├── models   # Mongoose models
│   ├── routes   # API routes
│   ├── config   # Database & API configurations
│   ├── index.js # Server entry point
│
│── frontend  # React + Vite
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── styles
│   │   ├── App.jsx
│   │   ├── main.jsx
│
│── .env  # Backend Environment Variables
│── README.md  # Documentation
```

---

# 🔗 API Endpoints

### **Authentication**

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| POST   | `/api/auth/register` | Register user  |
| POST   | `/api/auth/login`    | User login     |
| PUT    | `/api/users/:id`     | Update profile |
| DELETE | `/api/users/:id`     | Delete account |

### **Products**

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/products`     | Fetch all products     |
| GET    | `/api/products/:id` | Fetch single product   |
| POST   | `/api/products`     | Add product (Admin)    |
| PUT    | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### **Cart & Orders**

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| POST   | `/api/payment/create-order`   | Create Razorpay order |
| POST   | `/api/payment/verify-payment` | Verify payment        |
| GET    | `/api/orders/:userId`         | Fetch user orders     |

---

# 🚀 Running the Application

1️⃣ **Start MongoDB**

```sh
mongod
```

2️⃣ **Run Backend**

```sh
cd backend
npm start
```

3️⃣ **Run Frontend**

```sh
cd frontend
npm run dev
```

4️⃣ **Open the App**

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

# 📌 Notes

- **Admin Access**: Manually set `is_admin = true` in MongoDB for an admin user.
- **Test Payments**: Use Razorpay **Test Mode** for transactions.
- **Deployment**: Use **Render/Vercel** for frontend & **Railway/Heroku** for backend.

---

# 💡 Need Help?

For any issues, feel free to ask in **GitHub Issues**.

Happy coding! 🎉
