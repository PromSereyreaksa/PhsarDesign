import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../widgets/section_header.dart';
import '../widgets/hover_overlay.dart';

/// Masonry grid of freelancing opportunities with optional custom images.
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
          SectionHeader(title: 'Freelancing Opportunities', titleKey: titleKey),
          const SizedBox(height: 24),
          _buildMasonryGrid(isMobile),
        ],
      ),
    );
  }

  Widget _buildMasonryGrid(bool isMobile) {
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

