# Custom Core Node.js Backend API (No Framework)

A professional-grade RESTful API built entirely with **Core Node.js**, without using any frameworks like Express.js. This project demonstrates a deep understanding of Node.js internals, including manual routing, middleware implementation, JWT authentication, and raw multipart/form-data parsing for image uploads.

## 🌟 Key Features

* **Modular MVC Architecture**: Clean separation of concerns with Routes, Controllers, Models, and Utils.
* **Custom Routing & Middleware**: Hand-coded router with custom authentication and validation middleware.
* **JWT Authentication**: Secure login system using JSON Web Tokens (JWT) and password hashing with Bcrypt.
* **Secure Manual Image Upload**: 
    * Handled `multipart/form-data` parsing using raw Node.js Buffers.
    * **Size Validation**: Early rejection of files larger than 5MB using `content-length` headers.
    * **Type Validation**: Strict checking for allowed image extensions (.jpg, .png, .webp).
* **Security Focused**: Implemented manual CORS handling and essential security headers.
* **Database Integration**: Connected to MongoDB using Mongoose.
* **Request Logging**: Custom logger to track API performance and status codes.

## 🛠️ Technology Stack

* **Runtime**: Node.js
* **Database**: MongoDB (via Mongoose)
* **Auth**: JSONWebToken & BcryptJS
* **Environment**: Dotenv for secure configuration management

## 📂 Project Structure

    ├── config/             # Database connection setup
    ├── controllers/        # Business logic (User, Auth, Upload)
    ├── models/             # Mongoose Schemas
    ├── routes/             # Manual route handling logic
    ├── utils/              # Body parser, Logger, Validators
    ├── uploads/            # Directory for stored images
    ├── .env                # Environment variables
    ├── app.js              # Server entry point
    └── package.json        # Dependencies

## 🚀 Getting Started

**1. Clone the repository**
> git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
> cd your-repo-name

**2. Install dependencies**
> npm install

**3. Configure Environment**
Create a **.env** file in the root directory and add:
* PORT=3000
* DB_NAME=your_db_name
* MONGO_URI=your_mongodb_connection_string
* JWT_SECRET=your_jwt_secret_key
* JWT_EXPIRES_IN=24h

**4. Run the server**
> npm start

## 🔌 API Endpoints

### Auth & Users
* **POST /signup** - Register a new user
* **POST /login** - Login and receive JWT token
* **GET /users** - Get all users (Supports filtering)
* **PUT /users/:id** - Update user (Requires Token)
* **DELETE /users/:id** - Delete user (Requires Token)

### File Upload
* **GET /upload** - Serves a simple HTML form to test uploads
* **POST /upload** - Endpoint to handle raw multipart image uploads
* **GET /uploads/:filename** - Serves static uploaded images

## 💡 Lessons Learned
By building this project without a framework, I mastered the **Node.js HTTP module**, **Buffers**, and **Streams**. I successfully implemented a manual multipart parser to handle binary data and gained a profound understanding of how middleware and routing work under the hood.