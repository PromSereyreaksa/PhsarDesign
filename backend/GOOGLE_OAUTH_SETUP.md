# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the ArtLink backend.

## Prerequisites

- Google account
- Access to Google Cloud Console
- ArtLink backend server running

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: `ArtLink OAuth`
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on "Google+ API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" for user type
   - Fill in the required fields:
     - App name: `ArtLink`
     - User support email: Your email
     - Developer contact information: Your email
   - Click "Save and Continue"
   - Add scopes (optional for testing)
   - Add test users (add your email for testing)
   - Click "Save and Continue"

4. Back to creating OAuth client ID:
   - Application type: "Web application"
   - Name: `ArtLink Backend`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
   - Click "Create"

## Step 4: Get Your Credentials

1. After creating, you'll see a popup with your credentials
2. Copy the "Client ID" and "Client Secret"
3. If you missed the popup, click on the credential name in the list

## Step 5: Update Environment Variables

1. Open your `.env` file in the backend directory
2. Add the Google OAuth credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Step 6: Restart Your Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

## Step 7: Test Google OAuth

### Frontend Integration
Add a "Login with Google" button to your frontend:

```html
<a href="http://localhost:3000/api/auth/google" class="google-login-btn">
  Login with Google
</a>
```

### Testing Flow
1. Click the "Login with Google" link
2. You'll be redirected to Google's OAuth consent screen
3. Grant permissions
4. You'll be redirected back with a JWT token

## API Endpoints

Once configured, these endpoints will be available:

- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback (don't call directly)

## Troubleshooting

### Common Issues

1. **"OAuth2Strategy requires a clientID option"**
   - Solution: Make sure GOOGLE_CLIENT_ID is set in your .env file

2. **"redirect_uri_mismatch"**
   - Solution: Ensure the redirect URI in Google Console matches exactly:
     `http://localhost:3000/api/auth/google/callback`

3. **"Access blocked: This app's request is invalid"**
   - Solution: Your OAuth consent screen might not be configured properly
   - Go back to "OAuth consent screen" and complete the setup

4. **"Error 400: invalid_request"**
   - Solution: Check that both Client ID and Client Secret are correct

### Environment Variables Check

To verify your setup, check the server logs when starting:

```bash
npm start
```

You should see:
- ✅ "Server is running on port 3000" (no Google OAuth errors)

If Google OAuth is disabled, you'll see:
- ⚠️ "Google OAuth disabled. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET..."

## Security Notes

1. **Production Setup**: For production, update the authorized domains and redirect URIs to your production domain
2. **Client Secret**: Keep your client secret secure and never expose it in frontend code
3. **HTTPS**: In production, use HTTPS for all OAuth flows
4. **Scope Limitation**: Only request the minimum scopes needed (profile, email)

## Frontend Integration Example

Here's a complete example of how to integrate Google OAuth in your frontend:

```javascript
// Login with Google
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:3000/api/auth/google';
};

// Handle the callback (if using client-side routing)
const handleGoogleCallback = (token) => {
  // Store the JWT token
  localStorage.setItem('authToken', token);
  // Redirect to dashboard or home page
  window.location.href = '/dashboard';
};
```

## Database Integration

When a user logs in with Google, the system will:

1. Check if a user with that email exists
2. If not, create a new user with:
   - Email from Google profile
   - Name from Google profile
   - Password: 'social-login' (placeholder)
   - Role: 'client' (default)
3. Generate and return a JWT token

The user can then update their profile and role as needed through the regular API endpoints.

## Next Steps

After setting up Google OAuth:

1. Test the complete authentication flow
2. Update your frontend to handle OAuth responses
3. Consider adding additional OAuth providers (Facebook, GitHub, etc.)
4. Implement proper session management
5. Add logout functionality that clears both local and server sessions

---

**Need Help?** 
- Check the server logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure your Google Cloud project has the necessary APIs enabled
