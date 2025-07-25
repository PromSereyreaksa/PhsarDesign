# ArtLink Backend API Endpoints

**Base URL:** `http://localhost:4000`
**Last Updated:** July 25, 2025
**Status:** ✅ All endpoints functional

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🏥 Health Check

### Check Server Status
- **GET** `/health`
- **Description:** Check if server is running
- **Response:**
```json
{
  "status": "OK",
  "message": "ArtLink Backend is running"
}
```

---

## 👤 Users API (`/api/users`)

**Note:** All user endpoints require authentication. For user registration, use `/api/auth/register`.

### ⚠️ Create User (Admin Only)
- **POST** `/api/users`
- **Auth Required:** No (but recommended to use `/api/auth/register` instead)
- **Description:** Direct user creation (use registration endpoint instead)
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "client"
}
```
- **Response:** `201 Created`
- **Note:** 🚨 **Recommended:** Use `/api/auth/register` for proper user registration

### Get All Users
- **GET** `/api/users`
- **Auth Required:** Yes
- **Response:** Array of users

### Get User by ID
- **GET** `/api/users/:id`
- **Auth Required:** Yes
- **Example:** `/api/users/1`
- **Response:** User object or 404

### Update User
- **PUT** `/api/users/:id`
- **Auth Required:** Yes
- **Body:**
```json
{
  "email": "updated@example.com",
  "role": "freelancer"
}
```
- **Response:** Updated user object

### Delete User
- **DELETE** `/api/users/:id`
- **Auth Required:** Yes
- **Response:** `204 No Content`

### Get User by Email
- **GET** `/api/users/email/:email`
- **Auth Required:** Yes
- **Example:** `/api/users/email/user@example.com`
- **Response:** User object or 404

### Get Users by Role
- **GET** `/api/users/role/:role`
- **Auth Required:** Yes
- **Example:** `/api/users/role/client`
- **Response:** Array of users with specified role

---



## 🔐 Authentication API (`/api/auth`)

### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}
```
- **Response:** `201 Created`
```json
{
  "user": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```

### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** `200 OK` + Sets httpOnly cookie
```json
{
  "user": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token
- **POST** `/api/auth/refresh`
- **Description:** Get new access token using refresh token cookie
- **Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout
- **POST** `/api/auth/logout`
- **Description:** Clear refresh token cookie
- **Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```


## 🏢 Clients API (`/api/clients`)

### Create Client
- **POST** `/api/clients`
- **Body:**
```json
{
  "userId": 1,
  "name": "long",
  "organization": "Tech Corp",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```
- **Response:** `201 Created`
```json
 {
        "clientId": 1,
        "userId": 1,
        "organization": "software",
        "name": "long",
        "avatarUrl": "https://example.com/avatar.jpg",
        "createdAt": "2025-07-25T16:11:09.385Z",
        "updatedAt": "2025-07-25T16:16:54.787Z"
    }
```
### Get All Clients
- **GET** `/api/clients`
- **Response:** Array of clients

### Get Client by ID
- **GET** `/api/clients/:id`
- **Example:** `/api/clients/1`
- **Response:** Client object or 404

### Update Client
- **PUT** `/api/clients/:id`
- **Body:**
```json
{
   "organization": "software",
    "name": "long"
}
```
- **Response:** Updated client object

### Delete Client
- **DELETE** `/api/clients/:id`
- **Response:** `204 No Content`

---

## 💼 Freelancers API (`/api/freelancers`)

### Create Freelancer
- **POST** `/api/freelancers`
- **Body:**
```json
{
  "userId": 2,
  "name": "John Doe",
  "skills": "React, Node.js, MongoDB",
  "availability": "Available",
  "portfolio_images_text": "Portfolio description",
  "avatarUrl": "https://example.com/john-avatar.jpg"
}
```
- **Response:** `201 Created`

### Get All Freelancers
- **GET** `/api/freelancers`
- **Response:** Array of freelancers

### Get Freelancer by ID
- **GET** `/api/freelancers/:id`
- **Example:** `/api/freelancers/1`
- **Response:** Freelancer object or 404

### Update Freelancer
- **PUT** `/api/freelancers/:id`
- **Body:**
```json
{
  "skills": "React, Node.js, Python",
  "availability": "Busy"
}
```
- **Response:** Updated freelancer object

### Delete Freelancer
- **DELETE** `/api/freelancers/:id`
- **Response:** `204 No Content`

---

## 📋 Projects API (`/api/projects`)

### Create Project
- **POST** `/api/projects`
- **Body:**
```json
{
  "clientId": 1,
  "title": "E-commerce Website",
  "description": "Build a modern e-commerce platform",
  "budget": 5000,
  "deadline": "2024-12-31",
  "status": "open",
  "required_skills": "React, Node.js, MongoDB"
}
```
- **Response:** `201 Created`

