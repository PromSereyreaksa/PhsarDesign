import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';
import '../components/navbar.dart';
import '../components/footer_section.dart';

/// Creative Jobs page matching the Browse Jobs design
class CreativeJobsPage extends StatefulWidget {
  const CreativeJobsPage({super.key});

  @override
  State<CreativeJobsPage> createState() => _CreativeJobsPageState();
}

class _CreativeJobsPageState extends State<CreativeJobsPage> {
  String _selectedCategory = 'All';
  
  final List<String> _categories = [
    'All',
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

  final List<Map<String, dynamic>> _jobs = [
    {
      'title': 'We need a banner',
      'client': 'John',
      'budget': '\$25-\$50',
      'deadline': 'Deadline: 1 August 2025',
      'category': 'Graphic Design',
      'color': const Color(0xFF8B5CF6),
    },
    {
      'title': 'We need a banner',
      'client': 'Sarah',
      'budget': '\$75-\$150',
      'deadline': 'Deadline: 5 August 2025',
      'category': 'Logo Design',
      'color': const Color(0xFF06B6D4),
    },
    {
      'title': 'We need a banner',
      'client': 'Mike',
      'budget': '\$100-\$200',
      'deadline': 'Deadline: 10 August 2025',
      'category': 'Illustration',
      'color': const Color(0xFFEF4444),
    },
    {
      'title': 'We need a banner',
      'client': 'Emma',
      'budget': '\$50-\$100',
      'deadline': 'Deadline: 3 August 2025',
      'category': 'UI/UX Design',
      'color': const Color(0xFF10B981),
    },
    {
      'title': 'We need a banner',
      'client': 'Alex',
      'budget': '\$200-\$400',
      'deadline': 'Deadline: 15 August 2025',
      'category': '3D Modeling',
      'color': const Color(0xFFF59E0B),
    },
    {
      'title': 'We need a banner',
      'client': 'Lisa',
      'budget': '\$30-\$80',
      'deadline': 'Deadline: 7 August 2025',
      'category': 'Photography',
      'color': const Color(0xFFEC4899),
    },
  ];

  List<Map<String, dynamic>> get _filteredJobs {
    if (_selectedCategory == 'All') return _jobs;
    return _jobs.where((job) => job['category'] == _selectedCategory).toList();
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
                    _buildHeroSection(isMobile),
                    _buildFilterSection(isMobile),
                    _buildJobsGrid(isMobile, screenWidth),
                    _buildLogoSection(isMobile),
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

  Widget _buildHeroSection(bool isMobile) {
    return Container(
      width: double.infinity,
      height: 200,
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('image/hero section background.png'),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.black.withValues(alpha: 0.3),
              Colors.black.withValues(alpha: 0.7),
            ],
          ),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 20 : 40,
            vertical: 40,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'BROWSE JOBS',
                style: AppTextStyles.heroTitle(Colors.white).copyWith(
                  fontSize: isMobile ? 32 : 48,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Find the perfect creative job for your skills',
                style: AppTextStyles.bodyLarge(Colors.white70).copyWith(
                  fontSize: isMobile ? 16 : 18,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterSection(bool isMobile) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(isMobile ? 16 : 24),
      child: Row(
        children: [
          Icon(
            Icons.filter_alt,
            color: Colors.white,
            size: 20,
          ),
          const SizedBox(width: 8),
          Text(
            'Filter',
            style: AppTextStyles.bodyM(Colors.white),
          ),
          const SizedBox(width: 24),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _categories.map((category) {
                  final isSelected = category == _selectedCategory;
                  return Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedCategory = category;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: isSelected 
                              ? AppConstants.primaryPurple
                              : const Color(0xFF2A2A2A),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected
                                ? AppConstants.primaryPurple
                                : Colors.white.withValues(alpha: 0.2),
                          ),
                        ),
                        child: Text(
                          category,
                          style: AppTextStyles.bodyS(
                            isSelected ? Colors.white : Colors.white70,
                          ).copyWith(
                            fontWeight: isSelected 
                                ? FontWeight.w600 
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJobsGrid(bool isMobile, double screenWidth) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 40,
        vertical: 24,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Creative Jobs',
            style: AppTextStyles.sectionHeader(Colors.white).copyWith(
              fontSize: 24,
            ),
          ),
          const SizedBox(height: 24),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: isMobile ? 1 : (screenWidth < 1200 ? 2 : 3),
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: isMobile ? 1.4 : 1.1,
            ),
            itemCount: _filteredJobs.length,
            itemBuilder: (context, index) {
              return _buildJobCard(_filteredJobs[index]);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildJobCard(Map<String, dynamic> job) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F1F),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.1),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with gradient background
          Container(
            width: double.infinity,
            height: 80,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  job['color'] as Color,
                  (job['color'] as Color).withValues(alpha: 0.7),
                ],
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.white.withValues(alpha: 0.2),
                    child: Text(
                      job['client'].toString().substring(0, 1).toUpperCase(),
                      style: AppTextStyles.bodyM(Colors.white).copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          job['client'],
                          style: AppTextStyles.bodyM(Colors.white).copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          job['category'],
                          style: AppTextStyles.bodyS(Colors.white.withValues(alpha: 0.8)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Content area
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    job['title'],
                    style: AppTextStyles.bodyM(Colors.white).copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  // Budget and deadline
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Budget',
                            style: AppTextStyles.caption(Colors.white60),
                          ),
                          Text(
                            job['budget'],
                            style: AppTextStyles.bodyS(Colors.white).copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        job['deadline'],
                        style: AppTextStyles.caption(Colors.white60),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Action buttons
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 36,
                          decoration: BoxDecoration(
                            color: const Color(0xFF2A2A2A),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.2),
                            ),
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () {},
                              borderRadius: BorderRadius.circular(8),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.keyboard_arrow_down,
                                    color: Colors.white70,
                                    size: 16,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Details',
                                    style: AppTextStyles.bodyS(Colors.white70),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: const Color(0xFF2A2A2A),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.2),
                          ),
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () {},
                            borderRadius: BorderRadius.circular(8),
                            child: const Icon(
                              Icons.favorite_border,
                              color: Colors.white70,
                              size: 16,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: const Color(0xFF2A2A2A),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.2),
                          ),
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () {},
                            borderRadius: BorderRadius.circular(8),
                            child: const Icon(
                              Icons.share_outlined,
                              color: Colors.white70,
                              size: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogoSection(bool isMobile) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 40,
        vertical: 40,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Logo',
                style: AppTextStyles.sectionHeader(Colors.white).copyWith(
                  fontSize: 24,
                ),
              ),
              Text(
                'See all',
                style: AppTextStyles.bodyM(AppConstants.primaryPurple).copyWith(
                  decoration: TextDecoration.underline,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Portfolio grid
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: isMobile ? 2 : 4,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.0,
            children: [
              _buildPortfolioItem('image/freelance1.png'),
              _buildPortfolioItem('image/freelance2.png'),
              _buildPortfolioItem('image/freelance3.png'),
              if (!isMobile) _buildPortfolioItem('image/freelance4.png'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPortfolioItem(String imagePath) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: const Color(0xFF2A2A2A),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.asset(
          imagePath,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Container(
              decoration: BoxDecoration(
                color: AppConstants.primaryPurple.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Icon(
                  Icons.image,
                  color: Colors.white54,
                  size: 32,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}