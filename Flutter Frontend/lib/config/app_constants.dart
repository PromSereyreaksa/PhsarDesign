import 'package:flutter/material.dart';

/// Global constants for layout, colors, strings, and dimensions used across the app.
class AppConstants {
  // Colors - Updated to match landing page
  static const Color gradientStart = Color(0xFF202020); // #202020 (30%)
  static const Color gradientMid = Color(0xFF1A1A1A); // #1a1a1a (via color)
  static const Color gradientEnd = Color(0xFF000000); // #000000 (100%)
  static const Color primaryPurple = Color(0xFFA95BAB); // #A95BAB - Updated to match landing page

  // Additional colors for consistency
  static const Color textPrimary = Color(0xFFFFFFFF); // White
  static const Color textSecondary = Color(0xFFD1D5DB); // gray-300
  static const Color textTertiary = Color(0xFF9CA3AF); // gray-400
  static const Color cardBackground = Color(0x0DFFFFFF); // white/5
  static const Color cardBorder = Color(0x1AFFFFFF); // white/10
  static const Color cardHover = Color(0x1AFFFFFF); // white/10

  // Layout
  static const double navbarHeight = 80.0;
  static const double navbarOpacity = 0.98; // For 98% opaque navbar background

  // Breakpoints
  static const double mobileBreakpoint = 768;
  static const double tabletBreakpoint = 1024;

  // Search box
  static const double searchBoxWidth = 875.0;
  static const double searchBoxHeight = 48.0;

  // Suggestion chip
  static const double suggestionChipHeight = 28.0;

  // Hero
  static const Size heroBackgroundDesignSize = Size(1828, 564); // reference

  // Strings
  static const String appTitle = 'PhsarDesign';
  static const String searchHint = 'What type of service are you looking for?';
  static const String newsletterTitle = 'Our Newsletter';
  static const String subscribeCta = 'Subscribe';
  static const String seeAll = 'See all';
}

