// Utility function to redirect to Flutter app after successful login/register
export const redirectToFlutter = (userData = {}) => {
  const flutterUrl = import.meta.env.VITE_FLUTTER_APP_URL;
  
  if (!flutterUrl) {
    console.error('Flutter app URL not configured in environment variables');
    return;
  }

  // Create query parameters from user data
  const params = new URLSearchParams();
  
  if (userData.firstName) params.append('firstName', userData.firstName);
  if (userData.lastName) params.append('lastName', userData.lastName);
  if (userData.email) params.append('email', userData.email);
  if (userData.id) params.append('userId', userData.id.toString());
  if (userData.username) params.append('username', userData.username);
  
  // Add success indicator
  params.append('loginSuccess', 'true');
  params.append('timestamp', Date.now().toString());

  // Construct final URL
  const redirectUrl = `${flutterUrl}${params.toString() ? `?${params.toString()}` : ''}`;
  
  console.log('Redirecting to Flutter app:', redirectUrl);
  
  // Redirect to Flutter app
  window.location.href = redirectUrl;
};

// Alternative method using window.open if you want to open in new tab
export const openFlutterInNewTab = (userData = {}) => {
  const flutterUrl = import.meta.env.VITE_FLUTTER_APP_URL;
  
  if (!flutterUrl) {
    console.error('Flutter app URL not configured in environment variables');
    return;
  }

  const params = new URLSearchParams();
  
  if (userData.firstName) params.append('firstName', userData.firstName);
  if (userData.lastName) params.append('lastName', userData.lastName);
  if (userData.email) params.append('email', userData.email);
  if (userData.id) params.append('userId', userData.id.toString());
  if (userData.username) params.append('username', userData.username);
  
  params.append('loginSuccess', 'true');
  params.append('timestamp', Date.now().toString());

  const redirectUrl = `${flutterUrl}${params.toString() ? `?${params.toString()}` : ''}`;
  
  window.open(redirectUrl, '_blank');
};
