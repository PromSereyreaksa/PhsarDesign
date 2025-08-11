import 'package:flutter/material.dart';
import '../widgets/section_header.dart';
import '../config/app_styles.dart';

/// Artist profiles grid with circular avatars and optional custom images.
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
          const SectionHeader(title: 'Artists You May Like'),
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
        childAspectRatio: isMobile ? 0.8 : 1.0,
      ),
      itemCount: artists.length,
      itemBuilder: (context, index) {
        return _buildArtistCard(artists[index], index: index, isMobile: isMobile);
      },
    );
  }

  Widget _buildArtistCard(Map<String, dynamic> artist, {required int index, required bool isMobile}) {
    final hasCustomImage = customImages != null && index < customImages!.length && customImages![index].isNotEmpty;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        CircleAvatar(
          radius: isMobile ? 50 : 70,
          backgroundColor: hasCustomImage ? Colors.transparent : artist['color'] as Color,
          backgroundImage: hasCustomImage
              ? (customImages![index].startsWith('http')
                  ? NetworkImage(customImages![index])
                  : AssetImage(customImages![index]) as ImageProvider)
              : null,
          child: hasCustomImage
              ? null
              : Icon(Icons.person, color: Colors.white, size: isMobile ? 40 : 50),
        ),
        SizedBox(height: isMobile ? 12 : 16),
        Text(artist['name'] as String, style: AppTextStyles.bodyM(Colors.white).copyWith(fontSize: isMobile ? 16 : 18, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center),
        const SizedBox(height: 6),
        Text(artist['role'] as String, style: AppTextStyles.bodyM(const Color(0xFF6B46C1)).copyWith(fontSize: isMobile ? 14 : 16, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text(artist['bio'] as String, style: AppTextStyles.caption(Colors.white70).copyWith(fontSize: isMobile ? 12 : 14, height: 1.3), maxLines: 2, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center),
      ],
    );
  }
}

