import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';

/// Top navigation bar with 98% opacity background and mobile menu.
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
          ShaderMask(
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

          // Navigation links in center (visible on all screen sizes)
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildDropdown('Find Talents', isMobile),
                SizedBox(width: isMobile ? 12 : 24),
                _buildDropdown('Find Works', isMobile),
                SizedBox(width: isMobile ? 12 : 24),
                _buildDropdown('Community', isMobile),
              ],
            ),
          ),

          // Right section - Notifications and Profile (always visible)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, size: 22, color: Colors.white),
                onPressed: () {},
              ),
              const SizedBox(width: 8),
              CircleAvatar(
                radius: 18,
                backgroundColor: AppConstants.primaryPurple,
                child: const Icon(Icons.person, color: Colors.white, size: 20),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDropdown(String text, bool isMobile) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
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
    );
  }


}

