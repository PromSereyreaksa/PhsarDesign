# JWT Token Sharing Between React and Flutter Web Apps

This implementation allows sharing JWT authentication tokens between a React web app and a Flutter web app running on the same domain via browser localStorage.

## How It Works

Both applications access the same browser localStorage on the shared domain. When a user logs in through the React app:
1. JWT token is stored in localStorage with key `jwt_token`
2. User data is stored in localStorage with key `user_data`
3. Timestamp is stored with key `token_timestamp` for expiration checking

The Flutter app can then:
1. Read the JWT token from localStorage
2. Use it for authenticated API calls
3. Access user data without requiring separate login

## React App Changes

### LoginPage.jsx
- Enhanced to store JWT token with additional keys for cross-app sharing
- Stores `jwt_token`, `user_data`, and `token_timestamp` in localStorage

### authSlice.js
- Updated to store tokens with shared keys
- Includes proper cleanup when logging out

## Flutter App Implementation

### JWT Token Service (`lib/services/jwt_token_service.dart`)
- Handles reading JWT tokens from browser localStorage
- Validates token format and expiration
- Provides authentication status checking
- Manages token cleanup

Key methods:
- `getToken()` - Get valid JWT token
- `getUserData()` - Get user information
- `isAuthenticated()` - Check auth status
- `getAuthHeaders()` - Get headers for API calls
- `clearTokenData()` - Clear all auth data

### Authenticated API Service (`lib/services/authenticated_api_service.dart`)
- Makes HTTP requests with JWT authentication
- **Now reads API base URL from .env file**
- Handles 401 responses (token expiration)
- Provides methods for GET, POST, PUT, DELETE
- Includes error handling and token cleanup
- Includes debug configuration method

### UI Widgets
- `AuthStatusWidget` - Shows current authentication status
- `UserProfileWidget` - Example of using authenticated API calls

## Usage Examples

### Check Authentication Status
```dart
bool isLoggedIn = JwtTokenService.isAuthenticated();
if (isLoggedIn) {
  // User is authenticated
  final userData = JwtTokenService.getUserData();
  print('User: ${userData?['firstName']}');
}
```

### Make Authenticated API Calls
```dart
// GET request
final response = await AuthenticatedApiService.get('/api/user/profile');
if (response != null && response.statusCode == 200) {
  final data = AuthenticatedApiService.handleResponse(response);
  // Handle response data
}

// POST request
final postData = {'key': 'value'};
final response = await AuthenticatedApiService.post('/api/update', postData);
```

### Handle Authentication Errors
```dart
try {
  final response = await AuthenticatedApiService.get('/api/protected');
  // Handle successful response
} catch (e) {
  if (e is AuthenticationException) {
    // Token is invalid or expired
    // Redirect user to login or show auth error
  }
}
```

## Error Handling

The system handles several error scenarios:

1. **Missing Token**: When no JWT token exists in localStorage
2. **Invalid Token Format**: When token doesn't match JWT structure
3. **Expired Token**: Based on timestamp (24-hour expiration)
4. **API 401 Responses**: Automatic token cleanup and exception throwing
5. **Network Errors**: Graceful handling with null returns

## Security Considerations

1. **Token Expiration**: Tokens expire after 24 hours and are automatically cleared
2. **Format Validation**: Basic JWT format checking (3 parts separated by dots)
3. **Automatic Cleanup**: Invalid tokens are removed from localStorage
4. **HTTPS Required**: Always use HTTPS in production for token security

## Development Setup

### Flutter App
1. **Environment Configuration**: Update `.env` file with your API URL:
   ```
   # .env
   API_BASE_URL=http://localhost:3000
   # or use your dev tunnel URL:
   # API_BASE_URL=https://your-tunnel-url.com
   ```

2. Add to `pubspec.yaml`:
   ```yaml
   dependencies:
     http: ^1.2.2
     flutter_dotenv: ^5.1.0  # Already included
   ```

3. Import and use the services:
   ```dart
   import 'services/jwt_token_service.dart';
   import 'services/authenticated_api_service.dart';
   ```

4. Add widgets to your app to test authentication

5. **Debug API Configuration**:
   ```dart
   // Check current API configuration
   AuthenticatedApiService.debugConfiguration();
   ```

### React App
1. Ensure localStorage token storage is working in login flow
2. Test cross-app token sharing on localhost

## Production Deployment

1. **Same Domain**: Both apps must be served from the same domain
2. **Environment Configuration**: Update `.env` files for both apps:
   ```
   # React app (.env)
   VITE_API_URL=https://your-api-domain.com
   
   # Flutter app (.env) 
   API_BASE_URL=https://your-api-domain.com
   ```
3. **HTTPS**: Use HTTPS for all token operations
4. **Token Rotation**: Implement token refresh if needed

## Environment Configuration

The Flutter app reads the API base URL from the `.env` file:

```
# Flutter Frontend/.env
API_BASE_URL=http://localhost:3000

# For dev tunnel or production:
# API_BASE_URL=https://your-domain.com

DEBUG_MODE=true
```

The `AuthenticatedApiService` automatically:
- Reads `API_BASE_URL` from `.env`
- Adds `/api` suffix if not present
- Falls back to `http://localhost:3000/api` if not configured
- Provides debug methods to verify configuration

## Testing

1. **Login through React app** - Verify token storage
2. **Check Flutter app** - Verify token reading and API calls
3. **Test expiration** - Verify cleanup after 24 hours
4. **Test logout** - Verify token cleanup

## Debugging

Enable debug logging by checking browser console and Flutter debug output:
- JWT token operations are logged with 'JwtTokenService' tag
- API calls are logged with 'AuthenticatedApiService' tag
- Widget operations are logged with widget-specific tags
