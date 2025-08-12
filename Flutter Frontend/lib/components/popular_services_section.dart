import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:convert';
import '../widgets/section_header.dart';
import '../widgets/hover_overlay.dart';

/// Grid of popular services with hover overlays loaded from API.
class PopularServicesSection extends StatefulWidget {
  const PopularServicesSection({super.key});

  @override
  State<PopularServicesSection> createState() => _PopularServicesSectionState();
}class _PopularServicesSectionState extends State<PopularServicesSection> {
  List<Map<String, dynamic>> _posts = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      // Get API base URL from environment (already loaded in main)
      final baseUrl = dotenv.env['API_BASE_URL'] ?? 'http://localhost:3000';
      final uri = Uri.parse('$baseUrl/api/availability-posts/');
      
      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        List<Map<String, dynamic>> posts = [];
        
        if (data is List) {
          posts = List<Map<String, dynamic>>.from(data);
        } else if (data is Map && data.containsKey('posts')) {
          posts = List<Map<String, dynamic>>.from(data['posts']);
        } else if (data is Map && data.containsKey('data')) {
          posts = List<Map<String, dynamic>>.from(data['data']);
        }

        // Filter posts that have photos FIRST, then take 8
        final validPosts = posts.where((post) {
          final photos = post['photos'];
          return photos != null && 
                 photos is List && 
                 photos.isNotEmpty && 
                 photos[0] is Map &&
                 photos[0]['url'] != null;
        }).take(8).toList(); // Take exactly 8 posts that have photos

        setState(() {
          _posts = validPosts;
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to load services. Please try again.';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Unable to connect to services. Please check your connection.';
        _isLoading = false;
      });
    }
  }

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
            if (_isLoading)
              const SizedBox(
                height: 200,
                child: Center(
                  child: CircularProgressIndicator(),
                ),
              )
            else if (_error != null)
              SizedBox(
                height: 200,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        color: Colors.red,
                        size: 48,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _error!,
                        style: const TextStyle(
                          color: Colors.red,
                          fontSize: 16,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadPosts,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              )
            else
              _buildServiceGrid(isMobile, isTablet),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceGrid(bool isMobile, bool isTablet) {
    return MasonryGridView.count(
      crossAxisCount: isMobile ? 2 : (isTablet ? 3 : 4),
      mainAxisSpacing: 24, // Increased spacing to match landing page gap-6
      crossAxisSpacing: 24,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _posts.length,
      itemBuilder: (context, index) {
        final post = _posts[index];
        
        // Extract photo URL from the first photo
        final photos = post['photos'] as List?;
        final photoUrl = photos?.isNotEmpty == true ? photos![0]['url'] as String? : null;
        
        // Extract category name
        String categoryName = 'Service';
        if (post['category'] != null && post['category'] is Map) {
          categoryName = post['category']['name'] ?? 'Service';
        } else if (post['category'] != null && post['category'] is String) {
          categoryName = post['category'] as String;
        } else if (post['categoryId'] != null) {
          categoryName = 'Category ${post['categoryId']}';
        }

        return ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Stack(
            children: [
              // Photo from API or fallback
              photoUrl != null
                  ? Image.network(
                      photoUrl,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: 200,
                      errorBuilder: (context, error, stackTrace) {
                        return _buildFallbackContainer(index);
                      },
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Container(
                          height: 200,
                          width: double.infinity,
                          color: Colors.grey[300],
                          child: Center(
                            child: CircularProgressIndicator(
                              value: loadingProgress.expectedTotalBytes != null
                                  ? loadingProgress.cumulativeBytesLoaded /
                                      loadingProgress.expectedTotalBytes!
                                  : null,
                            ),
                          ),
                        );
                      },
                    )
                  : _buildFallbackContainer(index),
              
              // Gradient overlay for better text visibility on photos
              if (photoUrl != null)
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
              
              // Hover overlay with category name
              Positioned.fill(
                child: HoverOverlay(
                  label: categoryName,
                  borderRadius: 12,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFallbackContainer(int index) {
    final fallbackColors = [
      const Color(0xFF9C27B0), // Purple
      const Color(0xFF3F51B5), // Indigo
      const Color(0xFF00BCD4), // Cyan
      const Color(0xFF4CAF50), // Green
    ];
    
    return Container(
      height: 200,
      width: double.infinity,
      color: fallbackColors[index % fallbackColors.length],
      child: const Center(
        child: Icon(Icons.image, color: Colors.white, size: 40),
      ),
    );
  }
}

