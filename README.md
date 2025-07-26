# ArtLink - Commission-Based Art Platform

A modern platform connecting clients with talented artists for custom art commissions. Built with Node.js, Express, React, and PostgreSQL.

## 🎨 Platform Overview

ArtLink has been transformed from a traditional freelancing platform into a streamlined commission-based art marketplace. The platform facilitates direct connections between clients seeking custom artwork and skilled artists ready to bring their visions to life.

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

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb artlink_dev

# Run migration (transforms old schema to commission flow)
cd backend
node scripts/migrateToCommissionFlow.js
```

5. **Start Development Servers**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)  
cd frontend
npm run dev
```

The backend runs on `http://localhost:3000` and frontend on `http://localhost:5173`.

---

## 💼 Commission Flow

### 👤 Client Journey
1. **Browse Artists** - Discover talented artists via search and categories
2. **Select Artist** - View portfolios, ratings, and hourly rates
3. **Create Commission** - Describe project requirements and set budget
4. **Submit Request** - Commission enters pending status
5. **Track Progress** - Receive updates and images from artist
6. **Complete & Pay** - Mark commission complete when satisfied

### 🎨 Artist Journey
1. **Create Profile** - Showcase skills, portfolio, and set rates
2. **Receive Requests** - View pending commission opportunities
3. **Accept/Reject** - Choose projects that align with expertise
4. **Work & Update** - Send progress updates with images
5. **Deliver & Earn** - Complete commissions and build reputation

---

## 📊 Data Models

### Core Models

#### **User**
```javascript
{
  userId: Integer (PK),
  email: String (unique),
  password: String (hashed),
  role: 'client' | 'artist',
  stripeCustomerId: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Artist** *(formerly Freelancer)*
```javascript
{
  artistId: Integer (PK),
  userId: Integer (FK),
  name: String,
  bio: Text,
  skills: Text,
  specialties: Text,
  availability: String,
  hourlyRate: Decimal,
  avatarUrl: String,
  portfolioUrl: String,
  rating: Float (1-5),
  totalCommissions: Integer
}
```

#### **Client**
```javascript
{
  clientId: Integer (PK),
  userId: Integer (FK),
  organization: String,
  name: String,
  slug: String (unique),
  avatarUrl: String
}
```

#### **CommissionRequest** *(New)*
```javascript
{
  id: UUID (PK),
  artistId: Integer (FK),
  clientId: Integer (FK),
  description: Text,
  price: Decimal,
  status: 'pending' | 'accepted' | 'rejected' | 'completed',
  progressUpdates: JSON,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Project** *(Legacy - for job postings)*
```javascript
{
  projectId: Integer (PK),
  clientId: Integer (FK),
  artistId: Integer (FK),
  title: String,
  description: Text,
  budget: Float,
  status: String,
  paymentStatus: String,
  paymentIntentId: String,
  createdAt: Date,
  completedAt: Date
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