# Advanced Countdown Timer

A beautiful, modern countdown timer application with stunning visual effects and comprehensive customization options.

## ✨ Features

### 🎯 Core Timer Functionality
- **Precise countdown display** with hours, minutes, and seconds
- **Smooth number transitions** with modern animation effects
- **Real-time adjustments** - add or subtract time during countdown
- **Keyboard controls** - Space to start/pause, arrow keys for time adjustment
- **Quick presets** - Ctrl+1-5 for common time intervals (5m, 10m, 15m, 25m, 30m)

### 🎨 Visual Customization
- **Background options**:
  - Solid colors with 6 beautiful presets
  - Gradient backgrounds with 6 stunning combinations
  - Custom image upload support
- **Logo management**:
  - Upload custom logo with drag-and-drop
  - 5 positioning options (corners and center)
  - Real-time preview
- **Typography settings**:
  - Customizable title and subtitle
  - Real-time text editing
  - Multiple font weights and styles

### 📊 Progress Visualization
- **Linear progress bar** with gradient fill
- **Percentage display** with decimal precision
- **Smooth animations** and transitions
- **Warning states** with pulsing effects

### 🔊 Audio & Visual Alerts
- **Sound notifications** for warnings and completion
- **Flash effects** for visual alerts
- **State-based coloring**:
  - Normal: White digits
  - Warning (< 1 min): Yellow with glow
  - Critical (< 10 sec): Red with flash
  - Completed: Green confirmation

### ⚙️ Settings & Preferences
- **Modern modal interface** with tabbed sections
- **Real-time preview** of all changes
- **Persistent storage** - settings saved automatically
- **Import/Export** configuration support
- **Reset to defaults** option

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in a modern web browser
2. Set your desired time using the +/- buttons
3. Click the play button or press Space to start
4. Customize appearance using the settings (gear icon)

### Time Setting Options
- **Precise timer setting**: Use the settings modal to set exact hours, minutes, and seconds
- **Manual adjustment**: Use +1m, +5m, -1m, -5m buttons during countdown
- **Keyboard shortcuts**: Arrow keys for quick adjustments
- **Quick presets**: Ctrl+1 (5m), Ctrl+2 (10m), Ctrl+3 (15m), Ctrl+4 (25m), Ctrl+5 (30m)

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause timer |
| `R` | Reset timer |
| `S` | Open settings |
| `Esc` | Close settings/modals |
| `↑` | Add 1 minute |
| `↓` | Subtract 1 minute |
| `→` | Add 5 minutes |
| `←` | Subtract 5 minutes |
| `Ctrl+1` | Set 5 minutes |
| `Ctrl+2` | Set 10 minutes |
| `Ctrl+3` | Set 15 minutes |
| `Ctrl+4` | Set 25 minutes (Pomodoro) |
| `Ctrl+5` | Set 30 minutes |

## 🎛️ Settings Guide

### Timer Configuration
1. **Precise Time Setting**: Set exact countdown time using hours, minutes, and seconds inputs
2. **Real-time Display**: See total time calculation as you adjust values
3. **Instant Application**: Click "Set Timer" to immediately apply new time

### Background Customization
1. **Solid Colors**: Choose from 6 carefully selected colors
2. **Gradients**: Pick from 6 beautiful gradient combinations
3. **Custom Images**: Upload your own background image

### Logo & Branding
1. Click "Upload Logo" to add your image
2. Select position from dropdown
3. Preview updates in real-time

### Audio & Effects
- Toggle sound notifications on/off
- Enable/disable flash effects
- Volume control for audio alerts

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Tailwind CSS
- **JavaScript ES6+** - Modular application architecture
- **LocalStorage API** - Persistent settings storage
- **FileReader API** - Image upload functionality
- **Web Audio API** - Dynamic sound generation

### Browser Support
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Performance Features
- **Optimized animations** using CSS transforms
- **Efficient DOM updates** with minimal reflows
- **Memory management** with cleanup on destroy
- **Responsive design** for all screen sizes

## 📱 Mobile Support

### Touch Gestures
- Tap to start/pause
- Swipe gestures for time adjustment
- Long press for quick presets

### Responsive Layout
- Optimized for phones, tablets, and desktops
- Touch-friendly button sizes
- Adaptive text scaling

## 🎯 Use Cases