### Get All Projects
- **GET** `/api/projects`
- **Response:** Array of projects

### Get Project by ID
- **GET** `/api/projects/:id`
- **Example:** `/api/projects/1`
- **Response:** Project object or 404

### Update Project
- **PUT** `/api/projects/:id`
- **Body:**
```json
{
  "status": "in_progress",
  "budget": 6000
}
```
- **Response:** Updated project object

### Delete Project
- **DELETE** `/api/projects/:id`
- **Response:** `204 No Content`

---

## 🎨 Portfolio API (`/api/portfolio`)

### Create Portfolio
- **POST** `/api/portfolio`
- **Body:**
```json
{
  "freelancerId": 1,
  "title": "E-commerce Dashboard",
  "description": "Modern admin dashboard for e-commerce",
  "imageUrl": "https://example.com/portfolio1.jpg",
  "projectUrl": "https://github.com/user/project",
  "tags": ["React", "Dashboard", "UI/UX"]
}
```
- **Response:** `201 Created`

### Get All Portfolios
- **GET** `/api/portfolio`
- **Response:** Array of portfolios

### Get Portfolio by ID
- **GET** `/api/portfolio/:id`
- **Example:** `/api/portfolio/1`
- **Response:** Portfolio object or 404

### Update Portfolio
- **PUT** `/api/portfolio/:id`
- **Body:**
```json
{
  "title": "Updated Dashboard",
  "tags": ["React", "Dashboard", "Modern"]
}
```
- **Response:** Updated portfolio object

### Delete Portfolio
- **DELETE** `/api/portfolio/:id`
- **Response:** `204 No Content`

---

---

## 📁 File Upload API (`/api/upload`)

### Upload Single Image
- **POST** `/api/upload/image`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `image`: File (required)
  - `folder`: String (optional, default: "artlink/general")
  - `tags`: String (optional, comma-separated)
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "public_id": "artlink/general/sample123",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1627123456/artlink/general/sample123.jpg",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245760
  }
}
```

### Upload Multiple Images
- **POST** `/api/upload/images`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `images`: Files (required, max 10 files)
  - `folder`: String (optional)
  - `tags`: String (optional)
- **Response:** `201 Created`

### Upload Avatar
- **POST** `/api/upload/avatar`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `avatar`: File (required)
  - `userId`: String (required)
- **Response:** `201 Created`

### Upload Portfolio Image
- **POST** `/api/upload/portfolio`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `portfolio`: File (required)
  - `freelancerId`: String (required)
  - `portfolioId`: String (optional)
  - `title`: String (optional)
  - `description`: String (optional)
- **Response:** `201 Created`

### Get Image Details
- **GET** `/api/upload/image/:publicId`
- **Example:** `/api/upload/image/artlink%2Fgeneral%2Fsample123`
- **Response:** `200 OK`

### List Images
- **GET** `/api/upload/images`
- **Query Parameters:**
  - `folder`: Filter by folder (default: "artlink")
  - `max_results`: Number (default: 20, max: 50)
  - `next_cursor`: For pagination
  - `tags`: Filter by tags (comma-separated)
- **Response:** `200 OK`

### Update Image Metadata
- **PUT** `/api/upload/image/:publicId`
- **Auth Required:** Yes
- **Body:**
```json
{
  "tags": ["new_tag1", "new_tag2"],
  "context": {
    "title": "Updated Title",
    "description": "Updated Description"
  }
}
```
- **Response:** `200 OK`

### Transform Image
- **POST** `/api/upload/transform/:publicId`
- **Body:**
```json
{
  "width": 500,
  "height": 500,
  "crop": "fill",
  "quality": "auto:good",
  "format": "webp"
}
```
- **Response:** `200 OK`

### Delete Image
- **DELETE** `/api/upload/image/:publicId`
- **Auth Required:** Yes
- **Response:** `200 OK`

### Delete Multiple Images
- **DELETE** `/api/upload/images`
- **Auth Required:** Yes
- **Body:**
```json
{
  "publicIds": ["image1", "image2", "image3"]
}
```
- **Response:** `200 OK`

### Generate Upload Signature
- **POST** `/api/upload/signature`
- **Auth Required:** Yes
- **Body:**
```json
{
  "folder": "artlink/portfolios",
  "public_id": "custom_id"
}
```
- **Response:** `200 OK`

---

## 💳 Payments API (`/api/payments`)

**Note:** All payment endpoints require authentication and valid Stripe configuration.

### Create Payment Intent
- **POST** `/api/payments/create-intent`
- **Auth Required:** Yes
- **Description:** Create a payment intent for project payment
- **Body:**
```json
{
  "projectId": 1,
  "amount": 99.99,
  "currency": "usd",
  "description": "Payment for logo design project"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment intent created successfully",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxxxxxxxxxxxx",
    "amount": 9999,
    "currency": "usd",
    "status": "requires_payment_method"
  }
}
```

### Confirm Payment
- **POST** `/api/payments/confirm`
- **Auth Required:** Yes
- **Description:** Confirm a payment with payment method
- **Body:**
```json
{
  "paymentIntentId": "pi_xxxxxxxxxxxxx",
  "paymentMethodId": "pm_xxxxxxxxxxxxx"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment confirmed",
  "data": {
    "status": "succeeded",
    "paymentIntentId": "pi_xxxxxxxxxxxxx"
  }
}
```

### Create Setup Intent
- **POST** `/api/payments/setup-intent`
- **Auth Required:** Yes
- **Description:** Create setup intent for saving payment methods
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Setup intent created successfully",
  "data": {
    "clientSecret": "seti_xxx_secret_xxx",
    "setupIntentId": "seti_xxxxxxxxxxxxx"
  }
}
```

