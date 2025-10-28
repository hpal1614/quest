# Deployment Guide - The Great Sydney Quest

Quick guide to deploy The Great Sydney Quest to production.

## 🚀 Quick Deploy to Vercel (Recommended)

### Why Vercel?
- Optimized for Next.js
- Automatic HTTPS
- Global CDN
- Zero configuration
- Free tier available

### Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd great-sydney-quest
vercel --prod
```

4. **Done!**
Your app is now live at: `https://your-project.vercel.app`

### Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add questsydney.com

# Configure DNS
# Add CNAME record: www -> cname.vercel-dns.com
```

---

## 🐳 Docker Deployment (Alternative)

### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build and Run

```bash
# Build image
docker build -t sydney-quest .

# Run container
docker run -p 3000:3000 sydney-quest
```

---

## 📦 Manual Deployment

### 1. Build

```bash
npm run build
```

### 2. Upload to Server

Upload the following to your server:
- `.next/` folder
- `public/` folder
- `node_modules/` folder
- `package.json`
- `next.config.ts`

### 3. Start on Server

```bash
# Install PM2 (process manager)
npm install -g pm2

# Start app
pm2 start npm --name "sydney-quest" -- start

# Save PM2 config
pm2 save
pm2 startup
```

---

## 🌐 Environment Variables

### Production Variables

Create `.env.production`:

```env
# Base URL
NEXT_PUBLIC_BASE_URL=https://questsydney.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=UA-XXXXX-X

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Setting in Vercel

```bash
# Via CLI
vercel env add NEXT_PUBLIC_BASE_URL

# Via Dashboard
# Go to Project Settings → Environment Variables
```

---

## 📱 Progressive Web App (PWA) Setup

### 1. Create `public/manifest.json`

```json
{
  "name": "The Great Sydney Quest",
  "short_name": "Sydney Quest",
  "description": "Explore Sydney through AR scavenger hunts",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#FF6B6B",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Update `app/layout.tsx`

```typescript
export const metadata = {
  manifest: '/manifest.json',
  // ... other metadata
}
```

---

## 🔐 Security Checklist

- [x] HTTPS enabled (required for camera/GPS)
- [ ] Content Security Policy configured
- [ ] Rate limiting on API endpoints (if added)
- [ ] Input sanitization
- [ ] XSS protection
- [ ] CORS properly configured

---

## 📊 Analytics Setup

### Google Analytics

```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: any) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### Track Events

```typescript
import { event } from '@/lib/analytics';

// Quest started
event({
  action: 'quest_started',
  category: 'Quest',
  label: quest.id,
});

// Quest completed
event({
  action: 'quest_completed',
  category: 'Quest',
  label: quest.id,
  value: duration,
});
```

---

## 🗺️ Physical Setup

### QR Code Generation

```bash
# Install QR generator
npm install -g qrcode-terminal

# Generate QR codes
node scripts/generate-qr-codes.js
```

### Print Specifications

- **Size:** 10cm x 10cm minimum
- **Material:** Weather-resistant vinyl
- **Coating:** UV-protected laminate
- **Mounting:** Adhesive backing

### Location Placement

1. Get permission from property owners
2. Place at exact GPS coordinates
3. At eye level (120-150cm)
4. Visible and accessible
5. Protected from weather
6. Take photos for reference

---

## 🧪 Pre-Launch Testing

### 1. Smoke Test

```bash
# Build production version
npm run build
npm start

# Test on http://localhost:3000
```

### 2. Mobile Testing

- Test on iOS Safari
- Test on Android Chrome
- Test on different screen sizes
- Test GPS accuracy
- Test camera scanning

### 3. GPS Location Testing

Visit each location and:
- [ ] Verify GPS coordinates accurate
- [ ] QR code scans correctly
- [ ] Question appears
- [ ] Answer validation works
- [ ] Next location unlocks

### 4. Load Testing

```bash
# Install autocannon
npm install -g autocannon

# Run load test
autocannon -c 100 -d 30 https://your-url.com
```

---

## 📈 Monitoring

### Vercel Analytics

Free built-in analytics:
- Page views
- Performance metrics
- Error tracking

### Error Monitoring (Optional)

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🚨 Rollback Plan

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback

```bash
# Revert git commit
git revert HEAD
git push

# Redeploy
vercel --prod
```

---

## ✅ Post-Deploy Checklist

- [ ] Homepage loads correctly
- [ ] Quest list displays
- [ ] GPS permissions work
- [ ] Camera permissions work
- [ ] QR scanning functional
- [ ] Questions display correctly
- [ ] Answers validate properly
- [ ] Hints show on wrong answers
- [ ] Progress saves
- [ ] Quest completion works
- [ ] History page works
- [ ] All 5 quests accessible
- [ ] Mobile responsive
- [ ] Performance good (< 3s load)
- [ ] No console errors
- [ ] Analytics tracking

---

## 📞 Support

### User Support

Create support channels:
- Email: support@questsydney.com
- FAQ page on website
- Live chat (optional)
- Social media

### Technical Support

- Monitor Vercel logs
- Check error tracking
- Review analytics
- User feedback

---

## 🎯 Launch Day Plan

### T-24 Hours
- [ ] Final smoke test
- [ ] All QR codes placed
- [ ] Team briefed
- [ ] Support ready

### T-1 Hour
- [ ] Deploy to production
- [ ] Verify all systems
- [ ] Test live URLs
- [ ] Monitor analytics

### Launch
- [ ] Announce on social media
- [ ] Send press release
- [ ] Monitor in real-time
- [ ] Ready for support requests

### T+1 Hour
- [ ] Check analytics
- [ ] Review errors
- [ ] Gather feedback
- [ ] Fix critical issues

---

## 🎉 You're Live!

Congratulations on launching The Great Sydney Quest!

Monitor, gather feedback, and iterate.

---

**Last Updated:** October 27, 2024


