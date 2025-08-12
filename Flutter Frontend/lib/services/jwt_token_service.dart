import 'dart:html' as html;
import 'dart:convert';
import 'dart:developer' as developer;

/// Service to handle JWT token management shared with React app via localStorage
class JwtTokenService {
  static const String _tokenKey = 'jwt_token';
  static const String _userDataKey = 'user_data';
  static const String _timestampKey = 'token_timestamp';
  
  // Token expiration time in milliseconds (24 hours)
  static const int _tokenExpirationTime = 24 * 60 * 60 * 1000;

  /// Get JWT token from browser localStorage
  /// Returns null if token doesn't exist, is invalid, or expired
  static String? getToken() {
    try {
      final token = html.window.localStorage[_tokenKey];
      if (token == null || token.isEmpty) {
        developer.log('No JWT token found in localStorage', name: 'JwtTokenService');
        return null;
      }

      // Validate token format (JWT should have 3 parts separated by dots)
      final parts = token.split('.');
      if (parts.length != 3) {
        developer.log('Invalid JWT token format', name: 'JwtTokenService');
        _clearTokenData();
        return null;
      }

      // Check if token is expired based on timestamp
      if (_isTokenExpired()) {
        developer.log('JWT token has expired', name: 'JwtTokenService');
        _clearTokenData();
        return null;
      }

      developer.log('JWT token retrieved successfully', name: 'JwtTokenService');
      return token;
    } catch (e) {
      developer.log('Error retrieving JWT token: $e', name: 'JwtTokenService');
      _clearTokenData();
      return null;
    }
  }

  /// Get user data from browser localStorage
  /// Returns null if user data doesn't exist or is invalid
  static Map<String, dynamic>? getUserData() {
    try {
      final userDataStr = html.window.localStorage[_userDataKey];
      if (userDataStr == null || userDataStr.isEmpty) {
        developer.log('No user data found in localStorage', name: 'JwtTokenService');
        return null;
      }

      final userData = json.decode(userDataStr) as Map<String, dynamic>;
      developer.log('User data retrieved successfully', name: 'JwtTokenService');
      return userData;
    } catch (e) {
      developer.log('Error parsing user data: $e', name: 'JwtTokenService');
      return null;
    }
  }

  /// Check if user is authenticated (has valid token)
  static bool isAuthenticated() {
    final token = getToken();
    return token != null && token.isNotEmpty;
  }

  /// Get authorization header for API requests
  /// Returns null if no valid token exists
  static Map<String, String>? getAuthHeaders() {
    final token = getToken();
    if (token == null) {
      developer.log('No valid token for auth headers', name: 'JwtTokenService');
      return null;
    }

    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }

  /// Store token and user data (typically called from React app)
  /// This method is for completeness but usually React handles storage
  static void storeTokenData(String token, Map<String, dynamic> userData) {
    try {
      html.window.localStorage[_tokenKey] = token;
      html.window.localStorage[_userDataKey] = json.encode(userData);
      html.window.localStorage[_timestampKey] = DateTime.now().millisecondsSinceEpoch.toString();
      developer.log('Token data stored successfully', name: 'JwtTokenService');
    } catch (e) {
      developer.log('Error storing token data: $e', name: 'JwtTokenService');
    }
  }

  /// Clear all token-related data
  static void clearTokenData() {
    _clearTokenData();
    developer.log('Token data cleared', name: 'JwtTokenService');
  }

  /// Private method to clear token data
  static void _clearTokenData() {
    try {
      html.window.localStorage.remove(_tokenKey);
      html.window.localStorage.remove(_userDataKey);
      html.window.localStorage.remove(_timestampKey);
    } catch (e) {
      developer.log('Error clearing token data: $e', name: 'JwtTokenService');
    }
  }

  /// Check if token is expired based on timestamp
  static bool _isTokenExpired() {
    try {
      final timestampStr = html.window.localStorage[_timestampKey];
      if (timestampStr == null) {
        return true; // Consider expired if no timestamp
      }

      final timestamp = int.parse(timestampStr);
      final currentTime = DateTime.now().millisecondsSinceEpoch;
      final timeDifference = currentTime - timestamp;

      return timeDifference > _tokenExpirationTime;
    } catch (e) {
      developer.log('Error checking token expiration: $e', name: 'JwtTokenService');
      return true; // Consider expired if error occurs
    }
  }

  /// Decode JWT payload (for debugging/info purposes)
  /// Note: This doesn't verify signature, just decodes the payload
  static Map<String, dynamic>? decodeTokenPayload(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return null;

      // Decode the payload (second part)
      String payload = parts[1];
      
      // Add padding if necessary
      while (payload.length % 4 != 0) {
        payload += '=';
      }

      final decodedBytes = base64Url.decode(payload);
      final decodedStr = utf8.decode(decodedBytes);
      return json.decode(decodedStr) as Map<String, dynamic>;
    } catch (e) {
      developer.log('Error decoding token payload: $e', name: 'JwtTokenService');
      return null;
    }
  }
}
