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

// Import new pages
import 'pages/creative_jobs_page.dart';
import 'pages/creative_services_page.dart';

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
      initialRoute: '/',
      routes: {
        '/': (context) => const LandingPage(),
        '/jobs': (context) => const CreativeJobsPage(),
        '/services': (context) => const CreativeServicesPage(),
      },
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