# Setup Guide - The Great Sydney Quest

Complete setup instructions for developers starting work on this project.

## ⚡ Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd great-sydney-quest

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

## 📋 Prerequisites

### Required
- **Node.js:** ≥20.9.0 (check with `node --version`)
- **npm:** ≥9.0.0 (check with `npm --version`)
- **Git:** Latest version

### Recommended
- **VS Code** with extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - Pretty TypeScript Errors
  - GitLens

### Browser Requirements
- Modern browser with:
  - Geolocation API support
  - MediaDevices API support (camera)
  - localStorage support

## 🛠️ Detailed Setup

### Step 1: Node.js Installation

**macOS (using Homebrew):**
```bash
brew install node@20
```

**Windows:**
- Download from https://nodejs.org/
- Install LTS version (20.x or higher)

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Clone Repository

```bash
# Via HTTPS
git clone https://github.com/your-org/great-sydney-quest.git

# Via SSH
git clone git@github.com:your-org/great-sydney-quest.git

cd great-sydney-quest
```

### Step 3: Install Dependencies

```bash
# Install all npm packages
npm install

# This installs:
# - Next.js 16.0
# - React 19.2
# - Zustand (state management)
# - html5-qrcode (QR scanning)
# - jsPDF (PDF generation)
# - Framer Motion (animations)
# - And more...
```

### Step 4: Verify Installation

```bash
# Check if all packages installed correctly
npm list --depth=0

# Should show all dependencies without errors
```

### Step 5: Start Development Server

```bash
npm run dev

# Server will start on http://localhost:3000
# Auto-reloads on file changes
```

## 🧪 Testing Your Setup

### 1. Browser Access
- Open http://localhost:3000
- You should see the onboarding screen

### 2. Test GPS (Desktop Browser)
- Click through onboarding
- Allow location permissions
- Browser should request GPS access
- **Note:** Desktop GPS is less accurate than mobile

### 3. Test Quest List
- After GPS loads, you should see 5 quests
- They will be sorted by distance from your current location
- You'll likely see all as "locked" if not in Sydney

### 4. Mock GPS for Testing
Open browser DevTools → Console, paste:
```javascript
// Mock Sydney location (Queen Victoria Building)
if (navigator.geolocation.getCurrentPosition) {
  const mockPosition = {
    coords: {
      latitude: -33.8718,
      longitude: 151.2067,
      accuracy: 10
    }
  };
  
  navigator.geolocation.getCurrentPosition = function(success) {
    success(mockPosition);
  };
  
  navigator.geolocation.watchPosition = function(success) {
    success(mockPosition);
    return 1;
  };
}

// Reload page
location.reload();
```

## 🗂️ Project Structure Overview

```
great-sydney-quest/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── data/             # Quest data
│   ├── types/            # TypeScript types
│   ├── store/            # Zustand stores
│   └── hooks/            # Custom React hooks
├── public/               # Static files
├── README.md             # Project overview
├── DEVELOPMENT.md        # Developer guide
└── package.json          # Dependencies
```

## 🔧 Configuration Files

### tailwind.config.ts
Tailwind CSS configuration (already set up)

### tsconfig.json
TypeScript configuration with path aliases:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### next.config.ts
Next.js configuration (default settings)

## 📱 Mobile Testing Setup

### Option 1: Network Testing (Same WiFi)
```bash
# 1. Find your local IP
# macOS/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig

# 2. Start dev server
npm run dev

# 3. On mobile, visit:
http://YOUR_LOCAL_IP:3000
# Example: http://192.168.1.100:3000
```

### Option 2: ngrok (Remote Testing)
```bash
# Install ngrok
npm install -g ngrok

# Start dev server
npm run dev

# In another terminal, tunnel
ngrok http 3000

# Use the ngrok URL on any device
```

### Option 3: Vercel Preview Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Get preview URL for mobile testing
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/...'"
**Solution:**
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: GPS not working on desktop
**Solution:** Use the mock GPS code above or test on mobile device

### Issue: Camera won't open
**Solution:**
- HTTPS required for camera access
- Use `localhost` (works) or ngrok tunnel
- Check browser permissions

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🌐 Environment Setup

### Local Development
No environment variables needed! Everything works out of the box.

### Production (Future)
```bash
# Create .env.local
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX-X
```

## 📚 Next Steps

1. **Read Documentation**
   - `README.md` - Project overview
   - `DEVELOPMENT.md` - Detailed dev guide
   - Documentation in code comments

2. **Explore Codebase**
   - Start with `src/app/page.tsx`
   - Look at quest data in `src/data/quests.ts`
   - Check types in `src/types/quest.ts`

3. **Make First Change**
   - Try changing a quest title
   - Modify a color gradient
   - Add console.log to see data flow

4. **Test Features**
   - Complete a quest flow
   - Try the scanner
   - Check quest history

## 🎯 Development Workflow

### Daily Workflow
```bash
# 1. Pull latest changes
git pull

# 2. Install any new dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Make changes
# 5. Test in browser
# 6. Commit and push
git add .
git commit -m "Your message"
git push
```

### Creating a Feature
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# 3. Test thoroughly
# 4. Commit
git add .
git commit -m "feat: description"

# 5. Push and create PR
git push origin feature/your-feature-name
```

## 🚀 Ready to Code!

You're all set! The development server should be running and you should be able to:

✅ Access the app at http://localhost:3000  
✅ See the quest list  
✅ Make code changes and see them live  
✅ Test GPS functionality  
✅ Browse the codebase  

### First Task Ideas
- [ ] Add a new color gradient to a quest
- [ ] Create a new question for a location
- [ ] Modify the onboarding text
- [ ] Add your own test quest
- [ ] Customize the mascot emoji

## 💬 Need Help?

- Check `DEVELOPMENT.md` for detailed docs
- Look at code comments for explanations
- Search existing issues on GitHub
- Ask in team chat

---

**Happy Coding! 🎉**