### Productivity
- **Pomodoro Technique** - 25-minute focus sessions
- **Meeting timers** - Keep presentations on track
- **Break reminders** - Regular rest intervals

### Fitness & Wellness
- **Workout intervals** - HIIT and circuit training
- **Meditation sessions** - Mindfulness practice
- **Stretching routines** - Physical therapy

### Education & Training
- **Exam timing** - Practice tests and quizzes
- **Presentation practice** - Speech timing
- **Study sessions** - Focused learning blocks

### Events & Meetings
- **Conference talks** - Speaker time management
- **Workshop activities** - Timed exercises
- **Game tournaments** - Round timing

## 🔧 Development

### Project Structure
```
/
├── index.html              # Main application entry
├── css/
│   └── custom-styles.css   # Tailwind-based styling
├── js/
│   ├── app.js             # Main application controller
│   ├── timer.js           # Core timer functionality
│   ├── customization.js   # Settings and theming
│   └── notifications.js   # Audio and visual alerts
└── README.md              # This file
```

### Key Classes
- `CountdownApp` - Main application controller
- `Timer` - Core countdown logic and display
- `Customization` - Settings and visual theming
- `Notifications` - Audio/visual alert system

### Adding Features
The modular architecture makes it easy to extend:
1. Create new modules in `/js/`
2. Register with main app in `app.js`
3. Add UI elements to `index.html`
4. Style with Tailwind classes

## 🎨 Customization Examples

### Corporate Branding
1. Upload company logo
2. Set brand colors in background
3. Customize title with company name
4. Use for meeting management

### Personal Productivity
1. Set calming gradient background
2. Upload motivational image
3. Create personal mantras in subtitle
4. Use for focused work sessions

### Event Management
1. Upload event logo
2. Set theme colors
3. Add event tagline
4. Use for timed presentations

## 🚨 Troubleshooting

### Common Issues

**Timer not starting**
- Check if page has focus
- Ensure JavaScript is enabled
- Try refreshing the page

**Settings not saving**
- Check localStorage permissions
- Clear browser cache if needed
- Ensure sufficient storage space
- **FIXED**: Resolved recursive background application bug that could cause settings to fail
- **FIXED**: Added better error handling and debugging for save button issues

**Audio not playing**
- Check browser audio permissions
- Ensure volume is turned up
- Try different browser if issues persist

**Images not uploading**
- Check file size (max 5MB for backgrounds, 2MB for logos)
- Ensure file format is supported (PNG, JPG, GIF, WebP)
- Try smaller file size if upload fails

**Save Changes button not responding**
- **FIXED**: Improved event listener binding with better error checking
- **FIXED**: Added proper event prevention to avoid conflicts
- **FIXED**: Enhanced debugging capabilities for troubleshooting
- Open browser console (F12) and run `debugCountdownSettings()` to diagnose issues
- Test save functionality with `testSaveSettings()` in console

### Debug Tools

For developers or advanced users experiencing issues:

1. **Settings Debug**: Open browser console and run:
   ```javascript
   debugCountdownSettings()
   ```
   This will show current settings state and element availability.

2. **Test Save Function**: Run in console:
   ```javascript
   testSaveSettings()
   ```
   This will manually trigger the save settings function.

3. **Test Page**: Open `test-settings.html` for comprehensive settings testing.

### Recent Fixes (v1.2)

- **Animation**: Simplified flip card animations - removed complex sliding animations, replaced with subtle color transitions for better user experience
- **Timer Settings**: Added precise timer setting functionality with hours, minutes, and seconds input
- **Settings Modal**: Fixed saveSettings function error by improving DOM loading and event binding
- **Time Display**: Enhanced timer display to show precise time formatting (H:M:S)
- **UI**: Added dedicated timer settings section in settings modal with real-time display updates
- **Initialization**: Improved app initialization timing to ensure all DOM elements are loaded before binding events

### Previous Fixes (v1.1)

- **Critical**: Fixed infinite recursion bug in background image fallback
- **Enhancement**: Added comprehensive error handling for settings operations
- **Debug**: Added detailed console logging for troubleshooting
- **UI**: Improved event listener binding with better error detection
- **Storage**: Enhanced localStorage error handling and validation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Clone the repository
2. Open `index.html` in your browser
3. Make changes and test
4. Submit pull request

---

**Made with ❤️ for productivity enthusiasts** 