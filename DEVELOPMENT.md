# Development Guide - The Great Sydney Quest

This guide provides detailed information for developers working on The Great Sydney Quest project.

## 🎯 Development Workflow

### Getting Started

1. **Clone and Setup**
```bash
git clone <repository>
cd great-sydney-quest
npm install
```

2. **Environment Setup**
```bash
# No environment variables needed for local development
# All configuration is in the code
```

3. **Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

## 📁 Code Organization

### Data Layer (`src/data/`)
- **quests.ts**: Contains all 5 weeks of quest data
- Structured as Quest objects with locations, questions, rewards
- Easy to add new quests by following the pattern

### Type Definitions (`src/types/`)
- **quest.ts**: Complete TypeScript types for all data structures
- Used throughout the application for type safety
- Includes Quest, Location, Question, UserProgress, etc.

### Services (`src/lib/`)

#### GPS Service (`lib/gps/`)
- **geolocation.ts**: Wrapper around browser Geolocation API
- **distance.ts**: Haversine formula for distance calculation
- Functions: `calculateDistance()`, `isWithinRadius()`, `formatDistance()`

#### Scanner Service (`lib/scanner/`)
- **qr-scanner.ts**: QR scanning using html5-qrcode
- **validator.ts**: Validates scanned QR codes against quest rules
- Checks: GPS proximity, sequence, quest started

#### PDF Service (`lib/pdf/`)
- **generator.ts**: Creates PDF vouchers with jsPDF
- Includes QR code generation
- Unique voucher codes per device/quest

#### Storage (`lib/storage/`)
- **localStorage.ts**: Utilities for browser storage
- Functions for saving/loading user data
- Device fingerprinting for unique identification

### State Management (`src/store/`)

#### Quest Store (Zustand)
```typescript
const { 
  startQuest,
  updateProgress,
  addHint,
  completeQuest,
  getQuestProgress,
  hasCompletedQuest
} = useQuestStore();
```

**Key Actions:**
- `startQuest(questId)` - Initialize a new quest
- `updateProgress(questId, locationId)` - Move to next location
- `addHint(questId, locationId)` - Increment hint counter
- `completeQuest(questId, voucherCode)` - Mark quest as done

#### User Store
```typescript
const {
  onboardingCompleted,
  completeOnboarding,
  setGPSPermission,
  setCameraPermission
} = useUserStore();
```

### Custom Hooks (`src/hooks/`)

#### useGeolocation
```typescript
const { location, error, loading } = useGeolocation();
// location: { lat, lng } | null
// error: string | null
// loading: boolean
```

#### useQuestProgress
```typescript
const {
  progress,
  currentLocation,
  nextLocation,
  completionPercentage,
  hintsUsedAtLocation,
  totalHintsUsed
} = useQuestProgress(quest);
```

#### useQRScanner
```typescript
const {
  isScanning,
  scannedCode,
  error,
  startScanning,
  stopScanning,
  checkPermission
} = useQRScanner();
```

## 🧩 Component Architecture

### Page Components

#### Quest List (`app/page.tsx`)
- Main landing page
- Shows all quests sorted by distance
- Handles onboarding and permissions

#### Quest Detail (`app/quest/[id]/page.tsx`)
- Shows quest progress
- Displays current clue
- GPS status indicator
- Scan button (enabled when in range)

#### Scanner (`app/scanner/page.tsx`)
- QR code scanner interface
- Validates scans
- Shows errors
- Opens QuestionOverlay on success

#### History (`app/history/page.tsx`)
- Lists active and completed quests
- Shows voucher codes
- Download vouchers

### Reusable Components

#### QuestCard
```typescript
<QuestCard 
  quest={quest}
  distance={distance}
  userLocation={location}
/>
```
- Three states: Available, Nearby, Far
- Visual feedback based on distance
- Click handling for different states

#### ProgressTracker
```typescript
<ProgressTracker 
  quest={quest}
  progress={progress}
/>
```
- Visual progress bar
- Location dots (completed, current, future)
- Animated progress updates

#### QuestionOverlay
```typescript
<QuestionOverlay
  quest={quest}
  location={location}
  onComplete={() => {}}
  onClose={() => {}}
/>
```
- Shows mascot animation
- Question form
- Progressive hints
- Answer validation

## 🔧 Key Algorithms

### Distance Calculation (Haversine Formula)
```typescript
function calculateDistance(coord1, coord2): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = coord1.lat * Math.PI/180;
  const φ2 = coord2.lat * Math.PI/180;
  const Δφ = (coord2.lat - coord1.lat) * Math.PI/180;
  const Δλ = (coord2.lng - coord1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // meters
}
```

