import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';
import '../pages/creative_jobs_page.dart';
import '../pages/creative_services_page.dart';

/// Updated navbar with navigation to Creative Jobs and Services pages
class TopNavbar extends StatefulWidget {
  const TopNavbar({super.key});

  @override
  State<TopNavbar> createState() => _TopNavbarState();
}

class _TopNavbarState extends State<TopNavbar> {
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < AppConstants.mobileBreakpoint;

    return Container(
      height: AppConstants.navbarHeight,
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
      decoration: BoxDecoration(
        color: AppConstants.gradientStart.withValues(alpha: AppConstants.navbarOpacity),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Logo on the left with gradient text like landing page
          GestureDetector(
            onTap: () {
              // Navigate back to home page
              Navigator.of(context).pushReplacementNamed('/');
            },
            child: ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [Colors.white, AppConstants.primaryPurple],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ).createShader(bounds),
              child: Text(
                AppConstants.appTitle,
                style: AppTextStyles.logo(Colors.white),
              ),
            ),
          ),

          // Navigation links in center
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildNavItem('Find Talents', isMobile, () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const CreativeServicesPage(),
                    ),
                  );
                }),
                SizedBox(width: isMobile ? 12 : 24),
                _buildNavItem('Find Works', isMobile, () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const CreativeJobsPage(),
                    ),
                  );
                }),
                SizedBox(width: isMobile ? 12 : 24),
                _buildNavItem('Community', isMobile, () {
                  // TODO: Navigate to Community page
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Community page coming soon!'),
                      backgroundColor: AppConstants.primaryPurple,
                    ),
                  );
                }),
              ],
            ),
          ),

          // Right section - Notifications and Profile
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, size: 22, color: Colors.white),
                onPressed: () {
                  // TODO: Handle notifications
                },
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: () {
                  // TODO: Handle profile menu
                },
                child: CircleAvatar(
                  radius: 18,
                  backgroundColor: AppConstants.primaryPurple,
                  child: const Icon(Icons.person, color: Colors.white, size: 20),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(String text, bool isMobile, VoidCallback onTap) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeOut,
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 8 : 16,
            vertical: 8
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                text,
                style: AppTextStyles.navigation(Colors.white).copyWith(
                  fontSize: isMobile ? 14 : 16,
                )
              ),
              const SizedBox(width: 4),
              Icon(
                Icons.keyboard_arrow_down,
                color: Colors.white,
                size: isMobile ? 18 : 20
              ),
            ],
          ),
        ),
      ),
    );
  }
}