# 10 Minute Timer

A beautiful, responsive online countdown timer web application built with React, TypeScript, and Tailwind CSS.

## Features

### Core Timer Functionality
- **Multiple Timer Presets**: 1, 5, 10, 15, 20, and 30-minute options
- **Custom Time Setting**: Set any duration from 1 second to 24 hours
- **Visual Countdown**: Beautiful flip-card style display with smooth animations
- **Progress Indicators**: Circular and linear progress bars
- **Audio Alerts**: Sound notifications when timer completes

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme switcher for comfortable viewing
- **Task Management**: Add and track tasks with your timer sessions
- **Keyboard Shortcuts**: Space bar to start/stop, Enter to reset
- **Visual Effects**: Smooth animations and transitions

### SEO & Analytics
- **Complete SEO Setup**: Meta tags, Open Graph, Twitter Cards
- **Google Analytics**: Integrated tracking (ID: G-95QM6WDW2G)
- **Microsoft Clarity**: User behavior analytics (ID: ta5905uow4)
- **Sitemap**: XML sitemap for search engine indexing
- **Structured Data**: Schema.org markup for rich snippets

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio**: Web Audio API
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Deployment**: Ready for Vercel/Netlify

## Installation & Development

```bash
# Clone the repository
git clone https://github.com/Candseven88/10-minute-timer.git

# Navigate to project directory
cd 10-minute-timer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Timer.tsx       # Main timer display
│   ├── Controls.tsx    # Play/pause/reset controls
│   ├── Settings.tsx    # Timer settings panel
│   ├── FlipCard.tsx    # Animated time display
│   ├── ProgressBars.tsx # Progress indicators
│   └── TaskManager.tsx # Task tracking
├── hooks/
│   └── useTimer.ts     # Custom timer hook
├── types/
│   └── timer.ts        # TypeScript definitions
├── utils/
│   └── audio.ts        # Audio utility functions
└── App.tsx             # Main application component
```

## Features in Detail

### Timer Presets
Quick access buttons for common timer durations:
- 1 minute: Perfect for quick breaks
- 5 minutes: Short focused sessions
- 10 minutes: Standard productivity timer
- 15 minutes: Extended focus periods
- 20 minutes: Deep work sessions
- 30 minutes: Long concentration blocks

### Custom Timer
- Set hours, minutes, and seconds individually
- Maximum duration: 23:59:59
- Minimum duration: 00:00:01
- Input validation and error handling

### Visual Design
- Modern, clean interface with subtle animations
- High contrast colors for accessibility
- Smooth transitions between states
- Responsive layout adapts to screen size

### Audio Features
- Multiple notification sounds
- Volume control
- Option to disable audio
- Browser permission handling

## Analytics & SEO

The application includes comprehensive analytics and SEO optimization:

### Google Analytics 4
- Page views tracking
- User engagement metrics
- Custom events for timer usage
- Conversion tracking for productivity goals

### Microsoft Clarity
- User session recordings
- Heatmaps of user interactions
- Funnel analysis
- Performance insights

### SEO Optimization
- Semantic HTML structure
- Meta descriptions and keywords
- Open Graph and Twitter Card tags
- XML sitemap with all timer variations
- Structured data for rich snippets
- Canonical URLs
- Robots.txt configuration

## Performance

- **Lighthouse Score**: 95+ for Performance, Accessibility, Best Practices, SEO
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Minimal dependencies for fast loading
- **Caching**: Service worker ready for offline functionality

## Browser Compatibility

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Deployment

The application is optimized for deployment on:
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting option
- **Any static hosting**: Build output in `dist/` folder

## Support

For issues, feature requests, or questions:
- Create an issue on GitHub
- Email: support@10-minute-timer.website

---

Built with ❤️ for productivity and focus. Perfect for Pomodoro technique, study sessions, meetings, debates, and any timed activities.
