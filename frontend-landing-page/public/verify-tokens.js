// Quick verification script to test JWT token sharing
// Run this in browser console on React app after login

console.log('=== JWT TOKEN VERIFICATION ===');

// Check if tokens are stored in localStorage
const jwtToken = localStorage.getItem('jwt_token');
const userData = localStorage.getItem('user_data');
const timestamp = localStorage.getItem('token_timestamp');

console.log('JWT Token (first 50 chars):', jwtToken ? jwtToken.substring(0, 50) + '...' : 'NOT FOUND');
console.log('User Data:', userData ? JSON.parse(userData) : 'NOT FOUND');
console.log('Timestamp:', timestamp ? new Date(parseInt(timestamp)) : 'NOT FOUND');

// Check token age
if (timestamp) {
  const age = Date.now() - parseInt(timestamp);
  const ageMinutes = Math.floor(age / (1000 * 60));
  console.log('Token Age:', ageMinutes, 'minutes');
}

// Verify Flutter app URL
const flutterUrl = import.meta.env.VITE_FLUTTER_APP_URL;
console.log('Flutter App URL:', flutterUrl);

// Test redirect URL construction
if (userData) {
  const user = JSON.parse(userData);
  const params = new URLSearchParams();
  if (user.firstName) params.append('firstName', user.firstName);
  if (user.lastName) params.append('lastName', user.lastName);
  if (user.email) params.append('email', user.email);
  if (user.id) params.append('userId', user.id.toString());
  params.append('loginSuccess', 'true');
  params.append('timestamp', Date.now().toString());
  
  const testUrl = `${flutterUrl}?${params.toString()}`;
  console.log('Test Flutter Redirect URL:', testUrl);
}

console.log('=== END VERIFICATION ===');
