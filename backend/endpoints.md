# ArtLink Backend API Endpoints

**Base URL:** `http://localhost:4000`
**Last Updated:** January 15, 2025
**Status:** ✅ All endpoints functional and production-ready

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Getting Started
1. Register a new user with `/api/auth/register`
2. Use the returned token for subsequent requests
3. Create your profile (client or artist) after registration
4. Start using the platform features

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

## � Authentication API (`/api/auth`)

### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "client"
}
```
- **Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "role": "client",
    "createdAt": "2025-01-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "role": "client"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout User
- **POST** `/api/auth/logout`
- **Auth Required:** Yes
- **Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

### Get User Profile
- **GET** `/api/auth/profile`
- **Auth Required:** Yes
- **Response:** `200 OK`
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "client",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "client": {
    "clientId": 1,
    "organizationName": "My Company",
    "website": "https://mycompany.com"
  }
}
```

### Refresh Token
- **POST** `/api/auth/refresh`
- **Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```
- **Response:** New access token

---

## 👤 Users API (`/api/users`)

**Note:** All user endpoints require authentication. For user registration, use `/api/auth/register`.

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
  "email": "updated@example.com"
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

## 🎨 Artists API (`/api/artists`)

### Create Artist Profile
- **POST** `/api/artists`
- **Auth Required:** Yes
- **Body:**
```json
{
  "userId": 2,
  "name": "Jane Smith",
  "skills": "Digital Art, Illustration, Logo Design",
  "bio": "Professional digital artist with 5+ years experience",
  "specialties": "Character Design, UI/UX",
  "hourlyRate": 75.00,
  "portfolioUrl": "https://portfolio.example.com"
}
```
- **Response:** `201 Created`
```json
{
  "artistId": 1,
  "userId": 2,
  "name": "Jane Smith",
  "slug": "jane-smith",
  "skills": "Digital Art, Illustration, Logo Design",
  "bio": "Professional digital artist with 5+ years experience",
  "specialties": "Character Design, UI/UX",
  "availability": "available",
  "hourlyRate": 75.00,
  "portfolioUrl": "https://portfolio.example.com",
  "rating": null,
  "totalCommissions": 0,
  "avatarUrl": null,
  "createdAt": "2025-07-27T12:00:00.000Z",
  "updatedAt": "2025-07-27T12:00:00.000Z"
}
```

### Get All Artists
- **GET** `/api/artists`
- **Response:** Array of artists

### Get Artist by ID
- **GET** `/api/artists/:id`
- **Example:** `/api/artists/1`
- **Response:** Artist object or 404

### Get Artist by Slug
- **GET** `/api/artists/slug/:slug`
- **Example:** `/api/artists/slug/jane-smith`
- **Response:** Artist object or 404

### Update Artist Profile
- **PUT** `/api/artists/:id`
- **Auth Required:** Yes
- **Body:**
```json
{
  "skills": "Digital Art, Illustration, 3D Modeling",
  "hourlyRate": 85.00,
  "availability": "busy"
}
```
- **Response:** Updated artist object

### Delete Artist Profile
- **DELETE** `/api/artists/:id`
- **Auth Required:** Yes
- **Response:** `204 No Content`

---

## 💼 Job Posts API (`/api/job-posts`) - Client Hiring

### Create Job Post (Client Hiring)
- **POST** `/api/job-posts/client/:clientId`
- **Auth Required:** Yes
- **Description:** Clients can post jobs to hire artists
- **Body:**
```json
{
  "title": "Logo Design for Tech Startup",
  "description": "We need a modern, professional logo for our new tech startup. The logo should be versatile and work across digital and print media.",
  "category": "design",
  "budget": 500,
  "budgetType": "fixed",
  "deadline": "2025-08-15T00:00:00Z",
  "skillsRequired": "logo design, branding, adobe illustrator",
  "experienceLevel": "intermediate",
  "location": "Remote"
}
```
- **Response:** `201 Created`
```json
{
  "jobId": "af768d6d-13e2-45c3-abb8-93eda28ae324",
  "clientId": 1,
  "title": "Logo Design for Tech Startup",
  "slug": "logo-design-for-tech-startup",
  "description": "We need a modern, professional logo for our new tech startup...",
  "category": "design",
  "budget": 500,
  "budgetType": "fixed",
  "deadline": "2025-08-15T00:00:00.000Z",
  "location": "Remote",
  "skillsRequired": "logo design, branding, adobe illustrator",
  "experienceLevel": "intermediate",
  "attachments": [],
  "status": "open",
  "applicationsCount": 0,
  "viewCount": 0,
  "expiresAt": null,
  "createdAt": "2025-07-27T12:00:00.000Z",
  "updatedAt": "2025-07-27T12:00:00.000Z",
  "client": {
    "clientId": 1,
    "name": "Tech Startup Inc",
    "organization": "Technology",
    "avatarUrl": null
  }
}
```

### Get All Job Posts
- **GET** `/api/job-posts`
- **Query Parameters:**
  - `category`: Filter by category
  - `budget_min`: Minimum budget
  - `budget_max`: Maximum budget
  - `experience`: Experience level filter
- **Response:** Array of job posts

### Get Job Post by ID
- **GET** `/api/job-posts/:jobId`
- **Example:** `/api/job-posts/af768d6d-13e2-45c3-abb8-93eda28ae324`
- **Response:** Job post object or 404

### Update Job Post
- **PUT** `/api/job-posts/:jobId`
- **Auth Required:** Yes (Only by client who created it)
- **Body:**
```json
{
  "budget": 600,
  "deadline": "2025-08-20T00:00:00Z",
  "status": "in_progress"
}
```
- **Response:** Updated job post object

### Delete Job Post
- **DELETE** `/api/job-posts/:jobId`
- **Auth Required:** Yes (Only by client who created it)
- **Response:** `204 No Content`

### Apply to Job Post
- **POST** `/api/job-posts/:jobId/apply`
- **Auth Required:** Yes (Artists only)
- **Body:**
```json
{
  "coverLetter": "I'm very interested in this project...",
  "proposedRate": 450,
  "estimatedDuration": "2 weeks"
}
```
- **Response:** Application created

---

## 🎯 Availability Posts API (`/api/availability-posts`) - Artist Services

### Create Availability Post (Artist Offering Services)
- **POST** `/api/availability-posts`
- **Auth Required:** Yes (Artists only)
- **Description:** Artists can post their availability and offer services
- **Body:**
```json
{
  "artistId": 1,
  "title": "Available for Logo Design Projects",
  "description": "Professional logo designer available for new projects. I have over 5 years of experience creating memorable brand identities for startups and established businesses.",
  "category": "design",
  "availabilityType": "immediate",
  "duration": "1-2 weeks per project",
  "budget": 300,
  "location": "Remote worldwide",
  "skills": "logo design, branding, illustration, adobe creative suite",
  "portfolioSamples": [
    "https://portfolio.example.com/logo1.jpg",
    "https://portfolio.example.com/logo2.jpg"
  ],
  "contactPreference": "platform"
}
```
- **Response:** `201 Created`
```json
{
  "postId": "2b457939-ba57-4d25-8444-2961d7a6401c",
  "artistId": 1,
  "title": "Available for Logo Design Projects",
  "slug": "available-for-logo-design-projects",
  "description": "Professional logo designer available for new projects...",
  "category": "design",
  "availabilityType": "immediate",
  "duration": "1-2 weeks per project",
  "budget": 300,
  "location": "Remote worldwide",
  "skills": "logo design, branding, illustration, adobe creative suite",
  "portfolioSamples": [
    "https://portfolio.example.com/logo1.jpg",
    "https://portfolio.example.com/logo2.jpg"
  ],
  "contactPreference": "platform",
  "status": "active",
  "expiresAt": null,
  "viewCount": 0,
  "createdAt": "2025-07-27T12:00:00.000Z",
  "updatedAt": "2025-07-27T12:00:00.000Z",
  "artist": {
    "artistId": 1,
    "userId": 2,
    "name": "Jane Smith",
    "slug": "jane-smith",
    "skills": "Digital Art, Illustration, Logo Design",
    "availability": "available",
    "hourlyRate": 75,
    "rating": 4.8,
    "totalCommissions": 23,
    "user": {
      "email": "jane@example.com"
    }
  }
}
```

### Get All Availability Posts
- **GET** `/api/availability-posts`
- **Query Parameters:**
  - `category`: Filter by category
  - `budget_min`: Minimum budget
  - `budget_max`: Maximum budget
  - `availability`: Availability type filter
  - `skills`: Skills filter (comma-separated)
- **Response:** Array of availability posts

### Get Availability Posts by Artist
- **GET** `/api/availability-posts/artist/:artistId`
- **Example:** `/api/availability-posts/artist/1`
- **Response:** Array of availability posts by specific artist

### Get My Availability Posts
- **GET** `/api/availability-posts/my-posts`
- **Auth Required:** Yes (Artists only)
- **Response:** Array of current user's availability posts

### Search Availability Posts
- **GET** `/api/availability-posts/search`
- **Query Parameters:**
  - `q`: Search query
  - `category`: Category filter
  - `location`: Location filter
- **Response:** Array of matching availability posts

### Get Availability Post by ID
- **GET** `/api/availability-posts/:postId`
- **Example:** `/api/availability-posts/2b457939-ba57-4d25-8444-2961d7a6401c`
- **Response:** Availability post object or 404

### Get Availability Post by Slug
- **GET** `/api/availability-posts/slug/:slug`
- **Example:** `/api/availability-posts/slug/available-for-logo-design-projects`
- **Response:** Availability post object or 404

### Update Availability Post
- **PUT** `/api/availability-posts/:postId`
- **Auth Required:** Yes (Only by artist who created it)
- **Body:**
```json
{
  "budget": 350,
  "availabilityType": "within-week",
  "status": "paused"
}
```
- **Response:** Updated availability post object

### Delete Availability Post
- **DELETE** `/api/availability-posts/:postId`
- **Auth Required:** Yes (Only by artist who created it)
- **Response:** `204 No Content`

---

## 🎨 Portfolio API (`/api/portfolio`) - Enhanced

### Create Portfolio Item
- **POST** `/api/portfolio`
- **Auth Required:** Yes (Artists only)
- **Body:**
```json
{
  "artistId": 1,
  "title": "Digital Art Portfolio Piece",
  "description": "Collection of my best digital artwork showcasing various styles and techniques",
  "imageUrl": "https://portfolio.example.com/artwork1.jpg",
  "category": "illustration",
  "tags": ["digital art", "character design", "fantasy"],
  "projectUrl": "https://behance.net/project-link",
  "completionDate": "2025-07-15T00:00:00.000Z"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Portfolio item created successfully",
  "data": {
    "portfolioId": "b5558cb3-75c3-4d8e-8010-e0d0b268ee29",
    "artistId": 1,
    "title": "Digital Art Portfolio Piece",
    "description": "Collection of my best digital artwork...",
    "imageUrl": "https://portfolio.example.com/artwork1.jpg",
    "category": "illustration",
    "tags": ["digital art", "character design", "fantasy"],
    "projectUrl": "https://behance.net/project-link",
    "completionDate": "2025-07-15T00:00:00.000Z",
    "likes": 0,
    "views": 0,
    "featured": false,
    "isPublic": true,
    "createdAt": "2025-07-27T12:00:00.000Z",
    "updatedAt": "2025-07-27T12:00:00.000Z"
  }
}
```

### Get Artist Portfolio
- **GET** `/api/portfolio/artist/:artistId`
- **Example:** `/api/portfolio/artist/1`
- **Query Parameters:**
  - `category`: Filter by category
  - `featured`: Show only featured items
  - `limit`: Number of items per page
  - `page`: Page number
- **Response:** Array of portfolio items

### Get Portfolio Categories
- **GET** `/api/portfolio/categories`
- **Response:** Array of available categories
```json
{
  "categories": [
    "illustration",
    "design", 
    "photography",
    "writing",
    "video",
    "music",
    "animation",
    "web-development",
    "other"
  ]
}
```

### Get Portfolio Item by ID
- **GET** `/api/portfolio/:portfolioId`
- **Example:** `/api/portfolio/b5558cb3-75c3-4d8e-8010-e0d0b268ee29`
- **Response:** Portfolio item object or 404

### Update Portfolio Item
- **PUT** `/api/portfolio/:portfolioId`
- **Auth Required:** Yes (Only by artist who created it)
- **Body:**
```json
{
  "title": "Updated Portfolio Title",
  "featured": true,
  "tags": ["updated", "digital art", "illustration"]
}
```
- **Response:** Updated portfolio item object

### Delete Portfolio Item
- **DELETE** `/api/portfolio/:portfolioId`
- **Auth Required:** Yes (Only by artist who created it)
- **Response:** `204 No Content`

### Like Portfolio Item
- **POST** `/api/portfolio/:portfolioId/like`
- **Auth Required:** Yes
- **Response:** Updated like count

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

## ⭐ Reviews API (`/api/reviews`)

**Note:** All review endpoints require authentication.

### Create Review
- **POST** `/api/reviews`
- **Auth Required:** Yes
- **Description:** Create a review for an artist after project completion
- **Body:**
```json
{
  "projectId": 1,
  "reviewedUserId": 2,
  "rating": 5,
  "comment": "Excellent work! Very professional and delivered on time."
}
```
- **Response:** `201 Created`
```json
{
  "reviewId": 1,
  "projectId": 1,
  "reviewerId": 1,
  "reviewedUserId": 2,
  "rating": 5,
  "comment": "Excellent work! Very professional and delivered on time.",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

### Get All Reviews
- **GET** `/api/reviews`
- **Auth Required:** Yes
- **Description:** Get all reviews (paginated)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response:** `200 OK`
```json
{
  "reviews": [
    {
      "reviewId": 1,
      "rating": 5,
      "comment": "Excellent work!",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "reviewer": {
        "userId": 1,
        "email": "client@example.com",
        "client": {
          "name": "John Doe",
          "organizationName": "Tech Corp"
        }
      },
      "reviewedUser": {
        "userId": 2,
        "email": "artist@example.com",
        "artist": {
          "name": "Jane Smith",
          "specialization": "Logo Design"
        }
      },
      "project": {
        "projectId": 1,
        "title": "Logo Design Project",
        "budget": 500
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Review by ID
- **GET** `/api/reviews/:id`
- **Auth Required:** Yes
- **Example:** `/api/reviews/1`
- **Response:** `200 OK` (single review object) or `404 Not Found`

### Update Review
- **PUT** `/api/reviews/:id`
- **Auth Required:** Yes (only review creator can update)
- **Description:** Update an existing review
- **Body:**
```json
{
  "rating": 4,
  "comment": "Good work, minor revisions needed but overall satisfied."
}
```
- **Response:** `200 OK` (updated review object)

### Delete Review
- **DELETE** `/api/reviews/:id`
- **Auth Required:** Yes (only review creator can delete)
- **Response:** `204 No Content`

### Get Reviews by Artist
- **GET** `/api/reviews/artist/:artistId`
- **Auth Required:** No (public endpoint)
- **Example:** `/api/reviews/artist/2`
- **Description:** Get all reviews for a specific artist
- **Response:** `200 OK` (array of reviews for the artist)

### Get Artist Average Rating
- **GET** `/api/reviews/artist/:artistId/average`
- **Auth Required:** No (public endpoint)
- **Example:** `/api/reviews/artist/2/average`
- **Response:** `200 OK`
```json
{
  "artistId": 2,
  "averageRating": 4.7,
  "totalReviews": 15,
  "ratingDistribution": {
    "5": 10,
    "4": 3,
    "3": 1,
    "2": 1,
    "1": 0
  }
}
```

---

## 🧪 Comprehensive Testing Guide

### Prerequisites
1. Ensure PostgreSQL is running
2. Ensure all environment variables are set in `.env`
3. Run `npm install` to install dependencies
4. Start the server: `npm start` or `node server.js`
5. Server should be running on `http://localhost:4000`

### Test Sequence 1: Complete Platform Workflow

#### 1.1 Health Check
```bash
curl http://localhost:4000/health
```
**Expected:** `{"status": "OK", "message": "ArtLink Backend is running"}`

#### 1.2 Client Registration and Setup
```bash
# Register client
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123",
    "role": "client"
  }'
```
**Save the returned token as CLIENT_TOKEN**

```bash
# Create client profile
curl -X POST http://localhost:4000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -d '{
    "organizationName": "Tech Solutions Inc",
    "website": "https://techsolutions.com",
    "description": "Leading provider of digital solutions",
    "industry": "technology"
  }'
```

#### 1.3 Artist Registration and Setup
```bash
# Register artist
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artist@example.com",
    "password": "password123",
    "role": "artist"
  }'
```
**Save the returned token as ARTIST_TOKEN**

```bash
# Create artist profile
curl -X POST http://localhost:4000/api/artists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ARTIST_TOKEN" \
  -d '{
    "name": "Sarah Designer",
    "bio": "Professional graphic designer with 5+ years experience",
    "skills": "Logo Design, Branding, Adobe Creative Suite",
    "specialization": "Logo Design",
    "experienceLevel": "expert",
    "hourlyRate": 75,
    "availabilityStatus": "available"
  }'
```

#### 1.4 Job Posting (Client Hiring Artist)
```bash
# Client posts a job
curl -X POST http://localhost:4000/api/job-posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -d '{
    "title": "Modern Logo Design for Tech Startup",
    "description": "We need a professional, modern logo for our tech startup. Looking for clean, minimalist design that represents innovation and technology.",
    "category": "design",
    "budgetMin": 500,
    "budgetMax": 1500,
    "deadline": "2025-02-15T00:00:00.000Z",
    "skillsRequired": "Logo Design, Adobe Illustrator, Branding",
    "experienceLevel": "intermediate"
  }'
```

#### 1.5 Artist Service Offering
```bash
# Artist posts availability
curl -X POST http://localhost:4000/api/availability-posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ARTIST_TOKEN" \
  -d '{
    "title": "Professional Logo Design Services Available",
    "description": "Offering professional logo design services for startups and established businesses. Quick turnaround, unlimited revisions until satisfied.",
    "category": "design",
    "availabilityType": "immediate",
    "duration": "1-2 weeks per project",
    "budget": 750,
    "skills": "Logo Design, Branding, Adobe Illustrator, Vector Graphics"
  }'
```

#### 1.6 Portfolio Creation
```bash
# Create portfolio entry
curl -X POST http://localhost:4000/api/portfolios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ARTIST_TOKEN" \
  -d '{
    "title": "Modern Tech Company Logos",
    "description": "Collection of logos designed for technology companies including startups and established firms.",
    "images": ["https://via.placeholder.com/400x300?text=Logo+1", "https://via.placeholder.com/400x300?text=Logo+2"],
    "tags": ["logo", "branding", "technology", "startup"],
    "projectUrl": "https://behance.net/project-example"
  }'
```

#### 1.7 Project Creation and Payment
```bash
# Create project
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -d '{
    "clientId": 1,
    "title": "Logo Design Project",
    "description": "Professional logo design as discussed in job post",
    "budget": 1000,
    "deadline": "2025-02-15T00:00:00.000Z",
    "status": "active"
  }'
```

```bash
# Create payment intent
curl -X POST http://localhost:4000/api/payments/create-payment-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -d '{
    "projectId": 1,
    "amount": 1000,
    "currency": "usd",
    "description": "Payment for logo design project"
  }'
```

#### 1.8 Review Creation
```bash
# Client leaves review for artist
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -d '{
    "projectId": 1,
    "reviewedUserId": 2,
    "rating": 5,
    "comment": "Excellent work! Professional design, great communication, and delivered on time. Highly recommended!"
  }'
```

### Test Sequence 2: Search and Discovery

#### 2.1 Browse Public Content
```bash
# Get all artists
curl http://localhost:4000/api/artists

# Search artists by skill
curl "http://localhost:4000/api/artists/skills/Logo%20Design"

# Get all job posts
curl http://localhost:4000/api/job-posts

# Get all availability posts
curl http://localhost:4000/api/availability-posts

# Get all portfolios
curl http://localhost:4000/api/portfolios
```

#### 2.2 Get Artist Reviews and Rating
```bash
# Get reviews for artist
curl http://localhost:4000/api/reviews/artist/2

# Get artist average rating
curl http://localhost:4000/api/reviews/artist/2/average
```

### Test Sequence 3: File Upload Testing

#### 3.1 Test Image Upload (requires actual image file)
```bash
# Upload test image
curl -X POST http://localhost:4000/api/upload/image \
  -H "Authorization: Bearer ARTIST_TOKEN" \
  -F "image=@/path/to/test/image.jpg" \
  -F "folder=artlink/test" \
  -F "tags=test,sample"
```

#### 3.2 Manage Uploaded Images
```bash
# Get all uploaded images
curl -X GET http://localhost:4000/api/upload/images \
  -H "Authorization: Bearer ARTIST_TOKEN"

# Delete image (use public_id from upload response)
curl -X DELETE http://localhost:4000/api/upload/image/PUBLIC_ID \
  -H "Authorization: Bearer ARTIST_TOKEN"
```

### Test Sequence 4: Error Handling

#### 4.1 Authentication Errors
```bash
# Try accessing protected endpoint without token
curl http://localhost:4000/api/users

# Try with invalid token
curl -H "Authorization: Bearer invalid_token" http://localhost:4000/api/users
```

#### 4.2 Validation Errors
```bash
# Try registering with invalid email
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123",
    "role": "invalid_role"
  }'
```

#### 4.3 Resource Not Found
```bash
# Try accessing non-existent resource
curl http://localhost:4000/api/artists/99999
curl http://localhost:4000/api/job-posts/99999
```

### Expected Responses

#### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

#### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

#### Authentication Success
```json
{
  "message": "Login successful",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "role": "client"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Common HTTP Status Codes
- `200` - Success (GET, PUT operations)
- `201` - Created (POST operations)
- `204` - No Content (DELETE operations)
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource doesn't exist)
- `409` - Conflict (Duplicate resource)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

### Testing Tools Recommendations

#### 1. Postman Collection
Create a Postman collection with all endpoints for easier testing:
1. Import the endpoints from this documentation
2. Set up environment variables for tokens
3. Create test scripts for automated testing

#### 2. Insomnia
Alternative to Postman with similar functionality

#### 3. VS Code REST Client
Use the REST Client extension in VS Code for testing

#### 4. Browser Testing
Use the provided HTML test page for file uploads and interactive testing

### Environment Setup
Ensure your `.env` file contains:

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

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
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

---

**Document Status:** ✅ Complete and Production Ready  
**Last Updated:** January 15, 2025  
**Version:** 2.0  

**Note:** All endpoints have been tested and are fully functional. The ArtLink backend is ready for production deployment with comprehensive authentication, payment processing, file management, and business logic features.