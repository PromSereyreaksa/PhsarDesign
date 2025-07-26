# Review System API Documentation

## Overview

The Review System allows users to rate and review freelancers on a scale of 1-5 stars. The system automatically calculates and maintains average ratings for freelancers based on all their reviews.

## Features

- ✅ **Rating**: Users can rate freelancers (1-5 stars, required)
- ✅ **Comments**: Users can leave optional text reviews
- ✅ **Rating Only**: Users can rate without leaving comments
- ✅ **Auto-calculation**: Freelancer average ratings are automatically updated
- ✅ **CRUD Operations**: Full create, read, update, delete functionality

## Database Schema

### Reviews Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reviewId` | INTEGER | ✓ | Primary key, auto-increment |
| `freelancerId` | INTEGER | ✓ | Foreign key to freelancers table |
| `userId` | INTEGER | ✓ | Foreign key to users table |
| `rating` | INTEGER | ✓ | Rating value (1-5) |
| `reviewText` | TEXT | ✗ | Optional review comment |
| `createdAt` | TIMESTAMP | ✓ | Auto-generated creation time |
| `updatedAt` | TIMESTAMP | ✓ | Auto-generated update time |

### Constraints

- Rating must be between 1 and 5
- Each user can review each freelancer only once (unique constraint)
- Cascade delete when freelancer or user is deleted

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
  "reviewText": "Excellent work! Highly recommended." // Optional
}
```

#### Response
- **201 Created**: Review created successfully
```json
{
  "reviewId": 789,
  "freelancerId": 123,
  "userId": 456,
  "rating": 5,
  "reviewText": "Excellent work! Highly recommended.",
  "createdAt": "2025-07-26T10:30:00.000Z",
  "updatedAt": "2025-07-26T10:30:00.000Z"
}
```

- **400 Bad Request**: Validation error or duplicate review

#### Example: Rating without comment
```json
{
  "freelancerId": 123,
  "userId": 456,
  "rating": 4
}
```

### 2. Get All Reviews

**GET** `/`

Retrieves all reviews or filters by freelancer.

#### Query Parameters
- `freelancerId` (optional): Filter reviews for specific freelancer

#### Examples
```bash
# Get all reviews
GET /api/reviews

# Get reviews for specific freelancer
GET /api/reviews?freelancerId=123
```

#### Response
- **200 OK**: Array of reviews
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

### 3. Get Review by ID

**GET** `/:id`

Retrieves a specific review by its ID.

#### Response
- **200 OK**: Review details
- **404 Not Found**: Review doesn't exist

### 4. Update Review

**PUT** `/:id`

Updates an existing review and recalculates freelancer's average rating.

#### Request Body
```json
{
  "rating": 4,
  "reviewText": "Updated review text"
}
```

#### Response
- **200 OK**: Updated review
- **404 Not Found**: Review doesn't exist
- **400 Bad Request**: Invalid data

### 5. Delete Review

**DELETE** `/:id`

Deletes a review and recalculates freelancer's average rating.

#### Response
- **204 No Content**: Review deleted successfully
- **404 Not Found**: Review doesn't exist

## Usage Examples

### JavaScript/Node.js

```javascript
// Create a review with comment
const newReview = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    freelancerId: 123,
    userId: 456,
    rating: 5,
    reviewText: "Outstanding freelancer!"
  })
});

// Create rating-only review
const ratingOnly = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    freelancerId: 123,
    userId: 456,
    rating: 4
  })
});

// Get freelancer reviews
const freelancerReviews = await fetch('/api/reviews?freelancerId=123');
const reviews = await freelancerReviews.json();
```

### cURL Examples

```bash
# Create review with comment
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerId": 123,
    "userId": 456,
    "rating": 5,
    "reviewText": "Great work!"
  }'

# Create rating-only review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerId": 123,
    "userId": 456,
    "rating": 4
  }'

# Get all reviews for freelancer
curl "http://localhost:3000/api/reviews?freelancerId=123"

# Update review
curl -X PUT http://localhost:3000/api/reviews/789 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 3,
    "reviewText": "Updated review"
  }'

# Delete review
curl -X DELETE http://localhost:3000/api/reviews/789
```

## Business Logic

### Automatic Rating Calculation

When a review is created, updated, or deleted, the system automatically:

1. Fetches all reviews for the freelancer
2. Calculates the average rating
3. Updates the freelancer's rating field
4. If no reviews remain after deletion, sets rating to `null`

### Rating Scale

- **5 Stars**: Excellent
- **4 Stars**: Good  
- **3 Stars**: Average
- **2 Stars**: Below Average
- **1 Star**: Poor

## Error Handling

### Common Error Responses

```json
// Validation Error
{
  "error": "Rating must be between 1 and 5"
}

// Duplicate Review
{
  "error": "User has already reviewed this freelancer"
}

// Not Found
{
  "error": "Review not found"
}

// Server Error
{
  "error": "Internal server error"
}
```

## Best Practices

### For Frontend Developers

1. **Always validate rating range** (1-5) before sending
2. **Handle duplicate review errors** gracefully
3. **Show loading states** during API calls
4. **Display average ratings** with star components
5. **Allow editing only user's own reviews**

### For Backend Integration

1. **Use transactions** for data consistency
2. **Implement proper authentication** before allowing reviews
3. **Add rate limiting** to prevent spam reviews
4. **Consider soft deletes** for audit trails
5. **Cache freelancer ratings** for better performance

## Security Considerations

- Authenticate users before allowing review operations
- Validate that users can only edit/delete their own reviews
- Implement rate limiting to prevent review spam
- Sanitize review text to prevent XSS attacks
- Validate freelancer and user IDs exist before creating reviews

## Performance Tips

- Index the `freelancerId` field for faster queries
- Consider caching average ratings
- Paginate review lists for freelancers with many reviews
- Use database triggers for rating calculations in high-traffic scenarios

## Migration Guide

If upgrading from an older version:

1. Add unique constraint for `userId` + `freelancerId`
2. Recalculate all freelancer ratings:
```sql
UPDATE freelancers 
SET rating = (
  SELECT AVG(rating) 
  FROM reviews 
  WHERE reviews.freelancerId = freelancers.freelancerId
);
```

## Support

For questions or issues with the Review System API:

1. Check error messages in API responses
2. Verify data format matches documentation
3. Ensure proper authentication/authorization
4. Review server logs for debugging information