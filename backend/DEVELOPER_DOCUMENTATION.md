# ArtLink Backend Developer Guide

**Version:** 2.0  
**Last Updated:** July 27, 2025  

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Core Features](#core-features)
4. [API Reference](#api-reference)
5. [Authentication & Security](#authentication--security)
6. [Database Design](#database-design)
7. [Development Workflow](#development-workflow)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [API Usage Examples](#api-usage-examples)

---

## 🎯 Project Overview

**ArtLink** is a comprehensive freelancing platform backend that connects clients with artists for creative projects. Built with modern technologies and designed for scalability, it provides a complete ecosystem for creative collaboration and business transactions.

### Technology Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.1.0
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs with salt rounds
- **File Storage:** Cloudinary integration
- **Payment Processing:** Stripe API
- **Security:** Helmet.js, CORS, rate limiting

### Core Capabilities
- Complete user management and authentication system
- Artist and client profile management
- Job posting and application system
- Service availability posting by artists
- Portfolio showcasing with image management
- Project lifecycle management
- Secure payment processing
- Review and rating system
- Real-time file upload and management
- Comprehensive search and filtering

### Platform Business Models

#### **Client-Driven Hiring**
Clients post job requirements, artists apply with proposals, and clients select the best candidate for their project.

#### **Artist-Driven Services**
Artists post their availability and service offerings, allowing clients to discover and directly contact artists for their needs.

---

## 🏗️ Architecture Overview

### System Design
The ArtLink backend follows a modular, RESTful architecture with clear separation of concerns:

- **Controllers**: Handle business logic and request processing
- **Models**: Define data structures and database relationships
- **Routes**: Define API endpoints and middleware
- **Services**: Handle external integrations (Cloudinary, Stripe)
- **Middleware**: Authentication, validation, error handling
- **Utils**: Shared utilities for JWT, validation, etc.

### Key Architectural Principles
- **RESTful API Design**: Consistent, predictable endpoints
- **Stateless Authentication**: JWT-based session management
- **Data Validation**: Input sanitization and validation at all levels
- **Error Handling**: Comprehensive error management and logging
- **Security First**: Multiple layers of security protection
- **Modular Structure**: Easy to maintain and extend

---

## � Core Features

### User Management
- **Registration & Authentication**: Secure user registration with email/password
- **Role-Based Access**: Separate roles for clients and artists
- **Profile Management**: Comprehensive user profile system
- **Session Management**: JWT-based authentication with refresh tokens

### Client Features
- **Organization Profiles**: Company information and branding
- **Job Posting**: Create detailed job listings with requirements
- **Artist Discovery**: Browse and search available artists
- **Project Management**: Track project progress and milestones
- **Payment Processing**: Secure payments through Stripe
- **Review System**: Rate and review completed work

### Artist Features
- **Professional Profiles**: Showcase skills, experience, and rates
- **Portfolio Management**: Upload and organize work samples
- **Service Listings**: Post availability and service offerings
- **Job Applications**: Apply to client job postings
- **Skill-Based Matching**: Get discovered through skill searches
- **Earnings Tracking**: Monitor payments and project history

### Business Logic
- **Dual Posting System**: Support both job posts and availability posts
- **Application Workflow**: Streamlined application and selection process
- **Project Lifecycle**: From creation to completion and review
- **Search & Discovery**: Advanced filtering and matching capabilities
- **Communication**: Message system for client-artist interaction

### Payment & Financial
- **Stripe Integration**: Complete payment processing solution
- **Payment Methods**: Save and manage multiple payment methods
- **Transaction History**: Detailed payment tracking and reporting
- **Webhook Handling**: Real-time payment status updates
- **Security**: PCI-compliant payment processing

### File Management
- **Cloudinary Integration**: Professional image storage and optimization
- **Multiple Upload Types**: Avatars, portfolio images, project files
- **Image Transformation**: Automatic resizing and optimization
- **CDN Delivery**: Fast, global content delivery
- **File Validation**: Security and format validation

---

## 📚 API Reference

### Base Configuration
- **Base URL**: `http://localhost:4000/api`
- **Content Type**: `application/json`
- **Authentication**: Bearer token in Authorization header

### Core Endpoints

#### Authentication
```
POST   /auth/register          # User registration
POST   /auth/login             # User login
POST   /auth/logout            # User logout
GET    /auth/profile           # Get current user profile
POST   /auth/refresh           # Refresh access token
```

#### User Management
```
GET    /users                  # List all users
GET    /users/:id              # Get user by ID
PUT    /users/:id              # Update user
DELETE /users/:id              # Delete user
GET    /users/email/:email     # Find user by email
GET    /users/role/:role       # Filter users by role
```

#### Client Operations
```
GET    /clients                # List all clients
POST   /clients                # Create client profile
GET    /clients/:id            # Get client details
PUT    /clients/:id            # Update client profile
DELETE /clients/:id            # Delete client profile
```

#### Artist Operations
```
GET    /artists                # List all artists
POST   /artists                # Create artist profile
GET    /artists/:id            # Get artist details
PUT    /artists/:id            # Update artist profile
DELETE /artists/:id            # Delete artist profile
GET    /artists/skills/:skill  # Search artists by skill
```

#### Job Management
```
GET    /job-posts              # Browse job postings
POST   /job-posts              # Create job post
GET    /job-posts/:id          # Get job details
PUT    /job-posts/:id          # Update job post
DELETE /job-posts/:id          # Delete job post
```

#### Service Availability
```
GET    /availability-posts     # Browse service offerings
POST   /availability-posts     # Post service availability
GET    /availability-posts/:id # Get availability details
PUT    /availability-posts/:id # Update availability
DELETE /availability-posts/:id # Remove availability
```

#### Portfolio Management
```
GET    /portfolios             # Browse portfolios
POST   /portfolios             # Create portfolio item
GET    /portfolios/:id         # Get portfolio details
PUT    /portfolios/:id         # Update portfolio
DELETE /portfolios/:id         # Delete portfolio item
GET    /portfolios/artist/:id  # Get artist's portfolio
```

#### Project Management
```
GET    /projects               # List projects
POST   /projects               # Create project
GET    /projects/:id           # Get project details
PUT    /projects/:id           # Update project
DELETE /projects/:id           # Delete project
```

#### Payment Processing
```
POST   /payments/create-payment-intent      # Create payment
POST   /payments/confirm-payment           # Confirm payment
GET    /payments/payment-methods           # List payment methods
POST   /payments/save-payment-method       # Save payment method
DELETE /payments/payment-methods/:id       # Delete payment method
GET    /payments/history                   # Payment history
POST   /payments/webhook                   # Stripe webhooks
```

#### Reviews & Ratings
```
GET    /reviews                # List reviews
POST   /reviews                # Create review
GET    /reviews/:id            # Get review details
PUT    /reviews/:id            # Update review
DELETE /reviews/:id            # Delete review
GET    /reviews/artist/:id     # Get artist reviews
GET    /reviews/artist/:id/average  # Get artist rating
```

#### File Upload
```
POST   /upload/image           # Upload single image
POST   /upload/images          # Upload multiple images
POST   /upload/avatar          # Upload avatar
POST   /upload/portfolio       # Upload portfolio image
GET    /upload/images          # List uploaded images
DELETE /upload/image/:id       # Delete image
```

## 🔐 Authentication & Security

### Authentication System
ArtLink uses JSON Web Tokens (JWT) for stateless authentication. The system supports user registration, login, logout, and token refresh functionality.

#### Token Structure
```javascript
{
  "userId": "user_id",
  "email": "user@example.com", 
  "role": "client|artist",
  "iat": timestamp,
  "exp": timestamp
}
```

#### Authentication Flow
1. **Registration**: Users create accounts with email/password
2. **Login**: Credentials are verified and JWT tokens are issued
3. **Authorization**: Protected routes validate JWT tokens
4. **Refresh**: Long-term refresh tokens renew access tokens

### Security Features

#### Password Security
- **Hashing**: bcryptjs with 12 salt rounds
- **Validation**: Minimum length and complexity requirements
- **Storage**: Only hashed passwords stored in database

#### Request Protection
- **Rate Limiting**: Configurable limits per endpoint type
  - General endpoints: 100 requests per 15 minutes
  - Authentication endpoints: 5 requests per 15 minutes
  - File upload endpoints: 10 requests per 15 minutes
- **Input Validation**: Comprehensive request validation
- **Sanitization**: XSS and injection attack prevention
- **CORS**: Cross-origin request security
- **Headers**: Security headers via Helmet.js

#### File Upload Security
- **Type Validation**: Allowed file types and formats
- **Size Limits**: Maximum file size restrictions
- **Virus Scanning**: Integration capabilities for file scanning
- **Secure Storage**: Cloudinary with access controls

### Authorization Levels
- **Public Routes**: Health checks, browsing content
- **Authenticated Routes**: Profile management, applications
- **Role-Based Access**: Client vs Artist specific features
- **Owner-Only Access**: Users can only modify their own data

---

## 💾 Database Design

### Entity Relationship Overview
The database follows a normalized design with clear relationships between entities:

```
Users (1:1) ──── Clients
Users (1:1) ──── Artists  
Clients (1:M) ──── Job Posts
Artists (1:M) ──── Availability Posts
Clients (1:M) ──── Projects
Artists (1:M) ──── Projects
Projects (1:M) ──── Applications
Artists (1:M) ──── Portfolio Items
Projects (1:M) ──── Reviews
Users (1:M) ──── Messages [sender/receiver]
```

### Core Tables

#### Users Table
Central authentication and role management
- Primary key: `userId` (auto-increment)
- Authentication: email, password hash
- Role management: client or artist designation
- Timestamps: creation and modification tracking

#### Clients Table
Client-specific profile information
- Foreign key: `userId` references Users
- Organization details: name, website, industry
- Contact preferences and location
- Unique slug generation for SEO

#### Artists Table  
Artist-specific profile and service information
- Foreign key: `userId` references Users
- Professional details: bio, specialization, rates
- Skills and experience level tracking
- Availability status management

#### Job Posts Table
Client job postings and requirements
- Foreign key: `clientId` references Clients
- Project details: title, description, requirements
- Budget ranges and timeline information
- Status tracking and deadline management
- SEO-friendly slug generation

#### Availability Posts Table
Artist service offerings and availability
- Foreign key: `artistId` references Artists
- Service descriptions and capabilities
- Pricing and availability windows
- Contact preferences and location
- Status and visibility controls

#### Portfolio Table
Artist work samples and project showcases
- Foreign key: `artistId` references Artists
- Project information: title, description, images
- Tag-based categorization system
- Client attribution and project URLs
- Image management via Cloudinary

#### Projects Table
Active projects between clients and artists
- Foreign keys: `clientId` and `artistId`
- Project scope: budget, timeline, deliverables
- Status tracking: active, completed, cancelled
- Payment integration and milestone tracking

#### Reviews Table
Rating and feedback system
- Foreign keys: project, reviewer, and reviewed user
- Rating scale: 1-5 star system
- Text feedback and recommendation system
- Timestamp tracking for review history

### Data Validation
- **Field Constraints**: Required fields, length limits, format validation
- **Relationship Integrity**: Foreign key constraints and cascading deletes
- **Business Rules**: Custom validation for business logic
- **Unique Constraints**: Email uniqueness, slug uniqueness per entity

---

---

## � Development Priorities

### **Phase 1: Production Optimization (Current Priority)**
**Goal:** Optimize the complete system for production deployment

1. **Performance Testing** (Week 1)
   - Load testing for all endpoints
   - Database query optimization
   - Memory usage optimization
   - Response time benchmarking

2. **Advanced Features** (Week 2)
   - Real-time messaging with WebSocket
   - Advanced search and filtering with pagination
   - Email notification system
   - File upload progress tracking

3. **Monitoring & Analytics** (Week 3)
   - Application performance monitoring
   - Business analytics dashboard
   - Error tracking and alerting
   - User behavior analytics

### **Phase 2: Business Intelligence (Optional)**
**Goal:** Add advanced business features

1. **Recommendation System**
   - Artist recommendation for clients
   - Job recommendation for artists
   - Skill-based matching algorithms

2. **Advanced Payment Features**
   - Milestone-based payments
   - Escrow system
   - Automated fee calculations
   - Multi-currency support

3. **Platform Analytics**
   - Revenue tracking
   - User engagement metrics
   - Success rate analysis
   - Market trend insights

### **Phase 3: Scale & Expansion**
**Goal:** Prepare for platform scaling

1. **Microservices Architecture**
   - Service decomposition
   - API gateway implementation
   - Independent deployment

2. **Geographic Expansion**
   - Multi-language support
   - Currency localization
   - Regional compliance

---

## 🏗️ Technical Architecture

### Project Structure
The backend follows a modular, layered architecture with clear separation of concerns:

```
backend/
├── server.js                          # Application entry point and server setup
├── package.json                       # Dependencies and scripts
├── .env                               # Environment variables (not in repo)
├── .gitignore                         # Git ignore rules
├── README.md                          # Project documentation
├── config/
│   ├── database.js                    # PostgreSQL configuration
│   ├── cloudinary.js                  # File upload configuration
│   └── passport.js                    # OAuth configuration (optional)
├── controllers/                       # Business logic handlers
│   ├── auth.controller.js             # Authentication and authorization
│   ├── user.controller.js             # User management operations
│   ├── client.controller.js           # Client profile management
│   ├── artist.controller.js           # Artist profile management (freelancer)
│   ├── project.controller.js          # Project lifecycle management
│   ├── portfolio.controller.js        # Portfolio and work showcase
│   ├── review.controller.js           # Rating and feedback system
│   └── payment.controller.js          # Stripe payment processing
├── middlewares/                       # Request processing middleware
│   ├── auth.middleware.js             # JWT authentication middleware
│   ├── error.middleware.js            # Error handling and logging
│   └── validation.middleware.js       # Input validation and sanitization
├── models/                            # Database models and schemas
│   ├── index.js                       # Model exports and associations
│   ├── user.model.js                  # User authentication model
│   ├── client.model.js                # Client profile model
│   ├── artist.model.js                # Artist profile model (freelancer)
│   ├── project.model.js               # Project management model
│   ├── portfolio.model.js             # Portfolio showcase model
│   ├── applications.model.js          # Job application model
│   ├── message.model.js               # User messaging model
│   ├── review.model.js                # Rating and review model
│   └── syncClientAndFreelancers.js    # Database synchronization
├── routes/                            # API endpoint definitions
│   ├── auth.routes.js                 # Authentication endpoints
│   ├── user.routes.js                 # User management endpoints
│   ├── client.routes.js               # Client operations endpoints
│   ├── artist.routes.js               # Artist operations endpoints
│   ├── project.routes.js              # Project management endpoints
│   ├── portfolio.routes.js            # Portfolio management endpoints
│   ├── review.routes.js               # Review and rating endpoints
│   └── payment.routes.js              # Payment processing endpoints
├── services/                          # External service integrations
│   ├── ai-detection.service.js        # AI content detection (optional)
│   ├── cloudinary.service.js          # File storage and management
│   └── stripe.service.js              # Payment processing service
├── utils/                             # Shared utilities and helpers
│   ├── jwt.js                         # JWT token management
│   └── validator.js                   # Custom validation functions
├── uploads/                           # Temporary file storage (local dev)
├── tests/                             # Test files and test data
│   ├── unit/                          # Unit tests
│   ├── integration/                   # Integration tests
│   └── fixtures/                      # Test data and fixtures
└── docs/                              # Additional documentation
    ├── DEVELOPER_DOCUMENTATION.md     # This file
    ├── CLOUDINARY_INTEGRATION_GUIDE.md
    ├── TEAM_COLLABORATION.md
    └── endpoints.md                   # API endpoint reference
```

### Architectural Layers

#### **1. Presentation Layer (Routes)**
- **Purpose**: Define API endpoints and handle HTTP requests
- **Responsibilities**: 
  - Route parameter validation
  - Middleware application (auth, rate limiting)
  - Request routing to appropriate controllers
  - Response formatting

#### **2. Business Logic Layer (Controllers)**
- **Purpose**: Handle application business logic and workflow
- **Responsibilities**:
  - Request validation and sanitization
  - Business rule enforcement
  - Service coordination
  - Response preparation
  - Error handling

#### **3. Service Layer (Services)**
- **Purpose**: External service integrations and complex operations
- **Responsibilities**:
  - Cloudinary file management
  - Stripe payment processing
  - Email notifications
  - Third-party API communications
  - AI/ML service integrations

#### **4. Data Access Layer (Models)**
- **Purpose**: Database interaction and data modeling
- **Responsibilities**:
  - Database schema definitions
  - Data validation and constraints
  - Relationship mappings
  - Query optimization
  - Database transactions

#### **5. Infrastructure Layer (Config, Middleware, Utils)**
- **Purpose**: Application infrastructure and cross-cutting concerns
- **Responsibilities**:
  - Database connectivity
  - Authentication and authorization
  - Security middleware
  - Error handling
  - Logging and monitoring

### Design Patterns

#### **MVC Architecture**
- **Model**: Database entities and business data
- **View**: JSON API responses (no traditional views)
- **Controller**: Request handling and business logic coordination

#### **Repository Pattern**
- Sequelize ORM acts as repository layer
- Models encapsulate data access logic
- Clean separation between business logic and data persistence

#### **Middleware Pattern**
- Authentication middleware for protected routes
- Validation middleware for input sanitization
- Error handling middleware for consistent error responses
- Rate limiting middleware for API protection

#### **Service Layer Pattern**
- External integrations isolated in service classes
- Reusable business logic extracted to services
- Clear separation of concerns between controllers and external APIs

### Data Flow

#### **Request Processing Flow**
1. **HTTP Request** → Express Router
2. **Route Middleware** → Authentication, Validation, Rate Limiting
3. **Controller** → Business Logic Processing
4. **Service Layer** → External API calls (if needed)
5. **Model Layer** → Database Operations
6. **Response** → JSON formatted response

#### **Authentication Flow**
1. **Login Request** → Auth Controller
2. **Credential Validation** → User Model
3. **JWT Generation** → JWT Utility
4. **Token Response** → Client
5. **Protected Requests** → Auth Middleware validates token

#### **File Upload Flow**
1. **Upload Request** → Multer Middleware
2. **File Validation** → Validation Middleware
3. **Cloudinary Upload** → Cloudinary Service
4. **Database Record** → Portfolio/User Model
5. **URL Response** → Client

### Security Architecture

#### **Authentication & Authorization**
- JWT-based stateless authentication
- Role-based access control (Client/Artist)
- Protected route middleware
- Token refresh mechanism

#### **Input Validation**
- Request schema validation
- SQL injection prevention
- XSS attack prevention
- File upload restrictions

#### **API Security**
- Rate limiting per endpoint type
- CORS configuration
- Security headers (Helmet.js)
- Request/response logging

### Scalability Considerations

#### **Horizontal Scaling**
- Stateless application design
- External session storage capability
- Load balancer compatibility
- Database connection pooling

#### **Performance Optimization**
- Database query optimization
- Image optimization via Cloudinary
- Caching strategies ready
- CDN integration for static assets

#### **Monitoring & Observability**
- Structured logging
- Health check endpoints
- Performance metrics collection
- Error tracking and alerting

---

## 🛠️ Development Workflow

### Environment Setup

#### Prerequisites
- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn package manager

#### Installation Steps
1. **Clone Repository**: Download the project source code
2. **Install Dependencies**: Run `npm install` to install required packages
3. **Environment Configuration**: Set up `.env` file with required variables
4. **Database Setup**: Create PostgreSQL database and run migrations
5. **Service Configuration**: Configure Cloudinary and Stripe API keys
6. **Start Development**: Run `npm run dev` for development mode

#### Required Environment Variables
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artlink_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

### Code Organization

#### Controllers
Handle incoming requests and coordinate between services:
- Request validation and sanitization
- Business logic execution
- Response formatting and error handling
- Service layer coordination

#### Models
Define data structures and relationships:
- Database schema definitions
- Validation rules and constraints
- Association mappings
- Custom query methods

#### Routes
API endpoint definitions with middleware:
- Route parameter validation
- Authentication middleware
- Rate limiting configuration
- Controller method binding

#### Services
External service integrations:
- Cloudinary file management
- Stripe payment processing
- Email notification services
- Third-party API communications

### Development Standards

#### Code Style
- **ES6+ Syntax**: Use modern JavaScript features
- **Async/Await**: Prefer async/await over callbacks
- **Error Handling**: Comprehensive try-catch blocks
- **Consistent Naming**: camelCase for variables, PascalCase for classes

#### API Design
- **RESTful Conventions**: Standard HTTP methods and status codes
- **Resource Naming**: Plural nouns for endpoints
- **Consistent Response**: Standardized response formats
- **Version Control**: API versioning strategy

#### Database Practices
- **Normalized Design**: Avoid data redundancy
- **Index Optimization**: Performance-critical fields indexed
- **Migration Scripts**: Version-controlled schema changes
- **Seed Data**: Test data for development environments

---

## 🧪 Testing

### Testing Strategy
The application uses a comprehensive testing approach covering unit tests, integration tests, and end-to-end testing.

#### Testing Tools
- **Jest**: Primary testing framework for unit and integration tests
- **Supertest**: HTTP assertion library for API endpoint testing
- **Database Testing**: In-memory PostgreSQL for isolated test runs
- **Mocking**: Service mocking for external API dependencies

#### Test Categories

##### Unit Tests
Test individual functions and methods in isolation:
- Controller method validation
- Utility function verification
- Model method testing
- Service function validation

##### Integration Tests
Test component interactions and API endpoints:
- Full API request/response cycles
- Database integration testing
- Middleware chain validation
- Service integration verification

##### Security Tests
Validate security measures and protection mechanisms:
- Authentication flow testing
- Authorization boundary testing
- Input validation verification
- Rate limiting validation

### Testing Best Practices

#### Test Structure
- **Arrange**: Set up test data and conditions
- **Act**: Execute the function or endpoint being tested
- **Assert**: Verify expected outcomes and side effects
- **Cleanup**: Reset state for subsequent tests

#### Coverage Goals
- **Unit Tests**: 90%+ code coverage for business logic
- **Integration Tests**: All critical user workflows covered
- **Edge Cases**: Error conditions and boundary cases tested
- **Performance**: Load testing for high-traffic endpoints

#### Test Data Management
- **Fixtures**: Reusable test data sets
- **Factories**: Dynamic test data generation
- **Isolation**: Tests do not depend on external state
- **Cleanup**: Automatic cleanup after test completion

---

## 🚀 Deployment

### Environment Configuration

#### Production Environment
- **Server**: Linux-based cloud hosting (AWS, Google Cloud, Azure)
- **Database**: Managed PostgreSQL service
- **File Storage**: Cloudinary for image and file management
- **Payment Processing**: Stripe production environment
- **Monitoring**: Application performance monitoring tools

#### Environment Variables (Production)
```
NODE_ENV=production
PORT=4000
DB_HOST=production_db_host
DB_PORT=5432
DB_NAME=artlink_production
DB_USER=production_user
DB_PASSWORD=secure_production_password
JWT_SECRET=strong_production_secret
CLOUDINARY_CLOUD_NAME=production_cloud
CLOUDINARY_API_KEY=production_api_key
CLOUDINARY_API_SECRET=production_api_secret
STRIPE_SECRET_KEY=live_stripe_secret
```

### Process Management

#### Application Startup
1. **Environment Validation**: Verify all required environment variables
2. **Database Connection**: Establish and validate database connectivity
3. **Service Initialization**: Initialize external service connections
4. **Route Registration**: Load and register all API routes
5. **Server Launch**: Start HTTP server on configured port

#### Health Monitoring
- **Health Check Endpoint**: `/api/health` for load balancer monitoring
- **Database Health**: Connection status and query response times
- **Service Status**: External service connectivity verification
- **Performance Metrics**: Response times and throughput monitoring

### Deployment Process

#### Pre-Deployment Checklist
- [ ] All tests passing in CI/CD pipeline
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] External services configured and tested
- [ ] Security configurations verified
- [ ] Performance testing completed

#### Deployment Steps
1. **Code Review**: Final code review and approval
2. **Build Process**: Create production build with optimizations
3. **Database Migration**: Run any pending database migrations
4. **Service Deployment**: Deploy to production environment
5. **Health Verification**: Confirm all services are operational
6. **Monitoring Setup**: Enable logging and monitoring tools

#### Rollback Procedures
- **Database Rollback**: Prepared rollback migrations
- **Application Rollback**: Previous version deployment capability
- **Service Monitoring**: Real-time error detection and alerting
- **Emergency Contacts**: On-call procedures for critical issues

---

## 📖 API Usage Examples
Users (1) ──── (∞) Messages [as receiver]
Projects (1) ──── (∞) Reviews
Artists (1) ──── (∞) Reviews [as reviewed]
Clients (1) ──── (∞) Reviews [as reviewer]
```

#### **Core Tables**
1. **users** - Authentication and role management
2. **clients** - Client profile information
3. **artists** - Artist profile and skills (formerly freelancers)
4. **job_posts** - Job postings from clients (new)
5. **availability_posts** - Service offerings from artists (new)
6. **projects** - Active projects between clients and artists
7. **applications** - Artist applications to projects
8. **portfolios** - Artist work showcases
9. **messages** - User-to-user communication
10. **reviews** - Rating and feedback system

---

### Common Workflows

#### User Registration and Authentication
```javascript
// Register a new client
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'client@example.com',
    password: 'securePassword123',
    role: 'client'
  })
});

