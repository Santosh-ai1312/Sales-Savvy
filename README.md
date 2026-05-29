# 🛍 Sales Savvy — Modular E-Commerce Platform

A full-stack e-commerce application built with **Java Spring Boot** (backend) and **React.js** (frontend), featuring JWT authentication, role-based access control, and Razorpay payment integration.

---

## 🏗 Architecture

```
SalesSavvy/
├── backend/          → Spring Boot REST API
│   └── src/main/java/com/salessavvy/
│       ├── auth/     → Authentication Service (JWT)
│       ├── user/     → User Management Service
│       ├── product/  → Product Management Service
│       ├── cart/     → Cart Management Service
│       ├── order/    → Order Management Service
│       ├── payment/  → Payment Service (Razorpay)
│       ├── config/   → Security & JWT Config
│       └── exception/→ Global Exception Handler
├── frontend/         → React.js SPA
│   └── src/
│       ├── pages/auth/     → Login, Register, AdminLogin
│       ├── pages/customer/ → Home, Cart, Checkout, Orders, Profile
│       ├── pages/admin/    → Dashboard, Products, Orders, Users
│       ├── services/api.js → Axios API client
│       └── context/        → Auth Context
└── database/
    └── schema.sql    → MySQL schema + seed data
```

---

## ⚙️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Java 17, Spring Boot 3.2            |
| Security    | Spring Security, JWT (jjwt)         |
| Database    | MySQL 8+, Spring Data JPA/Hibernate |
| Frontend    | React.js 18, React Router v6        |
| HTTP Client | Axios                               |
| Payments    | Razorpay                            |
| Build       | Maven (backend), npm (frontend)     |

---

## 🚀 Setup & Running

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

### 1. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the `salessavvy_db` database with all tables and seed data including:
- **Admin account**: `admin@salessavvy.com` / `admin123`
- 6 sample products

---

### 2. Backend Setup

```bash
cd backend
```

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

Run the backend:
```bash
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend starts at: **http://localhost:3000**

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint              | Description          | Access  |
|--------|-----------------------|----------------------|---------|
| POST   | /api/auth/register    | Register customer    | Public  |
| POST   | /api/auth/user/login  | Customer login       | Public  |
| POST   | /api/auth/admin/login | Admin login          | Public  |

### Products
| Method | Endpoint                            | Description         | Access   |
|--------|-------------------------------------|---------------------|----------|
| GET    | /api/products/public                | List all products   | Public   |
| GET    | /api/products/public/{id}           | Get product details | Public   |
| GET    | /api/products/public/search?name=   | Search by name      | Public   |
| GET    | /api/products/public/category/{cat} | Filter by category  | Public   |
| POST   | /api/admin/products                 | Create product      | Admin    |
| PUT    | /api/admin/products/{id}            | Update product      | Admin    |
| DELETE | /api/admin/products/{id}            | Delete product      | Admin    |

### Cart
| Method | Endpoint              | Description      | Access   |
|--------|-----------------------|------------------|----------|
| GET    | /api/user/cart        | View cart        | Customer |
| POST   | /api/user/cart/add    | Add to cart      | Customer |
| PUT    | /api/user/cart/update | Update item qty  | Customer |
| DELETE | /api/user/cart/clear  | Clear cart       | Customer |

### Orders
| Method | Endpoint                      | Description         | Access   |
|--------|-------------------------------|---------------------|----------|
| POST   | /api/user/orders              | Place order         | Customer |
| GET    | /api/user/orders              | My orders           | Customer |
| GET    | /api/user/orders/{id}         | Order detail        | Customer |
| GET    | /api/admin/orders             | All orders          | Admin    |
| PUT    | /api/admin/orders/{id}/status | Update order status | Admin    |

### Payments
| Method | Endpoint                        | Description         | Access   |
|--------|---------------------------------|---------------------|----------|
| POST   | /api/user/payments/create/{id}  | Create Razorpay order | Customer |
| POST   | /api/user/payments/verify       | Verify payment      | Customer |

### Users (Admin)
| Method | Endpoint                       | Description      | Access |
|--------|--------------------------------|------------------|--------|
| GET    | /api/admin/users               | List all users   | Admin  |
| PUT    | /api/admin/users/{id}/role     | Update user role | Admin  |
| PUT    | /api/admin/users/{id}/status   | Update status    | Admin  |

---

## 💳 Razorpay Integration

1. Create an account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys** and generate keys
3. Add keys to `application.properties`:
   ```properties
   razorpay.key.id=rzp_test_XXXXXXXXXX
   razorpay.key.secret=XXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. The Razorpay checkout JS SDK is loaded in `public/index.html`

---

## 👤 Default Accounts

| Role     | Email                    | Password  |
|----------|--------------------------|-----------|
| Admin    | admin@salessavvy.com     | admin123  |
| Customer | Register via /register   | your choice |

---

## 🔐 Security Features

- JWT Bearer token authentication
- BCrypt password hashing
- Role-based access control (ADMIN / CUSTOMER)
- CORS configured for localhost:3000
- Razorpay HMAC-SHA256 signature verification

---

## 📱 Frontend Pages

| Page              | Route             | Access   |
|-------------------|-------------------|----------|
| Product Listing   | /                 | Public   |
| Product Detail    | /products/:id     | Public   |
| Login             | /login            | Public   |
| Register          | /register         | Public   |
| Admin Login       | /admin/login      | Public   |
| Cart              | /cart             | Customer |
| Checkout          | /checkout         | Customer |
| My Orders         | /orders           | Customer |
| Profile           | /profile          | Customer |
| Admin Dashboard   | /admin            | Admin    |
| Admin Products    | /admin/products   | Admin    |
| Admin Orders      | /admin/orders     | Admin    |
| Admin Users       | /admin/users      | Admin    |
