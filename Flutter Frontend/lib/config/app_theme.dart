import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_constants.dart';

/// Centralized Theme configuration including color scheme and gradients.
class AppTheme {
  static ThemeData darkTheme() {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: AppConstants.primaryPurple,
      scaffoldBackgroundColor: AppConstants.gradientStart,
      colorScheme: const ColorScheme.dark(
        primary: AppConstants.primaryPurple,
        secondary: AppConstants.primaryPurple,
        surface: AppConstants.gradientStart,
      ),
      textTheme: GoogleFonts.poppinsTextTheme(
        ThemeData.dark().textTheme,
      ),
    );
  }

  static const LinearGradient pageGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    stops: [0.3, 1.0],
    colors: [
      AppConstants.gradientStart,
      AppConstants.gradientEnd,
    ],
  );
}

