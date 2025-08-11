import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';

/// A clickable suggestion chip with fixed 28px height and dynamic width.
class SuggestionChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final double? fontSize;

  const SuggestionChip({
    super.key,
    required this.label,
    required this.onTap,
    this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: AppConstants.suggestionChipHeight,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF404040), width: 0.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 1,
              offset: const Offset(0, 0.5),
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: AppTextStyles.bodyM(Colors.white).copyWith(
            fontWeight: FontWeight.w400,
            fontSize: fontSize,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}

