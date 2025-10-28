# The Great Sydney Quest

A web-based AR scavenger hunt application running across 5 weeks in Sydney with sequential location-based challenges. Users scan physical QR codes at locations, answer questions, and receive downloadable PDF vouchers upon completion.

## 🎯 Features

- **5 Weekly Quests** - New quest each week across different Sydney locations
- **GPS-Based Validation** - 50m radius checking for location verification
- **Sequential Progression** - Must complete locations in order
- **Progressive Hints** - 3-level hint system for wrong answers
- **PDF Voucher Rewards** - Downloadable certificates with unique QR codes
- **Local Storage** - Progress saved in browser, no accounts needed
- **Mobile-First Design** - Optimized for smartphones and tablets

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Storage:** localStorage
- **QR Scanner:** html5-qrcode
- **PDF Generation:** jsPDF + qrcode
- **Animations:** Framer Motion
- **Utilities:** date-fns, fuse.js

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd great-sydney-quest

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Quest list (home)
│   ├── quest/[id]/        # Quest detail page
│   ├── scanner/           # QR scanner page
│   └── history/           # Quest history
├── components/
│   ├── ui/                # Reusable UI components
│   ├── quest/             # Quest-specific components
│   └── scanner/           # Scanner components
├── lib/
│   ├── gps/               # Geolocation & distance
│   ├── scanner/           # QR scanning & validation
│   ├── pdf/               # PDF voucher generation
│   ├── storage/           # localStorage utilities
│   └── utils/             # Helper functions
├── data/
│   └── quests.ts          # Quest data (5 weeks)
├── types/
│   └── quest.ts           # TypeScript type definitions
├── store/
│   ├── questStore.ts      # Quest state management
│   └── userStore.ts       # User preferences
└── hooks/
    ├── useGeolocation.ts  # GPS hook
    ├── useQuestProgress.ts # Quest progress hook
    └── useQRScanner.ts    # QR scanner hook
```

## 🗓️ Quest Schedule

### Week 1: Urban Adventure (Nov 24-30)
- Queen Victoria Building → Sydney Town Hall → Hyde Park → St Mary's Cathedral → State Library → Martin Place

### Week 2: Sensory Immersion (Dec 1-7)
- Paddy's Markets → Chinese Garden → Darling Square → Capitol Theatre → Central Station → Belmore Park

### Week 3: History Meets Modern (Dec 8-14)
- Circular Quay → MCA → The Rocks → Cadman's Cottage → Sydney Observatory → Harbour Bridge

### Week 4: Twilight Trails (Dec 15-21)
- Barangaroo Reserve → Wulugul Walk → Darling Harbour → Pyrmont Bridge → Cockle Bay → Chinese Garden

### Week 5: Holiday Quest (Dec 22-28)
- Martin Place → Town Hall → QVB → Pitt Street Mall → Hyde Park → St Mary's Cathedral

## 🔧 Key Features Explained

### GPS Validation
- Uses 50m radius for location checking
- Real-time distance updates
- Haversine formula for accurate distance calculation

### QR Code Format
```
QSQ-{WEEK}-{LOCATION}-{ID}
Example: QSQ-W1-START-001
```

### Sequential Validation
- Must scan locations in order: Start → A → B → C → D → Finish
- Cannot skip ahead
- GPS + QR validation required

### Progressive Hints
- Wrong Answer 1: Broad hint
- Wrong Answer 2: Narrower hint
- Wrong Answer 3+: Almost the answer

### Voucher Generation
- Unique code per quest/device
- One-time use QR code
- Downloadable PDF format
- Includes all rewards

## 🧪 Testing

### Test Scenarios
1. **GPS within 50m** → Should allow scan
2. **GPS >50m** → Should block with distance message
3. **Scan wrong QR** → Should show error
4. **Scan out of sequence** → Should block
5. **Wrong answer** → Should show progressive hints
6. **Complete quest** → Should generate PDF voucher
7. **Browser close/reopen** → Should resume progress

### Mock GPS Locations (for testing)
```typescript
// Queen Victoria Building (Week 1 Start)
{ lat: -33.8718, lng: 151.2067 }

// Sydney Town Hall (Week 1 Location A)
{ lat: -33.8733, lng: 151.2063 }
```

## 🔐 Security & Privacy

- **GPS:** Only used for proximity validation, no tracking
- **Storage:** All data stored locally in browser
- **Vouchers:** Device-specific, one-time use
- **No Accounts:** No email or personal data collected

## 📱 Browser Compatibility

- Chrome/Edge (recommended)
- Safari (iOS 14+)
- Firefox
- Requires camera and GPS permissions

## 🚨 Common Issues

### GPS Not Working
- Enable location services in browser settings
- Make sure you're outdoors for better accuracy
- Try refreshing the page

### Camera Not Scanning
- Enable camera permissions
- Ensure good lighting
- Hold phone steady

### Quest Won't Start
- Must be within 50m of start location
- Check GPS is enabled
- Refresh location

## 📄 License

© 2024 The Great Sydney Quest. All rights reserved.

## 👥 Credits

Developed for Engage Sydney initiative to promote tourism and exploration through gamification.

## 🔗 Links

- Documentation: See `/docs` folder
- Support: support@engagesydney.com
- Website: [coming soon]
