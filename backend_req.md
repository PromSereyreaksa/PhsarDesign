# Backend Requirements for PhsarDesign Frontend

## 📋 Table of Contents
- [API Base Configuration](#api-base-configuration)
- [Authentication Endpoints](#authentication-endpoints)
- [User Management](#user-management)
- [Artists Management](#artists-management)
- [Clients Management](#clients-management)
- [Posts & Marketplace](#posts--marketplace)
- [Projects & Applications](#projects--applications)
- [File Upload & Media](#file-upload--media)
- [Communication System](#communication-system)
- [Analytics & Notifications](#analytics--notifications)
- [Data Models & Schemas](#data-models--schemas)
- [Error Response Standards](#error-response-standards)
- [Security Requirements](#security-requirements)

---

## 🔧 API Base Configuration

### Base URL
```
Production: https://api.phsardesign.com
Development: Configurable via VITE_API_URL environment variable
```

### Required Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
Accept: application/json
```

### CORS Configuration
```
Origin: https://phsardesign.com, http://localhost:3000, http://localhost:5173
Credentials: true (required for refresh token cookies)
Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Headers: Content-Type, Authorization, Accept
```

---

## 🔐 Authentication Endpoints

### Core Authentication
| Endpoint | Method | Purpose | Request Body | Response |
|----------|---------|---------|--------------|----------|
| `/api/auth/login` | POST | User login | `{email, password}` | `{user, token}` |
| `/api/auth/register` | POST | User registration | `{firstName, lastName, email, password, role}` | `{user, token}` |
| `/api/auth/refresh` | POST | Token refresh | None (uses httpOnly cookie) | `{token}` |
| `/api/auth/logout` | POST | User logout | None | `{message}` |

### Password Management
| Endpoint | Method | Purpose | Request Body | Response |
|----------|---------|---------|--------------|----------|
| `/api/auth/request-otp` | POST | Request OTP | `{email, type}` | `{message}` |
| `/api/auth/verifyOTP` | POST | Verify OTP | `{email, otp}` | `{user, token}` |
| `/api/auth/change-password` | POST | Change password | `{email, newPassword}` | `{message}` |
| `/api/auth/request-forgot-password-otp` | POST | Request password reset | `{email}` | `{message}` |
| `/api/auth/verify-forgot-password-otp` | POST | Verify reset OTP | `{email, otp}` | `{verificationToken}` |

### Authentication Requirements
- **JWT Token Expiry**: 1 hour recommended
- **Refresh Token**: HttpOnly cookie, 7 days expiry
- **OTP Expiry**: 5 minutes for security
- **Rate Limiting**: Implement on auth endpoints (5 requests/minute)

---

## 👥 User Management

### User CRUD Operations
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/users` | GET | Get all users | `role, limit, offset` | `{users[], total}` |
| `/api/users/{id}` | GET | Get user by ID | `id` | `{user}` |
| `/api/users/email/{email}` | GET | Get user by email | `email` | `{user}` |
| `/api/users/role/{role}` | GET | Get users by role | `role` | `{users[]}` |
| `/api/users` | POST | Create user | `{userData}` | `{user}` |
| `/api/users/{id}` | PATCH | Update user | `id, {updates}` | `{user}` |
| `/api/users/{id}` | DELETE | Delete user | `id` | `{message}` |

### User Model Schema
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "role": "artist|client|admin",
  "isEmailVerified": "boolean",
  "avatarURL": "string|null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 🎨 Artists Management

### Artist Profile Operations
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/artists` | GET | Get all artists | `category, skills, limit, offset` | `{artists[], total}` |
| `/api/artists/{id}` | GET | Get artist by ID | `id` | `{artist}` |
| `/api/artists/user/{userId}` | GET | Get artist by user ID | `userId` | `{artist}` |
| `/api/artists/category/{category}` | GET | Get artists by category | `category` | `{artists[]}` |
| `/api/artists/slug/{slug}` | GET | Get artist by slug | `slug` | `{artist}` |
| `/api/artists/search` | GET | Search artists | `q, category, skills, location` | `{artists[], total}` |
| `/api/artists` | POST | Create artist profile | `{artistData}` | `{artist}` |
| `/api/artists/{id}` | PUT | Update artist | `id, {updates}` | `{artist}` |
| `/api/artists/slug/{slug}` | PUT | Update by slug | `slug, {updates}` | `{artist}` |
| `/api/artists/{id}` | DELETE | Delete artist | `id` | `{message}` |

### Artist Model Schema
```json
{
  "artistId": "string",
  "userId": "string",
  "user": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "avatarURL": "string"
  },
  "slug": "string",
  "bio": "string",
  "skills": "string[]",
  "serviceCategories": "string[]",
  "hourlyRate": "number",
  "portfolio": "object[]",
  "rating": "number",
  "totalReviews": "number",
  "isAvailable": "boolean",
  "location": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 🏢 Clients Management

### Client Profile Operations
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/clients` | GET | Get all clients | `limit, offset` | `{clients[], total}` |
| `/api/clients/id/{id}` | GET | Get client by ID | `id` | `{client}` |
| `/api/clients/user/{userId}` | GET | Get client by user ID | `userId` | `{client}` |
| `/api/clients/{slug}` | GET | Get client by slug | `slug` | `{client}` |
| `/api/clients/name/{name}` | GET | Get client by name | `name` | `{client}` |
| `/api/clients` | POST | Create client profile | `{clientData}` | `{client}` |
| `/api/clients/id/{id}` | PUT | Update client by ID | `id, {updates}` | `{client}` |
| `/api/clients/{slug}` | PUT | Update client by slug | `slug, {updates}` | `{client}` |
| `/api/clients/id/{id}` | DELETE | Delete client by ID | `id` | `{message}` |

### Client Model Schema
```json
{
  "clientId": "string",
  "userId": "string", 
  "user": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "avatarURL": "string"
  },
  "companyName": "string",
  "slug": "string",
  "description": "string",
  "industry": "string",
  "location": "string",
  "website": "string",
  "totalProjectsPosted": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 🛒 Posts & Marketplace

### Availability Posts (Artist Services)
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/availability-posts` | GET | Get all posts | `limit, isActive, category, artistId` | `{posts[], total}` |
| `/api/availability-posts/{id}` | GET | Get post by ID | `id` | `{post}` |
| `/api/availability-posts/slug/{slug}` | GET | Get post by slug | `slug` | `{post}` |
| `/api/availability-posts/artist/{artistId}` | GET | Get posts by artist | `artistId, limit, offset` | `{posts[], total}` |
| `/api/availability-posts/my-posts` | GET | Get current user's posts | `limit, offset` | `{posts[], total}` |
| `/api/availability-posts/search` | GET | Search posts | `q, category, skills, priceRange` | `{posts[], total}` |
| `/api/availability-posts` | POST | Create post | `{postData}` | `{post}` |
| `/api/availability-posts/{id}` | PUT | Update post | `id, {updates}` | `{post}` |
| `/api/availability-posts/{id}` | DELETE | Delete post | `id` | `{message}` |

### Job Posts (Client Jobs)
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/job-posts` | GET | Get all job posts | `limit, isActive, category` | `{posts[], total}` |
| `/api/job-posts/{id}` | GET | Get job post by ID | `id` | `{post}` |
| `/api/job-posts/slug/{slug}` | GET | Get job post by slug | `slug` | `{post}` |
| `/api/job-posts/search` | GET | Search job posts | `q, category, budget, location` | `{posts[], total}` |
| `/api/job-posts/client/{clientId}` | POST | Create job post | `clientId, {postData}` | `{post}` |
| `/api/job-posts/{id}` | PUT | Update job post | `id, {updates}` | `{post}` |
| `/api/job-posts/{id}` | DELETE | Delete job post | `id` | `{message}` |
| `/api/job-posts/{jobId}/apply` | POST | Apply to job | `jobId, {applicationData}` | `{application}` |

### Post Model Schemas

#### Availability Post Schema
```json
{
  "id": "string",
  "slug": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "skills": "string[]",
  "pricing": {
    "type": "fixed|hourly|package",
    "amount": "number",
    "currency": "USD"
  },
  "deliveryTime": "string",
  "attachments": "object[]",
  "artist": {
    "artistId": "string",
    "user": {
      "firstName": "string",
      "lastName": "string",
      "avatarURL": "string"
    }
  },
  "isActive": "boolean",
  "views": "number",
  "applicationsCount": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### Job Post Schema
```json
{
  "jobId": "string",
  "slug": "string", 
  "title": "string",
  "description": "string",
  "requirements": "string",
  "category": "string",
  "skills": "string[]",
  "budget": {
    "type": "fixed|hourly|negotiable",
    "min": "number",
    "max": "number",
    "currency": "USD"
  },
  "timeline": "string",
  "attachments": "object[]",
  "client": {
    "clientId": "string",
    "user": {
      "firstName": "string",
      "lastName": "string",
      "avatarURL": "string"
    },
    "companyName": "string"
  },
  "isActive": "boolean",
  "applicationsCount": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 📁 Projects & Applications

### Projects Management
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/projects` | GET | Get all projects | `status, clientId, artistId, limit` | `{projects[], total}` |
| `/api/projects/{id}` | GET | Get project by ID | `id` | `{project}` |
| `/api/projects/client/{clientId}` | GET | Get client projects | `clientId, status, limit` | `{projects[], total}` |
| `/api/projects/status/{status}` | GET | Get by status | `status` | `{projects[]}` |
| `/api/projects/search` | GET | Search projects | `q, status, dateRange` | `{projects[], total}` |
| `/api/projects/search/artists` | GET | Search artist projects | `artistId, status` | `{projects[], total}` |
| `/api/projects` | POST | Create project | `{projectData}` | `{project}` |
| `/api/projects/{id}` | PUT | Update project | `id, {updates}` | `{project}` |
| `/api/projects/{id}/status` | PATCH | Update status | `id, {status}` | `{project}` |
| `/api/projects/{id}` | DELETE | Delete project | `id` | `{message}` |

### Applications Management  
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/applications` | GET | Get all applications | `status, type, limit, offset` | `{applications[], total}` |
| `/api/applications/{id}` | GET | Get application by ID | `id` | `{application}` |
| `/api/applications/project/{projectId}` | GET | Get project applications | `projectId, status` | `{applications[], total}` |
| `/api/applications/artist/{artistId}` | GET | Get artist applications | `artistId, status` | `{applications[], total}` |
| `/api/applications/type/{type}` | GET | Get by type | `type` | `{applications[]}` |
| `/api/applications/received` | GET | Get received applications | `status, limit` | `{applications[], total}` |
| `/api/applications/sent` | GET | Get sent applications | `status, limit` | `{applications[], total}` |
| `/api/applications` | POST | Create application | `{applicationData}` | `{application}` |
| `/api/applications/job` | POST | Apply to job | `{applicationData}` | `{application}` |
| `/api/applications/service` | POST | Apply to service | `{applicationData}` | `{application}` |
| `/api/applications/{applicationId}/convert-to-project` | POST | Convert to project | `applicationId, {projectData}` | `{project}` |
| `/api/applications/{id}` | PUT | Update application | `id, {updates}` | `{application}` |
| `/api/applications/{id}/status` | PATCH | Update status | `id, {statusData}` | `{application}` |
| `/api/applications/{id}` | DELETE | Delete application | `id` | `{message}` |

---

## 📤 File Upload & Media

### Upload Endpoints
| Endpoint | Method | Purpose | Content-Type | Response |
|----------|---------|---------|--------------|----------|
| `/api/upload/image` | POST | Upload single image | `multipart/form-data` | `{url, publicId}` |
| `/api/upload/images` | POST | Upload multiple images | `multipart/form-data` | `{urls[], publicIds[]}` |
| `/api/upload/avatar` | POST | Upload avatar image | `multipart/form-data` | `{url, publicId}` |
| `/api/upload/portfolio` | POST | Upload portfolio images | `multipart/form-data` | `{urls[], publicIds[]}` |

### Image Management
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/upload/image/{publicId}` | GET | Get image info | `publicId` | `{image}` |
| `/api/upload/images` | GET | List images | `limit, folder, resourceType` | `{images[], total}` |
| `/api/upload/image/{publicId}` | PUT | Update metadata | `publicId, {metadata}` | `{image}` |
| `/api/upload/transform/{publicId}` | POST | Transform image | `publicId, {transformations}` | `{url}` |
| `/api/upload/image/{publicId}` | DELETE | Delete image | `publicId` | `{message}` |
| `/api/upload/images` | DELETE | Delete multiple | `{publicIds[]}` | `{message}` |
| `/api/upload/signature` | POST | Generate signature | `{params}` | `{signature, timestamp}` |

### Upload Requirements
- **Max File Size**: 10MB per image
- **Allowed Formats**: JPEG, PNG, WebP, GIF
- **Security**: Virus scanning, file type validation
- **Storage**: Cloud storage (Cloudinary recommended)
- **Response Format**: Always return URL and publicId
- **Error Handling**: Specific error codes for file issues

---

## 💬 Communication System

### Messages API
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/messages` | GET | Get conversations | `limit, offset, unread` | `{conversations[], total}` |
| `/api/messages/conversation/{otherUserId}` | GET | Get conversation | `otherUserId, limit, offset` | `{messages[], total}` |
| `/api/messages/unread-count` | GET | Get unread count | None | `{count}` |
| `/api/messages` | POST | Send message | `{messageData}` | `{message}` |
| `/api/messages/conversation/{otherUserId}/read` | PATCH | Mark as read | `otherUserId` | `{message}` |
| `/api/messages/{messageId}` | DELETE | Delete message | `messageId` | `{message}` |

### Portfolio API
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/portfolio` | GET | Get all portfolio items | `artistId, category, limit` | `{items[], total}` |
| `/api/portfolio/{id}` | GET | Get portfolio item | `id` | `{item}` |
| `/api/portfolio/artist/{artistId}` | GET | Get artist portfolio | `artistId, category` | `{items[], total}` |
| `/api/portfolio/categories` | GET | Get categories | None | `{categories[]}` |
| `/api/portfolio` | POST | Create portfolio item | `{portfolioData}` | `{item}` |
| `/api/portfolio/{id}` | PUT | Update portfolio item | `id, {updates}` | `{item}` |
| `/api/portfolio/{id}` | DELETE | Delete portfolio item | `id` | `{message}` |
| `/api/portfolio/{id}/like` | POST | Like portfolio item | `id` | `{likes}` |

### Reviews API
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/reviews` | GET | Get all reviews | `limit, offset, rating` | `{reviews[], total}` |
| `/api/reviews/{id}` | GET | Get review by ID | `id` | `{review}` |
| `/api/reviews/project/{projectId}` | GET | Get project reviews | `projectId` | `{reviews[]}` |
| `/api/reviews/artist/{artistId}` | GET | Get artist reviews | `artistId, limit` | `{reviews[], total, avgRating}` |
| `/api/reviews/client/{clientId}` | GET | Get client reviews | `clientId, limit` | `{reviews[], total}` |
| `/api/reviews` | POST | Create review | `{reviewData}` | `{review}` |
| `/api/reviews/{id}` | PUT | Update review | `id, {updates}` | `{review}` |
| `/api/reviews/{id}` | DELETE | Delete review | `id` | `{message}` |

---

## 💳 Analytics & Notifications

### Analytics API
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/analytics/artist/{artistId}` | GET | Get artist analytics | `artistId, dateRange, metrics` | `{analytics}` |
| `/api/analytics/client/{clientId}` | GET | Get client analytics | `clientId, dateRange, metrics` | `{analytics}` |
| `/api/analytics/track` | POST | Track event | `{eventData}` | `{message}` |

### Notifications API
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/notifications` | GET | Get notifications | `read, type, limit, offset` | `{notifications[], total}` |
| `/api/notifications/unread-count` | GET | Get unread count | None | `{count}` |
| `/api/notifications/types` | GET | Get notification types | None | `{types[]}` |
| `/api/notifications/{notificationId}/read` | PATCH | Mark as read | `notificationId` | `{notification}` |
| `/api/notifications/mark-all-read` | PATCH | Mark all as read | None | `{message}` |
| `/api/notifications/{notificationId}` | DELETE | Delete notification | `notificationId` | `{message}` |
| `/api/notifications` | POST | Create notification | `{notificationData}` | `{notification}` |

### Payments API
| Endpoint | Method | Purpose | Parameters | Response |
|----------|---------|---------|------------|----------|
| `/api/payments/create-intent` | POST | Create payment intent | `{paymentData}` | `{clientSecret}` |
| `/api/payments/confirm` | POST | Confirm payment | `{confirmationData}` | `{paymentIntent}` |
| `/api/payments/setup-intent` | POST | Create setup intent | None | `{clientSecret}` |
| `/api/payments/payment-methods` | GET | Get payment methods | None | `{paymentMethods[]}` |
| `/api/payments/payment-methods/{paymentMethodId}` | DELETE | Delete payment method | `paymentMethodId` | `{message}` |
| `/api/payments/history` | GET | Get payment history | `limit, offset, status` | `{payments[], total}` |

---

## 📊 Data Models & Schemas

### Categories System
```json
{
  "categoryId": "string",
  "name": "string",
  "slug": "string", 
  "description": "string",
  "icon": "string",
  "parentId": "string|null",
  "isActive": "boolean",
  "sortOrder": "number",
  "createdAt": "datetime"
}
```

### Attachment Schema (for posts/messages)
```json
{
  "id": "string",
  "filename": "string",
  "originalName": "string",
  "mimeType": "string",
  "size": "number",
  "url": "string",
  "publicId": "string",
  "uploadedAt": "datetime"
}
```

### Application Status Flow
```
pending → reviewing → shortlisted → accepted/rejected
```

### Project Status Flow  
```
created → in_progress → review → completed → paid
```

---

## ⚠️ Error Response Standards

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

### Error Response Format
```json
{
  "error": true,
  "message": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  },
  "timestamp": "datetime"
}
```

### Validation Error Format
```json
{
  "error": true,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

---

## 🔒 Security Requirements

### Authentication
- **JWT Tokens**: RS256 algorithm, 1 hour expiry
- **Refresh Tokens**: HttpOnly cookies, 7 days expiry, rotation on use
- **Password Hashing**: bcrypt with salt rounds ≥ 12
- **Rate Limiting**: Auth endpoints limited to 5 requests/minute per IP

### Authorization
- **Role-Based Access**: artist, client, admin roles
- **Resource Ownership**: Users can only access/modify their own resources
- **API Keys**: For payment processing integration

### Data Protection
- **Input Validation**: All inputs sanitized and validated
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Sanitize HTML content
- **File Upload**: Virus scanning, type validation, size limits

### HTTPS Requirements
- **SSL/TLS**: All endpoints must use HTTPS in production
- **HSTS**: HTTP Strict Transport Security headers
- **CORS**: Properly configured for frontend domains

---

## 🔄 API Versioning & Pagination

### Versioning
- Current version: `v1` (implicit in URLs)
- Future versions: `/api/v2/...` when breaking changes needed

### Pagination Standard
```json
{
  "data": [],
  "meta": {
    "total": 150,
    "count": 20,
    "per_page": 20,
    "current_page": 1,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### Query Parameters
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip
- `page`: Page number (alternative to offset)
- `sort`: Sort field (e.g., `created_at`, `-created_at` for desc)
- `filter`: Various filters depending on endpoint

---

## 📝 Additional Requirements

### Performance Requirements
- **Response Time**: < 500ms for 95% of requests
- **Database**: Proper indexing on frequently queried fields
- **Caching**: Redis for session storage and frequently accessed data
- **Image Optimization**: Automatic compression and multiple sizes

### Monitoring & Logging
- **API Monitoring**: Track response times, error rates
- **Error Logging**: Structured logging with correlation IDs
- **Audit Trail**: Log important user actions
- **Health Checks**: `/health` endpoint for system status

### Development Tools
- **API Documentation**: OpenAPI/Swagger specification
- **Database Migrations**: Version-controlled schema changes
- **Testing**: Unit tests, integration tests, API tests
- **Environment**: Development, staging, production configurations

---

**Note**: This document represents the complete backend requirements for the PhsarDesign frontend. All endpoints listed are actively used by the frontend application and require implementation for full functionality.
