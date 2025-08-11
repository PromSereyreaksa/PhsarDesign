import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';

/// Explore CTA with hover scaling and arrow rotation.
class ExploreSection extends StatefulWidget {
  final bool isExpanded;
  final VoidCallback onToggle;

  const ExploreSection({super.key, required this.isExpanded, required this.onToggle});

  @override
  State<ExploreSection> createState() => _ExploreSectionState();
}

class _ExploreSectionState extends State<ExploreSection> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < AppConstants.mobileBreakpoint;

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 32),
      color: Colors.transparent,
      child: Center(
        child: MouseRegion(
          onEnter: (_) => setState(() => _isHovered = true),
          onExit: (_) => setState(() => _isHovered = false),
          child: InkWell(
            onTap: widget.onToggle,
            borderRadius: BorderRadius.circular(25),
            child: AnimatedScale(
              scale: _isHovered ? 1.0 : 0.8,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              child: Container(
                padding: const EdgeInsets.all(5),
                decoration: const BoxDecoration(),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Explore', style: AppTextStyles.titleL(Colors.white)),
                    const SizedBox(width: 8),
                    Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(color: AppConstants.primaryPurple, shape: BoxShape.circle),
                      child: AnimatedRotation(
                        turns: widget.isExpanded ? 0.5 : 0.0,
                        duration: const Duration(milliseconds: 300),
                        child: const Icon(Icons.keyboard_arrow_down, color: Colors.white, size: 20),
                      ),
                    )
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

