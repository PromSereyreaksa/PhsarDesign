# PhsarDesign - Responsive Landing Page

A fully responsive Flutter web application for the PhsarDesign platform, featuring a dark theme inspired by Spotify's design language and Pinterest's cross-platform adaptability.

## 🎨 Design Features

### **Navigation Bar**
- **Fixed Position**: Sticky navbar that remains visible during scroll
- **Three-Section Layout**: Left (hamburger + logo), Center (navigation), Right (notifications + profile)
- **Mobile-First**: Hamburger menu on far left, followed by PhsarDesign logo
- **ChatGPT-Style Sidebar**: Slide-in navigation for mobile/tablet with backdrop overlay
- **Responsive Typography**: Logo text never truncates, scales appropriately

### **Hero Section**
- **Full Viewport Width**: Utilizes complete screen width across all platforms
- **Custom Background Support**: Easy background image replacement with purple overlay
- **Responsive Typography**:
  - H1: 84px (desktop), 48px (tablet), 36px (mobile)
  - Body: 20px (desktop), 18px (tablet), 18px (mobile)
- **Interactive Search**: Gradient search box with suggestion chips
- **Compact Suggestions**: Small, clickable chips that autofill search input

### **Content Sections**
- **Pinterest-Style Masonry Grid**: Freelancing opportunities with varied heights
- **Responsive Service Cards**: Popular services with image overlay support
- **Artist Profile Grid**: Team member showcase with profile pictures
- **Image Customization**: All sections support custom image uploads

## 🛠️ Technical Implementation

### **Responsive Breakpoints**
- **Mobile**: < 768px (2 columns)
- **Tablet**: 768px - 1024px (3 columns)
- **Desktop**: > 1024px (4-5 columns)

### **Typography Scale (Poppins Font)**
- **H1**: 84px → 48px → 36px
- **H2**: 52px → 42px → 32px
- **H3**: 32px → 28px → 24px
- **Body**: 20px → 18px → 16px
- **Caption**: 12px (all platforms)

### **Color Scheme (Spotify-Inspired)**
- **Primary**: #9C27B0 (Purple)
- **Background**: #121212 (Dark)
- **Surface**: #1E1E1E (Card backgrounds)
- **Secondary**: #2A2A2A (Elevated surfaces)

## 🖼️ Image Customization

### **How to Add Custom Images**

1. **Hero Section Background**
```dart
const HeroSection(
  backgroundImageUrl: 'https://your-domain.com/hero-background.jpg',
),
```

2. **Freelancing Opportunities (Team Photos)**
```dart
const FreelancingOpportunitiesSection(
  customImages: [
    'https://your-domain.com/team-photo1.jpg',
    'https://your-domain.com/team-photo2.jpg',
    'https://your-domain.com/team-photo3.jpg',
    'https://your-domain.com/team-photo4.jpg',
    'https://your-domain.com/team-photo5.jpg',
    'https://your-domain.com/team-photo6.jpg',
  ],
),
```

3. **Popular Services (Custom Service Images)**
```dart
const PopularServicesSection(
  customImages: [
    'https://your-domain.com/service-design.jpg',
    'https://your-domain.com/service-development.jpg',
    'https://your-domain.com/service-branding.jpg',
    'https://your-domain.com/service-marketing.jpg',
  ],
),
```

4. **Artists Section (Team Member Profile Pictures)**
```dart
const ArtistYouMayLikeSection(
  customImages: [
    'https://your-domain.com/team-member1.jpg',
    'https://your-domain.com/team-member2.jpg',
    'https://your-domain.com/team-member3.jpg',
    'https://your-domain.com/team-member4.jpg',
    'https://your-domain.com/team-member5.jpg',
  ],
),
```

### **Image Requirements**
- **Format**: JPG, PNG, WebP
- **Size**: Optimized for web (< 1MB recommended)
- **Aspect Ratios**:
  - Hero: 16:9 or wider
  - Team Photos: Various (masonry grid)
  - Services: 4:3 or 16:9
  - Profiles: 1:1 (square)

## 🚀 Getting Started

### **Prerequisites**
- Flutter SDK (latest stable)
- Chrome browser for web development
- Internet connection for Google Fonts

### **Installation**
1. Clone the repository
2. Run `flutter pub get`
3. Launch with `flutter run -d chrome`

### **Dependencies**
- `google_fonts`: Poppins font family
- `flutter_staggered_grid_view`: Masonry grid layout

## 📱 Platform Support

- **Web**: Chrome, Safari, Firefox, Edge
- **iOS**: iPhone, iPad (responsive design)
- **Android**: Phone, Tablet (responsive design)
- **Desktop**: macOS, Windows, Linux (via web)

## 🎯 Key Features

### **Interaction Patterns**
- **Smooth Scrolling**: Optimized scroll behavior
- **Hover Effects**: Subtle animations on desktop
- **Touch Targets**: Proper sizing for mobile
- **Loading States**: Graceful image loading
- **Error Handling**: Fallback to colored placeholders

### **Accessibility**
- **Semantic HTML**: Proper heading hierarchy
- **Color Contrast**: WCAG compliant ratios
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Accessible labels and descriptions

### **Performance**
- **Lazy Loading**: Images load as needed
- **Optimized Assets**: Compressed images and fonts
- **Efficient Rendering**: Minimal widget rebuilds
- **Fast Navigation**: Instant route transitions

## 🔧 Customization

### **Theme Modifications**
Edit the `ThemeData` in `main.dart` to customize:
- Primary colors
- Typography scales
- Component styling
- Animation durations

### **Layout Adjustments**
Modify breakpoints and grid configurations in individual section components.

### **Content Updates**
Update text content, artist information, and service descriptions directly in the component files.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across all breakpoints
5. Submit a pull request

---

**Built with Flutter 💙 | Designed for PhsarDesign 🎨**
