import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';

/// A reusable search box with gradient styling.
/// Dimensions: 875px x 48px for desktop, responsive on smaller screens.
class SearchBox extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;

  const SearchBox({super.key, required this.controller, this.hintText = AppConstants.searchHint});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: AppConstants.searchBoxWidth,
      height: AppConstants.searchBoxHeight,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.white, Color(0xFF404040)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(25),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.search, color: Color(0xFF555555), size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: controller,
              style: AppTextStyles.bodyM(const Color(0xFF222222)),
              decoration: InputDecoration(
                hintText: hintText,
                hintStyle: AppTextStyles.bodyM(const Color(0xFF777777)),
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