### QR Validation Flow
```typescript
1. Parse QR code format (QSQ-{WEEK}-{LOCATION}-{ID})
2. Find location in quest by QR code
3. Check GPS proximity (within 50m)
4. Check quest started (unless start location)
5. Check sequence (must be next in order)
6. Return validation result
```

### Answer Matching (Fuzzy)
```typescript
1. Normalize strings (lowercase, trim, remove punctuation)
2. Check exact match
3. Use Fuse.js for fuzzy matching (70% similarity)
4. Return true/false
```

## 🎨 Styling Guidelines

### Tailwind Classes
- Use utility-first approach
- Consistent spacing (4px increments)
- Mobile-first responsive design

### Color Palette (per Quest)
```typescript
Week 1: from-purple-500 to-pink-500
Week 2: from-green-400 to-yellow-400
Week 3: from-blue-500 to-cyan-500
Week 4: from-indigo-500 to-purple-500
Week 5: from-red-500 to-orange-500
```

### Animation
- Use Framer Motion for all animations
- Keep animations < 500ms for snappy feel
- Animate entrance/exit of modals
- Subtle hover effects on cards

## 📊 Data Flow

### User Journey
```
1. Open app → Check onboarding
2. Request permissions → GPS + Camera
3. Load location → Sort quests by distance
4. Select quest → Start quest
5. Scan QR → Validate
6. Answer question → Check answer
7. Wrong → Show hint, try again
8. Correct → Move to next location
9. Complete all → Generate voucher
10. Download PDF → Save to history
```

### State Flow
```
User Action → Component
           ↓
Store Action (Zustand)
           ↓
localStorage (persist)
           ↓
Component Re-renders
```

## 🧪 Testing Strategies

### Unit Tests (Future)
```bash
# Test distance calculations
npm run test:unit

# Test answer matching
npm run test:fuzzy

# Test QR validation
npm run test:validation
```

### Integration Tests (Future)
```bash
# Test full quest flow
npm run test:integration
```

### Manual Testing Checklist
- [ ] Onboarding flow
- [ ] Permission requests
- [ ] GPS accuracy
- [ ] Quest selection (all states)
- [ ] QR scanning
- [ ] Answer validation
- [ ] Hint progression
- [ ] Quest completion
- [ ] PDF generation
- [ ] History display
- [ ] Browser refresh (persistence)

## 🐛 Common Issues & Solutions

### GPS Not Updating
**Issue:** Location stuck or not updating
**Solution:** Check watchPosition is properly cleaning up with clearWatch

### QR Scanner Not Working
**Issue:** Camera opens but won't scan
**Solution:** Ensure html5-qrcode element ID matches, check permissions

### State Not Persisting
**Issue:** Progress lost on refresh
**Solution:** Verify Zustand persist middleware is configured correctly

### Fuzzy Matching Too Strict
**Issue:** Correct answers being marked wrong
**Solution:** Adjust Fuse.js threshold in fuzzyMatch.ts (currently 0.3)

## 📈 Performance Optimization

### Current Optimizations
- Zustand for lightweight state management
- localStorage for offline capability
- Code splitting via Next.js App Router
- Image optimization (when images added)

### Future Optimizations
- Lazy load scanner only when needed
- Service worker for offline support
- PWA manifest for installability
- Image compression and WebP

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment
```bash
# Build
npm run build

# The output is in .next/ folder
# Deploy to any Node.js hosting
```

### Environment Variables (Production)
```env
NEXT_PUBLIC_BASE_URL=https://questsydney.com
```

## 📝 Adding New Quests

1. **Add Quest Data** (`src/data/quests.ts`)
```typescript
{
  id: 'quest_w6_newquest',
  title: 'New Quest',
  // ... fill in all fields
  locations: [
    // Add 6 locations (start, 4 checkpoints, finish)
  ]
}
```

2. **Generate QR Codes**
- Use format: `QSQ-W{WEEK}-{LOCATION}-{ID}`
- Generate with qrcode library or online tool
- Print and place at locations

3. **Test**
- Mock GPS coordinates
- Test full flow
- Verify sequential validation

## 🔐 Security Considerations

### Current Security
- No server, so no server-side attacks
- Client-side validation only (can be bypassed)
- Device fingerprinting for voucher uniqueness
- localStorage is domain-specific

### Improvements (Future)
- Server-side QR validation
- Voucher redemption tracking
- Rate limiting on scans
- Fraud detection

## 📚 Resources

### Libraries Documentation
- [Next.js](https://nextjs.org/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Framer Motion](https://www.framer.com/motion/)
- [Fuse.js](https://fusejs.io/)

### Geolocation
- [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

---

**Last Updated:** October 27, 2024

