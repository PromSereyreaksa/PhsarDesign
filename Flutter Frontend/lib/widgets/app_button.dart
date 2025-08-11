import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';

/// Standardized button component matching landing page design patterns.
class AppButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final Widget? icon;
  final bool iconAfter;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.medium,
    this.icon,
    this.iconAfter = false,
  });

  @override
  State<AppButton> createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.05,
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

  void _onHover(bool isHovered) {
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
    final buttonStyle = _getButtonStyle();
    final textStyle = _getTextStyle();
    final padding = _getPadding();

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: MouseRegion(
            onEnter: (_) => _onHover(true),
            onExit: (_) => _onHover(false),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 500),
              curve: Curves.easeOut,
              decoration: BoxDecoration(
                color: _isHovered ? buttonStyle.hoverColor : buttonStyle.backgroundColor,
                border: buttonStyle.border,
                borderRadius: BorderRadius.circular(buttonStyle.borderRadius),
                boxShadow: _isHovered ? buttonStyle.hoverShadow : buttonStyle.shadow,
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: widget.onPressed,
                  borderRadius: BorderRadius.circular(buttonStyle.borderRadius),
                  child: Padding(
                    padding: padding,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (widget.icon != null && !widget.iconAfter) ...[
                          widget.icon!,
                          const SizedBox(width: 8),
                        ],
                        Text(
                          widget.text,
                          style: textStyle,
                        ),
                        if (widget.icon != null && widget.iconAfter) ...[
                          const SizedBox(width: 8),
                          widget.icon!,
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  _ButtonStyle _getButtonStyle() {
    switch (widget.variant) {
      case AppButtonVariant.primary:
        return _ButtonStyle(
          backgroundColor: AppConstants.primaryPurple,
          hoverColor: AppConstants.primaryPurple.withValues(alpha: 0.8),
          textColor: Colors.white,
          borderRadius: 8.0,
          border: null,
          shadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
          hoverShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        );
      case AppButtonVariant.secondary:
        return _ButtonStyle(
          backgroundColor: Colors.white,
          hoverColor: const Color(0xFFF3F4F6), // gray-100
          textColor: const Color(0xFF111827), // gray-900
          borderRadius: 8.0,
          border: Border.all(
            color: const Color(0x4DFFFFFF), // white/30
            width: 1,
          ),
          shadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
          hoverShadow: [
            BoxShadow(
              color: AppConstants.primaryPurple.withValues(alpha: 0.2),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        );
      case AppButtonVariant.ghost:
        return _ButtonStyle(
          backgroundColor: Colors.transparent,
          hoverColor: const Color(0x1AFFFFFF), // white/10
          textColor: Colors.white,
          borderRadius: 8.0,
          border: null,
          shadow: [],
          hoverShadow: [],
        );
    }
  }

  TextStyle _getTextStyle() {
    final buttonStyle = _getButtonStyle();
    Color textColor = _isHovered && widget.variant == AppButtonVariant.ghost
        ? AppConstants.primaryPurple
        : buttonStyle.textColor;

    switch (widget.size) {
      case AppButtonSize.small:
        return AppTextStyles.bodyS(textColor).copyWith(fontWeight: FontWeight.w600);
      case AppButtonSize.medium:
        return AppTextStyles.button(textColor);
      case AppButtonSize.large:
        return AppTextStyles.button(textColor).copyWith(fontSize: 18);
    }
  }

  EdgeInsets _getPadding() {
    switch (widget.size) {
      case AppButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 8);
      case AppButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 12);
      case AppButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 32, vertical: 16);
    }
  }
}

class _ButtonStyle {
  final Color backgroundColor;
  final Color hoverColor;
  final Color textColor;
  final double borderRadius;
  final Border? border;
  final List<BoxShadow> shadow;
  final List<BoxShadow> hoverShadow;

  _ButtonStyle({
    required this.backgroundColor,
    required this.hoverColor,
    required this.textColor,
    required this.borderRadius,
    this.border,
    required this.shadow,
    required this.hoverShadow,
  });
}

enum AppButtonVariant {
  primary,
  secondary,
  ghost,
}

enum AppButtonSize {
  small,
  medium,
  large,
}
