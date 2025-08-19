# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Asiatensor Executive Brief** - A world-class interactive investment memorandum platform presenting a comprehensive Bittensor (TAO) investment opportunity in Asian markets. The platform features advanced multilingual support, responsive design, and institutional-grade presentation quality.

**Last Major Update**: August 2025 - Complete overhaul with full investment memorandum content, mobile optimization, and enhanced language switching.

## Development Commands

```bash
# Start development server
npm run dev
# Serves the site on http://localhost:3000 using Python's built-in server

# Build command (no-op for static site)
npm run build
# Outputs a message indicating no build is required
```

## Project Architecture

### Frontend Stack
- **Core**: Static HTML5/CSS3/JavaScript (ES6+)
- **Styling**: TailwindCSS (via CDN) with extensive custom configurations
- **Icons**: SVG-based with gradient styling and responsive behavior
- **Fonts**: Inter (sans-serif), Source Serif Pro (serif), JetBrains Mono (monospace)

### Language System
- **Supported Languages**: English (en), Simplified Chinese (zh-cn), Traditional Chinese (zh-hk), Japanese (ja), Korean (ko)
- **Architecture**: Async JSON-based language loading with caching
- **Storage**: Language preference persists in localStorage
- **Fallbacks**: Comprehensive fallback system for missing translations

### Mobile-First Design
- **Responsive Breakpoints**: Mobile (default), Tablet (md:), Desktop (lg:+)
- **Mobile Navigation**: Hamburger menu with full-screen overlay
- **Touch Optimization**: Large touch targets, swipe-friendly interactions
- **Performance**: Optimized for mobile bandwidth and rendering

## Key Files and Architecture

### Core Application Files
- **`index.html`** - Main presentation page with complete 7-chapter memorandum structure
- **`assets/script.js`** - Advanced JavaScript application with class-based architecture
- **`assets/logo-at.svg`** - Greek letters ατ (alpha tau) logo with gradient styling
- **`package.json`** - Development server configuration

### JavaScript Architecture
```
AsiatensorApp (Main Application)
├── LanguageLoader (Async i18n with caching)
├── ScrollspyManager (Advanced navigation with 30% trigger point)
├── PictureInPictureModal (TradingView chart integration)
├── ThemeManager (Dark/Light mode with dual icon support)
├── MobileMenuManager (Hamburger menu with smooth animations)
├── CollapsibleManager (Content expansion system)
└── PrintManager (PDF export functionality)
```

### Language Files Structure
```
assets/locales/
├── en.json (English - Base language)
├── zh-cn.json (Simplified Chinese)
├── zh-hk.json (Traditional Chinese)
├── ja.json (Japanese)
└── ko.json (Korean)
```

### Content Architecture
```
content/
├── memorandum_en.md (Complete English investment memorandum)
├── memorandum_zh-cn.md (Complete Chinese investment memorandum)
├── memorandum_ja.md (Complete Japanese investment memorandum)
├── memorandum_ko.md (Complete Korean investment memorandum)
├── memorandum_zh-hk.md (Complete Traditional Chinese memorandum)
└── datco_report_zh-cn.md (DATCO analysis report)
```

## Advanced Features

### Internationalization System
- **Async Loading**: JSON files loaded on-demand with caching
- **Nested Object Support**: Deep object traversal for complex content structures
- **Fallback Chain**: EN → Cached → Hardcoded fallbacks
- **Dual UI Updates**: Desktop and mobile interface synchronization
- **Error Handling**: Graceful degradation with comprehensive error logging

### Navigation System
- **Desktop**: Floating scrollspy navigation with smooth scrolling
- **Mobile**: Hamburger menu with quick navigation and language switching
- **Active State Management**: Real-time section highlighting with 30% viewport trigger
- **Performance**: Throttled scroll events (50ms) for smooth performance

### Theme System
- **Dual Mode**: Light and dark theme with system preference detection
- **Synchronized Icons**: Desktop and mobile theme icons update simultaneously  
- **CSS Variables**: Extensive use of Tailwind dark mode classes
- **Pure Black**: Dark theme uses #000000 for optimal contrast

### Print Functionality
- **Content Expansion**: Automatically expands all collapsible sections
- **Media Queries**: Optimized @media print styles with professional layout
- **Theme Override**: Forces light theme for print compatibility
- **Typography**: Professional print typography with proper sizing

## Content Management

### Investment Memorandum Structure
1. **Executive Summary** - Key metrics in bento box layout
2. **Chapter 1** - The Great Disconnect (Market opportunity)
3. **Chapter 2** - Dual-Engine Profit Model (Business strategy)  
4. **Chapter 3** - TAO Production & Revenue Model (Financial projections)
5. **Chapter 4** - Execution Team & Strategic Advantages (Team & execution)

### Language Content Updates
1. Edit JSON files in `assets/locales/[language].json`
2. Follow the established nested object structure
3. Test language switching in both desktop and mobile views
4. Update corresponding markdown files in `content/` directory

### Visual Design System
- **Color Palette**: Blue-cyan-purple gradients with professional contrast ratios
- **Typography**: Hierarchical font sizing with serif headings, sans-serif body
- **Spacing**: Consistent 4px grid system throughout
- **Animations**: Smooth transitions with cubic-bezier easing
- **Hover Effects**: Subtle transformations with glow effects

## Development Workflow

### Local Development
1. `npm run dev` to start Python HTTP server
2. Open browser to `http://localhost:[port]` (port varies)
3. Use browser dev tools for responsive testing
4. Test language switching across all supported languages
5. Verify scrollspy navigation and mobile menu functionality

### Testing Checklist
- [ ] All 5 languages switch correctly
- [ ] Mobile hamburger menu functions properly
- [ ] Scrollspy highlights current section
- [ ] Print functionality expands all content
- [ ] Dark/light theme works on both desktop and mobile
- [ ] Bento box hover effects work smoothly
- [ ] All collapsible sections expand/collapse correctly

### Performance Optimizations
- **Lazy Loading**: Language files loaded only when needed
- **Caching**: Language data cached in memory after first load
- **Throttling**: Scroll events throttled to prevent performance issues
- **CSS Optimization**: Minimal custom CSS, leveraging Tailwind utilities
- **Image Optimization**: SVG icons with optimal compression

## Technical Debt and Future Improvements

### Completed Improvements (August 2025)
- ✅ Complete language switching system overhaul
- ✅ Mobile hamburger menu implementation
- ✅ Greek letters (ατ) logo redesign
- ✅ Full 7-chapter memorandum content structure
- ✅ Enhanced scrollspy navigation with improved triggering
- ✅ Comprehensive markdown documentation for all languages

### Potential Future Enhancements
- [ ] TradingView stock chart integration in modals
- [ ] Advanced print layout with page breaks
- [ ] Lazy loading for below-the-fold content
- [ ] Service worker for offline functionality
- [ ] Enhanced analytics integration
- [ ] Automated translation updates via API

## Deployment Configuration

Currently optimized for static hosting with:
- Pure client-side rendering
- No server-side dependencies
- Optimal for CDN deployment
- Compatible with Vercel, Netlify, GitHub Pages
- No build process required - direct file serving

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: ES6+ modules, CSS Grid, Flexbox, CSS Variables
- **Polyfills**: None required for target browser support

---

*This documentation reflects the complete August 2025 overhaul. The project is now production-ready for institutional investor presentations.*