import 'dart:html' as html;
import 'dart:developer' as developer;
import '../services/jwt_token_service.dart';

/// Service to handle URL parameters and detect redirects from React app
class RedirectHandlerService {
  /// Check if the Flutter app was opened via redirect from React app
  static bool isRedirectFromReactApp() {
    try {
      final uri = Uri.parse(html.window.location.href);
      return uri.queryParameters.containsKey('loginSuccess') || 
             uri.queryParameters.containsKey('firstName');
    } catch (e) {
      developer.log('Error checking redirect status: $e', name: 'RedirectHandlerService');
      return false;
    }
  }

  /// Get user data from URL parameters (sent from React app)
  static Map<String, String>? getUserDataFromUrl() {
    try {
      final uri = Uri.parse(html.window.location.href);
      final params = uri.queryParameters;

      if (params.isEmpty) return null;

      final userData = <String, String>{};
      
      if (params.containsKey('firstName')) {
        userData['firstName'] = params['firstName']!;
      }
      if (params.containsKey('lastName')) {
        userData['lastName'] = params['lastName']!;
      }
      if (params.containsKey('email')) {
        userData['email'] = params['email']!;
      }
      if (params.containsKey('userId')) {
        userData['userId'] = params['userId']!;
      }
      if (params.containsKey('username')) {
        userData['username'] = params['username']!;
      }
      if (params.containsKey('loginSuccess')) {
        userData['loginSuccess'] = params['loginSuccess']!;
      }
      if (params.containsKey('timestamp')) {
        userData['timestamp'] = params['timestamp']!;
      }

      return userData.isNotEmpty ? userData : null;
    } catch (e) {
      developer.log('Error extracting user data from URL: $e', name: 'RedirectHandlerService');
      return null;
    }
  }

  /// Clean URL parameters after processing (optional)
  static void cleanUrlParameters() {
    try {
      final uri = Uri.parse(html.window.location.href);
      final cleanUrl = '${uri.scheme}://${uri.host}${uri.port != 80 && uri.port != 443 ? ':${uri.port}' : ''}${uri.path}';
      html.window.history.replaceState({}, '', cleanUrl);
      developer.log('URL parameters cleaned', name: 'RedirectHandlerService');
    } catch (e) {
      developer.log('Error cleaning URL parameters: $e', name: 'RedirectHandlerService');
    }
  }

  /// Process redirect and show welcome message
  static Map<String, dynamic>? processRedirect() {
    if (!isRedirectFromReactApp()) {
      return null;
    }

    final urlUserData = getUserDataFromUrl();
    final tokenUserData = JwtTokenService.getUserData();
    final hasValidToken = JwtTokenService.isAuthenticated();

    developer.log('Processing redirect from React app', name: 'RedirectHandlerService');
    developer.log('URL user data: $urlUserData', name: 'RedirectHandlerService');
    developer.log('Token user data: $tokenUserData', name: 'RedirectHandlerService');
    developer.log('Has valid token: $hasValidToken', name: 'RedirectHandlerService');

    return {
      'isRedirect': true,
      'urlUserData': urlUserData,
      'tokenUserData': tokenUserData,
      'hasValidToken': hasValidToken,
      'welcomeMessage': _generateWelcomeMessage(urlUserData, tokenUserData),
    };
  }

  /// Generate welcome message based on available user data
  static String _generateWelcomeMessage(
    Map<String, String>? urlData,
    Map<String, dynamic>? tokenData,
  ) {
    String firstName = '';
    
    if (tokenData != null && tokenData['firstName'] != null) {
      firstName = tokenData['firstName'];
    } else if (urlData != null && urlData['firstName'] != null) {
      firstName = urlData['firstName']!;
    }

    if (firstName.isNotEmpty) {
      return 'Welcome back, $firstName! You\'ve been successfully authenticated.';
    }

    return 'Welcome! You\'ve been successfully authenticated.';
  }

  /// Show debug info about the redirect
  static void debugRedirectInfo() {
    final redirectInfo = processRedirect();
    if (redirectInfo != null) {
      developer.log('=== REDIRECT DEBUG INFO ===', name: 'RedirectHandlerService');
      developer.log('Is Redirect: ${redirectInfo['isRedirect']}', name: 'RedirectHandlerService');
      developer.log('URL User Data: ${redirectInfo['urlUserData']}', name: 'RedirectHandlerService');
      developer.log('Token User Data: ${redirectInfo['tokenUserData']}', name: 'RedirectHandlerService');
      developer.log('Has Valid Token: ${redirectInfo['hasValidToken']}', name: 'RedirectHandlerService');
      developer.log('Welcome Message: ${redirectInfo['welcomeMessage']}', name: 'RedirectHandlerService');
      developer.log('=== END REDIRECT DEBUG INFO ===', name: 'RedirectHandlerService');
    } else {
      developer.log('No redirect detected', name: 'RedirectHandlerService');
    }
  }
}
