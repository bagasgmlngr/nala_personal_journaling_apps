# 📔 NALA - Personal Journal App

<div align="center">
  <img src="public/icons/icon-192x192.png" alt="NALA Logo" width="120" height="120">
  
  **Your Personal Journaling Companion**
  
  A beautiful, secure, and feature-rich digital journal built with modern web technologies.
  
  [![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)](https://supabase.com/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square)](https://web.dev/progressive-web-apps/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

  [🚀 Live Demo](https://your-nala-app.vercel.app) • [📱 Install as App](#-pwa-installation) • [📖 Documentation](#-documentation)
</div>

---

## ✨ Features

### 🔐 **Secure Authentication**
- Email/password registration and login
- Secure session management with Supabase Auth
- Protected routes and user data isolation

### 📝 **Rich Story Creation**
- Intuitive story writing interface
- Mood tracking with emoji selection (😊 Happy, 🤔 Thoughtful, etc.)
- Automatic date/time stamping
- Rich text formatting support

### 📚 **Interactive Timeline**
- Chronological story display (newest first)
- Smart content preview with "Read More/Less" functionality
- Story statistics and insights
- Search and filter capabilities

### ✏️ **Story Management**
- Edit your stories anytime with modal interface
- Delete stories with confirmation dialog
- Owner-only access with Row Level Security
- Real-time updates across sessions

### 📱 **Progressive Web App (PWA)**
- **Install on Android/iOS** like a native app
- Offline functionality for basic features
- App-like experience with custom splash screen
- Background sync and caching

### 🎨 **Modern UI/UX**
- Fully responsive design (mobile-first)
- Beautiful gradient backgrounds and animations
- Intuitive navigation with floating action buttons
- Dark/light theme support (system preference)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL, Auth, Real-time) |
| **Database** | PostgreSQL with Row Level Security |
| **Authentication** | Supabase Auth (Email/Password) |
| **Deployment** | Vercel (Frontend), Supabase (Backend) |
| **PWA** | Next-PWA, Service Workers, Web App Manifest |
| **Icons** | Lucide React |
| **State Management** | React Hooks (useState, useEffect) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Git

### 1. **Clone & Install**

```bash
# Clone the repository
git clone https://github.com/yourusername/nala-journal.git
cd nala-journal

# Install dependencies
npm install
```

### 2. **Environment Setup**

Create `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. **Database Setup**

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the following SQL script:

```sql
-- Create stories table
CREATE TABLE public.stories (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    mood TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "stories_read_own" ON public.stories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "stories_create_own" ON public.stories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stories_update_own" ON public.stories
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stories_delete_own" ON public.stories
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX stories_user_id_idx ON public.stories(user_id);
CREATE INDEX stories_created_at_idx ON public.stories(created_at DESC);
```

### 4. **Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see NALA in action! 🎉

---

## 📱 PWA Installation

### **Android (Chrome)**
1. Open NALA in Chrome browser
2. Tap the "Install" prompt that appears
3. Or use Chrome menu → "Add to Home screen"
4. Launch from home screen for native app experience

### **iOS (Safari)**
1. Open NALA in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

### **Desktop**
1. Open NALA in Chrome/Edge
2. Look for install icon in address bar
3. Click to install as desktop app

---

## 🏗 Project Structure

```
nala-journal/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with PWA meta tags
│   ├── page.tsx           # Main application component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AuthPage.tsx       # Authentication page
│   ├── TimelinePage.tsx   # Story timeline
│   ├── WriteStoryPage.tsx # Story creation
│   ├── StoryCard.tsx      # Individual story display
│   ├── EditStoryModal.tsx # Story editing modal
│   ├── Navbar.tsx         # Navigation component
│   ├── LoadingPage.tsx    # Loading state
│   └── PWAInstallPrompt.tsx # PWA install prompt
├── lib/                   # Utility libraries
│   └── supabaseClient.ts  # Supabase configuration
├── public/               # Static assets
│   ├── icons/           # PWA app icons
│   ├── manifest.json    # PWA manifest
│   └── favicon.ico      # Browser favicon
├── scripts/             # Utility scripts
│   └── generate-icons.js # PWA icon generator
└── next.config.js       # Next.js + PWA configuration
```

---

## 🎨 UI Components

### **Main Pages**
- **AuthPage**: Login/Register with validation
- **TimelinePage**: Story list with search and filters
- **WriteStoryPage**: Story creation with mood selection

### **Interactive Components**
- **StoryCard**: Expandable story preview with actions
- **EditStoryModal**: Full-screen story editing
- **PWAInstallPrompt**: Smart installation prompt

### **Navigation**
- **Navbar**: Responsive navigation with mobile menu
- **Floating Action Button**: Quick story creation on mobile

---

## 🚀 Deployment

### **Deploy to Vercel (Recommended)**

1. **Fork this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Add environment variables in Vercel dashboard

3. **Configure Environment Variables:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Deploy:**
   - Vercel will auto-deploy on every push to main branch
   - Your app will be available at `https://your-app.vercel.app`

### **Alternative Deployments**
- **Netlify**: Works out of the box with build command `npm run build`
- **Railway**: Full-stack deployment with database
- **Self-hosted**: Docker support available

---

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# PWA Testing
npm run build        # Build with service worker
npm run start        # Test PWA locally
```

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

### **Database Schema**

```sql
stories {
  id: BIGSERIAL PRIMARY KEY
  user_id: UUID (foreign key to auth.users)
  title: TEXT
  content: TEXT
  mood: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure mobile responsiveness
- Add proper error handling
- Test PWA functionality

---

## 📋 Roadmap

### **Phase 1: Core Features** ✅
- [x] User authentication
- [x] Story CRUD operations
- [x] Timeline view
- [x] PWA support

### **Phase 2: Enhanced Features** 🚧
- [ ] Rich text editor
- [ ] Photo attachments
- [ ] Export functionality
- [ ] Advanced search
- [ ] Story categories/tags

### **Phase 3: Social Features** 📋
- [ ] Story sharing
- [ ] Collaborative journals
- [ ] Community features
- [ ] Story analytics

### **Phase 4: Advanced** 🔮
- [ ] AI-powered insights
- [ ] Voice-to-text
- [ ] Multi-language support
- [ ] Desktop app (Electron)

---

## 🐛 Troubleshooting

### **Common Issues**

**❌ "Failed to fetch" errors**
- Check Supabase URL and keys in `.env.local`
- Ensure Supabase project is active
- Verify Row Level Security policies

**❌ PWA not installing**
- App must be served over HTTPS
- Check `manifest.json` is accessible
- Ensure all required icons are present

**❌ Stories not saving**
- Check browser console for errors
- Verify user is authenticated
- Test database connection in Supabase dashboard

**❌ Build errors**
- Delete `.next` folder and `npm run build` again
- Check for TypeScript errors
- Ensure all dependencies are installed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Supabase](https://supabase.com/)** - Open source Firebase alternative
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide](https://lucide.dev/)** - Beautiful, customizable icons
- **[Vercel](https://vercel.com/)** - Deployment platform

---

## 💫 Support

If you found NALA helpful, please consider:

- ⭐ **Starring** this repository
- 🐛 **Reporting issues** or suggesting features
- 💝 **Contributing** to the project
- 📢 **Sharing** with friends who love journaling

---

<div align="center">

**Built with ❤️ for journaling enthusiasts worldwide**

[🚀 Try NALA Now](https://your-nala-app.vercel.app) • [📱 Install as App](#-pwa-installation)

</div>
