# Crave — Haute Cuisine Food Delivery & Operations Management Platform

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 21 LTS](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![MySQL 8](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

**Crave** is a full-stack, enterprise-grade food delivery application and culinary operations platform. Engineered with **Spring Boot 3 (Java 21 LTS, Maven)**, **MySQL 8**, and **React 18 (Vite, JavaScript)**, Crave features a **Claymorphic Editorial UI Design System** with strict role-based access control (RBAC), multi-stage order pipelines, and all transactions computed in **Indian Rupees (₹)**.

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
- **Interactive OpenAPI 3 / Swagger Documentation**: Available at `http://localhost:8080/swagger-ui.html`.
- **Production-Ready Containerization**: Dockerfiles for backend & frontend plus single-command `docker-compose.yml`.

---

## 👤 Credentials & Role Hierarchy

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

## ☁️ Cloud Deployment Guide

### Option 1: Docker on AWS EC2 / DigitalOcean / Linode
1. Launch an Ubuntu Linux VM (2GB RAM minimum, e.g., t3.small or $12 droplet).
2. Install Docker & Docker Compose:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose
   ```
3. Clone your repository:
   ```bash
   git clone <YOUR_GIT_REPO_URL>
   cd Crave
   ```
4. Run:
   ```bash
   sudo docker compose up --build -d
   ```
5. Open port 80 and 8080 in your cloud firewall/security group.

### Option 2: Render.com / Railway.app
- **Database**: Create a MySQL database instance. Copy the connection string.
- **Backend Service**:
  - Deploy `crave-backend` as a Web Service.
  - Set Environment Variables:
    - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:<port>/<db>?useSSL=true`
    - `SPRING_DATASOURCE_USERNAME`: `<user>`
    - `SPRING_DATASOURCE_PASSWORD`: `<password>`
- **Frontend Service**:
  - Deploy `crave-frontend` as a Static Site or Docker Service.
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
  - Set `VITE_API_URL` to your backend URL.

---

## 📦 Pushing to Your GitHub Repository

```bash
# 1. Initialize Git in the Crave folder (if not done)
git init

# 2. Stage all project files
git add .

# 3. Create initial commit
git commit -m "Initial commit: Crave full-stack food delivery platform"

# 4. Connect to your GitHub repository
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

# 5. Push to main branch
git branch -M main
git push -u origin main
```
