# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhsarDesign is a React-based frontend landing page for a creative freelancing platform. The application is built using modern web technologies with Vite as the build tool, React Router for routing, Redux Toolkit for state management, and Tailwind CSS for styling.

## Development Commands

- `npm run dev` - Start the development server with Vite
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Architecture

### State Management
The application uses Redux Toolkit with a centralized store configuration:
- Store located at `src/store/store.js`
- Auth slice handles authentication state (`src/store/slices/authSlice.js`)
- API slice manages API-related state (`src/store/slices/apiSlice.js`)
- Action creators organized in `src/store/actions/` directory

### API Integration
Comprehensive API service layer in `src/services/api.js`:
- Axios-based HTTP client with interceptors for auth token management
- Automatic token refresh on 401 responses
- Organized API modules: auth, users, clients, artists, projects, portfolio, reviews, applications, upload, payments, messages, availability posts, job posts, analytics, notifications
- Base URL configured via `VITE_API_URL` environment variable (defaults to `https://api.phsardesign.com`)

### Component Structure
- `src/components/auth/` - Authentication components (login, register, protected routes)
- `src/components/layout/` - Layout components (navbar, footer)
- `src/components/ui/` - Reusable UI components following a design system pattern
- `src/components/Home/` - Landing page components
- `src/pages/` - Page-level components

### Routing
React Router setup in `src/App.jsx` with public routes for landing page and about page, plus authentication routes for future use.

### Styling
- Tailwind CSS configuration with custom dark theme
- Flowbite components integration
- Global styles in `src/index.css` and `src/App.css`

## Key Technical Details

- Environment: Vite-based React application with ES modules
- Authentication: JWT-based with automatic refresh token handling
- API: RESTful API integration with comprehensive error handling
- UI: Tailwind CSS + Flowbite components for consistent design
- Icons: Lucide React icon library

## Environment Variables
- `VITE_API_URL` - API base URL (required for backend communication)