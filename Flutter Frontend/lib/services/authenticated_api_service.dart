import 'dart:convert';
import 'dart:developer' as developer;
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'jwt_token_service.dart';

/// API service for making authenticated requests using JWT token from localStorage
class AuthenticatedApiService {
  // Get base URL from environment variables
  static String get baseUrl {
    final apiUrl = dotenv.env['API_BASE_URL'];
    if (apiUrl == null || apiUrl.isEmpty) {
      developer.log('API_BASE_URL not found in .env file, using default', name: 'AuthenticatedApiService');
      return 'http://localhost:3000/api'; // Fallback default
    }
    
    // Ensure the URL ends with /api if it doesn't already
    if (apiUrl.endsWith('/api')) {
      return apiUrl;
    } else if (apiUrl.endsWith('/')) {
      return '${apiUrl}api';
    } else {
      return '$apiUrl/api';
    }
  }
  
  /// Make authenticated GET request
  static Future<http.Response?> get(String endpoint) async {
    try {
      final headers = JwtTokenService.getAuthHeaders();
      if (headers == null) {
        developer.log('No auth token available for GET $endpoint', name: 'AuthenticatedApiService');
        throw AuthenticationException('No valid authentication token');
      }

      final url = Uri.parse('$baseUrl$endpoint');
      developer.log('Making authenticated GET request to: $url', name: 'AuthenticatedApiService');
      
      final response = await http.get(url, headers: headers);
      
      if (response.statusCode == 401) {
        // Token might be invalid or expired
        JwtTokenService.clearTokenData();
        throw AuthenticationException('Authentication token is invalid or expired');
      }
      
      developer.log('GET $endpoint completed with status: ${response.statusCode}', name: 'AuthenticatedApiService');
      return response;
    } catch (e) {
      developer.log('Error in GET $endpoint: $e', name: 'AuthenticatedApiService');
      if (e is AuthenticationException) rethrow;
      return null;
    }
  }

  /// Make authenticated POST request
  static Future<http.Response?> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final headers = JwtTokenService.getAuthHeaders();
      if (headers == null) {
        developer.log('No auth token available for POST $endpoint', name: 'AuthenticatedApiService');
        throw AuthenticationException('No valid authentication token');
      }

      final url = Uri.parse('$baseUrl$endpoint');
      final body = json.encode(data);
      
      developer.log('Making authenticated POST request to: $url', name: 'AuthenticatedApiService');
      
      final response = await http.post(url, headers: headers, body: body);
      
      if (response.statusCode == 401) {
        // Token might be invalid or expired
        JwtTokenService.clearTokenData();
        throw AuthenticationException('Authentication token is invalid or expired');
      }
      
      developer.log('POST $endpoint completed with status: ${response.statusCode}', name: 'AuthenticatedApiService');
      return response;
    } catch (e) {
      developer.log('Error in POST $endpoint: $e', name: 'AuthenticatedApiService');
      if (e is AuthenticationException) rethrow;
      return null;
    }
  }

  /// Make authenticated PUT request
  static Future<http.Response?> put(String endpoint, Map<String, dynamic> data) async {
    try {
      final headers = JwtTokenService.getAuthHeaders();
      if (headers == null) {
        developer.log('No auth token available for PUT $endpoint', name: 'AuthenticatedApiService');
        throw AuthenticationException('No valid authentication token');
      }

      final url = Uri.parse('$baseUrl$endpoint');
      final body = json.encode(data);
      
      developer.log('Making authenticated PUT request to: $url', name: 'AuthenticatedApiService');
      
      final response = await http.put(url, headers: headers, body: body);
      
      if (response.statusCode == 401) {
        // Token might be invalid or expired
        JwtTokenService.clearTokenData();
        throw AuthenticationException('Authentication token is invalid or expired');
      }
      
      developer.log('PUT $endpoint completed with status: ${response.statusCode}', name: 'AuthenticatedApiService');
      return response;
    } catch (e) {
      developer.log('Error in PUT $endpoint: $e', name: 'AuthenticatedApiService');
      if (e is AuthenticationException) rethrow;
      return null;
    }
  }

  /// Make authenticated DELETE request
  static Future<http.Response?> delete(String endpoint) async {
    try {
      final headers = JwtTokenService.getAuthHeaders();
      if (headers == null) {
        developer.log('No auth token available for DELETE $endpoint', name: 'AuthenticatedApiService');
        throw AuthenticationException('No valid authentication token');
      }

      final url = Uri.parse('$baseUrl$endpoint');
      
      developer.log('Making authenticated DELETE request to: $url', name: 'AuthenticatedApiService');
      
      final response = await http.delete(url, headers: headers);
      
      if (response.statusCode == 401) {
        // Token might be invalid or expired
        JwtTokenService.clearTokenData();
        throw AuthenticationException('Authentication token is invalid or expired');
      }
      
      developer.log('DELETE $endpoint completed with status: ${response.statusCode}', name: 'AuthenticatedApiService');
      return response;
    } catch (e) {
      developer.log('Error in DELETE $endpoint: $e', name: 'AuthenticatedApiService');
      if (e is AuthenticationException) rethrow;
      return null;
    }
  }

  /// Get user profile using authenticated request
  static Future<Map<String, dynamic>?> getUserProfile() async {
    try {
      final response = await get('/user/profile');
      if (response?.statusCode == 200) {
        final data = json.decode(response!.body) as Map<String, dynamic>;
        return data;
      }
      return null;
    } catch (e) {
      developer.log('Error getting user profile: $e', name: 'AuthenticatedApiService');
      return null;
    }
  }

  /// Update user profile using authenticated request
  static Future<bool> updateUserProfile(Map<String, dynamic> profileData) async {
    try {
      final response = await put('/user/profile', profileData);
      return response?.statusCode == 200;
    } catch (e) {
      developer.log('Error updating user profile: $e', name: 'AuthenticatedApiService');
      return false;
    }
  }

  /// Generic method to handle API responses with error checking
  static Map<String, dynamic>? handleResponse(http.Response? response) {
    if (response == null) return null;
    
    try {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        developer.log('API error: ${response.statusCode} - ${response.body}', name: 'AuthenticatedApiService');
        return null;
      }
    } catch (e) {
      developer.log('Error parsing API response: $e', name: 'AuthenticatedApiService');
      return null;
    }
  }

  /// Debug method to check configuration
  static void debugConfiguration() {
    developer.log('=== AuthenticatedApiService Configuration ===', name: 'AuthenticatedApiService');
    developer.log('Base URL: $baseUrl', name: 'AuthenticatedApiService');
    developer.log('Raw API_BASE_URL from .env: ${dotenv.env['API_BASE_URL']}', name: 'AuthenticatedApiService');
    developer.log('Has valid token: ${JwtTokenService.isAuthenticated()}', name: 'AuthenticatedApiService');
    final headers = JwtTokenService.getAuthHeaders();
    developer.log('Auth headers available: ${headers != null}', name: 'AuthenticatedApiService');
    if (headers != null) {
      developer.log('Authorization header: Bearer ${headers['Authorization']?.substring(0, 20)}...', name: 'AuthenticatedApiService');
    }
    developer.log('=== End Configuration Debug ===', name: 'AuthenticatedApiService');
  }
}

/// Custom exception for authentication errors
class AuthenticationException implements Exception {
  final String message;
  AuthenticationException(this.message);
  
  @override
  String toString() => 'AuthenticationException: $message';
}
