# 🎨 Quolo - Social Media Management Platform

## Overview

Quolo is a comprehensive social media management platform that allows users to manage multiple social media accounts, schedule posts, track analytics, and customize their experience with beautiful themes.

## 🌈 Appearance & Theme System

### Features

- **11 Beautiful Themes** - From subtle cosmic themes to vibrant neon colors
- **Global Theme Application** - Themes apply across the entire application
- **Persistent Storage** - Your theme choice is saved in localStorage
- **Live Theme Switching** - Changes apply instantly without page refresh
- **Responsive Design** - All themes work perfectly on all screen sizes

### Available Themes

| Theme Name           | Description                         | Primary Color  | Best For                           |
| -------------------- | ----------------------------------- | -------------- | ---------------------------------- |
| **Dark Nebula** ⭐   | Subtle purple cosmic glow (Default) | Purple         | Professional use, easy on eyes     |
| **Cawar Orange** 🧡  | Vibrant orange energy               | Orange         | Creative workflows, energetic feel |
| **Matrix Green** 💚  | Digital matrix/hacker vibes         | Green          | Developers, coding sessions        |
| **Cyber Blue** 💙    | Futuristic blue glow                | Blue           | Tech enthusiasts, modern look      |
| **Cosmic Purple** 💜 | Deep space purple vibes             | Deep Purple    | Luxury feel, premium experience    |
| **Fire Red** ❤️      | Intense red flame energy            | Red            | Bold statements, high energy       |
| **Neon Pink** 💖     | Electric pink cyberpunk             | Pink           | Creative content, standout design  |
| **Ocean Teal** 🩵    | Deep ocean depths                   | Teal           | Calm productivity, peaceful work   |
| **Sunset Gold** 💛   | Golden hour warmth                  | Gold           | Warm atmosphere, cozy feeling      |
| **Light** ☀️         | Clean and minimal                   | Gray           | Daytime use, high contrast         |
| **Dark** 🌙          | Pure dark mode                      | White on Black | Night time, battery saving         |

### How to Change Your Theme

1. **Navigate to Settings**: Go to Dashboard → Settings
2. **Open Appearance Tab**: Click on the "Appearance" tab (🎨 icon)
3. **Choose Your Theme**: Click on any theme card to instantly apply it
4. **Preview Colors**: Each theme shows a live preview with accent colors
5. **Automatic Save**: Your choice is automatically saved to localStorage

### Technical Implementation

#### Theme Provider Setup

```tsx
// Root layout automatically includes theme provider
<ThemeProvider
  defaultTheme="nebula-dark"
  enableSystem={false}
  themes={[
    "light",
    "dark",
    "nebula-dark",
    "cawar-orange",
    "matrix-green",
    "cyber-blue",
    "cosmic-purple",
    "fire-red",
    "neon-pink",
    "ocean-teal",
    "sunset-gold",
  ]}
  storageKey="quolo-theme"
>
  {children}
</ThemeProvider>
```

#### CSS Variables System

Each theme defines comprehensive CSS variables:

```css
.nebula-dark {
  --background: 0 0% 3%;
  --foreground: 0 0% 98%;
  --primary: 264 83% 65%;
  --accent: 280 89% 60%;
  /* ... and many more */
}
```

#### Using Themes in Components

```tsx
// Automatic theme-aware styling
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Themed Button</button>
</div>
```

### Global Application Areas

The theme system applies to:

- ✅ **Landing Page** - Hero sections, navigation, floating orbs
- ✅ **Authentication** - Login & signup pages
- ✅ **Dashboard** - Main dashboard, sidebar, header
- ✅ **Settings** - All settings pages and forms
- ✅ **Components** - Cards, buttons, inputs, modals
- ✅ **Analytics** - Charts and data visualizations
- ✅ **Scheduling** - Calendar and post scheduling UI

### Storage & Persistence

- **localStorage Key**: `quolo-theme`
- **Default Theme**: `nebula-dark`
- **Persistence**: Theme choice persists across browser sessions
- **Sync**: Works across multiple tabs and windows

## 🚀 Core Features

### 📱 Social Media Management

- **Multi-Platform Support**: Instagram, YouTube, Twitter, Facebook, LinkedIn
- **Unified Dashboard**: Manage all accounts from one place
- **Real-time Sync**: Live updates from connected platforms

### 📅 Content Scheduling

- **Smart Scheduler**: Plan posts across multiple platforms
- **Bulk Upload**: Schedule multiple posts at once
- **Optimal Timing**: AI-suggested best posting times
- **Preview Mode**: See exactly how posts will look

### 📊 Analytics & Insights

- **Comprehensive Metrics**: Followers, engagement, reach, growth
- **Visual Charts**: Beautiful data visualizations
- **Performance Tracking**: Monitor post performance over time
- **Export Reports**: Download analytics in multiple formats

### 🔐 Security & Privacy

- **Secure Authentication**: JWT-based secure login system
- **Data Encryption**: All sensitive data is encrypted
- **Privacy First**: No unnecessary data collection
- **Secure API**: All API endpoints are protected

## 🛠 Technical Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **next-themes** - Theme management system
- **Lucide Icons** - Beautiful icon library

### Backend & Services

- **Authentication**: JWT-based auth system
- **API Integration**: Instagram Basic Display API
- **Storage**: LocalStorage for client-side data
- **Analytics**: Custom analytics tracking

### Theme System Architecture

- **CSS Variables**: HSL color system for smooth transitions
- **Component Integration**: Seamless theme application
- **State Management**: React Context + localStorage
- **Performance**: Zero runtime overhead for theme switching

## 📖 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd social-media-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=your_instagram_client_id
```

### First Time Setup

1. **Register Account**: Create your Quolo account
2. **Connect Platforms**: Link your social media accounts
3. **Choose Theme**: Pick your favorite theme in Settings
4. **Start Managing**: Begin scheduling and analyzing your content

## 🎯 Feature Roadmap

### Upcoming Features

- [ ] **More Themes**: Additional color schemes and styles
- [ ] **Custom Themes**: User-created custom color palettes
- [ ] **Dark/Light Mode Toggle**: Quick theme switching
- [ ] **Theme Presets**: Predefined theme combinations
- [ ] **Accessibility Themes**: High contrast and colorblind-friendly options

### Platform Expansions

- [ ] **TikTok Integration**: Native TikTok support
- [ ] **Pinterest Support**: Pin scheduling and analytics
- [ ] **Snapchat Business**: Snapchat Ads management
- [ ] **WhatsApp Business**: WhatsApp messaging automation

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-theme`
3. **Make your changes**: Follow our coding standards
4. **Test thoroughly**: Ensure all themes work correctly
5. **Submit a pull request**: Describe your changes clearly

### Theme Development Guidelines

- Use HSL color values for better theme compatibility
- Test with all existing themes to ensure no conflicts
- Follow accessibility guidelines (WCAG 2.1)
- Ensure proper contrast ratios for all text

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Need help? We're here for you:

- **Documentation**: Check our [docs](docs/) folder
- **Issues**: Report bugs on [GitHub Issues](issues/)
- **Discussions**: Join our [GitHub Discussions](discussions/)
- **Email**: support@quolo.com

## 🔗 Links

- **Website**: [quolo.com](https://quolo.com)
- **Demo**: [demo.quolo.com](https://demo.quolo.com)
- **Documentation**: [docs.quolo.com](https://docs.quolo.com)
- **Blog**: [blog.quolo.com](https://blog.quolo.com)

---

**Built with ❤️ by the Quolo Team**

_Making social media management beautiful, one theme at a time._ 🎨✨
