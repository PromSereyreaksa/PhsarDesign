import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';
import '../widgets/search_box.dart';
import '../widgets/suggestion_chip.dart';

/// Hero section with background image, welcome text, search, and suggestions.
class HeroSection extends StatefulWidget {
  final String? backgroundImageUrl; // asset or network

  const HeroSection({super.key, this.backgroundImageUrl});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> {
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < AppConstants.mobileBreakpoint;
    final isTablet = screenWidth >= AppConstants.mobileBreakpoint && screenWidth < AppConstants.tabletBreakpoint;

    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: EdgeInsets.symmetric(horizontal: isMobile ? 20 : 40, vertical: 20),
          color: Colors.transparent,
          child: Row(children: [Container(child: _buildWelcomeText())]),
        ),
        Container(
          width: double.infinity,
          constraints: const BoxConstraints(minHeight: 400),
          decoration: BoxDecoration(
            image: DecorationImage(
              image: (widget.backgroundImageUrl != null && widget.backgroundImageUrl!.isNotEmpty)
                  ? (widget.backgroundImageUrl!.startsWith('http')
                      ? NetworkImage(widget.backgroundImageUrl!)
                      : AssetImage(widget.backgroundImageUrl!) as ImageProvider)
                  : const AssetImage('image/hero section background.png'),
              fit: BoxFit.cover,
            ),
          ),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.symmetric(horizontal: isMobile ? 20 : 40, vertical: 32),
            child: isMobile ? _buildMobileLayout() : (isTablet ? _buildTabletLayout() : _buildDesktopLayout()),
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text('Find Artists, See Work, Be Discovered', style: AppTextStyles.heroTitle(Colors.white)),
          const SizedBox(height: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SearchBox(controller: _searchController),
              const SizedBox(height: 16),
              _buildSuggestionButtons(),
            ],
          ),
          const SizedBox(height: 32),
          _buildGradientTitle(),
          const SizedBox(height: 24), // Add bottom padding for better spacing
        ],
      ),
    );
  }

  Widget _buildTabletLayout() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text('Find Artists, See Work, Be Discovered', style: AppTextStyles.heroTitle(Colors.white)),
          const SizedBox(height: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SearchBox(controller: _searchController),
              const SizedBox(height: 16),
              _buildSuggestionButtons(),
            ],
          ),
          const SizedBox(height: 32),
          _buildGradientTitle(),
          const SizedBox(height: 24), // Add bottom padding for better spacing
        ],
      ),
    );
  }

  Widget _buildDesktopLayout() {
    return Stack(
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 24),
                  Text('Find Artists, See Work, Be Discovered', style: AppTextStyles.heroTitleLarge(Colors.white)),
                  const SizedBox(height: 24),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SearchBox(controller: _searchController),
                      const SizedBox(height: 16),
                      _buildSuggestionButtons(),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
        Positioned(right: 0, bottom: 20, child: _buildGradientTitle()),
      ],
    );
  }

  Widget _buildSuggestionButtons() {
    final suggestions = const ['logo', 'graphic design', '3D Render', 'illustration', 'branding'];
    final screenWidth = MediaQuery.of(context).size.width;
    final isDesktop = screenWidth >= AppConstants.tabletBreakpoint;
    final isTablet = screenWidth >= AppConstants.mobileBreakpoint && screenWidth < AppConstants.tabletBreakpoint;

    // Responsive font sizing
    double fontSize;
    if (isDesktop) {
      fontSize = 16.0; // Desktop: 16px (current)
    } else if (isTablet) {
      fontSize = 14.0; // Tablet: 14px
    } else {
      fontSize = 12.0; // Mobile: 12px
    }

    if (isDesktop) {
      return Row(
        children: [
          ...suggestions.map((s) => Padding(
            padding: const EdgeInsets.only(right: 12),
            child: SuggestionChip(
              label: s,
              onTap: () => _searchController.text = s,
              fontSize: fontSize,
            )
          ))
        ],
      );
    }

    // For mobile and tablet, use Wrap with intrinsic width constraints
    return Align(
      alignment: Alignment.centerLeft,
      child: Wrap(
        spacing: 12,
        runSpacing: 8,
        alignment: WrapAlignment.start,
        children: suggestions.map((s) => IntrinsicWidth(
          child: SuggestionChip(
            label: s,
            onTap: () => _searchController.text = s,
            fontSize: fontSize,
          ),
        )).toList(),
      ),
    );
  }

  Widget _buildWelcomeText() {
    return ShaderMask(
      shaderCallback: (bounds) => const LinearGradient(
        colors: [Colors.white, AppConstants.primaryPurple],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ).createShader(bounds),
      child: Text('Welcome, User!', style: AppTextStyles.sectionHeader(Colors.white)),
    );
  }

  Widget _buildGradientTitle() {
    return RichText(
      textAlign: TextAlign.right,
      text: TextSpan(children: [
        TextSpan(text: 'A Marketplace Where Creative\n', style: AppTextStyles.sectionHeader(Colors.grey).copyWith(height: 1.2)),
        TextSpan(text: 'Dreams Take Shape.', style: AppTextStyles.sectionHeader(const Color(0xFF4CAF50)).copyWith(height: 1.2)),
      ]),
    );
  }
}

