import 'package:flutter/material.dart';
import '../config/app_constants.dart';

/// Standardized card component matching landing page design patterns.
class AppCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double borderRadius;
  final EdgeInsets? padding;
  final bool enableHover;
  final Color? backgroundColor;
  final Color? hoverBackgroundColor;
  final Border? border;
  final List<BoxShadow>? boxShadow;

  const AppCard({
    super.key,
    required this.child,
    this.onTap,
    this.borderRadius = 16.0, // Match landing page rounded-2xl
    this.padding,
    this.enableHover = true,
    this.backgroundColor,
    this.hoverBackgroundColor,
    this.border,
    this.boxShadow,
  });

  @override
  State<AppCard> createState() => _AppCardState();
}

class _AppCardState extends State<AppCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

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
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onHover(bool isHovered) {
    if (!widget.enableHover) return;
    
    setState(() {
      _isHovered = isHovered;
    });
    if (isHovered) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final backgroundColor = widget.backgroundColor ?? AppConstants.cardBackground;
    final hoverBackgroundColor = widget.hoverBackgroundColor ?? AppConstants.cardHover;
    final border = widget.border ?? Border.all(
      color: AppConstants.cardBorder,
      width: 1,
    );

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: widget.enableHover ? _scaleAnimation.value : 1.0,
          child: MouseRegion(
            onEnter: (_) => _onHover(true),
            onExit: (_) => _onHover(false),
            cursor: widget.onTap != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 500),
              curve: Curves.easeOut,
              decoration: BoxDecoration(
                color: _isHovered ? hoverBackgroundColor : backgroundColor,
                borderRadius: BorderRadius.circular(widget.borderRadius),
                border: border,
                boxShadow: widget.boxShadow ?? [
                  if (_isHovered)
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    )
                  else
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: widget.onTap,
                  borderRadius: BorderRadius.circular(widget.borderRadius),
                  child: Padding(
                    padding: widget.padding ?? const EdgeInsets.all(16),
                    child: widget.child,
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// Factory constructors for common card types
extension AppCardFactory on AppCard {
  /// Creates a card matching landing page service cards
  static AppCard service({
    required Widget child,
    VoidCallback? onTap,
  }) {
    return AppCard(
      onTap: onTap,
      backgroundColor: AppConstants.cardBackground,
      hoverBackgroundColor: AppConstants.primaryPurple.withValues(alpha: 0.1),
      border: Border.all(
        color: AppConstants.cardBorder,
        width: 1,
      ),
      child: child,
    );
  }

  /// Creates a card matching landing page category cards
  static AppCard category({
    required Widget child,
    VoidCallback? onTap,
  }) {
    return AppCard(
      onTap: onTap,
      backgroundColor: AppConstants.cardBackground,
      hoverBackgroundColor: AppConstants.primaryPurple.withValues(alpha: 0.1),
      border: Border.all(
        color: AppConstants.cardBorder,
        width: 1,
      ),
      child: child,
    );
  }

  /// Creates a card matching landing page artist cards
  static AppCard artist({
    required Widget child,
    VoidCallback? onTap,
  }) {
    return AppCard(
      onTap: onTap,
      backgroundColor: AppConstants.cardBackground,
      hoverBackgroundColor: AppConstants.cardHover,
      border: Border.all(
        color: AppConstants.cardBorder,
        width: 1,
      ),
      child: child,
    );
  }
}
