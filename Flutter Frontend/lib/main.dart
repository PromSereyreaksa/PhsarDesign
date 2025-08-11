import 'package:flutter/material.dart';

// Import modular components
import 'config/app_theme.dart';
import 'config/app_constants.dart';
import 'components/navbar.dart';
import 'components/hero_section.dart';
import 'components/explore_section.dart';
import 'components/freelancing_opportunities_section.dart';
import 'components/popular_services_section.dart';
import 'components/artists_section.dart';
import 'components/footer_section.dart';

/*
 * CUSTOM IMAGE FUNCTIONALITY USAGE:
 *
 * This file now supports custom images for all major sections while maintaining
 * backward compatibility. When no custom images are provided, sections use
 * default fallbacks (gradients, colors, icons).
 *
 * EXAMPLE USAGE WITH CUSTOM IMAGES:
 *
 * // Hero Section with custom background
 * const HeroSection(
 *   backgroundImageUrl: 'https://your-image-url.com/hero-bg.jpg',
 * ),
 *
 * // Freelancing Opportunities with custom team photos
 * const FreelancingOpportunitiesSection(
 *   customImages: [
 *     'https://your-image-url.com/team1.jpg',
 *     'https://your-image-url.com/team2.jpg',
 *     'https://your-image-url.com/team3.jpg',
 *     // Add more images as needed
 *   ],
 * ),
 *
 * // Popular Services with custom service images
 * const PopularServicesSection(
 *   customImages: [
 *     'https://your-image-url.com/service1.jpg',
 *     'https://your-image-url.com/service2.jpg',
 *     'https://your-image-url.com/service3.jpg',
 *     'https://your-image-url.com/service4.jpg',
 *   ],
 * ),
 *
 * // Artists Section with custom profile pictures
 * const ArtistYouMayLikeSection(
 *   customImages: [
 *     'https://your-image-url.com/artist1.jpg',
 *     'https://your-image-url.com/artist2.jpg',
 *     'https://your-image-url.com/artist3.jpg',
 *     // Add more artist photos as needed
 *   ],
 * ),
 *
 * NOTES:
 * - All custom image parameters are optional
 * - Images should be optimized for web (< 1MB each)
 * - Use appropriate aspect ratios for best results
 * - For production, use CDN or cloud storage with CORS enabled
 * - Local assets can also be used with AssetImage instead of NetworkImage
 */

void main() {
  runApp(const PhsarDesignApp());
}

class PhsarDesignApp extends StatelessWidget {
  const PhsarDesignApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PhsarDesign',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme(),
      home: const LandingPage(),
    );
  }
}

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _freelancingKey = GlobalKey();

  void _scrollToFreelancing() {
    final context = _freelancingKey.currentContext;
    if (context != null) {
      // Get the RenderBox to calculate position
      final RenderBox renderBox = context.findRenderObject() as RenderBox;
      final position = renderBox.localToGlobal(Offset.zero);

      // Calculate navbar height dynamically (fixed height of 80)
      const double navbarHeight = AppConstants.navbarHeight;

      // Add additional spacing for better visual separation
      const double additionalSpacing = 20.0;

      // Calculate the target scroll position
      final double targetPosition = position.dy - navbarHeight - additionalSpacing;

      // Animate to the calculated position
      _scrollController.animateTo(
        targetPosition.clamp(0.0, _scrollController.position.maxScrollExtent),
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Scrollable content with gradient background covering full content height
          SingleChildScrollView(
            controller: _scrollController,
            child: Container(
              // Apply gradient background to the full content container
              decoration: const BoxDecoration(
                gradient: AppTheme.pageGradient,
              ),
              child: Column(
                children: [
                SizedBox(height: AppConstants.navbarHeight), // Space for fixed navbar
                const HeroSection(
                  backgroundImageUrl: 'image/hero section background.png',
                ),

                // Explore Section - now acts as navigation anchor
                ExploreSection(
                  isExpanded: false, // Always false since we show all sections
                  onToggle: _scrollToFreelancing, // Scroll to freelancing instead of toggle
                ),

                // All sections now visible by default
                FreelancingOpportunitiesSection(
                  titleKey: _freelancingKey, // Add key for scroll targeting to title
                  customImages: const [
                    'image/freelance1.png',
                    'image/freelance2.png',
                    'image/freelance3.png',
                    'image/freelance4.png',
                    'image/freelance5.png',
                    'image/freelance6.png',
                  ],
                ),
                const PopularServicesSection(
                  customImages: [
                    'image/Service1.jpg',
                    'image/Service2.jpg',
                    'image/Service3.jpg',
                    'image/Service4.jpg',
                  ],
                ),
                const ArtistYouMayLikeSection(
                  customImages: [
                    'image/Artist1.jpg',
                    'image/Artist2.jpg',
                    'image/Artist3.jpg',
                    'image/Artist4.jpg',
                    'image/Artist5.jpg',
                  ],
                ),
                const FooterSection(),
                ],
              ),
            ),
          ),
          // Fixed navbar at top
          const Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: TopNavbar(),
          ),
        ],
      ),
    );
  }
}