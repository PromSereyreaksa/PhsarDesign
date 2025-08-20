# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

PhsarDesign is a creative freelancing platform connecting clients with talented artists. The current codebase contains a React-based frontend web application with a comprehensive marketplace and authentication system. This is part of a planned full-stack platform that will eventually include Node.js backend and Flutter mobile app components.

## Development Commands

### Frontend Development
```bash
cd frontend
npm install                # Install dependencies
npm run dev                # Start development server (Vite)
npm run build              # Build for production
npm run lint               # Run ESLint
npm run preview            # Preview production build
```

### Testing and Running Individual Components
Since this is a React application with comprehensive routing, you can test specific features by navigating to:
- `/` - Landing page
- `/marketplace` - Browse services marketplace
- `/login` - Authentication
- `/register` - User registration
- `/about` - About page

## Architecture Overview

### Frontend Architecture (React + Vite)
The frontend follows a modern React architecture with clear separation of concerns:

**State Management**: Redux Toolkit with centralized store
- `authSlice` - Authentication state and user session
- `marketplaceSlice` - Marketplace posts and search
- `artistsSlice` - Artist/freelancer data
- `postsSlice` - Service posts and categories
- `apiSlice` - API call state management

**API Layer**: Comprehensive service layer in `src/services/api.js`
- Axios-based HTTP client with JWT token management
- Automatic token refresh on 401 responses
- Organized API modules for all major features (auth, users, artists, projects, portfolio, etc.)
- Base URL configurable via `VITE_API_URL` environment variable

**Routing Structure**: React Router v6 with protected routes
- Public routes: Landing page, marketplace browsing, about
- Protected routes: Dashboard, profile management, post creation/editing
- Authentication routes: Login, register, password recovery with OTP
- Role-based access control through `ProtectedRoute` guard

**Component Organization**:
- `src/pages/` - Page-level components organized by feature area
- `src/components/ui/` - Reusable UI components
- `src/components/layout/` - Navigation and footer components
- `src/guards/` - Route protection components

### Key Technical Patterns

**Authentication Flow**: JWT-based with automatic refresh
- Tokens stored in Redux state
- Automatic token refresh on API 401 responses
- Role-based route protection (artist, client, freelancer roles)

**API Integration**: Centralized service layer pattern
- All API calls go through configured axios instance
- Request interceptors add authentication headers
- Response interceptors handle token refresh and error handling
- Environment-configurable API base URL

**State Management Pattern**: Redux Toolkit slices
- Feature-based state organization
- Async thunks for API calls
- Normalized state structure for complex data

## Environment Configuration

### Required Environment Variables
- `VITE_API_URL` - Backend API base URL (defaults to `https://api.phsardesign.com`)

### Development Setup
1. Ensure Node.js v16+ is installed
2. Clone repository and navigate to frontend directory
3. Copy environment variables: `cp .env.example .env` (if available)
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## Key Features and Modules

### Authentication System
- JWT-based authentication with refresh tokens
- Multi-role support (artist, client, freelancer)
- OTP verification for registration and password reset
- Protected route system with role-based access

### Marketplace Platform
- Service discovery and browsing
- Search functionality with filters
- Post creation and management
- Artist profiles and portfolios
- Application system for services

### UI/UX Framework
- Tailwind CSS for styling with custom design system
- Flowbite components integration
- Responsive design with mobile-first approach
- Dark theme with gradient accents
- Lucide React icons throughout

## Project Structure Notes

The README.md describes a planned multi-component architecture (backend, app, frontend-landing-page), but the current implementation focuses on the main frontend application in the `frontend/` directory. The `frontend-landing-page/` directory exists but is currently empty. The backend and Flutter app directories mentioned in the README are not yet implemented.

When working on this codebase, focus on the `frontend/` directory which contains the complete React application with all marketplace, authentication, and user management functionality.

## Important Implementation Details

- The application uses Vite as the build tool with React plugin
- ESLint configuration includes React hooks and refresh plugins
- Tailwind CSS configured with Poppins font family
- Redux store configured with persistence middleware for auth state
- API service layer handles complex upload functionality with detailed error logging
- Protected routes implement role-based access control for dashboard and profile features
