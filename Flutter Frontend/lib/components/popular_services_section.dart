import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../widgets/section_header.dart';
import '../widgets/hover_overlay.dart';

/// Grid of popular services with hover overlays and optional custom images.
class PopularServicesSection extends StatelessWidget {
  final List<String>? customImages;

  const PopularServicesSection({super.key, this.customImages});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;
    final isTablet = screenWidth >= 768 && screenWidth < 1024;

    return Container(
      // Match landing page section padding (py-20 = 80px vertical)
      padding: EdgeInsets.symmetric(
        vertical: 80,
        horizontal: isMobile ? 16 : (isTablet ? 24 : 32),
      ),
      child: ConstrainedBox(
        // Match landing page max-width container
        constraints: const BoxConstraints(maxWidth: 1280), // max-w-7xl equivalent
        child: Column(
          children: [
            const SectionHeader(title: 'Popular Services'),
            const SizedBox(height: 64), // Increased spacing like landing page
            _buildServiceGrid(isMobile, isTablet),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceGrid(bool isMobile, bool isTablet) {
    final artworks = [
      {'color': const Color(0xFF9C27B0), 'category': 'Web Design'},
      {'color': const Color(0xFF3F51B5), 'category': 'Mobile Apps'},
      {'color': const Color(0xFF00BCD4), 'category': 'UI/UX Design'},
      {'color': const Color(0xFF4CAF50), 'category': 'Digital Marketing'},
    ];

    return MasonryGridView.count(
      crossAxisCount: isMobile ? 2 : (isTablet ? 3 : 4),
      mainAxisSpacing: 24, // Increased spacing to match landing page gap-6
      crossAxisSpacing: 24,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: artworks.length,
      itemBuilder: (context, index) {
        final hasCustomImage = customImages != null && index < customImages!.length && customImages![index].isNotEmpty;
        final categoryName = artworks[index]['category'] as String;

        return ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Stack(
            children: [
              hasCustomImage
                  ? Image(
                      image: customImages![index].startsWith('http')
                          ? NetworkImage(customImages![index])
                          : AssetImage(customImages![index]) as ImageProvider,
                      fit: BoxFit.cover,
                      width: double.infinity,
                    )
                  : Container(
                      height: 200,
                      width: double.infinity,
                      color: artworks[index]['color'] as Color,
                      child: const Center(child: Icon(Icons.image, color: Colors.white, size: 40)),
                    ),
              if (hasCustomImage)
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black.withValues(alpha: 0.3)],
                      ),
                    ),
                  ),
                ),
              Positioned.fill(child: HoverOverlay(label: categoryName, borderRadius: 12)),
            ],
          ),
        );
      },
    );
  }
}

