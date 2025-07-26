# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ArtLink is a freelancing platform connecting clients with freelancers for creative projects. It consists of a Node.js/Express backend and a React/Vite frontend.

## Development Commands

### Backend (Node.js/Express + PostgreSQL)
```bash
cd backend
npm install                    # Install dependencies
node server.js                 # Start development server (port 3000)
```

### Frontend (React + Vite)
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start development server with hot reload
npm run build                  # Build for production
npm run lint                   # Run ESLint
npm run preview               # Preview production build
```

## Architecture Overview

### Backend Architecture (`/backend`)
- **Framework**: Express.js 5.1.0 with ES6 modules (`"type": "module"`)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based (partially implemented)
- **File Uploads**: Cloudinary integration (configured but not implemented)
- **Payments**: Stripe integration (configured but not implemented)

**Key Structure**:
```
backend/
├── config/          # Database and service configurations
├── controllers/     # Business logic (auth.controller.js is EMPTY)
├── middlewares/     # Authentication and error handling
├── models/          # Sequelize database models
├── routes/          # API endpoint definitions
├── services/        # External service integrations
├── utils/           # JWT and validation utilities
└── server.js        # Application entry point
```

**Database Models**:
- **Users**: Base authentication (email, password, role)
- **Clients**: Client profiles linked to Users
- **Freelancers**: Freelancer profiles with skills and portfolio
- **Projects**: Job postings from clients
- **Applications**: Freelancer applications to projects
- **Portfolio**: Freelancer work showcases
- **Messages**: User-to-user communication
- **Reviews**: Project reviews and ratings

### Frontend Architecture (`/frontend`)
- **Framework**: React 19 with React Router DOM
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS 4.x with Flowbite components
- **State Management**: Redux Toolkit with RTK Query patterns
- **HTTP Client**: Axios with interceptors for authentication

**Key Structure**:
```
frontend/src/
├── components/      # Reusable UI components
│   ├── auth/        # Authentication components (login, register, etc.)
│   ├── layout/      # Layout components (navbar, footer)
│   └── ui/          # Generic UI components (buttons, cards, etc.)
├── pages/           # Page-level components organized by feature
├── services/        # API layer with axios instance
├── store/           # Redux store configuration and slices
└── App.jsx          # Main routing and app structure
```

**Routing Pattern**: Uses protected and public route wrappers with role-based access control.

## Critical Issues & Development Notes

### Backend Issues (MUST address before deployment)
1. **Empty Authentication Controller** (`/backend/controllers/auth.controller.js`) - No login/register endpoints
2. **Empty Auth Routes** (`/backend/routes/auth.routes.js`) - No auth endpoints defined
3. **Empty JWT Utils** (`/backend/utils/jwt.js`) - No token generation/validation
4. **Empty Validation Utils** (`/backend/utils/validator.js`) - No input validation
5. **Project Controller Bug**: Import statement uses `Projectss` but should be `Projects`
6. **Route Ordering Issue**: In `/backend/routes/user.routes.js`, specific routes (`:email`, `:role`) should come before generic `/:id`

### API Endpoints
Base URL: `http://localhost:3000` (as configured in frontend API service)

**Working Endpoints**:
- `GET /health` - Server health check
- `/api/users/*` - User CRUD operations
- `/api/clients/*` - Client profile management  
- `/api/freelancers/*` - Freelancer profile management
- `/api/projects/*` - Project management (has bugs)
- `/api/portfolio/*` - Portfolio management

**Missing Endpoints**:
- `/api/auth/*` - Authentication endpoints (login, register, profile)

### Development Workflow

1. **Before starting any work**: Fix the critical backend bugs listed above
2. **Database Setup**: Create PostgreSQL database and configure environment variables
3. **Environment Files**: Both backend and frontend require `.env` files (see existing documentation)
4. **Testing**: Use the endpoint testing sequence in `/backend/endpoints.md`
5. **Frontend Development**: Ensure backend is running on port 3000 before starting frontend

### State Management Patterns

Frontend uses Redux Toolkit with:
- **Auth Slice**: User authentication state
- **API Slice**: Centralized API state management
- **Services Layer**: Axios instance with request/response interceptors for token handling

### Component Patterns

- **Route Protection**: Uses `ProtectedRoute` and `PublicRoute` wrapper components
- **Role-based Access**: Routes can specify `requiredRole` prop for client/freelancer-only access
- **UI Components**: Uses Flowbite React components with Tailwind CSS
- **File Organization**: Features are organized by pages with shared components in dedicated folders

### Known Dependencies

**Backend**:
- `express@5.1.0`, `sequelize@6.37.7`, `pg@8.16.2`, `bcryptjs@3.0.2`, `jsonwebtoken@9.0.2`, `cors@2.8.5`, `dotenv@16.5.0`

**Frontend**:
- `react@19.1.0`, `react-router-dom@7.6.3`, `@reduxjs/toolkit@2.8.2`, `axios@1.10.0`, `tailwindcss@4.1.10`, `flowbite-react@0.11.8`

## Security Considerations

- JWT tokens stored in Redux state (consider security implications)
- No input validation implemented yet
- CORS configured for development
- Password hashing with bcryptjs (when auth is implemented)
- API interceptors handle token expiration and redirect to login

## Development Priorities

1. **Immediate**: Fix critical backend bugs and implement authentication
2. **Phase 2**: Add input validation and security middleware  
3. **Phase 3**: Implement file uploads and payment processing
4. **Production**: Add comprehensive testing, logging, and monitoring