import 'package:flutter/material.dart';
import '../services/redirect_handler_service.dart';

/// Widget that detects and handles redirects from React login app
class LoginRedirectHandler extends StatefulWidget {
  final Widget child;
  
  const LoginRedirectHandler({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  State<LoginRedirectHandler> createState() => _LoginRedirectHandlerState();
}

class _LoginRedirectHandlerState extends State<LoginRedirectHandler> {
  bool _showWelcomeMessage = false;
  String _welcomeMessage = '';
  bool _hasValidToken = false;

  @override
  void initState() {
    super.initState();
    _checkForRedirect();
  }

  void _checkForRedirect() {
    // Add a small delay to ensure the page is fully loaded
    Future.delayed(const Duration(milliseconds: 500), () {
      final redirectInfo = RedirectHandlerService.processRedirect();
      
      if (redirectInfo != null && redirectInfo['isRedirect'] == true) {
        setState(() {
          _showWelcomeMessage = true;
          _welcomeMessage = redirectInfo['welcomeMessage'] ?? 'Welcome!';
          _hasValidToken = redirectInfo['hasValidToken'] ?? false;
        });

        // Clean URL parameters after processing
        RedirectHandlerService.cleanUrlParameters();

        // Auto-hide welcome message after 5 seconds
        Future.delayed(const Duration(seconds: 5), () {
          if (mounted) {
            setState(() {
              _showWelcomeMessage = false;
            });
          }
        });

        // Debug info
        RedirectHandlerService.debugRedirectInfo();
      }
    });
  }

  void _dismissWelcomeMessage() {
    setState(() {
      _showWelcomeMessage = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        
        // Welcome overlay
        if (_showWelcomeMessage)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              child: Container(
                margin: const EdgeInsets.all(16),
                child: Material(
                  elevation: 8,
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.transparent,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.green.shade400,
                          Colors.green.shade600,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        // Success icon
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            _hasValidToken ? Icons.check_circle : Icons.info,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        
                        // Welcome message
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Login Successful!',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                _welcomeMessage,
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.9),
                                  fontSize: 14,
                                ),
                              ),
                              if (_hasValidToken) ...[
                                const SizedBox(height: 4),
                                Text(
                                  '🔐 Authentication token is active',
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.8),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        
                        // Close button
                        IconButton(
                          onPressed: _dismissWelcomeMessage,
                          icon: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 20,
                          ),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(
                            minWidth: 32,
                            minHeight: 32,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
