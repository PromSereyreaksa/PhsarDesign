import 'package:flutter/material.dart';
import '../services/jwt_token_service.dart';
import '../services/authenticated_api_service.dart';

/// Example component showing how to use JWT authentication in Flutter widgets
class UserProfileWidget extends StatefulWidget {
  const UserProfileWidget({Key? key}) : super(key: key);

  @override
  State<UserProfileWidget> createState() => _UserProfileWidgetState();
}

class _UserProfileWidgetState extends State<UserProfileWidget> {
  Map<String, dynamic>? _userProfile;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  /// Load user profile from API using JWT token
  Future<void> _loadUserProfile() async {
    if (!JwtTokenService.isAuthenticated()) {
      setState(() {
        _errorMessage = 'User is not authenticated. Please login through the React app first.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Try to get cached user data first
      final cachedUserData = JwtTokenService.getUserData();
      if (cachedUserData != null) {
        setState(() {
          _userProfile = cachedUserData;
        });
      }

      // Then fetch fresh data from API
      final profileData = await AuthenticatedApiService.getUserProfile();
      if (profileData != null) {
        setState(() {
          _userProfile = profileData;
        });
      } else if (cachedUserData == null) {
        setState(() {
          _errorMessage = 'Failed to load user profile';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error loading profile: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Update user profile
  Future<void> _updateProfile() async {
    if (_userProfile == null) return;

    // Example update - you can customize this based on your needs
    final updatedData = {
      ..._userProfile!,
      'lastUpdated': DateTime.now().toIso8601String(),
    };

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final success = await AuthenticatedApiService.updateUserProfile(updatedData);
      if (success) {
        setState(() {
          _userProfile = updatedData;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        setState(() {
          _errorMessage = 'Failed to update profile';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error updating profile: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
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
            Text(
              'User Profile',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),

            if (_isLoading)
              const Center(child: CircularProgressIndicator())
            else if (_errorMessage != null)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Error:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.red[800],
                      ),
                    ),
                    Text(
                      _errorMessage!,
                      style: TextStyle(color: Colors.red[800]),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton.icon(
                      onPressed: _loadUserProfile,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Retry'),
                    ),
                  ],
                ),
              )
            else if (_userProfile != null) ...[
              // Display user profile data
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (_userProfile!['firstName'] != null) ...[
                      Text(
                        'Name: ${_userProfile!['firstName']} ${_userProfile!['lastName'] ?? ''}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                    ],
                    if (_userProfile!['email'] != null) ...[
                      Text('Email: ${_userProfile!['email']}'),
                      const SizedBox(height: 8),
                    ],
                    if (_userProfile!['id'] != null) ...[
                      Text('User ID: ${_userProfile!['id']}'),
                      const SizedBox(height: 8),
                    ],
                    if (_userProfile!['lastUpdated'] != null) ...[
                      Text(
                        'Last Updated: ${_userProfile!['lastUpdated']}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Action buttons
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  ElevatedButton.icon(
                    onPressed: _loadUserProfile,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Refresh'),
                  ),
                  ElevatedButton.icon(
                    onPressed: _updateProfile,
                    icon: const Icon(Icons.save),
                    label: const Text('Update Profile'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
            ] else
              const Text('No profile data available'),
          ],
        ),
      ),
    );
  }
}