const { token, user } = await registerResponse.json();

// Use token for authenticated requests
const profileResponse = await fetch('/api/auth/profile', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

#### Creating and Managing Profiles
```javascript
// Create client organization profile
const clientProfile = await fetch('/api/clients', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    organizationName: 'Tech Startup Inc',
    website: 'https://techstartup.com',
    industry: 'Technology',
    location: 'San Francisco, CA'
  })
});

// Create artist professional profile
const artistProfile = await fetch('/api/artists', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    bio: 'Experienced graphic designer specializing in digital art',
    specialization: 'Graphic Design',
    experienceLevel: 'Expert',
    hourlyRate: 75,
    skills: ['Photoshop', 'Illustrator', 'Digital Art']
  })
});
```

#### Job Posting and Application Process
```javascript
// Client posts a job
const jobPost = await fetch('/api/job-posts', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Logo Design for Tech Startup',
    description: 'Need a modern, clean logo for our new tech company',
    requirements: 'Experience with corporate branding',
    budgetRange: '$500-1000',
    deadline: '2025-02-15'
  })
});

// Artist applies to job
const application = await fetch('/api/applications', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jobPostId: jobPost.id,
    proposedRate: 800,
    timeline: '5 days',
    proposal: 'I have 10 years of experience in corporate logo design...'
  })
});
```

#### Payment Processing
```javascript
// Create payment intent
const paymentIntent = await fetch('/api/payments/create-payment-intent', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 80000, // $800.00 in cents
    currency: 'usd',
    projectId: 'project_123'
  })
});

// Confirm payment with client-side Stripe
const { client_secret } = await paymentIntent.json();
// Use client_secret with Stripe.js on frontend
```

#### Portfolio Management
```javascript
// Upload portfolio image
const formData = new FormData();
formData.append('image', imageFile);
formData.append('title', 'Corporate Logo Design');
formData.append('description', 'Modern logo design for tech company');
formData.append('tags', 'logo,branding,corporate');

const portfolioItem = await fetch('/api/portfolios', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

#### Search and Discovery
```javascript
// Search artists by skill
const artists = await fetch('/api/artists/skills/graphic-design', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Browse available services
const services = await fetch('/api/availability-posts?category=design&location=remote', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Get artist portfolio
const portfolio = await fetch('/api/portfolios/artist/123', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Error Handling Examples

#### Standard Error Response Format
```javascript
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  }
}
```

#### Authentication Error
```javascript
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "code": "AUTH_REQUIRED"
  }
}
```

#### Rate Limiting Error
```javascript
{
  "success": false,
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 900
  }
}
```

---

## 📞 Support & Resources

### Documentation
- **API Reference**: Complete endpoint documentation with examples
- **Database Schema**: Entity relationship diagrams and table specifications
- **Security Guide**: Authentication, authorization, and security best practices
- **Deployment Guide**: Production deployment and configuration instructions

### External Resources
- **Express.js Documentation**: https://expressjs.com/
- **Sequelize ORM Guide**: https://sequelize.org/
- **JWT Authentication**: https://jwt.io/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Cloudinary API**: https://cloudinary.com/documentation
- **Stripe API Reference**: https://stripe.com/docs/api

### Development Tools
- **Postman Collection**: Import for testing all API endpoints
- **Database GUI**: Recommended tools for database management
- **Monitoring Tools**: Application performance and error tracking
- **Testing Framework**: Jest and Supertest for comprehensive testing

---

**Document Version:** 2.0  
**Last Updated:** July 27, 2025  
**Review Schedule:** Monthly  

*This documentation provides a complete reference for the ArtLink backend API, covering all features, security implementations, and development practices.*

---

## 🧪 Testing Strategy

### **Unit Testing**

#### **Controller Tests**
```javascript
// Example test structure
describe('User Controller', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Test implementation
    });
    
    it('should return error with invalid email', async () => {
      // Test implementation
    });
  });
});
```

#### **Model Tests**
```javascript
describe('User Model', () => {
  it('should hash password before saving', async () => {
    // Test password hashing
  });
  
  it('should validate email format', async () => {
    // Test email validation
  });
});
```

### **Integration Testing**

#### **API Endpoint Tests**
```javascript
describe('Authentication API', () => {
  it('POST /api/auth/register should create new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'client'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });
});
```

### **Database Testing**

#### **Model Relationship Tests**
```javascript
describe('Model Relationships', () => {
  it('should create client profile when user is client', async () => {
    // Test user-client relationship
  });
  
  it('should allow freelancer to apply to projects', async () => {
    // Test application relationship
  });
});
```

### **Test Setup**

#### **Required Testing Tools**
```bash
npm install --save-dev jest supertest
```

#### **Test Database Configuration**
- Use separate test database
- Reset database before each test suite
- Seed test data for consistent testing

---

## 🚀 Deployment Checklist

### **Pre-Deployment Requirements**

#### **Environment Setup**
- [ ] Production database configured
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Domain name configured

#### **Security Checklist**
- [ ] All authentication endpoints implemented
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Security headers set (Helmet.js)
- [ ] CORS properly configured
- [ ] SQL injection protection verified
- [ ] XSS protection enabled

#### **Performance Checklist**
- [ ] Database indexes optimized
- [ ] Query performance tested
- [ ] File upload limits set
- [ ] Error logging configured
- [ ] Health check endpoints working

#### **Testing Checklist**
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Load testing completed
- [ ] Security testing completed
- [ ] User acceptance testing completed

### **Production Configuration**

#### **Environment Variables**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=production_secret_key
CLOUDINARY_CLOUD_NAME=...
STRIPE_SECRET_KEY=sk_live_...
```

#### **Database Migration**
```bash
# Run database migrations
npm run migrate

# Seed production data
npm run seed:production
```

#### **Monitoring Setup**
- Application performance monitoring
- Error tracking (e.g., Sentry)
- Database monitoring
- Server monitoring

### **Deployment Steps**

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Run Tests**
   ```bash
   npm test
   npm run test:integration
   ```

3. **Deploy to Staging**
   ```bash
   npm run deploy:staging
   ```

4. **Run Smoke Tests**
   ```bash
   npm run test:smoke
   ```

5. **Deploy to Production**
   ```bash
   npm run deploy:production
   ```

6. **Verify Deployment**
   - Check health endpoints
   - Test critical user flows
   - Monitor error rates

---

## 📞 Support & Resources

### **Team Communication**
- **Slack Channel:** #artlink-backend
- **Daily Standups:** 9:00 AM EST
- **Code Reviews:** GitHub Pull Requests
- **Architecture Discussions:** Weekly Fridays 2:00 PM

### **Documentation**
- **API Documentation:** Postman Collection (to be created)
- **Database Schema:** ERD Diagram (to be created)
- **Deployment Guide:** DevOps team documentation

### **External Resources**
- **Express.js Docs:** https://expressjs.com/
- **Sequelize Docs:** https://sequelize.org/
- **JWT.io:** https://jwt.io/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

*This document reflects the complete, production-ready state of the ArtLink backend with all core features implemented and tested.*