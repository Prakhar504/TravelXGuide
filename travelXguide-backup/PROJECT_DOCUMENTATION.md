# 🧭 TravelXGuide – Full Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [Directory Structure](#directory-structure)
6. [Backend Features & API Endpoints](#backend-features--api-endpoints)
7. [Frontend Features & Routes](#frontend-features--routes)
8. [Deployment & Troubleshooting](#deployment--troubleshooting)
9. [Contribution Guidelines](#contribution-guidelines)
10. [Credits & License](#credits--license)

---

## 1. Project Overview
TravelXGuide is a full-stack travel platform for connecting travelers and guides, hosting and booking tours, and fostering a travel community. It supports real-time chat, admin management, and robust authentication.

---

## 2. Tech Stack & Architecture
- **Backend:** Node.js, Express, MongoDB, Socket.io
- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Other:** JWT, Nodemailer, Multer, Google OAuth, Framer Motion

---

## 3. Setup Instructions
### Backend
1. Install dependencies:
   ```sh
   cd Backend
   npm install
   ```
2. Create `.env` file (see [Environment Variables](#environment-variables)).
3. Start the server:
   ```sh
   npm run dev
   ```

### Frontend
1. Install dependencies:
   ```sh
   cd Frontend
   npm install
   ```
2. Create `.env.local` (see Frontend docs if needed).
3. Start the app:
   ```sh
   npm run dev
   ```

---

## 4. Environment Variables
Sample `.env` for Backend:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travelxguide
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```
See `FEATURES_RESTORATION_GUIDE.md` for details.

---

## 5. Directory Structure
```
travelXguide-main/
├── AUTHENTICATION_FEATURES.md
├── FEATURES_RESTORATION_GUIDE.md
├── PROJECT_WORKING_FEATURES.md
├── PROJECT_DOCUMENTATION.md
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── ...
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── Routes/
│   │   └── ...
│   └── ...
└── README.md
```

### Key Backend Folders:
- `controllers/`: Business logic (admin, auth, guide, tour, user)
- `routes/`: API endpoints (admin, auth, chat, guide, tour, user)
- `models/`: Mongoose schemas (user, guide, tour, message, admin)
- `middleware/`: Auth, CORS, error handling
- `config/`: DB, email templates, CORS config

### Key Frontend Folders:
- `components/`: UI components (Navbar, GuideCard, ImageLoader, etc.)
- `Routes/`: Page components (AdminDashboard, Guide, Tours, Community, etc.)
- `viewTrip/`: Trip planning features
- `utils/`, `service/`: Helpers and API logic

---

## 6. Backend Features & API Endpoints
### Main Features
- **Authentication:** Google OAuth, email/password, OTP verification
- **User Management:** Profiles, password reset, roles (user/guide/admin)
- **Tour Management:** Host, book, approve tours
- **Guide Management:** Registration, onboarding, profile
- **Chat:** Real-time (Socket.io)
- **Admin:** Tour approval, user management
- **File Uploads:** Images/docs for tours and profiles

### Key API Endpoints (by Route)
- `/api/auth/` – Login, signup, OAuth, OTP, password reset
- `/api/user/` – Profile, bookings, user info
- `/api/guide/` – Guide registration, profile, hosted tours
- `/api/tour/` – Host, book, view, edit, delete tours
- `/api/chat/` – Real-time messaging
- `/api/admin/` – Dashboard, approve tours, manage users

(See controllers/routes for full details)

---

## 7. Frontend Features & Routes
### Main Features
- **Modern UI:** Responsive, clean navigation, protected routes
- **Authentication:** Google OAuth, OTP, protected pages
- **Tour & Guide Management:** Host/view/manage tours, guide registration
- **Admin Panel:** Dashboard, tour approvals
- **Community Chat:** Real-time messaging
- **Other:** Toast notifications, Google Places integration, emoji picker

### Main Routes (by Page)
- `/` – Home
- `/tours` – Browse tours
- `/guide` – Browse guides
- `/community` – Community chat
- `/signup` – Signup
- `/reset-password` – Password reset
- `/profile` – User profile
- `/host-tour` – Host a tour (protected)
- `/my-tours` – My booked tours (protected)
- `/hosted-tours` – Tours hosted by user (protected)
- `/admin/login` – Admin login
- `/admin/dashboard` – Admin dashboard
- `/admin/tour-approval` – Tour approval (admin)
- `/guide/register` – Guide registration

---

## 8. Deployment & Troubleshooting
- Ensure MongoDB is running and environment variables are set
- Use `npm run dev` for development (both frontend and backend)
- For production, build frontend and use a process manager (e.g., PM2) for backend
- Check logs for errors (backend console, browser console)
- See `FEATURES_RESTORATION_GUIDE.md` for restoring features

---

## 9. Contribution Guidelines
- Fork the repo and create a feature branch
- Follow code style and naming conventions
- Document new features in this file
- Submit pull requests with clear descriptions

---

## 10. Credits & License
- Developed by the TravelXGuide team
- License: MIT (or as specified in your LICENSE file)

---

## 📅 Last Updated: 2025-07-29

---

For further details, see the feature-specific markdown files and code comments throughout the project.
