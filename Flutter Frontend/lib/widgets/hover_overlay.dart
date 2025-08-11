import 'package:flutter/material.dart';
import '../config/app_styles.dart';

/// Reusable hover overlay with blur and centered text - Updated to match landing page effects.
class HoverOverlay extends StatefulWidget {
  final String label;
  final double borderRadius;

  const HoverOverlay({super.key, required this.label, this.borderRadius = 16});

  @override
  State<HoverOverlay> createState() => _HoverOverlayState();
}

class _HoverOverlayState extends State<HoverOverlay>
    with SingleTickerProviderStateMixin {
  bool _isHovered = false;
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 500), // Match landing page duration
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.05, // Match landing page hover:scale-105
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOut, // Match landing page ease-out
    ));
    _opacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) {
        setState(() => _isHovered = true);
        _animationController.forward();
      },
      onExit: (_) {
        setState(() => _isHovered = false);
        _animationController.reverse();
      },
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 500),
              curve: Curves.easeOut,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(widget.borderRadius),
                color: _isHovered
                    ? Colors.black.withValues(alpha: 0.5) // Match landing page bg-black/50
                    : Colors.transparent,
              ),
              child: _isHovered
                  ? Opacity(
                      opacity: _opacityAnimation.value,
                      child: Center(
                        child: Text(
                          widget.label,
                          style: AppTextStyles.bodyM(Colors.white).copyWith(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    )
                  : null,
            ),
          );
        },
      ),
    );
  }
}

