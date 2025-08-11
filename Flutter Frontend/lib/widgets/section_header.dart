import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_styles.dart';

/// Reusable section header with title and trailing "See all" button.
class SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onSeeAll;
  final Key? titleKey;

  const SectionHeader({super.key, required this.title, this.onSeeAll, this.titleKey});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            title,
            key: titleKey,
            style: AppTextStyles.sectionHeader(Colors.white),
            textAlign: TextAlign.left,
          ),
        ),
        if (onSeeAll != null)
          TextButton(
            onPressed: onSeeAll,
            child: Text(
              AppConstants.seeAll,
              style: AppTextStyles.bodyM(AppConstants.primaryPurple),
            ),
          ),
      ],
    );
  }
}

