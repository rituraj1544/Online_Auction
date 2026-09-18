# Online Auction Platform

A full-stack auction marketplace built with Spring Boot and React. Users can create auctions, browse active listings, place bids, track wishlist items, receive notifications, and manage their profile. Admin users can review dashboard stats, manage users, and moderate auctions.

## Features

- User registration and JWT-based login
- Public auction marketplace with auction detail pages
- Authenticated auction creation, updates, and deletion
- Real-time bid and auction updates through WebSocket/STOMP
- Wishlist support for saved auctions
- User dashboard for posted, bid, and won auctions
- Notification center for auction activity
- Admin dashboard with user and auction management
- Swagger UI for backend API exploration

## Tech Stack

**Backend**

- Java 21
- Spring Boot 3.3
- Spring Security
- Spring Data JPA
- MySQL
- JWT authentication
- WebSocket/STOMP
- Springdoc OpenAPI

**Frontend**

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- SockJS and STOMP
- Chart.js

## Project Structure

```text
Auction_Java/
+-- backend/        # Spring Boot REST API, security, database, WebSocket
+-- frontend/       # React/Vite client application
`-- README.md
```

## Prerequisites

- Java 21
- Maven 3.9+
- Node.js 18+
- MySQL 8+

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rituraj1544/Auction-java.git
cd Auction-java
```

### 2. Configure the database

Create a MySQL database:

```sql
CREATE DATABASE auctions_java;
```

The backend uses this local configuration by default:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/auctions_java
spring.datasource.username=root
spring.datasource.password=
server.port=8081
```

Update `backend/src/main/resources/application.properties` if your MySQL username, password, host, or port is different.

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

Swagger UI:

```text
http://localhost:8081/swagger-ui.html
```

### 4. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:3004
```

Admin panel:

```text
http://localhost:3004/admin
```

## Default Admin Login

The application seeds a local admin account when the users table is empty:

```text
Email: admin@auction.local
Password: Admin@123
```

Change this account after first login if you deploy the project outside local development.

## API Overview

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Auctions | `GET /api/auctions`, `POST /api/auctions`, `GET /api/auctions/{id}`, `PUT /api/auctions/{id}`, `DELETE /api/auctions/{id}` |
| User Auctions | `GET /api/auctions/my`, `GET /api/auctions/won` |
| Bids | `POST /api/bids`, `GET /api/bids/{auctionId}`, `GET /api/bids/my` |
| Wishlist | `/api/wishlist` |
| Notifications | `/api/notifications` |
| Admin | `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/auction/{id}` |
| WebSocket | `/ws`, topics `/topic/bids` and `/topic/auctions` |

## Useful Commands

Run backend tests:

```bash
cd backend
mvn test
```

Build frontend:

```bash
cd frontend
npm run build
```

## Security Notes

- Replace the default `jwt.secret` before deploying.
- Move production database credentials into environment-specific configuration.
- Do not use the seeded admin password in production.

## License

This project is available for educational and portfolio use.
