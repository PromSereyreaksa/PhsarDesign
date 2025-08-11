import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Shared text styles using Google Fonts Poppins - Updated to match landing page typography.
class AppTextStyles {
  // Hero and large titles (matches landing page text-5xl md:text-7xl)
  static TextStyle heroTitle(Color color) => GoogleFonts.poppins(
        fontSize: 48, // text-5xl equivalent
        fontWeight: FontWeight.bold,
        color: color,
        height: 1.1, // tight line height
      );

  // Large hero title for desktop (text-7xl equivalent)
  static TextStyle heroTitleLarge(Color color) => GoogleFonts.poppins(
        fontSize: 56, // text-7xl equivalent
        fontWeight: FontWeight.bold,
        color: color,
        height: 1.1,
      );

  // Section headers (matches landing page text-4xl)
  static TextStyle sectionHeader(Color color) => GoogleFonts.poppins(
        fontSize: 36, // text-4xl equivalent
        fontWeight: FontWeight.bold,
        color: color,
      );

  // Logo text (matches landing page text-3xl)
  static TextStyle logo(Color color) => GoogleFonts.poppins(
        fontSize: 24, // text-3xl equivalent
        fontWeight: FontWeight.bold,
        color: color,
      );

  // Large body text (matches landing page text-xl)
  static TextStyle bodyLarge(Color color) => GoogleFonts.poppins(
        fontSize: 20, // text-xl equivalent
        color: color,
        height: 1.5, // relaxed line height
      );

  // Regular body text (matches landing page text-base)
  static TextStyle bodyM(Color color) => GoogleFonts.poppins(
        fontSize: 16,
        color: color,
      );

  // Small body text (matches landing page text-sm)
  static TextStyle bodyS(Color color) => GoogleFonts.poppins(
        fontSize: 14,
        color: color,
      );

  // Caption text (matches landing page text-xs)
  static TextStyle caption(Color color) => GoogleFonts.poppins(
        fontSize: 12,
        color: color,
      );

  // Navigation text with medium weight
  static TextStyle navigation(Color color) => GoogleFonts.poppins(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: color,
      );

  // Button text
  static TextStyle button(Color color) => GoogleFonts.poppins(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: color,
      );

  // Legacy styles for backward compatibility
  static TextStyle titleXL(Color color) => sectionHeader(color);
  static TextStyle titleL(Color color) => logo(color);
}

