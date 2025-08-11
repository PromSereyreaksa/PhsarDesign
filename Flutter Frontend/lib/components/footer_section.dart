import 'package:flutter/material.dart';
import '../config/app_styles.dart';
import '../config/app_constants.dart';

/// Footer with legal links, newsletter signup, and social icons.
class FooterSection extends StatelessWidget {
  const FooterSection({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < AppConstants.mobileBreakpoint;

    return Container(
      width: double.infinity,
      color: Colors.transparent,
      padding: EdgeInsets.all(isMobile ? 20 : 40),
      child: Column(
        children: [
          isMobile ? _buildMobileFooter() : _buildDesktopFooter(),
          const SizedBox(height: 32),
          Container(height: 1, color: Colors.white.withValues(alpha: 0.2)),
          const SizedBox(height: 20),
          Text('© 2025 Phsar Design by Coppsary. All rights reserved.', style: AppTextStyles.bodyS(Colors.white70), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildMobileFooter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLeftSection(),
        const SizedBox(height: 32),
        _buildRightSection(),
      ],
    );
  }

  Widget _buildDesktopFooter() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 1, child: _buildLeftSection()),
        const SizedBox(width: 60),
        Expanded(flex: 1, child: _buildRightSection()),
      ],
    );
  }

  Widget _buildLeftSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('PhsarDesign', style: AppTextStyles.titleL(Colors.white)),
        const SizedBox(height: 20),
        _buildLegalLink('Terms and Conditions'),
        const SizedBox(height: 8),
        _buildLegalLink('Privacy Policy'),
        const SizedBox(height: 8),
        _buildLegalLink('Cookie Settings'),
        const SizedBox(height: 24),
        Row(
          children: [
            _buildSocialIcon(Icons.facebook, 'Facebook'),
            const SizedBox(width: 16),
            _buildSocialIcon(Icons.business, 'LinkedIn'),
            const SizedBox(width: 16),
            _buildSocialIcon(Icons.telegram, 'Telegram'),
            const SizedBox(width: 16),
            _buildSocialIcon(Icons.email, 'Email'),
          ],
        ),
      ],
    );
  }

  Widget _buildRightSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(AppConstants.newsletterTitle, style: AppTextStyles.bodyM(Colors.white).copyWith(fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2A2A2A),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                ),
                child: TextField(
                  style: AppTextStyles.bodyS(Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Enter your email address',
                    hintStyle: AppTextStyles.bodyS(Colors.white54),
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: AppConstants.primaryPurple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: Text(AppConstants.subscribeCta, style: AppTextStyles.bodyS(Colors.white).copyWith(fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLegalLink(String text) => Text(text, style: AppTextStyles.bodyS(Colors.white70));

  Widget _buildSocialIcon(IconData icon, String label) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: const Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
      ),
      child: Icon(icon, color: Colors.white70, size: 20),
    );
  }
}

