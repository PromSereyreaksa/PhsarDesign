# ArtLink - Creative Freelancing Platform

A modern platform connecting clients with talented artists for creative projects and services. Built with Node.js, Express, React, and PostgreSQL.

## 🚨 HIGH PRIORITY TODO

### Critical Issues to Fix (Top Priority)
1. **Authentication System** - Currently empty/non-functional
   - Fix empty `auth.controller.js` - implement login/register endpoints
   - Implement JWT token generation/validation in `utils/jwt.js`
   - Add input validation in `utils/validator.js`
   - Fix authentication middleware for proper token handling

2. **Database Issues**
   - Fix `Projects` import typo (`Projectss` → `Projects`) in project controller
   - Reorder routes in `user.routes.js` (specific routes before `:id`)
   - Ensure all model associations are properly configured

3. **API Endpoints Missing**
   - Complete availability posts controller methods
   - Fix job posts API integration
   - Implement proper error handling across all controllers
   - Add proper validation middleware

4. **Frontend Integration**
   - Connect authentication state to actual API calls
   - Fix user context in application forms (remove hardcoded IDs)
   - Implement proper error handling and loading states
   - Add proper route protection based on authentication

5. **File Upload System**
   - Configure and test Cloudinary integration
   - Implement proper image upload for portfolios
   - Add file validation and error handling

6. **Payment Integration**
   - Configure Stripe integration for project payments
   - Implement payment flow for completed projects
   - Add payment status tracking

### Development Tasks (Medium Priority)
- [ ] Implement comprehensive form validation
- [ ] Add proper error boundaries in React components
- [ ] Implement proper logout functionality
- [ ] Add pagination to all list views
- [ ] Implement real-time notifications
- [ ] Add comprehensive testing suite
- [ ] Implement proper SEO optimization
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Implement email verification system
- [ ] Add password reset functionality

### Feature Enhancements (Low Priority)
- [ ] Add advanced search and filtering
- [ ] Implement messaging system between users
- [ ] Add project collaboration features
- [ ] Implement portfolio showcase galleries
- [ ] Add social media integration
- [ ] Implement rating and review system improvements
- [ ] Add project milestone tracking
- [ ] Implement advanced analytics dashboard

---

## 🎨 Platform Overview

ArtLink is a comprehensive freelancing platform that facilitates connections between clients and creative professionals. The platform supports both:

- **Service-Based Work**: Artists post their availability and services, clients hire them
- **Project-Based Work**: Clients post job requirements, artists apply to work on them  
- **Application System**: Comprehensive application flow for both service hiring and job applications
- **Portfolio Management**: Artists showcase their work and manage their profiles
- **Review System**: Clients and artists can leave reviews after project completion

## 🔄 Platform Flow & Architecture

### Current System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     CLIENTS     │    │    PLATFORM     │    │    ARTISTS      │
│                 │    │                 │    │                 │
│ - Post Jobs     │◄──►│ - Applications  │◄──►│ - Post Services │
│ - Hire Artists  │    │ - Reviews       │    │ - Apply to Jobs │
│ - Leave Reviews │    │ - Portfolios    │    │ - Manage Work   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Two-Way Application System

#### 1. **Client-to-Service Flow** (Client hires Artist)
```
Client browses services → Selects artist service → Submits application → Artist accepts/rejects
```

#### 2. **Artist-to-Job Flow** (Artist applies to Client job)
```  
Artist browses jobs → Finds suitable job → Submits proposal → Client accepts/rejects
```

### Key Models & Relationships

```
Users (role: client|artist)
  ├── Clients (client profiles)
  ├── Artists (artist profiles)  
  ├── JobPosts (posted by clients)
  ├── AvailabilityPosts (posted by artists)
  ├── Applications (bidirectional - connects everything)
  ├── Projects (work containers)
  ├── Portfolio (artist showcases)
  ├── Reviews (feedback system)
  └── Messages (communication)
```

### Database Structure Overview

- **Users**: Base authentication layer (email, password, role)
- **Clients**: Client-specific data (organization, etc.)
- **Artists**: Artist-specific data (skills, rates, portfolio)
- **JobPosts**: Client job postings with requirements
- **AvailabilityPosts**: Artist service offerings
- **Applications**: Central connection system (artist↔client)
- **Projects**: Active work sessions
- **Portfolio**: Artist work showcases
- **Reviews**: Rating and feedback system

---

## 🏗️ Architecture

### Backend Stack
- **Framework**: Express.js 5.1.0 with ES6 modules
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based auth system
- **File Storage**: Cloudinary integration
- **Payments**: Stripe integration
- **Security**: Rate limiting, input sanitization, CORS