### Get Payment Methods
- **GET** `/api/payments/payment-methods`
- **Auth Required:** Yes
- **Description:** Get user's saved payment methods
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment methods retrieved successfully",
  "data": {
    "paymentMethods": [
      {
        "id": "pm_xxxxxxxxxxxxx",
        "type": "card",
        "card": {
          "brand": "visa",
          "last4": "4242",
          "exp_month": 12,
          "exp_year": 2025
        }
      }
    ]
  }
}
```

### Delete Payment Method
- **DELETE** `/api/payments/payment-methods/:paymentMethodId`
- **Auth Required:** Yes
- **Description:** Delete a saved payment method
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment method deleted successfully"
}
```

### Get Payment History
- **GET** `/api/payments/history`
- **Auth Required:** Yes
- **Description:** Get user's payment history
- **Query Parameters:**
  - `limit` (optional): Number of results per page (default: 10)
  - `page` (optional): Page number (default: 1)
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "data": {
    "payments": [
      {
        "projectId": 1,
        "title": "Logo Design Project",
        "budget": 99.99,
        "status": "paid",
        "paymentStatus": "completed",
        "paymentIntentId": "pi_xxxxxxxxxxxxx",
        "client": {
          "userId": 1,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "freelancer": {
          "userId": 2,
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Stripe Webhook
- **POST** `/api/payments/webhook`
- **Auth Required:** No (verified by Stripe)
- **Description:** Handle Stripe webhook events
- **Note:** This endpoint is called by Stripe, not your frontend

---

## 🧪 Testing Sequence

### 1. Basic Server Test
```bash
GET /health
```

### 2. Authentication Flow
```bash
# Register new user
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "client"
}

# Login user
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# Use the returned accessToken in subsequent requests
```

### 3. Create Test Client
```bash
POST /api/clients
Authorization: Bearer <access_token>
{
  "userId": 1,
  "companyName": "Test Company",
  "industry": "Technology"
}
```

### 4. Create Test Freelancer User
```bash
POST /api/auth/register
{
  "name": "Jane Developer",
  "email": "freelancer@example.com",
  "password": "password123",
  "role": "freelancer"
}
```

### 5. Create Test Freelancer
```bash
POST /api/freelancers
Authorization: Bearer <freelancer_access_token>
{
  "userId": 2,
  "name": "Jane Developer",
  "skills": "React, Node.js"
}
```

### 6. Upload Test Image
```bash
POST /api/upload/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- image: [file]
- folder: "artlink/test"
- tags: "test,sample"
```

### 7. Create Test Project
```bash
POST /api/projects
Authorization: Bearer <client_access_token>
{
  "clientId": 1,
  "title": "Test Project",
  "description": "Sample project",
  "budget": 1000
}
```

### 8. Create Test Portfolio
```bash
POST /api/portfolio
Authorization: Bearer <freelancer_access_token>
{
  "freelancerId": 1,
  "title": "Sample Work",
  "imageUrl": "https://via.placeholder.com/400x300"
}
```

---

## 📝 Common Headers

For all POST and PUT requests, include:
```
Content-Type: application/json
```

For authenticated requests, include:
```
Authorization: Bearer <your_jwt_token>
```

For file uploads, use:
```
Content-Type: multipart/form-data
```

## 🚨 Common Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (Delete success)
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `409` - Conflict (Duplicate resource)
- `500` - Internal Server Error

## 🔧 Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🛠️ Environment Setup

Before testing, ensure your `.env` file contains:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/artlink_db

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🧪 Testing Tools

### Interactive Web Interface
Open the test page in your browser:
```
file:///home/long/Desktop/New Folder 1/ArtLink/backend/test/cloudinary-test.html
```

### Command Line Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"client"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

**Note:** Make sure the server is running with `node server.js` before testing these endpoints.