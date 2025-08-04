# 🎨 PhsarDesign - Creative Freelancing Platform

A modern, full-stack platform connecting clients with talented artists for creative projects and services. Built with cutting-edge technologies for optimal performance, scalability, and user experience.

---

## 🗂️ Folder Structure

PhsarDesign/
├── app/                     # Flutter mobile app (for artists/clients)
│   ├── lib/
│   ├── android/
│   ├── ios/
│   └── ...
│
├── backend/                 # Node.js backend API (Express + PostgreSQL)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   ├── .env.example
│   └── server.js
│
├── frontend-landing-page/  # React landing page (marketing site) - Better suited for fast loading & SEO
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
│
├── .gitignore
└── README.md

---

## 🛠️ Tech Stack Overview

### 🔙 Backend Technologies

- **Node.js + Express.js**  
  RESTful API with scalable middleware architecture

- **PostgreSQL**  
  Relational database with ACID compliance

- **Sequelize ORM**  
  ORM for DB models, migrations, and associations

- **JWT Authentication**  
  Stateless authentication for secure API access

- **Cloudinary Integration**  
  Image uploads, optimization, and CDN delivery

---

### 🌐 Frontend (Landing Page)

- **React 18 + Vite**  
  Fast SPA development with hot reload

- **Redux Toolkit**  
  Predictable and centralized state management

- **React Router v6**  
  Declarative, nested client-side routing

- **Tailwind CSS**  
  Utility-first styling for rapid UI development

---

### 📱 Mobile App (Flutter)

- **Flutter**  
  Cross-platform mobile framework

- **Dart**  
  Strongly typed language for Flutter apps

---

## 📦 Flutter App Setup (after pulling the repo)

1. Navigate to the app directory:
   cd app/

2. Get Flutter packages (install dependencies):
   flutter pub get

3. (Optional) Add more packages later using:
   flutter pub add package_name

4. Run the app on your preferred platform:

   # Run on Chrome (web)
   flutter run -d chrome

   # Run on Android device/emulator
   flutter run

   # Run on iOS simulator (macOS only)
   flutter run -d ios

> 💡 Make sure you have Flutter SDK installed. Run `flutter doctor` to check your setup.

---