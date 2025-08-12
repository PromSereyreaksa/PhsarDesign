import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';
import '../components/navbar.dart';
import '../components/footer_section.dart';
import '../widgets/app_card.dart';
import '../widgets/search_box.dart';

/// Creative Services page where clients can find talented artists
class CreativeServicesPage extends StatefulWidget {
  const CreativeServicesPage({super.key});

  @override
  State<CreativeServicesPage> createState() => _CreativeServicesPageState();
}

class _CreativeServicesPageState extends State<CreativeServicesPage> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All Categories';
  String _selectedExperience = 'All Levels';

  final List<String> _categories = [
    'All Categories',
    'Logo Design',
    'Graphic Design',
    'Illustration',
    'UI/UX Design',
    '3D Modeling',
    'Photography',
    'Branding',
    'Web Design',
    'Motion Graphics'
  ];

  final List<String> _experienceLevels = [
    'All Levels',
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior Level (5+ years)',
    'Expert Level (10+ years)'
  ];

  final List<Map<String, dynamic>> _services = [
    {
      'title': 'Professional Logo Design & Brand Identity',
      'description': 'I create memorable logos and complete brand identity packages that help businesses stand out. Specialized in minimalist, modern designs that work across all media.',
      'category': 'Logo Design',
      'artist': 'Alex Chen',
      'rating': 4.9,
      'reviews': 127,
      'startingPrice': 150,
      'deliveryTime': '3-5 days',
      'avatar': '',
      'portfolio': ['Portfolio piece 1', 'Portfolio piece 2', 'Portfolio piece 3'],
      'skills': ['Adobe Illustrator', 'Branding Strategy', 'Typography', 'Brand Guidelines'],
      'experience': 'Senior Level (5+ years)',
      'completedProjects': 230,
      'responseTime': '1 hour',
      'isTopRated': true,
    },
    {
      'title': 'Modern UI/UX Design for Web & Mobile',
      'description': 'Expert in creating user-centered designs that convert. I specialize in e-commerce platforms, SaaS applications, and mobile apps with focus on usability and aesthetics.',
      'category': 'UI/UX Design',
      'artist': 'Sarah Johnson',
      'rating': 4.8,
      'reviews': 89,
      'startingPrice': 300,
      'deliveryTime': '7-10 days',
      'avatar': '',
      'portfolio': ['UI Design 1', 'Mobile App Design', 'Dashboard Design'],
      'skills': ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
      'experience': 'Expert Level (10+ years)',
      'completedProjects': 156,
      'responseTime': '30 minutes',
      'isTopRated': true,
    },
    {
      'title': 'Fantasy & Sci-Fi Digital Illustrations',
      'description': 'Bringing your imagination to life through stunning digital artwork. Specialized in character design, book covers, game art, and concept illustrations.',
      'category': 'Illustration',
      'artist': 'Marcus Rivera',
      'rating': 4.7,
      'reviews': 73,
      'startingPrice': 200,
      'deliveryTime': '5-7 days',
      'avatar': '',
      'portfolio': ['Character Art', 'Book Cover', 'Concept Art'],
      'skills': ['Digital Painting', 'Character Design', 'Adobe Photoshop', 'Procreate'],
      'experience': 'Mid Level (3-5 years)',
      'completedProjects': 95,
      'responseTime': '2 hours',
      'isTopRated': false,
    },
    {
      'title': 'Photorealistic 3D Product Visualization',
      'description': 'High-end 3D modeling and rendering services for product marketing, architectural visualization, and industrial design. Studio-quality results guaranteed.',
      'category': '3D Modeling',
      'artist': 'Elena Kowalski',
      'rating': 4.9,
      'reviews': 112,
      'startingPrice': 400,
      'deliveryTime': '7-14 days',
      'avatar': '',
      'portfolio': ['Product Render 1', '3D Visualization', 'Architectural Render'],
      'skills': ['Blender', '3ds Max', 'V-Ray', 'KeyShot', 'Product Visualization'],
      'experience': 'Senior Level (5+ years)',
      'completedProjects': 178,
      'responseTime': '1 hour',
      'isTopRated': true,
    },
    {
      'title': 'Professional Portrait & Event Photography',
      'description': 'Capturing your special moments with artistic flair. Offering portrait sessions, event coverage, and commercial photography with quick turnaround.',
      'category': 'Photography',
      'artist': 'David Park',
      'rating': 4.6,
      'reviews': 201,
      'startingPrice': 250,
      'deliveryTime': '3-5 days',
      'avatar': '',
      'portfolio': ['Portrait 1', 'Event Photo', 'Commercial Shot'],
      'skills': ['Portrait Photography', 'Event Photography', 'Photo Editing', 'Lightroom'],
      'experience': 'Senior Level (5+ years)',
      'completedProjects': 312,
      'responseTime': '45 minutes',
      'isTopRated': true,
    },
    {
      'title': 'Creative Graphic Design Solutions',
      'description': 'From marketing materials to social media graphics, I deliver eye-catching designs that communicate your message effectively and drive engagement.',
      'category': 'Graphic Design',
      'artist': 'Lisa Thompson',
      'rating': 4.8,
      'reviews': 145,
      'startingPrice': 100,
      'deliveryTime': '2-4 days',
      'avatar': '',
      'portfolio': ['Poster Design', 'Social Media Pack', 'Brochure Design'],
      'skills': ['Adobe Creative Suite', 'Print Design', 'Social Media Graphics', 'Layout Design'],
      'experience': 'Mid Level (3-5 years)',
      'completedProjects': 267,
      'responseTime': '1.5 hours',
      'isTopRated': false,
    },
  ];

  List<Map<String, dynamic>> get _filteredServices {
    return _services.where((service) {
      bool categoryMatch = _selectedCategory == 'All Categories' || 
                          service['category'] == _selectedCategory;
      
      bool experienceMatch = _selectedExperience == 'All Levels' ||
                            service['experience'] == _selectedExperience;
      
      bool searchMatch = _searchController.text.isEmpty ||
                        service['title'].toString().toLowerCase().contains(_searchController.text.toLowerCase()) ||
                        service['description'].toString().toLowerCase().contains(_searchController.text.toLowerCase()) ||
                        service['artist'].toString().toLowerCase().contains(_searchController.text.toLowerCase());
      
      return categoryMatch && experienceMatch && searchMatch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < AppConstants.mobileBreakpoint;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppTheme.pageGradient),
        child: Column(
          children: [
            const TopNavbar(),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    _buildPageHeader(isMobile),
                    _buildFiltersSection(isMobile),
                    _buildServicesList(isMobile),
                    const FooterSection(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPageHeader(bool isMobile) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : 40,
        vertical: isMobile ? 32 : 64,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Find Creative Talents',
            style: AppTextStyles.heroTitle(Colors.white),
          ),
          const SizedBox(height: 16),
          Text(
            'Connect with skilled artists and designers ready to bring your vision to life',
            style: AppTextStyles.bodyLarge(Colors.white70),
          ),
          const SizedBox(height: 32),
          SearchBox(
            controller: _searchController,
            hintText: 'Search for services, artists, or skills...',
          ),
        ],
      ),
    );
  }

  Widget _buildFiltersSection(bool isMobile) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: isMobile ? 20 : 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: _buildFilterDropdown(
                  'Category',
                  _selectedCategory,
                  _categories,
                  (value) => setState(() => _selectedCategory = value!),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildFilterDropdown(
                  'Experience Level',
                  _selectedExperience,
                  _experienceLevels,
                  (value) => setState(() => _selectedExperience = value!),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${_filteredServices.length} services found',
                style: AppTextStyles.bodyM(Colors.white70),
              ),
              DropdownButton<String>(
                value: 'Top Rated',
                dropdownColor: const Color(0xFF2A2A2A),
                style: AppTextStyles.bodyM(Colors.white),
                underline: Container(),
                items: ['Top Rated', 'Price: Low to High', 'Price: High to Low', 'Fastest Delivery']
                    .map((String value) => DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        ))
                    .toList(),
                onChanged: (String? value) {
                  // Handle sorting
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterDropdown(
    String label,
    String value,
    List<String> items,
    ValueChanged<String?> onChanged,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          isExpanded: true,
          value: value,
          dropdownColor: const Color(0xFF2A2A2A),
          style: AppTextStyles.bodyM(Colors.white),
          items: items.map((String item) => DropdownMenuItem<String>(
                value: item,
                child: Text(item),
              )).toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }

  Widget _buildServicesList(bool isMobile) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : 40,
        vertical: 32,
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: isMobile ? 1 : (MediaQuery.of(context).size.width < 1200 ? 2 : 3),
          crossAxisSpacing: 24,
          mainAxisSpacing: 24,
          childAspectRatio: isMobile ? 1.2 : 0.8,
        ),
        itemCount: _filteredServices.length,
        itemBuilder: (context, index) {
          return _buildServiceCard(_filteredServices[index], isMobile);
        },
      ),
    );
  }

  Widget _buildServiceCard(Map<String, dynamic> service, bool isMobile) {
    return AppCard(
      onTap: () => _showServiceDetails(service),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: AppConstants.primaryPurple,
                child: Text(
                  service['artist'].toString().split(' ').map((e) => e[0]).join(),
                  style: AppTextStyles.bodyM(Colors.white).copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            service['artist'],
                            style: AppTextStyles.bodyM(Colors.white).copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        if (service['isTopRated'] == true) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.amber.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'TOP RATED',
                              style: AppTextStyles.caption(Colors.amber).copyWith(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    Row(
                      children: [
                        Icon(Icons.star, size: 14, color: Colors.amber),
                        const SizedBox(width: 4),
                        Text(
                          '${service['rating']} (${service['reviews']})',
                          style: AppTextStyles.caption(Colors.white70),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            service['title'],
            style: AppTextStyles.bodyM(Colors.white).copyWith(
              fontWeight: FontWeight.bold,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          Text(
            service['description'],
            style: AppTextStyles.bodyS(Colors.white70),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppConstants.primaryPurple.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: AppConstants.primaryPurple.withValues(alpha: 0.5)),
            ),
            child: Text(
              service['category'],
              style: AppTextStyles.caption(AppConstants.primaryPurple).copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const Spacer(),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Starting at',
                    style: AppTextStyles.caption(Colors.white70),
                  ),
                  Text(
                    '\$${service['startingPrice']}',
                    style: AppTextStyles.bodyM(Colors.white).copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'Delivery',
                    style: AppTextStyles.caption(Colors.white70),
                  ),
                  Text(
                    service['deliveryTime'],
                    style: AppTextStyles.bodyS(Colors.white),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showServiceDetails(Map<String, dynamic> service) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: const Color(0xFF2A2A2A),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Container(
            width: MediaQuery.of(context).size.width * 0.8,
            constraints: const BoxConstraints(maxWidth: 600),
            padding: const EdgeInsets.all(24),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          service['title'],
                          style: AppTextStyles.titleL(Colors.white),
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.of(context).pop(),
                        icon: const Icon(Icons.close, color: Colors.white70),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 32,
                        backgroundColor: AppConstants.primaryPurple,
                        child: Text(
                          service['artist'].toString().split(' ').map((e) => e[0]).join(),
                          style: AppTextStyles.bodyM(Colors.white).copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              service['artist'],
                              style: AppTextStyles.bodyM(Colors.white).copyWith(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Row(
                              children: [
                                Icon(Icons.star, size: 16, color: Colors.amber),
                                const SizedBox(width: 4),
                                Text(
                                  '${service['rating']} (${service['reviews']} reviews)',
                                  style: AppTextStyles.bodyS(Colors.white70),
                                ),
                              ],
                            ),
                            Text(
                              '${service['completedProjects']} projects completed',
                              style: AppTextStyles.bodyS(Colors.white70),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    service['description'],
                    style: AppTextStyles.bodyM(Colors.white70),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: _buildDetailItem('Starting Price', '\$${service['startingPrice']}'),
                      ),
                      Expanded(
                        child: _buildDetailItem('Delivery Time', service['deliveryTime']),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildDetailItem('Category', service['category']),
                      ),
                      Expanded(
                        child: _buildDetailItem('Experience', service['experience']),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Skills & Expertise',
                    style: AppTextStyles.bodyM(Colors.white).copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: (service['skills'] as List<String>)
                        .map((skill) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppConstants.primaryPurple.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppConstants.primaryPurple.withValues(alpha: 0.5)),
                              ),
                              child: Text(
                                skill,
                                style: AppTextStyles.bodyS(Colors.white),
                              ),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => Navigator.of(context).pop(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppConstants.primaryPurple,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            'Contact Artist',
                            style: AppTextStyles.button(Colors.white),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      OutlinedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.white.withValues(alpha: 0.3)),
                          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Text(
                          'View Portfolio',
                          style: AppTextStyles.button(Colors.white70),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildDetailItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTextStyles.bodyS(Colors.white70),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: AppTextStyles.bodyM(Colors.white).copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}