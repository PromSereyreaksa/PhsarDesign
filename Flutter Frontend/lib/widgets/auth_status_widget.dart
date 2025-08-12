import 'package:flutter/material.dart';
import 'dart:developer' as developer;
import '../services/jwt_token_service.dart';
import '../services/authenticated_api_service.dart';

/// Widget that shows authentication status and user info from React app's localStorage
class AuthStatusWidget extends StatefulWidget {
  const AuthStatusWidget({Key? key}) : super(key: key);

  @override
  State<AuthStatusWidget> createState() => _AuthStatusWidgetState();
}

class _AuthStatusWidgetState extends State<AuthStatusWidget> {
  bool _isAuthenticated = false;
  Map<String, dynamic>? _userData;
  String? _token;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  /// Check authentication status from localStorage
  void _checkAuthStatus() {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      _isAuthenticated = JwtTokenService.isAuthenticated();
      _userData = JwtTokenService.getUserData();
      _token = JwtTokenService.getToken();

      developer.log('Auth Status - Authenticated: $_isAuthenticated', name: 'AuthStatusWidget');
      
      if (_userData != null) {
        developer.log('User Data: ${_userData.toString()}', name: 'AuthStatusWidget');
      }
    } catch (e) {
      _errorMessage = 'Error checking authentication: $e';
      developer.log(_errorMessage!, name: 'AuthStatusWidget');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Test authenticated API call
  Future<void> _testApiCall() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Debug configuration before making the call
      AuthenticatedApiService.debugConfiguration();
      
      // Example API call - replace with your actual endpoint
      final response = await AuthenticatedApiService.get('/test');
      
      if (response != null) {
        final data = AuthenticatedApiService.handleResponse(response);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('API call successful: ${response.statusCode}'),
            backgroundColor: Colors.green,
          ),
        );
        developer.log('API test successful: $data', name: 'AuthStatusWidget');
      } else {
        throw Exception('API call returned null response');
      }
    } catch (e) {
      _errorMessage = 'API call failed: $e';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_errorMessage!),
          backgroundColor: Colors.red,
        ),
      );
      developer.log(_errorMessage!, name: 'AuthStatusWidget');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Show API configuration debug info
  void _showDebugInfo() {
    AuthenticatedApiService.debugConfiguration();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Debug info logged to console. API Base URL: ${AuthenticatedApiService.baseUrl}'),
        backgroundColor: Colors.blue,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  /// Clear authentication data
  void _clearAuth() {
    JwtTokenService.clearTokenData();
    _checkAuthStatus();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Authentication data cleared'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Authentication Status',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                IconButton(
                  onPressed: _checkAuthStatus,
                  icon: const Icon(Icons.refresh),
                  tooltip: 'Refresh Auth Status',
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            if (_isLoading)
              const Center(child: CircularProgressIndicator())
            else ...[
              // Authentication Status
              Row(
                children: [
                  Icon(
                    _isAuthenticated ? Icons.check_circle : Icons.cancel,
                    color: _isAuthenticated ? Colors.green : Colors.red,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _isAuthenticated ? 'Authenticated' : 'Not Authenticated',
                    style: TextStyle(
                      color: _isAuthenticated ? Colors.green : Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // User Data
              if (_userData != null) ...[
                Text(
                  'User Information:',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (_userData!['firstName'] != null)
                        Text('Name: ${_userData!['firstName']} ${_userData!['lastName'] ?? ''}'),
                      if (_userData!['email'] != null)
                        Text('Email: ${_userData!['email']}'),
                      if (_userData!['id'] != null)
                        Text('User ID: ${_userData!['id']}'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Token Info (truncated for security)
              if (_token != null) ...[
                Text(
                  'JWT Token:',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${_token!.substring(0, 20)}...${_token!.substring(_token!.length - 10)}',
                    style: const TextStyle(fontFamily: 'monospace'),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // API Configuration
              Text(
                'API Configuration:',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Base URL: ${AuthenticatedApiService.baseUrl}'),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Error Message
              if (_errorMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(color: Colors.red[800]),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Action Buttons
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  ElevatedButton.icon(
                    onPressed: _checkAuthStatus,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Refresh Status'),
                  ),
                  ElevatedButton.icon(
                    onPressed: _showDebugInfo,
                    icon: const Icon(Icons.info),
                    label: const Text('Debug Config'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.purple,
                      foregroundColor: Colors.white,
                    ),
                  ),
                  if (_isAuthenticated) ...[
                    ElevatedButton.icon(
                      onPressed: _testApiCall,
                      icon: const Icon(Icons.api),
                      label: const Text('Test API Call'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: _clearAuth,
                      icon: const Icon(Icons.logout),
                      label: const Text('Clear Auth'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
