# MERN E-Commerce — Backend (Node.js + Express + MongoDB)

A **production-ready e-commerce backend** built with Node.js, Express, and MongoDB (Mongoose).  
It includes **JWT authentication (access + refresh), role-based authorization, product & order management, and Stripe test integration** (with a placeholder for iyzico adapter).

---

## 🚀 Features
- **Authentication:** JWT (Access + Refresh) with httpOnly cookie refresh endpoint  
- **User Roles:** `user`, `admin` (route protection)  
- **Products:** CRUD, search (text index), filtering, sorting, pagination  
- **Orders:** Create orders, calculate tax/shipping/total, get user orders  
- **Payments:** Stripe test **PaymentIntent** (iyzico adapter placeholder)  
- **General:** Centralized error handling, logging, CORS, morgan  

---

## 🧱 Tech Stack
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT + bcrypt  
- Stripe Node SDK  
- cookie-parser, dotenv, morgan  

---

## 📂 Project Structure
