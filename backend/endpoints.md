# ArtLink Backend API Endpoints

**Base URL:** `http://localhost:5000`


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

### Create User
- **POST** `/api/users`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "client"
}
```
- **Response:** `201 Created`

### Get All Users
- **GET** `/api/users`
- **Response:** Array of users

### Get User by ID
- **GET** `/api/users/:id`
- **Example:** `/api/users/1`
- **Response:** User object or 404

### Update User
- **PUT** `/api/users/:id`
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
- **Response:** `204 No Content`

### Get User by Email
- **GET** `/api/users/email/:email`
- **Example:** `/api/users/email/user@example.com`
- **Response:** User object or 404

### Get Users by Role
- **GET** `/api/users/role/:role`
- **Example:** `/api/users/role/client`
- **Response:** Array of users with specified role

---

## 🏢 Clients API (`/api/clients`)

### Create Client
- **POST** `/api/clients`
- **Body:**
```json
{
  "userId": 1,
  "companyName": "Tech Corp",
  "industry": "Technology",
  "location": "New York",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```
- **Response:** `201 Created`

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
  "companyName": "Updated Corp",
  "industry": "Software"
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

## 🧪 Testing Sequence

### 1. Basic Server Test
```
GET /health
```

### 2. Create Test User
```
POST /api/users
{
  "email": "test@example.com",
  "password": "password123",
  "role": "client"
}
```

### 3. Create Test Client
```
POST /api/clients
{
  "userId": 1,
  "companyName": "Test Company",
  "industry": "Technology"
}
```

### 4. Create Test Freelancer User
```
POST /api/users
{
  "email": "freelancer@example.com",
  "password": "password123",
  "role": "freelancer"
}
```

### 5. Create Test Freelancer
```
POST /api/freelancers
{
  "userId": 2,
  "name": "Jane Developer",
  "skills": "React, Node.js"
}
```

### 6. Create Test Project
```
POST /api/projects
{
  "clientId": 1,
  "title": "Test Project",
  "description": "Sample project",
  "budget": 1000
}
```

### 7. Create Test Portfolio
```
POST /api/portfolio
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

## 🚨 Common Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (Delete success)
- `400` - Bad Request (Validation error)
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Error Response Format

```json
{
  "error": "Error message description"
}
```

---

**Note:** Make sure the server is running with `node server.js` before testing these endpoints.