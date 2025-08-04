# 🎨 PhsarDesign - Creative Freelancing Platform

A modern, full-stack platform connecting clients with talented artists for creative projects and services. Built with cutting-edge technologies for optimal performance, scalability, and user experience.

## 🚀 Features

- **Cross-platform mobile app** for artists and clients
- **Fast loading landing page** optimized for SEO
- **Secure authentication** with JWT tokens
- **Real-time messaging** between clients and artists
- **Portfolio management** and project showcasing
- **Payment integration** for seamless transactions
- **Image optimization** with Cloudinary CDN

---

## 🗂️ Project Structure

```
PhsarDesign/
├── app/                        # Flutter mobile app (for artists/clients)
│   ├── lib/
│   ├── android/
│   ├── ios/
│   └── ...
│
├── backend/                    # Node.js backend API (Express + PostgreSQL)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   ├── .env.example
│   └── server.js
│
├── frontend-landing-page/      # React landing page (marketing site)
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### 🔙 Backend Technologies

- **Node.js + Express.js** - RESTful API with scalable middleware architecture
- **PostgreSQL** - Relational database with ACID compliance
- **Sequelize ORM** - Database models, migrations, and associations
- **JWT Authentication** - Stateless authentication for secure API access
- **Cloudinary Integration** - Image uploads, optimization, and CDN delivery

### 🌐 Frontend (Landing Page)

- **React 18 + Vite** - Fast SPA development with hot reload
- **Redux Toolkit** - Predictable and centralized state management
- **React Router v6** - Declarative, nested client-side routing
- **Tailwind CSS** - Utility-first styling for rapid UI development

### 📱 Mobile App (Flutter)

- **Flutter** - Cross-platform mobile framework
- **Dart** - Strongly typed language for Flutter apps

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Flutter SDK** (v3.0 or higher)
- **Git**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Landing Page Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-landing-page/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### 📱 Flutter App Setup

1. Navigate to the app directory:
   ```bash
   cd app/
   ```

2. Get Flutter packages (install dependencies):
   ```bash
   flutter pub get
   ```

3. Run the app on your preferred platform:

   **Web (Chrome):**
   ```bash
   flutter run -d chrome
   ```

   **Android device/emulator:**
   ```bash
   flutter run
   ```

   **iOS simulator (macOS only):**
   ```bash
   flutter run -d ios
   ```

> 💡 **Tip:** Make sure you have Flutter SDK installed. Run `flutter doctor` to check your setup and resolve any issues.

---

## 🔧 Development Commands

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Flutter App
- `flutter pub get` - Install dependencies
- `flutter pub add package_name` - Add new package
- `flutter clean` - Clean build files
- `flutter build apk` - Build Android APK
- `flutter build ios` - Build iOS app

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload profile picture

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@phsardesign.com or join our [Discord community](https://discord.gg/phsardesign).

---

**Built with ❤️ by the PhsarDesign Team**