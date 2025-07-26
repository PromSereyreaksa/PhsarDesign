# Review System API Documentation

## Overview

The Review System allows users to rate and comment on freelancers. The system automatically calculates and updates freelancer average ratings based on all reviews received.

## Features

- ⭐ Rate freelancers (1-5 star scale)
- 💬 Leave optional text reviews
- 📊 Automatic average rating calculation
- 🔄 Full CRUD operations on reviews
- 🔒 Data integrity with cascading deletes

## Database Schema

### Reviews Table Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reviewId` | INTEGER | Yes | Primary key, auto-increment |
| `freelancerId` | INTEGER | Yes | Foreign key to freelancers table |
| `userId` | INTEGER | Yes | Foreign key to users table |
| `rating` | INTEGER | Yes | Rating value (1-5) |
| `reviewText` | TEXT | No | Optional review comment |
| `createdAt` | DATETIME | Yes | Auto-generated timestamp |
| `updatedAt` | DATETIME | Yes | Auto-generated timestamp |

### Relationships

- **Reviews** belongs to **Freelancers** (many-to-one)
- **Reviews** belongs to **Users** (many-to-one)
- Cascading deletes: When a freelancer or user is deleted, their reviews are automatically removed

## API Endpoints

### Base URL
```
/api/reviews
```

### 1. Create Review

**POST** `/`

Creates a new review and automatically updates the freelancer's average rating.

#### Request Body
```json
{
  "freelancerId": 123,
  "userId": 456,
  "rating": 5,
  "reviewText": "Excellent work! Very professional and delivered on time."
}
```

#### Response
```json
{
  "reviewId": 789,
  "freelancerId": 123,
  "userId": 456,
  "rating": 5,
  "reviewText": "Excellent work! Very professional and delivered on time.",
  "createdAt": "2025-07-26T10:30:00.000Z",
  "updatedAt": "2025-07-26T10:30:00.000Z"
}
```

#### Status Codes
- `201` - Review created successfully
- `400` - Invalid request data or validation error

### 2. Get All Reviews

**GET** `/`

Retrieves all reviews or filters by freelancer.

#### Query Parameters
- `freelancerId` (optional) - Filter reviews for a specific freelancer

#### Examples
```bash
# Get all reviews
GET /api/reviews

# Get reviews for specific freelancer
GET /api/reviews?freelancerId=123
```

#### Response
```json
[
  {
    "reviewId": 789,
    "freelancerId": 123,
    "userId": 456,
    "rating": 5,
    "reviewText": "Excellent work!",
    "createdAt": "2025-07-26T10:30:00.000Z",
    "updatedAt": "2025-07-26T10:30:00.000Z"
  }
]
```

#### Status Codes
- `200` - Success
- `500` - Internal server error

### 3. Get Review by ID

**GET** `/:id`

Retrieves a specific review by its ID.

#### Parameters
- `id` - Review ID (integer)

#### Response
```json
{
  "reviewId": 789,
  "freelancerId": 123,
  "userId": 456,
  "rating": 5,
  "reviewText": "Excellent work!",
  "createdAt": "2025-07-26T10:30:00.000Z",
  "updatedAt": "2025-07-26T10:30:00.000Z"
}
```

#### Status Codes
- `200` - Review found
- `404` - Review not found
- `500` - Internal server error

### 4. Update Review

**PUT** `/:id`

Updates an existing review and recalculates the freelancer's average rating.

#### Parameters
- `id` - Review ID (integer)

#### Request Body
```json
{
  "rating": 4,
  "reviewText": "Good work, but could be faster."
}
```

#### Response
```json
{
  "reviewId": 789,
  "freelancerId": 123,
  "userId": 456,
  "rating": 4,
  "reviewText": "Good work, but could be faster.",
  "createdAt": "2025-07-26T10:30:00.000Z",
  "updatedAt": "2025-07-26T11:15:00.000Z"
}
```

#### Status Codes
- `200` - Review updated successfully
- `400` - Invalid request data or review ID
- `404` - Review not found

### 5. Delete Review

**DELETE** `/:id`

Deletes a review and recalculates the freelancer's average rating.

#### Parameters
- `id` - Review ID (integer)

#### Response
No response body (204 status)

#### Status Codes
- `204` - Review deleted successfully
- `400` - Invalid review ID
- `404` - Review not found
- `500` - Internal server error

## Business Logic

### Rating Calculation

When a review is created, updated, or deleted, the system automatically:

1. Fetches all reviews for the affected freelancer
2. Calculates the average rating
3. Updates the freelancer's rating field

**Formula**: `Average Rating = Sum of all ratings / Number of reviews`

### Special Cases

- **No reviews remaining**: When the last review is deleted, the freelancer's rating is set to `null`
- **Rating validation**: Ratings must be between 1 and 5 (inclusive)
- **Optional comments**: Reviews can have ratings without text comments

## Usage Examples

### JavaScript/Node.js

```javascript
// Create a review
const response = await fetch('/api/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    freelancerId: 123,
    userId: 456,
    rating: 5,
    reviewText: 'Outstanding work!'
  })
});

// Get reviews for a freelancer
const reviews = await fetch('/api/reviews?freelancerId=123')
  .then(res => res.json());

// Update a review
await fetch('/api/reviews/789', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    rating: 4,
    reviewText: 'Updated review text'
  })
});

// Delete a review
await fetch('/api/reviews/789', {
  method: 'DELETE'
});
```

### cURL Examples

```bash
# Create review
curl -X POST /api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerId": 123,
    "userId": 456,
    "rating": 5,
    "reviewText": "Great work!"
  }'

# Get all reviews for freelancer
curl "/api/reviews?freelancerId=123"

# Update review
curl -X PUT /api/reviews/789 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "reviewText": "Updated review"
  }'

# Delete review
curl -X DELETE /api/reviews/789
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error: rating must be between 1 and 5"
}
```

#### 404 Not Found
```json
{
  "error": "Review not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Data Validation

### Review Creation/Update Rules

- **rating**: Required integer between 1-5
- **freelancerId**: Required integer, must exist in freelancers table
- **userId**: Required integer, must exist in users table
- **reviewText**: Optional text field

### Best Practices

1. **Validate input**: Always validate rating values on the client side
2. **Handle errors**: Implement proper error handling for all API calls
3. **Check existence**: Verify freelancer and user exist before creating reviews
4. **Rate limiting**: Consider implementing rate limiting to prevent spam reviews
5. **Authentication**: Ensure users can only review freelancers they've worked with

## Performance Considerations

- **Indexing**: Consider adding database indexes on frequently queried fields (`freelancerId`, `userId`)
- **Caching**: Cache freelancer average ratings for high-traffic applications
- **Batch operations**: For bulk updates, consider implementing batch endpoints
- **Pagination**: Add pagination for large review lists

## Security Notes

- Implement authentication middleware to verify user identity
- Add authorization checks to ensure users can only modify their own reviews
- Sanitize review text to prevent XSS attacks
- Consider implementing review moderation for inappropriate content

## Migration Notes

If upgrading from the original implementation, ensure you:

1. Run the rating recalculation for all existing freelancers
2. Add the unique constraint if you want to prevent duplicate reviews
3. Update any existing API clients to handle the new error responses

---

*Last updated: July 26, 2025*