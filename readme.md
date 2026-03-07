# Core Node.js REST API (Framework‑Free)

This repository hosts a battle‑tested, RESTful backend API implemented solely with **Node.js core modules**. No external web frameworks (e.g. Express, Koa) are used—everything from routing to request parsing is written by hand to demonstrate an in‑depth command of the Node.js runtime and HTTP internals.

---

## 🚀 Overview

- **Purpose**: Serve as both a learning tool and a production‑ready template for developers interested in low‑level Node.js architecture.
- **Design**: Modular MVC pattern with clearly defined boundaries between routes, controllers, models and utilities.
- **Security**: Built‑in JWT authentication, input validation, CORS handling, and header hardening.
- **Data Storage**: MongoDB is used for persistence via Mongoose ODM.

---

## 🔑 Core Features

1. **Custom Routing & Middleware**
   - Lightweight, hand‑rolled router that matches HTTP methods and paths.
   - Middleware support for authentication, validation and error handling.

2. **Authentication**
   - User registration and login with JWT tokens.
   - Passwords hashed with BcryptJS; tokens expire by configuration.

3. **Multipart File Uploads**
   - Manual parsing of `multipart/form-data` requests using Node.js `Buffer`.
   - Early abort for files >5 MB (using `Content-Length` header).
   - Strict extension checking (.jpg, .png, .webp) and secure storage.

4. **Security Enhancements**
   - CORS policy enforcement without external middleware.
   - Common security headers added to every response.

5. **Logging & Monitoring**
   - Custom logger captures timestamp, route, response status and duration.

6. **Database Integration**
   - Mongoose schemas, models and connection management contained under `config/`.

---

## 🛠 Technology Stack

| Layer         | Technology            |
|---------------|-----------------------|
| Runtime       | Node.js (LTS)         |
| Database      | MongoDB (+ Mongoose)  |
| Authentication| JWT, BcryptJS         |
| Configuration | dotenv                |

---

## 📁 Directory Layout

```
├── config/             # MongoDB connection & settings
├── controllers/        # Route handler logic
├── models/             # Mongoose schema definitions
├── routes/             # Path matching and dispatch
├── utils/              # Helpers: parser, validator, logger
├── uploads/            # Static file storage (images)
├── app.js              # HTTP server bootstrap
├── package.json        # Dependencies & scripts
└── readme.md           # This document
```

---

## 🛣️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file at the project root with the following variables:
   ```env
   PORT=3000
   DB_NAME=<your_db_name>
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=<secure_random_string>
   JWT_EXPIRES_IN=24h
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   The API listens on the port defined in `PORT`.

---

## 📡 Available Endpoints

### Authentication & User Management

| Method | Endpoint        | Description                        | Auth Required |\n|--------|-----------------|------------------------------------|---------------|
| POST   | `/signup`       | Create a new user                  | No            |
| POST   | `/login`        | Authenticate and obtain JWT        | No            |
| GET    | `/users`        | List users (supports query filter) | No            |
| PUT    | `/users/:id`    | Modify user by ID                  | Yes           |
| DELETE | `/users/:id`    | Remove user by ID                  | Yes           |

### File Uploads

| Method | Endpoint                 | Description                                |
|--------|--------------------------|--------------------------------------------|
| GET    | `/upload`                | Returns a basic HTML form for manual tests |
| POST   | `/upload`                | Handle raw image upload                    |
| GET    | `/uploads/:filename`     | Serve uploaded file                        |

---

## 🧠 What You’ll Learn

This codebase exposes the reader to:

* Node.js `http` module mechanics
* Buffer and stream manipulation for request bodies
* Hand‑crafted middleware and routing logic
* JWT workflows without helper libraries
* Manual multipart parsing for binary data

It is an excellent reference for developers looking to deepen their understanding of Node.js beyond abstraction layers provided by popular frameworks.

---

## ✅ License

Distributed under the [MIT License](LICENSE).

---

*Created by [Sador Uddin Bhuiyan](https://github.com/aynoncse) – feel free to fork and adapt for your projects.*
