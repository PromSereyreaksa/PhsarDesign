import 'package:flutter/material.dart';
import 'lib/main.dart'; // Import the main app components

/*
 * EXAMPLE: PhsarDesign with Custom Images
 * 
 * This file demonstrates how to use the custom image functionality
 * that's now integrated into the main PhsarDesign app.
 * 
 * To use this example:
 * 1. Replace the example URLs below with your own image URLs
 * 2. Run this file instead of lib/main.dart
 * 3. All sections will display with your custom images
 */

void main() {
  runApp(const PhsarDesignAppWithCustomImages());
}

class PhsarDesignAppWithCustomImages extends StatelessWidget {
  const PhsarDesignAppWithCustomImages({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PhsarDesign - Custom Images Example',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF9C27B0),
        scaffoldBackgroundColor: const Color(0xFF121212),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF9C27B0),
          secondary: Color(0xFF9C27B0),
          surface: Color(0xFF1E1E1E),
        ),
      ),
      home: const LandingPageWithCustomImages(),
    );
  }
}

class LandingPageWithCustomImages extends StatelessWidget {
  const LandingPageWithCustomImages({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Scrollable content with top padding for fixed navbar
          SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 80), // Space for fixed navbar
                
                // Hero Section with Custom Background Image
                const HeroSection(
                  backgroundImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
                ),
                
                const ExploreSection(),
                
                // Freelancing Opportunities with Custom Team Photos
                const FreelancingOpportunitiesSection(
                  customImages: [
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  ],
                ),
                
                // Popular Services with Custom Service Images
                const PopularServicesSection(
                  customImages: [
                    'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  ],
                ),
                
                // Artists Section with Custom Profile Pictures
                const ArtistYouMayLikeSection(
                  customImages: [
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  ],
                ),
                
                const FooterSection(),
              ],
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

/*
 * USAGE INSTRUCTIONS:
 * 
 * 1. Replace the example URLs above with your own image URLs
 * 2. Ensure images are optimized for web (< 1MB each)
 * 3. Use appropriate aspect ratios:
 *    - Hero background: 16:9 or wider
 *    - Team photos: Various (masonry grid adapts)
 *    - Service images: 4:3 or 16:9
 *    - Profile pictures: 1:1 (square)
 * 
 * 4. For local development, you can use assets:
 *    - Add images to assets/images/ folder
 *    - Update pubspec.yaml to include assets
 *    - Use AssetImage instead of NetworkImage
 * 
 * 5. For production, use a CDN or cloud storage:
 *    - AWS S3, Google Cloud Storage, Cloudinary, etc.
 *    - Ensure CORS is configured for web access
 *    - Use optimized image formats (WebP when possible)
 */