### Frontend Stack
- **Framework**: React 19 with React Router DOM
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS 4.x with Flowbite components
- **State Management**: Redux Toolkit with RTK Query
- **HTTP Client**: Axios with auth interceptors

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ArtLink
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Configure your environment variables
```

4. **Database Setup & Seeding**
```bash
# Create PostgreSQL database
createdb artlink_dev

# Seed the database with sample data
cd backend
node scripts/resyncAndSeed.js
```

5. **Start Development Servers**
```bash
# Backend (Terminal 1) - Port 5000
cd backend
node server.js

# Frontend (Terminal 2) - Port 5173
cd frontend
npm run dev
```

**Important**: Backend runs on `http://localhost:5000` and frontend on `http://localhost:5173`

### Current Development Status

⚠️ **Authentication is currently disabled for development**
- Authentication controllers are empty (see TODO above)
- Some routes have auth temporarily disabled for testing
- Database is pre-seeded with 100 users, artists, clients, and sample data

### Development Workflow for New Developers

1. **First Time Setup**:
   - Run the seeding script to populate database with test data
   - Backend will have 50 artists and 50 clients with sample posts
   - Frontend can immediately browse and interact with sample data

2. **Working on Features**:
   - Check the TODO list above for priority items
   - Authentication system needs to be built first
   - Most CRUD operations work but need proper user context
   - Forms work but currently use hardcoded user IDs (see TODO)

3. **Testing Your Changes**:
   - Re-run seeding script to reset data: `node scripts/resyncAndSeed.js`
   - Frontend hot-reloads automatically
   - Backend needs restart for model changes

---

## 💼 User Flows

### 👤 Client Journey

#### Option 1: Hiring an Artist (Client-to-Service)
1. **Browse Services** (`/browse-services`) - View artist availability posts
2. **Select Artist** - View artist profile, portfolio, and rates  
3. **Submit Application** - Use multi-step modal to request artist services
4. **Wait for Response** - Artist accepts/rejects the application
5. **Work Together** - Project becomes active, track progress
6. **Complete & Review** - Mark complete and leave review

#### Option 2: Posting a Job (Traditional)
1. **Post Job** (`/post-job-client`) - Create job posting with requirements
2. **Receive Applications** - Artists submit proposals to your job
3. **Review & Select** - Choose the best artist from applications
4. **Work Together** - Project becomes active
5. **Complete & Review** - Mark complete and leave review

### 🎨 Artist Journey

#### Option 1: Posting Availability (Service-Based)
1. **Post Availability** (`/post-availability`) - Create service offering
2. **Receive Applications** - Clients request your services
3. **Accept/Reject** - Choose clients you want to work with
4. **Work & Deliver** - Complete projects and get paid
5. **Build Reputation** - Receive reviews and repeat clients

#### Option 2: Applying to Jobs (Traditional)  
1. **Browse Jobs** (`/browse-job`) - View client job postings
2. **Submit Proposals** - Apply to jobs that match your skills
3. **Wait for Selection** - Client chooses from applicants
4. **Work & Deliver** - Complete projects if selected
5. **Build Portfolio** - Add completed work to showcase

### 🔄 Application Flow Details

Both flows use the same **Applications** system:

```
Application {
  applicationType: "client_to_service" | "artist_to_job"
  jobPostId: UUID (if artist applying to job)
  availabilityPostId: UUID (if client hiring artist)
  clientId: Integer
  artistId: Integer
  message: String (10-5000 chars)
  proposedBudget: Float (optional)
  proposedDeadline: Date (optional)
  status: "pending" | "accepted" | "rejected"
}
```

---

## 📊 Data Models (Current Implementation)

### Core Models

