# 🧭 TravelXGuide – Working Features & Architecture

## Project Overview
TravelXGuide is a full-stack travel platform designed to connect travelers with guides, host and book tours, and foster a travel community. The project consists of a robust Node.js/Express backend and a modern React (Vite) frontend, with real-time features and comprehensive authentication.

---

## 🏗️ Architecture
- **Backend:** Node.js, Express, MongoDB, Socket.io
- **Frontend:** React (Vite), Tailwind CSS, React Router

---

## 🚀 Backend Features
- **User Authentication**
  - Google OAuth login
  - Email/password registration & login
  - Email verification with OTP
  - JWT-based session management
- **User Management**
  - Profile creation and updates
  - Password reset and change
  - Admin, user, and guide roles
- **Tour Management**
  - Host new tours (for guides)
  - Book tours (for users)
  - Tour approval workflow (admin)
  - View, edit, and delete tours
- **Guide Management**
  - Guide registration and onboarding
  - Guide profile management
- **Community & Chat**
  - Real-time chat (Socket.io)
  - Community discussion area
- **File Uploads**
  - Upload images and documents (multer)
- **API Structure**
  - RESTful endpoints for users, guides, tours, chat, admin, authentication
  - Middleware for authentication, CORS, and error handling
- **Email Integration**
  - Nodemailer for OTPs and notifications

---

## 💻 Frontend Features
- **Modern UI**
  - Responsive design (Tailwind CSS)
  - Clean navigation with Navbar and protected routes
- **Pages & Routing**
  - Home, Tours, Guide, Community, Signup, Login, User Profile, Admin Dashboard, Host Tour, My Tours, Tour Approval, etc.
  - React Router v7 for client-side navigation
- **Authentication Flows**
  - Google OAuth integration
  - OTP verification for email signups
  - Protected routes for logged-in users
- **Tour & Guide Management**
  - Host, view, and manage tours
  - Register and manage guide profiles
- **Admin Panel**
  - Dashboard for tour approvals and user management
- **Community Chat**
  - Real-time messaging with Socket.io-client
- **User Experience**
  - Toast notifications (react-toastify)
  - Form validation and error handling
- **Other Integrations**
  - Google Places Autocomplete for location-based features
  - Emoji picker, icons, and UI enhancements

---

## 🛠️ Tech Stack
- **Backend:** Express, MongoDB, Socket.io, JWT, Nodemailer, Multer
- **Frontend:** React, React Router, Axios, Socket.io-client, Tailwind CSS, Framer Motion

---

## ⚙️ Environment Setup (Sample)
See `FEATURES_RESTORATION_GUIDE.md` for full environment variable details.

---

## 📋 Special Notes
- All major features (OAuth, HostTour, chat, admin, etc.) are present and functional.
- For feature restoration or troubleshooting, refer to the restoration guide and `.env` setup.
- For any missing features or errors, check the backend logs and environment variables.

---

## 📝 Last Updated: 2025-07-29

---

This document summarizes all working features and the architecture of your TravelXGuide project. For detailed usage, see the README and other documentation files.
