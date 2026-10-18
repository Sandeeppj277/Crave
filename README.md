# Crave — Haute Cuisine Food Delivery & Operations Management Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Render-success?style=for-the-badge&logo=render)](https://crave-frontend-4l1q.onrender.com)
[![API Docs](https://img.shields.io/badge/API_Docs-Swagger_UI-blue?style=for-the-badge&logo=swagger)](https://crave-backend-js6w.onrender.com/swagger-ui/index.html)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg?style=for-the-badge)](https://spring.io/projects/spring-boot)
[![Java 21 LTS](https://img.shields.io/badge/Java-21%20LTS-orange.svg?style=for-the-badge)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg?style=for-the-badge)](https://react.dev/)
[![MySQL 8](https://img.shields.io/badge/MySQL-Aiven_Cloud-00758F.svg?style=for-the-badge&logo=mysql)](https://aiven.io/)

---

### 🌐 Live Production Deployments

| Resource | Direct Link | Description |
| :--- | :--- | :--- |
| **Live Web Application** | 🚀 **[https://crave-frontend-4l1q.onrender.com](https://crave-frontend-4l1q.onrender.com)** | Full responsive food delivery app with 1-Click role logins |
| **Cloud Backend API** | 📡 **[https://crave-backend-js6w.onrender.com](https://crave-backend-js6w.onrender.com)** | Spring Boot 3 REST API on Render |
| **Interactive Swagger Docs** | 📑 **[https://crave-backend-js6w.onrender.com/swagger-ui/index.html](https://crave-backend-js6w.onrender.com/swagger-ui/index.html)** | Live OpenAPI 3 testing console |

---

**Crave** is a full-stack, enterprise-grade food delivery application and culinary operations platform. Engineered with **Spring Boot 3 (Java 21 LTS, Maven)**, **MySQL 8 (Aiven Cloud)**, and **React 18 (Vite, JavaScript)**, Crave features a **Claymorphic Editorial UI Design System** with strict role-based access control (RBAC), multi-stage order pipelines, and all transactions computed in **Indian Rupees (₹)**.

---

## 🌟 Key Highlights & Engineering Features

- **Strict Role Priority Matrix (RBAC)**:
  - 👑 **Admin**: Master platform oversight, dining establishment registration/deletion, and live order fulfillment pipeline management.
  - 🍳 **Restaurant Owner**: Direct kitchen menu management — adds signature dishes, adjusts Rupee pricing, manages recipes, and toggles stock in real-time.
  - 🛍️ **Customer**: Explores curated venues, manages cart bag, and places authenticated orders in Indian Rupees (`₹`).
  - *Strict Separation of Concerns*: Admins and Owners cannot place food orders; ordering is exclusively reserved for customers.
- **Enterprise Spring Boot 3 Backend**:
  - Stateless JWT authentication filter with JJWT (`io.jsonwebtoken 0.12.x`) and BCrypt password encryption.
  - Spring Data JPA with Hibernate, HikariCP connection pooling, and optimistic concurrency.
  - Indian taxation & delivery math: 5% GST, complimentary express delivery over ₹300 (or ₹40 flat fee).
- **Claymorphic Editorial Design System**:
  - Double exterior drop-shadows combined with inset rim lighting for inflated, tactile clay depth.
  - Responsive layout with high-definition brand emblem, interactive hover physics, and zero developer jargon in consumer views.
- **Interactive OpenAPI 3 / Swagger Documentation**: Available locally at `http://localhost:8080/swagger-ui.html` and live in cloud at `https://crave-backend-js6w.onrender.com/swagger-ui/index.html`.
- **Production-Ready Containerization**: Dockerfiles for backend & frontend plus single-command `docker-compose.yml`.

---

## 👤 1-Click Credentials & Role Hierarchy

| Role | Email | Password | Primary Responsibility | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@crave.com` | `password123` | **Overall Process Control** | Create/delete restaurants, view all live orders across the platform, and advance fulfillment (`CONFIRMED` &rarr; `PREPARING` &rarr; `OUT_FOR_DELIVERY` &rarr; `DELIVERED`). |
| **Owner** | `owner@crave.com` | `password123` | **Menu & Kitchen Curation** | Add dishes to restaurant menus, edit recipe prices in ₹, toggle live availability (`In Stock` / `Sold Out`), and delete items. |
| **Customer** | `customer@crave.com` | `password123` | **Fine Food Ordering** | Browse culinary venues, add dishes to order bag, and place orders in Indian Rupees (₹). |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Java 21 LTS**
- **Node.js 18+** & npm
- **MySQL 8.0** running on `localhost:3306` (database: `crave_db`, user: `root`, password: `root`)

### 1. Database Setup
```sql
CREATE DATABASE IF NOT EXISTS crave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup
```bash
cd crave-backend
mvn spring-boot:run
```
> The backend runs on `http://localhost:8080` and automatically seeds initial restaurants, menus, and users on first boot.

### 3. Frontend Setup
```bash
cd crave-frontend
npm install
npm run dev
```
> The frontend runs on `http://localhost:5173`.

---

## 🐳 Docker Deployment (Single Command)

To run the entire full-stack application (MySQL + Spring Boot + React/Nginx) with Docker Compose:

```bash
docker compose up --build -d
```

- **Frontend Application**: `http://localhost:80`
- **Backend API**: `http://localhost:8080/api`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`
- **MySQL Database**: `localhost:3306`

To shut down:
```bash
docker compose down
```

---

## ☁️ Cloud Architecture & Deployment (Render + Aiven)

The application is deployed across high-availability cloud infrastructure:

- **Database**: Cloud MySQL hosted on **Aiven** (`mysql-1a18b3e8-sandeeppj277-221c.j.aivencloud.com:16925`)
- **Backend Web Service**: Containerized Spring Boot 3 running on **Render** (`https://crave-backend-js6w.onrender.com`)
- **Frontend Static Site**: React 18 production build on **Render Global CDN** (`https://crave-frontend-4l1q.onrender.com`)
- **Infrastructure Blueprint**: Managed seamlessly through the root [`render.yaml`](./render.yaml) file in this repository.

---

## 📦 Repository Structure

```text
Crave/
├── crave-backend/             # Spring Boot 3 REST API (Java 21 LTS, Maven, JPA)
│   ├── src/main/java/com/crave/
│   │   ├── config/            # DataInitializer (Pre-seeded menus & accounts)
│   │   ├── controller/        # Auth, Restaurant, MenuItem, Order, Root controllers
│   │   ├── model/             # User, Restaurant, MenuItem, Order entities
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── security/          # JWT Filter, UserDetailsService, SecurityConfig
│   │   └── service/           # Business logic & transactional operations
│   └── Dockerfile
├── crave-frontend/            # React 18 SPA (Vite, Tailwind CSS, Lucide icons)
│   ├── src/
│   │   ├── api/               # Axios client connected to live backend
│   │   ├── components/        # Modals, Navigation, Cart, Management portals
│   │   └── App.jsx            # Main app shell & Claymorphic theme
│   ├── .env.production        # Production environment config
│   └── Dockerfile
├── docker-compose.yml         # Full local orchestration
├── render.yaml                # Render Blueprint automated deployment spec
└── README.md                  # Project documentation & live links
```
