# Admin Delegate Management System

A simple **Admin & Delegate Management System** built using **Laravel (Backend API)** and **React (Frontend)** with **JWT Authentication**.

## Tech Stack
# Backend
    • Laravel 8+
    • MySQL
    • JWT Authentication (tymon/jwt-auth)
# Frontend
    • React
    • Axios
    • Bootstrap

## Features
### Admin
    • Login with JWT
    • Dashboard
    • Create Users (Admin / Delegate)
    • Manage Categories
    • Manage Delegates
    • Logout
### Delegate
    • Login with JWT
    • View dashboard
    • See assigned category message
    • Logout

## Project Setup

##1. Clone the repository
git clone https://gitlab.com/rohit.patel2/admin-delegate-management-system.git

cd admin-delegate-management-system

#Backend Setup (Laravel)


##2. Install dependencies
cd admin-delegate
composer install

##3. Create environment file
cp .env.example .env


## 4. Configure database in .env
DB_DATABASE=admin_delegate
DB_USERNAME=root
DB_PASSWORD=

## 5. Generate app key
php artisan key:generate

## 6. Run migrations
php artisan migrate

## 7. Install JWT
composer require tymon/jwt-auth
php artisan jwt:secret
## 8. Create first Admin user
php artisan tinker
\App\Models\User::create([ 'first_name' => 'Admin', 'last_name' => 'User', 'email' => 'admin@test.com', 'password' => bcrypt('123456'), 'role' => 'admin', 'type' => 'active' ]); 


## 9. Start backend server
php artisan serve
Backend runs on:
http://127.0.0.1:8000

### Frontend Setup (React)

# 10. Install dependencies
cd admin-delegate-frontend
npm install

# 11. Start frontend
npm start
Frontend runs on:
http://localhost:3000

## Login Credentials
Admin

# Use http://localhost:3000/admin for admin login
Email: admin@test.com
Password: 123456
Delegate

# Use http://localhost:3000/ for delegate login
Delegates are created by Admin from dashboard.

# API Authentication
    • JWT token stored in localStorage
    • Axios interceptor automatically attaches token
    • Protected routes using Laravel middleware

## Validations
# Frontend
    • Required fields
    • Email format
    • Password length
# Backend (Laravel)
    • Request validation using $request->validate()
    • Unique email checks
    • Role & status validation