#### **Users**
```javascript
{
  userId: Integer (PK, AUTO_INCREMENT),
  email: String (UNIQUE, NOT NULL),
  password: String (HASHED, NOT NULL),
  role: ENUM('client', 'artist'),
  isEmailVerified: Boolean (DEFAULT false),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Artists** 
```javascript
{
  artistId: Integer (PK, AUTO_INCREMENT),
  userId: Integer (FK → Users.userId),
  name: String (NOT NULL),
  slug: String (UNIQUE),
  skills: Text,
  specialties: Text,
  availability: ENUM('available', 'busy', 'unavailable'),
  hourlyRate: Decimal,
  avatarUrl: String,
  portfolioUrl: String,
  rating: Float (1-5),
  totalCommissions: Integer (DEFAULT 0),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Clients**
```javascript
{
  clientId: Integer (PK, AUTO_INCREMENT),
  userId: Integer (FK → Users.userId),
  organization: String,
  name: String (NOT NULL),
  slug: String (UNIQUE),
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **JobPost** *(Client job postings)*
```javascript
{
  jobId: UUID (PK),
  clientId: Integer (FK → Clients.clientId),
  title: String (NOT NULL),
  slug: String (UNIQUE),
  description: Text (NOT NULL),
  category: ENUM('illustration', 'design', 'photography', etc.),
  budget: Float,
  budgetType: ENUM('fixed', 'hourly', 'negotiable'),
  deadline: Date,
  location: String,
  skillsRequired: Text,
  experienceLevel: ENUM('beginner', 'intermediate', 'expert', 'any'),
  attachments: JSON,
  status: ENUM('open', 'closed', 'in_progress'),
  applicationsCount: Integer (DEFAULT 0),
  viewCount: Integer (DEFAULT 0),
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### **AvailabilityPost** *(Artist service offerings)*
```javascript
{
  postId: UUID (PK),
  artistId: Integer (FK → Artists.artistId),
  title: String (NOT NULL),
  slug: String (UNIQUE),
  description: Text (NOT NULL),
  category: ENUM('illustration', 'design', 'photography', etc.),
  availabilityType: ENUM('immediate', 'within-week', 'within-month', 'flexible'),
  duration: String,
  budget: Float,
  location: String,
  skills: Text,
  portfolioSamples: JSON,
  contactPreference: ENUM('platform', 'email', 'direct'),
  status: ENUM('active', 'paused', 'closed'),
  expiresAt: Date,
  viewCount: Integer (DEFAULT 0),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Applications** *(Central connection system)*
```javascript
{
  applicationId: Integer (PK, AUTO_INCREMENT),
  projectId: UUID (FK → Projects.projectId, NULLABLE),
  jobPostId: UUID (FK → JobPost.jobId, NULLABLE),
  availabilityPostId: UUID (FK → AvailabilityPost.postId, NULLABLE),
  artistId: Integer (FK → Artists.artistId, NULLABLE),
  clientId: Integer (FK → Clients.clientId, NULLABLE),
  applicationType: ENUM('artist_to_job', 'client_to_service') NOT NULL,
  message: Text (10-5000 chars),
  proposedBudget: Float (NULLABLE),
  proposedDeadline: Date (NULLABLE),
  status: ENUM('pending', 'accepted', 'rejected', 'converted_to_project'),
  createdAt: Date
}
```

#### **Projects** *(Active work sessions)*
```javascript
{
  projectId: UUID (PK),
  clientId: Integer (FK → Clients.clientId),
  artistId: Integer (FK → Artists.artistId, NULLABLE),
  title: String (NOT NULL),
  description: Text,
  budget: Float,
  status: ENUM('open', 'in_progress', 'completed', 'cancelled'),
  paymentStatus: ENUM('pending', 'processing', 'completed', 'failed'),
  paymentIntentId: String (NULLABLE),
  createdAt: Date,
  completedAt: Date (NULLABLE)
}
```

#### **Portfolio** *(Artist showcases)*
```javascript
{
  portfolioId: Integer (PK, AUTO_INCREMENT),
  artistId: Integer (FK → Artists.artistId),
  title: String (NOT NULL),
  description: Text,
  category: String,
  imageUrl: String,
  tags: JSON,
  projectUrl: String (NULLABLE),
  completionDate: Date,
  likes: Integer (DEFAULT 0),
  views: Integer (DEFAULT 0),
  featured: Boolean (DEFAULT false),
  isPublic: Boolean (DEFAULT true),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Reviews** *(Rating system)*
```javascript
{
  reviewId: Integer (PK, AUTO_INCREMENT),
  artistId: Integer (FK → Artists.artistId),
  userId: Integer (FK → Users.userId),
  projectId: UUID (FK → Projects.projectId, NULLABLE),
  rating: Integer (1-5),
  reviewText: Text,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login       - User login
POST   /api/auth/register    - User registration
POST   /api/auth/refresh     - Refresh JWT token
POST   /api/auth/logout      - User logout
```

### Artists *(New)*
```
GET    /api/artists                    - Browse all artists
GET    /api/artists/search             - Search artists by criteria
GET    /api/artists/category/:category - Filter by art category
GET    /api/artists/:id                - Get artist details
GET    /api/artists/user/:userId       - Get artist by user ID
POST   /api/artists                    - Create artist profile (auth)
PUT    /api/artists/:id                - Update artist profile (auth)
DELETE /api/artists/:id                - Delete artist profile (auth)
```

### Commissions *(New)*
```
POST   /api/commissions                    - Create commission request (auth)
GET    /api/commissions                    - Get all commissions (admin)
GET    /api/commissions/artist/:artistId   - Get artist's commissions (auth)
GET    /api/commissions/client             - Get client's commissions (auth)
GET    /api/commissions/:id                - Get commission details (auth)
PATCH  /api/commissions/:id/status         - Update commission status (auth)
POST   /api/commissions/:id/progress       - Add progress update (auth)
```

### Clients
```
GET    /api/clients           - Get all clients
GET    /api/clients/:id       - Get client details
POST   /api/clients           - Create client profile (auth)
PUT    /api/clients/:id       - Update client profile (auth)
DELETE /api/clients/:id       - Delete client profile (auth)
```

### Projects *(Legacy)*
```
GET    /api/projects          - Get all projects
GET    /api/projects/:id      - Get project details
POST   /api/projects          - Create project (auth)
PUT    /api/projects/:id      - Update project (auth)
DELETE /api/projects/:id      - Delete project (auth)
```

### Other Services
```
GET    /api/users/*           - User management
GET    /api/reviews/*         - Review system
POST   /api/upload/*          - File uploads (Cloudinary)
POST   /api/payments/*        - Payment processing (Stripe)
```

---

## 🔒 Authentication & Security

### JWT Authentication
- **Access Tokens**: Short-lived (15 minutes)
- **Refresh Tokens**: Long-lived (7 days)
- **Auto-refresh**: Frontend handles token renewal

### Security Features
- **Rate Limiting**: API endpoint protection
- **Input Sanitization**: XSS and injection prevention
- **CORS**: Cross-origin request security
- **Password Hashing**: bcryptjs with salt rounds
- **Role-based Access**: Client/Artist permissions

### Protected Routes
- Commission management requires authentication
- Profile updates require ownership or admin role
- Payment operations require client role
- Progress updates require artist role

---

## 🎯 Commission Status Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌───────────┐
│ PENDING │ -> │ ACCEPTED │ -> │ PROGRESS │ -> │ COMPLETED │
└─────────┘    └──────────┘    └──────────┘    └───────────┘
     │              │
     v              v
┌──────────┐   ┌──────────┐
│ REJECTED │   │ UPDATES  │
└──────────┘   └──────────┘
```

### Status Permissions
- **pending → accepted/rejected**: Artist only
- **accepted → completed**: Client only
- **Progress updates**: Artist only
- **View details**: Client & Artist involved

---

## 🛠️ Development Guidelines

### Code Standards
- **ES6 Modules**: Use import/export syntax
- **camelCase**: Consistent field naming
- **Async/Await**: Preferred over promises
- **Error Handling**: Comprehensive try/catch blocks
- **Validation**: Input validation on all endpoints

### Database Conventions
- **Primary Keys**: Use descriptive names (userId, artistId)
- **Foreign Keys**: Match referenced table conventions
- **Timestamps**: Include createdAt/updatedAt where relevant
- **Indexes**: Add for frequently queried fields

### API Conventions
- **RESTful**: Follow REST principles
- **HTTP Status**: Proper status codes (200, 201, 400, 404, 500)
- **Error Format**: Consistent error response structure
- **Pagination**: Implement for large datasets
- **Filtering**: Support query parameters for searches

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm test                   # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Database Testing
```bash
# Test database migration
node scripts/migrateToCommissionFlow.js

# Seed test data
node scripts/seedData.js
```

---

## 🚀 Deployment

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=https://api.artlink.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Production Deployment
1. **Database Migration**: Run migration script on production
2. **Environment Setup**: Configure production environment variables
3. **Build Assets**: `npm run build` for frontend
4. **Process Manager**: Use PM2 or similar for backend
5. **Reverse Proxy**: Nginx configuration for SSL/routing
6. **Monitoring**: Set up logging and error tracking

---

## 📈 Monitoring & Analytics

### Key Metrics
- **Commission Volume**: Track requests per month
- **Artist Activity**: Monitor profile completions and responses
- **Client Satisfaction**: Review ratings and completion rates
- **Revenue Tracking**: Commission fees and payment processing
- **Platform Growth**: User registration and retention

### Logging
- **Access Logs**: All API requests (Morgan)
- **Error Logs**: Application errors with stack traces
- **Security Logs**: Failed authentication attempts
- **Performance**: Response times and database queries

---

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow code standards and add tests
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Workflow
1. **Feature Development**: Work on feature branches
2. **Code Review**: All PRs require review
3. **Testing**: Ensure tests pass before merging
4. **Documentation**: Update docs for new features
5. **Migration**: Provide database migrations if needed

---

## 📚 Additional Resources

### Documentation
- [API Documentation](./backend/API_DOCS.md)
- [Database Schema](./backend/DATABASE_SCHEMA.md)
- [Frontend Architecture](./frontend/ARCHITECTURE.md)
- [Commission Refactor Summary](./backend/COMMISSION_REFACTOR_SUMMARY.md)

### External Services
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Sequelize Documentation](https://sequelize.org/docs/)
- [React Documentation](https://react.dev/)

---

## 📞 Support

### Technical Issues
- Create an issue in the repository
- Include error logs and reproduction steps
- Tag with appropriate labels (bug, enhancement, etc.)

### Business Inquiries
- Contact the development team
- Review platform terms and conditions
- Check commission fee structures

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the ArtLink Team**

*Connecting creativity with opportunity, one commission at a time.* 🎨