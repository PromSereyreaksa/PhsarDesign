import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

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
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF9C27B0),
        scaffoldBackgroundColor: const Color(0xFF202020), // Use gradient start color as base
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF9C27B0),
          secondary: Color(0xFF9C27B0),
          surface: Color(0xFF202020), // Use gradient start color
        ),
        textTheme: GoogleFonts.poppinsTextTheme(
          ThemeData.dark().textTheme,
        ),
      ),
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
      const double navbarHeight = 80.0;

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
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: [0.3, 1.0], // 30% and 100% positions based on full content height
                  colors: [
                    Color(0xFF202020), // Dark gray at 30%
                    Color(0xFF000000), // Black at 100%
                  ],
                ),
              ),
              child: Column(
                children: [
                const SizedBox(height: 80), // Space for fixed navbar
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

// Navigation Bar Component
class TopNavbar extends StatefulWidget {
  const TopNavbar({super.key});

  @override
  State<TopNavbar> createState() => _TopNavbarState();
}

class _TopNavbarState extends State<TopNavbar> {
  bool _isDrawerOpen = false;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;
    final isTablet = screenWidth >= 768 && screenWidth < 1024;

    return Container(
      height: 80,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 16,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFF202020).withValues(alpha: 0.98), // High opacity gradient start color for improved contrast and visibility
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Main navbar with hamburger menu on far left
          Row(
            children: [
              // Left section - Hamburger menu first, then logo
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Mobile hamburger menu on far left
                  if (isMobile || isTablet) ...[
                    IconButton(
                      icon: Icon(
                        _isDrawerOpen ? Icons.close : Icons.menu,
                        size: 22,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        setState(() {
                          _isDrawerOpen = !_isDrawerOpen;
                        });
                      },
                    ),
                    const SizedBox(width: 8),
                  ],

                  // Logo - never truncated, positioned after hamburger menu
                  Text(
                    'PhsarDesign',
                    style: GoogleFonts.poppins(
                      fontSize: isMobile ? 18 : (isTablet ? 22 : 28),
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF9C27B0),
                    ),
                  ),
                ],
              ),

              // Center section - Navigation (Desktop only)
              if (!isMobile && !isTablet)
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildDropdown('Find Talents'),
                      const SizedBox(width: 24),
                      _buildDropdown('Find Works'),
                      const SizedBox(width: 24),
                      _buildDropdown('Community'),
                    ],
                  ),
                )
              else
                const Spacer(),

              // Right section - Notifications and Profile
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Always show notifications and profile
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined, size: 22, color: Colors.white),
                    onPressed: () {},
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    radius: isMobile ? 16 : 18,
                    backgroundColor: const Color(0xFF9C27B0),
                    child: Icon(
                      Icons.person,
                      color: Colors.white,
                      size: isMobile ? 18 : 20,
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Mobile Sidebar Overlay (ChatGPT-style)
          if (_isDrawerOpen && (isMobile || isTablet))
            Positioned.fill(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _isDrawerOpen = false;
                  });
                },
                child: Container(
                  color: Colors.black.withValues(alpha: 0.5),
                  child: Row(
                    children: [
                      // Sidebar
                      Container(
                        width: 280,
                        height: double.infinity,
                        decoration: const BoxDecoration(
                          color: Color(0xFF2A2A2A),
                          borderRadius: BorderRadius.only(
                            topRight: Radius.circular(16),
                            bottomRight: Radius.circular(16),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header
                            Container(
                              padding: const EdgeInsets.all(20),
                              decoration: const BoxDecoration(
                                color: Color(0xFF1E1E1E),
                                borderRadius: BorderRadius.only(
                                  topRight: Radius.circular(16),
                                ),
                              ),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    radius: 20,
                                    backgroundColor: const Color(0xFF9C27B0),
                                    child: const Icon(Icons.person, color: Colors.white),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      'User Profile',
                                      style: GoogleFonts.poppins(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Menu items
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                child: Column(
                                  children: [
                                    _buildMobileMenuItem('Find Talents', Icons.search),
                                    _buildMobileMenuItem('Find Works', Icons.work_outline),
                                    _buildMobileMenuItem('Community', Icons.group_outlined),
                                    const Divider(color: Color(0xFF404040), height: 32),
                                    _buildMobileMenuItem('Notifications', Icons.notifications_outlined),
                                    _buildMobileMenuItem('Settings', Icons.settings_outlined),
                                    _buildMobileMenuItem('Help', Icons.help_outline),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Tap area to close
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _isDrawerOpen = false;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDropdown(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            text,
            style: GoogleFonts.poppins(
              fontSize: 16,
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 4),
          const Icon(Icons.keyboard_arrow_down, color: Colors.white, size: 20),
        ],
      ),
    );
  }

  Widget _buildMobileMenuItem(String text, IconData icon) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: ListTile(
        leading: Icon(icon, color: Colors.white70, size: 22),
        title: Text(
          text,
          style: GoogleFonts.poppins(
            fontSize: 16,
            color: Colors.white,
            fontWeight: FontWeight.w500,
          ),
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        onTap: () {
          setState(() {
            _isDrawerOpen = false;
          });
        },
        hoverColor: const Color(0xFF9C27B0).withValues(alpha: 0.1),
        splashColor: const Color(0xFF9C27B0).withValues(alpha: 0.2),
      ),
    );
  }
}

// Hero Section Component
class HeroSection extends StatefulWidget {
  final String? backgroundImageUrl;

  const HeroSection({super.key, this.backgroundImageUrl});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> {
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;
    final isTablet = screenWidth >= 768 && screenWidth < 1024;

    return Column(
      children: [
        // Welcome text outside purple container
        Container(
          width: double.infinity,
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 20 : 40,
            vertical: 20,
          ),
          color: Colors.transparent, // Transparent background to show page gradient
          child: Row(
            children: [
              Container(
                // Auto-sizing container that matches text width
                child: _buildWelcomeText(isMobile, isTablet),
              ),
            ],
          ),
        ),

        // Main hero section with background image only
        Container(
          width: double.infinity,
          constraints: const BoxConstraints(
            minHeight: 400,
          ),
          decoration: const BoxDecoration(
            // Use only the hero section background image with natural scaling
            image: DecorationImage(
              image: AssetImage('image/hero section background.png'),
              fit: BoxFit.cover, // Maintains aspect ratio and covers entire container
            ),
          ),
          child: Container(
            width: double.infinity, // Full viewport width
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 20 : 40, // Minimal padding for content readability
              vertical: 32,
            ),
            // Removed all color backgrounds, gradients, and overlays
            // Using only the background image as the visual background
            child: isMobile ? _buildMobileLayout(context) : _buildDesktopLayout(context, isTablet),
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24), // Standardized spacing

          // Title Widget
          Text(
            'Find Artists, See Work, Be Discovered',
            style: GoogleFonts.poppins(
              fontSize: 40, // Changed to 2.5rem (40px)
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),

          const SizedBox(height: 24), // Spacing between title and search container

          // Search and Interaction Container
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSearchBox(),
              const SizedBox(height: 16), // Spacing between search box and suggestions
              _buildSuggestionButtons(),
            ],
          ),

          const SizedBox(height: 24), // Spacing between search container and tagline

          // Marketplace Tagline Container
          _buildGradientTitle(),
        ],
      ),
    );
  }

  Widget _buildDesktopLayout(BuildContext context, bool isTablet) {
    return Stack(
      children: [
        // Main content
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left side - Main content
            Expanded(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 24), // Standardized spacing

                  // Title Widget
                  Text(
                    'Find Artists, See Work, Be Discovered',
                    style: GoogleFonts.poppins(
                      fontSize: 40, // Changed to 2.5rem (40px)
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),

                  const SizedBox(height: 24), // Spacing between title and search container

                  // Search and Interaction Container
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSearchBox(),
                      const SizedBox(height: 16), // Spacing between search box and suggestions
                      _buildSuggestionButtons(),
                    ],
                  ),

                  const SizedBox(height: 24), // Standardized spacing
                ],
              ),
            ),
          ],
        ),

        // Marketplace Tagline Container positioned at bottom-right
        Positioned(
          right: 0,
          bottom: 20,
          child: _buildGradientTitle(),
        ),
      ],
    );
  }

  Widget _buildSearchBox() {
    return Container(
      width: 875, // Exact width as specified
      height: 48, // Exact height as specified
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0), // Remove vertical padding since height is fixed
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.white, Color(0xFF404040)], // Enhanced gradient from white to dark gray
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(25),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.search, color: Color(0xFF555555), size: 22), // Slightly darker for better contrast
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: _searchController,
              style: GoogleFonts.poppins(
                fontSize: 16, // Standard font size for better readability
                color: const Color(0xFF222222), // Darker text for better contrast against gradient
              ),
              decoration: InputDecoration(
                hintText: 'What type of service are you looking for?',
                hintStyle: GoogleFonts.poppins(
                  fontSize: 16,
                  color: const Color(0xFF777777), // Adjusted hint color for better visibility
                ),
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero, // Remove content padding since container height is fixed
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestionButtons() {
    final suggestions = ['logo', 'graphic design', '3D Render', 'illustration', 'branding'];
    final screenWidth = MediaQuery.of(context).size.width;
    final isDesktop = screenWidth >= 1024; // Desktop breakpoint

    if (isDesktop) {
      // Desktop: Display in horizontal row/grid format
      return Row(
        children: [
          ...suggestions.map((suggestion) => Padding(
            padding: const EdgeInsets.only(right: 12), // Space between buttons
            child: _buildSuggestionChip(suggestion),
          )),
        ],
      );
    } else {
      // Smaller screens: Allow wrapping to multiple rows
      return Wrap(
        spacing: 12, // Horizontal spacing between buttons
        runSpacing: 8, // Vertical spacing between rows
        children: suggestions.map((suggestion) => _buildSuggestionChip(suggestion)).toList(),
      );
    }
  }

  Widget _buildSuggestionChip(String suggestion) {
    return InkWell(
      onTap: () {
        _searchController.text = suggestion;
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 28, // Exact height as specified
        padding: const EdgeInsets.symmetric(
          horizontal: 12, // Minimal horizontal padding for text content
          vertical: 0,   // Remove vertical padding since height is fixed
        ),
        decoration: BoxDecoration(
          color: const Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF404040), width: 0.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 1,
              offset: const Offset(0, 0.5),
            ),
          ],
        ),
        child: Center( // Center the text within the fixed height container
          child: Text(
            suggestion,
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 16, // 16px font size as specified
              fontWeight: FontWeight.w400,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ),
    );
  }

  Widget _buildWelcomeText(bool isMobile, bool isTablet) {
    return ShaderMask(
      shaderCallback: (bounds) => const LinearGradient(
        colors: [
          Colors.white,
          Color.fromARGB(255, 217, 0, 255), // Purple
        ],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ).createShader(bounds),
      child: Text(
        'Welcome, User!',
        style: GoogleFonts.poppins(
          fontSize: 40, // Changed to 2.5rem (40px)
          fontWeight: FontWeight.bold,
          color: Colors.white, // This will be overridden by the shader mask
        ),
      ),
    );
  }

  Widget _buildGradientTitle() {
    return LayoutBuilder(
      builder: (context, constraints) {
        return RichText(
          textAlign: TextAlign.right,
          text: TextSpan(
            children: [
              TextSpan(
                text: 'A Marketplace Where Creative\n',
                style: GoogleFonts.poppins(
                  fontSize: 40, // Changed to 2.5rem (40px)
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                  height: 1.2, // Normal line height
                ),
              ),
              TextSpan(
                text: 'Dreams Take Shape.',
                style: GoogleFonts.poppins(
                  fontSize: 40, // Changed to 2.5rem (40px)
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF4CAF50), // Green
                  height: 1.2, // Normal line height
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// Explore Section Component
class ExploreSection extends StatefulWidget {
  final bool isExpanded;
  final VoidCallback onToggle;

  const ExploreSection({
    super.key,
    required this.isExpanded,
    required this.onToggle,
  });

  @override
  State<ExploreSection> createState() => _ExploreSectionState();
}

class _ExploreSectionState extends State<ExploreSection> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 32),
      color: Colors.transparent, // Transparent background to show page gradient
      child: Center( // Center the explore component horizontally
        child: MouseRegion(
          onEnter: (_) => setState(() => _isHovered = true),
          onExit: (_) => setState(() => _isHovered = false),
          child: InkWell(
            onTap: widget.onToggle,
            borderRadius: BorderRadius.circular(25), // Same as search box
            child: AnimatedScale(
              scale: _isHovered ? 1.0 : 0.8, // Scale up on hover, smaller by default
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              child: Container(
                padding: const EdgeInsets.all(5), // Minimal padding as requested
                decoration: const BoxDecoration(),
                child: Row(
                  mainAxisSize: MainAxisSize.min, // Only take up space needed for content
                  children: [
                    Text(
                      'Explore',
                      style: GoogleFonts.poppins(
                        fontSize: 30, // Base size, will be scaled by AnimatedScale
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 8), // Small space between text and arrow
                    Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(
                        color: Color(0xFF9C27B0), // Purple circle background
                        shape: BoxShape.circle,
                      ),
                      child: AnimatedRotation(
                        turns: widget.isExpanded ? 0.5 : 0.0, // 180 degrees when expanded
                        duration: const Duration(milliseconds: 300),
                        child: const Icon(
                          Icons.keyboard_arrow_down,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// Freelancing Opportunities Section Component
class FreelancingOpportunitiesSection extends StatelessWidget {
  final List<String>? customImages;
  final GlobalKey? titleKey;

  const FreelancingOpportunitiesSection({super.key, this.customImages, this.titleKey});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 32),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Freelancing Opportunities',
                  key: titleKey, // Add key for scroll targeting
                  style: GoogleFonts.poppins(
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'See all',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: const Color(0xFF9C27B0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildMasonryGrid(isMobile),
        ],
      ),
    );
  }

  Widget _buildMasonryGrid(bool isMobile) {
    // Removed fixed heights for Pinterest-style masonry layout
    final artworks = [
      {'color': const Color(0xFF9C27B0), 'category': 'Logo Design'},
      {'color': const Color(0xFF3F51B5), 'category': 'Graphic Design'},
      {'color': const Color(0xFF00BCD4), 'category': '3D Modeling'},
      {'color': const Color(0xFF4CAF50), 'category': 'Illustration'},
      {'color': const Color(0xFFFF9800), 'category': 'Photography'},
      {'color': const Color(0xFFE91E63), 'category': 'Branding'},
    ];

    return MasonryGridView.count(
      crossAxisCount: isMobile ? 2 : 4,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: artworks.length,
      itemBuilder: (context, index) {
        final hasCustomImage = customImages != null &&
                              index < customImages!.length &&
                              customImages![index].isNotEmpty;
        final categoryName = artworks[index]['category'] as String;

        return MouseRegion(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Stack(
              children: [
                // Main image or colored container
                hasCustomImage
                  ? Image(
                      image: customImages![index].startsWith('http')
                        ? NetworkImage(customImages![index])
                        : AssetImage(customImages![index]) as ImageProvider,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      // Let the image determine its own height for Pinterest effect
                    )
                  : Container(
                      height: 200, // Fallback height for non-custom images
                      width: double.infinity,
                      color: artworks[index]['color'] as Color,
                      child: const Center(
                        child: Icon(
                          Icons.image,
                          color: Colors.white,
                          size: 40,
                        ),
                      ),
                    ),

                // Base overlay for custom images
                if (hasCustomImage)
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.3),
                          ],
                        ),
                      ),
                    ),
                  ),

                // Hover overlay with blur effect and text
                Positioned.fill(
                  child: _HoverOverlay(
                    categoryName: categoryName,
                    borderRadius: 12,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

// Hover Overlay Widget for Image Effects
class _HoverOverlay extends StatefulWidget {
  final String categoryName;
  final double borderRadius;

  const _HoverOverlay({
    required this.categoryName,
    required this.borderRadius,
  });

  @override
  State<_HoverOverlay> createState() => _HoverOverlayState();
}

class _HoverOverlayState extends State<_HoverOverlay> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(widget.borderRadius),
          color: _isHovered
            ? Colors.black.withValues(alpha: 0.7)
            : Colors.transparent,
        ),
        child: _isHovered
          ? Center(
              child: Text(
                widget.categoryName,
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
            )
          : null,
      ),
    );
  }
}

// Popular Services Section Component
class PopularServicesSection extends StatelessWidget {
  final List<String>? customImages;

  const PopularServicesSection({super.key, this.customImages});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;
    final isTablet = screenWidth >= 768 && screenWidth < 1024;

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 32),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Popular Services',
                  style: GoogleFonts.poppins(
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'See all',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: const Color(0xFF9C27B0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildServiceGrid(isMobile, isTablet),
        ],
      ),
    );
  }

  Widget _buildServiceGrid(bool isMobile, bool isTablet) {
    // Removed fixed heights for Pinterest-style masonry layout
    final artworks = [
      {'color': const Color(0xFF9C27B0), 'category': 'Web Design'},
      {'color': const Color(0xFF3F51B5), 'category': 'Mobile Apps'},
      {'color': const Color(0xFF00BCD4), 'category': 'UI/UX Design'},
      {'color': const Color(0xFF4CAF50), 'category': 'Digital Marketing'},
    ];

    return MasonryGridView.count(
      crossAxisCount: isMobile ? 2 : (isTablet ? 3 : 4),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: artworks.length,
      itemBuilder: (context, index) {
        final hasCustomImage = customImages != null &&
                              index < customImages!.length &&
                              customImages![index].isNotEmpty;
        final categoryName = artworks[index]['category'] as String;

        return MouseRegion(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Stack(
              children: [
                // Main image or colored container
                hasCustomImage
                  ? Image(
                      image: customImages![index].startsWith('http')
                        ? NetworkImage(customImages![index])
                        : AssetImage(customImages![index]) as ImageProvider,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      // Let the image determine its own height for Pinterest effect
                    )
                  : Container(
                      height: 200, // Fallback height for non-custom images
                      width: double.infinity,
                      color: artworks[index]['color'] as Color,
                      child: const Center(
                        child: Icon(
                          Icons.image,
                          color: Colors.white,
                          size: 40,
                        ),
                      ),
                    ),

                // Base overlay for custom images
                if (hasCustomImage)
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.3),
                          ],
                        ),
                      ),
                    ),
                  ),

                // Hover overlay with blur effect and text
                Positioned.fill(
                  child: _HoverOverlay(
                    categoryName: categoryName,
                    borderRadius: 12,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

// Artists You May Like Section Component
class ArtistYouMayLikeSection extends StatelessWidget {
  final List<String>? customImages;

  const ArtistYouMayLikeSection({super.key, this.customImages});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;
    final isTablet = screenWidth >= 768 && screenWidth < 1024;

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 32),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Artists You May Like',
                  style: GoogleFonts.poppins(
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'See all',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: const Color(0xFF9C27B0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildArtistGrid(isMobile, isTablet),
        ],
      ),
    );
  }

  Widget _buildArtistGrid(bool isMobile, bool isTablet) {
    final artists = [
      {
        'name': 'Prom Sereyreaksa',
        'role': 'UI/UX Designer',
        'bio': 'Passionate about creating beautiful digital experiences',
        'color': const Color(0xFF9C27B0)
      },
      {
        'name': 'Chea Ilong',
        'role': '3D Artist',
        'bio': 'Bringing imagination to life through 3D modeling',
        'color': const Color(0xFF3F51B5)
      },
      {
        'name': 'Huy Visa',
        'role': 'Illustrator',
        'bio': 'Creating vibrant illustrations that tell stories',
        'color': const Color(0xFF00BCD4)
      },
      {
        'name': 'Sea Huyty',
        'role': 'Brand Designer',
        'bio': 'Crafting memorable brand identities',
        'color': const Color(0xFF4CAF50)
      },
      {
        'name': 'Phay Someth',
        'role': 'Motion Designer',
        'bio': 'Bringing designs to life through animation',
        'color': const Color(0xFFFF9800)
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: isMobile ? 2 : (isTablet ? 3 : 5),
        crossAxisSpacing: isMobile ? 16 : 24,
        mainAxisSpacing: isMobile ? 20 : 32,
        childAspectRatio: isMobile ? 0.8 : 1.0, // Adjusted for larger circular images
      ),
      itemCount: artists.length,
      itemBuilder: (context, index) {
        return _buildArtistCard(artists[index], index: index, isMobile: isMobile);
      },
    );
  }

  Widget _buildArtistCard(Map<String, dynamic> artist, {required int index, required bool isMobile}) {
    final hasCustomImage = customImages != null &&
                          index < customImages!.length &&
                          customImages![index].isNotEmpty;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Large circular profile picture like Spotify
        CircleAvatar(
          radius: isMobile ? 50 : 70, // Much larger like Spotify
          backgroundColor: hasCustomImage ? Colors.transparent : artist['color'] as Color,
          backgroundImage: hasCustomImage
            ? (customImages![index].startsWith('http')
                ? NetworkImage(customImages![index])
                : AssetImage(customImages![index]) as ImageProvider)
            : null,
          child: hasCustomImage
            ? null
            : Icon(
                Icons.person,
                color: Colors.white,
                size: isMobile ? 40 : 50,
              ),
        ),
        SizedBox(height: isMobile ? 12 : 16),

        // Artist name
        Text(
          artist['name'] as String,
          style: GoogleFonts.poppins(
            fontSize: isMobile ? 16 : 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),

        const SizedBox(height: 6),

        // Artist role with purple color
        Text(
          artist['role'] as String,
          style: GoogleFonts.poppins(
            fontSize: isMobile ? 14 : 16,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF6B46C1), // Purple color as requested
          ),
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),

        const SizedBox(height: 8),

        // Short bio text
        Text(
          artist['bio'] as String,
          style: GoogleFonts.poppins(
            fontSize: isMobile ? 12 : 14,
            color: Colors.white70,
            height: 1.3,
          ),
          textAlign: TextAlign.center,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}

// Footer Component
class FooterSection extends StatelessWidget {
  const FooterSection({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;

    return Container(
      width: double.infinity,
      color: Colors.transparent, // Transparent background to show page gradient
      padding: EdgeInsets.all(isMobile ? 20 : 40),
      child: Column(
        children: [
          // Main footer content
          isMobile ? _buildMobileFooter() : _buildDesktopFooter(),

          const SizedBox(height: 32),

          // Divider
          Container(
            height: 1,
            color: Colors.white.withValues(alpha: 0.2),
          ),

          const SizedBox(height: 20),

          // Copyright
          Text(
            '© 2025 Phsar Design by Coppsary. All rights reserved.',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.white70,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildMobileFooter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Left section content
        _buildLeftSection(),

        const SizedBox(height: 32),

        // Right section content
        _buildRightSection(),
      ],
    );
  }

  Widget _buildDesktopFooter() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Left section
        Expanded(
          flex: 1,
          child: _buildLeftSection(),
        ),

        const SizedBox(width: 60),

        // Right section
        Expanded(
          flex: 1,
          child: _buildRightSection(),
        ),
      ],
    );
  }

  Widget _buildLeftSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // PhsarDesign title
        Text(
          'PhsarDesign',
          style: GoogleFonts.poppins(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),

        const SizedBox(height: 20),

        // Legal links
        _buildLegalLink('Terms and Conditions'),
        const SizedBox(height: 8),
        _buildLegalLink('Privacy Policy'),
        const SizedBox(height: 8),
        _buildLegalLink('Cookie Settings'),

        const SizedBox(height: 24),

        // Social media icons
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
        // Newsletter heading
        Text(
          'Our Newsletter',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),

        const SizedBox(height: 16),

        // Email input and subscribe button
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2A2A2A),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.2),
                  ),
                ),
                child: TextField(
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                  decoration: InputDecoration(
                    hintText: 'Enter your email address',
                    hintStyle: GoogleFonts.poppins(
                      color: Colors.white54,
                      fontSize: 14,
                    ),
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
                backgroundColor: const Color(0xFF9C27B0),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Subscribe',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLegalLink(String text) {
    return Text(
      text,
      style: GoogleFonts.poppins(
        fontSize: 14,
        color: Colors.white70,
      ),
    );
  }

  Widget _buildSocialIcon(IconData icon, String label) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: const Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.2),
        ),
      ),
      child: Icon(
        icon,
        color: Colors.white70,
        size: 20,
      ),
    );
  }
}